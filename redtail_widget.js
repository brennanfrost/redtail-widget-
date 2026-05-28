
(function(){
const CRUISE_ALT=12500;
const IMGS={"tbm_ext": "https://cdn.prod.website-files.com/6763978141891b5385add7b5/6a187f61a2377c80edeb3f0e_TBM%20Exterior.png", "tbm_int": "https://cdn.prod.website-files.com/6763978141891b5385add7b5/6a187f854fc11f0b40e706f9_Screenshot%202026-04-14%20at%2011.39.42%E2%80%AFAM.png", "kodiak_ext": "https://cdn.prod.website-files.com/6763978141891b5385add7b5/6a187f94bb2a912aaeeba280_Kodiak%20100%20exterior%20.JPG", "kodiak_int": "https://cdn.prod.website-files.com/6763978141891b5385add7b5/6a187f61d6bdea8424f2bac7_Kodiak%20Interior.png", "airvan_ext": "https://cdn.prod.website-files.com/6763978141891b5385add7b5/6a187f942f870b570e0786a8_Airvan%20Exterior.png", "airvan_int": "https://cdn.prod.website-files.com/6763978141891b5385add7b5/6a187f6152c7f011404f03c6_Airvan%20Interior.png", "c207_ext": "https://cdn.prod.website-files.com/6763978141891b5385add7b5/6a187ffe413dc05d2d1061e4_Screenshot%202026-05-28%20at%2011.47.59%E2%80%AFAM.jpg", "c207_int": "https://cdn.prod.website-files.com/6763978141891b5385add7b5/6a187f6152c7f011404f03c3_207%20Interior.png", "c172_ext": "https://cdn.prod.website-files.com/6763978141891b5385add7b5/6a187f94f1a3b21cf5f6ae37_Cessna%20Exterior%20.JPG", "c172_int": "https://cdn.prod.website-files.com/6763978141891b5385add7b5/6a187f613bf54d6415c55e27_172%20interior.png"};
const FLEET=[
  {id:'tmb700',name:'TBM 700',      type:'Turboprop',seats:'Up to 5',pax:5, range_nm:1650,rate:2200,fet:true, ext:'tbm_ext',   int_:'tbm_int',   climb_kts:150,climb_fpm:1875,cruise_kts:240,desc_kts:180,desc_fpm:1500},
  {id:'kodiak',name:'Kodiak 100',   type:'Turboprop',seats:'Up to 9',pax:9, range_nm:1005,rate:1750,fet:true, ext:'kodiak_ext',int_:'kodiak_int',climb_kts:120,climb_fpm:800, cruise_kts:150,desc_kts:160,desc_fpm:500},
  {id:'airvan',name:'Gipps Airvan', type:'Piston',   seats:'Up to 7',pax:7, range_nm:600, rate:1030,fet:false,ext:'airvan_ext',int_:'airvan_int',climb_kts:90, climb_fpm:400, cruise_kts:120,desc_kts:125,desc_fpm:300},
  {id:'c207',  name:'Cessna 207',   type:'Piston',   seats:'Up to 6',pax:6, range_nm:520, rate:875, fet:false,ext:'c207_ext',  int_:'c207_int',  climb_kts:95, climb_fpm:500, cruise_kts:115,desc_kts:100,desc_fpm:500},
  {id:'c172',  name:'Cessna 172',   type:'Piston',   seats:'Up to 3',pax:3, range_nm:640, rate:590, fet:false,ext:'c172_ext',  int_:'c172_int',  climb_kts:70, climb_fpm:500, cruise_kts:105,desc_kts:110,desc_fpm:500},
];
const HS_PORTAL_ID='YOUR_PORTAL_ID';
const HS_FORM_ID='YOUR_FORM_ID';
const HOME={la:38.755,lo:-109.755,t:0};
let mode='oneway',tripData=null,leadData=null,selectedAC=null,origSelected=null,destSelected=null;
const AP=window.RT_AP||{};
const AL=window.RT_AL||{};
const CM=window.RT_CM||{};

// Inject styles
const style=document.createElement('style');
style.textContent=`
*{box-sizing:border-box;margin:0;padding:0}
.rt-w{width:100%;max-width:900px;background:#1a1e24;border-radius:16px;padding:40px 48px;color:#e8e0d0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
.rt-eyebrow{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#a89880;font-weight:600;margin-bottom:8px}
.rt-title{font-size:26px;font-weight:700;color:#f0e8d8;line-height:1.2;margin-bottom:28px}
.rt-tabs{display:flex;gap:8px;margin-bottom:28px}
.rt-tab{padding:8px 24px;border-radius:999px;font-size:13px;cursor:pointer;border:1px solid #3a3e44;background:transparent;color:#a89880;transition:all .15s;font-family:inherit;font-weight:500}
.rt-tab.active{background:#c8773a;border-color:#c8773a;color:#fff}
.rt-tab:hover:not(.active){background:#252a30;border-color:#4a4e54;color:#e8e0d0}
.rt-g2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
.rt-g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px}
.rt-f{display:flex;flex-direction:column;gap:6px;position:relative}
.rt-f label{font-size:11px;color:#a89880;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.rt-f input,.rt-f select{padding:11px 14px;border-radius:8px;border:1px solid #3a3e44;background:#252a30;color:#f0e8d8;font-size:14px;width:100%;font-family:inherit;outline:none;transition:border-color .15s}
.rt-f input::placeholder{color:#4a5060}
.rt-f input:focus,.rt-f select:focus{border-color:#c8773a;background:#2a2f36}
.rt-f select option{background:#252a30;color:#f0e8d8}
.rt-drop{position:absolute;top:calc(100% + 2px);left:0;right:0;background:#252a30;border:1px solid #c8773a;border-radius:8px;z-index:200;max-height:220px;overflow-y:auto;box-shadow:0 8px 24px rgba(0,0,0,.5)}
.rt-di{padding:10px 14px;cursor:pointer;font-size:13px;color:#e8e0d0;border-bottom:1px solid #2e3238;transition:background .1s}
.rt-di:last-child{border-bottom:none}
.rt-di:hover,.rt-di.h{background:#2e3a28}
.rt-code{font-size:11px;color:#c8773a;font-weight:700;margin-right:6px}
.rt-aname{color:#a89880}
.rt-btn{width:100%;padding:14px;background:#c8773a;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;transition:background .15s;letter-spacing:.02em;margin-top:8px}
.rt-btn:hover{background:#b5662a}
.rt-btn:active{transform:scale(.99)}
.rt-err{color:#e07050;font-size:12px;margin-top:8px}
.rt-lh{margin-bottom:24px}
.rt-lh h2{font-size:22px;font-weight:700;color:#f0e8d8;margin-bottom:8px}
.rt-lh p{font-size:14px;color:#6a7080;line-height:1.6}
.rt-rs{background:#252a30;border:1px solid #3a3e44;border-radius:10px;padding:14px 18px;margin-bottom:24px;font-size:13px;color:#a89880;line-height:1.7}
.rt-rs strong{color:#f0e8d8;font-weight:600}
.rt-list{display:flex;flex-direction:column;gap:16px;margin-bottom:20px}
.rt-card{border:2px solid #3a3e44;border-radius:12px;background:#1c2026;overflow:hidden;transition:border-color .2s;cursor:pointer;user-select:none;display:flex;flex-direction:column}
.rt-card:hover{border-color:#6a7080}
.rt-card.sel{border-color:#c8773a}
.rt-card.un{opacity:.3;pointer-events:none;cursor:default}
.rt-photos{display:grid;grid-template-columns:1fr 1fr;height:190px;gap:2px;background:#13171d;flex-shrink:0}
.rt-photo{width:100%;height:100%;object-fit:cover;display:block}
.rt-info{display:grid;grid-template-columns:auto auto auto 1fr auto;align-items:stretch;background:#1c2026;border-top:2px solid #2a2e34;flex-shrink:0}
.rt-cell{padding:14px 18px;border-right:1px solid #2a2e34;display:flex;flex-direction:column;justify-content:center;gap:4px;min-width:0}
.rt-cell:last-child{border-right:none}
.rt-cell.g{flex:1}
.rt-cl{font-size:10px;color:#4a5060;text-transform:uppercase;letter-spacing:.07em;font-weight:600;white-space:nowrap}
.rt-cv{font-size:14px;font-weight:600;color:#c8c0b0;white-space:nowrap}
.rt-cv.t{color:#c8773a;font-size:22px;font-weight:700;line-height:1.1}
.rt-cv.p{color:#f0e8d8;font-size:22px;font-weight:700;line-height:1.1}
.rt-cv.na{color:#3a4050;font-size:13px}
.rt-div{display:flex;align-items:center;gap:12px;margin:8px 0}
.rt-div span{font-size:11px;color:#3a4050;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap}
.rt-div:before,.rt-div:after{content:'';flex:1;border-top:1px solid #2a2e34}
.rt-book{width:100%;padding:14px;background:#c8773a;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;letter-spacing:.02em}
.rt-book:hover{background:#b5662a}
.rt-book:disabled{background:#2a2e34;color:#4a5060;cursor:not-allowed}
.rt-berr{color:#e07050;font-size:12px;margin-top:8px;text-align:center;min-height:18px}
.rt-fn{margin-top:20px;padding:14px 18px;background:#252a30;border-radius:8px;border:1px solid #3a3e44;font-size:13px;font-weight:600;color:#a89880;text-align:center;line-height:1.6}
.rt-ty{text-align:center;padding:32px 0 16px}
.rt-ty .ic{font-size:48px;margin-bottom:16px}
.rt-ty h3{font-size:22px;font-weight:700;color:#f0e8d8;margin-bottom:10px}
.rt-ty p{font-size:14px;color:#6a7080;line-height:1.7}
.rt-ty a{color:#c8773a;font-weight:600;text-decoration:none}
.rt-back{display:inline-block;margin-top:16px;font-size:13px;color:#c8773a;cursor:pointer;background:none;border:none;font-family:inherit}
.rt-back:hover{text-decoration:underline}
@media(max-width:680px){.rt-w{padding:24px 18px}.rt-title{font-size:20px}.rt-g2,.rt-g3{grid-template-columns:1fr 1fr}.rt-photos{height:130px}.rt-info{grid-template-columns:1fr 1fr}.rt-cell{border-right:none;border-bottom:1px solid #2a2e34}.rt-cv.t,.rt-cv.p{font-size:18px}}
@media(max-width:400px){.rt-g2,.rt-g3{grid-template-columns:1fr}}
`;
document.head.appendChild(style);

// Create container
const container=document.getElementById('rt-app');
if(!container){console.error('Redtail widget: no element with id="rt-app" found');return;}
container.className='rt-w';

function hav(la1,lo1,la2,lo2){const R=3440.065,dL=(la2-la1)*Math.PI/180,dO=(lo2-lo1)*Math.PI/180,a=Math.sin(dL/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dO/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
function fmtT(h){const hh=Math.floor(h),mm=Math.round((h-hh)*60);return mm>0?`${hh}h ${mm}m`:`${hh}h`;}
function lu(c){return AP[c.trim().toUpperCase()]||null;}
function pad(a){return a.t?0.1:0.05;}
function flightTime(ac,nm){const ch=CRUISE_ALT/ac.climb_fpm/60,dh=CRUISE_ALT/ac.desc_fpm/60,cn=ac.climb_kts*ch,dn=ac.desc_kts*dh;if(nm<=(cn+dn))return nm/((ac.climb_kts+ac.desc_kts)/2);return ch+(nm-cn-dn)/ac.cruise_kts+dh;}
function calcPad(orig,dest,hasFerry,hasRetFerry,isRT){const hp=0.05,op=pad(orig),dp=pad(dest);if(!hasFerry)return isRT?hp+dp+dp+hp:hp+dp;if(!isRT)return hp+op+dp+(hasRetFerry?hp:0);return hp+op+dp+dp+op+hp;}
function calcTotal(ac,orig,dest,pax,oc,isRT){const legNm=Math.round(hav(orig.la,orig.lo,dest.la,dest.lo));if(legNm>ac.range_nm||pax>ac.pax)return null;const isHome=(oc==='KCNY'||oc==='CNY');const ferryNm=isHome?0:Math.round(hav(HOME.la,HOME.lo,orig.la,orig.lo));const retFerryNm=(isRT||isHome)?0:Math.round(hav(dest.la,dest.lo,HOME.la,HOME.lo));const hasFerry=!isHome&&ferryNm>5,hasRetFerry=retFerryNm>5;const tripFly=flightTime(ac,legNm)*(isRT?2:1);const ferryFly=hasFerry?flightTime(ac,ferryNm):0;const retFly=hasRetFerry?flightTime(ac,retFerryNm):0;const taxi=calcPad(orig,dest,hasFerry,hasRetFerry,isRT);const billed=tripFly+ferryFly+retFly+taxi;const sub=Math.round(billed*ac.rate);const fet=ac.fet?Math.round(sub*0.075):0;const cc=Math.round((sub+fet)*0.03);return{total:sub+fet+cc,flightTime:tripFly,legNm};}
function searchAirports(query){if(!query||query.length<2)return[];const q=query.toLowerCase().trim();const results=[],seen=new Set();const direct=lu(q.toUpperCase());if(direct){seen.add(q.toUpperCase());results.push({code:q.toUpperCase(),...direct});}for(const[alias,codes]of Object.entries(AL)){if(alias===q||alias.startsWith(q)||q.startsWith(alias)){codes.forEach(code=>{if(!seen.has(code)&&AP[code]){seen.add(code);results.push({code,...AP[code]});}});}}const matched=new Set();for(const[word,codes]of Object.entries(CM)){if(word.startsWith(q)||q.startsWith(word)||word===q)codes.forEach(c=>matched.add(c));}matched.forEach(code=>{if(!seen.has(code)&&AP[code]){seen.add(code);results.push({code,...AP[code]});}});results.sort((a,b)=>{const an=a.n.toLowerCase(),bn=b.n.toLowerCase();const ae=an.startsWith(q)||a.code.toLowerCase()===q;const be=bn.startsWith(q)||b.code.toLowerCase()===q;if(ae&&!be)return -1;if(!ae&&be)return 1;return an.localeCompare(bn);});return results.slice(0,8);}
let dO=-1,dD=-1;
function setupSearch(iId,dId){const inp=document.getElementById(iId),drp=document.getElementById(dId);if(!inp||!drp)return;const isO=iId==='rt-orig';inp.addEventListener('input',()=>{if(isO)origSelected=null;else destSelected=null;const res=searchAirports(inp.value.trim());if(!res.length){drp.innerHTML='';drp.style.display='none';return;}if(isO)dO=-1;else dD=-1;drp.innerHTML=res.map(r=>`<div class="rt-di" onmousedown="event.preventDefault()" onclick="rtSel('${iId}','${dId}','${r.code}')"><span class="rt-code">${r.code}</span><span class="rt-aname">${r.n}</span></div>`).join('');drp.style.display='block';});inp.addEventListener('blur',()=>setTimeout(()=>drp.style.display='none',150));inp.addEventListener('keydown',(e)=>{const its=[...drp.querySelectorAll('.rt-di')];if(!its.length)return;let idx=isO?dO:dD;if(e.key==='ArrowDown')idx=Math.min(idx+1,its.length-1);else if(e.key==='ArrowUp')idx=Math.max(idx-1,0);else if(e.key==='Enter'&&idx>=0){e.preventDefault();its[idx].click();return;}else return;e.preventDefault();its.forEach(el=>el.classList.remove('h'));if(idx>=0)its[idx].classList.add('h');if(isO)dO=idx;else dD=idx;});}
window.rtSel=function(iId,dId,code){const inp=document.getElementById(iId),drp=document.getElementById(dId);if(inp)inp.value=code;if(drp)drp.style.display='none';if(iId==='rt-orig')origSelected=code;else destSelected=code;};
window.rtToggle=function(id){if(selectedAC===id){selectedAC=null;document.querySelectorAll('.rt-card').forEach(el=>el.classList.remove('sel'));document.getElementById('rt-book').disabled=true;}else{selectedAC=id;document.querySelectorAll('.rt-card:not(.un)').forEach(el=>el.classList.toggle('sel',el.dataset.id===id));document.getElementById('rt-book').disabled=false;}const e=document.getElementById('rt-berr');if(e)e.textContent='';};
window.rtMode=function(m){mode=m;render('search');};
window.rtSearch=function(){const oInp=document.getElementById('rt-orig').value.trim(),dInp=document.getElementById('rt-dest').value.trim();const pax=parseInt(document.getElementById('rt-pax').value)||1;const date=document.getElementById('rt-date').value;const err=document.getElementById('rt-serr');const oc=(origSelected||oInp).toUpperCase(),dc=(destSelected||dInp).toUpperCase();const orig=lu(oc),dest=lu(dc);if(!orig){err.textContent=`"${oInp}" not found. Try a city name like "Moab" or code like "SLC".`;return;}if(!dest){err.textContent=`"${dInp}" not found.`;return;}if(oc===dc){err.textContent='Origin and destination must be different.';return;}err.textContent='';tripData={oc,dc,orig,dest,pax,date,isRT:mode==='roundtrip',origName:orig.n,destName:dest.n};render('lead');};
window.rtLead=function(){const first=document.getElementById('rt-first').value.trim(),last=document.getElementById('rt-last').value.trim(),email=document.getElementById('rt-email').value.trim(),phone=document.getElementById('rt-phone').value.trim();const err=document.getElementById('rt-lerr');if(!first||!last){err.textContent='Please enter your full name.';return;}if(!email||!/\S+@\S+\.\S+/.test(email)){err.textContent='Please enter a valid email.';return;}if(!phone){err.textContent='Please enter a phone number.';return;}err.textContent='';leadData={first,last,email,phone};submitHS(leadData);selectedAC=null;render('results');};
window.rtBook=function(){if(!selectedAC){document.getElementById('rt-berr').textContent='Please select an aircraft before booking.';document.getElementById('rt-berr').scrollIntoView({behavior:'smooth',block:'nearest'});return;}render('thankyou');};
window.rtRender=function(s){render(s);};
function submitHS(lead){if(HS_PORTAL_ID==='YOUR_PORTAL_ID')return;const url=`https://api.hsforms.com/submissions/v3/integration/submit/${HS_PORTAL_ID}/${HS_FORM_ID}`;fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:[{name:'firstname',value:lead.first},{name:'lastname',value:lead.last},{name:'email',value:lead.email},{name:'phone',value:lead.phone},{name:'message',value:`Charter: ${tripData.oc}->${tripData.dc} | ${tripData.pax} pax | ${tripData.date}${tripData.isRT?' RT':''}`}],context:{pageUri:window.location.href,pageName:document.title}})}).catch(()=>{});}
function render(screen){const app=document.getElementById('rt-app');if(screen==='search')rSearch(app);else if(screen==='lead')rLead(app);else if(screen==='results')rResults(app);else if(screen==='thankyou')rThankyou(app);}
function rSearch(app){const isRT=mode==='roundtrip';app.innerHTML=`<div class="rt-eyebrow">Redtail Air &middot; Moab, Utah</div><div class="rt-title">Get an instant charter quote</div><div class="rt-tabs"><button class="rt-tab ${mode==='oneway'?'active':''}" onclick="rtMode('oneway')">One way</button><button class="rt-tab ${mode==='roundtrip'?'active':''}" onclick="rtMode('roundtrip')">Round trip</button></div><div class="rt-g2"><div class="rt-f"><label>From</label><input type="text" id="rt-orig" placeholder="City or airport code" autocomplete="off" oninput="origSelected=null"/><div id="rt-drop-o" class="rt-drop" style="display:none"></div></div><div class="rt-f"><label>To</label><input type="text" id="rt-dest" placeholder="City or airport code" autocomplete="off" oninput="destSelected=null"/><div id="rt-drop-d" class="rt-drop" style="display:none"></div></div></div><div class="${isRT?'rt-g3':'rt-g2'}"><div class="rt-f"><label>Passengers</label><select id="rt-pax">${[1,2,3,4,5,6,7,8,9].map(n=>`<option value="${n}"${n===3?' selected':''}>${n} passenger${n>1?'s':''}</option>`).join('')}</select></div><div class="rt-f"><label>Depart date</label><input type="date" id="rt-date"/></div>${isRT?'<div class="rt-f"><label>Return date</label><input type="date" id="rt-retdate"/></div>':''}</div><div id="rt-serr" class="rt-err"></div><button class="rt-btn" onclick="rtSearch()">Get a quote &rarr;</button><p style="margin-top:14px;font-size:11px;color:#3a4050;text-align:center">Pricing based on Redtail\'s fleet departing from Canyonlands (KCNY), Moab UT</p>`;document.getElementById('rt-date').valueAsDate=new Date();origSelected=null;destSelected=null;dO=-1;dD=-1;setupSearch('rt-orig','rt-drop-o');setupSearch('rt-dest','rt-drop-d');}
function rLead(app){app.innerHTML=`<div class="rt-lh"><h2>One more step</h2><p>Enter your contact details to see available aircraft and pricing. A Redtail team member will follow up personally.</p></div><div class="rt-g2" style="margin-bottom:16px"><div class="rt-f"><label>First name</label><input type="text" id="rt-first" placeholder="John"/></div><div class="rt-f"><label>Last name</label><input type="text" id="rt-last" placeholder="Smith"/></div></div><div class="rt-f" style="margin-bottom:16px"><label>Email address</label><input type="email" id="rt-email" placeholder="john@example.com"/></div><div class="rt-f"><label>Phone number</label><input type="tel" id="rt-phone" placeholder="(555) 000-0000"/></div><div id="rt-lerr" class="rt-err"></div><button class="rt-btn" onclick="rtLead()">See pricing &rarr;</button><div style="text-align:center;margin-top:14px"><button class="rt-back" onclick="rtRender('search')">&larr; Change trip details</button></div>`;}
function rResults(app){const{oc,dc,orig,dest,pax,date,isRT,origName,destName}=tripData;const legNm=Math.round(hav(orig.la,orig.lo,dest.la,dest.lo));const avail=FLEET.filter(ac=>calcTotal(ac,orig,dest,pax,oc,isRT)!==null);const unavail=FLEET.filter(ac=>calcTotal(ac,orig,dest,pax,oc,isRT)===null);const aC=avail.map(ac=>{const q=calcTotal(ac,orig,dest,pax,oc,isRT);return`<div class="rt-card" data-id="${ac.id}" onclick="rtToggle('${ac.id}')"><div class="rt-photos"><img class="rt-photo" src="${IMGS[ac.ext]}" alt="${ac.name} exterior" loading="lazy"/><img class="rt-photo" src="${IMGS[ac.int_]}" alt="${ac.name} interior" loading="lazy"/></div><div class="rt-info"><div class="rt-cell"><span class="rt-cl">Aircraft</span><span class="rt-cv">${ac.name}</span></div><div class="rt-cell"><span class="rt-cl">Type</span><span class="rt-cv">${ac.type}</span></div><div class="rt-cell"><span class="rt-cl">Seats</span><span class="rt-cv">${ac.seats} passengers</span></div><div class="rt-cell g"><span class="rt-cl">Flight time</span><span class="rt-cv t">${fmtT(q.flightTime)}</span></div><div class="rt-cell"><span class="rt-cl">Est. total</span><span class="rt-cv p">$${q.total.toLocaleString()}</span></div></div></div>`;}).join('');const uC=unavail.length?`<div class="rt-div"><span>Not available for this route</span></div>${unavail.map(ac=>`<div class="rt-card un" data-id="${ac.id}"><div class="rt-photos"><img class="rt-photo" src="${IMGS[ac.ext]}" loading="lazy"/><img class="rt-photo" src="${IMGS[ac.int_]}" loading="lazy"/></div><div class="rt-info"><div class="rt-cell"><span class="rt-cl">Aircraft</span><span class="rt-cv">${ac.name}</span></div><div class="rt-cell"><span class="rt-cl">Type</span><span class="rt-cv">${ac.type}</span></div><div class="rt-cell"><span class="rt-cl">Seats</span><span class="rt-cv">${ac.seats} passengers</span></div><div class="rt-cell g"></div><div class="rt-cell"><span class="rt-cl">&nbsp;</span><span class="rt-cv na">Not available</span></div></div></div>`).join('')}`:'';app.innerHTML=`<div class="rt-rs"><strong>${origName} &rarr; ${destName}</strong>${isRT?' &middot; Round trip':' &middot; One way'}<br>${pax} passenger${pax>1?'s':''} &middot; ${date} &middot; ${legNm} nm</div><div class="rt-list">${aC}${uC}</div><button id="rt-book" class="rt-book" onclick="rtBook()" disabled>Book now &rarr;</button><div id="rt-berr" class="rt-berr"></div><div style="text-align:center;margin-top:14px"><button class="rt-back" onclick="rtRender('search')">&larr; New search</button></div><div class="rt-fn">Prices are estimates. Final quotes confirmed by our team. Rates include aircraft, crew, and fuel.</div>`;}
function rThankyou(app){app.innerHTML=`<div class="rt-ty"><div class="ic">&#9992;&#65039;</div><h3>We\'ll be in touch soon</h3><p>Thanks${leadData?.first?', '+leadData.first:''}. A Redtail Air team member will reach out shortly to confirm your flight.</p><p style="margin-top:16px">Want to talk now?<br><a href="tel:4352597421">(435) 259-7421</a></p><button class="rt-back" onclick="rtRender('search')">&larr; Start a new quote</button></div>`;}
render('search');
})();
