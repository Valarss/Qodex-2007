import fs from 'node:fs/promises';import path from'node:path';import{fileURLToPath}from'node:url';import{listTargets,connect}from'./cdp.mjs';
const directory=path.dirname(fileURLToPath(import.meta.url));const command=process.argv[2];const allTargets=await listTargets();const savedTarget=await fs.readFile(path.join(directory,'manager-target.json'),'utf8').then(t=>JSON.parse(t.replace(/^\uFEFF/,''))).catch(()=>null);const target=allTargets.find(t=>t.id===savedTarget?.id)||allTargets.find(t=>t.type==='page'&&t.url==='app://-/index.html');if(!target)throw Error('Codex main window is not available on port 9343');const c=await connect(target);
try{
if(command==='inspect'){await c.evaluate("document.title='Qodex 2007 管理窗'");await new Promise(r=>setTimeout(r,200));await c.send('Page.bringToFront');console.log(JSON.stringify((await c.evaluate(`({x:screenX,y:screenY,width:outerWidth,height:outerHeight,target:'${target.id}'})`)).value));}
else if(command==='enable'){await fs.writeFile(path.join(directory,'manager-target.json'),JSON.stringify({id:target.id}));await c.evaluate(`(()=>{sessionStorage.setItem('qodex-window-role','manager');localStorage.setItem('qodex-manager-enabled','true');const saved=localStorage.getItem('codex-qq-skin-mode');window.__CODEX_QQ_SKIN_STATE__?.selectSkinMode(saved==='native'?'native':'qq');window.__CODEX_QQ_SKIN_STATE__?.ensure();return true})()`);}
else if(command==='health'){let status;for(let i=0;i<40;i++){status=(await c.evaluate(`({ready:['qq','native'].includes(window.__CODEX_QQ_SKIN_STATE__?.skinMode)&&!!document.querySelector('[data-qodex-mode]'),width:innerWidth,manager:document.documentElement.dataset.qodexManager,settings:document.documentElement.dataset.qodexSettings})`)).value;if(status?.ready)break;await new Promise(r=>setTimeout(r,200));}console.log(JSON.stringify(status||{ready:false}));if(!status?.ready)throw Error('Skin switcher not ready');}
else if(command==='native'){await c.evaluate(`(()=>{sessionStorage.removeItem('qodex-window-role');localStorage.removeItem('qodex-manager-enabled');window.__CODEX_QQ_SKIN_STATE__?.selectSkinMode('native');return true})()`);}
else if(command==='watch-mode'){let previous='';const sized=new Set();const globalized=new Set();for(;;){if(await fs.stat(path.join(directory,'stop-dock')).then(()=>true,()=>false))break;let enabled=false;try{enabled=(await c.evaluate(`document.documentElement.getAttribute('data-qodex-manager')==='true'`)).value===true;}catch{break;}const state=enabled?'enabled':'disabled';if(state!==previous){await fs.writeFile(path.join(directory,'dock-control.txt'),state);previous=state;}
const chats=(await listTargets()).filter(t=>t.type==='page'&&t.id!==target.id&&t.url.startsWith('app://-/index.html')&&!t.url.includes('avatar-overlay'));
const identities=new Map();for(const chat of chats){let probe;try{probe=await connect(chat);const id=(await probe.evaluate('([...document.querySelectorAll("[data-response-annotation-conversation]")].find(n=>n.getBoundingClientRect().width>0&&getComputedStyle(n).visibility!=="hidden"))?.getAttribute("data-response-annotation-conversation")||null')).value;if(id)identities.set(chat.id,id);}catch{}finally{probe?.close();}}
const ids=[...new Set(identities.values())];
await c.evaluate(`localStorage.setItem('qodex-live-window-ids',${JSON.stringify(JSON.stringify(chats.map(t=>t.id)))})`);
for(const chat of chats){
 if(chat.url!=='app://-/index.html'||globalized.has(chat.id))continue;
 let blank;try{blank=await connect(chat);const ready=(await blank.evaluate(`(()=>{
  if(sessionStorage.getItem('qodex-global-chat-ready')==='true')return true;
  if(!document.querySelector('[data-codex-composer]'))return false;
  const picker=document.querySelector('button[aria-label="选择项目"],button[aria-label^="切换项目"]');
  if(!picker)return false;
  if(picker.getAttribute('aria-label').startsWith('切换项目')){
   document.querySelector('button[aria-label="不在项目中工作"]')?.click();return false;
  }
  sessionStorage.setItem('qodex-global-chat-ready','true');window.__CODEX_QQ_SKIN_STATE__?.ensure();return true;
 })()`)).value;if(ready)globalized.add(chat.id);}catch{}finally{blank?.close();}
}

await c.evaluate(`(()=>{const next=${JSON.stringify(ids)};if(localStorage.getItem('qodex-live-chat-ids')!==JSON.stringify(next))localStorage.setItem('qodex-live-chat-ids',JSON.stringify(next));return true})()`);
const request=(await c.evaluate(`localStorage.getItem('qodex-focus-request')`)).value;
if(request){const parsed=JSON.parse(request);const ack=(await c.evaluate(`localStorage.getItem('qodex-focus-ack')`)).value;const previousAck=ack?JSON.parse(ack):null;if(parsed.token!==previousAck?.token){const chat=chats.find(t=>identities.get(t.id)===parsed.threadId);let ok=false;if(chat){let focused;try{focused=await connect(chat);await focused.send('Page.bringToFront');ok=true;}catch{}finally{focused?.close();}}await c.evaluate(`localStorage.setItem('qodex-focus-ack',${JSON.stringify(JSON.stringify({token:parsed.token,ok}))})`);}}
await new Promise(r=>setTimeout(r,600));}await fs.writeFile(path.join(directory,'dock-control.txt'),'disabled');}
else throw Error('Unknown runtime command');
}finally{c.close();}

