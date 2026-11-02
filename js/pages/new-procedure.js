// Filterable single-select (live: specialty dropdown with "Type to filter")
function FilterSelect({value,onChange,options,placeholder="Select…"}){
  const sorted=[...options].sort((x,y)=>x.localeCompare(y));
  return <Select value={value||""} onChange={e=>onChange(e.target.value)} style={{width:"100%"}}><option value="">{placeholder}</option>{sorted.map(o=><option key={o} value={o}>{o}</option>)}</Select>;
}
const LOS_LISTS=[
  {k:"manpower",l:"Needed Man Power",ph:"e.g. 1 Surgeon, 1 Anesthetist..."},
  {k:"machinesDevices",l:"Machines & Devices",ph:"e.g. Arthroscopy tower, Tourniquet..."},
  {k:"consumablesDrugs",l:"Major Consumables & Drugs",ph:"e.g. Knee implant system, bone cement"},
  {k:"labRadiology",l:"Lab & Radiology Needs",ph:"e.g. X-ray, CBC, PT/INR"},
  {k:"extraServices",l:"Extra Services",ph:"e.g. Physiotherapy session, Dietitian review"},
];
const losArr=v=>{const a=v?String(v).split(/;\s*/).map(x=>x.trim()).filter(Boolean):[];return a.length?a:[""];};
// Specialties a doctor can raise in a branch — live offers a specialty only once its Chief Surgeon is assigned there.
const offeredSpecs=(specialties,chiefSurgeons,branch)=>{const all=(specialties||[]).filter(s=>s.isActive!==false).map(s=>s.title);const cs=(chiefSurgeons||{})[branch]||{};const on=all.filter(t=>cs[t]);return {on,off:all.length-on.length};};
function NewProcForm({onBack,me,onSubmit,onSaveDraft=()=>{},onDiscardDraft=()=>{},draft=null,procs,nav,opSkills=OP_SKILLS_DEFAULT,specialties=SPECIALTIES_DEFAULT,cptCodes=CPT_CODES_DEFAULT,chiefSurgeons=CHIEF_SURGEONS_DEFAULT}){
  const[fd,setFd]=useState(()=>{const d=draft||{};return {draftId:d.id||null,requestDate:new Date().toISOString(),branch:d.branch||me.branch,requestorUser:me,specialty:d.specialty||"",cptCode:d.proposedCptCode||"",cptName:d.proposedCptName||"",
    patientType:d.patientType||"",anesthesia:d.anesthesia||"",gender:d.gender||"",opSkill:d.opSkill||"",suggestedPrice:d.suggestedPrice||"",accommodationDays:d.accommodationDays!=null&&d.accommodationDays!==""?String(d.accommodationDays):"",procedureDuration:d.procedureDuration||"0:00",
    manpower:losArr(d.manpower),machinesDevices:losArr(d.machinesDevices),consumablesDrugs:losArr(d.consumablesDrugs),labRadiology:losArr(d.labRadiology),extraServices:losArr(d.extraServices),attachments:d.attachments||[]};});
  const[step,setStep]=useState("fill");
  const[existAlert,setExistAlert]=useState(null);
  const[savedAt,setSavedAt]=useState(draft?"loaded":null);
  const[askDiscard,setAskDiscard]=useState(false);
  const upd=(f,v)=>setFd(p=>({...p,[f]:v}));
  const activeCpts=(cptCodes||[]).filter(c=>c.isActive!==false);
  const filtCpts=fd.specialty?activeCpts.filter(c=>c.spec===fd.specialty):activeCpts;
  const checkExist=()=>{};
  const validate=()=>fd.specialty&&fd.cptName&&fd.patientType&&fd.anesthesia&&fd.gender&&fd.opSkill&&fd.accommodationDays!==""&&fd.procedureDuration&&fd.procedureDuration!=="0:00"&&fd.procedureDuration!=="0:0";
  const joined=k=>(fd[k]||[]).filter(Boolean).join("; ");
  const payload=()=>({...fd,manpower:joined("manpower"),labRadiology:joined("labRadiology"),consumablesDrugs:joined("consumablesDrugs"),machinesDevices:joined("machinesDevices"),extraServices:joined("extraServices")});
  const spec=offeredSpecs(specialties,chiefSurgeons,fd.branch);
  const specOpts=fd.specialty&&!spec.on.includes(fd.specialty)?[fd.specialty,...spec.on]:spec.on;
  const btn={padding:"9px 20px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,cursor:"pointer",color:T.textSec,fontFamily:T.font,fontWeight:600};
  const hint={fontSize:10.5,color:T.textMut,marginTop:4};
  // Auto-save (live): the first real change creates the draft, later changes update it — no button press needed.
  const touched=useRef(false);const firstRun=useRef(true);
  useEffect(()=>{if(firstRun.current){firstRun.current=false;return;}touched.current=true;
    const hasContent=fd.specialty||fd.cptCode||fd.cptName||fd.patientType||fd.anesthesia||fd.gender||fd.opSkill||fd.suggestedPrice||fd.accommodationDays||(fd.procedureDuration&&fd.procedureDuration!=="0:00")||LOS_LISTS.some(x=>(fd[x.k]||[]).some(Boolean))||(fd.attachments||[]).length;
    if(!hasContent||step!=="fill")return;
    const t=setTimeout(()=>{const id=onSaveDraft(payload(),true);if(id){if(!fd.draftId)setFd(prev=>({...prev,draftId:id}));setSavedAt(new Date().toLocaleTimeString("en-GB"));}},1200);
    return()=>clearTimeout(t);},[JSON.stringify({...fd,draftId:null})]);

  if(step==="review"){
    const pl=payload();
    const splitList=(s)=>s?String(s).split(/;\s*/).filter(x=>x.trim()):[];
    return<div style={{maxWidth:1600}}>
    <button onClick={()=>setStep("fill")} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:12}}>← Back to edit</button>
    <ST color={T.primary} style={{fontSize:18}}>Review your request</ST>
    <p style={{fontSize:12,color:T.textSec,margin:"-12px 0 16px"}}>Check the details below, then submit. It goes to the CMO for approval.</p>
    <Card style={{marginBottom:14,padding:20}}>
      <ST style={{fontSize:13,color:T.primary,marginBottom:12}}>Request Information</ST>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 24px"}}>
        {[{label:"Request Date",value:fmtDateTime(fd.requestDate)},
          {label:"Branch",value:BRANCHES.find(b=>b.code===fd.branch)?.name||fd.branch},
          {label:"Requestor",value:me.name},
          {label:"Specialty",value:fd.specialty},
          {label:"Proposed CPT Code",value:fd.cptCode||"—"},
          {label:"Proposed CPT Name",value:fd.cptName},
          {label:"Patient Type",value:fd.patientType},
          {label:"Anesthesia Requirement",value:fd.anesthesia},
          {label:"Gender",value:fd.gender},
          {label:"Operation Skill",value:fd.opSkill},
          {label:"Suggested Price",value:fd.suggestedPrice?fmtKWD(fd.suggestedPrice):"—"},
          {label:"Accommodation Days",value:(fd.accommodationDays||0)+" days"},
          {label:"Duration (HH:MM)",value:(fd.procedureDuration||"—")+" hrs"},
        ].map((it,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.borderLight}`}}>
          <span style={{fontSize:12,color:T.textSec}}>{it.label}</span>
          <span style={{fontSize:12,fontWeight:500,color:T.text,textAlign:"right",maxWidth:"60%"}}>{it.value||"—"}</span>
        </div>)}
      </div>
    </Card>
    <Card style={{marginBottom:14,padding:20}}>
      <ST style={{fontSize:13,color:T.primary,marginBottom:12}}>Expected LOS & Services</ST>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[
          {l:"Manpower",icon:"users",items:splitList(pl.manpower),c:T.purple,bg:"#faf5ff"},
          {l:"Machines & Devices",icon:"wrench",items:splitList(pl.machinesDevices),c:T.info,bg:"#eff6ff"},
          {l:"Major Consumables & Drugs",icon:"pill",items:splitList(pl.consumablesDrugs),c:"#7c3aed",bg:"#f5f3ff"},
          {l:"Lab & Radiology Needs",icon:"microscope",items:splitList(pl.labRadiology),c:T.teal||"#0d9488",bg:"#f0fdfa"},
          {l:"Extra Services",icon:"plus",items:splitList(pl.extraServices),c:"#d97706",bg:"#fffbeb"},
        ].map((f,i)=><div key={i} style={{padding:0,background:"#fff",borderRadius:8,border:`1px solid ${T.borderLight}`,borderLeft:`3px solid ${f.c}`,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:f.bg,borderBottom:`1px solid ${T.borderLight}`}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><Ic n={f.icon} s={13}/><span style={{fontSize:11,color:f.c,fontWeight:700,textTransform:"uppercase",letterSpacing:0.3}}>{f.l}</span></div>
            <span style={{fontSize:10,color:T.textMut,fontWeight:600,padding:"2px 8px",background:"#fff",borderRadius:10,border:`1px solid ${T.border}`}}>{f.items.length} {f.items.length===1?"item":"items"}</span>
          </div>
          <div style={{padding:"10px 14px",maxHeight:200,overflowY:"auto",flex:1}}>
            {f.items.length===0?<div style={{fontSize:11,color:T.textMut,fontStyle:"italic",padding:"6px 0"}}>Not specified</div>:
            f.items.map((it,j)=><div key={j} style={{display:"flex",gap:8,fontSize:11,color:T.text,padding:"3px 0"}}><span style={{color:f.c,fontWeight:700,minWidth:20,fontSize:10,background:f.bg,borderRadius:3,padding:"1px 5px",textAlign:"center"}}>{j+1}</span><span style={{flex:1,lineHeight:1.4}}>{it.trim()}</span></div>)}
          </div>
        </div>)}
      </div>
    </Card>
    <Card style={{marginBottom:14,padding:20}}>
      <ST style={{fontSize:13,color:T.primary,marginBottom:10}}>Attachments</ST>
      {(fd.attachments||[]).length===0?<div style={{fontSize:11.5,color:T.textMut,fontStyle:"italic"}}>No documents attached</div>:
        (fd.attachments||[]).map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,padding:"5px 0",color:T.info}}><Ic n="fileText" s={13}/>{attName(f)}</div>)}
    </Card>
    <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
      <button onClick={()=>setStep("fill")} style={btn}>← Back to edit</button>
      <button onClick={()=>onSubmit(pl)} style={{padding:"10px 24px",borderRadius:6,border:"none",background:T.ok,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>✓ Submit</button>
    </div>
  </div>;
  }

  return<div style={{maxWidth:1600}}>
    <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:12}}>← Back to dashboard</button>
    <ST color={T.primary} style={{fontSize:18}}>New procedure request</ST>
    <WfTracker stages={STAGES} cur={0}/>
    {existAlert&&<Card style={{margin:"12px 0 16px",background:"#f8fafc",border:`1px solid ${T.border}`,borderLeft:`3px solid ${T.warn}`}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><Ic n="alert" s={18} style={{color:T.warn}}/><div>
        <div style={{fontSize:13,fontWeight:600,color:T.warn}}>CPT Already Exists!</div>
        <div style={{fontSize:11,color:T.textSec}}>"{existAlert.proposedCptName}" ({existAlert.proposedCptCode}) exists as Procedure #{existAlert.id}.</div>
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button onClick={()=>nav("detail",existAlert)} style={{padding:"5px 12px",borderRadius:6,border:`1px solid ${T.info}`,background:"#eff6ff",color:T.info,fontSize:11,fontWeight:600,cursor:"pointer"}}>View Details</button>
        </div>
      </div></div>
    </Card>}
    <Card style={{margin:"16px 0"}}>
      <ST>Request details</ST>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div><label style={lbl}>Request Date</label><input style={{...inp,background:"#f5f5f5",cursor:"not-allowed"}} value={fmtDateTime(fd.requestDate)} disabled/><div style={hint}>Set by the system when you submit.</div></div>
        <div><label style={lbl}>Branch <span style={{color:T.err}}>*</span></label><Select style={inp} value={fd.branch} onChange={e=>upd("branch",e.target.value)}>{BRANCHES.map(b=><option key={b.code} value={b.code}>{b.name}</option>)}</Select>
          <div style={hint}>Defaulted to {BRANCHES.find(b=>b.code===me.branch)?.name||me.branch} from your directory record — change it if this request is for the other branch.</div></div>
        <div><label style={lbl}>Requestor Name <span style={{color:T.err}}>*</span></label><input style={{...inp,background:"#f5f5f5",cursor:"not-allowed"}} value={me.name} disabled/></div>
        <div><label style={lbl}>Proposed CPT Specialty <span style={{color:T.err}}>*</span></label>
          <FilterSelect value={fd.specialty} options={specOpts} placeholder="Select specialty…" onChange={v=>{upd("specialty",v);upd("cptCode","");upd("cptName","");setExistAlert(null);}}/>
          {spec.off>0&&<div style={hint}>{spec.off} specialties are not offered — no Chief Surgeon is assigned at this branch yet (Setup → Approval Workflow).</div>}</div>
        <div><label style={lbl}>Proposed CPT Code</label>
          <AutoComplete value={fd.cptCode} onChange={v=>{if(typeof v==="object"&&v.code){upd("cptCode",v.code);upd("cptName",v.name);upd("specialty",v.spec);checkExist(v.code);}else if(typeof v==="string"){upd("cptCode",v);}}} options={filtCpts} placeholder="Search or enter code..." displayFn={c=>`${c.code} — ${c.name}`} filterFn={(c,q)=>c.code.includes(q)||c.name.toLowerCase().includes(q.toLowerCase())}/>
        </div>
        <div><label style={lbl}>Proposed CPT Name <span style={{color:T.err}}>*</span></label>
          <AutoComplete value={fd.cptName} onChange={v=>{if(typeof v==="object"&&v.code){upd("cptCode",v.code);upd("cptName",v.name);upd("specialty",v.spec);checkExist(v.code);}else if(typeof v==="string"){upd("cptName",v);}}} options={filtCpts} placeholder="Search or enter name..." displayFn={c=>c.name} filterFn={(c,q)=>c.name.toLowerCase().includes(q.toLowerCase())}/>
        </div>
        <div><label style={lbl}>Patient Type <span style={{color:T.err}}>*</span></label><Select style={inp} value={fd.patientType} onChange={e=>upd("patientType",e.target.value)}><option value="">Select…</option>{PATIENT_TYPES.map(o=><option key={o} value={o}>{o}</option>)}</Select></div>
        <div><label style={lbl}>Anesthesia Requirement <span style={{color:T.err}}>*</span></label><Select style={inp} value={fd.anesthesia} onChange={e=>upd("anesthesia",e.target.value)}><option value="">Select…</option>{ANESTHESIA_OPTS.map(o=><option key={o} value={o}>{o}</option>)}</Select></div>
        <div><label style={lbl}>Gender <span style={{color:T.err}}>*</span></label><Select style={inp} value={fd.gender} onChange={e=>upd("gender",e.target.value)}><option value="">Select…</option>{GENDER_OPTS.map(o=><option key={o} value={o}>{o}</option>)}</Select></div>
        <div><label style={lbl}>Operation Skill <span style={{color:T.err}}>*</span></label><FilterSelect value={fd.opSkill} options={opSkills.filter(o=>o.isActive!==false).map(o=>o.title)} placeholder="Select…" onChange={v=>upd("opSkill",v)}/></div>
        <KWDInput label="Suggested Procedure Patient Price" value={fd.suggestedPrice} onChange={v=>upd("suggestedPrice",v)}/>
        <div><label style={lbl}>Accommodation Days <span style={{color:T.err}}>*</span></label><input type="number" min="0" style={inp} value={fd.accommodationDays} onChange={e=>upd("accommodationDays",e.target.value)}/></div>
        <DurationPicker label="Approximate Duration of Procedure" value={fd.procedureDuration} onChange={v=>upd("procedureDuration",v)} required/>
      </div>
    </Card>
    <Card style={{marginBottom:16}}>
      <ST>Expected LOS & services</ST>
      {LOS_LISTS.map(x=><ListCard key={x.k} title={x.l} items={fd[x.k]} onChange={v=>upd(x.k,v)} placeholder={x.ph}/>)}
    </Card>
    <Card style={{marginBottom:16}}>
      <ST>Attachments <span style={{fontSize:11,fontWeight:400,color:T.textMut}}>(optional)</span></ST>
      <AttachmentBox files={fd.attachments||[]} onChange={v=>upd("attachments",v)} step="Doctor Request" by={me.name}/>
    </Card>
    {askDiscard&&<div onClick={()=>setAskDiscard(false)} style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.45)",zIndex:9996,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:10,width:440,padding:"18px 20px",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{width:30,height:30,borderRadius:8,background:"#fef2f2",color:T.err,display:"inline-flex",alignItems:"center",justifyContent:"center"}}><Ic n="alert" s={15}/></span><strong style={{fontSize:14,color:T.text}}>Discard this draft?</strong></div>
        <div style={{fontSize:12,color:T.textSec,marginBottom:16}}>Draft will be removed from your lists. This cannot be undone.</div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
          <button onClick={()=>setAskDiscard(false)} style={btn}>Cancel</button>
          <button onClick={()=>{setAskDiscard(false);onDiscardDraft(fd.draftId);}} style={{...btn,border:"none",background:T.err,color:"#fff"}}>Discard draft</button>
        </div>
      </div>
    </div>}
    <div style={{display:"flex",gap:10,justifyContent:"flex-end",alignItems:"center"}}>
      {fd.draftId&&savedAt&&<span style={{marginRight:"auto",fontSize:11,color:T.textMut}}>{savedAt==="loaded"?"Draft":"Saved "+savedAt} · status: Draft</span>}
      <button onClick={onBack} style={btn}>Cancel</button>
      {fd.draftId&&<button onClick={()=>setAskDiscard(true)} style={{...btn,borderColor:T.err,color:T.err}}>Discard draft</button>}
      <button onClick={()=>{const id=onSaveDraft(payload());if(id){if(!fd.draftId)upd("draftId",id);setSavedAt(new Date().toLocaleTimeString("en-GB"));}}} style={btn}>{fd.draftId?"Save draft":"Save as draft"}</button>
      <button onClick={()=>{if(validate())setStep("review");}} title={validate()?"":"Fill every required field: Specialty, CPT Name, Patient Type, Anesthesia, Gender, Operation Skill, Accommodation Days, Duration"} style={{padding:"9px 20px",borderRadius:6,border:"none",background:validate()?T.primary:"#94a3b8",color:"#fff",fontSize:12,fontWeight:600,cursor:validate()?"pointer":"not-allowed",fontFamily:T.font}}>Press Review →</button>
    </div>
  </div>;
}
