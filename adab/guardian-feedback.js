(()=>{'use strict';
const $=id=>document.getElementById(id);
const panel=$('guardian-feedback'),gate=$('guardian-confirm'),type=$('guardian-topic'),status=$('guardian-status'),summary=$('guardian-summary'),copy=$('guardian-copy');
const issues={navigation:'Navigasi atau paparan sukar digunakan',instructions:'Arahan atau aktiviti kurang jelas',accessibility:'Masalah kebolehcapaian',other:'Cadangan penambahbaikan umum'};
const message=()=>['Maklum balas ibu bapa/guru — pratonton Khalifah Kecil','Kategori: '+issues[type.value],'Tiada maklumat peribadi kanak-kanak disertakan.'].join('\n');
const update=()=>{const allowed=gate.checked&&Object.hasOwn(issues,type.value);copy.disabled=!allowed;summary.value=allowed?message():'';status.textContent='';};
gate.addEventListener('change',update);type.addEventListener('change',update);
copy.addEventListener('click',async()=>{
 if(copy.disabled)return;
 const value=message();
 try{
  if(!navigator.clipboard?.writeText)throw Error('unavailable');
  await navigator.clipboard.writeText(value);
  status.textContent='Ringkasan disalin. Penjaga boleh memilih sendiri sama ada mahu berkongsinya. Tiada data dihantar oleh halaman ini.';
 }catch{
  summary.focus();summary.select();
  status.textContent='Salin ringkasan secara manual. Tiada data dihantar oleh halaman ini.';
 }
});
update();
})();