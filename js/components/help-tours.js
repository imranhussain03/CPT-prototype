// ═══ HELP & TOURS (live parity) ═══
// Floating ⚡ button → "How can I help?" menu: a spotlight tour of the request screen, a tour of the
// shell, and the full User Guide. Tours point at the real screen (data-tour anchors), not screenshots.
const STAGE_GUIDE={
  1:{who:"The requesting doctor",what:"Creates the request: procedure, proposed CPT code, patient type, anesthesia, gender, operation skill, accommodation days, duration and the five LOS & services lists.",acts:["Save draft","Preview","Submit"],next:"Submitting sends it to the branch CMO at stage 2."},
  2:{who:"Branch CMO",what:"Reviews the clinical case and the attachments.",acts:["Approve","Request modification (back to the doctor)","Reject","Request a document"],next:"Approval moves it to CMIO validation."},
  3:{who:"CMIO (may forward to a delegate)",what:"Validates the CPT code and decides whether it already exists. An existing CPT takes the short 5-step route.",acts:["Validate & approve","Forward to delegate","Reject","Request modification"],next:"New CPT → Nursing Templates. Existing CPT → CFO then CMO acknowledgement."},
  4:{who:"Nursing Manager",what:"Builds the four OT templates (procedure / ward × consumables / drugs) and confirms LOS & services.",acts:["Submit data"],next:"Goes to the CNO."},
  5:{who:"CNO",what:"Approves the nursing build.",acts:["Approve","Request modification"],next:"Chief Surgeon of the specialty."},
  6:{who:"Chief Surgeon (by specialty)",what:"Clinical sign-off for the specialty in that branch.",acts:["Approve","Request modification"],next:"CMO Final."},
  7:{who:"Branch CMO",what:"Final clinical approval in the raising branch.",acts:["Approve","Request modification"],next:"Other branch CNO."},
  8:{who:"Other branch CNO",what:"Cross-branch nursing approval.",acts:["Approve","Request modification"],next:"Other branch CMO."},
  9:{who:"Other branch CMO",what:"Cross-branch clinical approval.",acts:["Approve","Request modification"],next:"Financials (FCD)."},
  10:{who:"CFO (may forward to a delegate)",what:"Costs every service line and sets the final patient price; margin is calculated.",acts:["Approve and add FCD details","Forward","Modification"],next:"CEO price review."},
  11:{who:"CEO",what:"Approves — or adjusts — the patient price. An adjustment alerts the CFO.",acts:["Grant final approval"],next:"CSCM system setup."},
  12:{who:"CSCM (may forward)",what:"Creates the operation code on PrimeCare and links it — permanently.",acts:["Approve with proof attached"],next:"CFO package setup."},
  13:{who:"CFO (may forward)",what:"Creates the PKGID on PrimeCare and applies the CAP limit.",acts:["Approve with proof attached"],next:"CSCM template link."},
  14:{who:"CSCM (may forward)",what:"Links the four templates to the package on live.",acts:["Approve with proof attached"],next:"CFO acknowledgement."},
  15:{who:"CFO",what:"Final acknowledgement — the version goes live and the certificate is filed and emailed.",acts:["Acknowledge & finalize"],next:"Approved & Active."},
};
const GUIDE_TOPICS=[
  {g:"Getting started",items:[["What CliniPack does","Costs and prices a clinical package once, with every approver signing on the same record."],["Who does what","Each stage has one approver per branch, set in Setup → Approval Workflow."],["Finding your way around","My Tasks is home; Dashboard is the overview; Approved is the live price list."]]},
  {g:"Everyday work",items:[["My Tasks","Overdue, due today and upcoming — everything waiting on you, including amendments."],["Notifications & email","Every email the system sends also lands here."],["Inside a request","Tracker on top, tabs in the middle, your decision in the bar at the bottom."]]},
  {g:"Changing an approved package",items:[["Which kind of change","Edit Package makes every field editable; the route builds itself from what you change."],["The six categories","Clinical, CPT, PKGID, Fees, Op code and Finance — each with its own approvers and PrimeCare confirmation."],["Tracking, withdrawing, versions","The package stays in force at its current version until the change is applied; a finance change can be withdrawn."]]},
  {g:"Administrator",items:[["The Setup console","Approvers, SLA, emails, edit design and master data — all configuration."],["Data Import — legacy packages","Staged as Draft until a manager approves; then live under Approved."]]},
  {g:"Reference",items:[["Status glossary","Every badge names the stage it is waiting on. Green is finished; red was stopped."],["Who can see money","Costings are restricted to the finance stages; prices are visible on the package."]]},
];
function HelpTours({view,approvalConfig=[]}){
  const[menu,setMenu]=useState(false);const[tour,setTour]=useState(null);const[ix,setIx]=useState(0);const[guide,setGuide]=useState(false);const[,force]=useState(0);
  const TOURS={
    request:[
      {sel:'[data-tour="status"]',t:"The status says who it is with",x:"Every status names the stage it is waiting on — “Pending CMO”, “Pending Nursing Templates”. Green means finished; red means it was stopped."},
      {sel:'[data-tour="tracker"]',t:"Where it has reached",x:"A new procedure runs 15 stages, from the doctor through medical, nursing and financial approval to PrimeCare setup and the certificate. If the CMIO finds the CPT already exists, it runs a short 5-step route instead."},
      {sel:'[data-tour="tabs"]',t:"Everything about the package",x:"Overview, OT templates, financials, PrimeCare setup, attachments, changes and history — one tab each. Prev / Next at the bottom walks them in order."},
      {sel:'[data-tour="actionbar"]',t:"Your decision lives here",x:"When it is your turn the bar shows your stage and its actions. When it is not, it says who it is waiting on. On an approved package it holds Edit Package."},
    ],
    around:[
      {sel:'[data-tour="sidebar"]',t:"The sidebar",x:"My Tasks is home. Dashboard is the overview, All Requests and Approved are the full lists, and Setup is for administrators."},
      {sel:'[data-tour="header-tools"]',t:"Refresh and notifications",x:"Refresh pulls the latest from SharePoint. The bell counts unread notifications — the same messages the system emails."},
      {sel:'[data-scroll-main="1"]',t:"Your work area",x:"Every page opens here. Click any row to open the request."},
      {sel:'[data-tour="help-fab"]',t:"Help is always here",x:"Start a tour or open the full guide from this button at any time. Press Esc to leave a tour."},
    ],
  };
  const steps=tour?TOURS[tour].filter(s=>document.querySelector(s.sel)):[];
  const step=steps[ix];
  useEffect(()=>{const k=e=>{if(e.key==="Escape"){setTour(null);setMenu(false);setGuide(false);}};document.addEventListener("keydown",k);return()=>document.removeEventListener("keydown",k);},[]);
  useEffect(()=>{if(!step)return;const el=document.querySelector(step.sel);if(el&&el.scrollIntoView)el.scrollIntoView({block:"nearest"});const t=setTimeout(()=>force(n=>n+1),250);return()=>clearTimeout(t);},[tour,ix]);
  const start=k=>{setMenu(false);setIx(0);setTour(k);};
  let spot=null;
  if(step){const el=document.querySelector(step.sel);if(el){const r=el.getBoundingClientRect();const pad=6;
    const box={left:Math.max(4,r.left-pad),top:Math.max(4,r.top-pad),width:Math.min(window.innerWidth-8,r.width+pad*2),height:Math.min(window.innerHeight-8,r.height+pad*2)};
    const below=box.top+box.height+220<window.innerHeight;
    const cardTop=below?box.top+box.height+12:Math.max(12,box.top-212);
    const cardLeft=Math.min(Math.max(12,box.left),window.innerWidth-340);
    spot=<div style={{position:"fixed",inset:0,zIndex:10001}}>
      <div style={{position:"fixed",...box,borderRadius:10,boxShadow:"0 0 0 9999px rgba(15,23,42,0.55)",border:"2px solid #fff",pointerEvents:"none",transition:"all 0.25s"}}/>
      <button onClick={()=>setTour(null)} style={{position:"fixed",top:12,right:14,padding:"6px 12px",borderRadius:6,border:"none",background:"#fff",color:T.text,fontSize:11,fontWeight:700,cursor:"pointer"}}>Skip tour</button>
      <div style={{position:"fixed",top:cardTop,left:cardLeft,width:320,background:"#fff",borderRadius:10,boxShadow:"0 16px 40px rgba(0,0,0,0.3)",padding:"14px 16px"}}>
        <div style={{fontSize:9.5,fontWeight:800,letterSpacing:0.6,color:T.primary}}>STEP {ix+1} OF {steps.length}</div>
        <div style={{fontSize:14,fontWeight:700,color:T.text,margin:"4px 0 6px"}}>{step.t}</div>
        <div style={{fontSize:12,color:T.textSec,lineHeight:1.55}}>{step.x}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:14}}>
          <div style={{display:"flex",gap:4}}>{steps.map((_,i)=><span key={i} style={{width:i===ix?16:6,height:6,borderRadius:3,background:i===ix?T.primary:"#cbd5e1"}}/>)}</div>
          <div style={{display:"flex",gap:6}}>
            <button disabled={ix===0} onClick={()=>setIx(ix-1)} style={{padding:"6px 12px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:11.5,color:ix===0?T.textMut:T.textSec,cursor:ix===0?"default":"pointer"}}>Back</button>
            <button onClick={()=>ix>=steps.length-1?setTour(null):setIx(ix+1)} style={{padding:"6px 14px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:11.5,fontWeight:700,cursor:"pointer"}}>{ix>=steps.length-1?"Done":"Next →"}</button>
          </div>
        </div>
      </div>
    </div>;}}
  const item=(ic,t,s,fn,dis)=><div onClick={dis?null:fn} style={{display:"flex",gap:12,padding:"10px 12px",borderRadius:8,cursor:dis?"default":"pointer",opacity:dis?0.45:1}} onMouseEnter={e=>{if(!dis)e.currentTarget.style.background="#f1f5f9";}} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
    <span style={{width:28,height:28,borderRadius:7,background:T.primaryLight,color:T.primary,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n={ic} s={14}/></span>
    <div><div style={{fontSize:12.5,fontWeight:700,color:T.text}}>{t}</div><div style={{fontSize:11,color:T.textSec,marginTop:2,lineHeight:1.4}}>{s}</div></div></div>;
  return <React.Fragment>
    {spot}
    {guide&&<UserGuide onClose={()=>setGuide(false)} approvalConfig={approvalConfig}/>}
    {menu&&<div style={{position:"fixed",right:18,bottom:74,width:300,background:"#fff",borderRadius:12,boxShadow:"0 16px 48px rgba(15,23,42,0.25)",zIndex:9998,overflow:"hidden",border:`1px solid ${T.border}`}}>
      <div style={{background:T.primary,color:"#fff",padding:"12px 14px"}}><div style={{fontSize:13,fontWeight:700}}>How can I help?</div><div style={{fontSize:11,opacity:0.85,marginTop:2}}>Guided tours point at the real screen — nothing here is a screenshot.</div></div>
      <div style={{padding:6}}>
        {item("zap","Explain this request","The stage tracker, the tabs and the action bar.",()=>start("request"),view!=="detail")}
        {item("zap","Show me around","The sidebar and the header, in about a minute.",()=>start("around"))}
        {item("fileText","Open the full guide","Every role, every stage, the status glossary and the answers to the usual questions.",()=>{setMenu(false);setGuide(true);})}
      </div>
      <div style={{padding:"8px 14px",borderTop:`1px solid ${T.borderLight}`,fontSize:10.5,color:T.textMut}}>Press Esc at any time to leave a tour.</div>
    </div>}
    <button data-tour="help-fab" onClick={()=>setMenu(!menu)} title="Help & tours" style={{position:"fixed",right:18,bottom:18,zIndex:9998,height:44,minWidth:44,padding:menu?"0 16px":0,borderRadius:22,border:`1px solid ${T.border}`,background:"#fff",color:T.primary,boxShadow:"0 6px 20px rgba(15,23,42,0.18)",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:12.5,fontWeight:700,fontFamily:T.font}}>
      {menu?<React.Fragment><Ic n="x" s={14}/>Close</React.Fragment>:<Ic n="zap" s={18}/>}
    </button>
  </React.Fragment>;
}
function UserGuide({onClose,approvalConfig=[]}){
  const ROLES=[["Anyone",null],["Doctor",[1]],["CMO",[2,7,9]],["CMIO",[3]],["Nursing",[4]],["CNO",[5,8]],["Chief Surgeon",[6]],["CFO / Finance",[10,13,15]],["CEO",[11]],["CSCM / Admin",[12,14]]];
  const[role,setRole]=useState("Anyone");const[route,setRoute]=useState("full");const[sel,setSel]=useState(1);
  const short=[{n:1,l:"Doctor Request"},{n:2,l:"CMO Approval"},{n:3,l:"CMIO Validation"},{n:15,l:"CFO Acknowledgement"},{n:2,l:"CMO Acknowledgement"}];
  const list=route==="full"?STAGES.map(s=>({n:s.num,l:s.label})):short;
  const mine=(ROLES.find(r=>r[0]===role)||[])[1];
  const g=STAGE_GUIDE[sel]||{};const sd=STAGES.find(s=>s.num===sel)||{};
  const box={background:"#f8fafc",border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px"};
  const cap={fontSize:9.5,fontWeight:800,letterSpacing:0.6,color:T.textMut,marginBottom:6};
  return <div style={{position:"fixed",inset:0,zIndex:10000,background:"rgba(15,23,42,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:920,maxHeight:"92vh",background:"#fff",borderRadius:12,display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 24px 70px rgba(0,0,0,0.35)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",borderBottom:`1px solid ${T.border}`}}>
        <div><div style={{fontSize:14,fontWeight:700,color:T.text}}>CliniPack User Guide</div><div style={{fontSize:11,color:T.textSec}}>Every screen, every stage, and what each role does</div></div>
        <div style={{display:"flex",gap:8}}><button onClick={()=>window.print()} style={{padding:"7px 14px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}><Ic n="download" s={13}/>Print / Save as PDF</button>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",cursor:"pointer",color:T.textSec}}>✕</button></div>
      </div>
      <div style={{overflow:"auto",padding:18,background:"#f1f5f4"}}>
        <div style={{background:"#fff",borderRadius:12,padding:"20px 22px",border:`1px solid ${T.border}`,marginBottom:14}}>
          <span style={{fontSize:10,fontWeight:700,letterSpacing:1,color:T.primary,border:`1px solid ${T.primary}40`,borderRadius:12,padding:"3px 10px"}}>INTERACTIVE GUIDE</span>
          <div style={{fontSize:26,fontWeight:800,color:T.text,margin:"12px 0 6px",lineHeight:1.15}}>Learn CliniPack one feature at a time.</div>
          <div style={{fontSize:12.5,color:T.textSec}}>Step through the approval chain, then open whichever card you need.</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginTop:14}}><span style={{fontSize:11,color:T.textMut,marginRight:4}}>I am a</span>
            {ROLES.map(([r])=><button key={r} onClick={()=>{setRole(r);const m=(ROLES.find(x=>x[0]===r)||[])[1];if(m)setSel(m[0]);}} style={{padding:"5px 12px",borderRadius:14,border:`1px solid ${role===r?T.primary:T.border}`,background:role===r?T.primary:"#fff",color:role===r?"#fff":T.textSec,fontSize:11.5,fontWeight:600,cursor:"pointer"}}>{r}</button>)}
          </div>
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:"16px 18px",border:`1px solid ${T.border}`,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div><div style={{fontSize:15,fontWeight:700,color:T.text}}>The approval chain</div><div style={{fontSize:11,color:T.textSec}}>Click any stage to see who owns it and what happens there.</div></div>
            <div style={{display:"flex",border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden"}}>{[["full","Full · 15"],["exists","CPT exists · 5"]].map(([k,l])=><button key={k} onClick={()=>{setRoute(k);setSel(1);}} style={{padding:"6px 12px",border:"none",background:route===k?T.primary:"#fff",color:route===k?"#fff":T.textSec,fontSize:11.5,fontWeight:700,cursor:"pointer"}}>{l}</button>)}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(96px,1fr))",gap:6}}>
            {list.map((s,i)=>{const on=sel===s.n&&(route==="full"||i===list.findIndex(x=>x.n===sel));const hi=mine&&mine.includes(s.n);
              return <div key={i} onClick={()=>setSel(s.n)} style={{cursor:"pointer",borderRadius:8,padding:"7px 8px",border:`1.5px solid ${on?T.primary:hi?T.primary+"66":T.border}`,background:on?T.primaryLight:hi?"#f0fdfa":"#f8fafc",opacity:mine&&!hi?0.55:1}}>
                <div style={{fontSize:9,fontWeight:700,color:T.textMut,fontFamily:"monospace"}}>STAGE {i+1}</div><div style={{fontSize:11.5,fontWeight:700,color:T.text,lineHeight:1.25}}>{s.l}</div></div>;})}
          </div>
          <div style={{marginTop:14,borderTop:`1px solid ${T.borderLight}`,paddingTop:12}}>
            <div style={{fontSize:10,fontWeight:800,color:T.primary,letterSpacing:0.6}}>STAGE {sel} OF 15</div>
            <div style={{fontSize:17,fontWeight:700,color:T.text,margin:"2px 0 8px"}}>{sd.label}</div>
            <div style={{display:"flex",gap:6,marginBottom:10}}><span style={{fontSize:10.5,fontWeight:600,padding:"2px 10px",borderRadius:10,background:"#eff6ff",color:T.info}}>{g.who}</span><span style={{fontSize:10.5,fontWeight:600,padding:"2px 10px",borderRadius:10,background:"#f1f5f9",color:T.textSec}}>SLA {sd.sla||"—"}</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr 1fr",gap:10}}>
              <div style={box}><div style={cap}>WHAT HAPPENS</div><div style={{fontSize:12,color:T.text,lineHeight:1.5}}>{g.what}</div></div>
              <div style={box}><div style={cap}>ACTIONS</div><ul style={{margin:0,paddingLeft:16,fontSize:12,color:T.text,lineHeight:1.6}}>{(g.acts||[]).map(a=><li key={a}>{a}</li>)}</ul></div>
              <div style={box}><div style={cap}>WHERE IT GOES</div><div style={{fontSize:12,color:T.text,lineHeight:1.5}}>{g.next}</div></div>
            </div>
          </div>
        </div>
        {GUIDE_TOPICS.map(gr=><div key={gr.g} style={{marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:800,color:T.textSec,letterSpacing:0.5,textTransform:"uppercase",margin:"6px 2px 8px"}}>{gr.g} <span style={{color:T.textMut}}>{gr.items.length}</span></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>{gr.items.map(([t,s])=><div key={t} style={{background:"#fff",border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 14px"}}><div style={{fontSize:13,fontWeight:700,color:T.text}}>{t}</div><div style={{fontSize:11.5,color:T.textSec,marginTop:4,lineHeight:1.5}}>{s}</div></div>)}</div>
        </div>)}
        <div style={{fontSize:10.5,color:T.textMut,textAlign:"center",marginTop:10}}>Stage names, approvers, SLA days and email text are all configuration — if what you see differs, Setup is the source of truth.</div>
      </div>
    </div>
  </div>;
}
