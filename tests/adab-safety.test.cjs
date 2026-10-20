'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('adab/index.html', 'utf8');
const script = fs.readFileSync('adab/studio.js', 'utf8');
assert.match(html, /<html lang="ms">/);
assert.match(html, /name="robots" content="noindex,nofollow"/);
for (const id of ['topic','prompt','new-prompt','reset','reflection','save','clear','status']) {
  assert.match(html, new RegExp('id="'+id+'"'));
}
for (const forbidden of [/<form\b/i, /<input[^>]*type="file"/i, /<audio\b/i, /<video\b/i, /<iframe\b/i, /<script[^>]+src="https?:/i]) assert.doesNotMatch(html, forbidden);
for (const forbidden of [/\bfetch\s*\(/, /XMLHttpRequest/, /WebSocket/, /getUserMedia/, /MediaRecorder/, /sendBeacon/, /innerHTML\s*=/]) assert.doesNotMatch(script, forbidden);
function fixture(storageBroken=false) {
  const ids=['topic','prompt','new-prompt','reset','reflection','save','clear','status'];
  const nodes=Object.fromEntries(ids.map(id=>[id,{value:'',textContent:'',onchange:null,onclick:null}]));
  nodes.topic.value='0'; const memory=new Map();
  const localStorage={getItem:k=>{if(storageBroken)throw Error('blocked');return memory.get(k)||null},
    setItem:(k,v)=>{if(storageBroken)throw Error('blocked');memory.set(k,v)},
    removeItem:k=>{if(storageBroken)throw Error('blocked');memory.delete(k)}};
  const context={document:{getElementById:id=>nodes[id]},localStorage,confirm:()=>true};
  vm.runInNewContext(script,context,{timeout:1000});
  return {nodes,memory};
}
const {nodes,memory}=fixture();
assert.match(nodes.prompt.textContent,/mendengar/);
nodes['new-prompt'].onclick();assert.match(nodes.prompt.textContent,/rakan/);
nodes.topic.value='1';nodes.topic.onchange();assert.match(nodes.prompt.textContent,/bantuan/);
nodes.reflection.value='<img src=x onerror=alert(1)> private';nodes.save.onclick();
assert.equal([...memory.values()][0],nodes.reflection.value);
assert.match(nodes.status.textContent,/disimpan/);
nodes.reflection.value='';nodes.clear.onclick();
assert.equal(memory.size,0);assert.equal(nodes.reflection.value,'');
const blocked=fixture(true);blocked.nodes.reflection.value='test';blocked.nodes.save.onclick();
assert.match(blocked.nodes.status.textContent,/Tidak dapat simpan/);

const guardianScript=fs.readFileSync('adab/guardian-feedback.js','utf8');
for(const id of ['guardian-feedback','guardian-confirm','guardian-topic','guardian-summary','guardian-copy','guardian-status']) assert.match(html,new RegExp('id="'+id+'"'));
for(const forbidden of ['fetch(', 'XMLHttpRequest', 'WebSocket', 'sendBeacon', 'localStorage', 'sessionStorage', 'mailto:', 'window.open']) assert.equal(guardianScript.includes(forbidden),false);
const listeners={};
const guardianNodes=Object.fromEntries(['guardian-feedback','guardian-confirm','guardian-topic','guardian-summary','guardian-copy','guardian-status'].map(id=>[id,{value:'',checked:false,disabled:true,textContent:'',addEventListener:(type,cb)=>{listeners[id+type]=cb},focus(){},select(){}}]));
guardianNodes['guardian-topic'].value='instructions';
let copied='';
const guardianCtx={document:{getElementById:id=>guardianNodes[id]},navigator:{clipboard:{writeText:async v=>{copied=v}}},Object,console};
vm.runInNewContext(guardianScript,guardianCtx,{timeout:1000});
assert.equal(guardianNodes['guardian-copy'].disabled,true);
guardianNodes['guardian-confirm'].checked=true;listeners['guardian-confirmchange']();
assert.equal(guardianNodes['guardian-copy'].disabled,false);
assert.match(guardianNodes['guardian-summary'].value,/Arahan atau aktiviti/);
(async()=>{await listeners['guardian-copyclick']();assert.match(copied,/Maklum balas ibu bapa/);assert.doesNotMatch(copied,/nama penuh|nombor telefon|alamat/);console.log('Guardian copy-only feedback checks passed.')})().catch(e=>{console.error(e);process.exitCode=1});

console.log('Khalifah Adab static privacy and local interaction checks passed.');
