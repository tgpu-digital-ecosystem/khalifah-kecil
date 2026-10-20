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
console.log('Khalifah Adab static privacy and local interaction checks passed.');
