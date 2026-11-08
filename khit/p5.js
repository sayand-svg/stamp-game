/* p5.js — คาบ ๕ ภาษากับการโต้แย้ง (ชุดกิจกรรม ภาษาแสดงความคิด หน้า ๑๖–๒๓)
   เฉลยช่องว่างตามที่ครูเติมไว้ในเล่ม · ทักษะวัฒนา ๔ (หน้า ๑๗) และ ๕ (หน้า ๒๓) ใช้ข้อความจากเล่ม
   เทคนิควิเคราะห์ข้อสอบ (สัญญาณโต้แย้ง ผังสองฝั่ง ป้ายตัดตัวเลือก) ใช้ข้อความที่แต่งขึ้นใหม่ */
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
.lv{display:grid;gap:8px;margin-top:8px}
.lv .r{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;border-bottom:1px solid var(--line);padding:6px 0}
.G .lv .r{grid-template-columns:1fr}
.steps4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:6px}
.steps4 div{border:2px solid var(--accent-mid);background:var(--accent-soft);border-radius:12px;padding:8px 10px;font-family:var(--f-disp);font-size:clamp(16px,1.5vw,21px);line-height:1.35}
.steps4 div b{display:block;color:var(--accent);font-weight:500}
@media (max-width:700px){.steps4{grid-template-columns:1fr 1fr}}
.G .steps4{grid-template-columns:1fr 1fr}.G .steps4 div{font-size:15px}
.authored{font-size:13px;color:var(--soft);margin-top:12px}
`;
const {th, esc, blank} = K;
const T_ONLY = (html)=>K.role==='teacher' ? html : '';
const AUTH = (what)=>T_ONLY(`<p class="authored">${what}แต่งขึ้นใหม่ ไม่ได้มาจากเล่ม และไม่ซ้ำทักษะวัฒนาในเล่ม ควรอ่านทวนก่อนใช้</p>`);
const YN = [{v:'y',label:'✓ มีการโต้แย้ง'},{v:'n',label:'✗ ไม่มี'}];

/* ---------- ขั้น ๑ การโต้แย้งคืออะไร (หน้า ๑๖) ---------- */
const defStep = {
  k:'def', label:'การโต้แย้งคืออะไร', min:4, book:'หน้า ๑๖',
  T(){ return defHTML(); }, G(){ return defHTML(); }
};
function defHTML(){
  const k='def';
  return `<div class="card"><div class="row between"><span class="eyebrow">หน้า ๑๖ ในเล่ม · ภาษากับการโต้แย้ง</span>${T_ONLY(K.revealAllBtn(k,8))}</div>
    <h2 class="stitle">การโต้แย้ง หมายถึง การแสดง ${blank(k,0,'ทรรศนะ (ความคิดเห็น)')} ที่แตกต่างกันระหว่างบุคคลตั้งแต่ ๒ ฝ่ายเป็นต้นไป</h2>
    <div class="kgrid" style="margin-top:8px">
      <div class="kbox"><h3>แต่ละฝ่ายใช้อะไร</h3><p class="big" style="margin:0">ข้อมูล สถิติ หลักฐาน เหตุผล แนวคิดทฤษฎี ข้อเท็จจริง ฯลฯ ${blank(k,1,'(ไม่ใช้อารมณ์)')}</p>
        <p class="big" style="margin:8px 0 0">${blank(k,2,'เพื่อสนับสนุน')} ทรรศนะของตนเอง<br>${blank(k,3,'เพื่อคัดค้าน')} ทรรศนะของผู้อื่น</p></div>
      <div class="kbox"><h3>ยอมรับความแตกต่าง</h3><p class="big" style="margin:0">การยอมรับความแตกต่างอาจต้องอาศัยหลักการ เหตุผล การชี้แจง ผ่านกระบวนการ "${blank(k,4,'โต้แย้ง')}"</p></div>
    </div>
    <div class="kbox" style="margin-top:12px"><h3>การโต้แย้งเกิดได้ทุกระดับของสังคม</h3><div class="lv big">
      <div class="r"><span>พ่อแม่โต้แย้งกันเรื่องโรงเรียนที่จะให้ลูกเรียนต่อ ม.๔</span><span>ระดับ ${blank(k,5,'ครอบครัว')}</span></div>
      <div class="r"><span>ที่ประชุมโต้แย้งกันเรื่องการเพิ่มโบนัสให้พนักงานขาย</span><span>ระดับ ${blank(k,6,'องค์กร')}</span></div>
      <div class="r"><span>สส. ในสภาโต้แย้งกันเรื่องกฎหมายมรดกและภาษี</span><span>ระดับ ${blank(k,7,'สังคม')}</span></div>
    </div></div>
  </div>`;
}

/* ---------- ขั้น ๒ หลักแกน: ค้านความคิดของใคร (เทคนิคก่อนทำทักษะวัฒนา ๔) ---------- */
const coreStep = {
  k:'core', label:'ค้านความคิดของใคร', min:4, book:'เทคนิคก่อนทำทักษะวัฒนา ๔',
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

/* ---------- ขั้น ๓ ทักษะวัฒนา ๔ (หน้า ๑๗) ---------- */
const TW4 = [
  ['เรียนอะไรก็ได้ที่ชอบ ตรวจสอบตัวเองให้ดี','n','เป็นคำแนะนำด้านเดียว ไม่ได้ยกความคิดของใครขึ้นมาค้าน'],
  ['การสอบแข่งขันเป็นสิ่งดี แต่คิดอีกทีก็เหมือนดาบสองคม','y','ยอมรับก่อน ("เป็นสิ่งดี") แล้วแย้ง ("แต่คิดอีกทีก็เหมือนดาบสองคม")'],
  ['สายวิทย์อย่าคิดว่าแน่ สายศิลป์ที่รู้จริงนะเก่งแท้','y','"อย่าคิดว่า" เตือนไม่ให้เชื่อความคิดที่ว่าสายวิทย์เก่งกว่า'],
  ['มหาวิทยาลัยเปิด มหาวิทยาปิด จบเป็นบัณฑิตไม่ต่างกัน','n','บอกความเห็นของตนด้านเดียว ไม่ได้ยกความคิดฝ่ายอื่นขึ้นมาค้าน ⚠ บางคนอาจมองว่าค้านความเชื่อที่ไม่ได้เขียนไว้ เฉลยของครูถือว่าไม่ใช่การโต้แย้ง'],
  ['รัฐบาลและประชาชนควรร่วมกันบริหารการใช้น้ำ','n','เสนอแนะด้วย "ควร" ด้านเดียว เป็นทรรศนะ แต่ไม่ได้ค้านใคร'],
  ['ภาวะเศรษฐกิจในปัจจุบันทำให้ความต้องการใช้กระแสไฟลดลง','n','บอกเหตุและผล ไม่มีความคิดที่ถูกค้าน'],
  ['ในโลกแห่งผลประโยชน์มีการแข่งขันกันอย่างดุเดือด','n','บอกสภาพการณ์ ไม่มีฝ่ายที่ถูกค้าน'],
  ['อุดมการณ์พึ่งตนเองจะประสบความสำเร็จได้ด้วยการปฏิรูปอย่างรอบด้านเท่านั้นเป็นเรื่องไม่จริง','y','"…เป็นเรื่องไม่จริง" ปฏิเสธความคิดทั้งก้อน'],
  ['เรามักพูดกันว่าผู้ดีมีเงิน บางทีผู้ดีจริง ๆ ก็ไม่ได้มีเงิน และคนที่มีเงินแต่ไม่ใช่ผู้ดีก็มีมาก','y','"เรามักพูดกันว่า…" อ้างความเชื่อของคนทั่วไป แล้วค้าน'],
  ['ฤดูร้อนกำลังจะจากไป และฤดูใบไม้ร่วงกำลังเข้ามาแทนที่ ใบไม้ที่เขียวสดก็เปลี่ยนเป็นสีเหลืองและสีน้ำตาล','n','พรรณนาธรรมชาติ ไม่มีความคิดเห็นที่ขัดกัน']
];
const tw4Step = K.form({
  k:'tw4', label:'ทักษะวัฒนา ๔', min:7, book:'หน้า ๑๗', title:'ทักษะวัฒนา ๔', colItem:'ข้อความในเล่ม',
  opts:YN, pay:[[10,10],[9,7],[7,5],[5,3],[1,1]],
  intro:(view,shown)=> shown ? '' : `<h2 class="stitle">ข้อความใดแสดงการโต้แย้ง</h2>
    <p class="${view==='T'?'slead':'note'}">ทำในเล่มหน้า ๑๗ ก่อน แล้วกลุ่มส่งคำตอบรวม ๑ ชุด · ถามทุกข้อ: ค้านความคิดของใคร · มองหาสัญญาณ ๔ แบบ</p>`,
  items:TW4.map(x=>({text:esc(x[0]), ans:x[1]})),
  after:(view)=>`<div class="card"><span class="eyebrow">เหตุผลของเฉลย</span>
    <ol class="why8 ${view==='T'?'big':''}">${TW4.map(x=>`<li><b>${x[1]==='y'?'✓':'✗'}</b> ${esc(x[2])}</li>`).join('')}</ol>
    <div class="fb info" style="margin-top:10px">ข้อ ✓ ทั้ง ๔ ข้อ ตรงกับสัญญาณ ๔ แบบพอดี: ยอมรับก่อนแล้วแย้ง (๒) · เตือนไม่ให้เชื่อ (๓) · ปฏิเสธทั้งก้อน (๘) · อ้างความเชื่อคนอื่นแล้วค้าน (๙)</div>
    ${T_ONLY('<p class="authored">✓/✗ ตามเฉลยของครู · คำอธิบายสั้นแต่ละข้อเป็นของผู้เรียบเรียง ควรอ่านทวนก่อนใช้</p>')}</div>`
});

/* ---------- ขั้น ๔ โครงสร้างและกระบวนการโต้แย้ง (หน้า ๑๘–๒๒) ---------- */
const structStep = {
  k:'struct', label:'โครงสร้าง · กระบวนการ', min:5, book:'หน้า ๑๘–๒๒',
  T(){ return structHTML(); }, G(){ return structHTML(); }
};
function structHTML(){
  const k='struct';
  return `<div class="card"><div class="row between"><span class="eyebrow">หน้า ๑๘–๒๒ · ๔.๑ โครงสร้าง · ๔.๒ กระบวนการ · ๔.๓ ข้อควรระวัง</span>${T_ONLY(K.revealAllBtn(k,10))}</div>
    <h2 class="stitle">กระบวนการโต้แย้งจำเป็นต้องอาศัย "${blank(k,0,'เหตุผล')}" เป็นหลัก</h2>
    <div class="kgrid" style="margin-top:8px">
      <div class="kbox"><h3>แหล่งที่มาของเหตุผล (หน้า ๑๘)</h3><p class="big" style="margin:0">ผลการวิจัย ผลสำรวจ ${blank(k,1,'ผลการทดลอง')}<br>ปัญหาหรือสภาพการณ์ที่เกิดขึ้นจริง = ${blank(k,2,'ข้อเท็จจริง')}<br><span class="note">หลักการหรือทฤษฎี · สถิติ · คำวินิจฉัยของผู้เชี่ยวชาญ</span></p></div>
      <div class="kbox"><h3>โครงสร้างการโต้แย้ง (หน้า ๑๘–๑๙)</h3><p class="big" style="margin:0">คล้ายโครงสร้างการแสดงเหตุผล = ข้อ${blank(k,3,'สนับสนุน')} + ข้อ${blank(k,4,'สรุป')}</p>
        <p class="big" style="margin:8px 0 0">หัวตาราง: เหตุผล (${blank(k,5,'สาเหตุ / สนับสนุน')}) · ข้อสรุป (${blank(k,6,'ผล / ผลลัพธ์')})</p></div>
    </div>
    <div class="kbox" style="margin-top:12px"><h3>กระบวนการโต้แย้ง ๔ ขั้น (หน้า ๑๙–๒๒)</h3>
      <div class="steps4"><div><b>๑</b>ตั้งประเด็น</div><div><b>๒</b>นิยามคำสำคัญ</div><div><b>๓</b>ค้นคว้า เรียบเรียงข้อมูลสนับสนุนทรรศนะของตน</div><div><b>๔</b>ค้นคว้า เรียบเรียงข้อมูลชี้จุดอ่อนฝ่ายตรงข้าม</div></div>
      <p class="big" style="margin:12px 0 0"><b>ประเด็น (หน้า ๒๐)</b> คำตอบที่ได้ต้อง ${blank(k,7,'แตกต่าง')} กันไปในทางตรงกันข้าม · ถ้าทุกฝ่ายตอบเหมือนกัน ไม่เรียกว่า ${blank(k,8,'การโต้แย้ง')}</p>
      <p class="big" style="margin:6px 0 0">การโต้แย้งเกิดจาก ${blank(k,9,'ความคิดเห็น (ทรรศนะ)')} ที่ไม่ตรงกัน → โต้แย้งเกี่ยวกับนโยบาย · ข้อเท็จจริง · คุณค่า</p></div>
    <div class="kgrid" style="margin-top:12px">
      <div class="kbox"><h3>จุดอ่อนมักอยู่ที่ (หน้า ๒๒)</h3><p style="margin:0">การนิยามคำสำคัญ · ปริมาณและความถูกต้องของข้อมูล · สมมุติฐานและวิธีการอนุมาน</p></div>
      <div class="kbox"><h3>๔.๓ ข้อควรระวัง (หน้า ๒๒)</h3><p style="margin:0">หลีกเลี่ยงการใช้อารมณ์ · มีมารยาททั้งวัจนภาษาและอวัจนภาษา · ใช้วิจารณญาณเลือกประเด็น คำนึงถึงผลกระทบ</p></div>
    </div>
    ${T_ONLY('<p class="authored">ช่องว่างตามที่ครูเติมไว้ในเล่ม ข้อความที่ไม่มีช่องพิมพ์ไว้ในเล่มแล้ว (ย่อ)</p>')}
  </div>`;
}

/* ---------- ขั้น ๕ ผังสองฝั่ง (ครูพาทำ) ---------- */
const mapStep = {
  k:'map', label:'ผังสองฝั่ง', min:5, book:'ฝึก ๔.๒.๑ การตั้งประเด็น หน้า ๒๐',
  T(){ return mapHTML(); }, G(){ return mapHTML(); }
};
function mapHTML(){
  const k='map';
  return `<div class="card"><div class="row between"><span class="eyebrow">ฝึกตั้งประเด็น (หน้า ๒๐) · ผังสองฝั่ง ๔ จังหวะ · ครูพาทำ</span>${T_ONLY(K.revealAllBtn(k,6))}</div>
    <h2 class="stitle">ประเด็น = คำถามที่ผู้เขียนกับฝ่ายตรงข้ามตอบต่างกัน</h2>
    <div class="psg" style="margin-top:8px">หลายโรงเรียนห้ามนักเรียนนำโทรศัพท์มือถือเข้าห้องเรียน เพราะเชื่อว่าโทรศัพท์ทำให้เสียสมาธิ แต่โทรศัพท์ก็เป็นเครื่องมือค้นคว้าที่ดี หากครูกำหนดวิธีใช้ให้ชัดเจน โรงเรียนจึงควรสอนให้นักเรียนใช้โทรศัพท์อย่างถูกวิธี มากกว่าจะห้ามใช้ทั้งหมด</div>
    <div class="kbox" style="margin-top:12px"><h3>จังหวะที่ ๑ ขีดเส้นใต้คำสัญญาณ</h3><p class="big" style="margin:0">${blank(k,0,'เพราะเชื่อว่า · แต่ · จึงควร')}</p></div>
    <div class="vs">
      <div class="side"><h4>จังหวะที่ ๒ ความเห็นที่ถูกค้าน</h4><div class="big">${blank(k,1,'ควรห้ามนำโทรศัพท์เข้าห้องเรียน')}</div></div>
      <div class="mid">⟷</div>
      <div class="side me"><h4>จังหวะที่ ๓ จุดยืนของผู้เขียน (หลัง "จึงควร")</h4><div class="big">${blank(k,2,'สอนให้ใช้อย่างถูกวิธี ไม่ห้ามทั้งหมด')}</div></div>
    </div>
    <div class="issue"><h4>จังหวะที่ ๔ ตั้งเป็นคำถาม "…หรือไม่ / …จริงหรือ"</h4><div class="huge" style="margin:0">${blank(k,3,'โรงเรียนควรห้ามนักเรียนใช้โทรศัพท์ในห้องเรียนหรือไม่')}</div></div>
    <div class="kbox" style="margin-top:12px"><h3>ทดสอบสองเสียง</h3><p class="big" style="margin:0">อ่านคำถามออกเสียง ให้เพื่อนคนหนึ่งตอบแทนผู้เขียน อีกคนตอบแทนฝ่ายตรงข้าม<br>
      ผู้เขียนตอบ ${blank(k,4,'ไม่ควร')} · ฝ่ายตรงข้ามตอบ ${blank(k,5,'ควร')} → ตอบต่างกัน จึงเป็นประเด็น</p></div>
    ${AUTH('ข้อความในขั้นนี้')}
  </div>`;
}

/* ---------- ขั้น ๖ ป้ายตัดตัวเลือก (รอบสด) ---------- */
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
  k:'cut', label:'ป้ายตัดตัวเลือก', min:9, book:'ฝึกตั้งประเด็น หน้า ๒๐ · เทคนิคข้อสอบ', title:'ป้ายตัดตัวเลือก',
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

/* ---------- ขั้น ๗ ทักษะวัฒนา ๕ (หน้า ๒๓) ---------- */
const TW5 = [
  ['เหตุผลที่คุณนำมาสนับสนุนนั้น มีบางข้อที่ยังลวก ๆ ซึ่งควรนำกลับไปทบทวนใหม่','n','"ลวก ๆ" เป็นคำตำหนิผู้อื่น'],
  ['ผมมีข้อเสนอใหม่ที่ดีกว่าของคุณ ต้องการให้คุณได้นำไปพิจารณาดูก่อน','n','"ดีกว่าของคุณ" ยกความเห็นของตนข่มผู้อื่น'],
  ['ข้อเสนอของคุณนั้นพอยอมรับได้ แต่ผมมีข้อเสนออีกแนวทางหนึ่งให้คุณพิจารณา','y','ยอมรับข้อเสนอของอีกฝ่ายก่อน แล้วเสนออีกแนวทางอย่างสุภาพ'],
  ['ผมไม่เห็นด้วยกับแนวคิดของคุณ ถ้าคุณจะลองคิดดูใหม่อีกครั้งก็จะเป็นการดีกว่าแน่นอน','n','"จะเป็นการดีกว่าแน่นอน" เหมือนสั่งสอน มั่นใจว่าตนถูกฝ่ายเดียว'],
  ['ผมคิดว่า ความเห็นที่เสนอกันมายังไม่ค่อยเป็นรูปธรรมเท่าไร มันเลื่อนลอยเหมือนอากาศธาตุ','n','"เลื่อนลอยเหมือนอากาศธาตุ" เปรียบเปรยเชิงเหน็บแนม'],
  ['ผมว่า ที่หลาย ๆ ท่านวิเคราะห์ปัญหามายังไม่ตรงจุดนักซึ่งแตกต่างไปจากผมโดยสิ้นเชิง','n','ตัดสินว่าผู้อื่นวิเคราะห์ไม่ตรงจุด และถือความเห็นของตนเป็นหลัก'],
  ['ถ้าแก้ไขปัญหาตามวิธีที่หลายท่านเสนอมา ผมเกรงว่าจะไม่ได้ผลและเสียแรงเปล่า','n','"เสียแรงเปล่า" ดูแคลนข้อเสนอของผู้อื่น'],
  ['ในประเด็นนี้ผมมีความเห็นที่ต่างออกไปจากท่านอื่น ๆ','y','บอกว่าเห็นต่างอย่างสุภาพ ไม่ตำหนิใคร'],
  ['เพื่อให้ได้ข้อสรุปที่รัดกุม ผมคิดว่า เราควรพิจารณาความคิดเห็นของท่านอื่น ๆ ประกอบด้วย','y','ชวนให้พิจารณาความเห็นของผู้อื่นประกอบ ให้เกียรติทุกฝ่าย'],
  ['เวลาที่เราใช้ในการอภิปรายมีค่ามากเกินกว่าจะเสียเวลาพิจารณาประเด็นที่เพิ่งผ่านไป','n','"เสียเวลาพิจารณา" ปัดตกประเด็นของผู้อื่น ไม่ให้เกียรติ']
];
const tw5Step = K.form({
  k:'tw5', label:'ทักษะวัฒนา ๕', min:6, book:'หน้า ๒๓', title:'ทักษะวัฒนา ๕', colItem:'ข้อความในเล่ม',
  opts:[{v:'y',label:'✓ เหมาะสม'},{v:'n',label:'✗ ไม่เหมาะสม'}], pay:[[10,10],[9,7],[7,5],[5,3],[1,1]],
  intro:(view,shown)=> shown ? '' : `<h2 class="stitle">ใช้ภาษาเหมาะสมกับการโต้แย้งหรือไม่</h2>
    <p class="${view==='T'?'slead':'note'}">ทำในเล่มหน้า ๒๓ ก่อน แล้วกลุ่มส่งคำตอบรวม ๑ ชุด · ใช้ ๔.๓ ข้อควรระวัง: หลีกเลี่ยงอารมณ์ และมีมารยาท</p>`,
  items:TW5.map(x=>({text:esc(x[0]), ans:x[1]})),
  after:(view)=>`<div class="card"><span class="eyebrow">เหตุผลของเฉลย</span>
    <ol class="why8 ${view==='T'?'big':''}">${TW5.map(x=>`<li><b>${x[1]==='y'?'✓':'✗'}</b> ${esc(x[2])}</li>`).join('')}</ol>
    <div class="fb info" style="margin-top:10px">ข้อที่ ✗ มักมีคำที่ตัดสินหรือดูแคลนอีกฝ่าย ลองหาคำนั้นให้เจอ แล้วคิดว่าจะเปลี่ยนเป็นคำใดให้สุภาพขึ้น</div>
    ${T_ONLY('<p class="authored">✓/✗ ตามเฉลยของครู · คำอธิบายสั้นแต่ละข้อเป็นของผู้เรียบเรียง ควรอ่านทวนก่อนใช้</p>')}</div>`
});

K.period({
  css: P5_CSS,
  per:'p5', title:'คาบ ๕ ภาษากับการโต้แย้ง', short:'คาบ ๕', accent:'argue', plan:true,
  lead:'การโต้แย้งคืออะไร จับสัญญาณโต้แย้ง ตั้งประเด็น และใช้ภาษาให้เหมาะสม พร้อมทักษะวัฒนา ๔–๕ (เล่มหน้า ๑๖–๒๓)',
  steps:[{k:'lobby', label:'เตรียมกลุ่ม'}, defStep, coreStep, tw4Step, structStep, mapStep, cutStep, tw5Step, {k:'end', label:'สรุปแสตมป์'}],
  endNote:'<h3 style="margin-bottom:6px">คาบหน้า: คาบ ๖ ทบทวนทั้งหน่วย</h3><p style="margin:0">บิงโกความคิด และเศรษฐีภาษาไทย ๒๐ ข้อ จากวิทยาประยุกต์ เล่มหน้า ๒๔–๓๒ · เตรียมเล่มมาด้วย</p>'
});
})();
