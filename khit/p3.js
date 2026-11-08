/* p3.js — คาบ ๓ ภาษากับการแสดงทรรศนะ (ชุดกิจกรรม ภาษาแสดงความคิด หน้า ๘–๑๒)
   เฉลยช่องว่างและคำในกรอบตามที่ครูเติมไว้ในเล่ม · ประโยคในกาชาทรรศนะ ตบแมลงวัน และตั๋วออกแต่งขึ้นใหม่
   ทักษะวัฒนา ๒ ใช้ข้อความจากเล่ม หน้า ๑๒ */
(function(){
'use strict';
const P3_CSS = `
.opts.c4{grid-template-columns:1fr 1fr}
.lang4{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px}
@media (max-width:700px){.lang4{grid-template-columns:1fr}}
.G .lang4{grid-template-columns:1fr}
.lang4 .kbox .no{font-family:var(--f-disp);color:var(--muted);font-size:14px}
.lang4 .kbox p{margin:6px 0 0}
.cap{position:relative;margin-top:12px;border:3px solid var(--accent-mid);border-radius:44px;overflow:hidden;background:var(--card)}
.cap .lid{height:18px;background:repeating-linear-gradient(90deg,var(--accent-mid) 0 22px,var(--accent-soft) 22px 44px)}
.cap .in{padding:18px 26px 22px;font-family:var(--f-disp);font-weight:500;font-size:clamp(24px,2.6vw,40px);line-height:1.5;text-align:center}
.G .cap{border-radius:26px}.G .cap .in{font-size:20px;padding:12px 14px 16px}
.cap mark{background:var(--accent-soft);color:var(--accent);border-bottom:3px solid var(--accent);padding:0 .15em;border-radius:6px}
.captag{display:inline-block;margin-top:10px;padding:4px 16px;border-radius:999px;font-family:var(--f-disp);font-size:19px;background:var(--ok-soft);color:var(--ok)}
.fly{margin-top:12px;border:2.5px dashed var(--line2);border-radius:var(--r);padding:16px 20px;font-family:var(--f-disp);font-weight:500;font-size:clamp(22px,2.4vw,36px);line-height:1.5;background:var(--card)}
.G .fly{font-size:19px;padding:10px 12px}
.memo{margin-top:12px;border:3px double var(--accent-mid);border-radius:var(--r);padding:12px 18px;background:var(--accent-soft)}
.memo .r{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;padding:6px 0;font-size:clamp(18px,1.8vw,26px)}
.G .memo .r{grid-template-columns:1fr;gap:2px;font-size:17px}
.memo .r b{font-family:var(--f-disp);font-weight:500}
.typetbl td:first-child{width:34%;font-family:var(--f-disp)}
.why10{margin:0;padding-left:1.6em}
.why10 li{margin:4px 0}
.kw{color:var(--accent);background:var(--accent-soft);padding:0 .25em;border-radius:6px}
.authored{font-size:13px;color:var(--soft);margin-top:12px}
`;
const {th, esc, blank} = K;
const T_ONLY = (html)=>K.role==='teacher' ? html : '';
const AUTH = (what)=>T_ONLY(`<p class="authored">${what}แต่งขึ้นใหม่ ไม่ได้มาจากเล่ม ควรอ่านทวนก่อนใช้</p>`);

/* ---------- ขั้น ๑ ทรรศนะ + ลักษณะภาษา ๔ แบบ (หน้า ๘–๑๐) ---------- */
const knowStep = {
  k:'know', label:'ลักษณะภาษา ๔ แบบ', min:4, book:'หน้า ๘–๑๐ (หัวข้อ ๒.๑)',
  T(){ return knowHTML(); }, G(){ return knowHTML(); }
};
function knowHTML(){
  const k='know';
  return `<div class="card"><div class="row between"><span class="eyebrow">หน้า ๘ ในเล่ม · ภาษากับการแสดงทรรศนะ</span>${T_ONLY(K.revealAllBtn(k,6))}</div>
    <h2 class="stitle">ทรรศนะ หมายถึง ${blank(k,0,'ความคิดเห็น')}</h2>
    ${T_ONLY('<p class="slead">๒.๑ ลักษณะภาษาที่แสดงทรรศนะ: ให้กลุ่มเดาคำตัวอย่างของแต่ละแบบก่อน แล้วแตะเฉลย</p>')}
    <div class="lang4">
      <div class="kbox"><span class="no">๒.๑.๑ หน้า ๘</span><h3>ใช้คำกริยาหลัก</h3><p class="big">เช่น ${blank(k,1,'คิดว่า · คาดว่า · เห็นว่า')}</p></div>
      <div class="kbox"><span class="no">๒.๑.๒ หน้า ๙</span><h3>ใช้คำหรือกลุ่มคำแสดงการประเมินค่า</h3><p>หรือให้ระดับคุณภาพได้ ${blank(k,2,'+/-')}</p><p class="big">เช่น ไม่เป็นรองใคร · แย่ลงมาก</p></div>
      <div class="kbox"><span class="no">๒.๑.๓ หน้า ๙</span><h3>ใช้คำแสดงอารมณ์ ความรู้สึก</h3><p class="big">เช่น ${blank(k,3,'ผวา · หมดห่วง · ระทึก')}</p></div>
      <div class="kbox"><span class="no">๒.๑.๔ หน้า ๑๐</span><h3>ใช้คำช่วยหน้ากริยา</h3><p class="big">${blank(k,4,'น่า(จะ) อาจ(จะ) คง(จะ) ควร(จะ) พึง(จะ) มัก(จะ)')}</p></div>
    </div>
    <div class="fb info big" style="margin-top:14px">ลองกับประโยคนี้: "ผม<b class="kw">คิดว่า</b> เราไม่จำเป็นต้องสมัครสอบวิชาสามัญทุกวิชา" (เล่มหน้า ๘) → ใช้ ${blank(k,5,'คำกริยาหลัก')}</div>
  </div>`;
}

/* ---------- ขั้น ๒ กาชาทรรศนะ (รอบสด) ---------- */
const LANG = [
  {v:'v', label:'กริยาหลัก', sub:'คิดว่า เห็นว่า'},
  {v:'e', label:'ประเมินค่า', sub:'ดี ไม่ดี +/-'},
  {v:'m', label:'อารมณ์', sub:'ความรู้สึก'},
  {v:'a', label:'ช่วยหน้ากริยา', sub:'น่าจะ อาจ ควร'}
];
const LANGL = {v:'ใช้คำกริยาหลัก', e:'ใช้คำประเมินค่า', m:'ใช้คำแสดงอารมณ์ ความรู้สึก', a:'ใช้คำช่วยหน้ากริยา'};
const GACHA = [
  {pre:'คณะกรรมการนักเรียน', w:'มีมติว่า', post:' ให้จัดงานกีฬาสีในเดือนธันวาคม', ans:'v', why:'"มีมติว่า" เป็นคำกริยาหลัก ข้อความหลังคำนี้คือความเห็นของที่ประชุม'},
  {pre:'ชาวบ้านริมหาด', w:'ใจหาย', post:' น้ำทะเลกัดเซาะชายหาดหายไปกว่า ๑๐ เมตร', ans:'m', why:'"ใจหาย" บอกความรู้สึกของชาวบ้านต่อเหตุการณ์'},
  {pre:'ส้มตำร้านป้าน้อยรสชาติ', w:'จัดจ้านถึงใจที่สุด', post:'ในซอยนี้', ans:'e', why:'"จัดจ้านถึงใจที่สุด" ประเมินคุณภาพของรสชาติ เป็นทางบวก (+)'},
  {pre:'ฝนตกหนักแบบนี้ งานวิ่งการกุศลพรุ่งนี้', w:'อาจ', post:'ต้องเลื่อนออกไป', ans:'a', why:'"อาจ" เป็นคำช่วยหน้ากริยา "ต้องเลื่อน" แสดงว่าผู้พูดคาดการณ์'},
  {pre:'ห้องสมุดใหม่ของโรงเรียน', w:'สวยงามและทันสมัยไม่แพ้ที่ใด', post:'', ans:'e', why:'"สวยงามและทันสมัยไม่แพ้ที่ใด" ประเมินคุณภาพของห้องสมุด'},
  {pre:'ผู้ปกครองส่วนใหญ่', w:'มองว่า', post:' การบ้านที่มากเกินไปไม่ได้ช่วยให้เด็กเรียนเก่งขึ้น', ans:'v', why:'"มองว่า" เป็นคำกริยาหลัก ตามด้วยความเห็นของผู้ปกครอง'},
  {pre:'นักกีฬาที่บาดเจ็บ', w:'ไม่ควร', post:'ลงแข่งจนกว่าแพทย์จะอนุญาต', ans:'a', why:'"ควร" เป็นคำช่วยหน้ากริยา "ลงแข่ง" ใช้เสนอความเห็นว่าสิ่งใดควรทำ'},
  {pre:'นักเรียน ม.๖ ', w:'ใจชื้น', post:' ครูประกาศว่าข้อสอบออกตามเล่มทั้งหมด', ans:'m', why:'"ใจชื้น" บอกความรู้สึกโล่งใจ มีกำลังใจขึ้น'}
].map(it=>Object.assign(it,{whyG:it.why}));
const gachaStep = K.rounds({
  k:'gacha', label:'กาชาทรรศนะ', min:8, book:'ฝึก ๒.๑ หน้า ๘–๑๐', title:'กาชาทรรศนะ',
  lead:'เปิดแคปซูลทีละลูก ครูอ่านประโยค กลุ่มหาคำที่แสดงทรรศนะ แล้วเลือกว่าเป็นภาษาแบบใดใน ๔ แบบ เฉลยแล้วคำนั้นจะขึ้นไฮไลต์',
  opts:LANG, pay:[[8,10],[7,7],[6,5],[4,3],[1,1]],
  items:GACHA,
  show:(it, shown)=>`<div class="cap"><div class="lid"></div><div class="in">${esc(it.pre)}${shown?`<mark>${esc(it.w)}</mark>`:esc(it.w)}${esc(it.post)}</div></div>
    ${shown?`<div style="text-align:center"><span class="captag">${esc(LANGL[it.ans])}: "${esc(it.w)}"</span></div>`:''}`
});
gachaStep.T = (orig=>function(){ return orig.call(this) + AUTH('ประโยคในแคปซูลทั้ง ๘ ลูก'); })(gachaStep.T);

/* ---------- ขั้น ๓ เฉลยเล่ม หน้า ๘–๑๐ (คำในกรอบ) ---------- */
function bookHTML(){
  const k='book'; let i=0; const b=(t)=>blank(k,i++,t);
  const rows = `
    <tr><td>หน้า ๘ · ๒.๑.๑<br><span class="note">กรอบคำกริยาหลัก ๗ ข้อ</span></td><td>ผม${b('คิดว่า')} · เรา${b('คาดว่า')} · ดิฉันขอ${b('เสนอว่า')} · หนู${b('มองว่า')} · พวกเธอมีความ${b('เห็นพ้องกันว่า')} · ที่ประชุม${b('มีมติว่า')} · นักเรียนในห้องนี้${b('เห็นว่า')}</td></tr>
    <tr><td>หน้า ๙ · ๒.๑.๒<br><span class="note">กรอบคำประเมินค่า ๗ ข้อ</span></td><td>นักกีฬาฟ้า… ${b('อย่างไม่ต้องสงสัย')} · ขนมไข่หงส์… ${b('ไม่เป็นรองใคร')} · ${b('เป็นไปได้ยาก')}ที่เธอจะถูกลอตเตอรี่… · พนักงานเสิร์ฟ… ${b('แย่ลงมาก')} · ความประพฤติ… ${b('ต้องยกนิ้วให้')} · นักเรียน ม.๖… ${b('หน้าดำคร่ำเครียด')} · เครื่องปรับอากาศ… ${b('ดีต่อใจฉันมาก · ยอดเยี่ยม · ทันสมัยสุด ๆ')}</td></tr>
    <tr><td>หน้า ๙ · ๒.๑.๓<br><span class="note">กรอบคำแสดงอารมณ์ ๗ ข้อ</span></td><td>สภาพศพ… ${b('น่าสยดสยองอย่างยิ่ง')} · ${b('ผวา')} ไวรัสพันธุ์ใหม่… · ผู้ปกครอง${b('หมดห่วง')} · คอหวย${b('อมยิ้ม')} · นักธุรกิจ${b('หงอย')} · ${b('ระทึก')} ๓ คนพ่อแม่ลูก… · กระทรวงศึกษาธิการ${b('หวั่น')}</td></tr>
    <tr><td>หน้า ๑๐ · ๒.๑.๔<br><span class="note">วงคำช่วยหน้ากริยา ๕ ข้อ</span></td><td>อาจารย์${b('น่า(จะ)')}ให้… · รัฐบาล${b('ควร')}ทบทวน… · ผู้บริหาร${b('อาจ')}เพิ่มโบนัส… · พระเอก${b('คง')}หนีรอด… · ตำรวจ${b('พึง')}นึกถึง…</td></tr>`;
  return `<div class="card"><div class="row between"><span class="eyebrow">ตีกรอบในเล่ม หน้า ๘–๑๐ แล้วเฉลยพร้อมกัน</span>${T_ONLY(K.revealAllBtn(k,i))}</div>
    <h2 class="stitle">เฉลยคำที่แสดงทรรศนะ หน้า ๘–๑๐</h2>
    ${T_ONLY('<p class="slead">ให้แต่ละกลุ่มแบ่งกันตีกรอบคนละหัวข้อ แล้วแตะเฉลยทีละช่อง</p>')}
    <table class="tbl big"><tr><th style="width:190px">ตำแหน่งในเล่ม</th><th>คำในกรอบ</th></tr>${rows}</table>
    ${T_ONLY('<p class="authored">เฉลยตามที่ครูตีกรอบไว้ในเล่ม หน้านี้ย่อข้อความ นักเรียนดูประโยคเต็มจากเล่มของตัวเอง</p>')}
  </div>`;
}
const bookStep = { k:'book', label:'เฉลยเล่ม', min:6, book:'หน้า ๘–๑๐', T(){ return bookHTML(); }, G(){ return bookHTML(); } };

/* ---------- ขั้น ๔ ประเภททรรศนะ ๓ ประเภท + Harmonic Memo (หน้า ๑๐–๑๑) ---------- */
const typeStep = {
  k:'type', label:'ทรรศนะ ๓ ประเภท', min:4, book:'หน้า ๑๐–๑๑',
  T(){ return typeHTML(); }, G(){ return typeHTML(); }
};
function typeHTML(){
  const k='type';
  return `<div class="card"><div class="row between"><span class="eyebrow">หน้า ๑๐–๑๑ · ๒.๒ ประเภทของทรรศนะ</span>${T_ONLY(K.revealAllBtn(k,7))}</div>
    <h2 class="stitle">ประเภทของทรรศนะ ${blank(k,0,'มี ๓ ประเภท')}</h2>
    <table class="tbl big typetbl" style="margin-top:8px"><tr><th>ประเภททรรศนะ</th><th>รายละเอียด (พิมพ์ไว้ในเล่ม)</th></tr>
      <tr><td>ทรรศนะเชิง${blank(k,1,'ข้อเท็จจริง')}</td><td>เป็นเพียงการสันนิษฐานเรื่องราว · คาดเดา คาดคะเนเหตุการณ์</td></tr>
      <tr><td>ทรรศนะเชิง${blank(k,2,'นโยบาย')}</td><td>เสนอวิธีการว่าควรทำอะไร อย่างไร · มีเป้าหมาย มีขั้นตอน มีคำแนะนำให้ปฏิบัติตามได้</td></tr>
      <tr><td>ทรรศนะเชิง${blank(k,3,'คุณค่า')}</td><td>กล่าวว่าสิ่งนั้น ดี ไม่ดี มีคุณ มีโทษ มีประโยชน์อย่างไร · แสดงให้เห็นว่าสิ่งใดเหมาะสม หรือไม่เหมาะสมอย่างไร</td></tr>
    </table>
    <div class="memo"><h3 style="margin-bottom:4px">Harmonic Memo หน้า ๑๑ · หลักการวิเคราะห์ประเภทของทรรศนะ</h3>
      <div class="r"><b>คาดคะเนหรือคาดเดา</b><span>= ทรรศนะเชิง</span><span>${blank(k,4,'ข้อเท็จจริง')}</span></div>
      <div class="r"><b>เขาบอกวิธีทำให้</b><span>= ทรรศนะเชิง</span><span>${blank(k,5,'นโยบาย')}</span></div>
      <div class="r"><b>ตัดสินได้ว่าบวกหรือลบ</b><span>= ทรรศนะเชิง</span><span>${blank(k,6,'คุณค่า')}</span></div>
    </div>
    <p class="note" style="margin-top:10px">ตัวย่อที่ใช้ในทักษะวัฒนา ๒: ขทจ. = ข้อเท็จจริง · นยบ. = นโยบาย · คค. = คุณค่า</p>
  </div>`;
}

/* ---------- ขั้น ๕ ตบแมลงวัน (รอบสด) ---------- */
const TYP = [{v:'f',label:'ขทจ.',sub:'ข้อเท็จจริง'},{v:'p',label:'นยบ.',sub:'นโยบาย'},{v:'q',label:'คค.',sub:'คุณค่า'}];
const TYPL = {f:'ขทจ. ทรรศนะเชิงข้อเท็จจริง', p:'นยบ. ทรรศนะเชิงนโยบาย', q:'คค. ทรรศนะเชิงคุณค่า'};
const SWAT = [
  {t:'ปีนี้ราคาทุเรียนน่าจะสูงขึ้น เพราะฝนทิ้งช่วงนานกว่าทุกปี', ans:'f', why:'คาดคะเนว่าจะเกิดอะไรขึ้น (ราคาสูงขึ้น) → ข้อเท็จจริง'},
  {t:'โรงเรียนควรติดตั้งจุดเติมน้ำดื่มฟรีทุกอาคาร และให้นักเรียนนำขวดมาเอง', ans:'p', why:'บอกวิธีทำ มีสิ่งที่ปฏิบัติตามได้ → นโยบาย'},
  {t:'การอ่านหนังสือก่อนนอนเป็นนิสัยที่มีประโยชน์ต่อสมองอย่างยิ่ง', ans:'q', why:'ตัดสินว่าดี มีประโยชน์ → คุณค่า'},
  {t:'การใส่ชุดว่ายน้ำเดินเข้าวัดเป็นเรื่องที่ไม่เหมาะสม', ans:'q', why:'ตัดสินว่าไม่เหมาะสม (ลบ) → คุณค่า'},
  {t:'คนร้ายคงหลบหนีออกทางประตูหลัง เพราะกล้องหน้าบ้านไม่พบใครเดินออกไปเลย', ans:'f', why:'สันนิษฐานเรื่องที่เกิดขึ้น → ข้อเท็จจริง'},
  {t:'เทศบาลควรจัดรถรางรับส่งนักท่องเที่ยวจากตัวเมืองไปตลาดโต้รุ่งทุก ๓๐ นาที', ans:'p', why:'เสนอวิธีการและรายละเอียดที่ทำตามได้ → นโยบาย'}
].map(it=>Object.assign(it,{whyG:it.why}));
const swatStep = K.rounds({
  k:'swat', label:'ตบแมลงวัน', min:6, book:'ฝึก ๒.๒ หน้า ๑๐–๑๑', title:'ตบแมลงวัน ขทจ. / นยบ. / คค.',
  lead:'ติดแมลงวัน ๓ ตัวบนกระดาน (ขทจ. · นยบ. · คค.) ครูอ่านประโยค ตัวแทนกลุ่มวิ่งตบ หรือกดบนมือถือ ใช้ Harmonic Memo ช่วยคิด',
  opts:TYP, pay:[[6,7],[5,5],[3,3],[1,1]],
  items:SWAT,
  show:(it, shown)=>`<div class="fly">${esc(it.t)}</div>${shown?`<div><span class="captag">${esc(TYPL[it.ans])}</span></div>`:''}`
});
swatStep.T = (orig=>function(){ return orig.call(this) + AUTH('ประโยคทั้ง ๖ รอบ'); })(swatStep.T);

/* ---------- ขั้น ๖ ทักษะวัฒนา ๒ (หน้า ๑๒) ---------- */
const TW2 = [
  ['คดีลักทรัพย์คราวนี้น่าจะเป็นเพราะมีคนในเป็นตัวการ','f','"น่าจะเป็นเพราะ…" คาดคะเนสาเหตุของคดี'],
  ['พรุ่งนี้หิมะคงจะตกอีกเพราะตกติดต่อกันมาหลายวันแล้ว','f','"คงจะตก" คาดการณ์เหตุการณ์ข้างหน้า'],
  ['เขานัดไว้แต่ก็อาจจะมาช้า ก็เขาไม่เคยมาตรงหรือก่อนเวลาเลยสักครั้ง','f','"อาจจะมาช้า" คาดเดาจากพฤติกรรมเดิม'],
  ['เรื่องที่เชื่อถือศรัทธาโดยปราศจากเหตุผล เห็นจะเป็นเรื่องไร้สาระและเสียเวลาทำความเข้าใจต่อไป','q','ตัดสินว่า "ไร้สาระ เสียเวลา" (ลบ)'],
  ['การพยายามส่งบุตรหลานเข้าโรงเรียนที่เข้มงวดเรื่องความรับผิดชอบเป็นเรื่องที่ดี','q','ตัดสินว่า "เป็นเรื่องที่ดี" (บวก)'],
  ['พฤติกรรมของพนักงานขับรถประจำทางที่ช่วยเหลือผู้สูงอายุที่หมดสติถือเป็นเรื่องที่ประเสริฐ','q','ตัดสินว่า "ประเสริฐ" (บวก)'],
  ['มหาวิทยาลัยควรเร่งให้ฝ่ายสถานที่ปรับภูมิทัศน์บริเวณโดยรอบคณะวิศวกรรมศาสตร์ก่อนถึงวันแข่งกีฬามหาวิทยาลัย','p','"ควรเร่งให้…ปรับภูมิทัศน์" บอกวิธีทำ'],
  ['เจ้าอาวาสน่าจะประชาสัมพันธ์งานวันวิสาขบูชาโดยใช้เสียงตามสายของวัด และควรจัดป้ายโฆษณาขนาดใหญ่ใกล้ประตูทางเข้าของวัด','p','บอกวิธีประชาสัมพันธ์ ๒ วิธี แม้ขึ้นต้นด้วย "น่าจะ" ก็เป็นการเสนอวิธีทำ'],
  ['หัวหน้ากลุ่มสาระควรคัดเลือกตัวแทนนักเรียนอย่างน้อย ๓ คนภายในวันนี้ และควรนัดหมายฝึกซ้อมโต้วาทีอย่างน้อยสัปดาห์ละ ๓–๔ ครั้ง','p','บอกขั้นตอนที่ทำตามได้ มีจำนวนและเวลาชัดเจน'],
  ['การสอบครั้งนี้ไม่น่าจะเลื่อนไปเดือนหน้าเพราะเหตุการณ์ยังเป็นปกติ','f','"ไม่น่าจะเลื่อน" คาดคะเนเหตุการณ์']
];
const TWL = {f:'ขทจ.', p:'นยบ.', q:'คค.'};
const tw2Step = K.form({
  k:'tw2', label:'ทักษะวัฒนา ๒', min:8, book:'หน้า ๑๒', title:'ทักษะวัฒนา ๒', colItem:'ข้อความในเล่ม',
  opts:TYP.map(o=>({v:o.v,label:o.label})), pay:[[10,10],[9,7],[7,5],[5,3],[1,1]],
  intro:(view,shown)=> shown ? '' : `<h2 class="stitle">ทรรศนะประเภทใด ขทจ. / นยบ. / คค.</h2>
    <p class="${view==='T'?'slead':'note'}">ทำในเล่มหน้า ๑๒ ก่อน แล้วกลุ่มส่งคำตอบรวม ๑ ชุด · ถามตัวเอง: คาดเดา? บอกวิธีทำ? หรือตัดสินบวก/ลบ?</p>`,
  items:TW2.map(x=>({text:esc(x[0]), ans:x[1]})),
  after:(view)=>`<div class="card"><span class="eyebrow">เหตุผลของเฉลย</span>
    <ol class="why10 ${view==='T'?'big':''}">${TW2.map(x=>`<li><b>${TWL[x[1]]}</b> ${esc(x[2])}</li>`).join('')}</ol>
    <div class="fb info" style="margin-top:10px"><b>ข้อ ๘ น่าสังเกต:</b> คำช่วยหน้ากริยา (น่าจะ อาจ คง ควร) พบได้ในทรรศนะทุกประเภท จึงต้องดูว่าทั้งข้อความ<b>คาดเดา</b> <b>บอกวิธีทำ</b> หรือ<b>ตัดสินบวก/ลบ</b></div>
    ${T_ONLY('<p class="authored">ประเภทของแต่ละข้อตามเฉลยของครู · คำอธิบายสั้นแต่ละข้อเป็นของผู้เรียบเรียง ควรอ่านทวนก่อนใช้</p>')}</div>`
});

/* ---------- ขั้น ๗ ตั๋วออก ---------- */
const exitStep = K.form({
  k:'exit', label:'ตั๋วออก', min:3, book:'ทบทวนคาบนี้', title:'ตั๋วออก', colItem:'คำถาม',
  pay:[[3,5],[2,3],[1,1]],
  intro:(view,shown)=> shown ? '' : `<h2 class="stitle">ตอบ ๓ ข้อก่อนออกจากห้อง</h2><p class="note">ปรึกษากันในกลุ่มได้ ส่งคำตอบเดียว</p>`,
  items:[
    {text:'"แม่<b class="kw">หวั่น</b> ราคาไข่ไก่ขึ้นอีกแผงละ ๑๐ บาท" ใช้ภาษาแสดงทรรศนะแบบใด', opts:[{v:'v',label:'กริยาหลัก'},{v:'m',label:'แสดงอารมณ์'},{v:'a',label:'ช่วยหน้ากริยา'}], ans:'m'},
    {text:'"ชาวสวนควรเก็บทุเรียนเมื่อแก่จัดเท่านั้น และควรติดป้ายวันที่เก็บทุกลูก" เป็นทรรศนะประเภทใด', opts:TYP.map(o=>({v:o.v,label:o.label})), ans:'p'},
    {text:'"บริการของร้านนี้แย่ลงมากตั้งแต่เปลี่ยนพนักงาน" เป็นทรรศนะประเภทใด', opts:TYP.map(o=>({v:o.v,label:o.label})), ans:'q'}
  ],
  after:(view)=>`<div class="card"><p class="${view==='T'?'big':''}" style="margin:0">ข้อ ๑ "หวั่น" บอกความรู้สึก · ข้อ ๒ บอกวิธีทำ ๒ อย่าง → นยบ. · ข้อ ๓ ตัดสินว่า "แย่ลงมาก" (ลบ) → คค.</p>${AUTH('ประโยคในตั๋วออก')}</div>`
});

K.period({
  css: P3_CSS,
  per:'p3', title:'คาบ ๓ ภาษากับการแสดงทรรศนะ', short:'คาบ ๓', accent:'opinion', plan:true,
  lead:'ทรรศนะคือความคิดเห็น ดูจากภาษา ๔ แบบ แล้วแยกประเภท ขทจ. นยบ. คค. (เล่มหน้า ๘–๑๒)',
  steps:[{k:'lobby', label:'เตรียมกลุ่ม'}, knowStep, gachaStep, bookStep, typeStep, swatStep, tw2Step, exitStep, {k:'end', label:'สรุปแสตมป์'}],
  endNote:'<h3 style="margin-bottom:6px">คาบหน้า: คาบ ๔ ภาษากับการโน้มน้าวใจ</h3><p style="margin:0">วิธีโน้มน้าวใจ ๖ วิธี หน้า ๑๓–๑๔ · ทักษะวัฒนา ๓ หน้า ๑๕</p>'
});
})();
