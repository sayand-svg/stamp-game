/* p4.js — คาบ ๔ ภาษากับการโน้มน้าวใจ (ชุดกิจกรรม ภาษาแสดงความคิด หน้า ๑๓–๑๕)
   เฉลยช่องว่างและเส้นใต้ตามที่ครูเติมไว้ในเล่ม · คำโฆษณาในตลาดนัด ภารกิจร้านของเรา และตั๋วออกแต่งขึ้นใหม่
   ทักษะวัฒนา ๓ ใช้โฆษณารถไฟจากเล่ม หน้า ๑๕ */
(function(){
'use strict';
const P4_CSS = `
.opts.c6{grid-template-columns:1fr 1fr}
.T .opts.c6{grid-template-columns:repeat(3,1fr)}
.m6{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:10px}
.m6 .kbox h3{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}
.m6 .kbox h3 .n{font-size:26px;line-height:1}
.m6 .kbox ul{margin:6px 0 0;padding-left:1.2em;color:var(--muted)}
.m6 .kbox li{margin:2px 0}
.stall{margin-top:12px;border:3px solid var(--accent-mid);border-radius:var(--r);overflow:hidden;background:var(--card)}
.stall .awn{height:20px;background:repeating-linear-gradient(90deg,var(--accent) 0 26px,#fff 26px 52px)}
.stall .nm{font-family:var(--f-disp);color:var(--accent);font-size:16px;padding:10px 20px 0}
.stall .say{padding:4px 20px 18px;font-family:var(--f-disp);font-weight:500;font-size:clamp(22px,2.4vw,36px);line-height:1.5}
.G .stall .say{font-size:19px;padding:4px 12px 12px}
.mtag{display:inline-block;margin-top:10px;padding:4px 16px;border-radius:999px;font-family:var(--f-disp);font-size:19px;background:var(--ok-soft);color:var(--ok)}
.ad{margin-top:12px;border:2px solid var(--line2);border-radius:var(--r);padding:16px 20px;background:var(--card);line-height:2}
.T .ad{font-size:clamp(18px,1.6vw,24px)}
.G .ad{font-size:16px;padding:12px}
.ad h4{font-family:var(--f-disp);font-weight:500;text-align:center;margin:0 0 6px;font-size:1.1em}
.ad .ul{display:inline;border:0;background:none;padding:0;margin:0;font:inherit;color:inherit;cursor:pointer;border-bottom:3px dashed transparent;text-decoration:none}
.T .ad .ul{border-bottom-color:var(--line2)}
.ad .ul.on{border-bottom:3px solid var(--bad);color:var(--ink);background:var(--bad-soft)}
.deal td{vertical-align:middle}
.mission{border:3px dashed var(--accent);border-radius:var(--r);padding:14px 16px;margin-top:10px}
.mission .huge{margin:4px 0}
.why8{margin:0;padding-left:1.4em}
.why8 li{margin:4px 0}
.authored{font-size:13px;color:var(--soft);margin-top:12px}
`;
const {th, esc, blank} = K;
const T_ONLY = (html)=>K.role==='teacher' ? html : '';
const AUTH = (what)=>T_ONLY(`<p class="authored">${what}แต่งขึ้นใหม่ ไม่ได้มาจากเล่ม ควรอ่านทวนก่อนใช้</p>`);

/* วิธีโน้มน้าวใจ ๖ วิธี ตามเล่ม หน้า ๑๓–๑๔ (name = คำที่ครูเติม · tips = ข้อความที่พิมพ์ไว้ในเล่ม ย่อ) */
const METH = [
  {v:'m1', n:'๑', name:'การสร้างความน่าเชื่อถือให้ข้อมูล / ให้ผู้ที่กำลังโน้มน้าวใจ', short:'น่าเชื่อถือ', sub:'สถิติ วิจัย ผู้เชี่ยวชาญ',
   tips:['แสดงให้เห็นว่าตนมีความรู้จริง','มีตัวเลขสถิติ หรืออ้างผลการวิจัย','อ้างคำพูดหรือแนวคิดของบุคคลที่น่าเชื่อถือ']},
  {v:'m2', n:'๒', name:'การแสดงเหตุผลที่หนักแน่น / ชัดเจน', short:'เหตุผล', sub:'ที่มา ความจำเป็น',
   tips:['แสดงว่าเรื่องที่โน้มน้าวมีที่มาที่ไป','บอกความเป็นมาหรือความสำคัญจำเป็นได้']},
  {v:'m3', n:'๓', name:'การแสดงว่าเป็นพวกเดียวกัน / การแสดงให้เกิดอารมณ์ร่วม', short:'พวกเดียวกัน', sub:'อารมณ์ร่วม',
   tips:['แสดงว่าตนกับผู้รับสารรู้สึกร่วมกัน','ค่านิยม ความเชื่อเดียวกัน เคารพรักบุคคลหรือสถาบันเดียวกัน รังเกียจสิ่งเดียวกัน']},
  {v:'m4', n:'๔', name:'การแสดงให้เห็นทั้งข้อดีและข้อเสีย', short:'ข้อดี–ข้อเสีย', sub:'ชั่งสองด้าน',
   tips:['มักแสดงแต่เฉพาะข้อดีหรือผลดี','หรือแสดงทั้งผลดีและผลเสียในเรื่องนั้น']},
  {v:'m5', n:'๕', name:'การเร้าให้เกิดอารมณ์อย่างแรงกล้า', short:'เร้าอารมณ์', sub:'ซาบซึ้ง กลัว',
   tips:['ทำให้เกิดอารมณ์อย่างใดอย่างหนึ่ง','เช่น เขียนให้รู้สึกซาบซึ้ง พูดให้เกิดความกลัว']},
  {v:'m6', n:'๖', name:'การสร้างความหรรษา (สนุกสนาน)', short:'หรรษา', sub:'ตลก เพลงติดหู',
   tips:['ใช้อารมณ์ขัน ผู้รับสารไม่รู้สึกต่อต้าน','เล่าเรื่องตลก เกินจริงจนขบขัน','ทำนองเพลงติดหู · คำประพันธ์ คำขวัญคุ้นหูมาดัดแปลง']}
];
const MOF = (v)=>METH.find(m=>m.v===v)||{};

/* ---------- ขั้น ๑ วิธีโน้มน้าวใจ ๖ วิธี (หน้า ๑๓–๑๔) ---------- */
const knowStep = {
  k:'know', label:'วิธีโน้มน้าวใจ ๖ วิธี', min:6, book:'หน้า ๑๓–๑๔',
  T(){ return knowHTML(); }, G(){ return knowHTML(); }
};
function knowHTML(){
  const k='know';
  return `<div class="card"><div class="row between"><span class="eyebrow">หน้า ๑๓–๑๔ ในเล่ม · ภาษากับการโน้มน้าวใจ</span>${T_ONLY(K.revealAllBtn(k,7))}</div>
    <h2 class="stitle">การโน้มน้าวใจ หมายถึง ${blank(k,0,'การทำให้ผู้อื่นคล้อยตามผู้ส่งสาร (ทำให้เชื่อ · ให้ทำตาม · ไม่ให้ทำตาม)')}</h2>
    ${T_ONLY('<p class="slead">อ่านรายละเอียดที่พิมพ์ในเล่มทีละข้อ ให้นักเรียนตั้งชื่อวิธีก่อน แล้วแตะเฉลยชื่อวิธี</p>')}
    <div class="m6">${METH.map((m,i)=>`<div class="kbox"><h3><span class="n">${m.n})</span>${blank(k,i+1,m.name)}</h3><ul>${m.tips.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>`).join('')}</div>
  </div>`;
}

/* ---------- ขั้น ๒ ตลาดนัดโน้มน้าว (รอบสด) ---------- */
const MOPTS = METH.map(m=>({v:m.v, label:m.n+' '+m.short, sub:m.sub}));
const MARKET = [
  {nm:'ร้านครีมกันแดด', t:'ครีมกันแดดของเราผ่านการทดสอบจากห้องปฏิบัติการมาตรฐาน ร้อยละ ๙๕ ของผู้ทดลองใช้ไม่มีอาการแพ้', ans:'m1',
   why:'ยกผลทดสอบและตัวเลขร้อยละมาทำให้ข้อมูลน่าเชื่อถือ (มีบอกข้อดีด้วย แต่จุดเด่นคือหลักฐานตัวเลข)'},
  {nm:'ร้านหมวกกันน็อก', t:'ขี่ไปปากซอยแค่ห้านาทีก็เกิดอุบัติเหตุได้ ศีรษะที่ไม่มีหมวกอาจไม่ได้กลับบ้านไปหาคนที่รออยู่อีกเลย', ans:'m5',
   why:'พูดให้เกิดความกลัวต่อผลร้าย เร้าอารมณ์อย่างแรงกล้า'},
  {nm:'ร้านชาไข่มุกหน้าโรงเรียน', t:'พวกเรา ม.๖ เหมือนกัน รู้ดีว่าช่วงสอบเหนื่อยแค่ไหน ร้านเราเปิดถึงสามทุ่มเพื่อเพื่อนร่วมรุ่นทุกคน', ans:'m3',
   why:'บอกว่าผู้ขายกับผู้ซื้อเป็นพวกเดียวกัน รู้สึกเหนื่อยเหมือนกัน'},
  {nm:'ร้านรองเท้าวิ่ง', t:'คู่นี้แพงกว่ารุ่นธรรมดาสามร้อยบาทและหนักกว่าเล็กน้อย แต่พื้นทนใช้ได้นานกว่าสองปีและไม่ลื่นแม้พื้นเปียก', ans:'m4',
   why:'บอกทั้งข้อเสีย (แพงกว่า หนักกว่า) และข้อดี (ทน ไม่ลื่น) ให้ผู้ซื้อชั่งเอง'},
  {nm:'ร้านหมูปิ้ง', t:'"หมูปิ้งป้าแดง ไม้เดียวไม่เคยพอ กินแล้วอยากร้องเพลง" ร้องตามกันได้ทั้งซอยทุกเช้า', ans:'m6',
   why:'ใช้คำคล้องจองติดหู ร้องตามได้ และพูดเกินจริงให้ขบขัน'},
  {nm:'บูธอาสาเก็บขยะชายหาด', t:'นักท่องเที่ยวมาหัวหินมากขึ้นทุกปี ขยะบนหาดจึงเพิ่มตาม ถ้าไม่มีใครเก็บ หาดจะสกปรกจนนักท่องเที่ยวไม่กลับมา มาเป็นอาสาสมัครกับเรา', ans:'m2',
   why:'อธิบายที่มาของปัญหาและความจำเป็นที่ต้องช่วยกัน เป็นเหตุผลต่อกันเป็นลำดับ'},
  {nm:'บูธรับบริจาค', t:'เงินเพียงยี่สิบบาทของคุณ อาจเป็นข้าวมื้อเดียวของวันนี้ที่เด็กคนหนึ่งได้กิน', ans:'m5',
   why:'เขียนให้รู้สึกซาบซึ้ง สงสาร เร้าอารมณ์อย่างแรงกล้า'},
  {nm:'ร้านนมสด', t:'นักโภชนาการแนะนำว่าวัยรุ่นควรดื่มนมวันละสองแก้ว นมสดจากฟาร์มของเราผ่านมาตรฐานความปลอดภัยอาหาร', ans:'m1',
   why:'อ้างคำแนะนำของผู้เชี่ยวชาญและมาตรฐาน ทำให้น่าเชื่อถือ'}
].map(it=>Object.assign(it,{whyG:it.why}));
const marketStep = K.rounds({
  k:'market', label:'ตลาดนัดโน้มน้าว', min:10, book:'ฝึกวิธีที่ ๑–๖ หน้า ๑๓–๑๔', title:'ตลาดนัดโน้มน้าว',
  lead:'เดินตลาดนัดทีละร้าน ครูอ่านคำเชิญชวนของแม่ค้า กลุ่มเลือกวิธีโน้มน้าวที่ <b>เด่นที่สุด</b> ข้อความจริงมักใช้หลายวิธีพร้อมกัน ถ้ากลุ่มเห็นต่าง ให้ชี้คำในข้อความมาประกอบ',
  opts:MOPTS, pay:[[8,10],[7,7],[6,5],[4,3],[1,1]],
  items:MARKET,
  show:(it, shown)=>`<div class="stall"><div class="awn"></div><div class="nm">${esc(it.nm)}</div><div class="say">"${esc(it.t)}"</div></div>
    ${shown?`<div><span class="mtag">วิธีที่ ${esc(MOF(it.ans).n)} ${esc(MOF(it.ans).name)}</span></div>`:''}`
});
marketStep.T = (orig=>function(){ return orig.call(this) + AUTH('คำเชิญชวนทั้ง ๘ ร้าน'); })(marketStep.T);

/* ---------- ขั้น ๓ นักสืบโฆษณา = ทักษะวัฒนา ๓ (หน้า ๑๕) ---------- */
const AD = [
  {h:1, s:[['บริการใหม่',1],['ของรถไฟ',0],['ขบวนพิเศษสำหรับผู้โดยสารคนสำคัญ',1]]},
  {s:[['รถนอนชั้นสองปรับอากาศ',0],['โฉมใหม่สไตล์หรู',1],[' ',0],['หลับสบายได้เต็มตื่น',1],[' ',0],['เย็นสดชื่นตลอดทาง',1],[' เพิ่มค่าบริการจากรถนอนชั้นสองธรรมดา',0],['แบบสบายกระเป๋า',1],['อีกเพียงท่านละ ๓๐๐ บาทเท่านั้น ท่านจะได้พบกับ',0],['บรรยากาศที่เย็นสบาย',1],[' ',0],['เต็มอิ่มกับวิวธรรมชาติที่ปราศจากฝุ่นและเสียงที่ดังรบกวน',1],[' ',0],['หลับได้อย่างเต็มที่ เป็นส่วนตัว ปลอดภัย ถึงปลายทางด้วยความสดชื่น',1],[' พร้อม',0],['บริการอาหารเช้าจากห้องอาหารระดับภัตตาคาร',1],[' ขณะนี้มีบริการในขบวน รถด่วนสายเหนือ (กรุงเทพฯ – เชียงใหม่) · รถด่วนสายใต้ (กรุงเทพฯ – หาดใหญ่) · รถด่วนสายอีสาน (กรุงเทพฯ – อุบลราชธานี) ดูรายละเอียดเพิ่มเติมได้ที่แฟนเพจ Rotfaithaihiso',0]]},
  {s:[['เชิญมา',0],['สัมผัสกับความสุขตลอดเส้นทางทั้งยามหลับและยามตื่น',1],[' ',0],['ชื่นชมบรรยากาศระหว่างทาง',1],['ที่แม้แต่',0],['การนั่งเครื่องบินก็มอบให้ไม่ได้',1]]}
];
const AD_N = AD.reduce((n,p)=>n+p.s.filter(x=>x[1]).length,0);
function adHTML(){
  const k='ad'; let i=0; const S=K.S;
  const seg=([t,key])=>{ if(!key) return esc(t); const j=i++, on=!!(S.reveal[k]&&S.reveal[k][j]);
    return K.role==='teacher' ? `<button type="button" class="ul${on?' on':''}" data-a="rv" data-k="${k}" data-i="${j}">${esc(t)}</button>` : `<span class="ul${on?' on':''}">${esc(t)}</span>`; };
  return `<div class="ad">${AD.map(p=>p.h?`<h4>${p.s.map(seg).join('')}</h4>`:`<p style="margin:6px 0">${p.s.map(seg).join('')}</p>`).join('')}</div>`;
}
const YN = [{v:'y',label:'✓ ขีดเส้นใต้'},{v:'n',label:'✗ ข้อมูลทั่วไป'}];
const tw3Step = K.form({
  k:'tw3', label:'นักสืบโฆษณา', min:8, book:'ทักษะวัฒนา ๓ หน้า ๑๕', title:'นักสืบโฆษณา · ทักษะวัฒนา ๓', colItem:'วลีจากโฆษณารถไฟ',
  opts:YN, pay:[[9,10],[8,7],[6,5],[4,3],[1,1]],
  intro:(view,shown)=> shown ? '' : `<h2 class="stitle">วลีไหนเป็นภาษาโน้มน้าวใจ</h2>
    <p class="${view==='T'?'slead':'note'}">ขีดเส้นใต้ในเล่มหน้า ๑๕ ก่อน แล้วกลุ่มตรวจ ๙ วลีนี้ส่งครู · วลีที่บอกแค่ข้อมูล (ชื่อขบวน เส้นทาง ช่องทางติดต่อ) ไม่ต้องขีด</p>`,
  items:[
    {text:'บริการใหม่', ans:'y'},
    {text:'รถนอนชั้นสองปรับอากาศ', ans:'n'},
    {text:'โฉมใหม่สไตล์หรู', ans:'y'},
    {text:'หลับสบายได้เต็มตื่น', ans:'y'},
    {text:'เพิ่มค่าบริการจากรถนอนชั้นสองธรรมดา', ans:'n'},
    {text:'บริการอาหารเช้าจากห้องอาหารระดับภัตตาคาร', ans:'y'},
    {text:'รถด่วนสายใต้ (กรุงเทพฯ – หาดใหญ่)', ans:'n'},
    {text:'ดูรายละเอียดเพิ่มเติมได้ที่แฟนเพจ Rotfaithaihiso', ans:'n'},
    {text:'การนั่งเครื่องบินก็มอบให้ไม่ได้', ans:'y'}
  ],
  after:(view)=>`<div class="card"><div class="row between"><span class="eyebrow">เฉลยทักษะวัฒนา ๓ · เส้นใต้ ${th(AD_N)} แห่ง</span>${T_ONLY(K.revealAllBtn('ad',AD_N))}</div>
    ${T_ONLY('<p class="slead">แตะวลีที่มีเส้นประทีละวลีเพื่อขีดเส้นใต้ นักเรียนตรวจในเล่มตาม</p>')}
    ${adHTML()}
    ${T_ONLY(`<div class="fb info" style="margin-top:12px"><b>ชวนคุยต่อ (เล่มไม่ได้ถาม):</b> โฆษณานี้ใช้วิธีโน้มน้าวใดบ้าง · แนวคำตอบของผู้เรียบเรียง: เร้าอารมณ์ (วาดภาพความสบาย ความสุข) · ยกผู้อ่านเป็น "ผู้โดยสารคนสำคัญ" · ให้ข้อมูลราคาและเส้นทางประกอบ นักเรียนตอบวิธีอื่นได้ถ้าชี้คำในข้อความ</div>
      <p class="authored">เส้นใต้ตามเฉลยของครูในเล่ม · ๙ วลีที่ให้กลุ่มตรวจ ผู้เรียบเรียงเลือกจากโฆษณาในเล่ม</p>`)}</div>`
});

/* ---------- ขั้น ๔ ภารกิจร้านของเรา ---------- */
const PRODUCTS = ['ขนมหม้อแกง','ร่มพับ','กระติกน้ำเก็บความเย็น','แอปจองคิวโรงอาหาร','ครีมกันแดด','เสื้อกีฬาสีรุ่นใหม่','สมุดจดศัพท์','หมวกกันน็อก'];
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
const missionStep = {
  k:'mission', label:'ภารกิจร้านของเรา', min:10, book:'ใช้วิธีที่ ๑–๖ หน้า ๑๓–๑๔',
  T(){
    const d=(K.S.data.mission)||{}, list=d.list||[], gs=K.groupsList();
    return `<div class="card"><div class="row between"><span class="eyebrow">ภารกิจร้านของเรา · ใช้กระดาษหรือไวต์บอร์ดกลุ่ม</span>
        <button class="btn${list.length?'':' primary'}" data-a="deal">${list.length?'แจกภารกิจใหม่':'แจกภารกิจ'}</button></div>
      <h2 class="stitle">แต่ละกลุ่มได้สินค้า ๑ อย่าง กับวิธีโน้มน้าวลับ ๑ วิธี</h2>
      <ol class="big" style="margin:6px 0 0;padding-left:1.4em">
        <li>ดูภารกิจบนมือถือกลุ่ม ห้ามบอกวิธีให้กลุ่มอื่นรู้</li>
        <li>เขียนคำเชิญชวน ๒–๓ บรรทัด ใช้วิธีที่ได้ให้เด่นที่สุด (๔ นาที)</li>
        <li>ตัวแทนอ่านให้เพื่อนฟัง กลุ่มอื่นชูนิ้วทายว่าเป็นวิธีที่เท่าไร</li>
        <li>ครูเปิดเฉลยในตาราง ทายถูกได้แสตมป์ คำเชิญชวนชัดจนเพื่อนส่วนใหญ่ทายถูก ได้แสตมป์ทั้งกลุ่ม</li>
      </ol>
      ${list.length?`<table class="tbl big deal" style="margin-top:12px"><tr><th>กลุ่ม</th><th>สินค้า</th><th>วิธีลับ (แตะเพื่อเปิด)</th><th></th></tr>${gs.map((g,i)=>{ const x=list[i]||{}; const m=MOF(x.m);
          return `<tr><td>กลุ่ม ${g}</td><td>${esc(x.p||'–')}</td><td>${x.m?blank('deal',i,'วิธีที่ '+m.n+' '+m.short):'–'}</td><td><button class="btn sm" data-a="g" data-g="${g}">ให้แสตมป์</button></td></tr>`; }).join('')}</table>`
        :'<p class="note" style="margin-top:12px">กด "แจกภารกิจ" เพื่อสุ่มสินค้าและวิธีให้ทุกกลุ่ม วิธีจะกระจายให้ไม่ซ้ำกันเท่าที่จะทำได้</p>'}
      ${AUTH('รายการสินค้าในภารกิจ')}</div>`;
  },
  G(){
    const d=(K.S.data.mission)||{}, list=d.list||[], gs=K.groupsList(), i=gs.indexOf(K.group), x=list[i];
    if(!x) return `<div class="card wait"><div class="huge">รอครูแจกภารกิจ</div>ภารกิจร้านของเรา</div>`;
    const m=MOF(x.m);
    return `<div class="card"><span class="eyebrow">ภารกิจลับของกลุ่ม ${K.group}</span>
      <div class="mission"><p class="note" style="margin:0">สินค้าของร้านเรา</p><div class="huge">${esc(x.p)}</div>
        <p class="note" style="margin:8px 0 0">วิธีโน้มน้าวที่ต้องใช้ (อย่าบอกกลุ่มอื่น)</p><div class="big"><b>วิธีที่ ${esc(m.n)}</b> ${esc(m.name)}</div>
        <ul style="margin:6px 0 0;padding-left:1.2em">${m.tips.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>
      <p class="note" style="margin-top:10px">เขียนคำเชิญชวน ๒–๓ บรรทัดลงกระดาษ แล้วเตรียมตัวแทนอ่าน</p></div>`;
  },
  on:{ deal(){ const gs=K.groupsList(); let ms=[]; while(ms.length<gs.length) ms=ms.concat(shuffle(METH.map(m=>m.v)));
    const ps=shuffle(PRODUCTS); K.update(S=>{ S.data.mission={list:gs.map((g,i)=>({p:ps[i%ps.length], m:ms[i]}))}; S.reveal.deal={}; }); } }
};

/* ---------- ขั้น ๕ ตั๋วออก ---------- */
const mo = (vs)=>vs.map(v=>({v, label:MOF(v).n+' '+MOF(v).short}));
const exitStep = K.form({
  k:'exit', label:'ตั๋วออก', min:3, book:'ทบทวนคาบนี้', title:'ตั๋วออก', colItem:'คำถาม',
  pay:[[3,5],[2,3],[1,1]],
  intro:(view,shown)=> shown ? '' : `<h2 class="stitle">ตอบ ๓ ข้อก่อนออกจากห้อง</h2><p class="note">ปรึกษากันในกลุ่มได้ ส่งคำตอบเดียว</p>`,
  items:[
    {text:'"ทันตแพทย์ ๙ ใน ๑๐ คนแนะนำยาสีฟันยี่ห้อนี้" เด่นที่วิธีใด', opts:mo(['m1','m3','m6']), ans:'m1'},
    {text:'"คนรักหัวหินอย่างเรา ต้องช่วยกันดูแลชายหาดของเรา" เด่นที่วิธีใด', opts:mo(['m2','m3','m5']), ans:'m3'},
    {text:'ใช้ทำนองเพลงที่ฟังแล้วติดหู ร้องตามได้ เป็นวิธีใด', opts:mo(['m4','m5','m6']), ans:'m6'}
  ],
  after:(view)=>`<div class="card"><p class="${view==='T'?'big':''}" style="margin:0">ข้อ ๑ ตัวเลขและผู้เชี่ยวชาญ → น่าเชื่อถือ · ข้อ ๒ "คนรักหัวหินอย่างเรา" → พวกเดียวกัน · ข้อ ๓ ตามรายละเอียดวิธีที่ ๖ ในเล่มหน้า ๑๔</p>${AUTH('ข้อความในตั๋วออก')}</div>`
});

K.period({
  css: P4_CSS,
  per:'p4', title:'คาบ ๔ ภาษากับการโน้มน้าวใจ', short:'คาบ ๔', accent:'persuade', plan:true,
  lead:'วิธีโน้มน้าวใจ ๖ วิธี ฝึกจับวิธีจากคำเชิญชวน ทำทักษะวัฒนา ๓ แล้วให้กลุ่มลองโน้มน้าวเอง (เล่มหน้า ๑๓–๑๕)',
  steps:[{k:'lobby', label:'เตรียมกลุ่ม'}, knowStep, marketStep, tw3Step, missionStep, exitStep, {k:'end', label:'สรุปแสตมป์'}],
  endNote:'<h3 style="margin-bottom:6px">งานนักสืบโฆษณา (ก่อนคาบหน้า)</h3><p style="margin:0">ถ่ายรูปโฆษณาจริง ๑ ชิ้น ขีดเส้นใต้ภาษาโน้มน้าว แล้วบอกว่าใช้วิธีที่เท่าไร · คาบหน้า: คาบ ๕ ภาษากับการโต้แย้ง เล่มหน้า ๑๖–๒๓</p>'
});
})();
