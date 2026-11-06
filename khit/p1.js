/* p1.js — คาบ ๑ เหตุและผล (เล่มหน้า ๑–๓)
   เนื้อหาเฉลยตามไฟล์เฉลยของครู · ประโยคตัวอย่างที่แต่งใหม่มีหมายเหตุบนจอครู */
(function(){
'use strict';
const P1_CSS = `
/* คาบ ๑: ประโยคสองท่อนกับช่องคำเชื่อมตรงกลาง */
.pair{display:flex;flex-wrap:wrap;align-items:center;gap:12px 14px;margin:10px 0 4px}
.pair .part{display:flex;flex-direction:column;align-items:flex-start;gap:6px}
.pair .txt{font-family:var(--f-disp);font-weight:500;font-size:clamp(24px,2.7vw,42px);line-height:1.35}
.G .pair .txt{font-size:22px}
.slot{display:inline-grid;place-items:center;min-width:3.6em;min-height:1.5em;padding:0 .4em;border-radius:14px;border:3px dashed var(--accent-mid);color:var(--accent);font-family:var(--f-disp);font-weight:500;font-size:clamp(24px,2.7vw,42px);background:var(--accent-soft)}
.G .slot{font-size:22px}
.slot.on{border-style:solid;border-color:var(--accent);animation:pop .35s ease}
.slot.none{border-color:var(--line2);color:var(--muted);background:var(--sunk)}
.kw{color:var(--accent);background:var(--accent-soft);padding:0 .25em;border-radius:6px}
.lab{display:grid;gap:14px}
.labrow{border:1.5px solid var(--line);border-radius:var(--r);padding:14px 16px}
.verdict{font-family:var(--f-disp);font-size:20px;margin-top:6px}
.verdict.ok{color:var(--ok)} .verdict.bad{color:var(--bad)}
.post{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line)}
.post .rank{font-family:var(--f-disp);font-size:28px;color:var(--accent);width:36px;text-align:center}
.post .who{font-family:var(--f-disp);font-size:19px}
.post .prev{color:var(--muted);font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:52vw}
.fam{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media (max-width:700px){.fam{grid-template-columns:1fr}}
.authored{font-size:13px;color:var(--soft);margin-top:12px}
`;
const {th, esc, blank} = K;
const AUTH = '<p class="authored">ประโยคตัวอย่างในขั้นนี้แต่งขึ้นใหม่ ไม่ได้มาจากเล่ม ควรอ่านทวนก่อนใช้</p>';
const T_ONLY = (html)=>K.role==='teacher' ? html : '';

/* ---------- ขั้น ๑ แชทขอแม่ ---------- */
function boardTop(){
  const bd=K.live.board; if(!bd) return [];
  const posts=bd.posts||{}, votes=bd.votes||{};
  return Object.keys(posts).map(id=>{ let d={}; try{ d=JSON.parse(posts[id].d||'{}'); }catch(e){}
    return {id, name:d.name||'ไม่ระบุชื่อ', g:posts[id].g||0, decision:d.decision||'', score:d.score||0, first:((d.msgs||[])[0]||{}).text||'', v:Object.keys(votes[id]||{}).length, t:posts[id].t||0}; })
    .sort((a,b)=>b.v-a.v || b.score-a.score || a.t-b.t);
}
const decTxt = (d)=>d ? 'แม่'+d : '';
const chatStep = {
  k:'chat', label:'แชทขอแม่', min:8, book:'นำเข้าบทเรียน',
  T(){
    const url = K.localOnly ? K.pageURL('chat.html',{}) : K.pageURL('chat.html',{r:K.room});
    const list = boardTop();
    return `<div class="card"><div class="lobby"><div>${K.qrHTML(url,240)}</div><div>
        <span class="eyebrow">นำเข้าบทเรียน · ทุกคนใช้มือถือของตัวเอง</span>
        <h2 class="stitle">แชทขอแม่ไปคอนเสิร์ต</h2>
        <p class="big">ศิลปินที่ชอบมาไทยศุกร์หน้า บัตร ๒,๕๐๐ บาท แต่สัปดาห์นั้นมีสอบกลางภาค<br>พิมพ์ขอแม่ได้ไม่เกิน <b>๕ ข้อความ</b> แล้วส่งเข้าบอร์ดของห้อง</p>
        <div class="row"><a class="btn primary" href="${esc(K.localOnly?K.pageURL('chat.html',{board:'1'}):K.pageURL('chat.html',{r:K.room, board:'1'}))}" target="_blank" rel="noopener">เปิดบอร์ดโหวตบนจอ ↗</a><span class="note">${esc(url)}</span></div>
      </div></div></div>
      <div class="card"><div class="row between"><h3>แชทที่เพื่อนโหวตมากที่สุด</h3><span class="chip">${K.localOnly?'แบบจอเดียวไม่เห็นบอร์ดของมือถือ':'ส่งเข้าบอร์ดแล้ว '+th(list.length)+' แชท'}</span></div>
        ${list.length ? list.slice(0,5).map((p,i)=>`<div class="post"><span class="rank">${th(i+1)}</span>
            <div style="min-width:0"><div class="who">${esc(p.name)}${p.g?` · กลุ่ม ${p.g}`:''} ${p.decision?`<span class="chip">${esc(decTxt(p.decision))}</span>`:''} <span class="chip">${th(p.v)} โหวต</span></div><div class="prev">${esc(p.first)}</div></div>
            ${p.g?`<button class="btn sm" data-a="g" data-g="${p.g}">ให้แสตมป์กลุ่ม ${p.g}</button>`:'<span class="note">ไม่ได้ระบุกลุ่ม</span>'}</div>`).join('')
          : `<p class="note">${K.localOnly?'ใช้ปุ่ม "เปิดบอร์ดโหวตบนจอ" บนเครื่องนี้แทน':'ยังไม่มีแชทส่งเข้าบอร์ด'}</p>`}
        <div class="fb info big" style="margin-top:14px"><b>ชวนคิด:</b> แชทไหนแม่น่าจะยอมที่สุด <b>เพราะอะไร</b> คำตอบของเพื่อนคือ "เหตุผล" ที่เราจะเรียนวันนี้</div></div>`;
  },
  G(){
    const url = K.pageURL('chat.html',{r:K.room, g:String(K.group)});
    return `<div class="card"><span class="eyebrow">ทุกคนใช้มือถือของตัวเอง</span><h2 class="stitle">แชทขอแม่ไปคอนเสิร์ต</h2>
      <p>สแกน QR บนจอครูด้วยมือถือของแต่ละคน หรือกดปุ่มนี้บนเครื่องที่จะเล่น</p>
      <a class="btn primary block lg" href="${esc(url)}">เปิดแชทขอแม่</a>
      <p class="note" style="margin-top:10px">เครื่องนี้เป็นเครื่องของกลุ่ม ถ้าเปิดแชทแล้ว กดย้อนกลับเพื่อกลับมาหน้านี้</p></div>`;
  }
};

/* ---------- ขั้น ๒ เหตุ–ผล เรียกว่าอะไร (หน้า ๑) ---------- */
const know1 = {
  k:'know1', label:'เหตุ–ผลคืออะไร', min:3, book:'หน้า ๑',
  T(){ return know1HTML(); }, G(){ return know1HTML(); }
};
function know1HTML(){
  const k='know1';
  return `<div class="card"><div class="row between"><span class="eyebrow">หน้า ๑ ในเล่ม · ภาษากับการแสดงเหตุผล</span>${T_ONLY(K.revealAllBtn(k,7))}</div>
    <h2 class="stitle">"เหตุ" กับ "ผล" มีชื่อเรียกอื่นด้วย</h2>
    ${T_ONLY('<p class="slead">ให้นักเรียนทายก่อน แล้วแตะช่องเพื่อเฉลยทีละช่อง นักเรียนเติมลงเล่มตาม</p>')}
    <div class="kgrid" style="margin-top:8px">
      <div class="kbox"><h3>เหตุ</h3><div class="big">= ${blank(k,0,'สาเหตุ')} / ${blank(k,1,'ข้อสนับสนุน')} / ${blank(k,2,'ข้อรับรอง')}</div></div>
      <div class="kbox"><h3>ผล</h3><div class="big">= ${blank(k,3,'ข้อสรุป')}</div></div>
    </div>
    <div class="kbox" style="margin-top:14px"><h3>อ่านทิศทางให้ออก</h3>
      <div class="flow"><span class="node">เหตุ</span><span class="arr">${blank(k,4,'จึง')}<i>→</i></span><span class="node res">ผล</span></div>
      <div class="flow" style="margin-top:10px"><span class="node res">ผล</span><span class="arr">${blank(k,5,'เพราะ')}<i>→</i></span><span class="node">เหตุ</span></div>
    </div>
    <div class="kbox" style="margin-top:14px"><h3>ลองกับแชทเมื่อกี้</h3>
      <p class="big" style="margin:0">"อ่านหนังสือสอบครบทุกวิชาแล้ว <b class="kw">จึง</b>อยากขอไปคอนเสิร์ตนะคะ"</p>
      <p class="big" style="margin:6px 0 0">ส่วนหลัง "อยากขอไปคอนเสิร์ต" เป็น ${blank(k,6,'ผล (ข้อสรุป)')}</p>
    </div>
    ${T_ONLY('<p class="authored">ช่อง เหตุ/ผล และคำ จึง/เพราะ ตามเฉลยของครู · ประโยคแชทเป็นตัวอย่างที่แต่งขึ้น</p>')}
  </div>`;
}

/* ---------- ขั้น ๓ ด่านแยกตระกูลคำเชื่อม (หน้า ๑–๒) ---------- */
const FAM = [{v:'จึง',label:'ตระกูล "จึง"'},{v:'เพราะ',label:'ตระกูล "เพราะ"'}];
const sortStep = K.form({
  k:'sort', label:'แยกตระกูลคำเชื่อม', min:5, book:'หน้า ๑–๒', title:'ด่านแยกตระกูลคำเชื่อม', colItem:'คำเชื่อมในประโยค',
  opts:FAM, pay:[[8,10],[7,7],[6,5],[4,3],[1,1]],
  intro:(view,shown)=> shown ? '' : `<h2 class="stitle">คำเชื่อมตัวนี้อยู่ตระกูลไหน</h2>
    <p class="${view==='T'?'slead':'note'}">ตระกูล "จึง" ตามด้วย<b>ผล</b> · ตระกูล "เพราะ" ตามด้วย<b>เหตุ</b> ลองแทนคำด้วย จึง หรือ เพราะ แล้วอ่านดูว่าความหมายเหมือนเดิมไหม</p>`,
  items:[
    {text:'ฝนตกหนัก <b class="kw">เลย</b>งดเรียนพละกลางแจ้ง', ans:'จึง'},
    {text:'ร้านปิดเร็ว <b class="kw">เนื่องจาก</b>ของหมดตั้งแต่บ่าย', ans:'เพราะ'},
    {text:'เขาซ้อมทุกวัน <b class="kw">ดังนั้น</b>เขาวิ่งเข้าเส้นชัยเป็นคนแรก', ans:'จึง'},
    {text:'เธอร้องไห้<b class="kw">ด้วย</b>ความดีใจ', ans:'เพราะ'},
    {text:'เรามาช้า <b class="kw">ถึง</b>ไม่ทันรถรอบแรก', ans:'จึง'},
    {text:'<b class="kw">โดยที่</b>ผู้สมัครไม่ครบตามกำหนด ชมรมนี้ต้องงดรับสมาชิกปีนี้', ans:'เพราะ'},
    {text:'ห้องสมุดปิดซ่อม <b class="kw">ฉะนั้น</b>วันนี้ต้องไปอ่านหนังสือที่โรงอาหาร', ans:'จึง'},
    {text:'เขาเจ็บข้อเท้า<b class="kw">จาก</b>การเล่นบาสเมื่อวาน', ans:'เพราะ'}
  ],
  after:(view)=>`<div class="card"><span class="eyebrow">สรุปตามเล่ม หน้า ๑–๒</span><h2 class="stitle">คำเชื่อม ๒ ตระกูล</h2>
    <div class="fam" style="margin-top:8px">
      <div class="kbox"><h3>ตระกูล "จึง" → ตามด้วยผล</h3><div class="wordchips"><span>จึง</span><span>เลย</span><span>ดังนั้น</span><span>ถึง</span><span>ฉะนั้น</span><span>เพราะฉะนั้น</span></div></div>
      <div class="kbox"><h3>ตระกูล "เพราะ" → ตามด้วยเหตุ</h3><div class="wordchips"><span>เพราะ</span><span>เพราะว่า</span><span>เนื่องจาก</span><span>เนื่องด้วย</span><span>จาก</span><span>ด้วย</span><span>โดยที่</span></div></div>
    </div>
    <p class="${view==='T'?'big':''}" style="margin-top:12px">คำเชื่อมอยู่ได้หลายตำแหน่ง: <b>ระหว่าง</b>ข้อความสองส่วน · <b>หน้า</b>ข้อความ · หรือ<b>แทรก</b>อยู่ในข้อความ เช่น "คนไข้<b class="kw">จึง</b>โทรศัพท์ไปถาม…"</p>
    ${view==='T'?AUTH.replace('ในขั้นนี้','ในด่าน (๘ ข้อ)'):''}</div>`
});

/* ---------- ขั้น ๔ ไม่มีคำเชื่อม ทำอย่างไร (หน้า ๒–๓ ฟื้นฟูวิชา ๑) ---------- */
const LAB = [
  {a:'สนามฟุตบอลน้ำท่วมขังทั้งสนาม', b:'งดแข่งนัดเย็นนี้', ok:'จึง'},
  {a:'พี่สอบติดคณะที่ใฝ่ฝัน', b:'พี่อ่านหนังสือทุกคืนมาตลอดปี', ok:'เพราะ'}
];
function labHTML(){
  const L=(K.S.data.lab)||{};
  return '<div class="lab">'+LAB.map((x,i)=>{
    const pick=L[i];
    const verdict = !pick ? '' : (pick===x.ok
      ? `<div class="verdict ok">✓ อ่านได้ใจความ → ท่อนหลังเป็น <span class="tag ${pick==='จึง'?'effect':'cause'}">${pick==='จึง'?'ผล':'เหตุ'}</span> ท่อนหน้าเป็น <span class="tag ${pick==='จึง'?'cause':'effect'}">${pick==='จึง'?'เหตุ':'ผล'}</span></div>`
      : `<div class="verdict bad">✗ อ่านแล้วแปลก ความหมายไม่ต่อกัน ลองอีกคำ</div>`);
    return `<div class="labrow"><div class="pair"><span class="txt">${esc(x.a)}</span><span class="slot${pick?' on':''}">${pick?esc(pick):'?'}</span><span class="txt">${esc(x.b)}</span></div>
      ${K.role==='teacher'?`<div class="row" style="margin-top:8px"><span class="note">ลองเติมหน้าท่อนหลัง:</span><button class="btn sm${pick==='เพราะ'?' primary':''}" data-a="lab" data-i="${i}" data-v="เพราะ">เพราะ</button><button class="btn sm${pick==='จึง'?' primary':''}" data-a="lab" data-i="${i}" data-v="จึง">จึง</button>${pick?`<button class="btn sm ghost" data-a="lab" data-i="${i}" data-v="">ล้าง</button>`:''}</div>`:''}
      ${verdict}</div>`; }).join('')+'</div>';
}
const know2 = {
  k:'know2', label:'ไม่มีคำเชื่อม', min:4, book:'หน้า ๒–๓ (ฟื้นฟูวิชา ๑)',
  T(){ return know2HTML(); }, G(){ return know2HTML(); },
  on:{ lab(el){ K.update(S=>{ S.data.lab=S.data.lab||{}; if(el.dataset.v) S.data.lab[el.dataset.i]=el.dataset.v; else delete S.data.lab[el.dataset.i]; }); } }
};
function know2HTML(){
  const k='know2';
  return `<div class="card"><div class="row between"><span class="eyebrow">หน้า ๒–๓ · ฟื้นฟูวิชา ๑</span>${T_ONLY(K.revealAllBtn(k,6))}</div>
    <h2 class="stitle">ถ้าไม่มีคำเชื่อม จะรู้ได้อย่างไรว่าส่วนไหนเหตุ ส่วนไหนผล</h2>
    <div class="kgrid" style="margin-top:8px">
      <div class="kbox"><h3>ขั้นที่ ๑</h3><p class="big" style="margin:0">แบ่งข้อความที่ต้องการทดสอบออกเป็นส่วน ๆ</p></div>
      <div class="kbox"><h3>ขั้นที่ ๒</h3><p class="big" style="margin:0">เติมคำว่า ${blank(k,0,'เพราะ')} หรือคำว่า ${blank(k,1,'จึง')} หน้าข้อความ แล้วทดลองอ่าน</p></div>
    </div>
    <div class="kbox" style="margin-top:14px"><h3>อ่านผลการทดลอง</h3>
      <p class="big" style="margin:0">ข้อความที่เติมคำว่า ${blank(k,2,'จึง')} นำได้ ข้อความนั้นเป็น ${blank(k,3,'ผล')}</p>
      <p class="big" style="margin:8px 0 0">ข้อความที่เติมคำว่า ${blank(k,4,'เพราะ')} นำได้ ข้อความนั้นเป็น ${blank(k,5,'เหตุ')}</p>
    </div>
    <div class="kbox" style="margin-top:14px"><h3>ห้องทดลองเติมคำ</h3>${labHTML()}</div>
    ${T_ONLY(AUTH.replace('ในขั้นนี้','ในห้องทดลอง'))}
  </div>`;
}

/* ---------- ขั้น ๕ ป้ายวิเศษ (รอบสด) ---------- */
const SIGN = [
  {a:'เมื่อคืนดูซีรีส์ถึงตีสาม', b:'หลับในคาบแรกของวันนี้', ans:'จึง'},
  {a:'แม่ไม่ให้ใช้มือถือหลังสี่ทุ่ม', b:'ผลสอบเทอมที่แล้วตกสองวิชา', ans:'เพราะ'},
  {a:'ร้านหมูกระทะหน้าซอยคนแน่นทุกคืน', b:'ราคาถูกและน้ำจิ้มอร่อย', ans:'เพราะ'},
  {a:'ฝนตกหนักตั้งแต่บ่าย', b:'ต้องงดซ้อมกีฬาสีกลางสนาม', ans:'จึง'},
  {a:'เขาฝึกพูดภาษาจีนกับแอปทุกวัน', b:'สอบวัดระดับผ่านตั้งแต่ครั้งแรก', ans:'จึง'},
  {a:'ห้องสมุดเปิดถึงหกโมงเย็น', b:'โรงอาหารขายข้าวมันไก่', ans:'x'},
  {a:'ทีมฟุตซอลซ้อมหนักทุกเย็นตลอดเดือน', b:'คว้าแชมป์ระดับจังหวัดได้', ans:'จึง'},
  {a:'วันนี้ครูให้เลิกเรียนเร็วกว่าปกติ', b:'ช่วงบ่ายมีประชุมผู้ปกครอง', ans:'เพราะ'}
].map(it=>{
  const why = it.ans==='x' ? 'สองท่อนนี้ไม่ได้เป็นเหตุเป็นผลกัน เติม "เพราะ" หรือ "จึง" แล้วอ่านไม่ได้ใจความ จึงไม่ใช่การแสดงเหตุผล'
    : it.ans==='จึง' ? 'เติม "จึง" หน้าท่อนหลังแล้วอ่านได้ใจความ → ท่อนหลังเป็น<b>ผล</b> ท่อนหน้าเป็น<b>เหตุ</b>'
    : 'เติม "เพราะ" หน้าท่อนหลังแล้วอ่านได้ใจความ → ท่อนหลังเป็น<b>เหตุ</b> ท่อนหน้าเป็น<b>ผล</b>';
  return Object.assign(it,{why, whyG: it.ans==='x'?'สองท่อนไม่เกี่ยวกัน':(it.ans==='จึง'?'ท่อนหน้าเป็นเหตุ ท่อนหลังเป็นผล':'ท่อนหน้าเป็นผล ท่อนหลังเป็นเหตุ')});
});
const roleTag=(it,part)=>{ if(it.ans==='x') return ''; const cause = (it.ans==='จึง') === (part==='a'); return `<span class="tag ${cause?'cause':'effect'}">${cause?'เหตุ':'ผล'}</span>`; };
const signStep = K.rounds({
  k:'sign', label:'ป้ายวิเศษ', min:10, book:'ฝึกวิธีทดสอบ หน้า ๓', title:'ป้ายวิเศษ',
  lead:'ครูอ่านสองท่อน เว้นจังหวะตรงรอยต่อ แต่ละกลุ่มเลือกคำที่เติมตรงรอยต่อแล้วอ่านได้ใจความ ถ้าสองท่อนไม่เป็นเหตุเป็นผลกัน ให้เลือก "ไขว้แขน" (ใช้ป้ายกระดาษชูพร้อมกันด้วยก็ได้)',
  opts:[{v:'เพราะ',label:'เพราะ'},{v:'จึง',label:'จึง'},{v:'x',label:'ไขว้แขน', sub:'ไม่ใช่เหตุผล'}],
  pay:[[8,10],[7,7],[6,5],[4,3],[1,1]],
  items:SIGN,
  show:(it, shown)=>`<div class="pair"><span class="part"><span class="txt">${esc(it.a)}</span>${shown?roleTag(it,'a'):''}</span>
      <span class="slot${shown?' on':''}${shown&&it.ans==='x'?' none':''}">${shown?(it.ans==='x'?'✕':esc(it.ans)):'?'}</span>
      <span class="part"><span class="txt">${esc(it.b)}</span>${shown?roleTag(it,'b'):''}</span></div>`
});
signStep.T = (orig=>function(){ return orig.call(this) + AUTH.replace('<p','<p style="margin:0 4px"'); })(signStep.T);

/* ---------- ขั้น ๖ เติมเล่ม + เฉลย หน้า ๑–๓ ---------- */
function bookHTML(){
  const k='book'; let i=0; const b=(t)=>blank(k,i++,t);
  const rows = bookRows(b);
  return `<div class="card"><div class="row between"><span class="eyebrow">เติมในเล่ม หน้า ๑–๓ แล้วเฉลยพร้อมกัน</span>${T_ONLY(K.revealAllBtn(k,i))}</div>
    <h2 class="stitle">เฉลยชุดกิจกรรม หน้า ๑–๓</h2>
    ${T_ONLY('<p class="slead">ให้เวลาเติมเล่มก่อน แล้วแตะเฉลยทีละช่อง เฉลยตามไฟล์เฉลยของครู</p>')}
    <table class="tbl big">
      <tr><th style="width:150px">ตำแหน่ง</th><th>เฉลย</th></tr>${rows}
    </table>
    ${T_ONLY('<p class="authored">หน้านี้แสดงเฉพาะคำตอบ ไม่ได้คัดข้อความในเล่มมาทั้งหมด นักเรียนดูโจทย์จากเล่มของตัวเอง</p>')}
  </div>`;
}
function bookRows(b){
  return `
      <tr><td>หน้า ๑ บนสุด</td><td>เหตุ = ${b('สาเหตุ')} / ${b('ข้อสนับสนุน')} / ${b('ข้อรับรอง')} · ผล = ${b('ข้อสรุป')}</td></tr>
      <tr><td>หน้า ๑ ตารางแรก<br><span class="note">คำเชื่อมระหว่างข้อความ</span></td><td>เลย = ${b('จึง')} · เนื่องจาก = ${b('เพราะ')} · ดังนั้น = ${b('จึง')} · ถึง = ${b('จึง')} · จาก = ${b('เพราะ')} · ด้วย = ${b('เพราะ')}<br>
        แถวที่ใช้ "จึง": ข้อความข้างหน้า = ${b('เหตุ')} ข้อความต่อมา = ${b('ผล')}<br>แถวที่ใช้ "เพราะ": ข้อความข้างหน้า = ${b('ผล')} ข้อความต่อมา = ${b('เหตุ')}</td></tr>
      <tr><td>หน้า ๑ ตารางที่สอง<br><span class="note">คำเชื่อมหน้าข้อความ</span></td><td>เพราะว่า / โดยที่ / เนื่องด้วย + ข้อความ = ${b('เหตุ')}<br>เพราะฉะนั้น / ฉะนั้น / จึง + ข้อความ = ${b('ผล')}</td></tr>
      <tr><td>หน้า ๒ ตาราง<br><span class="note">คำเชื่อมตำแหน่งอื่น</span></td><td>แถว ๑ ${b('จึง')} · แถว ๒ ${b('เลย (= จึง)')} · แถว ๓ ${b('จึง')} · แถว ๔ ${b('จึง')}</td></tr>
      <tr><td>หน้า ๒ ไม่ใช้คำเชื่อม<br><span class="note">คำที่เติมได้ ๗ ข้อ</span></td><td>ข้อ ๑ ${b('จึง')} · ข้อ ๒ ${b('จึง')} · ข้อ ๓ ${b('เพราะ')} · ข้อ ๔ ${b('จึง')} · ข้อ ๕ ${b('เพราะ')} · ข้อ ๖ ${b('เพราะ')} · ข้อ ๗ ${b('จึง')}</td></tr>
      <tr><td>หน้า ๓ ฟื้นฟูวิชา ๑<br><span class="note">ขั้นที่ ๑ ตัวอย่าง ๓ ข้อ</span></td><td>ข้อ ๑ ${b('เพราะ')} · ข้อ ๒ ${b('จึง')} · ข้อ ๓ ${b('เพราะ')}</td></tr>
      <tr><td>หน้า ๓ ขั้นที่ ๒</td><td>เติมคำว่า ${b('เพราะ')} หรือ ${b('จึง')} · เติม "จึง" นำได้ → ${b('ผล')} · เติม "เพราะ" นำได้ → ${b('เหตุ')}<br>
        ตัวอย่าง ๑ ${b('ผล – เพราะ – เหตุ')} · ตัวอย่าง ๒ ${b('เหตุ – จึง – ผล')} · ตัวอย่าง ๓ ${b('เหตุ – จึง – ผล')}</td></tr>`;
}
const bookStep = { k:'book', label:'เฉลยเล่ม', min:7, book:'หน้า ๑–๓', T(){ return bookHTML(); }, G(){ return bookHTML(); } };

/* ---------- ขั้น ๗ ตั๋วออก ---------- */
const exitStep = K.form({
  k:'exit', label:'ตั๋วออก', min:3, book:'ทบทวนคาบนี้', title:'ตั๋วออก', colItem:'คำถาม',
  pay:[[3,5],[2,3],[1,1]],
  intro:(view,shown)=> shown ? '' : `<h2 class="stitle">ตอบ ๓ ข้อก่อนออกจากห้อง</h2><p class="note">ปรึกษากันในกลุ่มได้ ส่งคำตอบเดียว</p>`,
  items:[
    {text:'"ตื่นสาย<b class="kw">จึง</b>มาไม่ทันเข้าแถว" ส่วน "มาไม่ทันเข้าแถว" เป็นอะไร', opts:[{v:'เหตุ',label:'เหตุ'},{v:'ผล',label:'ผล'}], ans:'ผล'},
    {text:'คำเชื่อมใดตามด้วย<b>เหตุ</b>', opts:[{v:'ฉะนั้น',label:'ฉะนั้น'},{v:'เนื่องด้วย',label:'เนื่องด้วย'},{v:'เลย',label:'เลย'}], ans:'เนื่องด้วย'},
    {text:'"สนามแฉะทั้งสนาม / งดแข่งนัดเย็นนี้" เติมคำใดหน้าท่อนหลังแล้วอ่านได้ใจความ', opts:[{v:'เพราะ',label:'เพราะ'},{v:'จึง',label:'จึง'},{v:'x',label:'ไม่ใช่เหตุผล'}], ans:'จึง'}
  ],
  after:(view)=>`<div class="card"><p class="${view==='T'?'big':''}" style="margin:0">ข้อ ๓: เติม "จึง" ได้ → "งดแข่งนัดเย็นนี้" เป็น<b>ผล</b> "สนามแฉะ" เป็น<b>เหตุ</b></p>${view==='T'?AUTH.replace('ในขั้นนี้','ในตั๋วออก'):''}</div>`
});

K.watch('board','board', ()=>K.role==='teacher' && K.per==='p1' && K.stepKey==='chat');
K.period({
  css: P1_CSS,
  per:'p1', title:'คาบ ๑ เหตุและผล', short:'คาบ ๑', accent:'reason', plan:true,
  lead:'นำเข้าด้วยแชทขอแม่ แล้วแยกเหตุกับผล ทั้งแบบมีคำเชื่อมและไม่มีคำเชื่อม (เล่มหน้า ๑–๓)',
  steps:[{k:'lobby', label:'เตรียมกลุ่ม'}, chatStep, know1, sortStep, know2, signStep, bookStep, exitStep, {k:'end', label:'สรุปแสตมป์'}],
  endNote:'<h3 style="margin-bottom:6px">คาบหน้า: คาบ ๒ โครงสร้างการแสดงเหตุผล</h3><p style="margin:0">โครงสร้าง ๓ แบบ หน้า ๔–๖ และทักษะวัฒนา ๑ หน้า ๗ · กลุ่มเดิมใช้ต่อได้</p>'
});
})();
