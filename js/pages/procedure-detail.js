// ═══════════════════════════════════════════════════════════════
// PROCEDURE DETAIL — All stages + delegation + CPT Exists path
// ═══════════════════════════════════════════════════════════════
function ProcDetail({proc:p,role,me,onBack,onAction,canAct,nav,categories=MASTER_CATEGORIES,onRaiseDeact=()=>{},onRaiseVl=()=>{},onSubmitVl=()=>{},onSubmitEdit=()=>null,onActVl=()=>{},amendReq=null,onAmendDone=()=>{},autoEdit=null,routeTab=null,onTabChange=()=>{},onAutoEditDone=()=>{},editDesign=EDIT_DESIGN_DEFAULT,approvalConfig=APPROVAL_CONFIG_DEFAULT,opSkills=[],vlReqs=[],onOpenVl=()=>{},tplMasters=[]}){
  const actionTab=(p.currentStage===10||p.currentStage===11)?"financial":((p.currentStage>=12&&p.currentStage<=14)?"system":(p.currentStage===4?"templates":"overview"));
  const[tab,setTab]=useState(()=>routeTab||(canAct(p)?actionTab:"overview"));
  useEffect(()=>{if(routeTab&&routeTab!==tab)setTab(routeTab);},[routeTab]);
  useEffect(()=>{onTabChange(tab);},[tab]);
  
  const[comments,setComments]=useState("");
  const[showDelegateModal,setShowDelegateModal]=useState(false);
  const[showActionsMenu,setShowActionsMenu]=useState(false);
  const[editFlow,setEditFlow]=useState(null);
  const[efVals,setEfVals]=useState({});
  const[efPairs,setEfPairs]=useState([{old:"",new:""}]);
  const[efReason,setEfReason]=useState("");
  const EF_TAB={clinical:"overview",cpt:"overview",pkg:"system",fees:"financial",opcode:"system",obsolete:"templates"};
  const efHide=editFlow&&editFlow.step!=="fields";
  const efTab=editFlow&&editFlow.group?EF_TAB[editFlow.group.id]||"overview":null;
  const tabView=efHide?"__none__":tab;
  // Live parity: Edit Package is ONE inline mode ({all:true}) — every field mapped to an active scenario
  // in Setup → Edit Design is editable where it is shown; the route builds itself from what changed.
  const scenOn=id=>((editDesign.scenarios||[]).find(s=>s.id===id)||{}).active;
  const efFields=editFlow&&editFlow.step==="fields"?(editFlow.all?Object.keys(MFIELDS).filter(k=>scenOn((editDesign.fieldMap||{})[k])):(editFlow.group.fields||[])):[];
  const efChanged=efFields.filter(k=>String(efVals[k]??"")!==String(MFIELDS[k].get(p)??""));
  const efScen=[...new Set(efChanged.map(k=>(editDesign.fieldMap||{})[k]))].sort((a,b)=>((editDesign.scenarios.find(s=>s.id===a)||{}).order||0)-((editDesign.scenarios.find(s=>s.id===b)||{}).order||0));
  const efRoute=efScen.length?buildEditRoute(efScen,p,editDesign,approvalConfig):null;
  const efTabCount=t=>efChanged.filter(k=>(MFIELD_TAB[k]||"overview")===t).length;
  const openReq=vlReqs.find(r=>!r.done);
  const[amending,setAmending]=useState(null);
  const startEdit=(prefill=[])=>{const init={};Object.keys(MFIELDS).forEach(k=>{init[k]=MFIELDS[k].get(p)||"";});prefill.forEach(c=>{if(c.k&&MFIELDS[c.k])init[c.k]=c.to;});setEfVals(init);setEfReason("");setEditFlow({step:"fields",all:true});setTab("overview");};
  useEffect(()=>{if(amendReq&&amendReq.baseId===p.id){startEdit(amendReq.changes||[]);setEfReason(amendReq.reason||"");setAmending(amendReq);onAmendDone();}},[amendReq&&amendReq.id]);
  useEffect(()=>{if(autoEdit===p.id){if(!openReq&&p.status==="approved")startEdit();onAutoEditDone();}},[autoEdit,p.id]);
  const efEdit=k=>{
    if(!efFields.includes(k))return null;
    const f=MFIELDS[k];const cur=f.get(p)||"";const chg=String(efVals[k]||"")!==String(cur);
    const st={...inp,margin:0,padding:"6px 10px",fontSize:12,width:210,borderColor:chg?T.warn:`${T.primary}66`,background:chg?"#fffbeb":"#fff"};
    return <span style={{display:"inline-flex",flexDirection:"column",alignItems:"flex-end",gap:2}}>
      {f.text||f.num
        ?<input type={f.num?"number":"text"} style={st} value={efVals[k]||""} onChange={e=>setEfVals({...efVals,[k]:e.target.value})}/>
        :<Select style={st} value={efVals[k]||""} onChange={e=>setEfVals({...efVals,[k]:e.target.value})}>
          <option value="">— not set —</option>
          {(f.opts||(f.skill?(opSkills||[]).filter(o=>o.isActive!==false).map(o=>o.title):[])).map(o=><option key={o} value={o}>{o}</option>)}
        </Select>}
      <span style={{fontSize:9,color:chg?T.warn:T.textMut,fontWeight:chg?700:500}}>{chg?("was: "+(cur||"—")):"editing — unchanged"}</span>
    </span>;
  };
  const EFK_INFO={"Specialty":"specialty","CPT Code":"cptCode","CPT Name":"cptName","Patient Type":"patientType","Anesthesia Requirement":"anesthesia","Gender":"gender","Operation Skill":"opSkill","Suggested Price":"suggestedPrice"};
  const EFK_SYS={"Operation Code":"opCode","Operation Name":"opName","PKGID":"pkgId"};
  // CMIO
  const[cmioStatus,setCmioStatus]=useState(p.cptStatus||"");
  const[cmioCode,setCmioCode]=useState(p.accurateCptCode||p.proposedCptCode||"");
  const[cmioName,setCmioName]=useState(p.accurateCptName||p.proposedCptName||"");
  // Nursing — arrays for ListCard UI (synced with requestor values)
  const toArr=v=>v?(typeof v==="string"?v.split(";").map(s=>s.trim()).filter(Boolean):(Array.isArray(v)?v:[""])):[""];
  const[nurManpower,setNurManpower]=useState(toArr(p.manpower));
  const[nurDuration,setNurDuration]=useState(p.procedureDuration||"0:00");
  const[nurAccomm,setNurAccomm]=useState(String(p.accommodationDays||""));
  const[nurMachines,setNurMachines]=useState(toArr(p.machinesDevices));
  const[nurMachinesCost,setNurMachinesCost]=useState(String(p.machinesDevicesCost||""));
  const[nurConsDrugs,setNurConsDrugs]=useState(toArr(p.consumablesDrugs));
  const[nurConsDrugsCost,setNurConsDrugsCost]=useState(String(p.consumablesDrugsCost||""));
  const[nurLabRad,setNurLabRad]=useState(toArr(p.labRadiology));
  const[nurActiveTemplate,setNurActiveTemplate]=useState("procCons");
  const[procCons,setProcCons]=useState(p.templates?.procCons||[]);
  const[wardsCons,setWardsCons]=useState(p.templates?.wardsCons||[]);
  const[procDrugs,setProcDrugs]=useState(p.templates?.procDrugs||[]);
  const[wardsDrugs,setWardsDrugs]=useState(p.templates?.wardsDrugs||[]);
  // FCD
  const[fcd,setFcd]=useState(p.financial||{manpowerCosts:[],surgeryDurationCost:"",accommodationCost:"",machinesDevicesCosts:[],totalServicesCost:"",finalPatientPrice:"",acceptDoctorFees:"",advancePayment:"",serviceRevenueDoctors:""});
  const updFcd=(k,v)=>setFcd(pr=>({...pr,[k]:v}));
  const[ceoPrice,setCeoPrice]=useState(String(p.financial?.finalPatientPrice||""));
  // CSCM
  const isEditVer=p.version>1; const ss=p.systemSetup||{};
  const[cscmOpCode,setCscmOpCode]=useState(isEditVer?(ss.opCode||""):"");const[cscmOpName,setCscmOpName]=useState(isEditVer?(ss.opName||""):"");const[cscmLinked,setCscmLinked]=useState(isEditVer?(ss.linkedToCpt||"Yes"):"Yes");
  const[pkgId,setPkgId]=useState(isEditVer?(ss.pkgId||""):"");const[pkgLinked,setPkgLinked]=useState(isEditVer?(ss.linkedToPkg||"Yes"):"Yes");const[pkgAdded,setPkgAdded]=useState(isEditVer?(ss.addedOnSystem||"Yes"):"Yes");const[pkgCapBoth,setPkgCapBoth]=useState(isEditVer?(ss.capBothBranches||""):"");
  const[tlPC,setTlPC]=useState(isEditVer?(ss.procConsTemplate||""):"");const[tlWC,setTlWC]=useState(isEditVer?(ss.wardsConsTemplate||""):"");const[tlPD,setTlPD]=useState(isEditVer?(ss.procDrugsTemplate||""):"");const[tlWD,setTlWD]=useState(isEditVer?(ss.wardsDrugsTemplate||""):"");const[tlDone,setTlDone]=useState("Yes");

  const[cbox,setCbox]=useState(null);
  const[pkgName,setPkgName]=useState(isEditVer?(ss.pkgName||""):"");
  const[nurSuggest,setNurSuggest]=useState(p.nursingSuggested||{});
  // FCD — every LOS list is costed per line (live)
  const fcdPayload=()=>{const L=FCD_LINES(p);const sums={};L.forEach(l=>{sums[l.sum]=(fcd[l.k]||[]).slice(0,Math.max(1,l.items.length)).reduce((x,v)=>x+(Number(v)||0),0);});
    const svc=Object.values(sums).reduce((x,v)=>x+v,0)+(Number(fcd.surgeryDurationCost)||0)+(Number(fcd.accommodationCost)||0);
    const _tpl=[...(p.templates?.procCons||[]),...(p.templates?.wardsCons||[]),...(p.templates?.procDrugs||[]),...(p.templates?.wardsDrugs||[])].reduce((x,i)=>x+(i.totalCost||0),0);
    return {...fcd,...sums,totalServicesCost:svc,_tpl};};
  const doStage12=()=>{onAction(p,"approve",{actionLabel:isEditVer?"CSCM confirmed the PrimeCare operation":`CSCM linked & locked operation code ${cscmOpCode}`,comment:comments,cscmData:{opCode:cscmOpCode,opName:cscmOpName,linkedToCpt:cscmLinked,opLocked:true},attachments:[...(p.attachments||[]),...proof.map(f=>({...(typeof f==="string"?{name:f}:f),kind:"PrimeCare proof",step:"CSCM System Setup"}))]});setComments("");};
  const doStage13=()=>{onAction(p,"approve",{actionLabel:isEditVer?"CFO confirmed the PrimeCare package":`CFO linked & locked PKGID ${pkgId}`,comment:comments,pkgData:{pkgId,pkgName,linkedToPkg:pkgLinked,addedOnSystem:pkgAdded,capBothBranches:pkgCapBoth,pkgLocked:true},attachments:[...(p.attachments||[]),...proof.map(f=>({...(typeof f==="string"?{name:f}:f),kind:"PrimeCare proof",step:"CFO Package Setup"}))]});setComments("");};
  const isMy=canAct(p);
  const stageDef=STAGES.find(s=>s.num===p.currentStage);
  // Live: a request sent back to the requesting doctor — amend in place and resubmit to the step that asked.
  const AMD_F=["specialty","proposedCptCode","proposedCptName","patientType","anesthesia","gender","opSkill","suggestedPrice","accommodationDays","procedureDuration"];
  const amdInit=()=>{const o={};AMD_F.forEach(k=>{o[k]=p[k]==null?"":String(p[k]);});LOS_LISTS.forEach(x=>{o[x.k]=losArr(p[x.k]);});return o;};
  const isAmend=isMy&&p.currentStage===1&&p.status==="modification";
  const[amd,setAmd]=useState(amdInit);
  useEffect(()=>{setAmd(amdInit());},[p.id,p.status]);
  const amdUpd=(k,v)=>setAmd(a=>({...a,[k]:v}));
  const amdOk=amd.specialty&&amd.proposedCptName&&amd.patientType&&amd.anesthesia&&amd.gender&&amd.opSkill&&amd.accommodationDays!==""&&amd.procedureDuration&&amd.procedureDuration!=="0:00";
  const amdSubmit=()=>{if(!amdOk){alert("Fill every required field before resubmitting");return;}
    const fields={};AMD_F.forEach(k=>{fields[k]=amd[k];});LOS_LISTS.forEach(x=>{fields[x.k]=(amd[x.k]||[]).filter(Boolean).join("; ");});
    const before={};[...AMD_F,...LOS_LISTS.map(x=>x.k)].forEach(k=>{if(String(p[k]??"")!==String(fields[k]??""))before[k]=p[k];});
    const n=Object.keys(before).length;
    onAction(p,"resubmit",{fields,before,actionLabel:`Amended and resubmitted (${n} field${n===1?"":"s"} changed)${comments?": "+comments:""}`});setComments("");};
  const stCur=p.currentStage>15?15:(p.currentStage-1);

  // #10 — declared before `tabs` because the tab strip consumes them
  const reqDocs=p.reqDocs||[];
  const docsPending=reqDocs.filter(d=>d.status==="pending").length;
  const canActNow=isMy||(p.status==="cpt_exists_cfo_ack"&&role==="cfo")||(p.status==="cpt_exists_cmo_ack"&&role==="cmo");
  const tabs=[{k:"overview",l:"Overview"},{k:"templates",l:"OT Templates"},{k:"financial",l:"Financials"},{k:"system",l:"System Setup"},{k:"attachments",l:"Attachments"},...(reqDocs.length>0?[{k:"reqdocs",l:`Requested (${docsPending})`}]:[]),...(p.status==="approved"?[{k:"cert",l:"Certificate"}]:[]),...(vlReqs.length>0?[{k:"changes",l:`Changes (${vlReqs.length})`}]:[]),{k:"routing",l:"Routing Chain"},{k:"timeline",l:"Timeline"},{k:"versions",l:"Versions"}];
  const wheelAcc=useRef(0);
  const tabsRef=useRef(null);
  const[pinTabs,setPinTabs]=useState(false);
  const[pinTop,setPinTop]=useState(52);
  useEffect(()=>{
    const el=document.querySelector('[data-scroll-main="1"]'); if(!el)return;
    const onScroll=()=>{const hdr=document.querySelector('[data-app-header="1"]');const hb=hdr?hdr.getBoundingClientRect().bottom:52;setPinTop(hb);const r=tabsRef.current&&tabsRef.current.getBoundingClientRect();setPinTabs(!!r&&r.top<=hb);};
    el.addEventListener("scroll",onScroll,{passive:true});
    const advance=dir=>setTab(t=>{const ix=tabs.findIndex(x=>x.k===t);const nx=tabs[ix+dir];if(nx){setTimeout(()=>{const sb=el.style.scrollBehavior;el.style.scrollBehavior="auto";el.scrollTop=dir>0?0:el.scrollHeight;el.style.scrollBehavior=sb;},60);return nx.k;}return t;});
    const onWheel=e=>{
      const atTop=el.scrollTop<=2;
      const atBottom=el.scrollTop+el.clientHeight>=el.scrollHeight-6;
      if(e.deltaY>0&&atBottom){wheelAcc.current=Math.max(0,wheelAcc.current)+e.deltaY;if(wheelAcc.current>280){wheelAcc.current=0;advance(1);}}
      else if(e.deltaY<0&&atTop){wheelAcc.current=Math.min(0,wheelAcc.current)+e.deltaY;if(wheelAcc.current<-280){wheelAcc.current=0;advance(-1);}}
      else wheelAcc.current=0;
    };
    return()=>{el.removeEventListener("scroll",onScroll);};
  },[tabs.map(t2=>t2.k).join("|")]);
  const[mpPeople,setMpPeople]=useState([]);const[mpDocs,setMpDocs]=useState([]);const[mpFree,setMpFree]=useState("");
  useEffect(()=>{setMpPeople(((p.migrationMeta||{}).relatedPeople)||[]);setMpDocs([]);setMpFree("");},[p.id]);
  const tabBtns=tabs.map(t2=><button key={t2.k} onClick={()=>setTab(t2.k)} style={{padding:"10px 18px",border:"none",background:"none",fontSize:13,fontWeight:tab===t2.k?600:400,color:tab===t2.k?T.primary:T.textSec,borderBottom:tab===t2.k?`3px solid ${T.primary}`:"3px solid transparent",cursor:"pointer",marginBottom:-2,fontFamily:T.font,letterSpacing:0.1}}>{t2.l}{editFlow&&editFlow.all&&efTabCount(t2.k)>0&&<span style={{marginLeft:6,fontSize:10,fontWeight:800,padding:"1px 7px",borderRadius:9,background:T.warn,color:"#fff"}}>{efTabCount(t2.k)}</span>}</button>);

  // Comment-required action helper
  const doReject=()=>{if(!comments.trim()){alert("Comments required for rejection");return;}onAction(p,"reject",{actionLabel:"Rejected: "+comments});};
  const doModify=()=>{if(!comments.trim()){alert("Comments required for modification request");return;}onAction(p,"modify",{actionLabel:"Modification requested: "+comments,comment:comments});};

  // Scroll to action panel
  const actionRef=useRef(null);
  const scrollToAction=()=>{setTab(actionTab);if(actionRef.current)actionRef.current.scrollIntoView({behavior:"smooth",block:"start"});};

  const[showActionModal,setShowActionModal]=useState(null); // null | "approve" | "reject" | "modify" | "acknowledge"
  // On-leave cover (Option A) — request-wise reassignment
  // #6 — real attachment proof at the CSCM/CFO PrimeCare stages (was a decorative div)
  const[proof,setProof]=useState([]);
  // #21 — Admin Override via a styled modal (was window.prompt)
  const[showOverride,setShowOverride]=useState(false);
  const[ovReason,setOvReason]=useState("");
  const[certVer,setCertVer]=useState(p.version);
  // #10 — document requests
  const[showDocReq,setShowDocReq]=useState(false);
  const[drType,setDrType]=useState(DOC_TYPES[0]);
  const[drOther,setDrOther]=useState("");
  const[drNote,setDrNote]=useState("");
  const[drNotify,setDrNotify]=useState(null);
  const[drFiles,setDrFiles]=useState({});
  const[drNa,setDrNa]=useState(null);
  const[drNaReason,setDrNaReason]=useState("");
  const submitDocReq=()=>{
    const t=(drType||"").trim();
    if(!t){alert("Describe the document you need");return;}
    const id="DOC-"+String(reqDocs.length+1).padStart(3,"0");
    onAction(p,"doc_request",{actionLabel:`Document requested — ${t}${drNote?": "+drNote:""}${drNotify?" — notify "+drNotify.name:""}`,
      doc:{id,type:t,note:drNote,notify:drNotify?{name:drNotify.name,email:drNotify.email}:null,by:me.name,role:me.title,date:new Date().toISOString().slice(0,10),status:"pending"}});
    setShowDocReq(false);setDrType("");setDrOther("");setDrNote("");setDrNotify(null);
  };
  const[showReassign,setShowReassign]=useState(false);
  const[raUser,setRaUser]=useState(null);
  const[raReason,setRaReason]=useState("");
  const doReassign=()=>{
    if(!raUser){alert("Choose the person who will cover this step.");return;}
    if(!raReason.trim()){alert("A reason is required — it is what explains, later, why somebody else acted here.");return;}
    const forName=((APPROVAL_CONFIG_DEFAULT.find(c=>c.num===p.currentStage)||{}).approvers||{})[p.branch]||"the approver";
    if(raUser.name===forName){alert("That is the person who already holds this step, so there is nothing to cover.");return;}
    onAction(p,"reassign",{actionLabel:`${stageDef?.label||""} — reassigned to ${raUser.name} while ${forName} is away`,comment:raReason,reassignedTo:{stage:p.currentStage,email:raUser.email,name:raUser.name,title:raUser.title,forName,reason:raReason,by:me.name,date:new Date().toISOString().slice(0,10)}});
    setShowReassign(false);setRaUser(null);setRaReason("");
  };

  return<div style={{maxWidth:1600}}>
    {/* MARK-UNAVAILABLE MODAL (#10/#21 — styled, replaces window.prompt) */}
    {drNa&&<div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.45)",zIndex:9996,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setDrNa(null)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:10,width:"100%",maxWidth:480,padding:24,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <ST style={{fontSize:15,marginBottom:4}}>Mark document unavailable</ST>
        <p style={{fontSize:11,color:T.textSec,margin:"0 0 12px"}}>{(reqDocs.find(x=>x.id===drNa)||{}).type} · requested by {(reqDocs.find(x=>x.id===drNa)||{}).by}</p>
        <label style={lbl}>Reason <span style={{color:T.err}}>*</span></label>
        <textarea style={{...inp,height:64,resize:"vertical",fontFamily:T.font,marginBottom:16}} value={drNaReason} onChange={e=>setDrNaReason(e.target.value)} placeholder="e.g. Society has not published a protocol for this procedure" autoFocus/>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={()=>{setDrNa(null);setDrNaReason("");}} style={{padding:"8px 18px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",color:T.textSec}}>Cancel</button>
          <button onClick={()=>{if(!drNaReason.trim()){alert("Reason is required");return;}const d=reqDocs.find(x=>x.id===drNa);onAction(p,"doc_na",{actionLabel:`${d.type} marked unavailable: ${drNaReason}`,docId:drNa,reason:drNaReason,by:me.name,date:new Date().toISOString().slice(0,10)});setDrNa(null);setDrNaReason("");}} style={{padding:"8px 18px",borderRadius:6,border:"none",background:T.textSec,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>Mark unavailable</button>
        </div>
      </div>
    </div>}

    {/* DOCUMENT REQUEST MODAL (#10) */}
    {showDocReq&&<div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.45)",zIndex:9996,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowDocReq(false)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:10,width:"100%",maxWidth:520,padding:24,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <ST style={{fontSize:16,marginBottom:4,color:T.info}}>Request a Document</ST>
        <p style={{fontSize:11,color:T.textSec,margin:"0 0 12px"}}>#{p.id} · {p.accurateCptName||p.proposedCptName}</p>
        <div style={{marginBottom:12}}><label style={lbl}>Document type <span style={{color:T.err}}>*</span></label>
          <input list="ash-doctypes" style={inp} value={drType} onChange={e=>setDrType(e.target.value)} placeholder="Type or pick a document type..." autoFocus/>
          <datalist id="ash-doctypes">{DOC_TYPES.filter(t=>t!=="Other").map(t=><option key={t} value={t}/>)}</datalist>
        </div>
        <div style={{marginBottom:12}}><PeoplePicker label="Notify (from Active Directory)" value={drNotify} onChange={setDrNotify} placeholder="Search AD — who should be asked for this?"/></div>
        <div style={{marginBottom:16}}><label style={lbl}>Note to the provider (optional)</label>
          <textarea style={{...inp,height:60,resize:"vertical",fontFamily:T.font}} value={drNote} onChange={e=>setDrNote(e.target.value)} placeholder="e.g. Needed before CMO can validate the CPT mapping"/></div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={()=>setShowDocReq(false)} style={{padding:"8px 18px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",color:T.textSec}}>Cancel</button>
          <button onClick={submitDocReq} style={{padding:"8px 18px",borderRadius:6,border:"none",background:T.info,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>Request & Notify</button>
        </div>
      </div>
    </div>}

    {/* ADMIN OVERRIDE MODAL (#21) — styled, consistent with every other action in the app */}
    {showOverride&&(()=>{const next=p.lifecycle==="Deactivated"?"Active":"Deactivated";const isDeact=next==="Deactivated";
      return <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.45)",zIndex:9996,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowOverride(false)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:10,width:"100%",maxWidth:520,padding:24,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <ST style={{fontSize:16,marginBottom:4,color:T.purple}}>Admin Override — mark {next}</ST>
        <p style={{fontSize:11,color:T.textSec,margin:"0 0 12px"}}>#{p.id} · {p.accurateCptName||p.proposedCptName} · PKGID {p.systemSetup?.pkgId||"—"}</p>
        <div style={{padding:9,marginBottom:14,borderRadius:6,background:"#faf5ff",border:`1px solid ${T.purple}30`,fontSize:11,color:T.purple}}>Bypasses the approval chain. Logged against your name.</div>
        <div style={{marginBottom:16}}><label style={lbl}>Reason <span style={{color:T.err}}>*</span></label>
          <textarea style={{...inp,height:70,resize:"vertical",fontFamily:T.font}} value={ovReason} onChange={e=>setOvReason(e.target.value)} placeholder={isDeact?"e.g. Procedure withdrawn by clinical committee — effective immediately":"e.g. Reinstated after protocol review"} autoFocus/>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={()=>setShowOverride(false)} style={{padding:"8px 18px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",color:T.textSec}}>Cancel</button>
          <button onClick={()=>{if(!ovReason.trim()){alert("Reason is required for an admin override");return;}onAction(p,"admin_override",{actionLabel:`Admin override — marked ${next}: ${ovReason}`,lifecycle:next});setShowOverride(false);setOvReason("");}} style={{padding:"8px 18px",borderRadius:6,border:"none",background:isDeact?T.err:T.ok,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>Confirm — mark {next}</button>
        </div>
      </div>
    </div>;})()}

    {/* REASSIGN MODAL — on-leave cover for a single request (#20 Option A) */}
    {showReassign&&<div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.45)",zIndex:9995,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowReassign(false)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:10,width:"100%",maxWidth:520,padding:24,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        {(()=>{const std=(APPROVAL_CONFIG_DEFAULT.find(c=>c.num===p.currentStage)||{}).approvers?.[p.branch]||"—";return <>
        <ST style={{fontSize:16,marginBottom:2}}>Reassign This Step</ST>
        <p style={{fontSize:11,color:T.textSec,margin:"0 0 10px"}}>{p.id} · {stageDef?.label||"—"}</p>
        <p style={{fontSize:11,color:T.textSec,margin:"0 0 12px"}}>Standard approver: <strong>{std}</strong>. Cover is temporary — it applies to this request only, and clearing it hands the step straight back.</p>
        <div style={{marginBottom:12}}><PeoplePicker label="Cover approver (from Active Directory)" value={raUser} onChange={setRaUser} placeholder="Search for the person covering…"/></div>
        <div style={{marginBottom:12}}><label style={lbl}>Reason *</label>
          <textarea style={{...inp,height:60,resize:"vertical",fontFamily:T.font}} value={raReason} onChange={e=>setRaReason(e.target.value)} placeholder="e.g. Dr. Fatima on annual leave 12–20 Aug — Dr. Nasser covering"/>
        </div>
        <div style={{padding:"10px 12px",borderRadius:8,background:"#fffbeb",border:"1px solid #fde68a",fontSize:11.5,color:"#92400e",marginBottom:14}}><strong>What this does:</strong> the covering person can act on <strong>{stageDef?.label}</strong> for this request only, keeping its original due date. Nothing in Setup changes, and no other request is affected. The step returns to {std} the moment the cover is cleared.</div>
        </>;})()}
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",alignItems:"center"}}>
          <span style={{marginRight:"auto",fontSize:10.5,color:T.textMut,maxWidth:180}}>{!raUser?"Choose the person who will cover this step.":!raReason.trim()?"A reason is required — it is what explains, later, why somebody else acted here.":""}</span>
          <button onClick={()=>setShowReassign(false)} style={{padding:"8px 18px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",color:T.textSec}}>Cancel</button>
          <button onClick={doReassign} style={{padding:"8px 18px",borderRadius:6,border:"none",background:T.teal||"#0d9488",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>⇄ Reassign &amp; Notify</button>
        </div>
      </div>
    </div>}
    <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:8}}>← Back</button>
    {/* HEADER */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <h2 style={{fontSize:22,fontWeight:700,color:T.primary,margin:0}}>Procedure Detail</h2>
          <span data-tour="status">{openReq&&openReq.kind==="fin"&&!openReq.done&&openReq.status!=="returned"?<Badge color={T.warn} bg="#fffbeb">Pending {(openReq.stages[openReq.stage]||{}).label}</Badge>:<SBadge status={p.status}/>}</span>
        </div>
        <p style={{fontSize:13,color:T.textSec,margin:"4px 0 0"}}>{p.id} · {BRANCHES.find(b=>b.code===p.branch)?.name||p.branch} · {p.specialty||"—"} · {fmtDateTime(p.requestDate)}{p.migrated&&<span style={{marginLeft:8,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10,background:"#eef2ff",color:"#4338ca",border:"1px solid #c7d2fe"}}>Migrated</span>}</p>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        {p.lifecycle==="Deactivated"&&<span style={{padding:"6px 12px",borderRadius:20,background:"#fef2f2",color:T.err,fontSize:11,fontWeight:700,border:"1px solid #fecaca",display:"inline-flex",alignItems:"center",gap:6}}><Ic n="ban" s={12}/>Deactivated</span>}
        {p.reassignedTo&&p.reassignedTo.stage===p.currentStage&&<span style={{padding:"6px 12px",borderRadius:20,background:"#f0fdfa",color:T.teal||"#0d9488",fontSize:11,fontWeight:700,border:`1px solid ${(T.teal||"#0d9488")}40`,display:"inline-flex",alignItems:"center",gap:8}}>
          <Ic n="swap" s={12}/>Covered by {p.reassignedTo.name}{p.reassignedTo.forName?" for "+p.reassignedTo.forName:""}
          {(me.isSiteAdmin||role==="cscm")&&<span onClick={()=>onAction(p,"reassign_clear",{actionLabel:"Reassignment cleared — step returned to the standard approver"})} style={{cursor:"pointer",fontWeight:700,color:T.textMut,display:"inline-flex"}} title="Return this step to the standard approver"><Ic n="x" s={11}/></span>}
        </span>}
        {!isMy&&!["approved","rejected","cpt_exists"].includes(p.status)&&<span style={{padding:"7px 14px",borderRadius:20,background:"#f1f5f9",color:T.textSec,fontSize:11.5,fontWeight:600,display:"inline-flex",alignItems:"center",gap:6}}><Ic n="clock" s={12}/>Waiting: {stageDef?.label||p.status}</span>}
        {openReq&&!editFlow&&<span onClick={()=>onOpenVl(openReq.id)} style={{padding:"6px 14px",borderRadius:20,background:"#eff6ff",color:T.info,fontSize:11.5,fontWeight:700,border:`1px solid ${T.info}40`,display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer"}}><Ic n="pencil" s={12}/>Change in approval</span>}

      </div>
    </div>
    {efHide&&<Card style={{marginBottom:16,padding:22}}>
      {editFlow.step==="type"&&<React.Fragment>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <ST style={{fontSize:16,margin:0}}>Edit Package #{p.id} — choose the type of change</ST>
          <button onClick={()=>setEditFlow(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textMut,fontFamily:T.font}}>✕ Cancel</button>
        </div>
        <p style={{fontSize:11.5,color:T.textSec,margin:"0 0 14px"}}>{p.accurateCptName||p.proposedCptName} · PKGID {p.systemSetup?.pkgId||"—"} · Version {p.version}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div onClick={()=>setEditFlow({step:"group"})} style={{cursor:"pointer",border:`2px solid ${T.info}`,borderRadius:12,padding:18,background:"#eff6ff"}}>
            <div style={{fontSize:14.5,fontWeight:800,color:T.info,marginBottom:4}}>Non-Financial</div>
            <div style={{fontSize:11.5,color:T.textSec,lineHeight:1.5}}>Patient type, anesthesia, gender, operation skill, CPT, PKGID, fees, operation code, obsolete items — routed via the approval matrix. No cost or template impact.</div>
          </div>
          <div onClick={()=>nav("edit",p)} style={{cursor:"pointer",border:`2px solid ${T.warn}`,borderRadius:12,padding:18,background:"#fffbeb"}}>
            <div style={{fontSize:14.5,fontWeight:800,color:"#92400e",marginBottom:4}}>Financial</div>
            <div style={{fontSize:11.5,color:T.textSec,lineHeight:1.5}}>Templates, costs, price, package setup — creates a new version and re-enters the full approval workflow.</div>
          </div>
        </div>
      </React.Fragment>}
      {editFlow.step==="group"&&<React.Fragment>
        <button onClick={()=>setEditFlow({step:"type"})} style={{background:"none",border:"none",cursor:"pointer",fontSize:11.5,color:T.textSec,marginBottom:8,fontFamily:T.font,padding:0}}>← Change type</button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <ST style={{fontSize:15,margin:0}}>What are you changing?</ST>
          <button onClick={()=>setEditFlow(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textMut,fontFamily:T.font}}>✕ Cancel</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {EDIT_MATRIX.map(g=><div key={g.id} onClick={()=>{const init={};(g.fields||[]).forEach(k=>{init[k]=MFIELDS[k].get(p)||"";});setEfVals(init);setEfPairs([{old:"",new:""}]);setEfReason("");setEditFlow({step:"fields",group:g});setTab(EF_TAB[g.id]||"overview");}} style={{cursor:"pointer",border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 16px",background:"#fff"}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.primary} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text,lineHeight:1.35}}>{g.name}</div>
              <span style={{flexShrink:0,fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:T.primaryLight,color:T.primary}}>by {g.raise}</span>
            </div>
          </div>)}
        </div>
      </React.Fragment>}
    </Card>}
    {!efHide&&<div data-tour="tracker">{openReq&&openReq.kind==="fin"&&openReq.status!=="returned"
      ?<WfTracker stages={openReq.stages.map((s,i)=>({num:i+1,label:s.label,sla:s.sla}))} cur={openReq.stage}/>
      :<WfTracker stages={(p.cptStatus==="Exists"?EXIST_STAGES:STAGES).map(s=>s.num===6?{...s,label:"Chief Surgeon — "+(p.specialty||"Specialty")}:s)} cur={p.cptStatus==="Exists"?3:stCur}/>}</div>}
    {/* LIVE PARITY — editing header: change summary + the route it will take */}
    {editFlow&&editFlow.all&&<div style={{margin:"12px 0 14px",border:`1px solid ${T.primary}55`,borderRadius:10,overflow:"hidden",background:"#fff"}}>
      <div style={{background:T.primary,color:"#fff",padding:"10px 16px",display:"flex",alignItems:"center",gap:12}}>
        <Ic n="pencil" s={15}/>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{amending?`Amending ${amending.id} · `:"Editing "}{p.id} · V{p.version||1} → V{(p.version||1)+1}</div><div style={{fontSize:11,opacity:0.9}}>Change any field where you see it — every tab is editable. The approval route builds itself from what you change.</div></div>
        <button onClick={()=>{setEditFlow(null);setAmending(null);}} style={{padding:"6px 14px",borderRadius:6,border:"1px solid rgba(255,255,255,0.6)",background:"transparent",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Cancel edit</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
        <div style={{padding:"10px 16px",borderRight:`1px solid ${T.borderLight}`}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:0.5,color:T.textSec,marginBottom:6}}>CHANGE SUMMARY ({efChanged.length})</div>
          {efChanged.length===0&&<div style={{fontSize:11.5,color:T.textMut}}>No changes yet — edit any field on any tab.</div>}
          {["overview","financial","system"].filter(t=>efTabCount(t)>0).map(t=><div key={t} style={{marginBottom:6}}>
            <div style={{fontSize:10,fontWeight:800,color:T.primary,letterSpacing:0.4,marginBottom:3}}>{TAB_LBL[t].toUpperCase()} <span style={{background:T.primaryLight,borderRadius:8,padding:"0 6px"}}>{efTabCount(t)}</span></div>
            {efChanged.filter(k=>(MFIELD_TAB[k]||"overview")===t).map(k=><div key={k} style={{fontSize:11.5,padding:"2px 0",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><strong>{MFIELDS[k].l}</strong><span style={{fontSize:9,fontWeight:700,padding:"0 6px",borderRadius:6,background:"#ecfdf5",color:T.primary}}>{SCEN_SHORT[(editDesign.fieldMap||{})[k]]}</span><span style={{color:T.textMut,textDecoration:"line-through"}}>{MFIELDS[k].get(p)||"—"}</span>→<span style={{color:T.ok,fontWeight:700}}>{efVals[k]||"—"}</span></div>)}
          </div>)}
        </div>
        <div style={{padding:"10px 16px"}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:0.5,color:T.textSec,marginBottom:6,display:"flex",alignItems:"center",gap:8}}>APPROVAL ROUTE {efRoute&&<span style={{fontSize:10,fontWeight:700,padding:"1px 8px",borderRadius:10,background:efRoute.finance?"#fffbeb":"#ecfdf5",color:efRoute.finance?"#b45309":T.primary,letterSpacing:0}}>{efRoute.finance?`Finance re-run · ${efRoute.total} stages as V${(p.version||1)+1}`:`${efRoute.total} steps · then PrimeCare confirm (${efRoute.confirm})`}</span>}</div>
          {!efRoute&&<div style={{fontSize:11.5,color:T.textMut}}>The route appears as soon as a field is changed.</div>}
          {efRoute&&!efRoute.finance&&<div style={{display:"flex",flexWrap:"wrap",gap:4,alignItems:"center"}}>{efRoute.steps.map((s,i)=><React.Fragment key={i}><span style={{fontSize:11,padding:"2px 8px",borderRadius:10,border:`1px solid ${T.border}`}}><strong>{i+1}</strong> {s.short}</span><span style={{color:T.textMut}}>→</span></React.Fragment>)}<span style={{fontSize:11,padding:"2px 8px",borderRadius:10,border:`1px solid ${T.info}50`,color:T.info,background:"#eff6ff"}}>PrimeCare confirm ({efRoute.confirm})</span></div>}
          {efRoute&&efRoute.finance&&<div style={{fontSize:11.5,color:T.textSec,lineHeight:1.5}}>All 15 stages re-run{efRoute.extras.length?<span> + <strong>{efRoute.extras.join(", ")}</strong> as numbered stages</span>:""}. V{p.version||1} stays approved and in force until V{(p.version||1)+1} completes; non-finance changes in the same edit ride along.</div>}
        </div>
      </div>
    </div>}
    {/* LIVE PARITY — an open amendment on this package */}
    {!editFlow&&openReq&&(()=>{const r=openReq;const fin=r.kind==="fin";const {stages:st2,cur:c2}=editTrackerOf(r);const s=editStatusOf(r);
      if(fin&&r.status!=="returned")return <div style={{margin:"12px 0 14px",padding:"14px 18px",borderRadius:10,background:"#fffbeb",border:"1px solid #fde68a",display:"flex",gap:14,alignItems:"flex-start"}}>
        <Ic n="pencil" s={16} style={{color:"#b45309",marginTop:2}}/>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:"#92400e"}}>Amendment V{r.toVer} in approval <span style={{fontSize:11,fontWeight:600,color:T.textSec}}>· {r.id} · {editStepLabel(r)}</span></div>
          <div style={{fontSize:11.5,color:T.textSec,margin:"2px 0 8px"}}>V{r.fromVer} stays approved and in force until this amendment completes. If it is rejected or withdrawn, the package returns to V{r.fromVer}.</div>
          <div style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:3}}>What this amendment changes</div>
          {r.changes.map((c,i)=><div key={i} style={{fontSize:11.5}}><strong>{c.l}</strong> <span style={{color:T.textMut,textDecoration:"line-through"}}>{c.from}</span> → <span style={{color:T.ok,fontWeight:700}}>{c.to}</span></div>)}</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}><button onClick={()=>onOpenVl(r.id)} style={{padding:"6px 12px",borderRadius:6,border:`1px solid ${T.primary}55`,background:"#fff",color:T.primary,fontSize:11.5,fontWeight:700,cursor:"pointer"}}>Open request →</button>
          {r.raisedBy===me.name&&<button onClick={()=>{if(window.confirm(`Withdraw ${r.id}? The package returns to V${r.fromVer}.`))onActVl(r,"withdraw");}} style={{padding:"6px 12px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",color:T.textSec,fontSize:11.5,fontWeight:600,cursor:"pointer"}}>Withdraw amendment</button>}</div>
      </div>;
      return <div style={{margin:"12px 0 14px",padding:"14px 18px",borderRadius:10,background:"#f5f9ff",border:`1px solid ${T.info}40`,borderLeft:`3px solid ${T.info}`}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"flex-start"}}>
          <div><div style={{fontSize:13.5,fontWeight:700,color:T.info}}><Ic n="pencil" s={13}/> {r.id} · {editReqLabel(r)} <span style={{fontSize:11.5,fontWeight:600,color:T.textSec}}>{r.status==="returned"?<span>Returned for changes — with <strong>{r.raisedBy}</strong></span>:editStepLabel(r)}</span></div>
            <div style={{fontSize:11.5,color:T.textSec,marginTop:3}}>{r.changes.map(c=>`${c.l}: ${c.from||"—"} → ${c.to||"—"}`).join(" · ")}</div></div>
          <div style={{display:"flex",gap:6,flexShrink:0}}><button onClick={()=>onOpenVl(r.id)} style={{padding:"6px 12px",borderRadius:6,border:`1px solid ${T.info}55`,background:"#fff",color:T.info,fontSize:11.5,fontWeight:700,cursor:"pointer"}}>Open request →</button>
            {r.status==="returned"&&r.raisedBy===me.name&&<button onClick={()=>{startEdit(r.changes);setEfReason(r.reason||"");setAmending(r);}} style={{padding:"6px 12px",borderRadius:6,border:`1px solid ${T.warn}`,background:"#fff",color:"#b45309",fontSize:11.5,fontWeight:700,cursor:"pointer"}}>Amend & resubmit →</button>}</div>
        </div>
        <div style={{margin:"10px 0 6px",background:"#fff",borderRadius:8}}><WfTracker stages={st2} cur={c2}/></div>
        <div style={{fontSize:11.5,color:T.textSec}}>{r.status==="returned"?<span><strong>Returned for changes</strong> to {r.raisedBy}. It is not with an approver — it is waiting to be amended and sent round again. </span>:<span>Raised by {r.raisedBy} · {fmtDate(r.date)}. </span>}This package stays <strong>approved at V{p.version}</strong> {r.status==="returned"?"and is unaffected.":"until the change is confirmed on PrimeCare — nothing has changed on it yet."}</div>
        {r.returnNote&&r.status==="returned"&&<div style={{marginTop:8,padding:"7px 12px",background:"#fffbeb",borderRadius:6,fontSize:11.5,color:"#92400e"}}><strong>{r.returnNote.by} asked:</strong> "{r.returnNote.text}"</div>}
      </div>;})()}
    {/* Delegation banner */}
    {p.delegatedTo&&p.delegatedToUser&&<div style={{padding:"10px 16px",background:"linear-gradient(135deg,#faf5ff,#fff)",border:`2px solid ${T.purple}40`,borderRadius:10,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:22}}>🔄</span>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:T.purple}}>Currently Delegated</div>
          <div style={{fontSize:11,color:T.textSec,marginTop:2}}>
            <strong>{p.delegatedByUser?.name}</strong> ({p.delegatedByUser?.title}) → forwarded to <strong>{p.delegatedToUser.name}</strong> ({p.delegatedToUser.title})
          </div>
        </div>
      </div>
      <div style={{fontSize:10,fontWeight:600,color:T.purple,padding:"4px 10px",background:"#fff",borderRadius:12,border:`1px solid ${T.purple}40`}}>
        {p.delegatedTo===me.email?"Your turn to fill":"Awaiting delegate"}
      </div>
    </div>}
    {/* EDIT TYPE CHOOSER (E1) — inline, embedded in the screen */}

    {isAmend&&!editFlow&&<React.Fragment>
      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",background:T.cardBg,border:`1px solid ${T.border}`,borderLeft:`3px solid ${T.warn}`,borderRadius:10,padding:"12px 16px",margin:"14px 0 14px"}}>
        <span style={{fontSize:10,fontWeight:800,letterSpacing:0.6,textTransform:"uppercase",color:T.warn,background:`${T.warn}14`,padding:"3px 10px",borderRadius:20}}>Action required · your turn</span>
        <span style={{fontSize:13,color:T.text}}>This request was sent back to you — read the modification note below, update the request, and resubmit it from the bar at the bottom.</span>
      </div>
      <Card style={{marginBottom:18,padding:20,borderLeft:"4px solid #ea580c"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,gap:10,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,fontSize:15,fontWeight:700,color:"#c2410c"}}><Ic n="rotateCcw" s={15}/>Amend and resubmit — {p.id}</div>
          <span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:10.5,fontWeight:700,color:T.ok,background:"#ecfdf5",border:`1px solid ${T.ok}40`,padding:"3px 10px",borderRadius:20}}><span style={{width:6,height:6,borderRadius:"50%",background:T.ok}}/>Auto-saving</span>
        </div>
        {p.modifyNote&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:8,background:"#fff7ed",border:"1px solid #fed7aa",fontSize:12,color:T.text,marginBottom:10}}>
          <Ic n="alert" s={14} style={{color:"#ea580c"}}/><span><strong>{p.modifyNote.by}</strong> ({p.modifyNote.stage||"CMO Approval"}) asked for a change: <em>“{p.modifyNote.comment}”</em></span>
        </div>}
        <div style={{fontSize:11.5,color:T.textSec,marginBottom:12}}>Change what was asked for, then resubmit from the bar below. Your original entry is kept and is still shown on the Overview tab, so the change is visible to everyone who reviews it next.</div>
        {(()=>{const chg=k=>String(amd[k]??"")!==String(p[k]??"");const fs=k=>({...inp,margin:0,fontSize:12,borderColor:chg(k)?T.warn:T.border,background:chg(k)?"#fffbeb":"#fff"});
          const sel=(k,opts)=><Select style={fs(k)} value={amd[k]} onChange={e=>amdUpd(k,e.target.value)}><option value="">Select…</option>{opts.map(o=><option key={o} value={o}>{o}</option>)}</Select>;
          const F=(l,req,el,k)=><div><label style={lbl}>{l}{req&&<span style={{color:T.err}}> *</span>}</label>{el}{chg(k)&&<div style={{fontSize:9.5,color:T.warn,fontWeight:700,marginTop:2}}>was: {String(p[k]??"")||"—"}</div>}</div>;
          const hm=(amd.procedureDuration||"0:00").split(":");
          return <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12,marginBottom:14}}>
            {F("Proposed CPT Specialty",true,sel("specialty",SPECIALTIES),"specialty")}
            {F("Proposed CPT Code",false,<input style={fs("proposedCptCode")} value={amd.proposedCptCode} onChange={e=>amdUpd("proposedCptCode",e.target.value)}/>,"proposedCptCode")}
            {F("Proposed CPT Name",true,<input style={fs("proposedCptName")} value={amd.proposedCptName} onChange={e=>amdUpd("proposedCptName",e.target.value)}/>,"proposedCptName")}
            {F("Patient Type",true,sel("patientType",PATIENT_TYPES),"patientType")}
            {F("Anesthesia Requirement",true,sel("anesthesia",ANESTHESIA_OPTS),"anesthesia")}
            {F("Gender",true,sel("gender",GENDER_OPTS),"gender")}
            {F("Operation Skill",true,sel("opSkill",(opSkills&&opSkills.length?opSkills:OP_SKILLS_DEFAULT).filter(o=>o.isActive!==false).map(o=>o.title)),"opSkill")}
            {F("Suggested Procedure Patient Price",false,<div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,fontWeight:600,color:T.textSec}}>KWD</span><input type="number" step="0.001" style={fs("suggestedPrice")} value={amd.suggestedPrice} onChange={e=>amdUpd("suggestedPrice",e.target.value)}/></div>,"suggestedPrice")}
            {F("Accommodation Days",true,<input type="number" min="0" style={fs("accommodationDays")} value={amd.accommodationDays} onChange={e=>amdUpd("accommodationDays",e.target.value)}/>,"accommodationDays")}
            {F("Approximate Duration of Procedure",true,<div style={{display:"flex",alignItems:"center",gap:6}}><input type="number" min="0" style={{...fs("procedureDuration"),width:56,textAlign:"center"}} value={hm[0]} onChange={e=>amdUpd("procedureDuration",e.target.value+":"+(hm[1]||"00"))}/><strong>:</strong><input type="number" min="0" max="59" style={{...fs("procedureDuration"),width:56,textAlign:"center"}} value={hm[1]||"00"} onChange={e=>amdUpd("procedureDuration",(hm[0]||"0")+":"+e.target.value)}/><span style={{fontSize:10,color:T.textMut}}>Hours : Minutes</span></div>,"procedureDuration")}
          </div>;})()}
        {LOS_LISTS.map(x=><ListCard key={x.k} title={x.l} items={amd[x.k]||[""]} onChange={v=>amdUpd(x.k,v)} placeholder={x.ph} before={p[x.k]?String(p[x.k]):null}/>)}
      </Card>
    </React.Fragment>}
    {!editFlow&&canActNow&&!isAmend&&(()=>{
      const _tl={overview:"Overview",templates:"OT Templates",financial:"Financials",system:"System Setup"}[actionTab]||"Overview";
      const _modal=(p.currentStage===15||p.status==="cpt_exists_cfo_ack"||p.status==="cpt_exists_cmo_ack");
      const _go=()=>{
        if(p.currentStage===15){setShowActionModal("acknowledge");return;}
        if(p.status==="cpt_exists_cfo_ack"||p.status==="cpt_exists_cmo_ack"){setShowActionModal("ack_exists");return;}
        setTab(actionTab);
        setTimeout(()=>{if(actionRef.current)actionRef.current.scrollIntoView({behavior:"smooth",block:"start"});},60);
      };
      const _ask=(STAGE_BANNER[p.currentStage]&&!(p.status||"").startsWith("cpt_exists"))?STAGE_BANNER[p.currentStage]:p.currentStage===15?"Acknowledge the final approval":((p.status||"").indexOf("cpt_exists")===0?"Review & acknowledge the existing CPT":(actionTab==="templates"?"Build the OT templates and validate LOS & Services":(actionTab==="financial"?"Enter and submit the financial details":(actionTab==="system"?"Enter the PrimeCare system codes":"Review this request and record your decision"))));
      const _noNav=true;
      const _btn=_modal?"Acknowledge →":("Go to "+_tl+" →");
      return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap",background:T.cardBg,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 18px",marginBottom:16,boxShadow:"0 2px 12px rgba(15,23,42,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,minWidth:0}}>
          <div style={{width:40,height:40,borderRadius:11,background:`${T.warn}14`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n="zap" s={18} style={{color:T.warn}}/></div>
          <div style={{minWidth:0}}>
            <span style={{display:"inline-flex",alignItems:"center",fontSize:10,fontWeight:800,letterSpacing:0.6,textTransform:"uppercase",color:T.warn,background:`${T.warn}14`,padding:"3px 10px",borderRadius:20}}>Action required · your turn</span>
            <div style={{fontSize:14,color:T.text,fontWeight:600,marginTop:8}}>{_ask}</div>
          </div>
        </div>
        {!_noNav&&<button onClick={_go} style={{flexShrink:0,padding:"10px 22px",borderRadius:9,border:"none",background:T.primary,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:`0 3px 10px ${T.primary}44`}}>{_btn}</button>}
      </div>;
    })()}
    {/* Tabs — Item Evaluation style */}
    {editFlow?.step==="fields"&&!editFlow.all&&<Card style={{marginBottom:12,padding:"10px 16px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",borderLeft:`3px solid ${T.primary}`}}>
      <Ic n="pencil" s={14} style={{color:T.primary}}/>
      <div style={{flex:1,minWidth:200}}>
        <span style={{fontSize:12.5,fontWeight:700,color:T.text}}>Change Request — {editFlow.group.name}</span>
        <span style={{fontSize:11,color:T.textSec}}> · the fields are editable in place in the {tabs.find(t2=>t2.k===efTab)?.l||"Overview"} tab — highlighted with borders. Submit from the action bar.</span>
      </div>
      {tab!==efTab&&<button onClick={()=>setTab(efTab)} style={{padding:"6px 14px",borderRadius:7,border:`1px solid ${T.primary}55`,background:"#fff",color:T.primary,fontSize:11.5,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Go to {tabs.find(t2=>t2.k===efTab)?.l} →</button>}
      <button onClick={()=>setEditFlow(null)} style={{padding:"6px 14px",borderRadius:7,border:`1px solid ${T.border}`,background:"#fff",color:T.textSec,fontSize:11.5,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
    </Card>}
    {!efHide&&<div data-tour="tabs" ref={tabsRef} style={{display:"flex",gap:0,borderBottom:`2px solid ${T.border}`,marginBottom:20}}>
      {tabBtns}
    </div>}
    {editFlow?.step==="fields"&&editFlow.group&&editFlow.group.special==="obsolete"&&tabView===efTab&&<Card style={{marginBottom:16,borderTop:`3px solid ${T.primary}`,padding:20}}>
      <ST style={{fontSize:14,margin:"0 0 4px"}}>Obsolete → replacement item codes</ST>
      <div style={{fontSize:10.5,color:T.textMut,marginBottom:12}}>Every package using an obsolete code is affected. The certificate will list the impacted template numbers.</div>
      {efPairs.map((pr,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center",maxWidth:560}}>
        <input style={{...inp,flex:1,margin:0}} placeholder="Obsolete code" value={pr.old} onChange={e=>setEfPairs(efPairs.map((x,j)=>j===i?{...x,old:e.target.value}:x))}/>
        <Ic n="arrowRight" s={13} style={{color:T.textMut}}/>
        <input style={{...inp,flex:1,margin:0}} placeholder="New code" value={pr.new} onChange={e=>setEfPairs(efPairs.map((x,j)=>j===i?{...x,new:e.target.value}:x))}/>
        {efPairs.length>1&&<span onClick={()=>setEfPairs(efPairs.filter((_,j)=>j!==i))} style={{cursor:"pointer",color:T.err,display:"inline-flex"}}><Ic n="x" s={13}/></span>}
      </div>)}
      <button onClick={()=>setEfPairs([...efPairs,{old:"",new:""}])} style={{background:"none",border:`1px dashed ${T.border}`,borderRadius:6,padding:"5px 12px",fontSize:11,cursor:"pointer",color:T.textSec,fontFamily:T.font}}>+ Add pair</button>
    </Card>}
    {!efHide&&pinTabs&&<div style={{position:"fixed",top:pinTop,left:200,right:0,zIndex:45,background:T.bodyBg,borderBottom:`2px solid ${T.border}`,padding:"6px 24px 0",display:"flex",gap:0,boxShadow:"0 6px 16px rgba(15,23,42,0.06)"}}>
      {tabBtns}
    </div>}

    {/* ═══ OVERVIEW TAB — Item Evaluation layout ═══ */}
    {p.version>1&&p.editDiff&&p.editDiff.items&&p.editDiff.items.length>0&&tab==="overview"&&<Card style={{marginBottom:14,padding:14,background:"#fffbeb",border:`1px solid ${T.warn}60`}}>
      <div style={{fontSize:12,fontWeight:700,color:"#92400e",marginBottom:6}}>✎ Changes in this version (V{p.version} vs V{p.editDiff.fromVersion})</div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead><tr style={{background:"#fff"}}><th style={{...th,textAlign:"left"}}>Field</th><th style={{...th,textAlign:"left"}}>Previous</th><th style={{...th,textAlign:"left"}}>New</th></tr></thead>
        <tbody>{p.editDiff.items.map((c,i)=><tr key={i} style={{borderTop:`1px solid ${T.borderLight}`}}>
          <td style={{...td,textAlign:"left",fontWeight:600}}>{c.label}</td>
          <td style={{...td,textAlign:"left",color:T.err,textDecoration:"line-through"}}>{c.old}</td>
          <td style={{...td,textAlign:"left",color:T.ok,fontWeight:600}}>{c.new}</td>
        </tr>)}</tbody>
      </table>
    </Card>}
    {tabView==="overview"&&<div>
      {p.migrated&&(()=>{const mm=p.migrationMeta||{};
        return <Card style={{marginBottom:16,padding:0,overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap",padding:"12px 18px",background:"#f0fdfa",borderBottom:`1px solid ${T.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <Ic n="download" s={15} style={{color:T.teal||"#0d9488"}}/>
              <div>
                <div style={{fontSize:13,fontWeight:800,color:T.text}}>Migrated Package — legacy record</div>
                <div style={{fontSize:10.5,color:T.textSec}}>Costs as of {mm.extractDate||"n/a"}{mm.latestApprovalDate?` · last paper approval ${mm.latestApprovalDate}`:" · no approval date on file"}{mm.remarksLegacy?` · "${mm.remarksLegacy}"`:""}</div>
              </div>
            </div>
            {mm.completed?<Badge color={T.ok} bg="#ecfdf5">Migration record complete</Badge>:<Badge color={T.warn} bg="#fffbeb">Completion pending — capture related people</Badge>}
          </div>
          {(mm.drift||[]).length>0&&<div style={{padding:"8px 18px",fontSize:10.5,color:"#854d0e",background:"#fffbeb",borderBottom:`1px solid ${T.borderLight}`}}>{(mm.drift||[]).map((d,i2)=><div key={i2}>• {d}</div>)}</div>}
          <div style={{padding:"14px 18px"}}>
            <div style={{fontSize:10.5,fontWeight:800,letterSpacing:0.5,textTransform:"uppercase",color:T.textSec,marginBottom:8}}>Related people (from the paper approval sheets)</div>
            {mm.completed?
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{(mm.relatedPeople||[]).map((rp,i2)=><span key={i2} style={{fontSize:11.5,fontWeight:600,color:T.primaryDark,background:T.primaryLight,border:`1px solid ${T.primary}25`,borderRadius:8,padding:"4px 10px"}}>{rp.name}{rp.date?` · ${rp.date}`:""}{rp.free?" · (departed)":""}</span>)}</div>
            :<React.Fragment>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
                {mpPeople.map((rp,i2)=><span key={i2} style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11.5,fontWeight:600,color:T.text,background:"#f8fafc",border:`1px solid ${T.border}`,borderRadius:8,padding:"4px 8px"}}>
                  {rp.name}{rp.free?" (departed)":""}
                  <input type="date" value={rp.date||""} onChange={e=>setMpPeople(mpPeople.map((x,k)=>k===i2?{...x,date:e.target.value}:x))} style={{...inp,width:130,margin:0,padding:"2px 6px",fontSize:10.5}}/>
                  <span onClick={()=>setMpPeople(mpPeople.filter((_,k)=>k!==i2))} style={{cursor:"pointer",display:"inline-flex",color:T.err}}><Ic n="x" s={11}/></span>
                </span>)}
                {mpPeople.length===0&&<span style={{fontSize:11,color:T.textMut}}>No people added yet</span>}
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:12}}>
                <Select defaultValue="" onChange={e=>{const u2=U.find(x=>x.name===e.target.value);e.target.value="";if(u2&&!mpPeople.some(x=>x.name===u2.name))setMpPeople([...mpPeople,{name:u2.name,date:"",free:false}]);}} style={{...inp,width:260,margin:0,fontSize:12}}>
                  <option value="">Add from Active Directory…</option>
                  {U.map(u2=><option key={u2.id} value={u2.name}>{u2.name} — {u2.title}</option>)}
                </Select>
                <input value={mpFree} onChange={e=>setMpFree(e.target.value)} placeholder="Person who left the organisation…" style={{...inp,width:240,margin:0,fontSize:12}}/>
                <button onClick={()=>{if(mpFree.trim()&&!mpPeople.some(x=>x.name===mpFree.trim())){setMpPeople([...mpPeople,{name:mpFree.trim(),date:"",free:true}]);setMpFree("");}}} style={{padding:"8px 14px",borderRadius:8,border:`1px solid ${T.border}`,background:"#fff",fontSize:11.5,fontWeight:700,color:T.textSec,cursor:"pointer",fontFamily:T.font}}>+ Add</button>
              </div>
              <div style={{fontSize:10.5,fontWeight:800,letterSpacing:0.5,textTransform:"uppercase",color:T.textSec,margin:"4px 0 6px"}}>Approval documents (scanned packs)</div>
              <AttachmentBox files={mpDocs} onChange={setMpDocs} step="Migration" by={me.name}/>
              <div style={{marginTop:12,display:"flex",justifyContent:"flex-end"}}>
                <button onClick={()=>{if(!mpPeople.length&&!window.confirm("No related people captured — complete anyway?"))return;onAction(p,"migration_complete",{relatedPeople:mpPeople,attachments:mpDocs,actionLabel:"Migration record completed"});}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 20px",borderRadius:8,border:"none",background:T.primary,color:"#fff",fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:T.font}}><Ic n="shieldCheck" s={13}/>Save & Mark Migration Complete</button>
              </div>
            </React.Fragment>}
          </div>
        </Card>;})()}

      {/* Request information — full width, two columns (live) */}
      <Card style={{padding:24,marginBottom:20}}>
        <ST style={{fontSize:15,color:T.primary,marginBottom:12}}>Request information</ST>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",columnGap:36}}>
          {[{l:"Request ID",v:p.id},{l:"Created",v:fmtDateTime(p.requestDate)},{l:"Created by",v:p.requestor?.name},{l:"Branch",v:BRANCHES.find(b=>b.code===p.branch)?.name||p.branch},{l:"Specialty",v:p.specialty},{l:"CPT Code",v:p.accurateCptCode||p.proposedCptCode||"—"},{l:"CPT Name",v:p.accurateCptName||p.proposedCptName},{l:"CPT Status",v:p.cptStatus||"Pending"},{l:"Patient Type",v:p.patientType||"—"},{l:"Anesthesia Requirement",v:p.anesthesia||"—"},{l:"Gender",v:p.gender||"—"},{l:"Operation Skill",v:p.opSkill||"—"},{l:"Suggested Price",v:fmtKWD(p.suggestedPrice)},{l:"Version",v:"V"+p.version}].map((f,i)=>
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,padding:"7px 0",borderBottom:`1px solid ${T.borderLight}`}}>
              <span style={{fontSize:12,color:T.textSec}}>{f.l}</span>
              {(EFK_INFO[f.l]&&efEdit(EFK_INFO[f.l]))||<span style={{fontSize:12,fontWeight:500,color:T.text,textAlign:"right",maxWidth:"60%"}}>{f.v||"—"}</span>}
            </div>)}
        </div>
      </Card>

      {/* LOS & Services — dedicated rich section with proper UI for multi-line data */}
      <Card style={{marginBottom:20,padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <ST style={{fontSize:15,color:T.primary,margin:0}}>LOS & services details</ST>
          <span style={{fontSize:10,color:T.textMut,padding:"3px 10px",background:"#f8fafc",borderRadius:10,border:`1px solid ${T.border}`}}>
            Set by Doctor → Updated by Nursing
          </span>
        </div>
        {p.doctorEntry&&(()=>{
          const rows=[
            {l:"Surgery Duration",o:p.doctorEntry.procedureDuration,n:p.procedureDuration},
            {l:"Accommodation Days",o:p.doctorEntry.accommodationDays,n:p.accommodationDays},
            {l:"Man Power",o:p.doctorEntry.manpower,n:p.manpower},
            {l:"Machines & Devices",o:p.doctorEntry.machinesDevices,n:p.machinesDevices},
            {l:"Major Consumables & Drugs",o:p.doctorEntry.consumablesDrugs,n:p.consumablesDrugs},
            {l:"Lab & Radiology",o:p.doctorEntry.labRadiology,n:p.labRadiology},
            {l:"Extra Services",o:p.doctorEntry.extraServices,n:p.extraServices},
          ].filter(r=>String(r.o==null?"":r.o)!==String(r.n==null?"":r.n));
          if(rows.length===0)return null;
          return <div style={{marginBottom:14,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",background:"#fff"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",background:"#f8fafc"}}>
              <span style={{display:"inline-flex",alignItems:"center",gap:7,fontSize:10.5,fontWeight:800,letterSpacing:0.6,textTransform:"uppercase",color:T.textSec}}><Ic n="filePen" s={12}/>Nursing validation updates</span>
              <span style={{fontSize:9.5,fontWeight:800,letterSpacing:0.4,padding:"3px 10px",borderRadius:20,background:`${T.teal||"#0d9488"}14`,color:T.teal||"#0d9488"}}>{rows.length} {rows.length===1?"CHANGE":"CHANGES"}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"170px 1fr 26px 1fr",gap:0,padding:"4px 16px 6px",fontSize:9.5,fontWeight:700,letterSpacing:0.4,textTransform:"uppercase",color:T.textMut}}>
              <span style={{padding:"6px 0"}}>Field</span><span style={{padding:"6px 0"}}>Doctor entered</span><span/><span style={{padding:"6px 0"}}>Nursing validated</span>
            </div>
            {rows.map((r,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"170px 1fr 26px 1fr",alignItems:"center",gap:0,padding:"8px 16px",borderTop:`1px solid ${T.borderLight}`}}>
              <span style={{fontSize:12,fontWeight:700,color:T.text}}>{r.l}</span>
              <span style={{fontSize:11.5,color:T.textMut}}>{(r.o==null||r.o==="")?"—":String(r.o)}</span>
              <span style={{display:"flex",justifyContent:"center"}}><Ic n="arrowRight" s={12} style={{color:T.textMut}}/></span>
              <span style={{fontSize:11.5,fontWeight:600,color:T.text}}><span style={{background:`${T.teal||"#0d9488"}10`,border:`1px solid ${(T.teal||"#0d9488")}30`,borderRadius:6,padding:"2px 8px",display:"inline-block"}}>{(r.n==null||r.n==="")?"—":String(r.n)}</span></span>
            </div>)}
          </div>;
        })()}
        {/* Top metrics: numeric values as compact pills */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div style={{padding:"10px 14px",background:"#eff6ff",borderRadius:8,borderLeft:`3px solid ${T.info}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:9,color:T.textMut,fontWeight:600,textTransform:"uppercase"}}>⏱ Surgery Duration</div>
              <div style={{fontSize:16,fontWeight:700,color:T.info,marginTop:2}}>{p.procedureDuration||"—"} {p.procedureDuration?"hrs":""}</div>
            </div>
            {efEdit("procedureDuration")}
          </div>
          <div style={{padding:"10px 14px",background:"#f0fdfa",borderRadius:8,borderLeft:`3px solid ${T.teal||"#0d9488"}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:9,color:T.textMut,fontWeight:600,textTransform:"uppercase"}}>Accommodation Days</div>
              <div style={{fontSize:16,fontWeight:700,color:T.teal||"#0d9488",marginTop:2}}>{p.accommodationDays||0} {(p.accommodationDays||0)>0?"days":""}</div>
            </div>
            {efEdit("accommodationDays")}
          </div>
        </div>
        {/* Multi-line entries — full rich UI for handling long lists */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[
            {l:"Man Power",icon:"users",v:p.manpower,c:T.purple,bg:"#faf5ff"},
            {l:"Machines & Devices",icon:"wrench",v:p.machinesDevices,c:T.info,bg:"#eff6ff"},
            {l:"Major Consumables & Drugs",icon:"pill",v:p.consumablesDrugs,c:"#7c3aed",bg:"#f5f3ff"},
            {l:"Lab & Radiology Needs",icon:"microscope",v:p.labRadiology,c:T.teal||"#0d9488",bg:"#f0fdfa"},
            {l:"Extra Services",icon:"plus",v:p.extraServices,c:"#d97706",bg:"#fffbeb"},
          ].map((f,i)=>{
            const items=f.v?String(f.v).split(/[;,]\s*|\n/).filter(s=>s.trim()):[];
            return<div key={i} style={{padding:0,background:"#fff",borderRadius:8,border:`1px solid ${T.borderLight}`,borderLeft:`3px solid ${f.c}`,overflow:"hidden",display:"flex",flexDirection:"column"}}>
              {/* Card header with count */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:f.bg,borderBottom:`1px solid ${T.borderLight}`}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <Ic n={f.icon} s={13}/>
                  <span style={{fontSize:11,color:f.c,fontWeight:700,textTransform:"uppercase",letterSpacing:0.3}}>{f.l}</span>
                </div>
                <span style={{fontSize:10,color:T.textMut,fontWeight:600,padding:"2px 8px",background:"#fff",borderRadius:10,border:`1px solid ${T.border}`}}>{items.length} {items.length===1?"item":"items"}</span>
              </div>
              {/* Card body — scrollable for long lists */}
              <div style={{padding:"10px 14px",maxHeight:200,overflowY:"auto",flex:1}}>
                {items.length===0?<div style={{fontSize:11,color:T.textMut,fontStyle:"italic",padding:"6px 0"}}>Not specified</div>:
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {items.map((it,j)=><div key={j} style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:11,color:T.text,padding:"3px 0",borderBottom:j<items.length-1?`1px dashed ${T.borderLight}`:"none"}}>
                    <span style={{color:f.c,fontWeight:700,minWidth:18,fontSize:10,background:f.bg,borderRadius:3,padding:"1px 5px",textAlign:"center"}}>{j+1}</span>
                    <span style={{flex:1,lineHeight:1.4}}>{it.trim()}</span>
                  </div>)}
                </div>}
              </div>
            </div>;
          })}
        </div>
      </Card>

      {/* Attachments (Batch 6 #22) */}
      {((p.attachments&&p.attachments.length>0)||p.financial||(p.templates.procCons.length>0||p.templates.procDrugs.length>0)||(p.systemSetup&&(p.systemSetup.opCode||p.systemSetup.pkgId)))&&<Card style={{marginBottom:20,padding:"16px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:6}}>
          <ST style={{fontSize:15,margin:0}}>At a Glance</ST>
          <span style={{fontSize:10.5,color:T.textMut}}>Full details live in their tabs — click a tile to open</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:10}}>
          {(p.templates.procCons.length>0||p.templates.procDrugs.length>0)&&(()=>{const all=[...(p.templates.procCons||[]),...(p.templates.wardsCons||[]),...(p.templates.procDrugs||[]),...(p.templates.wardsDrugs||[])];const tot=all.reduce((s,x)=>s+(x.totalCost||0),0);return <div onClick={()=>setTab("templates")} style={TILE}>
            <div style={TILE_H}><Ic n="clipboard" s={12}/>OT Templates</div>
            <div style={TILE_V}>{all.length} items · {fmtKWD(tot)}</div>
            <div style={TILE_L}>Open OT Templates →</div>
          </div>;})()}
          {p.financial&&<div onClick={()=>setTab("financial")} style={TILE}>
            <div style={TILE_H}><Ic n="coins" s={12}/>Financials</div>
            <div style={TILE_V}>{p.financial.finalPatientPrice?("Patient Price "+fmtKWD(p.financial.finalPatientPrice)):"Costing recorded"}</div>
            <div style={TILE_L}>Open Financials →</div>
          </div>}
          {p.systemSetup&&(p.systemSetup.opCode||p.systemSetup.pkgId)&&<div onClick={()=>setTab("system")} style={TILE}>
            <div style={TILE_H}><Ic n="building" s={12}/>System Setup</div>
            <div style={TILE_V}>{p.systemSetup.opCode?("Op "+p.systemSetup.opCode):"—"}{p.systemSetup.pkgId?(" · PKGID "+p.systemSetup.pkgId):""}</div>
            <div style={TILE_L}>Open System Setup →</div>
          </div>}
          {p.attachments&&p.attachments.length>0&&<div onClick={()=>setTab("attachments")} style={TILE}>
            <div style={TILE_H}><Ic n="paperclip" s={12}/>Attachments</div>
            <div style={TILE_V}>{p.attachments.length} file{p.attachments.length>1?"s":""}</div>
            <div style={TILE_L}>Open Attachments →</div>
          </div>}
        </div>
      </Card>}

      {/* Routing & assignment — three columns under At a Glance (live) */}
      {(()=>{const total=p.cptStatus==="Exists"?3:15;const done=p.status==="approved"||p.status==="cpt_exists";const step=Math.min(p.currentStage>15?total:p.currentStage,total);const pct=done?100:Math.min(100,Math.round(((step-1)/total)*100));
        const who=p.reassignedTo&&p.reassignedTo.stage===p.currentStage?p.reassignedTo.name:p.delegatedToUser?p.delegatedToUser.name:p.currentStage===1?(p.requestor||{}).name:((APPROVAL_CONFIG_DEFAULT.find(c=>c.num===p.currentStage)||{}).approvers||{})[p.branch];
        const sd=(SLA_CONFIG_DEFAULT.find(c=>c.num===p.currentStage)||{}).slaDays;const due=sd&&!done&&!["draft","rejected"].includes(p.status)?addDays(p.stageStartDate,sd):null;
        const H=({c,children})=><div style={{fontSize:11,fontWeight:800,color:c,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>{children}</div>;
        const box={padding:"12px 14px",background:"#f8fafc",border:`1px solid ${T.borderLight}`,borderRadius:8,minHeight:56};
        return <Card style={{padding:24,marginBottom:20}}>
          <ST style={{fontSize:15,color:T.primary,marginBottom:14}}>Routing & assignment</ST>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
            <div><H c={T.purple}>Requestor</H>
              <div style={{...box,display:"flex",alignItems:"center",gap:12}}><Av user={p.requestor} size={36} color={T.info}/>
                <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{(p.requestor||{}).name}</div><div style={{fontSize:11,color:T.textMut}}>{BRANCHES.find(b=>b.code===p.branch)?.name||p.branch}</div></div></div></div>
            <div><H c={T.ok}>Current stage</H>
              <div style={{...box,background:isMy?"#fffbeb":"#fff",border:`1px solid ${isMy?T.warn+"55":T.border}`}}>
                <div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.status==="draft"?"Draft — not submitted":p.status==="rejected"?"Rejected":done?"Completed":stageDef?.label}</div>
                <div style={{fontSize:11,color:T.textSec,marginTop:3}}>{done?"Approved — all stages complete":p.status==="rejected"?"The reviewer's comment is on the timeline":p.status==="draft"?"Not submitted yet":"With "+(isMy?"you":(who||"the assigned approver"))}</div>
                {due&&<div style={{fontSize:11,color:dayDiff(due)<0?T.err:T.warn,marginTop:3}}>Due {fmtDate(due)}</div>}
              </div></div>
            <div><H c={T.textSec}>Workflow progress</H>
              <div style={box}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:8}}><span style={{color:T.textSec}}>{done?"Completed — all steps done":`On step ${step} of ${total}`}</span><span style={{fontWeight:700,color:T.ok}}>{pct}%</span></div>
                <div style={{height:5,background:"#e2e8f0",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,background:T.ok,width:pct+"%"}}/></div>
              </div></div>
          </div>
        </Card>;})()}

      {p.currentStage===4&&isMy&&<Card style={{marginTop:16}}>
        <ST style={{fontSize:14,margin:"0 0 10px"}}>LOS & Services — Validate & Update</ST>
        <div style={{fontSize:12,color:T.textSec,marginBottom:12}}>Review and update requestor entries below, then build the OT Templates from item masters.</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <SyncedField label="Surgery Duration" reqValue={p.procedureDuration} value={nurDuration} onChange={setNurDuration} required type="duration"/>
          <SyncedField label="Accommodation Days" reqValue={String(p.accommodationDays)} value={nurAccomm} onChange={setNurAccomm} required type="number" placeholder="0"/>
        </div>
        <ListCard title="Man Power Details" items={nurManpower} onChange={setNurManpower} placeholder="e.g. 1 Surgeon, 1 Anesthetist..." required reqItems={p.manpower?[p.manpower]:null}/>
        <ListCard title="Machines & Devices" items={nurMachines} onChange={setNurMachines} placeholder="e.g. Arthroscopy tower, Tourniquet..." reqItems={p.machinesDevices?[p.machinesDevices]:null}/>
        <div style={{marginBottom:12}}><KWDInput label="Machines & Devices Cost" value={nurMachinesCost} onChange={setNurMachinesCost}/></div>
        <ListCard title="Major Consumables & Drugs" items={nurConsDrugs} onChange={setNurConsDrugs} placeholder="e.g. Knee implant, bone cement..." reqItems={p.consumablesDrugs?[p.consumablesDrugs]:null}/>
        <div style={{marginBottom:12}}><KWDInput label="Major Consumables & Drugs Cost" value={nurConsDrugsCost} onChange={setNurConsDrugsCost}/></div>
        <ListCard title="Lab & Radiology Needs" items={nurLabRad} onChange={setNurLabRad} placeholder="e.g. X-ray, CBC, PT/INR..." reqItems={p.labRadiology?[p.labRadiology]:null}/>
      </Card>}
      {/* Status bar at bottom */}
      {p.status==="approved"&&<div style={{marginTop:16,padding:"16px 24px",background:"#ecfdf5",borderRadius:10,border:`2px solid ${T.ok}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}><Ic n="check" s={24} sw={2.5} style={{color:T.ok}}/><div><div style={{fontSize:16,fontWeight:700,color:T.ok}}>Approved & Active</div><div style={{fontSize:12,color:T.textSec}}>Version {p.version} · {p.systemSetup?.pkgId||""} · {p.systemSetup?.opCode||""}</div></div></div>
      </div>}
    </div>}

    {tabView==="changes"&&<div>
      <Card style={{padding:20,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <ST style={{fontSize:15,margin:0}}>Change History</ST>
          <span style={{fontSize:10.5,color:T.textMut}}>{vlReqs.filter(r=>!r.done).length} in approval · {vlReqs.filter(r=>r.done).length} applied</span>
        </div>
        <div style={{fontSize:11,color:T.textSec}}>Every change requested on this package, financial and non-financial, with before → after values and what became of it. A financial edit also creates a new version — the Versions tab lists those, and the Routing Chain shows the stages it re-ran.</div>
      </Card>
      {vlReqs.slice().reverse().map(r=><Card key={r.id} style={{padding:0,marginBottom:14,overflow:"hidden"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap",padding:"12px 18px",background:"#f8fafc",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
            <span style={{fontSize:12.5,fontWeight:800,color:T.primary}}>{r.id}</span>
            <span style={{fontSize:12,fontWeight:600,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:420}}>{editReqLabel(r)}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {(()=>{const es=editStatusOf(r);return <Badge color={es.c} bg={es.c+"14"}>{es.k==="applied"?`Applied — V${r.toVer}`:es.l}</Badge>;})()}
            <button onClick={()=>onOpenVl(r.id)} style={{padding:"5px 12px",borderRadius:6,border:`1px solid ${T.primary}55`,background:"#fff",color:T.primary,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Open request →</button>
          </div>
        </div>
        <div style={{padding:"6px 18px 12px"}}>
          <div style={{display:"grid",gridTemplateColumns:"180px 1fr 26px 1fr",gap:0,padding:"6px 0 2px",fontSize:9.5,fontWeight:700,letterSpacing:0.4,textTransform:"uppercase",color:T.textMut}}>
            <span>Field</span><span>Before</span><span/><span>After</span>
          </div>
          {(r.changes||[]).map((c,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"180px 1fr 26px 1fr",alignItems:"center",padding:"7px 0",borderTop:`1px solid ${T.borderLight}`}}>
            <span style={{fontSize:12,fontWeight:700,color:T.text}}>{c.l}</span>
            <span style={{fontSize:11.5,color:T.textMut}}>{c.from||"—"}</span>
            <span style={{display:"flex",justifyContent:"center"}}><Ic n="arrowRight" s={12} style={{color:T.textMut}}/></span>
            <span style={{fontSize:11.5,fontWeight:600}}><span style={{background:`${T.teal||"#0d9488"}10`,border:`1px solid ${(T.teal||"#0d9488")}30`,borderRadius:6,padding:"2px 8px",display:"inline-block"}}>{c.to||"—"}</span></span>
          </div>)}
          <div style={{fontSize:10.5,color:T.textMut,marginTop:8}}>Raised by {r.raisedBy} · {r.date} · Reason: {r.reason}</div>
        </div>
      </Card>)}
    </div>}

    {/* ═══ ROUTING CHAIN TAB — matching Item Evaluation DelegationChain ═══ */}
    {tabView==="routing"&&(()=>{
      const exists=p.cptStatus==="Exists"&&(p.currentStage===99||p.status.indexOf("cpt_exists")===0);
      const last=p.status==="approved"||p.status==="cpt_exists"?15:Math.min(p.currentStage||1,15);
      const who=n=>n===1?(p.requestor||{}).name:(n===6?((CHIEF_SURGEONS_DEFAULT[p.branch]||{})[p.specialty]):null)||((APPROVAL_CONFIG_DEFAULT.find(c=>c.num===n)||{}).approvers||{})[p.branch]||"—";
      const tl=p.timeline||[];const at=i=>tl[Math.min(i,tl.length-1)]?.date||p.requestDate;
      const steps=[];for(let n=1;n<=last;n++){const st=STAGES.find(x=>x.num===n);const cur=n===last&&!["approved","rejected","cpt_exists"].includes(p.status);
        const sd=(SLA_CONFIG_DEFAULT.find(c=>c.num===n)||{}).slaDays;
        steps.push({n,label:st.label,who:p.delegatedToUser&&cur?p.delegatedToUser.name:who(n),role:n===1?"Requestor":"Approver",state:cur?(p.status==="modification"?"returned":"waiting"):(p.status==="rejected"&&n===last?"rejected":"done"),
          assigned:n===1?p.requestDate:(cur?p.stageStartDate:at(n-1)),finished:cur?null:at(n),due:cur&&sd?addDays(p.stageStartDate,sd):null});}
      const rows=steps.reverse();
      const pill={waiting:{t:"WAITING",c:T.warn,bg:"#fffbeb"},done:{t:"DONE",c:T.ok,bg:"#ecfdf5"},returned:{t:"SENT BACK",c:"#ea580c",bg:"#fff7ed"},rejected:{t:"REJECTED",c:T.err,bg:"#fef2f2"}};
      return <Card style={{padding:24}}>
        <ST style={{fontSize:16,color:T.primary,marginBottom:4}}>Approval routing chain</ST>
        <p style={{fontSize:12,color:T.textSec,margin:"0 0 16px"}}>{rows.length} step{rows.length===1?"":"s"} across 1 run, newest first. Each step shows what it DECIDED — approved, sent back, forwarded — not merely that it closed. A superseded step is one a send-back overtook; it is kept so the route stays readable.</p>
        {rows.map((r,i)=>{const pl=pill[r.state];return <div key={r.n} style={{display:"flex",gap:14}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:pl.bg,color:pl.c,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n={r.state==="waiting"?"clock":r.state==="done"?"check":r.state==="rejected"?"x":"rotateCcw"} s={12}/></div>
            {i<rows.length-1&&<div style={{width:2,flex:1,background:T.border,minHeight:14}}/>}
          </div>
          <div style={{paddingBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:13.5,fontWeight:700,color:T.text}}>{r.label}</span><span style={{fontSize:9.5,fontWeight:800,letterSpacing:0.5,color:pl.c,background:pl.bg,borderRadius:10,padding:"2px 8px"}}>{pl.t}</span></div>
            <div style={{fontSize:12,color:T.textSec,marginTop:2}}>{r.who} · {r.role}</div>
            <div style={{fontSize:10.5,color:T.textMut,marginTop:2}}>Assigned {fmtDateTime(r.assigned)}{r.finished?" · finished "+fmtDateTime(r.finished):""}{r.due?" · due "+fmtDate(r.due):""}</div>
          </div>
        </div>;})}
      </Card>;})()}

    {tabView==="templates"&&editFlow&&editFlow.all&&<Card style={{marginBottom:14,padding:"12px 16px",background:"#fff7ed",border:"1px solid #fed7aa",display:"flex",alignItems:"center",gap:12}}><Ic n="pencil" s={14} style={{color:"#c2410c"}}/><div style={{flex:1,fontSize:12,color:"#9a3412"}}><strong>Editing the OT templates.</strong> A template change is a <strong>financial</strong> edit — it re-runs the approval stages as V{(p.version||1)+1}. Open the template editor to add, remove or re-quantify items.</div><button onClick={()=>nav("edit",p)} style={{padding:"7px 14px",borderRadius:6,border:"none",background:"#c2410c",color:"#fff",fontSize:11.5,fontWeight:700,cursor:"pointer"}}>Open template editor →</button></Card>}
    {tabView==="templates"&&<div>
      {isMy&&p.currentStage===4?
        // EDITABLE MODE - Nursing Manager can edit templates directly from this tab
        <div>
          {p.modifyNote&&<Card style={{marginBottom:12,padding:12,background:"#fff7ed",border:`1px solid ${"#ea580c"}40`}}>
            <div style={{fontSize:11,fontWeight:700,color:"#c2410c",marginBottom:3}}>↺ Modification requested by {p.modifyNote.by} ({p.modifyNote.role})</div>
            <div style={{fontSize:12,color:T.text}}>{p.modifyNote.comment||"(no comment provided)"}</div>
          </Card>}
          <Card style={{marginBottom:14,padding:14,background:"#fffbeb",border:`2px solid ${T.warn}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <Ic n="pencil" s={17}/>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:T.warn}}>Edit Mode — You have authority to modify templates</div>
                <div style={{fontSize:11,color:T.textSec,marginTop:2}}>Add, modify, or remove items below. Changes are saved automatically — submit from the action bar when ready.</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:T.ok,background:"#f0fdf4",padding:"4px 10px",borderRadius:12,border:`1px solid ${T.ok}30`}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:T.ok,display:"inline-block",animation:"fadeIn 1s infinite alternate"}}></span>
              <span style={{fontWeight:600}}>Auto-saving</span>
            </div>
          </Card>
          {/* Tabbed editable template builder - same UI as in action panel */}
          {(()=>{
            const tCards=[
              {k:"procCons",t:"Procedure Consumables",items:procCons,setItems:setProcCons,master:CONS_MASTER,req:true,icon:"building"},
              {k:"wardsCons",t:"Wards Consumables",items:wardsCons,setItems:setWardsCons,master:CONS_MASTER,icon:"bed"},
              {k:"procDrugs",t:"Procedure Drugs",items:procDrugs,setItems:setProcDrugs,master:DRUGS_MASTER,req:true,icon:"pill"},
              {k:"wardsDrugs",t:"Wards Drugs",items:wardsDrugs,setItems:setWardsDrugs,master:DRUGS_MASTER,icon:"syringe"},
            ];
            const active=tCards.find(c=>c.k===nurActiveTemplate)||tCards[0];
            const grandTotal=tCards.reduce((s,c)=>s+c.items.reduce((s2,i)=>s2+(i.totalCost||0),0),0);
            return<div>
              {/* Tab strip */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:0}}>
                {tCards.map(c=>{const tot=c.items.reduce((s,i)=>s+(i.totalCost||0),0);const isActive=nurActiveTemplate===c.k;
                  return<div key={c.k} onClick={()=>setNurActiveTemplate(c.k)} style={{padding:"10px 12px",borderRadius:"10px 10px 0 0",cursor:"pointer",
                    background:isActive?"#fff":"#f8fafc",
                    border:isActive?`2px solid ${c.items.length>0?T.ok:c.req?T.err:T.border}`:`1px solid ${T.border}`,
                    borderBottom:isActive?"2px solid #fff":"1px solid "+T.border,
                    marginBottom:isActive?-2:0,
                    position:"relative",zIndex:isActive?1:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <Ic n={c.icon} s={13}/>
                      <span style={{fontSize:11,fontWeight:isActive?700:500,color:isActive?T.primary:T.textSec}}>{c.t.replace("Procedure ","Proc ").replace("Consumables","Cons")}</span>
                      {c.req&&<span style={{color:T.err,fontSize:9}}>*</span>}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
                      <span style={{fontSize:10,color:T.textMut}}>{c.items.length} items</span>
                      <span style={{fontSize:12,fontWeight:700,color:c.items.length>0?T.ok:T.textMut}}>{fmtKWD(tot)}</span>
                    </div>
                  </div>;})}
              </div>
              <div style={{border:`2px solid ${active.items.length>0?T.ok:active.req?T.err:T.border}`,borderRadius:"0 0 10px 10px",borderTop:"none",background:"#fff",marginBottom:12}}>
                <div style={{padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.borderLight}`,background:"#fafbfc"}}>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:12,color:T.textMut}}>{active.items.length} items · <strong style={{color:T.primary}}>{fmtKWD(active.items.reduce((s,i)=>s+(i.totalCost||0),0))}</strong></span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Select defaultValue="" onChange={e=>{const no=e.target.value;e.target.value="";if(!no)return;const m=tplMasters.find(t=>String(t.no)===no);if(!m)return;if(active.items.length&&!window.confirm("Start from Template "+m.no+" — "+m.name+"?\n\nThis replaces the current "+active.items.length+" item(s)."))return;active.setItems(m.items.map(it=>({code:it.code,name:it.name,uom:it.uom,qty:it.qty,unitCost:it.cost,totalCost:Number((it.qty*it.cost).toFixed(3)),tplNo:m.no,uoms:[{unit:it.uom,cost:it.cost,sale:it.sale}]})));}} style={{...inp,width:"auto",margin:0,fontSize:11,padding:"4px 8px"}}>
                  <option value="">Start from master template…</option>
                  {tplMasters.filter(t=>t.type===(active.k.indexOf("Drugs")>-1?2:1)).sort((a,b)=>(b.ward?1:0)-(a.ward?1:0)||Number(a.no)-Number(b.no)).map(t=><option key={t.no} value={t.no}>{t.ward?"Ward · ":""}No {t.no} — {t.name.slice(0,28)} ({t.items.length})</option>)}
                </Select>
                <span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600,color:T.primary}}><Ic n={active.icon} s={12}/> {active.t}</span>
              </div>
                </div>
                <div style={{padding:12}}>
                  <GroupedTemplateBuilder items={active.items} setItems={active.setItems} master={active.master} categories={categories}/>
                </div>
              </div>
              {grandTotal>0&&<div style={{padding:"12px 16px",background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",borderRadius:8,border:`2px solid ${T.ok}40`,marginBottom:8}}>
                <div style={{fontSize:10,color:T.ok,fontWeight:700,textTransform:"uppercase",letterSpacing:0.4,marginBottom:6}}>All Templates Total (Proc + Wards)</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr) auto",gap:8,alignItems:"center"}}>
                  {tCards.map(c=>{const tot=c.items.reduce((s,i)=>s+(i.totalCost||0),0);return<div key={c.k} style={{padding:"4px 8px",fontSize:10}}><div style={{color:T.textMut,display:"flex",alignItems:"center",gap:4}}><Ic n={c.icon} s={10}/>{c.t}</div><div style={{fontSize:12,fontWeight:700,color:tot>0?T.primary:T.textMut}}>{fmtKWD(tot)}</div></div>;})}
                  <div style={{padding:"6px 14px",background:T.ok,borderRadius:6,color:"#fff",textAlign:"right"}}><div style={{fontSize:9,opacity:0.9}}>GRAND TOTAL</div><div style={{fontSize:15,fontWeight:800}}>{fmtKWD(grandTotal)}</div></div>
                </div>
              </div>}
              <div style={{padding:12,background:"#eff6ff",borderRadius:6,fontSize:11,color:T.info,marginTop:8}}>When you're ready, submit from the <strong>action bar below</strong>. LOS & Services validation lives on the Overview tab.</div>
            </div>;
          })()}
        </div>
      :
        // READ-ONLY MODE - everyone else
        <div>
          {(p.templates.procCons.length>0||p.templates.procDrugs.length>0||p.templates.wardsCons.length>0||p.templates.wardsDrugs.length>0)?
            <Card style={{marginBottom:14,padding:20}}>
              <ST style={{fontSize:15,marginBottom:14}}>OT Templates (Doctor Preference Cards)</ST>
              <TemplateSummary templates={p.templates} defaultExpand/>
            </Card>
            :<Card style={{marginBottom:14,padding:28,textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><Ic n="clipboard" s={28} sw={1.6} style={{color:T.textMut}}/></div>
              <div style={{fontSize:13,fontWeight:700,color:T.text}}>Templates not built yet</div>
              <div style={{fontSize:11.5,color:T.textSec,marginTop:4}}>The Nursing Manager builds the OT templates at Stage 4 — this tab will populate once submitted.</div>
            </Card>}
          {p.status==="approved"&&<Card style={{marginBottom:14,padding:14,background:"#eff6ff",border:`1px solid ${T.info}30`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <Ic n="lock" s={17}/>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:T.info}}>Approved & Active — Templates are locked</div>
                <div style={{fontSize:11,color:T.textSec,marginTop:2}}>To modify approved templates, submit an Edit Request which will create a new version.</div>
              </div>
            </div>
            <button disabled={!!openReq} title={openReq?openReq.id+" is in approval":""} onClick={()=>{startEdit();setTab("templates");}} style={{padding:"8px 14px",borderRadius:6,border:`2px solid ${T.warn}`,background:"#fffbeb",color:T.warn,fontSize:11,fontWeight:600,cursor:"pointer"}}>✎ Request Edit</button>
          </Card>}
        </div>
      }
    </div>}
    {tabView==="financial"&&!(canActNow&&actionTab==="financial")&&<div>
      {false&&<Card style={{marginBottom:14,padding:14,background:"#fffbeb",border:`2px solid ${T.warn}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Ic n="pencil" s={17}/>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:T.warn}}>You have edit authority — financial entry is in the action panel</div>
            <div style={{fontSize:11,color:T.textSec,marginTop:2}}>{p.currentStage===10?"Per-row standard costs and patient price input require the action panel.":"CEO price adjustment is in the action panel."} Click below to go there.</div>
          </div>
        </div>
        <button onClick={()=>{setTab("overview");setTimeout(scrollToAction,200);}} style={{padding:"8px 14px",borderRadius:6,border:"none",background:T.warn,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>Go to Edit Panel</button>
      </Card>}
      {editFlow&&editFlow.all&&<Card style={{marginBottom:14,padding:"12px 16px",background:"#fff7ed",border:"1px solid #fed7aa",fontSize:12,color:"#9a3412"}}><strong>Editing the Financials.</strong> These are the same FCD and CEO values approved on the package. A change to the costing or the price re-runs the approval stages; the doctor &amp; revenue terms route as their own scenario (Fees). Nothing is saved until you submit.</Card>}
      {p.financial&&p.financial.ceoAdjustedPrice&&<div style={{marginBottom:14,padding:"10px 14px",borderRadius:8,background:"#fffbeb",border:"1px solid #fde68a",fontSize:12,color:"#92400e"}}>⚠ <strong>The CEO changed the patient price</strong> — {Number(p.financial.ceoAdjustedPrice)>Number(p.financial.cfoPrice||0)?"an increase":"a decrease"} recorded by {p.financial.ceoBy||"the CEO"}{p.financial.ceoDate?" on "+fmtDateTime(p.financial.ceoDate):""} (version {p.version||1}). Both figures are below; the margin has been recalculated. <strong>No acknowledgement is needed</strong> — this is for your information.</div>}
      {p.financial?<><FinCards fin={p.financial} efEdit={efEdit} stage={p.currentStage}/>
        {p.financial.ceoAdjustedPrice&&<Card style={{padding:"14px 18px",marginBottom:14}}><div style={{fontSize:10.5,fontWeight:800,letterSpacing:0.6,color:T.textSec,marginBottom:10}}>PRICE HISTORY ON THIS VERSION</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>{[["Set by the CFO (FCD)",p.financial.cfoPrice],["Approved by the CEO",p.financial.ceoAdjustedPrice]].map(([l,v])=><div key={l} style={{borderLeft:`3px solid ${T.border}`,paddingLeft:12}}><div style={{fontSize:10,color:T.textMut}}>{l}</div><div style={{fontSize:16,fontWeight:700,color:T.text}}>{fmtKWD(v)}</div></div>)}</div></Card>}</>:(()=>{const all=[...(p.templates.procCons||[]),...(p.templates.wardsCons||[]),...(p.templates.procDrugs||[]),...(p.templates.wardsDrugs||[])];const tc=all.reduce((x,i)=>x+(i.totalCost||0),0);
        const tile=(l,v,on)=><div style={{padding:"12px 16px",background:on?"#f0fdf4":"#f8fafc",borderLeft:`3px solid ${on?T.ok:"#cbd5e1"}`,borderRadius:6}}><div style={{fontSize:10,color:T.textMut,fontWeight:600}}>{l}</div><div style={{fontSize:17,fontWeight:700,color:on?T.ok:T.textMut,marginTop:2}}>{v}</div></div>;
        return <Card style={{padding:24}}>
          <ST style={{fontSize:16,color:T.primary,marginBottom:6}}>Not costed yet</ST>
          <p style={{fontSize:12,color:T.textSec,margin:"0 0 16px",lineHeight:1.6}}>The CFO enters the full costing at the <strong>Financials (FCD)</strong> stage — service and LOS standard costs, any additional services, and the final patient price. The CEO reviews the price at the stage after. Until then this package has template costs only.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>{tile("Template costs","KWD "+tc.toFixed(3),true)}{tile("Service costs","Pending")}{tile("Patient price","Pending")}</div>
        </Card>;})()}</div>}
    {tabView==="system"&&!(canActNow&&actionTab==="system")&&!(editFlow&&editFlow.all)&&(()=>{const ss=p.systemSetup||{};
      const box=(l,v,ic)=><div style={{padding:"14px 16px",border:`1px solid ${T.border}`,borderLeft:`3px solid ${T.primary}`,borderRadius:8,background:"#fff"}}><div style={{display:"flex",alignItems:"center",gap:6,fontSize:10.5,fontWeight:700,color:T.textSec,textTransform:"uppercase",letterSpacing:0.4}}><Ic n={ic||"fileText"} s={11}/>{l}</div><div style={{fontSize:14,fontWeight:600,color:v?T.text:T.textMut,marginTop:4}}>{v||"—"}</div></div>;
      const yn=(l,v)=><div style={{padding:"12px 16px",border:`1px solid ${T.border}`,borderLeft:"3px solid #cbd5e1",borderRadius:8}}><div style={{fontSize:10.5,fontWeight:700,color:T.textSec,textTransform:"uppercase",letterSpacing:0.4}}>{l}</div><div style={{fontSize:14,fontWeight:600,color:v==="Yes"?T.ok:T.textSec,marginTop:4}}>{v==="Yes"?"Yes":"No"}</div></div>;
      const tp=(l,v)=><div style={{padding:"10px 12px",background:"#f8fafc",borderRadius:6}}><div style={{fontSize:10.5,fontWeight:600,color:T.textSec}}>{l}</div><div style={{fontSize:13,fontWeight:600,color:T.text,marginTop:2}}>{v||"—"}</div></div>;
      const sub={fontSize:11,fontWeight:700,color:T.textSec,textTransform:"uppercase",letterSpacing:0.5,margin:"18px 0 8px"};
      return <Card style={{padding:24}}>
        <ST style={{fontSize:16,color:T.primary,marginBottom:4}}>PrimeCare system setup</ST>
        <p style={{fontSize:12,color:T.textSec,margin:"0 0 14px"}}>The identifiers this package carries in PrimeCare. A linked code is <strong>permanent</strong> — it is the join between the two systems, and changing it here would leave PrimeCare pointing at one package and this record claiming another.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>{box("Operation code",ss.opCode)}{box("Operation name",ss.opName)}{box("PKGID",ss.pkgId,"building")}{box("Package name",ss.pkgName||(ss.pkgId?(p.accurateCptName||p.proposedCptName):""))}</div>
        <div style={sub}>Linking</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>{yn("Linked to CPT",ss.linkedToCpt&&ss.opCode?ss.linkedToCpt:"No")}{yn("Linked to package",ss.linkedToPkg&&ss.pkgId?ss.linkedToPkg:"No")}{yn("Added on system",ss.addedOnSystem&&ss.pkgId?ss.addedOnSystem:"No")}</div>
        <div style={sub}>Linked OT templates</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>{tp("Procedure Consumables",ss.procConsTemplate)}{tp("Wards Consumables",ss.wardsConsTemplate)}{tp("Procedure Drugs",ss.procDrugsTemplate)}{tp("Wards Drugs",ss.wardsDrugsTemplate)}</div>
        <div style={{marginTop:14,padding:"10px 14px",borderRadius:6,fontSize:12,background:ss.linkingCompleted==="Yes"?"#f0fdf4":"#fef9c3",color:ss.linkingCompleted==="Yes"?T.ok:"#854d0e"}}><strong>Template linking:</strong> {ss.linkingCompleted==="Yes"?"Completed on live":"Pending — the CSCM links the templates at stage 14"}</div>
      </Card>;})()}
    {tabView==="system"&&!(canActNow&&actionTab==="system")&&editFlow&&editFlow.all&&<div>
      {false?  /* editing moved to the Your Action tab */
        // EDITABLE MODE - inline editing
        <div>
          <Card style={{marginBottom:14,padding:14,background:"#f8fafc",border:`1px solid ${T.border}`,borderLeft:`3px solid ${T.warn}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Ic n="pencil" s={17}/>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:T.warn}}>Edit Mode — You can modify System Setup directly here</div>
                  <div style={{fontSize:11,color:T.textSec,marginTop:2}}>{p.currentStage===12?"As CSCM, fill Operation Code & Name. Auto-saves as you type.":p.currentStage===13?"As CFO, fill PKGID & confirm price on system. Auto-saves as you type.":"As CSCM, fill 4 OT template codes on PrimeCare. Auto-saves as you type."}</div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:T.ok,background:"#f0fdf4",padding:"4px 10px",borderRadius:12,border:`1px solid ${T.ok}30`}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:T.ok,display:"inline-block",animation:"fadeIn 1s infinite alternate"}}></span>
                <span style={{fontWeight:600}}>Auto-saving</span>
              </div>
            </div>
          </Card>

          {/* Stage 12 — CSCM Operation Code Setup */}
          {p.currentStage===12&&<Card style={{padding:20,marginBottom:14}}>
            <ST style={{fontSize:14,color:T.primary,marginBottom:12}}>🔢 PrimeCare Operation Setup (Stage 12 — CSCM)</ST>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div><label style={lbl}>Operation Code <span style={{color:T.err}}>*</span></label><input style={inp} value={cscmOpCode} onChange={e=>setCscmOpCode(e.target.value)} placeholder="e.g. 10803025"/></div>
              <div style={{gridColumn:"1 / -1"}}><label style={lbl}>Operation Name <span style={{color:T.err}}>*</span></label><input style={{...inp,padding:"10px 12px",fontSize:13}} value={cscmOpName} onChange={e=>setCscmOpName(e.target.value)} placeholder="e.g. Total Knee Replacement Surgery — full name, names are usually lengthy"/></div>
              <div><label style={lbl}>Linked to CPT?</label><Select style={inp} value={cscmLinked} onChange={e=>setCscmLinked(e.target.value)}><option>Yes</option><option>No</option></Select></div>
              <div><label style={lbl}>CPT Code (Reference)</label><input style={{...inp,background:"#f8fafc",cursor:"not-allowed"}} value={p.accurateCptCode||p.proposedCptCode||"—"} disabled/></div>
            </div>
            <div style={{padding:12,background:"#eff6ff",borderRadius:6,fontSize:11,color:T.info}}>💡 When ready to submit, go to <strong>Overview tab</strong> → action panel → click <strong>Approve</strong>. Don't forget to attach proof.</div>
          </Card>}

          {/* Stage 13 — CFO Package Setup */}
          {p.currentStage===13&&<Card style={{padding:20,marginBottom:14}}>
            <ST style={{fontSize:14,color:T.primary,marginBottom:12}}>PrimeCare Package Setup (Stage 13 — CFO)</ST>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div><label style={lbl}>Created PKGID <span style={{color:T.err}}>*</span></label><input style={inp} value={pkgId} onChange={e=>setPkgId(e.target.value)} placeholder="e.g. 56"/></div>
              <div><label style={lbl}>Linked to Package? — Both branches?</label><Select style={inp} value={pkgLinked} onChange={e=>setPkgLinked(e.target.value)}><option>Yes</option><option>No</option></Select></div>
              <div><label style={lbl}>Added on System?</label><Select style={inp} value={pkgAdded} onChange={e=>setPkgAdded(e.target.value)}><option>Yes</option><option>No</option></Select></div>
              <div><label style={lbl}>Maximum CAP Limit (from FCD)</label><input readOnly style={{...inp,background:"#f8fafc"}} value={p.financial?.hasCap==="Yes"?`KWD ${p.financial.capLimit}`:(p.financial?.hasCap==="No"?"No CAP":"—")}/></div>
              <div><label style={lbl}>Applied Maximum CAP Limit in both branches? <span style={{color:T.err}}>*</span></label><Select style={inp} value={pkgCapBoth} onChange={e=>setPkgCapBoth(e.target.value)}><option value="">Select...</option><option>Yes</option><option>No — single branch</option><option>Not applicable</option></Select></div>
              <div><label style={lbl}>Operation Code (from CSCM)</label><input style={{...inp,background:"#f8fafc",cursor:"not-allowed"}} value={p.systemSetup?.opCode||"—"} disabled/></div>
            </div>
            <div style={{padding:12,background:"#eff6ff",borderRadius:6,fontSize:11,color:T.info}}>💡 When ready to submit, go to <strong>Overview tab</strong> → action panel → click <strong>Approve</strong>. Don't forget to attach price list proof.</div>
          </Card>}

          {/* Stage 14 — CSCM Template Linking */}
          {p.currentStage===14&&<Card style={{padding:20,marginBottom:14}}>
            <ST style={{fontSize:14,color:T.primary,marginBottom:12}}>PrimeCare Template Linking (Stage 14 — CSCM)</ST>
            <div style={{fontSize:11,color:T.textSec,marginBottom:12}}>Enter the template codes you created on live PrimeCare for each of the 4 OT template types.</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div><label style={lbl}>Procedure Consumables Template <span style={{color:T.err}}>*</span></label><input style={inp} value={tlPC} onChange={e=>setTlPC(e.target.value)} placeholder="e.g. TMPL-PC-001"/></div>
              <div><label style={lbl}>Wards Consumables Template</label><input style={inp} value={tlWC} onChange={e=>setTlWC(e.target.value)} placeholder="e.g. TMPL-WC-001"/></div>
              <div><label style={lbl}>Procedure Drugs Template <span style={{color:T.err}}>*</span></label><input style={inp} value={tlPD} onChange={e=>setTlPD(e.target.value)} placeholder="e.g. TMPL-PD-001"/></div>
              <div><label style={lbl}>Wards Drugs Template</label><input style={inp} value={tlWD} onChange={e=>setTlWD(e.target.value)} placeholder="e.g. TMPL-WD-001"/></div>
            </div>
            <div style={{padding:12,background:"#eff6ff",borderRadius:6,fontSize:11,color:T.info}}>💡 When ready to submit, go to <strong>Overview tab</strong> → action panel → click <strong>Approve</strong>. Single attachment proof for all 4 templates.</div>
          </Card>}

          {/* Show what's already filled (read-only summary) */}
          {p.systemSetup&&<Card style={{padding:20}}>
            <ST style={{fontSize:13,color:T.textSec,marginBottom:10}}>Already Filled (Previous Stages)</ST>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 24px"}}>
              {[{l:"Operation Code",v:p.systemSetup.opCode},{l:"Operation Name",v:p.systemSetup.opName},
                {l:"Linked to CPT",v:p.systemSetup.linkedToCpt},{l:"PKGID",v:p.systemSetup.pkgId},
                {l:"Linked to Package",v:p.systemSetup.linkedToPkg},{l:"Added on System",v:p.systemSetup.addedOnSystem}
              ].filter(x=>x.v).map((it,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.borderLight}`}}>
                <span style={{fontSize:11,color:T.textSec}}>{it.l}</span>
                <span style={{fontSize:11,fontWeight:600,color:T.text}}>{it.v}</span>
              </div>)}
            </div>
          </Card>}
        </div>
      :
        // READ-ONLY MODE
        <div>
          {p.systemSetup?<Card style={{padding:20}}>
            <ST style={{fontSize:14,color:T.primary,marginBottom:14}}>PrimeCare System Setup</ST>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:14}}>
              {[{l:"Operation Code",v:p.systemSetup.opCode,c:T.primary,icon:"fileText"},
                {l:"Operation Name",v:p.systemSetup.opName,c:T.primary,icon:"filePen"},
                {l:"PKGID",v:p.systemSetup.pkgId,c:T.ok,icon:"layers"},
                {l:"Linked to CPT",v:p.systemSetup.linkedToCpt,c:T.info,icon:"forward"}].map((f,i)=>
                <div key={i} style={{padding:"12px 14px",background:"#fff",borderRadius:8,borderLeft:`3px solid ${f.c}`,border:`1px solid ${T.borderLight}`}}>
                  <div style={{fontSize:9,color:T.textMut,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>{f.icon} {f.l}</div>
                  {(EFK_SYS[f.l]&&efEdit(EFK_SYS[f.l]))||<div style={{fontSize:13,fontWeight:700,color:f.c}}>{f.v||"—"}</div>}
                </div>)}
            {(efFields.includes("pkgName")||efFields.includes("templateNumbers"))&&<div style={{display:"flex",gap:20,flexWrap:"wrap",marginTop:12,paddingTop:12,borderTop:`1px solid ${T.borderLight}`}}>
              {efFields.includes("pkgName")&&<div style={{display:"flex",flexDirection:"column",gap:4}}><span style={{fontSize:10,color:T.textMut,fontWeight:600}}>Package Name</span>{efEdit("pkgName")}</div>}
              {efFields.includes("templateNumbers")&&<div style={{display:"flex",flexDirection:"column",gap:4}}><span style={{fontSize:10,color:T.textMut,fontWeight:600}}>Template Numbers</span>{efEdit("templateNumbers")}</div>}
            </div>}
            </div>
            {p.systemSetup.procConsTemplate&&<div style={{paddingTop:12,borderTop:`1px solid ${T.borderLight}`}}>
              <div style={{fontSize:10,color:T.textMut,fontWeight:700,marginBottom:8,textTransform:"uppercase"}}>LINKED OT TEMPLATES</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
                {[{l:"Proc. Consumables",v:p.systemSetup.procConsTemplate},{l:"Wards Consumables",v:p.systemSetup.wardsConsTemplate},{l:"Proc. Drugs",v:p.systemSetup.procDrugsTemplate},{l:"Wards Drugs",v:p.systemSetup.wardsDrugsTemplate}].map((f,i)=>
                  <div key={i} style={{padding:"8px 10px",background:"#f8fafc",borderRadius:6,fontSize:11}}>
                    <div style={{fontSize:9,color:T.textMut,fontWeight:600,marginBottom:2}}>{f.l}</div>
                    <div style={{fontSize:11,fontWeight:600,color:T.text}}>{f.v||"—"}</div>
                  </div>)}
              </div>
            </div>}
          </Card>:<Card style={{textAlign:"center",padding:40,color:T.textMut}}>Awaiting CSCM/CFO stages</Card>}
        </div>
      }
    </div>}
    {tabView==="attachments"&&<Card style={{padding:24}}>
      <ST style={{fontSize:15,color:T.primary,marginBottom:4}}>Attachments</ST>
      <p style={{fontSize:12,color:T.textSec,margin:"0 0 14px"}}>Anyone in the approval chain can attach documents at any step — society protocols, insurance approvals, quotations. Attachments stay with the request and travel through every approval.</p>
      {(p.attachments||[]).length===0&&<div style={{fontSize:12,color:T.textMut,fontStyle:"italic",marginBottom:12}}>No documents attached.</div>}
      {(p.attachments||[]).map((f,i)=>{const mt=typeof f==="string"?{}:f;return <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 4px",borderBottom:`1px solid ${T.borderLight}`}}>
        <Ic n="fileText" s={14} style={{color:T.textMut}}/><span style={{flex:1,fontSize:13,color:T.primary,cursor:"pointer"}}>{attName(f)}</span>
        <span style={{fontSize:10.5,fontWeight:700,color:T.ok,background:"#ecfdf5",borderRadius:10,padding:"2px 9px"}}>{mt.kind||"Supporting document"}</span>
        <span style={{fontSize:11,color:T.textMut}}>attached at {(mt.step||"Doctor Request").replace(/^Stage \d+ — /,"")}{mt.date?" · "+fmtDateTime(mt.date):""}</span>
      </div>;})}
      {role!=="doctor"&&!["approved","rejected"].includes(p.status)&&<div style={{marginTop:14}}><AttachmentBox step={STAGES.find(s=>s.num===p.currentStage)?.label||("Stage "+p.currentStage)} by={me.name} lockExisting existingCount={(p.attachments||[]).length} files={p.attachments||[]} onChange={files=>onAction(p,"attach",{actionLabel:"Attachment updated",attachments:files})}/></div>}
    </Card>}
    {/* REQUESTED DOCUMENTS TAB (#10) */}
    {tabView==="reqdocs"&&<Card style={{padding:24}}>
      <ST style={{fontSize:13}}>Requested Documents</ST>
      <p style={{fontSize:11,color:T.textSec,margin:"0 0 14px"}}>Documents asked for by someone in the approval chain. A request stays open until it is provided or marked unavailable — {docsPending} outstanding.</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {reqDocs.map(d=>{const st=DOC_STATUS[d.status]||DOC_STATUS.pending;
          return <div key={d.id} style={{border:`1px solid ${T.border}`,borderLeft:`4px solid ${st.c}`,borderRadius:8,padding:14,background:st.bg}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:220}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontSize:13,fontWeight:700,color:T.text}}>{d.type}</span>
                  <Badge color={st.c}><Ic n={st.icon} s={10} style={{verticalAlign:"-1px"}}/> {st.label}</Badge>
                  <span style={{fontSize:9,color:T.textMut}}>{d.id}</span>
                </div>
                <div style={{fontSize:10,color:T.textMut}}>Requested by {d.by} ({d.role}) · {fmtDate(d.date)}{d.notify?` · notify: ${d.notify.name}`:""}</div>
                {d.note&&<div style={{fontSize:11,color:T.text,marginTop:6,padding:"6px 10px",background:"#fff",borderRadius:4,borderLeft:`3px solid ${T.info}`,fontStyle:"italic"}}>"{d.note}"</div>}
                {d.status==="provided"&&<div style={{marginTop:8}}>
                  <div style={{fontSize:10,color:T.textMut,marginBottom:3}}>Provided by {d.providedBy} · {fmtDate(d.providedDate)}</div>
                  {(d.files||[]).map((f,i)=><span key={i} style={{display:"inline-block",fontSize:11,padding:"3px 9px",marginRight:6,background:"#fff",border:`1px solid ${T.ok}40`,borderRadius:10,color:T.ok}}>{attName(f)}</span>)}
                </div>}
                {d.status==="not_provided"&&<div style={{fontSize:11,color:T.textSec,marginTop:6}}>Marked unavailable by {d.providedBy} — "{d.naReason}"</div>}
              </div>
              {d.status==="pending"&&<div style={{minWidth:250}}>
                <AttachmentBox files={drFiles[d.id]||[]} onChange={fs=>setDrFiles({...drFiles,[d.id]:fs})}/>
                <div style={{display:"flex",gap:6,marginTop:8,justifyContent:"flex-end"}}>
                  <button onClick={()=>setDrNa(d.id)} style={{padding:"6px 12px",borderRadius:5,border:`1px solid ${T.border}`,background:"#fff",color:T.textSec,fontSize:11,fontWeight:600,cursor:"pointer"}}>Mark unavailable</button>
                  <button onClick={()=>{const fs=drFiles[d.id]||[];if(fs.length===0){alert("Attach the document first");return;}onAction(p,"doc_fulfil",{actionLabel:`${d.type} provided (${fs.length} file${fs.length===1?"":"s"})`,docId:d.id,files:fs,by:me.name,date:new Date().toISOString().slice(0,10)});setDrFiles({...drFiles,[d.id]:[]});}} style={{padding:"6px 12px",borderRadius:5,border:"none",background:T.ok,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>✓ Provide</button>
                </div>
              </div>}
            </div>
          </div>;})}
        {reqDocs.length===0&&<div style={{fontSize:12,color:T.textMut,textAlign:"center",padding:24}}>📭 No documents requested — use <strong>Request Document</strong> in the header to ask for one.</div>}
      </div>
    </Card>}

    {tabView==="timeline"&&<Card style={{padding:24}}>
      <ST style={{fontSize:16,color:T.primary}}>Activity timeline <span style={{fontSize:11,fontWeight:400,color:T.textMut}}>(newest first)</span></ST>
      {p.timeline.slice().reverse().map((t2,i)=>{const dotC=t2.type==="approve"||t2.type==="complete"||t2.type==="acknowledge"?T.ok:t2.type==="reject"?T.err:t2.type==="warning"?T.warn:t2.type==="forward"?T.purple:t2.type==="route"?T.info:T.textMut;
        const emoji=t2.type==="create"?"✎":t2.type==="approve"||t2.type==="complete"?"✓":t2.type==="acknowledge"?"★":t2.type==="reject"?"✕":t2.type==="forward"?"→":t2.type==="route"?"↓":t2.type==="warning"?"⚠":"→";
        return<div key={i} style={{display:"flex",gap:12}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:dotC+"15",color:dotC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,border:`2px solid ${dotC}30`}}>{emoji}</div>
            {i<p.timeline.length-1&&<div style={{width:2,flex:1,background:dotC+"20",minHeight:20}}/>}
          </div>
          <div style={{paddingBottom:12,flex:1}}>
            <div style={{fontSize:13,fontWeight:600,color:T.text}}>{t2.action}</div>
            {t2.comment&&<div style={{margin:"5px 0 3px",padding:"5px 12px",background:"#f8fafc",borderLeft:`2px solid ${T.border}`,fontSize:11.5,fontStyle:"italic",color:T.textSec}}>“{t2.comment}”</div>}
            <div style={{fontSize:11,color:T.textMut}}>{t2.user} · {fmtDateTime(t2.date)} · V{t2.ver||p.version||1}</div>
          </div>
        </div>;})}
    </Card>}
    {tabView==="versions"&&<Card style={{padding:24}}>
      <ST style={{fontSize:16,color:T.primary,marginBottom:4}}>Version history</ST>
      <p style={{fontSize:12,color:T.textSec,margin:"0 0 14px"}}>Every approved change — financial or non-financial — creates a new version, and each carries its own certificate. The current record is version <strong>V{p.version||1}</strong>. A certificate is filed and emailed by the system shortly after the final acknowledgement.</p>
      <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.primaryLight}}>
        {["Version","Date","Change","Changed by","Summary","Certificate"].map(h=><th key={h} style={{padding:"10px 12px",fontSize:10.5,fontWeight:800,color:T.textSec,textTransform:"uppercase",letterSpacing:0.4,textAlign:"left"}}>{h}</th>)}
      </tr></thead><tbody>
        {(p.versionHistory||[]).slice().reverse().map((v,i)=>{const cur=v.version===(p.version||1);const issued=p.status==="approved"||!cur;return <tr key={i} style={{borderBottom:`1px solid ${T.borderLight}`}}>
          <td style={{padding:"10px 12px"}}><Badge color={T.ok}>V{v.version}</Badge>{cur&&<span style={{fontSize:10.5,color:T.textMut,marginLeft:8}}>current</span>}</td>
          <td style={{padding:"10px 12px",fontSize:12}}>{fmtDateTime(v.date)}</td>
          <td style={{padding:"10px 12px",fontSize:12}}>{v.change||(v.version===1?"Request raised":"Edit")}</td>
          <td style={{padding:"10px 12px",fontSize:12}}>{v.changedBy}</td>
          <td style={{padding:"10px 12px",fontSize:12}}>{v.summary==="New procedure request"?"Request raised":v.summary}</td>
          <td style={{padding:"10px 12px",fontSize:11}}>{issued?<span onClick={()=>{setCertVer(v.version);setTab("cert");}} style={{color:T.primary,fontWeight:600,cursor:"pointer"}}>View certificate →</span>:<span style={{color:T.textMut}}>issued once this version completes approval</span>}</td>
        </tr>;})}
      </tbody></table>
    </Card>}

    {/* ═══ CERTIFICATE — one per version (E4) ═══ */}
    {tabView==="cert"&&(p.versionHistory||[]).length>1&&<Card style={{marginBottom:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
      <span style={{fontSize:12,fontWeight:600,color:T.text}}>Certificate for version:</span>
      <Select style={{...inp,width:220}} value={certVer} onChange={e=>setCertVer(Number(e.target.value))}>
        {p.versionHistory.map(v=><option key={v.version} value={v.version}>V{v.version} — {fmtDate(v.date)}{v.version===p.version?" (current)":""}</option>)}
      </Select>
      {certVer!==p.version&&<span style={{fontSize:10,color:T.textMut}}>Showing an earlier version's certificate summary.</span>}
    </Card>}
    {tabView==="cert"&&certVer!==p.version&&(()=>{const v=(p.versionHistory||[]).find(x=>x.version===certVer)||{};
      return <Card style={{border:`2px solid ${T.border}`,marginBottom:16}}>
        <div style={{textAlign:"center",padding:"20px 40px"}}>
          <img src={LOGO} alt={APP.orgFull} style={{height:56,width:"auto",display:"block",margin:"0 auto 14px"}}/>
          <div style={{fontSize:18,fontWeight:700,color:T.primary,marginBottom:4}}>Procedure Package Certificate</div>
          <div style={{fontSize:11,color:T.textSec,marginBottom:16}}>Certificate No: {p.id}-CERT-V{v.version}</div>
          <div style={{textAlign:"left",padding:"16px 24px",background:"#fff",borderRadius:6,border:`1px solid ${T.border}`}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 20px",fontSize:12}}>
              <div><span style={{color:T.textMut}}>Version:</span> <strong>V{v.version}</strong></div>
              <div><span style={{color:T.textMut}}>Date:</span> <strong>{fmtDate(v.date)}</strong></div>
              <div><span style={{color:T.textMut}}>Changed by:</span> <strong>{v.changedBy}</strong></div>
              <div style={{gridColumn:"1/-1"}}><span style={{color:T.textMut}}>Summary:</span> {v.summary}</div>
            </div>
          </div>
          <div style={{fontSize:9,color:T.textMut,marginTop:12}}>Each version has its own certificate. The full snapshot for a past version is retained in production; a summary is shown here.</div>
        </div>
      </Card>;})()}
    {tabView==="cert"&&certVer===p.version&&(()=>{
      const ss2=p.systemSetup||{};const fin=p.financial||{};
      const tpl=p.templates||{};
      const tplRows=[{k:"procCons",l:"Procedure Consumables",no:ss2.procConsTemplate},{k:"wardsCons",l:"Wards Consumables",no:ss2.wardsConsTemplate},{k:"procDrugs",l:"Procedure Drugs",no:ss2.procDrugsTemplate},{k:"wardsDrugs",l:"Wards Drugs",no:ss2.wardsDrugsTemplate}]
        .map(r=>{const its=tpl[r.k]||[];return{...r,count:its.length,cost:its.reduce((s,i)=>s+(i.totalCost||0),0)};});
      const tplTotal=tplRows.reduce((s,r)=>s+r.cost,0);
      // Digital approval chain — every decision recorded on the request
      const sigs=(p.timeline||[]).filter(t=>["approve","acknowledge","complete"].includes(t.type)&&((t.ver||1)===certVer));
      const isDeact=p.lifecycle==="Deactivated";
      const vColor=isDeact?T.err:T.ok;const vBg=isDeact?"#fffafa":"#fafffe";
      const price=Number(fin.finalPatientPrice||0);const cost=Number(fin.totalOverallCost||0);
      const margin=cost>0?(((price-cost)/cost)*100):null;
      return <div>
        <Card style={{border:`2px solid ${vColor}`,background:vBg,marginBottom:16}}>
          <div style={{textAlign:"center",padding:"20px 40px"}}>
            <img src={LOGO} alt={APP.orgFull} style={{height:56,width:"auto",display:"block",margin:"0 auto 14px"}}/>
            <div style={{fontSize:18,fontWeight:700,color:T.primary,marginBottom:4}}>Procedure Package Certificate</div>
            <div style={{fontSize:11,color:T.textSec,marginBottom:20}}>Certificate No: {p.id}-CERT-V{p.version}</div>

            {/* Package details */}
            <div style={{textAlign:"left",padding:"16px 24px",background:"#fff",borderRadius:6,border:`1px solid ${T.border}`,marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,color:T.textSec,marginBottom:8}}>Package Details</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 20px",fontSize:12}}>
                <div><span style={{color:T.textMut}}>Procedure ID:</span> <strong>{p.id}</strong></div>
                <div><span style={{color:T.textMut}}>Request Date:</span> <strong>{fmtDate(p.requestDate)}</strong></div>
                <div><span style={{color:T.textMut}}>Branch:</span> <strong>{(BRANCHES.find(b=>b.code===p.branch)||{}).name||p.branch}</strong></div>
                <div><span style={{color:T.textMut}}>Specialty:</span> <strong>{p.specialty||"—"}</strong></div>
                <div><span style={{color:T.textMut}}>Requestor:</span> <strong>{p.requestor?.name||"—"}</strong></div>
                <div><span style={{color:T.textMut}}>CPT Status:</span> <strong>{p.cptStatus||"—"}</strong></div>
                <div><span style={{color:T.textMut}}>CPT Code:</span> <strong style={{color:T.primary}}>{p.accurateCptCode||p.proposedCptCode||"—"}</strong></div>
                <div><span style={{color:T.textMut}}>CPT Name:</span> <strong>{p.accurateCptName||p.proposedCptName||"—"}</strong></div>
                <div><span style={{color:T.textMut}}>Duration:</span> <strong>{p.procedureDuration||"—"}</strong></div>
                <div><span style={{color:T.textMut}}>Accommodation:</span> <strong>{p.accommodationDays!=null?`${p.accommodationDays} day(s)`:"—"}</strong></div>
              </div>
            </div>

            {/* Outcome */}
            <div style={{textAlign:"left",padding:"16px 24px",background:"#fff",borderRadius:6,border:`2px solid ${vColor}`,marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,color:T.textSec,marginBottom:10,textTransform:"uppercase",letterSpacing:0.5}}>Package Outcome</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:10,flexWrap:"wrap"}}>
                <Ic n={isDeact?"ban":"check"} s={26} sw={2.4} style={{color:isDeact?T.err:T.ok}}/>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:18,fontWeight:700,color:vColor}}>{isDeact?"DEACTIVATED":"APPROVED & ACKNOWLEDGED"}</div>
                  <div style={{fontSize:11,color:T.textSec,marginTop:2}}>{p.migrated?`Migrated from PrimeCare — costs as of ${(p.migrationMeta||{}).extractDate||"n/a"} · legacy paper approvals on file`:`Completed the full ${STAGES.length}-step approval chain · Live on PrimeCare`}</div>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                <span style={{fontSize:13,fontWeight:600,color:T.primary,padding:"4px 12px",background:T.primary+"15",borderRadius:4}}>Patient Price: {fmtKWD(fin.finalPatientPrice)}</span>
                <span style={{fontSize:13,fontWeight:600,color:T.textSec,padding:"4px 12px",background:"#f1f5f9",borderRadius:4}}>Total Cost: {fmtKWD(fin.totalOverallCost)}</span>
                {margin!=null&&<span style={{fontSize:13,fontWeight:600,color:margin>=30?T.ok:margin>=15?T.warn:T.err,padding:"4px 12px",background:(margin>=30?T.ok:margin>=15?T.warn:T.err)+"15",borderRadius:4}}>Margin: {margin.toFixed(1)}%</span>}
              </div>
            </div>

            {/* System setup & linking */}
            <div style={{textAlign:"left",padding:"16px 24px",background:"#fff",borderRadius:6,border:`1px solid ${T.border}`,marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,color:T.textSec,marginBottom:10}}>System Setup & PrimeCare Linking</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 20px",fontSize:12}}>
                <div><span style={{color:T.textMut}}>Operation Code:</span> <strong style={{color:T.primary}}>{ss2.opCode||"—"}</strong>{ss2.opLocked&&<span title="Linked & locked on PrimeCare" style={{marginLeft:6,fontSize:9,color:T.ok}}>🔗 locked</span>}</div>
                <div><span style={{color:T.textMut}}>Operation Name:</span> <strong>{ss2.opName||"—"}</strong></div>
                <div><span style={{color:T.textMut}}>PKGID:</span> <strong style={{color:T.primary}}>{ss2.pkgId||"—"}</strong>{ss2.pkgLocked&&<span title="Linked & locked on PrimeCare" style={{marginLeft:6,fontSize:9,color:T.ok}}>🔗 locked</span>}</div>
                <div><span style={{color:T.textMut}}>Added on System:</span> <strong>{ss2.addedOnSystem||"—"}</strong></div>
                <div><span style={{color:T.textMut}}>Linked to CPT:</span> <strong>{ss2.linkedToCpt||"—"}</strong></div>
                <div><span style={{color:T.textMut}}>Linked to Package:</span> <strong>{ss2.linkedToPkg||"—"}</strong></div>
                <div style={{gridColumn:"1/-1",padding:"8px 10px",background:ss2.linkingCompleted==="Yes"?T.ok+"15":"#fef3c7",borderRadius:4,marginTop:6,fontSize:11}}>
                  <span style={{color:T.textMut}}>Template Linking:</span> <strong style={{color:ss2.linkingCompleted==="Yes"?T.ok:"#92400e"}}>{ss2.linkingCompleted==="Yes"?"✓ Completed on live":"Pending"}</strong>
                </div>
              </div>
            </div>

            {/* OT templates summary — line detail is a separate report */}
            <div style={{textAlign:"left",padding:"16px 24px",background:"#fff",borderRadius:6,border:`1px solid ${T.border}`,marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,color:T.textSec,marginBottom:10}}>OT Templates — Summary</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
                  <th style={{textAlign:"left",padding:"6px 8px",fontSize:10,fontWeight:600,color:T.textSec}}>Template</th>
                  <th style={{textAlign:"left",padding:"6px 8px",fontSize:10,fontWeight:600,color:T.textSec}}>Template No.</th>
                  <th style={{textAlign:"center",padding:"6px 8px",fontSize:10,fontWeight:600,color:T.textSec}}>Items</th>
                  <th style={{textAlign:"right",padding:"6px 8px",fontSize:10,fontWeight:600,color:T.textSec}}>Total Cost</th>
                </tr></thead>
                <tbody>
                  {tplRows.map((r,i)=><tr key={i} style={{borderBottom:i<tplRows.length-1?`1px solid ${T.borderLight}`:"none"}}>
                    <td style={{padding:"8px",fontWeight:600}}>{r.l}</td>
                    <td style={{padding:"8px",color:T.textSec}}>{r.no||"—"}</td>
                    <td style={{padding:"8px",textAlign:"center",fontWeight:600}}>{r.count}</td>
                    <td style={{padding:"8px",textAlign:"right",fontWeight:600}}>{fmtKWD(r.cost)}</td>
                  </tr>)}
                  <tr style={{borderTop:`2px solid ${T.border}`,background:"#f8fafc"}}>
                    <td colSpan={3} style={{padding:"8px",fontWeight:700}}>Total Template Cost</td>
                    <td style={{padding:"8px",textAlign:"right",fontWeight:700,color:T.primary}}>{fmtKWD(tplTotal)}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{fontSize:9,color:T.textMut,marginTop:8}}>Item-level detail (template number, item, cost, sale, quantity, UOM) is issued as a separate template-detail report.</div>
            </div>

            {/* Digital approval chain */}
            <div style={{textAlign:"left",marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,color:T.textSec,marginBottom:8}}>Digital Approval Chain</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {sigs.map((s,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"10px 14px",background:"#fff",borderRadius:6,border:`1px solid ${T.border}`}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:T.ok+"15",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:12}}>{s.type==="acknowledge"?"★":s.type==="complete"?"⚙":"✓"}</span></div>
                  <div style={{flex:1,textAlign:"left"}}>
                    <div style={{fontSize:12,fontWeight:600}}>{s.user}</div>
                    <div style={{fontSize:10,color:T.textMut}}>{s.role}</div>
                    <div style={{fontSize:11,color:T.text,marginTop:4}}>{s.action}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <Badge color={T.ok}>✓ Confirmed</Badge>
                    <div style={{fontSize:9,color:T.textMut,marginTop:2}}>{s.date}</div>
                  </div>
                </div>)}
                {sigs.length===0&&<div style={{fontSize:11,color:T.textMut,textAlign:"center",padding:16}}>No digital signatures recorded</div>}
                {p.migrated&&<div style={{marginTop:12,textAlign:"left"}}>
                  <div style={{fontSize:10,fontWeight:800,letterSpacing:0.5,textTransform:"uppercase",color:T.textSec,marginBottom:6}}>Related people — legacy approvals</div>
                  {((p.migrationMeta||{}).relatedPeople||[]).length===0&&<div style={{fontSize:10.5,color:T.textMut}}>Not captured yet — complete the migration record on the Overview tab.</div>}
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{((p.migrationMeta||{}).relatedPeople||[]).map((rp,i3)=><span key={i3} style={{fontSize:11,fontWeight:600,color:T.primaryDark,background:T.primaryLight,borderRadius:8,padding:"3px 10px"}}>{rp.name}{rp.date?` · ${rp.date}`:""}</span>)}</div>
                </div>}
              </div>
            </div>

            {/* Notified parties */}
            <div style={{textAlign:"left",padding:"14px 20px",background:"#fff",borderRadius:6,border:`1px solid ${T.border}`,marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,color:T.textSec,marginBottom:8}}>Certificate Issued To (must-notify list — configurable in Setup → Certificate Email)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {CERT_NOTIFY_LIST.map((n,i)=><span key={i} style={{fontSize:11,padding:"4px 10px",background:"#ecfdf5",border:`1px solid ${T.ok}30`,borderRadius:12,color:T.ok,fontWeight:600}}>✓ {n}</span>)}
              </div>
            </div>

            <div style={{fontSize:9,color:T.textMut,borderTop:`1px solid ${T.border}`,paddingTop:12}}>System-generated by {APP.name}. No manual signature required.<br/>Generated: {new Date().toISOString().split("T")[0]}<br/><strong>Template line detail is issued as a separate report.</strong></div>
            <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:12}}>
              <button onClick={()=>window.print()} style={{padding:"8px 18px",borderRadius:6,border:`1px solid ${T.primary}`,background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",color:T.primary}}>🖨 Print / Save PDF</button>
              <button onClick={()=>alert(`Certificate ${p.id}-CERT emailed to: ${CERT_NOTIFY_LIST.join(", ")}`)} style={{padding:"8px 18px",borderRadius:6,border:`1px solid ${T.ok}`,background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",color:T.ok}}>✉️ Share via Email</button>
            </div>
          </div>
        </Card>
      </div>;
    })()}

    {tab===actionTab&&canActNow&&<div ref={actionRef}>
    {/* ═══ CPT EXISTS ACKNOWLEDGEMENT PATH — handled via modal ═══ */}
    {(p.status==="cpt_exists_cfo_ack"&&role==="cfo"||p.status==="cpt_exists_cmo_ack"&&role==="cmo")&&<Card style={{marginTop:20,borderTop:`3px solid ${T.warn}`,textAlign:"center",padding:24}}>
      <div style={{marginBottom:8,display:"flex",justifyContent:"center"}}><Ic n="clipboard" s={34} sw={1.6} style={{color:T.warn}}/></div>
      <div style={{fontSize:16,fontWeight:700,color:T.warn}}>CPT Exists — Acknowledgement Required</div>
      <div style={{fontSize:12,color:T.textSec,marginTop:8}}>Use the <strong>Acknowledge</strong> action in the banner above to confirm.</div>
    </Card>}
    {p.status==="cpt_exists_cfo_ack"&&role!=="cfo"&&<Card style={{marginTop:20,background:"#f8fafc",textAlign:"center",padding:24}}>
      <div style={{fontSize:13,color:T.textMut}}>Awaiting CFO Acknowledgement (CPT Exists path)</div>
    </Card>}
    {p.status==="cpt_exists_cmo_ack"&&role!=="cmo"&&<Card style={{marginTop:20,background:"#f8fafc",textAlign:"center",padding:24}}>
      <div style={{fontSize:13,color:T.textMut}}>Awaiting CMO Acknowledgement (CPT Exists path)</div>
    </Card>}

    {/* ═══ STAGE-SPECIFIC ACTION PANELS ═══ */}
    <div ref={actionRef}/>
    {!["approved","rejected","cpt_exists","cpt_exists_cfo_ack","cpt_exists_cmo_ack"].includes(p.status)&&<div style={{marginTop:20}}>

      {/* Stage 2: CMO — review all data then take action at bottom */}
      {/* Stage 3: CMIO with delegation */}
      {p.currentStage===3&&isMy&&<div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
          <div style={{gridColumn:"1 / -1"}}><ST style={{fontSize:15,margin:"0 0 2px"}}>CMIO validation</ST><div style={{fontSize:12,color:T.textSec}}>Confirm the CPT mapping for this request. The doctor proposed <strong>{p.proposedCptCode||"—"}</strong> — {p.proposedCptName}.</div></div>
          <div><label style={lbl}>Does this CPT already exist? {!isEditVer&&<span style={{color:T.err}}>*</span>}</label>
            {isEditVer
              ? <div style={{...inp,background:"#f8fafc",color:T.textSec,display:"flex",alignItems:"center"}}>Validated in original version — edit continues normally</div>
              : <Select style={inp} value={cmioStatus} onChange={e=>setCmioStatus(e.target.value)}><option value="">Select…</option><option value="New">New — build the package</option><option value="Exists">Exists — already in the system</option></Select>}
          </div>
          <div><label style={lbl}>Accurate CPT code <span style={{color:T.err}}>*</span></label>
            <AutoComplete value={cmioCode} onChange={v=>{if(typeof v==="object"){setCmioCode(v.code);setCmioName(v.name);}else setCmioCode(v);}} options={CPT_DB} placeholder="Default from requestor..." displayFn={c=>`${c.code} — ${c.name}`} filterFn={(c,q)=>c.code.includes(q)||c.name.toLowerCase().includes(q.toLowerCase())}/>
          </div>
          <div><label style={lbl}>Accurate CPT name <span style={{color:T.err}}>*</span></label>
            <AutoComplete value={cmioName} onChange={v=>{if(typeof v==="object"){setCmioCode(v.code);setCmioName(v.name);}else setCmioName(v);}} options={CPT_DB} placeholder="Default from requestor..." displayFn={c=>c.name} filterFn={(c,q)=>c.name.toLowerCase().includes(q.toLowerCase())}/>
          </div>
        </div>
        {cmioStatus==="Exists"&&<div style={{background:"#eff6ff",padding:12,borderRadius:8,marginBottom:12,border:`1px solid ${T.info}30`,fontSize:12,color:T.info}}>Approving will route this request onto the <strong>CPT-Exists short path</strong>: CFO acknowledgement, then CMO acknowledgement, then closed. It will not be costed or priced.</div>}
        {p.delegatedTo===me.email&&<div style={{padding:"10px 14px",background:"#faf5ff",border:`1px solid ${T.purple}40`,borderRadius:8,marginBottom:8,fontSize:11,color:T.purple}}>🔄 <strong>You are filling on behalf of {p.delegatedByUser?.name||"the primary approver"}.</strong> After confirming, request returns to them for final approval.</div>}

      </div>}

      {/* Stage 4: Nursing Template Building */}

      {/* Stages 5-9: Reviewers see FULL data, then approve/reject at bottom */}
      {/* Stage 10: CFO FCD — comprehensive cost worksheet with auto-calc */}
      {p.currentStage===10&&isMy&&<div>
        <Card style={{marginBottom:16,border:`1px solid ${T.info}30`}}>
          <ST style={{fontSize:14,color:T.info}}>Financials (FCD)</ST>
          <div style={{display:"flex",justifyContent:"space-between",gap:12,marginBottom:16}}><div style={{fontSize:11.5,color:T.textSec}}>Assign the standard cost against each service line. Template costs come from the Nursing OT templates and are calculated for you. Enter the final patient price to see the margin.</div><span style={{flexShrink:0,alignSelf:"flex-start",fontSize:10.5,fontWeight:700,color:T.ok,background:"#ecfdf5",border:`1px solid ${T.ok}40`,padding:"3px 10px",borderRadius:20}}>● Auto-saving</span></div>
          {/* Auto-calculated template costs */}
          <div style={{marginBottom:16}}>
            <SecHead n="1" t="Template costs — auto-calculated" sub="Pulled live from the nursing OT templates. Nothing to enter here." c={T.ok}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[{l:"Total Consumables",v:(p.templates?.procCons||[]).concat(p.templates?.wardsCons||[]).reduce((s,i)=>s+(i.totalCost||0),0),c:T.info},
                {l:"Total Drugs",v:(p.templates?.procDrugs||[]).concat(p.templates?.wardsDrugs||[]).reduce((s,i)=>s+(i.totalCost||0),0),c:"#7c3aed"},
                {l:"All Templates Total (Proc + Wards)",v:(p.templates?.procCons||[]).concat(p.templates?.wardsCons||[]).concat(p.templates?.procDrugs||[]).concat(p.templates?.wardsDrugs||[]).reduce((s,i)=>s+(i.totalCost||0),0),c:T.primary}
              ].map((c,i)=><div key={i} style={{padding:"10px 12px",background:"#f0fdf4",borderRadius:6,borderLeft:`3px solid ${c.c}`}}>
                <div style={{fontSize:9,color:T.textMut,fontWeight:600}}>{c.l}</div>
                <div style={{fontSize:15,fontWeight:700,color:c.c,marginTop:2}}>{fmtKWD(c.v)}</div>
              </div>)}
            </div>
          </div>
          <SecHead n="2" t="Service & LOS standard costs" sub="Lines marked * are required — every listed line, surgery duration, and accommodation when the package has accommodation days. Row and grand totals update as you type."/>
          {(()=>{const L=FCD_LINES(p);const ns=p.nursingSuggested||{};
            const inpS={...inp,padding:"6px 8px",fontSize:12,textAlign:"right",margin:0};
            const one=(label,orig,val,set,c,sug)=><tr style={{borderBottom:`1px solid ${T.borderLight}`}}>
              <td style={{...td,textAlign:"left",fontWeight:600,fontSize:12,padding:"10px 8px"}}>{label} <span style={{color:T.err}}>*</span>{sug>0&&<div><span style={{fontSize:9.5,fontWeight:700,color:T.teal||"#0d9488",background:"#f0fdfa",borderRadius:8,padding:"1px 7px"}}>Nursing suggests {fmtKWD(sug)}</span></div>}</td>
              <td style={{...td,textAlign:"left",fontSize:11.5,color:T.textSec}}>{orig}</td>
              <td style={{...td,padding:"6px 8px",width:160}}><input type="number" step="0.001" style={inpS} value={val||""} onChange={e=>set(e.target.value)} placeholder="0.000"/></td>
              <td style={{...td,fontWeight:700,color:c,textAlign:"right"}}>{fmtKWD(Number(val)||0)}</td></tr>;
            const lineTotal=l=>(fcd[l.k]||[]).reduce((x,v)=>x+(Number(v)||0),0);
            const svc=L.reduce((x,l)=>x+lineTotal(l),0)+(Number(fcd.surgeryDurationCost)||0)+(Number(fcd.accommodationCost)||0);
            const tplT=[...(p.templates?.procCons||[]),...(p.templates?.wardsCons||[]),...(p.templates?.procDrugs||[]),...(p.templates?.wardsDrugs||[])].reduce((x,i)=>x+(i.totalCost||0),0);
            const listRows=l=>{const items=l.items.length?l.items:["—"];const arr=fcd[l.k]||[];const set=(j,v)=>{const u=[...arr];u[j]=v;updFcd(l.k,u);};
              return items.map((it,j)=><tr key={l.k+j} style={{borderBottom:j===items.length-1?`1px solid ${T.border}`:`1px dashed ${T.borderLight}`,background:l.bg}}>
                {j===0&&<td rowSpan={items.length} style={{...td,textAlign:"left",fontWeight:600,fontSize:12,padding:"10px 8px",verticalAlign:"top"}}>{l.l} <span style={{color:T.err}}>*</span>{l.items.length>0&&<div style={{fontSize:9.5,color:l.c,fontWeight:600}}>{l.items.length} item{l.items.length>1?"s":""}</div>}{(ns[l.ns]||0)>0&&<div><span style={{fontSize:9.5,fontWeight:700,color:T.teal||"#0d9488",background:"#f0fdfa",borderRadius:8,padding:"1px 7px"}}>Nursing suggests {fmtKWD(ns[l.ns])}</span></div>}</td>}
                <td style={{...td,textAlign:"left",fontSize:11.5}}>{l.items.length>0&&<span style={{color:l.c,fontWeight:700,fontSize:9,background:l.c+"15",borderRadius:3,padding:"1px 5px",marginRight:6}}>{j+1}</span>}{String(it).trim()}</td>
                <td style={{...td,padding:"4px 8px",width:160}}><input type="number" step="0.001" aria-label={`Cost for ${l.l.toLowerCase()} line ${j+1}`} style={inpS} value={arr[j]||""} onChange={e=>set(j,e.target.value)} placeholder="0.000"/></td>
                {j===0&&<td rowSpan={items.length} style={{...td,fontWeight:700,color:l.c,textAlign:"right",verticalAlign:"middle"}}>{fmtKWD(lineTotal(l))}</td>}
              </tr>);};
            return <table style={{width:"100%",borderCollapse:"collapse",marginBottom:16}}>
              <thead><tr style={{background:T.primaryLight}}>{["Service line","Item / original value","Cost (KWD)","Sub-total"].map((h,i)=><th key={h} style={{...th,textAlign:i>=2?"right":"left"}}>{h}</th>)}</tr></thead>
              <tbody>
                {listRows(L[0])}
                {one("Surgery duration",(p.procedureDuration||"—")+" hrs",fcd.surgeryDurationCost,v=>updFcd("surgeryDurationCost",v),T.info,ns.surgeryDuration)}
                {one("Accommodation",(p.accommodationDays||0)+" days",fcd.accommodationCost,v=>updFcd("accommodationCost",v),T.warn,ns.accommodation)}
                {L.slice(1).map(l=><React.Fragment key={l.k}>{listRows(l)}</React.Fragment>)}
                <tr style={{background:"#eff6ff",fontWeight:700,borderTop:`2px solid ${T.info}`}}><td colSpan={3} style={{...td,textAlign:"left",color:T.info}}>Total standard cost (Services & LOS) — auto-sum</td><td style={{...td,textAlign:"right",color:T.info}}>{fmtKWD(svc)}</td></tr>
                <tr style={{background:"#eff6ff"}}><td colSpan={3} style={{...td,textAlign:"left",color:T.info}}>+ OT templates <span style={{color:T.textMut}}>(consumables & drugs from step 1 — the OT templates total)</span></td><td style={{...td,textAlign:"right",color:T.info,fontWeight:700}}>{fmtKWD(tplT)}</td></tr>
                <tr style={{background:"#eff6ff",borderTop:`2px solid ${T.info}`}}><td colSpan={3} style={{...td,textAlign:"left",color:T.info,fontWeight:700}}>= Total overall cost</td><td style={{...td,textAlign:"right",color:T.info,fontWeight:800}}>{fmtKWD(svc+tplT)}</td></tr>
              </tbody></table>;})()}
          {/* Auto-calculated summary + margin */}
          {(()=>{
            const tplTotal=(p.templates?.procCons||[]).concat(p.templates?.wardsCons||[]).concat(p.templates?.procDrugs||[]).concat(p.templates?.wardsDrugs||[]).reduce((s,i)=>s+(i.totalCost||0),0);
            const svcTotal=fcdPayload().totalServicesCost;
            const totalOverall=tplTotal+svcTotal+(Number(fcd.additionalServicesCost)||0);
            const patientPrice=Number(fcd.finalPatientPrice)||0;
            const margin=totalOverall>0?((patientPrice-totalOverall)/totalOverall*100):0;
            return<div style={{background:"#f8fafc",borderRadius:8,padding:16,border:`1px solid ${T.border}`}}>
              <SecHead n="3" t="Price & margin" sub="Set the patient price — cost and margin recalculate instantly."/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:12}}>
                <div style={{padding:10,background:"#fff",borderRadius:6,borderLeft:`3px solid ${T.info}`}}><div style={{fontSize:9,color:T.textMut}}>Templates</div><div style={{fontSize:14,fontWeight:700,color:T.info}}>{fmtKWD(tplTotal)}</div></div>
                <div style={{padding:10,background:"#fff",borderRadius:6,borderLeft:`3px solid ${T.purple}`}}><div style={{fontSize:9,color:T.textMut}}>Services & LOS</div><div style={{fontSize:14,fontWeight:700,color:T.warn}}>{fmtKWD(svcTotal)}</div></div>
                <div style={{padding:10,background:"#fff",borderRadius:6,borderLeft:`3px solid ${T.err}`}}><div style={{fontSize:9,color:T.textMut}}>Total Overall Cost</div><div style={{fontSize:16,fontWeight:700,color:T.err}}>{fmtKWD(totalOverall)}</div></div>
                <div style={{padding:10,background:margin>0?"#f0fdf4":"#fef2f2",borderRadius:6,borderLeft:`3px solid ${margin>0?T.ok:T.err}`}}><div style={{fontSize:9,color:T.textMut}}>Margin %</div><div style={{fontSize:16,fontWeight:700,color:margin>0?T.ok:T.err}}>{margin.toFixed(1)}%</div></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <div style={{padding:10,background:"#fff",borderRadius:6,borderLeft:`3px solid ${T.info}`,marginBottom:8}}><div style={{fontSize:9,color:T.textMut,fontWeight:700,textTransform:"uppercase",letterSpacing:0.3}}>Doctor's Suggested Price — {p.requestor?.name||"Requesting Doctor"}{p.requestor?.dept?" · "+p.requestor.dept:""}</div><div style={{fontSize:16,fontWeight:700,color:T.info,marginTop:2}}>{fmtKWD(p.suggestedPrice)}</div><div style={{fontSize:9,color:T.textMut}}>Reference — doctor's requested price</div></div>
                  <label style={{...lbl,fontSize:12}}>Other additional services</label>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8}}><input style={{...inp,margin:0}} value={fcd.additionalServicesName||""} onChange={e=>updFcd("additionalServicesName",e.target.value)} placeholder="e.g. Theatre overtime"/>{fcd.additionalServicesName&&<input type="number" step="0.001" style={{...inp,margin:0}} value={fcd.additionalServicesCost||""} onChange={e=>updFcd("additionalServicesCost",e.target.value)} placeholder="Cost (KWD)"/>}</div>
                  <div style={{fontSize:10,color:T.textMut,margin:"4px 0 10px"}}>Only what section 2 cannot cost — Man Power, Machines & Devices, Major Consumables & Drugs, Lab & Radiology and Extra Services are costed there, per line. Name the service and its cost is asked for.</div>
                  <label style={{...lbl,fontSize:12,color:T.ok}}>Final Procedure Patient Price (KWD) <span style={{color:T.err}}>*</span></label>
                  <input type="number" step="0.001" style={{...inp,padding:"10px 12px",fontSize:16,fontWeight:700,border:`2px solid ${T.ok}`,background:"#f0fdf4"}} value={fcd.finalPatientPrice} onChange={e=>updFcd("finalPatientPrice",e.target.value)} placeholder="Enter patient price..."/>
                  {Number(fcd.finalPatientPrice)>0&&<div style={{fontSize:10.5,color:T.ok,fontWeight:700,marginTop:3}}>= {fmtKWD(fcd.finalPatientPrice)}</div>}<div style={{fontSize:10,color:T.textSec,marginTop:4}}>Market-based selling price for the patient. Margin is calculated above.</div>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{textAlign:"center",padding:16,background:"#fff",borderRadius:8,border:`1px solid ${T.border}`,minWidth:140}}>
                    <div style={{fontSize:10,color:T.textMut}}>Margin (on cost)</div>
                    <div style={{fontSize:24,fontWeight:800,color:margin>0?T.ok:T.err,marginTop:4}}>{margin.toFixed(1)}%</div>
                    <div style={{fontSize:10,color:T.textMut}}>{patientPrice>0?(patientPrice>totalOverall?"Profit":"Loss"):"Awaiting price"}</div>
                  </div>
                </div>
              </div>
            </div>;
          })()}
          <div style={{marginTop:16}}>
            <SecHead n="4" t="Doctor & revenue terms" sub="Commercial terms that ride with the package." c={T.info}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              <div><label style={lbl}>Accept Doctor Fees <span style={{color:T.err}}>*</span></label><Select style={inp} value={fcd.acceptDoctorFees||""} onChange={e=>updFcd("acceptDoctorFees",e.target.value)}><option value="">Select...</option><option>Yes</option><option>No</option><option>Not applicable</option></Select></div>
              <div><label style={lbl}>Advance Payment Portion (Inpatient Visit) <span style={{color:T.err}}>*</span></label><Select style={inp} value={fcd.advancePayment||""} onChange={e=>updFcd("advancePayment",e.target.value)}><option value="">Select...</option><option>Yes</option><option>No</option><option>Not applicable</option></Select></div>
              <div><label style={lbl}>Maximum CAP Limit? <span style={{color:T.err}}>*</span></label><Select style={inp} value={fcd.hasCap||""} onChange={e=>updFcd("hasCap",e.target.value)}><option value="">Select...</option><option>Yes</option><option>No</option></Select></div>
              {fcd.hasCap==="Yes"&&<div><label style={lbl}>Maximum CAP Limit Value (KWD) <span style={{color:T.err}}>*</span></label><input type="text" style={inp} value={fcd.capLimit||""} onChange={e=>{const raw=e.target.value.replace(/[^0-9.]/g,"");updFcd("capLimit",raw);}} onBlur={e=>{const n=Number((fcd.capLimit||"").toString().replace(/,/g,""));if(!isNaN(n)&&fcd.capLimit)updFcd("capLimit",n.toLocaleString("en-US"));}} placeholder="e.g. 1,000"/></div>}
              <div><label style={lbl}>Service Revenue for Doctors <span style={{color:T.err}}>*</span></label><Select style={inp} value={fcd.serviceRevenueDoctors||""} onChange={e=>updFcd("serviceRevenueDoctors",e.target.value)}><option value="">Select...</option><option>Direct</option><option>Not Direct</option><option>Not applicable</option></Select></div>
            </div>
          </div>
          <div style={{marginTop:14,padding:"10px 14px",borderRadius:8,background:"#eff6ff",border:`1px solid ${T.info}30`,fontSize:11.5,color:T.info,display:"flex",gap:8,alignItems:"center"}}><Ic n="lock" s={13}/>These figures are written to the restricted package-financials record — not to the request itself — so they are never visible to the clinical approval chain. The activity timeline records that you approved, never the amounts.</div>
        </Card>
        {/* Show delegation banner if applicable */}
        {p.delegatedTo===me.email&&<div style={{padding:"10px 14px",background:"#faf5ff",border:`1px solid ${T.purple}40`,borderRadius:8,marginTop:12,marginBottom:8,fontSize:11,color:T.purple}}>
          🔄 <strong>You are filling on behalf of {p.delegatedByUser?.name||"the primary approver"}.</strong> After you confirm, the request will return to them for final approval.
        </div>}

      </div>}

      {/* Stage 11: CEO — Same comprehensive view as CFO (per Fares: I agree 100%) */}
      {p.currentStage===11&&p.financial&&isMy&&<div>
        <FinCards fin={p.financial}/>
        <Card style={{marginBottom:16,border:`1px solid ${T.border}`}}>
          <ST style={{fontSize:14}}>CEO final price review</ST>
          <div style={{fontSize:11.5,color:T.textSec,marginBottom:16}}>Review the complete financial breakdown the CFO set. You can adjust the final procedure patient price — the margin recalculates as you type. If you change it, the CFO is told the price moved.</div>

          {/* Auto-calculated template costs */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:T.ok,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>OT TEMPLATE COSTS</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[{l:"Total Consumables",v:p.financial.totalConsCost,c:T.info},
                {l:"Total Drugs",v:p.financial.totalDrugsCost,c:"#7c3aed"},
                {l:"All Templates Total (Proc + Wards)",v:(p.financial.totalConsCost||0)+(p.financial.totalDrugsCost||0),c:T.primary}
              ].map((c,i)=><div key={i} style={{padding:"10px 12px",background:"#f0fdf4",borderRadius:6,borderLeft:`3px solid ${c.c}`}}>
                <div style={{fontSize:9,color:T.textMut,fontWeight:600}}>{c.l}</div>
                <div style={{fontSize:15,fontWeight:700,color:c.c,marginTop:2}}>{fmtKWD(c.v||0)}</div>
              </div>)}
            </div>
          </div>

          {/* CFO Standard Costs — read-only for CEO */}
          <div style={{fontSize:11,fontWeight:700,color:T.warn,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>SERVICE & LOS STANDARD COSTS (Set by CFO)</div>
          <table style={{width:"100%",borderCollapse:"collapse",marginBottom:16}}>
            <thead><tr style={{background:T.primaryLight}}>
              <th style={{...th,textAlign:"left",width:"24%"}}>Service Line</th>
              <th style={{...th,textAlign:"left",width:"46%"}}>Original Value</th>
              <th style={{...th,textAlign:"left",width:"30%"}}>Total Standard Cost (KWD)</th>
            </tr></thead>
            <tbody>
              {[{label:"Manpower",orig:p.manpower||"—",cost:p.financial.manpowerCost,isList:true,c:T.purple},
                {label:"Surgery Duration",orig:(p.procedureDuration||"—")+(p.procedureDuration?" hrs":""),cost:p.financial.surgeryDurationCost,isList:false,c:T.info},
                {label:"Accommodation",orig:(p.accommodationDays||0)+" days",cost:p.financial.accommodationCost,isList:false,c:T.warn},
                {label:"Machines & Devices",orig:p.machinesDevices||"—",cost:p.financial.machinesDevicesCost,isList:true,c:T.info}
              ].map((f,i)=>{
                const items=f.isList&&f.orig!=="—"?String(f.orig).split(/[;,]\s*|\n/).filter(s=>s.trim()):[];
                return<tr key={i} style={{borderBottom:`1px solid ${T.borderLight}`,background:i%2===1?"#f8fafb":"#fff",verticalAlign:"top"}}>
                  <td style={{...td,textAlign:"left",fontWeight:600,fontSize:12,padding:"10px 8px",verticalAlign:"top"}}>
                    <div>{f.label}</div>
                    {items.length>1&&<div style={{fontSize:9,color:T.textMut,fontWeight:500,marginTop:2,padding:"1px 6px",background:f.c+"15",color:f.c,borderRadius:8,display:"inline-block"}}>{items.length} items</div>}
                  </td>
                  <td style={{...td,textAlign:"left",fontSize:11,color:T.textSec,padding:"10px 8px",verticalAlign:"top"}}>
                    {items.length<=1?<span>{f.orig}</span>:
                    <div style={{display:"flex",flexDirection:"column",gap:3}}>
                      {items.map((it,j)=><div key={j} style={{display:"flex",alignItems:"flex-start",gap:6,fontSize:11}}>
                        <span style={{color:f.c,fontWeight:700,minWidth:18,fontSize:9,background:f.c+"15",borderRadius:3,padding:"1px 5px",textAlign:"center",flexShrink:0}}>{j+1}</span>
                        <span style={{color:T.text,lineHeight:1.4}}>{it.trim()}</span>
                      </div>)}
                    </div>}
                  </td>
                  <td style={{...td,padding:"10px 8px",fontSize:13,fontWeight:600,color:T.text,textAlign:"right",verticalAlign:"top"}}>{fmtKWD(f.cost||0)}</td>
                </tr>;
              })}
              <tr style={{background:"#eff6ff",fontWeight:700,borderTop:`2px solid ${T.info}`}}>
                <td style={{...td,textAlign:"left",fontSize:12,color:T.info,padding:"10px 8px"}} colSpan={2}>Total Standard Cost (Services & LOS)</td>
                <td style={{...td,padding:"10px",fontSize:14,fontWeight:700,color:T.info,textAlign:"right"}}>{fmtKWD(p.financial.totalServicesCost||0)}</td>
              </tr>
            </tbody>
          </table>

          {/* Live calculated overall summary */}
          {(()=>{
            const tplTotal=(p.financial.totalConsCost||0)+(p.financial.totalDrugsCost||0);
            const svcTotal=p.financial.totalServicesCost||0;
            const totalOverall=tplTotal+svcTotal+(Number(fcd.additionalServicesCost)||0);
            const newPrice=Number(ceoPrice)||0;
            const newMargin=newPrice>0&&totalOverall>0?((newPrice-totalOverall)/totalOverall*100):0;
            const oldPrice=p.financial.finalPatientPrice||0;
            const priceChanged=newPrice>0&&newPrice!==oldPrice;
            return<div style={{background:"#f8fafc",borderRadius:8,padding:16,border:`1px solid ${T.border}`}}>
              <div style={{fontSize:11,fontWeight:700,color:T.primary,textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>OVERALL SUMMARY (LIVE)</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:14}}>
                <div style={{padding:10,background:"#fff",borderRadius:6,borderLeft:`3px solid ${T.info}`}}><div style={{fontSize:9,color:T.textMut}}>Templates</div><div style={{fontSize:14,fontWeight:700,color:T.info}}>{fmtKWD(tplTotal)}</div></div>
                <div style={{padding:10,background:"#fff",borderRadius:6,borderLeft:`3px solid ${T.purple}`}}><div style={{fontSize:9,color:T.textMut}}>Services & LOS</div><div style={{fontSize:14,fontWeight:700,color:T.warn}}>{fmtKWD(svcTotal)}</div></div>
                <div style={{padding:10,background:"#fff",borderRadius:6,borderLeft:`3px solid ${T.err}`}}><div style={{fontSize:9,color:T.textMut}}>Total Overall Cost</div><div style={{fontSize:16,fontWeight:700,color:T.err}}>{fmtKWD(totalOverall)}</div></div>
                <div style={{padding:10,background:newMargin>0?"#f0fdf4":"#fef2f2",borderRadius:6,borderLeft:`3px solid ${newMargin>0?T.ok:T.err}`}}><div style={{fontSize:9,color:T.textMut}}>Live Margin %</div><div style={{fontSize:16,fontWeight:700,color:newMargin>0?T.ok:T.err}}>{newMargin.toFixed(1)}%</div></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label style={{...lbl,fontSize:12,color:T.err}}>Final Procedure Patient Price (KWD) <span style={{color:T.err}}>*</span> <span style={{fontSize:10,color:T.textMut}}>(CFO submitted: {fmtKWD(oldPrice)})</span></label>
                  <input type="number" step="0.001" style={{...inp,padding:"10px 12px",fontSize:16,fontWeight:700,border:`2px solid ${T.err}`,background:"#fef2f2"}} value={ceoPrice} onChange={e=>setCeoPrice(e.target.value)} placeholder="Enter final patient price..."/>
                  {newPrice>0&&<div style={{fontSize:10.5,color:T.warn,fontWeight:700,marginTop:3}}>= {fmtKWD(newPrice)}</div>}{priceChanged&&<div style={{marginTop:6,fontSize:11,color:T.warn,fontWeight:600,padding:"4px 8px",background:"#fffbeb",borderRadius:4}}>Changed: {fmtKWD(oldPrice)} → {fmtKWD(newPrice)}. The CFO will be notified.</div>}
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{textAlign:"center",padding:16,background:"#fff",borderRadius:8,border:`1px solid ${T.border}`,minWidth:140}}>
                    <div style={{fontSize:10,color:T.textMut}}>Margin %</div>
                    <div style={{fontSize:28,fontWeight:800,color:newMargin>0?T.ok:T.err,marginTop:4}}>{newMargin.toFixed(1)}%</div>
                    <div style={{fontSize:10,color:T.textMut}}>{newPrice>totalOverall?"Profit":newPrice>0?"Loss":"—"}</div>
                  </div>
                </div>
              </div>
              {priceChanged&&<div style={{marginTop:12,padding:"10px 14px",borderRadius:8,background:"#fffbeb",border:"1px solid #fde68a",fontSize:11.5,color:"#92400e"}}>⚠ Approving records both figures against this version and raises a change alert to the CFO. The alert itself says the price changed — <strong>not the amount</strong>, so nothing restricted travels in an email.</div>}
            </div>;
          })()}
        </Card>
      </div>}

      {/* Stage 12: CSCM Setup with delegation */}
      {p.currentStage===12&&isMy&&<div>
        <ST style={{fontSize:15,margin:"0 0 2px"}}>PrimeCare operation setup</ST><div style={{fontSize:12,color:T.textSec,marginBottom:12}}>Create the operation in PrimeCare, then record its code and name here. The code is checked against the hospital’s format and is permanent once linked.</div>
        {isEditVer&&<div style={{padding:12,marginBottom:12,borderRadius:8,background:"#fffbeb",border:`1px solid ${T.warn}40`,fontSize:11,color:"#854d0e"}}><strong>✎ Edit — do not create a new operation.</strong> Operation <strong>{ss.opCode||"—"}</strong> ({ss.opName||"—"}) already exists in PrimeCare from the original version. The existing values are pre-filled below — <strong>only adjust</strong> if this edit changed the operation; otherwise leave as-is and approve.</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div><label style={lbl}>Created Operation Code <span style={{color:T.err}}>*</span></label>
            <input style={{...inp,borderColor:cscmOpCode&&pcCheck("opCode",cscmOpCode)?T.err:inp.border}} value={cscmOpCode} onChange={e=>setCscmOpCode(e.target.value)} placeholder="e.g. 10803025"/>
            <div style={{fontSize:10,marginTop:4,color:cscmOpCode&&pcCheck("opCode",cscmOpCode)?T.err:T.textMut}}>{cscmOpCode&&pcCheck("opCode",cscmOpCode)?`✕ Format: ${PC_RULES.opCode.hint}`:`Format: ${PC_RULES.opCode.hint}`}</div>
          </div>
          <div style={{gridColumn:"1 / -1"}}><label style={lbl}>Created Operation Name <span style={{color:T.err}}>*</span></label><input style={{...inp,padding:"10px 12px",fontSize:13}} value={cscmOpName} onChange={e=>setCscmOpName(e.target.value)} placeholder="Full operation name — names are usually lengthy"/></div>
          <div><label style={lbl}>Linked Created Code to CPT <span style={{color:T.err}}>*</span></label><Select style={inp} value={cscmLinked} onChange={e=>setCscmLinked(e.target.value)}><option>Yes</option><option>No</option></Select></div>
          <div style={{gridColumn:"1 / -1"}}><label style={lbl}>Attachment proof — screenshot from the PrimeCare operation setup <span style={{color:T.err}}>*</span></label><AttachmentBox files={proof} onChange={setProof}/><div style={{fontSize:10,color:T.textMut,marginTop:3}}>Uploaded when you approve, and kept with the request permanently.</div></div>
          {!isEditVer&&<div style={{gridColumn:"1 / -1",padding:"10px 14px",borderRadius:8,background:"#fffbeb",border:"1px solid #fde68a",fontSize:11.5,color:"#854d0e",display:"flex",gap:8,alignItems:"center"}}><Ic n="lock" s={13}/><span><strong>Link & lock.</strong> Approving links this operation code to the package <strong>permanently</strong>. It cannot be changed afterwards, on this version or any later one — it is the join between CliniPack and PrimeCare.</span></div>}
        </div>

      </div>}

      {/* Stage 13: CFO Package with delegation */}
      {p.currentStage===13&&isMy&&<div>
        <ST style={{fontSize:15,margin:"0 0 2px"}}>PrimeCare package setup</ST><div style={{fontSize:12,color:T.textSec,marginBottom:12}}>Create the package in PrimeCare against the approved price, then record its PKGID here. The PKGID is permanent once linked.</div>
        {isEditVer&&<div style={{padding:12,marginBottom:12,borderRadius:8,background:"#fffbeb",border:`1px solid ${T.warn}40`,fontSize:11,color:"#854d0e"}}><strong>✎ Edit — do not create a new package.</strong> Package <strong>{ss.pkgId||"—"}</strong> already exists in PrimeCare from the original version. Existing values are pre-filled — <strong>only adjust</strong> if this edit affected the package/price; otherwise leave as-is and approve.</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div><label style={lbl}>Created PKGID (PrimeCare code) <span style={{color:T.err}}>*</span></label>
            <input style={{...inp,borderColor:pkgId&&pcCheck("pkgId",pkgId)?T.err:inp.border}} value={pkgId} onChange={e=>setPkgId(e.target.value)} placeholder="e.g. 56"/>
            <div style={{fontSize:10,marginTop:4,color:pkgId&&pcCheck("pkgId",pkgId)?T.err:T.textMut}}>{pkgId&&pcCheck("pkgId",pkgId)?`✕ Format: ${PC_RULES.pkgId.hint}`:`Format: ${PC_RULES.pkgId.hint}`}</div>
          </div>
          <div><label style={lbl}>Package name</label><input style={inp} value={pkgName} onChange={e=>setPkgName(e.target.value)}/><div style={{fontSize:10,color:T.textMut,marginTop:3}}>Optional — the name the package carries in PrimeCare, if it differs from the operation name.</div></div>
          <div><label style={lbl}>Linked operation code to package — both branches? <span style={{color:T.err}}>*</span></label><Select style={inp} value={pkgLinked} onChange={e=>setPkgLinked(e.target.value)}><option>Yes</option><option>No</option></Select></div>
          <div><label style={lbl}>Final Procedure Patient Price</label><div style={{padding:"8px 10px",background:"#f0fdf4",borderRadius:6,fontWeight:700,color:T.ok,border:`1px solid ${T.ok}20`}}>{fmtKWD(p.financial?.finalPatientPrice)}</div><div style={{fontSize:10,color:T.textMut,marginTop:2}}>The latest value approved by the CEO.</div></div>
          <div><label style={lbl}>Added on System <span style={{color:T.err}}>*</span></label><Select style={inp} value={pkgAdded} onChange={e=>setPkgAdded(e.target.value)}><option>Yes</option><option>No</option></Select></div>
          <div><label style={lbl}>Maximum CAP Limit (from FCD)</label><input readOnly style={{...inp,background:"#f8fafc",cursor:"not-allowed"}} value={p.financial?.hasCap==="Yes"?("Yes"+(p.financial?.capLimit?" — "+fmtKWD(p.financial.capLimit):"")):(p.financial?.hasCap||"—")}/></div>
          <div><label style={lbl}>Applied Maximum CAP Limit in both branches? <span style={{color:T.err}}>*</span></label><Select style={inp} value={pkgCapBoth} onChange={e=>setPkgCapBoth(e.target.value)}><option value="">Select...</option><option>Yes</option><option>No</option><option>Not applicable</option></Select></div>
          <div style={{gridColumn:"1 / -1"}}><label style={lbl}>Attachment proof — PrimeCare package setup / price list <span style={{color:T.err}}>*</span></label><AttachmentBox files={proof} onChange={setProof}/><div style={{fontSize:10,color:T.textMut,marginTop:3}}>Uploaded when you approve, and kept with the request permanently.</div></div>
          {!isEditVer&&<div style={{gridColumn:"1 / -1",padding:"10px 14px",borderRadius:8,background:"#fffbeb",border:"1px solid #fde68a",fontSize:11.5,color:"#854d0e",display:"flex",gap:8,alignItems:"center"}}><Ic n="lock" s={13}/><span><strong>Link & lock.</strong> Approving links this PKGID to the package <strong>permanently</strong>. It cannot be changed afterwards, on this version or any later one — it is the join between CliniPack and PrimeCare.</span></div>}
        </div>

      </div>}

      {/* Stage 14: CSCM Template Linking with delegation — single attachment */}
      {p.currentStage===14&&isMy&&<div>
        <ST style={{fontSize:15,margin:"0 0 2px"}}>PrimeCare template linking</ST><div style={{fontSize:12,color:T.textSec,marginBottom:12}}>Link this package’s four OT template lists to their PrimeCare template numbers, then confirm the linking is complete.</div>
        {isEditVer&&<div style={{padding:12,marginBottom:12,borderRadius:8,background:"#fffbeb",border:`1px solid ${T.warn}40`,fontSize:11,color:"#854d0e"}}><strong>✎ Edit — do not create new templates.</strong> The 4 templates already exist in PrimeCare from the original version (codes pre-filled). <strong>Only adjust</strong> the templates whose items changed in this edit; leave the rest unchanged and approve.</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          {[{l:"Procedure Consumables Template",v:tlPC,s:setTlPC,k:"procCons"},{l:"Wards Consumables Template",v:tlWC,s:setTlWC,k:"wardsCons"},{l:"Procedure Drugs Template",v:tlPD,s:setTlPD,k:"procDrugs"},{l:"Wards Drugs Template",v:tlWD,s:setTlWD,k:"wardsDrugs"}].map(f=>{const empty=!(p.templates?.[f.k]||[]).length;return <div key={f.l}>
            <label style={lbl}>{f.l} {!empty&&<span style={{color:T.err}}>*</span>}</label><input style={{...inp,background:empty?"#f5f5f5":"#fff"}} disabled={empty} value={empty?"Not applicable":f.v} onChange={e=>f.s(e.target.value)} placeholder="e.g. 1963"/>
            <div style={{fontSize:10,color:T.textMut,marginTop:3}}>Format: template number — e.g. 1963{empty&&<><br/>This package has no lines in this list — leave it blank.</>}</div>
          </div>;})}
          <div><label style={lbl}>Linking Completed <span style={{color:T.err}}>*</span></label><Select style={inp} value={tlDone} onChange={e=>setTlDone(e.target.value)}><option>Yes</option><option>No</option></Select></div>
          <div style={{gridColumn:"1 / -1"}}><label style={lbl}>Attachment proof — one document covering all four templates <span style={{color:T.err}}>*</span></label><AttachmentBox files={proof} onChange={setProof}/><div style={{fontSize:10,color:T.textMut,marginTop:3}}>Uploaded when you approve, and kept with the request permanently.</div></div>
        </div>

      </div>}
    </div>}

    </div>}
    {/* ═══ ACTION MODALS (bars render below, tab-independent) ═══ */}
    {!editFlow&&(()=>{const ix=tabs.findIndex(t2=>t2.k===tab);const pv=tabs[ix-1],nx=tabs[ix+1];
      const nbtn={display:"inline-flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:8,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,fontWeight:600,color:T.textSec,cursor:"pointer",fontFamily:T.font};
      const go=k=>{setTab(k);const el=document.querySelector('[data-scroll-main="1"]');if(el)el.scrollTop=0;};
      return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:20,gap:10}}>
        <div>{pv&&<button onClick={()=>go(pv.k)} style={nbtn}>← Previous: {pv.l}</button>}</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {nx&&<button onClick={()=>go(nx.k)} style={{...nbtn,color:T.primary,borderColor:`${T.primary}55`}}>Next: {nx.l} →</button>}
        </div>
      </div>;})()}
    {/* ═══ STICKY ACTION BAR — the ONE place decisions are made (visible on every tab) ═══ */}
    {(()=>{
      if(editFlow&&editFlow.all){
        const n=efChanged.length;
        const submitAll=()=>{
          if(!n){alert("Change at least one field");return;}
          if(!efReason.trim()){alert("Reason for change is required");return;}
          const changes=efChanged.map(k=>({k,l:MFIELDS[k].l,from:MFIELDS[k].get(p)||"—",to:efVals[k]||"—",tab:MFIELD_TAB[k]||"overview",scen:(editDesign.fieldMap||{})[k]}));
          if(amending){onActVl(amending,"resubmit",{changes});setAmending(null);setEditFlow(null);onOpenVl(amending.id);return;}
          const id=onSubmitEdit(changes,efScen,efReason);if(id){setEditFlow(null);onOpenVl(id);}
        };
        return <ActionBar label={`Change Request — Edit Package${efScen.length?" · "+efScen.map(s=>SCEN_SHORT[s]).join(" + "):""}`} icon="pencil" sub={n?`${n} field${n===1?"":"s"} changed — submit to route it for approval`:"Change at least one field above — the highlighted controls are editable in place"} me={me} comment={<input value={efReason} onChange={e=>setEfReason(e.target.value)} placeholder="Reason for change (required)…" style={{...inp,margin:0,flex:"2 1 300px",minWidth:220,fontSize:12}}/>}>
          <button onClick={()=>{setEditFlow(null);setAmending(null);}} style={{...BTN2,border:`1px solid ${T.border}`,color:T.textSec}}>Cancel</button>
          <button onClick={submitAll} style={{...BTN,background:n?T.primary:"#94a3b8",color:"#fff"}}><Ic n="send" s={13}/>{amending?"Resubmit Change":"Submit Change Request"}</button>
        </ActionBar>;
      }
      if(editFlow){
        if(editFlow.step!=="fields")return null;
        const g=editFlow.group;
        const doSubmit=()=>{
          if(!efReason.trim()){alert("Reason is required");return;}
          if(g.special==="obsolete"){
            const prs=efPairs.filter(x=>x.old.trim()&&x.new.trim());
            if(!prs.length){alert("Enter at least one old → new code pair");return;}
            onSubmitVl(g,{pairs:prs,changes:prs.map(x=>({k:"pair",l:"Item code",from:x.old,to:x.new}))},efReason);setEditFlow(null);setTab("changes");return;
          }
          const changed=(g.fields||[]).filter(k=>String(efVals[k]||"")!==String(MFIELDS[k].get(p)||""));
          if(!changed.length){alert("Change at least one field");return;}
          onSubmitVl(g,{changes:changed.map(k=>({k,l:MFIELDS[k].l,from:MFIELDS[k].get(p)||"—",to:efVals[k]||"—"}))},efReason);setEditFlow(null);setTab("changes");
        };
        return <ActionBar label={"Change Request — "+g.name} icon="pencil" sub="Fields are editable in place — highlighted in the tab" me={me} comment={<input value={efReason} onChange={e=>setEfReason(e.target.value)} placeholder="Reason for change (required)…" style={{...inp,margin:0,flex:"2 1 260px",minWidth:200,fontSize:12}}/>}>
          <button onClick={()=>setEditFlow(null)} style={{...BTN2,border:`1px solid ${T.border}`,color:T.textSec}}>Cancel</button>
          <button onClick={doSubmit} style={{...BTN,background:T.primary,color:"#fff"}}><Ic n="send" s={13}/>Submit Change Request</button>
        </ActionBar>;
      }
      const _live=!['approved','rejected','cpt_exists','draft'].includes(p.status);
      // Live: who holds the step decides; a cover / delegate gets no Forward or Reassign of their own.
      const covering=p.reassignedTo&&p.reassignedTo.stage===p.currentStage&&p.reassignedTo.email===me.email;
      const delegateFill=p.delegatedTo===me.email;
      const holderName=(p.reassignedTo&&p.reassignedTo.stage===p.currentStage)?p.reassignedTo.forName:(((APPROVAL_CONFIG_DEFAULT.find(c=>c.num===p.currentStage)||{}).approvers||{})[p.branch]||me.name);
      const nextLbl=n=>(STAGES.find(x=>x.num===n)||{}).label||"Completed";
      const sentTo=nextLbl(p.currentStage+1);
      const hint=(()=>{const h=[];
        if(p.currentStage===3&&!isEditVer&&!cmioStatus)h.push("Choose whether the CPT is New or already Exists.");
        if(p.currentStage===3&&(!cmioCode||!cmioName))h.push("Enter the accurate CPT code and name.");
        if(p.currentStage===4){if(!procCons.length)h.push("Procedure Consumables is required — add at least one item.");if(!procDrugs.length)h.push("Procedure Drugs is required — add at least one item.");}
        if(p.currentStage===10){const L=FCD_LINES(p);L.forEach(l=>{const arr=fcd[l.k]||[];l.items.forEach((_,j)=>{if(!(Number(arr[j])>0))h.push(`Enter the standard cost for ${l.l}.`);});});
          if(!(Number(fcd.surgeryDurationCost)>0))h.push("Enter the standard cost for Surgery Duration.");
          if((Number(p.accommodationDays)||0)>0&&!(Number(fcd.accommodationCost)>0))h.push("Enter the standard cost for Accommodation.");
          if(!(Number(fcd.finalPatientPrice)>0))h.push("Enter the final procedure patient price.");
          if(!fcd.acceptDoctorFees)h.push("Answer “Accept Doctor Fees”.");if(!fcd.advancePayment)h.push("Answer “Advance Payment Portion (Inpatient Visit)”.");
          if(!fcd.serviceRevenueDoctors)h.push("Answer “Service Revenue for Doctors”.");if(!fcd.hasCap)h.push("Answer whether there is a Maximum CAP Limit.");
          if(fcd.hasCap==="Yes"&&!fcd.capLimit)h.push("Enter the Maximum CAP Limit value.");}
        if(p.currentStage===11&&!(Number(ceoPrice)>0))h.push("Enter the final procedure patient price.");
        if(p.currentStage===12){if(!cscmOpCode)h.push("Enter the operation code created in PrimeCare.");else if(pcCheck("opCode",cscmOpCode))h.push("Operation code format: "+PC_RULES.opCode.hint);if(!cscmOpName)h.push("Enter the operation name.");if(!proof.length)h.push("Attach the screenshot from the PrimeCare operation setup.");}
        if(p.currentStage===13){if(!pkgId)h.push("Enter the PKGID created in PrimeCare.");else if(pcCheck("pkgId",pkgId))h.push("PKGID format: "+PC_RULES.pkgId.hint);if(!pkgCapBoth)h.push("Answer whether the Maximum CAP Limit was applied in both branches.");if(!proof.length)h.push("Attach the PrimeCare package setup / price list.");}
        if(p.currentStage===14){const t=p.templates||{};if((t.procCons||[]).length&&!tlPC)h.push("Enter the Procedure Consumables template number.");if((t.procDrugs||[]).length&&!tlPD)h.push("Enter the Procedure Drugs template number.");if(!proof.length)h.push("Attach one document covering all four templates.");}
        return h;})();
      const hintEl=hint.length?<span style={{fontSize:11,color:"#c2410c",maxWidth:230,lineHeight:1.35}}>{hint[0]}{hint.length>1?` (+${hint.length-1} more)`:""}</span>:null;
      const reqComment=[2,3,5,6,7,8,9].includes(p.currentStage);
      const cmt=<input value={comments} onChange={e=>setComments(e.target.value)} placeholder={p.currentStage===2||p.currentStage===3?"Comment (required to request modification or reject)…":reqComment?"Comment (required to request modification)…":"Comment (optional)…"} style={{...inp,margin:0,flex:"2 1 240px",minWidth:180,fontSize:12}}/>;
      const more=[...(isMy&&!covering&&!delegateFill&&stageDef?.canDelegate?[{ic:'forward',l:'Forward / Delegate',fn:()=>setShowDelegateModal(true)}]:[]),
        ...(_live?[{ic:'inboxIn',l:'Request a Document',fn:()=>setShowDocReq(true)}]:[]),
        ...(_live&&!covering&&!delegateFill&&!p.reassignedTo?[{ic:'swap',l:`Reassign ${stageDef?.label||""} (${holderName} on leave)`,fn:()=>setShowReassign(true)}]:[])];
      const modBtn=<button onClick={()=>{if(!comments.trim()){alert("A comment is required — it is what tells the recipient what to change.");return;}onAction(p,"modify",{actionLabel:`${stageDef?.label} — sent back for changes`,comment:comments});setComments("");}} style={{...BTN2,border:`1px solid ${T.info}`,color:T.info}}><Ic n="rotateCcw" s={13}/>Request modification</button>;
      const rejBtn=<button onClick={()=>{if(!comments.trim()){alert("A comment is required to reject.");return;}onAction(p,"reject",{actionLabel:`${stageDef?.label} — rejected`,comment:comments});setComments("");}} style={{...BTN2,border:`1px solid ${T.err}`,color:T.err}}>Reject</button>;
      const okBtn=(label,fn,icon="check")=>{const dis=hint.length>0;return <button disabled={dis} onClick={()=>!dis&&fn()} style={{...BTN,background:dis?"#94a3b8":T.ok,color:"#fff",cursor:dis?"not-allowed":"pointer",opacity:dis?0.75:1}}><Ic n={icon} s={13} sw={2.6}/>{label}</button>;};
      const approve=(extra={})=>{onAction(p,"approve",{actionLabel:`${stageDef?.label} — approved; sent to ${sentTo}`,comment:comments,...extra});setComments("");};
      const bar=(children,label)=><ActionBar more={more} label={label||stageDef?.label} sub={"Acting as "+me.name} me={me} comment={<>{cmt}{hintEl}</>}>{children}</ActionBar>;
      if(isAmend)return <ActionBar label="Doctor Request" sub={"Acting as "+me.name} me={me} comment={<input value={comments} onChange={e=>setComments(e.target.value)} placeholder="Comment (optional)…" style={{...inp,margin:0,flex:"2 1 260px",minWidth:200,fontSize:12}}/>}>
        <button onClick={amdSubmit} style={{...BTN,background:amdOk?T.ok:"#94a3b8",color:"#fff",cursor:amdOk?"pointer":"not-allowed"}}><Ic n="check" s={13} sw={2.6}/>Submit data</button>
      </ActionBar>;
      // Delegate filling a forwarded step: one button, the decision goes back to the approver
      if(isMy&&delegateFill&&[3,10,12,13,14].includes(p.currentStage))return bar(okBtn("Confirm & Return to Primary",()=>{
        const d=p.currentStage===3?{cmioData:{cptStatus:cmioStatus,accurateCptCode:cmioCode,accurateCptName:cmioName}}:p.currentStage===10?{fcdData:fcdPayload()}:p.currentStage===12?{cscmData:{opCode:cscmOpCode,opName:cscmOpName,linkedToCpt:cscmLinked}}:p.currentStage===13?{pkgData:{pkgId,pkgName,linkedToPkg:pkgLinked,addedOnSystem:pkgAdded,capBothBranches:pkgCapBoth}}:{linkData:{procConsTemplate:tlPC,wardsConsTemplate:tlWC,procDrugsTemplate:tlPD,wardsDrugsTemplate:tlWD,linkingCompleted:tlDone}};
        onAction(p,"delegate_confirm",{actionLabel:`${stageDef?.label} — filled in & returned to ${p.delegatedByUser?.name||"the approver"}`,comment:comments,...d});},"forward"));
      if(p.currentStage===2&&isMy)return bar(<>{modBtn}{rejBtn}{okBtn("Approve",()=>approve())}</>);
      if(p.currentStage===3&&isMy)return bar(<>{modBtn}{rejBtn}{okBtn("Approve",()=>onAction(p,"approve",{actionLabel:`CMIO validated — CPT ${cmioCode} — ${cmioName} confirmed (${cmioStatus||p.cptStatus||"New"})`,comment:comments,cmioData:{cptStatus:cmioStatus||p.cptStatus||"New",accurateCptCode:cmioCode,accurateCptName:cmioName}}))}</>);
      if(p.currentStage===4&&isMy)return bar(okBtn("Submit data",()=>{{const miss=tplMissingUom({procCons,wardsCons,procDrugs,wardsDrugs});if(miss){alert(`${miss} template item(s) have no UOM selected. The UOM chooses the price, so a line without one would cost nothing.`);return;}}
        onAction(p,"submit",{actionLabel:"Nursing Templates — data submitted",comment:comments,templates:{procCons,wardsCons,procDrugs,wardsDrugs},nursingData:{manpower:nurManpower.filter(Boolean).join("; "),procedureDuration:nurDuration,accommodationDays:nurAccomm,machinesDevices:nurMachines.filter(Boolean).join("; "),machinesDevicesCost:Number(nurMachinesCost)||0,consumablesDrugs:nurConsDrugs.filter(Boolean).join("; "),consumablesDrugsCost:Number(nurConsDrugsCost)||0,labRadiology:nurLabRad.filter(Boolean).join("; "),nursingSuggested:nurSuggest}});setComments("");}));
      if(p.currentStage>=5&&p.currentStage<=9&&isMy)return bar(<>{modBtn}{okBtn("Approve",()=>approve())}</>);
      if(p.currentStage===10&&isMy)return bar(okBtn("Approve",()=>{const f=fcdPayload();setCbox({kind:"costing",f});}));
      if(p.currentStage===11&&p.financial&&isMy)return bar(okBtn("Approve",()=>setCbox({kind:Number(ceoPrice)!==Number(p.financial.finalPatientPrice)?"price":"priceSame"})));
      if(p.currentStage===12&&isMy)return bar(okBtn("Approve",()=>isEditVer?doStage12():setCbox({kind:"lockOp"})));
      if(p.currentStage===13&&isMy)return bar(okBtn("Approve",()=>isEditVer?doStage13():setCbox({kind:"lockPkg"})));
      if(p.currentStage===14&&isMy)return bar(okBtn("Approve",()=>onAction(p,"approve",{actionLabel:isEditVer?"CSCM confirmed templates (adjusted if needed)":(tlDone==="Yes"?"CSCM linked the OT templates on live":"CSCM recorded the OT template numbers — linking not yet complete"),comment:comments,linkData:{procConsTemplate:tlPC,wardsConsTemplate:tlWC,procDrugsTemplate:tlPD,wardsDrugsTemplate:tlWD,linkingCompleted:tlDone},attachments:[...(p.attachments||[]),...proof.map(f=>({...(typeof f==="string"?{name:f}:f),kind:"PrimeCare proof",step:"CSCM Template Link"}))]})));
      if(p.currentStage===15&&isMy)return bar(okBtn("Acknowledge",()=>setCbox({kind:"finalise"}),"shieldCheck"));
      if((p.status==="cpt_exists_cfo_ack"&&role==="cfo")||(p.status==="cpt_exists_cmo_ack"&&role==="cmo"))return <ActionBar more={more} label="CPT Exists — Acknowledgement" me={me}>
        <button onClick={()=>setShowActionModal("ack_exists")} style={{...BTN,background:T.ok,color:"#fff"}}><Ic n="shieldCheck" s={13}/>Acknowledge</button>
      </ActionBar>;
      {
        const util=[];
        if(p.status==="approved")util.push({ic:"pencil",l:"Edit Package",fn:()=>openReq?null:startEdit(),disabled:!!openReq,title:openReq?`${openReq.id} is in approval — one change at a time`:""});
        if(p.status==="approved"&&(role==="cscm"||me.isSiteAdmin))util.push({ic:"settings",l:"Admin Override — "+(p.lifecycle==="Deactivated"?"Reactivate":"Deactivate"),fn:()=>{setOvReason("");setShowOverride(true);}});
        if(_live&&(me.isSiteAdmin||role==="cscm")&&!p.reassignedTo&&p.currentStage<=15)util.push({ic:"swap",l:`Reassign ${stageDef?.label||""} (${holderName} on leave)`,fn:()=>setShowReassign(true)});
        if(p.status==="approved"&&p.lifecycle!=="Deactivated"&&role!=="doctor")util.push({ic:"ban",l:"Request Deactivation",fn:()=>onRaiseDeact("Deactivation",p),danger:true});
        if(p.status==="approved"&&p.lifecycle==="Deactivated"&&role!=="doctor")util.push({ic:"rotateCcw",l:"Request Reactivation",fn:()=>onRaiseDeact("Reactivation",p)});
        if(!util.length)return null;
        const vlbl=p.status==="approved"?(p.lifecycle==="Deactivated"?"Deactivated Package":"Approved & Active Package"):("Waiting: "+(stageDef?.label||p.status));
        const vsub=p.status==="approved"?("Version "+(p.version||1)+" · record actions"):"No decision is needed from you at this step";
        const vicon=p.status==="approved"?"shieldCheck":"clock";
        return <ActionBar label={vlbl} sub={vsub} icon={vicon} me={me}>
          {util.map((u,ix)=><button key={ix} onClick={u.fn} disabled={u.disabled} title={u.title||""} style={{...BTN2,border:`1px solid ${u.danger?T.err:T.border}`,color:u.danger?T.err:T.text,opacity:u.disabled?0.45:1,cursor:u.disabled?"not-allowed":"pointer"}}><Ic n={u.ic} s={13}/>{u.l}</button>)}
        </ActionBar>;
      }
    })()}

    {cbox&&(()=>{const F=p.financial||{};const tpl=(F.totalConsCost||0)+(F.totalDrugsCost||0);
      const row=(l,v,c,b)=><div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:`1px solid ${T.borderLight}`,fontSize:12.5,fontWeight:b?700:500}}><span style={{color:b?T.text:T.textSec}}>{l}</span><span style={{color:c||T.text,fontWeight:700}}>{v}</span></div>;
      const box=(icon,ic,title,body,content,okLabel,okColor,onOk)=><div onClick={()=>setCbox(null)} style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.45)",zIndex:9996,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:12,width:"100%",maxWidth:460,padding:"18px 20px",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{width:30,height:30,borderRadius:8,background:ic+"18",color:ic,display:"inline-flex",alignItems:"center",justifyContent:"center"}}><Ic n={icon} s={15}/></span><strong style={{fontSize:14.5,color:T.text}}>{title}</strong></div>
          <div style={{fontSize:12,color:T.textSec,lineHeight:1.55,marginBottom:12}}>{body}</div>
          {content}
          <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:14}}>
            <button onClick={()=>setCbox(null)} style={{padding:"8px 18px",borderRadius:7,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",color:T.text}}>Cancel</button>
            <button onClick={()=>{setCbox(null);onOk();}} style={{padding:"8px 18px",borderRadius:7,border:"none",background:okColor,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>{okLabel}</button>
          </div>
        </div></div>;
      if(cbox.kind==="costing"){const f=cbox.f;const total=f._tpl+f.totalServicesCost+(Number(f.additionalServicesCost)||0);const m=total>0?((Number(f.finalPatientPrice)-total)/total*100):0;
        return box("alert",T.warn,"Review this costing before approving","These figures are written to the restricted package-financials record, and the request moves to the CEO for pricing. Check them before approving.",
          <><div style={{background:"#f8fafc",border:`1px solid ${T.border}`,borderRadius:8,padding:"4px 14px"}}>{row("OT Templates subtotal",fmtKWD(f._tpl))}{row("Services & LOS · standard costs",fmtKWD(f.totalServicesCost))}{Number(f.additionalServicesCost)>0&&row("Other additional services",fmtKWD(f.additionalServicesCost))}{row("Total package cost",fmtKWD(total),null,true)}{row("Final patient price",fmtKWD(f.finalPatientPrice),T.ok,true)}{row("Margin (on cost)",m.toFixed(1)+"%",m>=0?T.ok:T.err,true)}</div>
          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:0.5,color:T.textSec,margin:"12px 0 4px"}}>COMMERCIAL TERMS</div>
          {row("Accept Doctor Fees",f.acceptDoctorFees)}{row("Advance Payment (Inpatient Visit)",f.advancePayment)}{row("Service Revenue · Doctors",f.serviceRevenueDoctors)}{row("Maximum CAP Limit",f.hasCap==="Yes"?fmtKWD(f.capLimit):"No")}</>,
          "Approve costing",T.primaryDark||T.primary,()=>{onAction(p,"approve_fcd",{actionLabel:"CFO approved with the FCD details",comment:comments,fcdData:f});setComments("");});}
      if(cbox.kind==="price"||cbox.kind==="priceSame"){const total=F.totalOverallCost||tpl+(F.totalServicesCost||0);const np=Number(ceoPrice);const m=total>0?((np-total)/total*100):0;const ch=cbox.kind==="price";
        return box(ch?"alert":"check",ch?T.warn:T.ok,ch?"Change the patient price?":"Confirm this price?",ch?"Both figures are recorded against this version, and the CFO is told the price changed — the alert itself carries no amount.":"Approving confirms the CFO’s figure unchanged and raises no alert.",
          <div style={{background:"#f8fafc",border:`1px solid ${T.border}`,borderRadius:8,padding:"4px 14px"}}>{row("Total package cost",fmtKWD(total))}{ch&&row("Price before",fmtKWD(F.finalPatientPrice))}{row(ch?"Price after":"Final patient price",fmtKWD(np),T.ok,true)}{row("Margin (on cost)",m.toFixed(1)+"%",m>=0?T.ok:T.err,true)}</div>,
          ch?"Approve new price":"Approve price",T.primaryDark||T.primary,()=>{onAction(p,"approve",{actionLabel:ch?"CEO approved & adjusted the patient price":"CEO approved the patient price",comment:comments,ceoPrice:np});setComments("");});}
      if(cbox.kind==="lockOp")return box("alert",T.err,"Link and lock this operation code?",<>Operation code <strong>{cscmOpCode}</strong> will be linked to this package PERMANENTLY. It cannot be changed afterwards — not on this version and not on any later one, because it is the join between CliniPack and PrimeCare.</>,null,"Link & lock",T.err,doStage12);
      if(cbox.kind==="lockPkg")return box("alert",T.err,"Link and lock this PKGID?",<>PKGID <strong>{pkgId}</strong> will be linked to this package PERMANENTLY and cannot be changed afterwards, on this version or any later one.</>,null,"Link & lock",T.err,doStage13);
      if(cbox.kind==="finalise")return box("alert",T.warn,"Finalise this package?",<>Acknowledging closes {p.id} as approved for version {p.version||1}. Its certificate is then issued and emailed to the configured recipients. It cannot be undone from here.</>,null,"Acknowledge & finalise",T.primaryDark||T.primary,()=>{onAction(p,"acknowledge",{actionLabel:"CFO Acknowledgement — acknowledged; package approved",comment:comments});setComments("");});
      return null;})()}
    <ActionModal isOpen={showActionModal==="approve"} onClose={()=>setShowActionModal(null)} title="Approve — Confirm Action" procId={p.id} stageName={stageDef?.label||""}
      actions={[{label:"✓ Confirm Approval",color:T.ok,onClick:(c)=>{onAction(p,"approve",{actionLabel:`${stageDef?.label} — Approved${c?": "+c:""}`});setShowActionModal(null);}}]}>
      <div style={{padding:16,background:"#f0fdf4",borderRadius:8,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:600,color:T.ok}}>You are about to approve this request at stage: {stageDef?.label}</div>
        <div style={{fontSize:11,color:T.textSec,marginTop:4}}>The request will advance to the next stage in the approval chain.</div>
      </div>
      <div style={{fontSize:12,marginBottom:8}}><strong>Request:</strong> {p.accurateCptName||p.proposedCptName} ({p.id})</div>
      <div style={{fontSize:12}}><strong>Next stage:</strong> {STAGES.find(s=>s.num===(p.currentStage+1))?.label||"Complete"}</div>
    </ActionModal>

    <ActionModal isOpen={showActionModal==="reject"} onClose={()=>setShowActionModal(null)} title="Reject — End Request" procId={p.id} stageName={stageDef?.label||""}
      actions={[{label:"✕ Confirm Rejection",color:T.err,onClick:(c)=>{if(!c?.trim()){alert("Comments required for rejection");return;}onAction(p,"reject",{actionLabel:"Rejected: "+c});setShowActionModal(null);}}]}>
      <div style={{padding:16,background:"#fef2f2",borderRadius:8,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:600,color:T.err}}>This will permanently reject the request</div>
        <div style={{fontSize:11,color:T.textSec,marginTop:4}}>The requestor will be notified. This action cannot be undone.</div>
      </div>
    </ActionModal>

    <ActionModal isOpen={showActionModal==="modify"} onClose={()=>setShowActionModal(null)} title="Request Modification" procId={p.id} stageName={stageDef?.label||""}
      actions={[{label:"↺ Request Modification",color:T.info,onClick:(c)=>{if(!c?.trim()){alert("Comments required for modification");return;}onAction(p,"modify",{actionLabel:"Modification requested: "+c,comment:c});setShowActionModal(null);}}]}>
      <div style={{padding:16,background:"#eff6ff",borderRadius:8,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:600,color:T.info}}>Request will be returned for changes</div>
        <div style={{fontSize:11,color:T.textSec,marginTop:4}}>{p.currentStage>=5?"Returns to Nursing Manager to adjust templates/data.":"Returns to the previous data-entry stage."}</div>
      </div>
    </ActionModal>

    <ActionModal isOpen={showActionModal==="acknowledge"} onClose={()=>setShowActionModal(null)} title="Final Acknowledgement" procId={p.id} stageName="CFO Acknowledgement"
      actions={[{label:"Confirm Acknowledgement",color:T.warn,onClick:(c)=>{onAction(p,"acknowledge",{actionLabel:`CFO Acknowledged — V${p.version}${c?": "+c:""}`});setShowActionModal(null);}}]}>
      <div style={{textAlign:"center",padding:16}}>
        <div style={{marginBottom:8,display:"flex",justifyContent:"center"}}><Ic n="clipboard" s={34} sw={1.6} style={{color:T.warn}}/></div>
        <div style={{fontSize:14,fontWeight:700,color:T.primary}}>All stages are complete</div>
        <div style={{fontSize:12,color:T.textSec,marginTop:4}}>Procedure will become <strong>"Approved & Acknowledged"</strong> as Version {p.version}. Auto-notification will be sent to all stakeholders.</div>
      </div>
    </ActionModal>

    <ActionModal isOpen={showActionModal==="ack_exists"} onClose={()=>setShowActionModal(null)} title="Acknowledge — CPT Exists" procId={p.id} stageName={p.status==="cpt_exists_cfo_ack"?"CFO Ack":"CMO Ack"}
      actions={[{label:"Confirm Acknowledgement",color:T.warn,onClick:(c)=>{
        if(p.status==="cpt_exists_cfo_ack")onAction(p,"ack_cfo_exists",{actionLabel:"CFO Acknowledged (CPT Exists)"});
        else onAction(p,"ack_cmo_exists",{actionLabel:"CMO Acknowledged (CPT Exists)"});
        setShowActionModal(null);}}]}>
      <div style={{padding:16,background:"#fffbeb",borderRadius:8}}>
        <div style={{fontSize:13,fontWeight:600,color:T.warn}}>This CPT code already exists in the system</div>
        <div style={{fontSize:11,color:T.textSec,marginTop:4}}>Acknowledge to confirm and close this request.</div>
      </div>
    </ActionModal>

    <DelegateModal isOpen={showDelegateModal} onClose={()=>setShowDelegateModal(false)} stageName={stageDef?.label||""} delegateRole={stageDef?.delegateTo||""} onSubmit={(delegate,comment)=>{onAction(p,"delegate",{actionLabel:`Forwarded to ${delegate.name}${comment?": "+comment:""}`,delegate,delegateRole:stageDef.delegateTo,delegateComment:comment});setShowDelegateModal(false);}}/>
  </div>;
}
