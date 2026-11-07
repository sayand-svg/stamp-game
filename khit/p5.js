/* p5.js — คาบ ๕ ภาษากับการโต้แย้ง (เอกสารประกอบการเรียน บทที่ ๔ หน้า ๑๓–๑๖)
   เน้นเทคนิควิเคราะห์ข้อสอบ: ดูว่ามีการโต้แย้งหรือไม่ · หาประเด็นโต้แย้ง · ตัดตัวเลือกด้วยป้าย
   ประโยคและข้อความทุกข้อในคาบนี้แต่งขึ้นใหม่ ไม่ซ้ำแบบฝึกที่ ๔ และแบบทดสอบท้ายหน่วย */
(function(){
'use strict';
const P5_CSS = `
.sigtbl td:first-child{width:48px}
.pat{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-top:10px}
.pat .kbox p{margin:4px 0 0}
.pat .kbox .ex{color:var(--muted);font-size:.92em;margin-top:6px}
.vs{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:stretch;margin-top:10px}
.vs .side{border:2px solid var(--line);border-radius:var(--r);padding:14px 16px;background:var(--card)}
.vs .side h4{font-family:var(--f-disp);font-weight:500;font-size:16px;color:var(--muted);margin:0 0 6px}
.vs .side.me{border-color:var(--accent-mid);background:var(--accent-soft)}
.vs .mid{display:grid;place-items:center;font-family:var(--f-disp);font-size:30px;color:var(--accent)}
.issue{margin-top:12px;border:2.5px dashed var(--accent);border-radius:var(--r);padding:14px 16px;text-align:center}
.issue h4{font-family:var(--f-disp);font-weight:500;font-size:16px;color:var(--accent);margin:0 0 4px}
@media (max-width:700px){.vs{grid-template-columns:1fr}.vs .mid{transform:rotate(90deg);font-size:24px}}
.psg{background:var(--sunk);border-left:5px solid var(--accent-mid);border-radius:0 var(--r) var(--r) 0;padding:14px 18px;line-height:1.75}
.T .psg{font-size:clamp(19px,1.7vw,26px)}
.G .psg{font-size:16px;padding:10px 12px}
.psg .q{display:block;font-family:var(--f-disp);font-size:.8em;color:var(--accent);margin-bottom:4px}
.choice{margin-top:14px;border:2.5px solid var(--accent-mid);border-radius:var(--r);padding:12px 18px;background:var(--card)}
.choice small{display:block;font-family:var(--f-disp);color:var(--muted);font-size:14px}
.choice b{font-family:var(--f-disp);font-weight:500;font-size:clamp(22px,2.3vw,34px);line-height:1.45}
.G .choice b{font-size:20px}
.labtag{display:inline-block;margin-top:10px;padding:3px 14px;border-radius:999px;font-family:var(--f-disp);font-size:18px;background:var(--ok-soft);color:var(--ok)}
.labels{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.labels span{padding:4px 14px;border-radius:999px;background:var(--sunk);font-family:var(--f-disp);font-size:16px}
.labels span b{font-weight:500;color:var(--accent)}
.opts.c5{grid-template-columns:1fr 1fr}
.opts.c5 .opt:first-child{grid-column:1/-1}
.why8{margin:0;padding-left:1.4em}
.why8 li{margin:4px 0}
.authored{font-size:13px;color:var(--soft);margin-top:12px}
`;
const {th, esc, blank} = K;
const T_ONLY = (html)=>K.role==='teacher' ? html : '';
const AUTH = (what)=>T_ONLY(`<p class="authored">${what}แต่งขึ้นใหม่สำหรับคาบนี้ ไม่ซ้ำแบบฝึกที่ ๔ และแบบทดสอบท้ายหน่วย ควรอ่านทวนก่อนใช้</p>`);

/* ---------- ขั้น ๑ หลักแกน: ค้านความคิดของใคร ---------- */
const coreStep = {
  k:'core', label:'ค้านความคิดของใคร', min:5, book:'บทที่ ๔ หน้า ๑๓',
  T(){ return coreHTML(); }, G(){ return coreHTML(); }
};
function coreHTML(){
  const k='core';
  return `<div class="card"><div class="row between"><span class="eyebrow">หลักแกนของข้อสอบการโต้แย้ง</span>${T_ONLY(K.revealAllBtn(k,9))}</div>
    <h2 class="stitle">การโต้แย้งต้องมีความคิด ${blank(k,0,'๒ ฝั่ง')} ที่ขัดกันเสมอ</h2>
    ${T_ONLY('<p class="slead">ถามนักเรียนก่อนเฉลยทีละช่อง: ทรรศนะกับการโต้แย้งต่างกันตรงไหน</p>')}
    <div class="kgrid" style="margin-top:8px">
      <div class="kbox"><h3>ทรรศนะ</h3><p class="big" style="margin:0">ความเห็น ${blank(k,1,'เดียว')} ของผู้พูด<br><span class="note">เช่น "นักเรียนควรนำขวดน้ำมาเอง"</span></p></div>
      <div class="kbox"><h3>การโต้แย้ง</h3><p class="big" style="margin:0">ความเห็นที่ ${blank(k,2,'ค้าน')} อีกความเห็นหนึ่ง<br><span class="note">ฝั่งที่ถูกค้านอาจไม่ได้เขียนไว้ตรง ๆ</span></p></div>
    </div>
    <div class="fb info big" style="text-align:center;margin-top:14px">ถามตัวเองทุกข้อ: <b>"ข้อความนี้ค้านความคิดของ ${blank(k,3,'ใคร')}"</b><br><span class="note">หาความคิดที่ถูกค้านไม่เจอ = ไม่ใช่การโต้แย้ง แม้จะมีคำว่า ควร หรือ น่าจะ</span></div>
    <h3 style="margin-top:18px">สัญญาณของการโต้แย้ง ๔ แบบ</h3>
    <div class="pat">
      <div class="kbox"><h3>อ้างความเชื่อคนอื่นแล้วค้าน</h3><p>${blank(k,4,'มักพูดกันว่า · บางคนคิดว่า')}</p><p class="ex">หลายคนเชื่อว่า… แต่…</p></div>
      <div class="kbox"><h3>ยอมรับก่อนแล้วแย้ง</h3><p>${blank(k,5,'…ก็จริง แต่ · แม้ว่า…แต่')}</p><p class="ex">สะดวกก็จริง แต่…</p></div>
      <div class="kbox"><h3>ปฏิเสธความคิดทั้งก้อน</h3><p>${blank(k,6,'…ไม่จริง · ใช่ว่า · หาใช่…ไม่')}</p><p class="ex">ใช่ว่าทุกคนจะ…</p></div>
      <div class="kbox"><h3>เตือนไม่ให้เชื่อ</h3><p>${blank(k,7,'อย่าคิดว่า · ไม่ได้มีแต่…เท่านั้น')}</p><p class="ex">อย่าคิดว่า…</p></div>
    </div>
    <div class="fb bad" style="margin-top:14px"><b>กับดัก:</b> "แต่" ที่ขัดกันแค่ ${blank(k,8,'ข้อเท็จจริง')} ไม่ใช่การโต้แย้ง เช่น "ฝนตกหนัก แต่นักเรียนมาครบ" ไม่มีความคิดของใครถูกค้าน</div>
  </div>`;
}

/* ---------- ขั้น ๒ จับสัญญาณโต้แย้ง (ส่งพร้อมกัน) ---------- */
const YN = [{v:'y',label:'✓ มีการโต้แย้ง'},{v:'n',label:'✗ ไม่มี'}];
const SIG = [
  {text:'หลายคนเชื่อว่าอ่านหนังสือตอนดึกจะจำได้ดีกว่า แต่การอดนอนกลับทำให้ความจำแย่ลง', ans:'y', why:'อ้างความเชื่อของคนอื่น ("หลายคนเชื่อว่า") แล้วค้าน'},
  {text:'ห้องสมุดโรงเรียนให้ยืมหนังสือได้ครั้งละ ๓ เล่ม', ans:'n', why:'บอกข้อเท็จจริง ไม่มีความคิดของใครถูกค้าน'},
  {text:'ใช่ว่าคนที่พูดเก่งทุกคนจะเป็นผู้นำที่ดี', ans:'y', why:'"ใช่ว่า" ปฏิเสธความคิดที่ว่าพูดเก่ง = ผู้นำที่ดี'},
  {text:'นักเรียนควรนำขวดน้ำมาเองเพื่อลดขยะพลาสติก', ans:'n', why:'เสนอแนะด้านเดียว เป็นทรรศนะ แต่ไม่ได้ค้านความเห็นใด'},
  {text:'การเรียนออนไลน์สะดวกก็จริง แต่ทำให้ขาดการฝึกทำงานร่วมกับเพื่อน', ans:'y', why:'ยอมรับก่อน ("สะดวกก็จริง") แล้วแย้ง'},
  {text:'ฝนตกหนักตั้งแต่เช้า แต่นักเรียนก็มาเข้าแถวครบทุกห้อง', ans:'n', why:'กับดัก: "แต่" ขัดกันแค่ข้อเท็จจริงสองเรื่อง ไม่มีความเห็นถูกค้าน'},
  {text:'อย่าคิดว่าเกมทุกเกมทำให้เด็กก้าวร้าว เกมฝึกวางแผนก็มีไม่น้อย', ans:'y', why:'"อย่าคิดว่า" เตือนไม่ให้เชื่อความคิดหนึ่ง แล้วให้เหตุผลค้าน'},
  {text:'ตลาดน้ำแห่งนี้มีนักท่องเที่ยวมากขึ้นเพราะมีรถไฟมาจอดหน้าตลาด', ans:'n', why:'บอกเหตุและผลธรรมดา ไม่ได้ค้านความคิดใคร'}
];
const sigStep = K.form({
  k:'sig', label:'จับสัญญาณโต้แย้ง', min:7, book:'บทที่ ๔ เคล็ดลับหน้า ๑๔', title:'จับสัญญาณโต้แย้ง', colItem:'ข้อความ',
  opts:YN, pay:[[8,10],[7,7],[6,5],[4,3],[1,1]],
  intro:(view,shown)=> shown ? '' : `<h2 class="stitle">ข้อความไหนมีการโต้แย้ง</h2>
    <p class="${view==='T'?'slead':'note'}">ถามทุกข้อ: ค้านความคิดของใคร · มองหาสัญญาณ ๔ แบบ · ระวังกับดัก "แต่"</p>`,
  items:SIG.map(x=>({text:esc(x.text), ans:x.ans})),
  after:(view)=>`<div class="card"><span class="eyebrow">เหตุผลของเฉลย</span>
    <ol class="why8 ${view==='T'?'big':''}">${SIG.map(x=>`<li><b>${x.ans==='y'?'✓':'✗'}</b> ${esc(x.why)}</li>`).join('')}</ol>
    ${AUTH('ข้อความทั้ง ๘ ข้อ')}</div>`
});

/* ---------- ขั้น ๓ ผังสองฝั่ง (ครูพาทำ) ---------- */
const mapStep = {
  k:'map', label:'ผังสองฝั่ง', min:7, book:'บทที่ ๔ หน้า ๑๓ (กระบวนการโต้แย้ง ขั้นที่ ๑)',
  T(){ return mapHTML(); }, G(){ return mapHTML(); }
};
function mapHTML(){
  const k='map';
  return `<div class="card"><div class="row between"><span class="eyebrow">หาประเด็นโต้แย้ง ๔ ขั้น · ครูพาทำ</span>${T_ONLY(K.revealAllBtn(k,6))}</div>
    <h2 class="stitle">ประเด็น = คำถามที่ผู้เขียนกับฝ่ายตรงข้ามตอบต่างกัน</h2>
    <div class="psg" style="margin-top:8px">หลายโรงเรียนห้ามนักเรียนนำโทรศัพท์มือถือเข้าห้องเรียน เพราะเชื่อว่าโทรศัพท์ทำให้เสียสมาธิ แต่โทรศัพท์ก็เป็นเครื่องมือค้นคว้าที่ดี หากครูกำหนดวิธีใช้ให้ชัดเจน โรงเรียนจึงควรสอนให้นักเรียนใช้โทรศัพท์อย่างถูกวิธี มากกว่าจะห้ามใช้ทั้งหมด</div>
    <div class="kbox" style="margin-top:12px"><h3>ขั้นที่ ๑ ขีดเส้นใต้คำสัญญาณ</h3><p class="big" style="margin:0">${blank(k,0,'เพราะเชื่อว่า · แต่ · จึงควร')}</p></div>
    <div class="vs">
      <div class="side"><h4>ขั้นที่ ๒ ความเห็นที่ถูกค้าน</h4><div class="big">${blank(k,1,'ควรห้ามนำโทรศัพท์เข้าห้องเรียน')}</div></div>
      <div class="mid">⟷</div>
      <div class="side me"><h4>ขั้นที่ ๓ จุดยืนของผู้เขียน (หลัง "จึงควร")</h4><div class="big">${blank(k,2,'สอนให้ใช้อย่างถูกวิธี ไม่ห้ามทั้งหมด')}</div></div>
    </div>
    <div class="issue"><h4>ขั้นที่ ๔ ตั้งเป็นคำถาม "…หรือไม่ / …จริงหรือ"</h4><div class="huge" style="margin:0">${blank(k,3,'โรงเรียนควรห้ามนักเรียนใช้โทรศัพท์ในห้องเรียนหรือไม่')}</div></div>
    <div class="kbox" style="margin-top:12px"><h3>ทดสอบสองเสียง</h3><p class="big" style="margin:0">อ่านคำถามออกเสียง ให้เพื่อนคนหนึ่งตอบแทนผู้เขียน อีกคนตอบแทนฝ่ายตรงข้าม<br>
      ผู้เขียนตอบ ${blank(k,4,'ไม่ควร')} · ฝ่ายตรงข้ามตอบ ${blank(k,5,'ควร')} → ตอบต่างกัน จึงเป็นประเด็น</p></div>
    ${AUTH('ข้อความในขั้นนี้')}
  </div>`;
}

/* ---------- ขั้น ๔ ป้ายตัดตัวเลือก (รอบสด) ---------- */
const LABELS = [
  {v:'ok', label:'เป็นประเด็น', sub:'สองฝ่ายตอบต่างกัน'},
  {v:'wide', label:'กว้างไป', sub:'ใหญ่กว่าเรื่องที่แย้ง'},
  {v:'narrow', label:'แคบไป', sub:'ประเด็นย่อยข้อเดียว'},
  {v:'agree', label:'ไม่มีใครเถียง', sub:'ทุกฝ่ายตอบเหมือนกัน'},
  {v:'side', label:'ผิดฝั่ง', sub:'เป็นความเห็นฝ่ายที่ถูกค้าน'}
];
const LBL = (v)=>(LABELS.find(x=>x.v===v)||{}).label||v;
const PSG = {
  a:{q:'ข้อใดเป็นประเด็นโต้แย้งของข้อความนี้',
     t:'ชุมชนริมคลองแห่งหนึ่งมีแผนถมคลองสายเล็กเพื่อขยายถนน ฝ่ายที่สนับสนุนให้เหตุผลว่าถนนที่กว้างขึ้นจะช่วยลดรถติดช่วงเช้า แต่คลองสายนี้เป็นทางระบายน้ำหลักของชุมชน ถ้าถมคลอง น้ำจะท่วมบ้านเรือนทุกครั้งที่ฝนตกหนัก การถมคลองเพื่อขยายถนนจึงสร้างปัญหาใหม่ที่ร้ายแรงกว่าปัญหาเดิม'},
  b:{q:'ข้อความนี้สนับสนุนข้อใด (ตัวเลือกเป็นประโยคบอกเล่า)',
     t:'บางคนเห็นว่าการให้นักเรียนประเมินการสอนของครูจะทำให้ครูเสียกำลังใจ แต่เมื่อครูได้อ่านความเห็นของนักเรียน ครูก็รู้ว่าควรปรับวิธีสอนตรงไหน และนักเรียนก็กล้าบอกปัญหาการเรียนของตนมากขึ้น'}
};
const CUT = [
  {p:'a', c:'ถ้าถมคลอง น้ำจะท่วมบ้านเรือนทุกครั้งที่ฝนตกหนักจริงหรือ', ans:'narrow',
   why:'เป็นเหตุผลข้อหนึ่งของผู้เขียน ยังเถียงกันได้ แต่เป็นแค่ประเด็นย่อย ไม่ใช่เรื่องที่สองฝ่ายขัดกันทั้งเรื่อง'},
  {p:'a', c:'ควรถมคลองสายนี้เพื่อขยายถนนหรือไม่', ans:'ok',
   why:'ฝ่ายสนับสนุนตอบ "ควร" ผู้เขียนตอบ "ไม่ควร" ตรงกับจุดที่ผู้เขียนแย้ง ("…จึงสร้างปัญหาใหม่…")'},
  {p:'a', c:'ชุมชนริมคลองแห่งนี้มีรถติดช่วงเช้าหรือไม่', ans:'agree',
   why:'ฝ่ายสนับสนุนยกเรื่องรถติดมาเอง ผู้เขียนก็ไม่ได้ปฏิเสธ ทุกฝ่ายตอบเหมือนกันว่า "มี"'},
  {p:'a', c:'ควรขยายถนนในชุมชนริมคลองทุกแห่งหรือไม่', ans:'wide',
   why:'ผู้เขียนแย้งเฉพาะการถมคลองสายนี้ ไม่ได้พูดถึงชุมชนริมคลองทุกแห่ง'},
  {p:'b', c:'การให้นักเรียนประเมินการสอนทำให้ครูเสียกำลังใจ', ans:'side',
   why:'เป็นความเห็นของ "บางคน" ที่ผู้เขียนยกมาค้าน ไม่ใช่สิ่งที่ข้อความสนับสนุน'},
  {p:'b', c:'นักเรียนกล้าบอกปัญหาการเรียนของตนมากขึ้น', ans:'narrow',
   why:'เป็นข้อสนับสนุนข้อเดียวในข้อความ ยังไม่ใช่ข้อสรุปที่ข้อสนับสนุนทั้งหมดพาไป'},
  {p:'b', c:'โรงเรียนควรให้นักเรียนประเมินการสอนของครู', ans:'ok',
   why:'ข้อสนับสนุนทุกข้อ (ครูรู้ว่าควรปรับตรงไหน · นักเรียนกล้าบอกปัญหา) พาไปสู่ข้อสรุปนี้ และค้านกับความเห็นของ "บางคน"'},
  {p:'b', c:'ทุกฝ่ายในโรงเรียนควรมีส่วนร่วมพัฒนาการศึกษา', ans:'wide',
   why:'ใหญ่กว่าเรื่องที่ข้อความพูด ข้อความพูดเฉพาะการให้นักเรียนประเมินการสอน'}
].map(it=>Object.assign(it,{whyG:it.why}));
const cutStep = K.rounds({
  k:'cut', label:'ป้ายตัดตัวเลือก', min:12, book:'บทที่ ๔ เคล็ดลับหน้า ๑๔', title:'ป้ายตัดตัวเลือก',
  lead:'ครูอ่านข้อความ แล้วอ่านตัวเลือกทีละข้อ แต่ละกลุ่มติดป้ายให้ตัวเลือกนั้น ทำ ๒ ข้อความ ข้อความละ ๔ ตัวเลือก ข้อความที่ ๒ ตัวเลือกเป็นประโยคบอกเล่า จึงมีป้าย "ผิดฝั่ง" เพิ่ม',
  opts:LABELS, pay:[[8,10],[7,7],[6,5],[4,3],[1,1]],
  items:CUT,
  show:(it, shown, view)=>{
    const P=PSG[it.p], first = CUT.findIndex(x=>x.p===it.p)===CUT.indexOf(it);
    return `${view==='T' && first && !shown ? `<div class="labels">${LABELS.map(l=>`<span><b>${esc(l.label)}</b> ${esc(l.sub)}</span>`).join('')}</div>`:''}
      <div class="psg" style="margin-top:10px"><span class="q">ข้อความที่ ${it.p==='a'?'๑':'๒'} · ${esc(P.q)}</span>${esc(P.t)}</div>
      <div class="choice"><small>ตัวเลือกนี้</small><b>${esc(it.c)}</b>${shown?`<div><span class="labtag">${esc(LBL(it.ans))}</span></div>`:''}</div>`;
  }
});
cutStep.T = (orig=>function(){ return orig.call(this) + AUTH('ข้อความและตัวเลือกทั้งหมดในขั้นนี้'); })(cutStep.T);

/* ---------- ขั้น ๕ ตั๋วออก ---------- */
const exitStep = K.form({
  k:'exit', label:'ตั๋วออก', min:3, book:'ทบทวนคาบนี้', title:'ตั๋วออก', colItem:'คำถาม',
  pay:[[3,5],[2,3],[1,1]],
  intro:(view,shown)=> shown ? '' : `<h2 class="stitle">ตอบ ๓ ข้อก่อนออกจากห้อง</h2><p class="note">ปรึกษากันในกลุ่มได้ ส่งคำตอบเดียว</p>`,
  items:[
    {text:'"ใช่ว่าคนเรียนเก่งทุกคนจะทำงานเก่ง" มีการโต้แย้งหรือไม่', opts:YN, ans:'y'},
    {text:'ข้อความ: "หลายคนคิดว่าอาหารแพงต้องอร่อยกว่า แต่ร้านริมทางหลายร้านก็อร่อยไม่แพ้กัน" ตัวเลือก "คนไทยควรกินอาหารให้หลากหลายหรือไม่" ติดป้ายใด',
     opts:[{v:'wide',label:'กว้างไป'},{v:'narrow',label:'แคบไป'},{v:'agree',label:'ไม่มีใครเถียง'}], ans:'wide'},
    {text:'"ร้านค้าปิดเร็ว แต่ถนนยังมีคนเดินพลุกพล่าน" มีการโต้แย้งหรือไม่', opts:YN, ans:'n'}
  ],
  after:(view)=>`<div class="card"><p class="${view==='T'?'big':''}" style="margin:0">ข้อ ๑ "ใช่ว่า" ปฏิเสธความคิดหนึ่ง · ข้อ ๒ ข้อความพูดเรื่องราคากับความอร่อย ไม่ได้พูดถึงการกินให้หลากหลาย · ข้อ ๓ "แต่" ขัดกันแค่ข้อเท็จจริง</p>${AUTH('คำถามในตั๋วออก')}</div>`
});

K.period({
  css: P5_CSS,
  per:'p5', title:'คาบ ๕ ภาษากับการโต้แย้ง', short:'คาบ ๕', accent:'argue', plan:true,
  lead:'ฝึกวิเคราะห์ข้อสอบการโต้แย้ง: ดูว่าข้อความมีการโต้แย้งหรือไม่ แล้วหาประเด็นและตัดตัวเลือก (เอกสารบทที่ ๔ หน้า ๑๓–๑๖)',
  steps:[{k:'lobby', label:'เตรียมกลุ่ม'}, coreStep, sigStep, mapStep, cutStep, exitStep, {k:'end', label:'สรุปแสตมป์'}],
  endNote:'<h3 style="margin-bottom:6px">การบ้าน: แบบฝึกที่ ๔ ในเอกสาร หน้า ๑๔–๑๖</h3><p style="margin:0">ตอนที่ ๑ ใช้สัญญาณ ๔ แบบ · ตอนที่ ๓ ใช้ผังสองฝั่งและป้ายตัดตัวเลือก · คาบหน้า: ทบทวนทั้งหน่วย</p>'
});
})();
