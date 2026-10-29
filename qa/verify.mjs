// Verifica estructura y lógica con un adaptador DOM mínimo; no sustituye una prueba visual en navegador.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const pages=['index.html','casos/compra.html','casos/acceso.html','casos/reserva.html','materiales/guia-docente.html'];
let checks=0;
function check(condition,message){assert.ok(condition,message);checks++;}
for(const page of pages){
  const html=read(page);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  check(ids.length===new Set(ids).size,`${page}: IDs únicos`);
  check(html.includes('lang="es-AR"') && html.includes('name="viewport"'),`${page}: idioma y viewport`);
  for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
    const ref=match[1];
    if(ref.startsWith('#')){check(ids.includes(ref.slice(1)),`${page}: ancla ${ref}`);continue;}
    check(!/^(https?:)?\/\//.test(ref),`${page}: sin dependencias de red`);
    check(fs.existsSync(path.resolve(root,path.dirname(page),ref)),`${page}: recurso ${ref}`);
  }
}
class Element{
  constructor(attrs={}){this.attrs=attrs;this.dataset={};this.hidden='hidden' in attrs;this.textContent='';this.innerHTML='';this.listeners={};this.value='';this.fields={};this.open=false;this.focused=false;
    for(const [key,value] of Object.entries(attrs))if(key.startsWith('data-'))this.dataset[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=value;
  }
  addEventListener(type,handler){(this.listeners[type]??=[]).push(handler);}
  fire(type='click',extra={}){const event={target:this,currentTarget:this,preventDefault(){},...extra};for(const handler of this.listeners[type]??[])handler(event);}
  closest(selector){return selector==='[data-add]' && this.dataset.add?this:selector==='[data-change]' && this.dataset.change?this:null;}
  setAttribute(key,value){this.attrs[key]=value;}
  reset(){this.fields={};this.wasReset=true;}
  focus(){this.focused=true;}
  showModal(){this.open=true;}
  close(){this.open=false;}
  click(){this.fire();}
}
function load(page,script){
  const html=read(page),elements=[];
  for(const tag of html.matchAll(/<[a-z][^>]*>/gi)){
    const attrs={};for(const attr of tag[0].matchAll(/([\w-]+)="([^"]*)"/g))attrs[attr[1]]=attr[2];
    if(/\shidden(?:\s|>)/.test(tag[0]))attrs.hidden='';elements.push(new Element(attrs));
    if(/\sdata-reset(?:\s|>)/.test(tag[0]))elements.at(-1).attrs['data-reset']='';
  }
  function matches(el,selector){if(selector.startsWith('#'))return el.attrs.id===selector.slice(1);const match=selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);return !!match && match[1] in el.attrs && (match[2]===undefined || el.attrs[match[1]]===match[2]);}
  const document=new Element();
  document.querySelector=selector=>{const result=elements.find(el=>matches(el,selector));assert.ok(result,`Selector existente: ${selector}`);return result;};
  document.querySelectorAll=selector=>elements.filter(el=>matches(el,selector));
  document.createElement=()=>new Element();
  const context=vm.createContext({document,FormData:class{constructor(form){this.data=form.fields;}get(key){return this.data[key]??'';}},window:{scrollTo(){}},location:{reload(){context.reloaded=true;}},setTimeout:fn=>fn(),Blob,URL});
  vm.runInContext(read(script),context,{filename:script});
  return {document,context,$:selector=>document.querySelector(selector),run:code=>vm.runInContext(code,context)};
}
{
  const {document,$,run}=load('casos/compra.html','assets/compra.js');
  function add(id){document.fire('click',{target:new Element({'data-add':id})});}
  add('cuaderno');add('cuaderno');add('lapicera');
  check($('#count').textContent===3 && run('total()')===10200,'Compra: cantidades y total de la consigna');
  $('#checkout-button').fire();
  check(!$('#checkout').hidden && $('#payment-title').focused,'Compra: acceso al pago');
  const form=$('#payment-form');form.fields={holder:'Alex Díaz',card:'4242 4242 4242 4242',expiry:'12/30',cvv:'123'};form.fire('submit');
  check(!$('#payment-error').hidden && $('#purchase-result').hidden,'Compra: fricción deliberada del formato');
  form.fields.card='4242424242424242';form.fire('submit');
  check(!$('#purchase-result').hidden && $('#paid-total').textContent==='$ 10.200','Compra: confirmación y total');
  check($('#purchase-items').innerHTML.includes('2 × Cuaderno A5') && $('#purchase-items').innerHTML.includes('1 × Lapicera negra'),'Compra: productos correctos');
}
{
  const {$}=load('casos/compra.html','assets/compra.js');
  $('#empty-cart').fire();check($('#cart-summary').hidden && $('#checkout').hidden,'Compra: vacío sin pago disponible');
}
{
  const {$,context}=load('casos/acceso.html','assets/acceso.js');
  const form=$('#login-form');form.fields={user:'alex@ejemplo.test',password:'incorrecta'};form.fire('submit');
  check(!$('#login-error').hidden && form.wasReset,'Acceso: error deliberado borra datos');
  form.fields={user:'alex@ejemplo.test',password:'Taller2026!'};form.fire('submit');
  check(!$('#account-screen').hidden && $('#access-screen').hidden,'Acceso: credenciales del contexto');
  $('#view-receipt').fire();check(!$('#receipt-detail').hidden,'Acceso: comprobante visible');
  $('#download-receipt').fire();check(true,'Acceso: genera comprobante descargable sin red');
  $('[data-reset]').fire();check(context.reloaded,'Acceso: reinicio');
}
{
  const {$}=load('casos/acceso.html','assets/acceso.js');
  $('#recovery-toggle').fire();check(!$('#recovery').hidden,'Recuperación: se abre');
  $('#recovery-form').fields={email:'alex@ejemplo.test'};$('#recovery-form').fire('submit');
  check($('#recovery-result').textContent.includes('Acceso2026!'),'Recuperación: muestra clave ficticia');
  $('#login-form').fields={user:'alex@ejemplo.test',password:'Acceso2026!'};$('#login-form').fire('submit');
  check(!$('#account-screen').hidden,'Recuperación: clave temporal permite acceder');
}
{
  const {$,run,context}=load('casos/reserva.html','assets/reserva.js');
  $('[data-cancel="olmo"]').fire();check($('#cancel-dialog').open,'Reserva: diálogo accesible');
  $('#dismiss-cancel').fire();check(!$('#cancel-dialog').open && !run('bookings.olmo.cancelled'),'Reserva: Cancelar conserva reserva');
  $('[data-cancel="olmo"]').fire();$('#confirm-cancel').fire();
  check(run('bookings.olmo.cancelled') && !run('bookings.sur.cancelled'),'Reserva: cancela solo Sala Olmo');
  check(!$('#feedback-olmo').hidden && $('[data-cancel="olmo"]').textContent==='Ver operación','Reserva: feedback deliberadamente débil');
  $('[data-cancel="olmo"]').fire();
  check($('#feedback-olmo').textContent.includes('CAN-1082') && !$('#cancel-dialog').open,'Reserva: evidencia explícita de cancelación');
  $('[data-reset]').fire();check(context.reloaded,'Reserva: reinicio');
}
console.log(`${checks} comprobaciones de estructura y lógica correctas. Sin verificación visual en navegador.`);
