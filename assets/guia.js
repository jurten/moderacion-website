'use strict';
document.querySelector('#print-guide').addEventListener('click',()=>window.print());
document.querySelector('#toggle-notes').addEventListener('click',event=>{
  const onlyContexts=document.body.classList.toggle('context-only');
  event.currentTarget.setAttribute('aria-pressed',String(onlyContexts));
  event.currentTarget.textContent=onlyContexts?'Volver a mostrar las notas docentes':'Mostrar solo los contextos';
});
