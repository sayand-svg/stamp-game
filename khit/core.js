/* core.js — เว็บเดียวของชุด "ภาษาแสดงความคิด" ม.๖ (ท33102) ทั้ง ๖ คาบ
   ใช้ Firebase Realtime Database โปรเจกต์เดียวกับ stamp-game แต่เก็บข้อมูลไว้ใต้ khit/ แยกจากเกมเดิม
   ครู  : index.html?t แล้วเข้าระบบ Google เลือกห้องและคาบ (สิทธิ์ควบคุมกำหนดในกฎ Firebase)
   กลุ่ม : สแกน QR ครั้งเดียว (index.html?r=รหัสห้อง) เลือกเลขกลุ่ม แล้วหน้าจอจะเปลี่ยนตามคาบที่ครูเปิด
   แต่ละคาบเป็นไฟล์ p1.js … p6.js ที่เรียก K.period({...}) */
(function(){
'use strict';
const FB = {
  apiKey: "AIzaSyCoZj8vyGCrxp4we4emby0siAvyk3h5yOs",
  authDomain: "stamp-game-df7c3.firebaseapp.com",
  databaseURL: "https://stamp-game-df7c3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "stamp-game-df7c3",
  storageBucket: "stamp-game-df7c3.firebasestorage.app",
  messagingSenderId: "125175461308",
  appId: "1:125175461308:web:89e593fdc86cb0208de7b9"
};
const STAMPS = [1,3,5,7,10];
const ROOMS = ['601','602','603','604','605','606','607','608','609','610'];

/* ---------- helpers ---------- */
const $ = (s,r=document)=>r.querySelector(s);
const esc = (s)=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TH = '๐๑๒๓๔๕๖๗๘๙';
const th = (n)=>String(n).replace(/\d/g,d=>TH[d]);
const lsGet = (k)=>{ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } };
const lsSet = (k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };
const cleanRoom = (s)=>String(s||'').toLowerCase().replace(/[^a-z0-9-]/g,'').slice(0,20);
const rid = ()=>(Math.random().toString(36).slice(2)+'0000000').slice(0,7);
const clone = (o)=>JSON.parse(JSON.stringify(o));
const qs = new URLSearchParams(location.search);
const role = qs.has('t') ? 'teacher' : 'group';
const devId = (()=>{ let d=null; try{ d=sessionStorage.getItem('khit.dev'); }catch(e){}
  if(!d || !/^[a-z0-9]{8}$/.test(d)){ d=(Math.random().toString(36).slice(2)+'00000000').slice(0,8); try{ sessionStorage.setItem('khit.dev',d); }catch(e){} } return d; })();

/* ---------- state ---------- */
const fresh = (groups)=>({v:1, rev:0, gid:rid(), groups:groups||6, step:0, reveal:{}, stamps:{}, ok:{}, pay:{}, bonus:[], snap:{}, data:{}});
let APP = {title:'ภาษาแสดงความคิด', periods:[]};   // planned periods (from index.html)
const PERIODS = {};                                  // periods whose module is loaded
let P = null;                                        // current period config (null = หน้ารวม)
let S = fresh(6);
let fdb=null, auth=null, user=null, fbOk=false, connected=false, serverOffset=0, authErr='', authReady=false, writeErr='';
let roomId=null, nowPer=null, roomOffs=[], perOffs=[], base=null, stateRef=null, ansRef=null, onlineRef=null;
let ansData={}, onlineData={}, haveState=false, localOnly=false, unitStates={};
let myGroup=null, sent={}, drafts={}, lastEarn=null;
let sheet=null, toastT=0, qrCache={};
const watches={}; const live={};

/* Realtime Database turns maps with number-like keys into arrays (with null holes) and drops empty maps.
   objify() turns every array back into a plain map so state reads the same before and after a round trip. */
function objify(x){
  if(Array.isArray(x)){ const o={}; x.forEach((v,i)=>{ if(v!==null && v!==undefined) o[i]=objify(v); }); return o; }
  if(x && typeof x==='object'){ const o={}; Object.keys(x).forEach(k=>{ if(x[k]!==null && x[k]!==undefined) o[k]=objify(x[k]); }); return o; }
  return x;
}
function normState(d){
  if(!d || typeof d!=='object') return null;
  const bonus=d.bonus; const s=objify(d);
  s.bonus = Array.isArray(bonus) ? bonus.filter(Boolean) : (bonus && typeof bonus==='object' ? Object.values(bonus).filter(Boolean) : []);
  return s;
}
function ensure(){
  S = normState(S) || fresh(6);
  const d=fresh(S.groups||6);
  Object.keys(d).forEach(k=>{ if(k!=='gid' && (S[k]===undefined || S[k]===null)) S[k]=d[k]; });
  ['reveal','stamps','ok','pay','snap','data'].forEach(k=>{ if(!S[k] || typeof S[k]!=='object') S[k]={}; });
  if(!S.gid) S.gid=rid();
  S.groups = Math.max(2, Math.min(8, S.groups|0 || 6));
  S.step = Math.max(0, Math.min((P?P.steps.length:1)-1, S.step|0));
}
const tkey = ()=>'khit.T.'+(P?P.per:'-')+'.'+(localOnly?'local':roomId);
const gkey = (what)=>'khit.'+what+'.'+(P?P.per:'-')+'.'+roomId;
const groupKey = ()=>'khit.group.'+roomId;
const groupsList = ()=>Array.from({length:S.groups||6},(_,i)=>i+1);
const step = ()=>P ? (P.steps[S.step] || P.steps[0]) : null;
const stepKey = ()=>{ const s=step(); return s?s.k:null; };
const now = ()=>Date.now()+serverOffset;
const perIndex = (id)=>APP.periods.findIndex(p=>p.id===id);
const perLabel = (id)=>{ const i=perIndex(id); return i<0 ? '' : 'คาบ '+th(i+1); };

function push(){
  if(role!=='teacher' || !P) return;
  S.rev=(S.rev||0)+1; lsSet(tkey(),S);
  if(stateRef && !localOnly){
    stateRef.set(clone(S)).then(()=>{ if(writeErr){ writeErr=''; render(); } }).catch(e=>{ writeErr=errText(e); render(); });
  }
}
function errText(e){ return (e && /permission/i.test(String(e.code||e.message))) ? 'บัญชีนี้ไม่มีสิทธิ์ควบคุมห้องเรียน ตรวจว่าเข้าระบบด้วยบัญชีครูที่ตั้งไว้ในกฎ Firebase' : 'บันทึกขึ้นระบบไม่สำเร็จ ตรวจอินเทอร์เน็ต'; }
function update(fn){ if(!P) return; fn(S); push(); render(); }

/* answers */
function parseV(x){ if(!x || typeof x.v!=='string') return undefined; try{ return JSON.parse(x.v); }catch(e){ return undefined; } }
function answers(key){ const out={}; groupsList().forEach(g=>{ const a=ansData[g] && ansData[g][key]; const v=parseV(a); if(v!==undefined) out[g]=v; }); return out; }
function send(key,val){
  if(!myGroup || !P) return;
  sent[key]=val; lsSet(gkey('sent'),{gid:S.gid, data:sent});
  if(ansRef){
    ansRef.child(String(myGroup)).child(key).set({v:JSON.stringify(val), t:firebase.database.ServerValue.TIMESTAMP})
      .catch(()=>toast('ส่งคำตอบไม่สำเร็จ ลองแตะอีกครั้ง'));
  }
  render();
}

/* stamps */
function earnedIn(st, g, steps){
  const out=[]; if(!st) return out;
  const keys = steps ? steps.map(x=>x.k) : Array.from(new Set(Object.keys(st.ok||{}).concat(Object.keys(st.pay||{}))));
  keys.forEach(k=>{
    if(st.ok && st.ok[k] && st.ok[k][g]===true && st.stamps && st.stamps[k]) out.push(st.stamps[k]);
    if(st.pay && st.pay[k] && st.pay[k][g]) out.push(st.pay[k][g]);
  });
  (st.bonus||[]).forEach(b=>{ if(b && String(b.g)===String(g) && STAMPS.includes(b.v)) out.push(b.v); });
  return out;
}
const sum = (a)=>a.reduce((x,y)=>x+y,0);
const earned = (g)=>P ? earnedIn(S, g, P.steps) : [];
const total = (g)=>sum(earned(g));
function perState(id){ return (P && P.per===id && (role==='teacher' || haveState)) ? S : unitStates[id]; }
function perTotal(id, g){ const st=perState(id); return sum(earnedIn(st, g, PERIODS[id] ? PERIODS[id].steps : null)); }
function unitTotal(g){ return sum(APP.periods.map(p=>perTotal(p.id, g))); }
function payout(table, score){ for(const [min,v] of table){ if(score>=min) return v; } return 0; }
const stampImg = (v,cls='stampimg')=>(window.STAMP_IMG && window.STAMP_IMG[v]) ? `<img class="${cls}" src="${window.STAMP_IMG[v]}" alt="แสตมป์ ${v} คะแนน">` : `<b class="chip">${v}</b>`;

/* ---------- live extra paths (e.g. chat board) ---------- */
function syncWatches(){
  Object.keys(watches).forEach(name=>{
    const w=watches[name]; let want=false;
    try{ want=!!(fdb && roomId && !localOnly && P && w.when()); }catch(e){ want=false; }
    if(want && !w.off){
      const ref=fdb.ref('khit/'+roomId+'/'+w.path); const cb=s=>{ live[name]=s.val()||{}; render(); };
      ref.on('value',cb,()=>{}); w.off=()=>ref.off('value',cb); w.room=roomId;
    } else if((!want || w.room!==roomId) && w.off){ w.off(); w.off=null; live[name]=null; }
  });
}

/* ---------- Firebase wiring ---------- */
function listenTo(list, ref, cb){ ref.on('value', cb, ()=>{}); list.push(()=>ref.off('value', cb)); }
function offAll(list){ list.forEach(f=>{ try{ f(); }catch(e){} }); list.length=0; }
function markOnline(){ if(!onlineRef || !myGroup) return; const r=onlineRef.child(String(myGroup)).child(devId); r.set(true).catch(()=>{}); try{ r.onDisconnect().remove(); }catch(e){} }
function unmarkOnline(g){ if(!onlineRef || !g) return; onlineRef.child(String(g)).child(devId).remove().catch(()=>{}); }
function detachPer(){
  if(role==='group' && myGroup) unmarkOnline(myGroup);
  offAll(perOffs); stateRef=ansRef=onlineRef=base=null; ansData={}; onlineData={}; haveState=false;
  Object.values(watches).forEach(w=>{ if(w.off){ w.off(); w.off=null; } });
}
function detachRoom(){ detachPer(); offAll(roomOffs); unitStates={}; nowPer=null; }

function openRoom(r){
  r=cleanRoom(r); if(!r) return;
  detachRoom(); P=null; roomId=r; localOnly=false; writeErr='';
  if(!fdb){ render(); return; }
  if(role==='group'){
    try{ const u=new URL(location.href); u.searchParams.set('r',r); history.replaceState(null,'',u.pathname+u.search); }catch(e){}
    myGroup = lsGet(groupKey()) || null;
  } else lsSet('khit.lastroom', r);
  const rb=fdb.ref('khit/'+r);
  APP.periods.forEach(p=>{
    listenTo(roomOffs, rb.child(p.id).child('state'), s=>{ unitStates[p.id]=normState(s.val()); if(!P || P.per!==p.id || role==='teacher') render(); });
  });
  listenTo(roomOffs, rb.child('now'), s=>{
    const v=s.val(); nowPer = (typeof v==='string' && PERIODS[v]) ? v : null;
    if(role==='group'){
      if((P?P.per:null)!==nowPer){ if(nowPer) openPeriod(nowPer); else { detachPer(); P=null; render(); } }
      else render();
    } else render();
  });
  if(role==='teacher'){ const lp=lsGet('khit.lastper.'+r); if(lp && PERIODS[lp]) openPeriod(lp); }
  render();
}
function openPeriod(pid){
  const cfg=PERIODS[pid]; if(!cfg) return;
  detachPer(); P=cfg; lastEarn=null; sent={}; drafts={}; writeErr='';
  document.title=cfg.title+' · '+APP.title;
  document.body.dataset.accent=cfg.accent||'reason';
  if(localOnly){ lsSet('khit.lastper.local', pid); const saved=lsGet(tkey()); S=(saved && saved.v===1) ? saved : fresh(6); ensure(); render(); return; }
  if(!fdb || !roomId){ render(); return; }
  base=fdb.ref('khit/'+roomId+'/'+pid);
  ansRef=base.child('ans'); onlineRef=base.child('online');
  if(role==='teacher'){
    lsSet('khit.lastper.'+roomId, pid);
    stateRef=base.child('state');
    const saved=lsGet(tkey()); S=(saved && saved.v===1) ? saved : fresh(6); ensure();
    listenTo(perOffs, stateRef, snap=>{
      const d=snap.val();
      if(!d || d.v!==1){ push(); return; }
      if((d.rev||0) > (S.rev||0)){ S=d; ensure(); lsSet(tkey(),S); render(); }
      else if((d.rev||0) < (S.rev||0)){ stateRef.set(clone(S)).catch(()=>{}); }
    });
    listenTo(perOffs, ansRef, s=>{ ansData=s.val()||{}; render(); });
    listenTo(perOffs, onlineRef, s=>{ onlineData=s.val()||{}; render(); });
  } else {
    S=fresh(6); ensure(); haveState=false;
    listenTo(perOffs, base.child('state'), snap=>{
      const d=snap.val();
      if(!d || d.v!==1){ haveState=false; render(); return; }
      haveState=true; S=d; ensure();
      const sv=lsGet(gkey('sent')); sent=(sv && sv.gid===S.gid) ? (sv.data||{}) : {};
      const dv=lsGet(gkey('drafts')); drafts=(dv && dv.gid===S.gid) ? (dv.data||{}) : {};
      if(myGroup && myGroup>S.groups){ unmarkOnline(myGroup); myGroup=null; }
      if(myGroup){
        const e=earned(myGroup), t=sum(e);
        if(lastEarn!==null && e.length>lastEarn.n && t>lastEarn.sum){ toast('ได้แสตมป์ '+e.slice(lastEarn.n).join(' + ')+' คะแนน!'); }
        lastEarn={n:e.length, sum:t};
      }
      render();
    });
    if(myGroup) markOnline();
  }
  render();
}
function openLocal(){
  detachRoom(); localOnly=true; roomId='local'; P=null;
  const lp=lsGet('khit.lastper.local'); if(lp && PERIODS[lp]) openPeriod(lp); else render();
}

/* ---------- QR ---------- */
function qrData(text, size){
  const key=size+'|'+text; if(qrCache[key]) return qrCache[key];
  if(typeof QRCode==='undefined') return '';
  try{
    const div=document.createElement('div');
    new QRCode(div,{text, width:size, height:size, correctLevel:QRCode.CorrectLevel.M});
    const c=div.querySelector('canvas'); const url=c ? c.toDataURL('image/png') : ((div.querySelector('img')||{}).src||'');
    if(url) qrCache[key]=url; return url;
  }catch(e){ return ''; }
}
function pageURL(file, params){
  const u=new URL(file||'index.html', location.href);
  Object.keys(params||{}).forEach(k=>u.searchParams.set(k,params[k]));
  return u.href;
}
const studentURL = ()=>pageURL('index.html',{r:roomId||''});
function qrHTML(text,size){ const d=qrData(text,size); return d ? `<div class="qr"><img src="${d}" width="${size}" height="${size}" alt="QR code"></div>` : `<div class="urlbox">${esc(text)}</div>`; }

/* ---------- UI bits ---------- */
function toast(msg){ let t=$('#toast'); if(!t){ t=document.createElement('div'); t.id='toast'; t.className='toast'; t.setAttribute('role','status'); document.body.appendChild(t); } t.textContent=msg; t.hidden=false; clearTimeout(toastT); toastT=setTimeout(()=>{ t.hidden=true; },2600); }
function openSheet(html){ sheet=html; renderSheet(); }
function closeSheet(){ sheet=null; renderSheet(); }
function renderSheet(){
  let v=$('#veil');
  if(!sheet){ if(v) v.remove(); return; }
  if(!v){ v=document.createElement('div'); v.id='veil'; v.className='veil'; document.body.appendChild(v); }
  const html=typeof sheet==='function'?sheet():sheet;
  if(v._h!==html){ v.innerHTML=`<div class="sheet" role="dialog" aria-modal="true">${html}</div>`; v._h=html; const f=v.querySelector('input,button'); if(f) f.focus(); }
}
function blank(k,i,text){
  const on=!!(S.reveal[k] && S.reveal[k][i]);
  return role==='teacher'
    ? `<button type="button" class="blank${on?' on':''}" data-a="rv" data-k="${k}" data-i="${i}" aria-label="${on?esc(text):'ช่องว่าง แตะเพื่อเฉลย'}">${on?esc(text):''}</button>`
    : `<span class="blank${on?' on':''}">${on?esc(text):''}</span>`;
}
function revealAllBtn(k,n){
  const all=S.reveal[k] && Object.keys(S.reveal[k]).length>=n;
  return `<button class="btn sm" data-a="rvall" data-k="${k}" data-n="${n}">${all?'ซ่อนเฉลยทั้งหมด':'เฉลยทั้งหมด'}</button>`;
}
function online(g){ const o=onlineData[g]; return !!(o && Object.keys(o).length); }
function statChips(key, judged){
  const a=answers(key);
  return '<div class="gstat">'+groupsList().map(g=>{
    const has=a[g]!==undefined; let cls=has?'in':'';
    if(judged){ cls = judged[g]===true ? 'ok' : judged[g]===false ? 'bad' : ''; }
    return `<span class="${cls}"><span class="dot${online(g)?' on':''}"></span>กลุ่ม ${g}${judged? (judged[g]===true?' ✓':judged[g]===false?' ✗':' –') : (has?' ส่งแล้ว':'')}</span>`;
  }).join('')+'</div>';
}

/* ---------- teacher screens ---------- */
function perChips(){
  return APP.periods.map((p,i)=>{ const ready=!!PERIODS[p.id], cur=P && P.per===p.id;
    return `<button class="btn sm${cur?' primary':''}" data-a="per" data-p="${p.id}"${ready?'':' disabled title="กำลังทำ"'}>คาบ ${th(i+1)}</button>`; }).join('');
}
function headerHTML(){
  const nOn=P ? groupsList().filter(online).length : 0;
  return `<header class="top">
    <button class="btn sm ghost" data-a="home" title="หน้ารวมทุกคาบ"${P?'':' disabled'}>☰ ทุกคาบ</button>
    <div class="brand"><small>${esc(APP.title)} · ม.๖ ท33102</small><b>${P?esc(P.title):'หน้ารวม ๖ คาบ'}</b></div>
    <div class="row" style="gap:6px">${perChips()}</div>
    <span class="sp"></span>
    ${localOnly?'<span class="chip">จอเดียว ไม่ต่อมือถือ</span>':
      `<button class="chip accent" data-a="room" title="เปลี่ยนห้อง">ห้อง ${esc(roomId||'-')}</button>
       <span class="chip"><span class="dot${connected?' on':''}"></span>${!connected?'ไม่ได้เชื่อมต่อ':(P?`ออนไลน์ ${th(nOn)}/${th(S.groups)} กลุ่ม`:'เชื่อมต่อแล้ว')}</span>
       <button class="btn sm" data-a="qr">QR ให้กลุ่ม</button>`}
    <button class="btn sm ghost" data-a="fs" title="เต็มจอ">⛶</button>
    ${user?`<button class="btn sm ghost" data-a="signout" title="${esc(user.email||'')}">ออกจากระบบ</button>`:''}
  </header>`;
}
function stepsHTML(){
  return '<nav class="steps" aria-label="ขั้นตอนของคาบ">'+P.steps.map((st,i)=>
    `<button class="${i===S.step?'cur':(i<S.step?'done':'')}" data-a="go" data-i="${i}"${i===S.step?' aria-current="step"':''}><span class="n">${th(i)}</span>${esc(st.label)}</button>`).join('')+'</nav>';
}
function railHTML(){
  const rows=groupsList().map(g=>{
    const e=earned(g);
    return `<button class="sbrow" data-a="g" data-g="${g}" title="ให้แสตมป์กลุ่ม ${g}">
      <span class="gname"><span class="dot${online(g)?' on':''}"></span>กลุ่ม ${g}</span>
      <span class="mini">${e.map(v=>stampImg(v,'minimg')).join('')}</span>
      <span class="tot">${th(sum(e))}</span></button>`;
  }).join('');
  return `<div class="sb"><h3>แสตมป์คาบนี้ <span class="note">แตะชื่อกลุ่มเพื่อให้เพิ่ม</span></h3>${rows}</div>
   ${writeErr?`<div class="fb bad">${esc(writeErr)}</div>`:''}`;
}
function navHTML(){
  const i=S.step, n=P.steps.length, st=step();
  return `<div class="navbar"><button class="btn" data-a="prev"${i<=0?' disabled':''}>← ${i>0?esc(P.steps[i-1].label):'ก่อนหน้า'}</button>
    <span class="where">${esc(perLabel(P.per))} · ขั้นที่ ${th(i)} / ${th(n-1)} · ${esc(st.label)}${st.min?` · ประมาณ ${th(st.min)} นาที`:''}</span>
    ${i<n-1?`<button class="btn primary" data-a="next">${esc(P.steps[i+1].label)} →</button>`:`<button class="btn primary" data-a="home">กลับหน้ารวม</button>`}</div>`;
}
function signinHTML(){
  return `<div class="main" style="grid-template-columns:1fr"><div class="card" style="max-width:640px;margin:30px auto">
    <span class="eyebrow">สำหรับครู</span><h2 class="stitle">เข้าระบบเพื่อควบคุมห้องเรียน</h2>
    <p class="slead">ใช้บัญชี Google เดียวกับเกม stamp-game นักเรียนไม่ต้องเข้าระบบ</p>
    ${authErr?`<div class="fb bad">${esc(authErr)}</div>`:''}
    <div class="row" style="margin-top:14px"><button class="btn primary lg" data-a="signin">เข้าระบบด้วย Google</button>
    <button class="btn lg" data-a="local">ใช้แบบจอเดียว ไม่ต่อมือถือ</button></div>
    <p class="note" style="margin-top:14px">แบบจอเดียว: ครูกดบนจอเองทั้งหมด นักเรียนตอบด้วยมือหรือป้าย ใช้ได้แม้อินเทอร์เน็ตไม่ดี</p>
  </div></div>`;
}
function homeT(){
  const url=studentURL();
  const cards=APP.periods.map((p,i)=>{ const ready=!!PERIODS[p.id], onPhones=nowPer===p.id;
    return `<article class="per c-${p.c}${ready?'':' soon'}">
      <span class="num">คาบ ${th(i+1)} · ${esc(p.book)}</span><h2>${esc(p.title)}</h2>
      <ul>${p.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
      <div class="row">${ready?`<button class="btn primary" data-a="per" data-p="${p.id}">เปิดคาบ ${th(i+1)}</button>`:'<span class="chip">กำลังทำ</span>'}${onPhones?'<span class="chip accent">มือถือกลุ่มอยู่คาบนี้</span>':''}</div></article>`; }).join('');
  const nG=Math.max(4, ...APP.periods.map(p=>(perState(p.id)||{}).groups||0));
  const any=APP.periods.some(p=>perState(p.id));
  let tot='<p class="note">ห้องนี้ยังไม่ได้เริ่มคาบไหน</p>';
  if(any){
    tot='<table class="tbl totals"><tr><th>กลุ่ม</th>'+APP.periods.map((p,i)=>`<th>คาบ ${th(i+1)}</th>`).join('')+'<th>รวม</th></tr>';
    for(let g=1; g<=nG; g++){ tot+=`<tr><td>กลุ่ม ${g}</td>${APP.periods.map(p=>`<td>${perState(p.id)?th(perTotal(p.id,g)):'<span class="note">–</span>'}</td>`).join('')}<td><b class="big">${th(unitTotal(g))}</b></td></tr>`; }
    tot+='</table>';
  }
  return `<div class="home">
    ${localOnly?'':`<div class="card"><div class="lobby"><div>${qrHTML(url,200)}</div><div>
      <span class="eyebrow">ห้อง ${esc(roomId)}</span><h2 class="stitle">QR เดียวใช้ได้ทุกคาบ</h2>
      <p class="slead">กลุ่มละ ๑ เครื่อง สแกนครั้งเดียวแล้วเก็บหน้าไว้ เมื่อครูเปิดคาบไหน มือถือกลุ่มจะเปลี่ยนตามเอง</p>
      <div class="urlbox">${esc(url)}</div>
      <p class="note" style="margin-top:8px">${nowPer?`ตอนนี้มือถือกลุ่มอยู่ที่ <b>${esc(perLabel(nowPer))}</b>`:'ยังไม่ได้เปิดคาบให้มือถือกลุ่ม'}</p></div></div></div>`}
    <div class="pers">${cards}</div>
    <div class="card"><h3 style="margin-bottom:8px">แสตมป์สะสมทั้งหน่วย ${localOnly?'(เครื่องนี้)':'ห้อง '+esc(roomId)}</h3>${tot}</div>
  </div>`;
}
function lobbyT(){
  const url=studentURL();
  const tiles=groupsList().map(g=>`<div class="gtile${online(g)?' on':''}">กลุ่ม ${g}<br><span class="note">${online(g)?'เข้าแล้ว':'ยังไม่เข้า'}</span></div>`).join('');
  return `<div class="card">${localOnly?
    `<span class="eyebrow">แบบจอเดียว</span><h2 class="stitle">${esc(P.title)}</h2><p class="slead">${esc(P.lead||'')}</p>`:
    `<div class="lobby"><div>${qrHTML(url,260)}</div><div>
      <span class="eyebrow">ห้อง ${esc(roomId)} · ${esc(perLabel(P.per))}</span><h2 class="stitle">${esc(P.title)}</h2><p class="slead">${esc(P.lead||'')}</p>
      <p class="big" style="margin-bottom:6px">กลุ่มที่สแกนไว้แล้วไม่ต้องสแกนใหม่ หน้าจอจะเปลี่ยนเป็นคาบนี้เอง</p>
      <div class="urlbox">${esc(url)}</div></div></div><div class="gtiles">${tiles}</div>`}
    <div class="row" style="margin-top:18px"><span class="note">จำนวนกลุ่ม</span>
      ${[4,5,6,7,8].map(n=>`<button class="btn sm${S.groups===n?' primary':''}" data-a="groups" data-n="${n}">${th(n)}</button>`).join('')}
      <span class="grow"></span><button class="btn sm ghost" data-a="reset">เริ่มคาบนี้ใหม่ (ล้างแสตมป์และคำตอบ)</button></div>
  </div>
  ${P.plan?`<div class="card"><h3 style="margin-bottom:8px">ลำดับในคาบ</h3><table class="tbl"><tr><th>ขั้น</th><th>กิจกรรม</th><th>นาที</th><th>คู่กับเล่ม</th></tr>${P.steps.slice(1).map((st,i)=>`<tr><td>${th(i+1)}</td><td>${esc(st.label)}</td><td>${st.min?th(st.min):'–'}</td><td>${esc(st.book||'')}</td></tr>`).join('')}</table></div>`:''}`;
}
function endT(){
  const list=groupsList().map(g=>({g,e:earned(g),t:total(g),u:unitTotal(g)})).sort((a,b)=>b.t-a.t||a.g-b.g);
  return `<div class="card"><span class="eyebrow">สรุปท้ายคาบ</span><h2 class="stitle">แสตมป์ที่ได้ใน${esc(perLabel(P.per))}</h2>
    <p class="slead">ครูนำคะแนนไปลงสมุดสะสมแสตมป์ได้เลย ข้อมูลเก็บแยกตามห้อง</p>
    <table class="tbl"><tr><th>อันดับ</th><th>กลุ่ม</th><th>แสตมป์</th><th style="text-align:right">คาบนี้</th><th style="text-align:right">ทั้งหน่วย</th></tr>
    ${list.map((x,i)=>`<tr><td class="big">${th(i+1)}</td><td class="big">กลุ่ม ${x.g}</td><td><div class="mystamps">${x.e.map(v=>stampImg(v,'')).join('')||'<span class="note">–</span>'}</div></td><td class="huge" style="text-align:right">${th(x.t)}</td><td class="big" style="text-align:right">${th(x.u)}</td></tr>`).join('')}</table></div>
    ${P.endNote?`<div class="card">${P.endNote}</div>`:''}`;
}
function renderTeacher(){
  if(!localOnly && !user){ return `<div class="T"><header class="top"><div class="brand"><small>${esc(APP.title)} · ม.๖ ท33102</small><b>ลิงก์ครู</b></div></header>${authReady||!fbOk?signinHTML():'<div class="wait">กำลังเชื่อมต่อ…</div>'}</div>`; }
  if(!P) return `<div class="T home-mode">${headerHTML()}<div class="main" style="grid-template-columns:1fr">${homeT()}</div></div>`;
  const st=step();
  const body = st.k==='lobby' ? lobbyT() : st.k==='end' ? endT() : (st.T ? st.T(K) : '');
  return `<div class="T">${headerHTML()}${stepsHTML()}<div class="main"><section class="stage" aria-live="polite">${body}</section><aside class="rail">${railHTML()}</aside></div>${navHTML()}</div>`;
}

/* ---------- group screens ---------- */
function renderGroup(){
  const top=(inner)=>`<div class="G"><header class="gtop">${inner}</header><main class="gbody">`;
  const foot='</main></div>';
  const who = myGroup ? `<b>ห้อง ${esc(roomId)} · กลุ่ม ${myGroup}</b>` : `<b>ห้อง ${esc(roomId||'')}</b>`;
  if(!fbOk) return top('<b>'+esc(APP.title)+'</b>')+'<div class="card wait"><div class="huge">เชื่อมต่อระบบไม่ได้</div>ตรวจอินเทอร์เน็ต แล้วสแกน QR ใหม่อีกครั้ง</div>'+foot;
  if(!roomId) return top('<b>'+esc(APP.title)+'</b>')+`<div class="card"><h2 class="stitle">ใส่รหัสห้อง</h2><p class="note">ดูรหัสห้องได้ที่มุมบนของจอครู เช่น 601</p>
     <div class="row"><input class="grow" id="roomIn" inputmode="numeric" maxlength="20" style="min-height:48px;font-size:20px;padding:6px 12px;border-radius:12px;border:1.5px solid var(--line2)" placeholder="601"><button class="btn primary" data-a="groom">เข้าห้อง</button></div></div>`+foot;
  if(!P) return top(who+(myGroup?`<span class="sp"></span><button class="btn sm ghost" data-a="regroup">เปลี่ยนกลุ่ม</button>`:''))+
    `<div class="card wait"><div class="huge">รอครูเลือกคาบ</div>${connected?'เปิดหน้านี้ค้างไว้ได้เลย เมื่อครูเปิดคาบ หน้าจอจะเปลี่ยนเอง':'กำลังเชื่อมต่อ…'}</div>`+
    (myGroup?`<div class="card"><div class="row between"><b style="font-family:var(--f-disp)">แสตมป์ทั้งหน่วยของกลุ่ม ${myGroup}</b><span class="huge">${th(unitTotal(myGroup))}</span></div></div>`:'')+foot;
  if(!haveState) return top(who+`<span class="sp"></span><span class="chip">${esc(perLabel(P.per))}</span>`)+`<div class="card wait"><div class="huge">รอครูเปิด${esc(perLabel(P.per))}</div>${connected?esc(P.title):'กำลังเชื่อมต่อ…'}</div>`+foot;
  if(!myGroup) return top(who+`<span class="sp"></span><span class="chip">${esc(perLabel(P.per))}</span>`)+
    `<div class="card"><h2 class="stitle">เลือกกลุ่มของเรา</h2><p class="note">ใช้เครื่องนี้เครื่องเดียวต่อกลุ่ม เลือกครั้งเดียวใช้ได้ทุกคาบ</p><div class="ggrid">${groupsList().map(g=>`<button data-a="pick" data-g="${g}">กลุ่ม ${g}</button>`).join('')}</div></div>`+foot;
  const st=step(), e=earned(myGroup);
  let body = st.k==='end' ? `<div class="card"><span class="eyebrow">จบ${esc(perLabel(P.per))}</span><h2 class="stitle">แสตมป์ของกลุ่ม ${myGroup}</h2><div class="mystamps">${e.map(v=>stampImg(v,'')).join('')||'<span class="note">ยังไม่มีแสตมป์</span>'}</div><p class="huge" style="margin-top:10px">คาบนี้ ${th(sum(e))} คะแนน</p><p class="big" style="margin:0">ทั้งหน่วย ${th(unitTotal(myGroup))} คะแนน</p></div>`
    : st.k==='lobby' ? `<div class="card wait"><div class="huge">เข้า${esc(perLabel(P.per))}แล้ว</div>${esc(P.title)} · รอครูเริ่มกิจกรรม</div>`
    : (st.G ? st.G(K) : `<div class="card wait"><div class="huge">ดูที่จอหน้าห้อง</div>${esc(st.label)}</div>`);
  return top(who+`<span class="sp"></span><span class="chip"><span class="dot${connected?' on':''}"></span>${th(sum(e))} คะแนน</span><button class="btn sm ghost" data-a="regroup">เปลี่ยนกลุ่ม</button>`)+
    `<div class="note" style="font-family:var(--f-disp)">${esc(perLabel(P.per))} · ขั้นที่ ${th(S.step)} · ${esc(st.label)}</div>`+body+
    (e.length && st.k!=='end' ? `<div class="card"><div class="row between"><b style="font-family:var(--f-disp)">แสตมป์คาบนี้</b><span class="note">ทั้งหน่วย ${th(unitTotal(myGroup))}</span></div><div class="mystamps" style="margin-top:6px">${e.map(v=>stampImg(v,'')).join('')}</div></div>`:'')+foot;
}

/* ---------- render with input preservation ---------- */
let lastHTML='';
function render(){
  if(!booted) return;
  syncWatches();
  const root=$('#app'); if(!root) return;
  const html = role==='teacher' ? renderTeacher() : renderGroup();
  if(html!==lastHTML){
    const keep={}; root.querySelectorAll('input[id],textarea[id],select[id]').forEach(el=>{ keep[el.id]={v:el.value, c:el.checked}; });
    const act=document.activeElement, actId=act && act.id, sel=(act && 'selectionStart' in act) ? [act.selectionStart, act.selectionEnd] : null;
    const sy=window.scrollY;
    root.innerHTML=html; lastHTML=html;
    Object.keys(keep).forEach(id=>{ const el=document.getElementById(id); if(el && !el.hasAttribute('data-nokeep')){ if(el.type==='checkbox'||el.type==='radio') el.checked=keep[id].c; else el.value=keep[id].v; } });
    if(actId){ const el=document.getElementById(actId); if(el){ el.focus({preventScroll:true}); try{ if(sel && el.setSelectionRange) el.setSelectionRange(sel[0],sel[1]); }catch(e){} } }
    window.scrollTo(0,sy);
  }
  renderSheet();
}

/* ---------- actions ---------- */
function stampSheet(g){
  return ()=>{
    const mine=S.bonus.map((b,i)=>({b,i})).filter(x=>String(x.b.g)===String(g));
    return `<h3>ให้แสตมป์กลุ่ม ${g}</h3><p class="note">แสตมป์พิเศษนอกกิจกรรม เช่น อธิบายเหตุผลได้ดี ช่วยเพื่อน</p>
      <div class="stamppick">${STAMPS.map(v=>`<button data-a="give" data-g="${g}" data-v="${v}" aria-label="${v} คะแนน">${stampImg(v,'')}</button>`).join('')}</div>
      ${mine.length?`<p class="note" style="margin-top:10px">แสตมป์พิเศษที่ให้แล้ว</p><div class="row">${mine.map(x=>`<span class="chip">${x.b.v} คะแนน <button class="btn sm ghost" data-a="unbonus" data-i="${x.i}" aria-label="ลบ">✕</button></span>`).join('')}</div>`:''}
      <div class="row end" style="margin-top:14px"><button class="btn" data-a="close">ปิด</button></div>`;
  };
}
function payList(k){
  return `<div class="gstat">${groupsList().map(g=>{ const v=S.pay[k]&&S.pay[k][g]; return `<span class="${v?'ok':''}">กลุ่ม ${g} ${v?stampImg(v,'minimg')+' '+v:'–'}</span>`; }).join('')}</div>`;
}
const core = {
  go(el){ update(()=>{ S.step=+el.dataset.i; }); window.scrollTo(0,0); },
  next(){ if(P && S.step<P.steps.length-1){ update(()=>{ S.step++; }); window.scrollTo(0,0); } },
  prev(){ if(P && S.step>0){ update(()=>{ S.step--; }); window.scrollTo(0,0); } },
  per(el){
    const pid=el.dataset.p; if(!PERIODS[pid]) return;
    if(!localOnly && fdb && roomId){ fdb.ref('khit/'+roomId+'/now').set(pid).catch(e=>{ writeErr=errText(e); render(); }); }
    openPeriod(pid); window.scrollTo(0,0);
  },
  home(){ detachPer(); P=null; lsSet('khit.lastper.'+(localOnly?'local':roomId), null); document.title=APP.title; render(); window.scrollTo(0,0); },
  rv(el){ const k=el.dataset.k, i=el.dataset.i; update(()=>{ S.reveal[k]=S.reveal[k]||{}; if(S.reveal[k][i]) delete S.reveal[k][i]; else S.reveal[k][i]=true; }); },
  rvall(el){ const k=el.dataset.k, n=+el.dataset.n; update(()=>{ const all=S.reveal[k] && Object.keys(S.reveal[k]).length>=n; S.reveal[k]={}; if(!all) for(let i=0;i<n;i++) S.reveal[k][i]=true; }); },
  room(){ openSheet(`<h3>เลือกห้อง</h3><div class="row">${ROOMS.map(r=>`<button class="btn sm${r===roomId?' primary':''}" data-a="setroom" data-r="${r}">${r}</button>`).join('')}</div>
      <p class="note" style="margin-top:12px">หรือพิมพ์รหัสห้องเอง (ตัวเลข ตัวอักษรอังกฤษพิมพ์เล็ก หรือ -)</p>
      <div class="row"><input id="roomCode" class="grow" maxlength="20" data-nokeep style="min-height:44px;font-size:18px;padding:4px 12px;border-radius:12px;border:1.5px solid var(--line2)" value="${esc(roomId||'')}"><button class="btn primary" data-a="setroom">เปิดห้อง</button></div>
      <div class="row end" style="margin-top:12px"><button class="btn" data-a="close">ปิด</button></div>`); },
  setroom(el){ const r=cleanRoom(el.dataset.r || ($('#roomCode')||{}).value); if(!r) return; closeSheet(); openRoom(r); },
  qr(){ const url=studentURL(); openSheet(`<h3>ให้กลุ่มสแกนเข้าห้อง ${esc(roomId)}</h3><div style="text-align:center">${qrHTML(url,300)}</div><p class="note" style="margin:8px 0 0">QR เดียวใช้ได้ทุกคาบ</p><p class="urlbox" style="margin-top:6px">${esc(url)}</p><div class="row end"><button class="btn" data-a="close">ปิด</button></div>`); },
  close(){ closeSheet(); },
  g(el){ openSheet(stampSheet(el.dataset.g)); },
  give(el){ const g=+el.dataset.g, v=+el.dataset.v; update(()=>{ S.bonus.push({g, v, id:rid()}); }); toast('ให้แสตมป์ '+v+' คะแนน แก่กลุ่ม '+g); },
  unbonus(el){ const i=+el.dataset.i; update(()=>{ S.bonus.splice(i,1); }); },
  groups(el){ update(()=>{ S.groups=+el.dataset.n; }); },
  reset(){ openSheet(`<h3>เริ่มคาบนี้ใหม่?</h3><p>แสตมป์ คำตอบ และการเฉลยของ <b>${esc(P.title)}</b> ในห้อง ${esc(roomId)} จะถูกล้าง คาบอื่นไม่เปลี่ยน</p><div class="row end"><button class="btn" data-a="close">ยกเลิก</button><button class="btn danger" data-a="resetyes">ล้างและเริ่มใหม่</button></div>`); },
  resetyes(){ closeSheet(); const g=S.groups, r=S.rev; S=fresh(g); S.rev=r; if(ansRef) ansRef.remove().catch(()=>{}); push(); render(); },
  signin(){ authErr=''; auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(e=>{ authErr = e && e.code==='auth/unauthorized-domain' ? 'โดเมนนี้ยังไม่ได้เพิ่มใน Firebase (Authentication › Settings › Authorized domains)' : (e && e.code==='auth/popup-blocked' ? 'เบราว์เซอร์บล็อกหน้าต่างเข้าระบบ อนุญาตป๊อปอัปแล้วลองอีกครั้ง' : 'เข้าระบบไม่สำเร็จ ลองอีกครั้ง'); render(); }); },
  signout(){ if(auth) auth.signOut(); },
  local(){ openLocal(); },
  fs(){ try{ if(document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); }catch(e){} },
  pick(el){ myGroup=+el.dataset.g; lsSet(groupKey(), myGroup); lastEarn=null; markOnline(); render(); },
  regroup(){ unmarkOnline(myGroup); myGroup=null; lsSet(groupKey(), null); render(); },
  groom(){ const r=cleanRoom(($('#roomIn')||{}).value); if(r) openRoom(r); }
};
document.addEventListener('click', e=>{
  const el=e.target.closest('[data-a]'); if(!el || el.disabled) return;
  const a=el.dataset.a, st=step();
  if(core[a]) { e.preventDefault(); core[a](el); }
  else if(st && st.on && st.on[a]) { e.preventDefault(); st.on[a](el, K); }
  else if(P && P.on && P.on[a]) { e.preventDefault(); P.on[a](el, K); }
});
document.addEventListener('keydown', e=>{
  if(e.key==='Escape' && sheet){ closeSheet(); return; }
  if(e.key==='Enter' && e.target && e.target.id==='roomCode'){ core.setroom({dataset:{}}); return; }
  if(e.key==='Enter' && e.target && e.target.id==='roomIn'){ core.groom(); return; }
  if(role!=='teacher' || sheet || !P || (!user && !localOnly)) return;
  if(/^(INPUT|TEXTAREA|SELECT)$/.test((e.target||{}).tagName||'')) return;
  if(e.key==='ArrowRight'||e.key==='PageDown'){ e.preventDefault(); core.next(); }
  else if(e.key==='ArrowLeft'||e.key==='PageUp'){ e.preventDefault(); core.prev(); }
});

/* ---------- reusable activity: rounds (one item at a time, live) ---------- */
function rounds(cfg){
  const k=cfg.k, n=cfg.items.length, key=(i)=>k+'_'+i;
  const D=()=>{ if(!S.data[k]) S.data[k]={i:0, shown:{}}; if(!S.data[k].shown) S.data[k].shown={}; return S.data[k]; };
  const snapOf=(i)=>S.snap[key(i)]||{};
  const score=(g)=>{ let s=0; for(let i=0;i<n;i++){ if(D().shown[i] && snapOf(i)[g]===cfg.items[i].ans) s++; } return s; };
  const nShown=()=>Object.keys(D().shown).length;
  const optLabel=(v)=>{ const o=cfg.opts.find(x=>x.v===v); return o?o.label:v; };
  const payTable=()=>`<table class="tbl" style="max-width:420px"><tr><th>ถูก</th><th>แสตมป์</th></tr>${cfg.pay.map(([m,v])=>`<tr><td>${th(m)} ข้อขึ้นไป</td><td>${v} คะแนน</td></tr>`).join('')}</table>`;
  return {
    k, label:cfg.label, min:cfg.min, book:cfg.book,
    T(){
      const d=D(), i=Math.min(d.i,n-1), it=cfg.items[i], shown=!!d.shown[i];
      let h=`<div class="card"><div class="row between"><span class="eyebrow">${esc(cfg.title)} · รอบที่ ${th(i+1)}/${th(n)}</span>
        <div class="row">${cfg.items.map((_,j)=>`<button class="btn sm${j===i?' primary':''}" data-a="rd-go" data-i="${j}" aria-label="รอบที่ ${j+1}">${d.shown[j]?'✓':th(j+1)}</button>`).join('')}</div></div>
        ${cfg.lead && i===0 && !shown ? `<p class="slead">${cfg.lead}</p>`:''}
        ${cfg.show(it, shown, 'T')}`;
      if(!shown){
        h+=statChips(key(i))+`<div class="row"><button class="btn primary lg" data-a="rd-reveal">เฉลยรอบนี้</button><span class="note">กลุ่มเปลี่ยนคำตอบได้จนกว่าครูจะเฉลย</span></div>`;
      } else {
        const sn=snapOf(i), cnt={}; cfg.opts.forEach(o=>cnt[o.v]=0); Object.values(sn).forEach(v=>{ if(cnt[v]!==undefined) cnt[v]++; });
        const totalAns=Object.keys(sn).length||1;
        const judged={}; groupsList().forEach(g=>{ if(sn[g]!==undefined) judged[g]=(sn[g]===it.ans); });
        h+=`<div class="dist">${cfg.opts.map(o=>`<div class="bar${o.v===it.ans?' right':''}"><span>${esc(o.label)}${o.v===it.ans?' ✓':''}</span><div class="track"><div class="fill" style="width:${Math.round(cnt[o.v]/totalAns*100)}%"></div></div><span class="mono">${th(cnt[o.v])}</span></div>`).join('')}</div>
          ${statChips(key(i), judged)}
          ${it.why?`<div class="fb info big">${it.why}</div>`:''}
          <div class="row" style="margin-top:14px">${i<n-1?`<button class="btn primary lg" data-a="rd-go" data-i="${i+1}">รอบถัดไป →</button>`:''}<button class="btn sm ghost" data-a="rd-hide">ยกเลิกเฉลยรอบนี้</button></div>`;
      }
      h+='</div>';
      const paid=!!S.pay[k];
      h+=`<div class="card"><div class="row between"><h3>คะแนน ${esc(cfg.title)} <span class="note">(เฉลยแล้ว ${th(nShown())}/${th(n)} รอบ)</span></h3>
          <button class="btn ${nShown()>=n?'primary':''}" data-a="rd-pay">${paid?'แจกแสตมป์ใหม่ตามคะแนนล่าสุด':'แจกแสตมป์ตามคะแนน'}</button></div>
        <div class="gstat">${groupsList().map(g=>`<span class="in">กลุ่ม ${g} · ${th(score(g))}</span>`).join('')}</div>
        ${paid?payList(k):`<details><summary class="note">เกณฑ์แจกแสตมป์</summary>${payTable()}</details>`}</div>`;
      return h;
    },
    G(){
      const d=D(), i=Math.min(d.i,n-1), it=cfg.items[i], shown=!!d.shown[i];
      const mine=sent[key(i)], got=shown ? snapOf(i)[myGroup] : undefined;
      let h=`<div class="card"><span class="eyebrow">${esc(cfg.title)} · รอบที่ ${th(i+1)}/${th(n)}</span>${cfg.show(it, shown, 'G')}
        <div class="opts c${cfg.opts.length}" style="margin-top:12px">${cfg.opts.map(o=>{
          let cls=''; if(shown){ if(o.v===it.ans) cls='right'; else if(o.v===got) cls='wrong'; } else if(o.v===mine) cls='sel';
          return `<button class="opt ${cls}" data-a="rd-pick" data-v="${esc(o.v)}"${shown?' disabled':''}>${esc(o.label)}${o.sub?`<small>${esc(o.sub)}</small>`:''}</button>`; }).join('')}</div>`;
      if(!shown) h+= mine!==undefined ? `<div class="fb info">ส่งแล้ว: <b>${esc(optLabel(mine))}</b> · เปลี่ยนได้จนกว่าครูจะเฉลย</div>` : `<p class="note" style="margin-top:10px">แตะคำตอบ แล้วรอครูเฉลย</p>`;
      else h+= got===undefined ? `<div class="fb info">รอบนี้กลุ่มไม่ได้ส่งคำตอบทันเวลา</div>` : (got===it.ans ? `<div class="fb ok"><b>ถูกต้อง!</b> ${it.whyG||''}</div>` : `<div class="fb bad"><b>ยังไม่ถูก</b> คำตอบคือ "${esc(optLabel(it.ans))}" ${it.whyG||''}</div>`);
      h+=`<p class="note" style="margin-top:10px">คะแนนของกลุ่มในกิจกรรมนี้ ${th(score(myGroup))} / ${th(nShown())}</p></div>`;
      if(S.pay[k]){ const v=S.pay[k][myGroup]; h+=`<div class="card">${v?`<div class="row">${stampImg(v)}<div class="huge">ได้แสตมป์ ${v} คะแนน</div></div>`:'<p>กิจกรรมนี้ยังไม่ได้แสตมป์ สู้ต่อกิจกรรมหน้า!</p>'}</div>`; }
      return h;
    },
    on:{
      'rd-pick'(el){ const d=D(); if(d.shown[d.i]) return; send(key(d.i), el.dataset.v); },
      'rd-reveal'(){ update(()=>{ const d=D(); S.snap[key(d.i)]=answers(key(d.i)); d.shown[d.i]=true; }); },
      'rd-hide'(){ update(()=>{ const d=D(); delete d.shown[d.i]; delete S.snap[key(d.i)]; }); },
      'rd-go'(el){ update(()=>{ D().i=Math.max(0,Math.min(n-1,+el.dataset.i)); }); },
      'rd-pay'(){ update(()=>{ S.pay[k]={}; groupsList().forEach(g=>{ S.pay[k][g]=payout(cfg.pay, score(g)); }); }); openSheet(()=>`<h3>แจกแสตมป์ ${esc(cfg.title)}</h3>${payList(k)}<div class="row end"><button class="btn primary" data-a="close">เรียบร้อย</button></div>`); }
    }
  };
}

/* ---------- reusable activity: form (all items at once, submit, then reveal) ---------- */
function form(cfg){
  const k=cfg.k, n=cfg.items.length;
  const D=()=>{ if(!S.data[k]) S.data[k]={shown:false}; return S.data[k]; };
  const opts=(it)=>it.opts||cfg.opts;
  const optLabel=(it,v)=>{ const o=opts(it).find(x=>x.v===v); return o?o.label:v; };
  const score=(g)=>{ const a=(S.snap[k]||{})[g]; if(!a) return 0; let s=0; cfg.items.forEach((it,i)=>{ if(a[i]===it.ans) s++; }); return s; };
  return {
    k, label:cfg.label, min:cfg.min, book:cfg.book,
    T(){
      const shown=D().shown, sn=S.snap[k]||{};
      let h=`<div class="card"><span class="eyebrow">${esc(cfg.title)}</span>${cfg.intro?cfg.intro('T',shown):''}`;
      h+=`<table class="tbl big" style="margin-top:10px"><tr><th>ข้อ</th><th>${esc(cfg.colItem||'ข้อความ')}</th>${shown?'<th>เฉลย</th><th>ตอบถูก</th>':''}</tr>${cfg.items.map((it,i)=>{
        const right=groupsList().filter(g=>sn[g] && sn[g][i]===it.ans).length, ans=Object.keys(sn).length;
        return `<tr><td>${th(i+1)}</td><td>${it.text}</td>${shown?`<td style="color:var(--ok);font-family:var(--f-disp)">${esc(optLabel(it,it.ans))}</td><td class="mono">${th(right)}/${th(ans)}</td>`:''}</tr>`; }).join('')}</table>`;
      if(!shown){
        h+=statChips(k)+`<div class="row"><button class="btn primary lg" data-a="fm-reveal">เฉลย</button><span class="note">กลุ่มแก้แล้วส่งใหม่ได้จนกว่าครูจะเฉลย</span></div>`;
      } else {
        h+=`<div class="gstat">${groupsList().map(g=>`<span class="${sn[g]?'in':''}">กลุ่ม ${g} · ${sn[g]?th(score(g))+'/'+th(n):'ไม่ได้ส่ง'}</span>`).join('')}</div>
          <div class="row"><button class="btn primary" data-a="fm-pay">${S.pay[k]?'แจกแสตมป์ใหม่':'แจกแสตมป์ตามคะแนน'}</button><button class="btn sm ghost" data-a="fm-hide">ยกเลิกเฉลย</button></div>
          ${S.pay[k]?payList(k):''}`;
      }
      h+='</div>';
      if(shown && cfg.after) h+=cfg.after('T');
      return h;
    },
    G(){
      const shown=D().shown, mine=sent[k], dr=drafts[k]||mine||{}, sn=(S.snap[k]||{})[myGroup];
      let h=`<div class="card"><span class="eyebrow">${esc(cfg.title)}</span>${cfg.intro?cfg.intro('G',shown):''}`;
      h+=cfg.items.map((it,i)=>{
        const o=opts(it);
        return `<div style="margin-top:14px"><div class="big"><b>${th(i+1)}.</b> ${it.text}</div><div class="opts c${o.length}" style="margin-top:6px">${o.map(x=>{
          let cls=''; if(shown){ if(x.v===it.ans) cls='right'; else if(sn && sn[i]===x.v) cls='wrong'; } else if(dr[i]===x.v) cls='sel';
          return `<button class="opt ${cls}" data-a="fm-pick" data-i="${i}" data-v="${esc(x.v)}"${shown?' disabled':''} style="min-height:52px;font-size:18px">${esc(x.label)}</button>`; }).join('')}</div></div>`; }).join('');
      if(!shown){
        const done=cfg.items.every((_,i)=>dr[i]!==undefined), same=mine && cfg.items.every((_,i)=>mine[i]===dr[i]);
        h+=`<div style="margin-top:16px">${same?`<div class="fb info">ส่งแล้ว รอครูเฉลย · แก้แล้วส่งใหม่ได้</div>`:`<button class="btn primary block lg" data-a="fm-send"${done?'':' disabled'}>${mine?'ส่งคำตอบใหม่':'ส่งคำตอบ'}</button>${done?'':'<p class="note" style="margin-top:6px">ตอบให้ครบทุกข้อก่อนส่ง</p>'}`}</div>`;
      } else {
        h+= sn ? `<div class="fb ${score(myGroup)===n?'ok':'info'}"><b>ถูก ${th(score(myGroup))} จาก ${th(n)} ข้อ</b></div>` : `<div class="fb info">กลุ่มไม่ได้ส่งคำตอบก่อนเฉลย</div>`;
      }
      h+='</div>';
      if(shown && S.pay[k]){ const v=S.pay[k][myGroup]; h+=`<div class="card">${v?`<div class="row">${stampImg(v)}<div class="huge">ได้แสตมป์ ${v} คะแนน</div></div>`:'<p>ข้อนี้ยังไม่ได้แสตมป์</p>'}</div>`; }
      if(shown && cfg.after) h+=cfg.after('G');
      return h;
    },
    on:{
      'fm-pick'(el){ if(D().shown) return; const i=+el.dataset.i; drafts[k]=Object.assign({}, drafts[k]||sent[k]||{}); drafts[k][i]=el.dataset.v; lsSet(gkey('drafts'),{gid:S.gid,data:drafts}); render(); },
      'fm-send'(){ if(D().shown) return; const dr=drafts[k]||{}; const v={}; cfg.items.forEach((_,i)=>{ v[i]=dr[i]; }); send(k, v); },
      'fm-reveal'(){ update(()=>{ const a=answers(k), sn={}; Object.keys(a).forEach(g=>{ if(a[g] && typeof a[g]==='object') sn[g]=a[g]; }); S.snap[k]=sn; D().shown=true; }); },
      'fm-hide'(){ update(()=>{ D().shown=false; delete S.snap[k]; }); },
      'fm-pay'(){ update(()=>{ S.pay[k]={}; groupsList().forEach(g=>{ S.pay[k][g]=payout(cfg.pay, score(g)); }); }); openSheet(()=>`<h3>แจกแสตมป์ ${esc(cfg.title)}</h3>${payList(k)}<div class="row end"><button class="btn primary" data-a="close">เรียบร้อย</button></div>`); }
    }
  };
}

/* ---------- public API ---------- */
let booted=false;
const K = window.K = {
  role, th, esc, blank, revealAllBtn, stampImg, qrHTML, pageURL, toast, openSheet, closeSheet,
  rounds, form, payout, groupsList, earned, total, answers, send, update,
  get S(){ return S; }, get room(){ return roomId; }, get group(){ return myGroup; }, get localOnly(){ return localOnly; },
  get user(){ return user; }, get live(){ return live; }, get stepKey(){ return stepKey(); }, get per(){ return P?P.per:null; }, get now(){ return now(); },
  watch(name, path, when){ watches[name]={path, when, off:null}; },
  ref(path){ return (fdb && roomId && !localOnly) ? fdb.ref('khit/'+roomId+'/'+path) : null; },
  render,
  /* each period module (p1.js …) calls this before K.start */
  period(cfg){
    PERIODS[cfg.per]=cfg;
    if(cfg.css){ const st=document.createElement('style'); st.textContent=cfg.css; document.head.appendChild(st); }
  },
  start(app){
    APP=Object.assign(APP, app||{}); booted=true;
    document.title=APP.title;
    try{ firebase.initializeApp(FB); fdb=firebase.database(); fbOk=true; }catch(e){ fbOk=false; }
    if(fbOk){
      fdb.ref('.info/serverTimeOffset').on('value', s=>{ serverOffset=Number(s.val())||0; });
      fdb.ref('.info/connected').on('value', s=>{ connected=!!s.val(); if(connected && role==='group' && myGroup && P) markOnline(); render(); });
    }
    if(role==='teacher'){
      if(!fbOk){ authReady=true; openLocal(); return; }
      auth=firebase.auth();
      auth.onAuthStateChanged(u=>{ user=u; authReady=true; authErr=''; if(u){ if(!localOnly) openRoom(lsGet('khit.lastroom')||'601'); } else if(!localOnly){ detachRoom(); P=null; roomId=null; render(); } else render(); });
    } else {
      const r=cleanRoom(qs.get('r')); if(r) openRoom(r);
    }
    render();
  }
};
})();
