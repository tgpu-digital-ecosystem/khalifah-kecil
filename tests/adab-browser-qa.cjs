'use strict';
const {chromium}=require('playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve('adab');
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8'};
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}
  try{const body=fs.readFileSync(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'text/plain'});res.end(body)}
  catch{res.writeHead(404);res.end('Not found')}
});
async function main(){
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [390,768,1440]){
   const page=await browser.newPage({viewport:{width,height:850},reducedMotion:'reduce'});
   const errors=[],requests=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:'))requests.push(r.url())});
   await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'networkidle'});
   assert.equal(await page.locator('html').getAttribute('lang'),'ms');
   assert.equal(await page.locator('#guardian-copy').isDisabled(),true);
   await page.locator('#guardian-confirm').check();
   assert.equal(await page.locator('#guardian-copy').isEnabled(),true);
   await page.locator('#guardian-topic').selectOption('accessibility');
   assert.match(await page.locator('#guardian-summary').inputValue(),/kebolehcapaian/);
   await page.locator('#topic').selectOption('2');
   assert.match(await page.locator('#prompt').innerText(),/bekerjasama/);
   await page.locator('#new-prompt').click();
   assert.match(await page.locator('#prompt').innerText(),/rakan/);
   await page.locator('#reflection').fill('Latihan ringkas keluarga');
   await page.locator('#save').click();
   await page.reload();
   assert.equal(await page.locator('#reflection').inputValue(),'Latihan ringkas keluarga');
   page.once('dialog',d=>d.accept());
   await page.locator('#clear').click();
   assert.equal(await page.locator('#reflection').inputValue(),'');
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
   assert.equal(overflow,false,'horizontal overflow at '+width);
   assert.deepEqual(requests,[],'unexpected external requests at '+width);
   assert.deepEqual(errors,[],'runtime errors at '+width);
   for(const selector of ['#topic','#new-prompt','#reflection','#save','#clear','#guardian-confirm','#guardian-topic','#guardian-copy']){
     assert.equal(await page.locator(selector).count(),1);
   }
   await page.close();
   console.log('Adab Chromium '+width+'px: passed');
  }
 }finally{await browser.close()}
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());
