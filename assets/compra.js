'use strict';
const catalog = {cuaderno:{name:'Cuaderno A5',price:4500},lapicera:{name:'Lapicera negra',price:1200},carpeta:{name:'Carpeta oficio',price:2800}};
const cart = {cuaderno:0,lapicera:0,carpeta:0};
const money = value => '$ ' + value.toLocaleString('es-AR');
const total = () => Object.keys(cart).reduce((sum,id)=>sum+cart[id]*catalog[id].price,0);
function renderCart(){
  const count = Object.values(cart).reduce((a,b)=>a+b,0);
  document.querySelector('#count').textContent=count;
  document.querySelector('#empty').hidden=count>0;
  document.querySelector('#cart-summary').hidden=count===0;
  document.querySelector('#cart-lines').innerHTML=Object.keys(cart).filter(id=>cart[id]>0).map(id=>`<div class="cart-line"><span>${catalog[id].name}</span><div class="quantity"><button data-change="${id}" data-delta="-1" aria-label="Quitar una unidad de ${catalog[id].name}">−</button><span>${cart[id]}</span><button data-change="${id}" data-delta="1" aria-label="Agregar una unidad de ${catalog[id].name}">+</button></div><strong>${money(cart[id]*catalog[id].price)}</strong></div>`).join('');
  document.querySelector('#total').textContent=money(total());
  document.querySelector('#payment-total').textContent=money(total());
  if(!count) document.querySelector('#checkout').hidden=true;
}
document.addEventListener('click',event=>{
  const add=event.target.closest('[data-add]');
  if(add){cart[add.dataset.add]++;renderCart();}
  const change=event.target.closest('[data-change]');
  if(change){const id=change.dataset.change;cart[id]=Math.max(0,cart[id]+Number(change.dataset.delta));renderCart();}
});
document.querySelector('#empty-cart').addEventListener('click',()=>{Object.keys(cart).forEach(id=>cart[id]=0);renderCart();});
document.querySelector('#checkout-button').addEventListener('click',()=>{document.querySelector('#checkout').hidden=false;document.querySelector('#payment-title').focus();});
document.querySelector('#payment-form').addEventListener('submit',event=>{
  event.preventDefault();
  const data=new FormData(event.currentTarget);
  // Error didáctico deliberado: el placeholder usa espacios, pero la validación los rechaza.
  const valid=String(data.get('holder')).trim().length>2 && data.get('card')==='4242424242424242' && data.get('expiry')==='12/30' && data.get('cvv')==='123' && total()>0;
  document.querySelector('#payment-error').hidden=valid;
  if(!valid)return;
  document.querySelector('#shop').hidden=true;
  document.querySelector('#purchase-result').hidden=false;
  document.querySelector('#paid-total').textContent=money(total());
  document.querySelector('#purchase-items').innerHTML=Object.keys(cart).filter(id=>cart[id]).map(id=>`<p>${cart[id]} × ${catalog[id].name}</p>`).join('');
  window.scrollTo(0,0);
});
document.querySelector('[data-reset]').addEventListener('click',()=>location.reload());
renderCart();
