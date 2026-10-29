'use strict';
const bookings={olmo:{name:'Sala Olmo',date:'12 de noviembre de 2030',cancelled:false},sur:{name:'Sala Sur',date:'14 de noviembre de 2030',cancelled:false}};
let selected=null;
const dialog=document.querySelector('#cancel-dialog');
document.querySelectorAll('[data-cancel]').forEach(button=>button.addEventListener('click',()=>{
  selected=button.dataset.cancel;
  if(bookings[selected].cancelled){
    document.querySelector('#feedback-'+selected).textContent='Reserva cancelada. Sin cargos. Código de operación: '+(selected==='olmo'?'CAN-1082':'CAN-1096')+'.';
    return;
  }
  document.querySelector('#dialog-booking').textContent=bookings[selected].name+' · '+bookings[selected].date;
  dialog.showModal();
}));
document.querySelector('#dismiss-cancel').addEventListener('click',()=>dialog.close());
document.querySelector('#confirm-cancel').addEventListener('click',()=>{
  if(!selected)return;
  bookings[selected].cancelled=true;
  const button=document.querySelector('[data-cancel="'+selected+'"]');
  button.textContent='Ver operación';
  // Resultado deliberadamente ambiguo: el estado de la ficha queda desactualizado.
  document.querySelector('#feedback-'+selected).hidden=false;
  dialog.close();
});
document.querySelector('[data-reset]').addEventListener('click',()=>location.reload());
