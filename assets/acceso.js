'use strict';
let currentPassword='Taller2026!';
document.querySelector('#login-form').addEventListener('submit',event=>{
  event.preventDefault();
  const data=new FormData(event.currentTarget);
  const valid=String(data.get('user')).trim().toLowerCase()==='alex@ejemplo.test' && data.get('password')===currentPassword;
  document.querySelector('#login-error').hidden=valid;
  if(!valid){event.currentTarget.reset();return;} // Pérdida deliberada de los datos al fallar.
  document.querySelector('#access-screen').hidden=true;
  document.querySelector('#account-screen').hidden=false;
  window.scrollTo(0,0);
});
document.querySelector('#recovery-toggle').addEventListener('click',event=>{
  const section=document.querySelector('#recovery');section.hidden=!section.hidden;
  event.currentTarget.setAttribute('aria-expanded',String(!section.hidden));
});
document.querySelector('#recovery-form').addEventListener('submit',event=>{
  event.preventDefault();
  const valid=String(new FormData(event.currentTarget).get('email')).trim().toLowerCase()==='alex@ejemplo.test';
  const result=document.querySelector('#recovery-result');
  result.hidden=false;
  if(valid){currentPassword='Acceso2026!';result.textContent='Mensaje simulado para alex@ejemplo.test: tu clave temporal es Acceso2026! Podés usarla en Mi cuenta. No se envió ningún email.';}
  else{result.textContent='No encontramos esa cuenta.';}
});
document.querySelector('#view-receipt').addEventListener('click',()=>document.querySelector('#receipt-detail').hidden=false);
document.querySelector('#download-receipt').addEventListener('click',()=>{
  const content='COMPROBANTE FICTICIO · SIN VALIDEZ FISCAL\nCA-2048\nAlex Díaz\nCurso: Diseño de servicios\nImporte: ARS 28.000\nEstado: Pagado\n';
  const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='comprobante-ficticio-CA-2048.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
document.querySelector('[data-reset]').addEventListener('click',()=>location.reload());
