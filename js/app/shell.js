// ═══════════════════════════════════════════════════════════════
// MAIN APP — matches Item Evaluation architecture exactly
// ═══════════════════════════════════════════════════════════════
function CliniPack(){
  const[selUserId,setSelUserId]=useState(()=>sessionStorage.getItem("clinipack-user")||"u1");
  useEffect(()=>{sessionStorage.setItem("clinipack-user",selUserId);},[selUserId]);
  const[showUserPicker,setShowUserPicker]=useState(false);
  const[showBell,setShowBell]=useState(false);
  const userPickerRef=useRef(null);
  const me=U.find(u=>u.id===selUserId)||U[0];
  const role=me.role;
  const switchUser=u=>{setSelUserId(u.id);setShowUserPicker(false);setView("mytasks");setSbPage("My Tasks");setSelProc(null);setDetailTab(null);setSetupSection(null);};
  useEffect(()=>{if(!showUserPicker)return;const h=e=>{if(userPickerRef.current&&!userPickerRef.current.contains(e.target))setShowUserPicker(false);};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[showUserPicker]);

  const[view,setView]=useState("mytasks");
  const[selProc,setSelProc]=useState(null);
  const[sbPage,setSbPage]=useState("My Tasks");
  const[allProcs,setAllProcs]=useState(PROCS);
  const[opSkills,setOpSkills]=useState(OP_SKILLS_DEFAULT);
  const[categories,setCategories]=useState(MASTER_CATEGORIES);
  const[specialties,setSpecialties]=useState(SPECIALTIES_DEFAULT);
  const[cptCodes,setCptCodes]=useState(CPT_CODES_DEFAULT);
  // Value-less (non-financial) edit requests — Requestor Chief → CMO → CMIO
  const[vlReqs,setVlReqs]=useState(()=>seedEditReqs(PROCS,EDIT_DESIGN_DEFAULT,APPROVAL_CONFIG_DEFAULT));
  const[editDesign,setEditDesign]=useState(EDIT_DESIGN_DEFAULT);
  const[readNotifs,setReadNotifs]=useState([]);
  const[amendId,setAmendId]=useState(null);
  const[selVl,setSelVl]=useState(null);
  const[vlRaise,setVlRaise]=useState(null);
  const raiseVl=base=>setVlRaise(base);
  const openVl=r=>{const id=typeof r==="string"?r:(r&&r.id);setSelVl(id);setView("vl_detail");};
  const submitVl=(group,payload,reason,baseOverride)=>{
    const b=baseOverride||vlRaise;const idn="NF-"+String(vlReqs.length+1).padStart(3,"0");
    const chain=resolveMChain(group,b,approvalConfig);
    const req={id:idn,baseId:b.id,cpt:b.accurateCptName||b.proposedCptName,branch:b.branch,groupId:group.id,groupName:group.name,special:group.special||null,
      changes:payload.changes||[],pairs:payload.pairs||null,reason,chain,stage:0,phase:"approval",confirmRole:group.confirm,status:"pending",done:false,
      raisedBy:me.name,date:new Date().toISOString().slice(0,10),timeline:[{by:me.name,action:`Raised — ${group.name}`,date:now()}]};
    setVlReqs([...vlReqs,req]);setVlRaise(null);setSelVl(idn);if(!baseOverride)setView("vl_detail");
    showToast(`${idn} raised — routed to ${chain[0]?chain[0].name:group.confirm}`);
    return idn;
  };
  const applyVl=r=>{setAllProcs(prev=>prev.map(p=>{if(p.id!==r.baseId)return p;let u={...p};
      const nv=(u.version||1)+1;u.version=nv;
      const stamp=now();const fin=r.kind==="fin";
      const sigEntries=(r.timeline||[]).filter(t=>/Approved|Confirmed/.test(t.action||"")).map(t=>({ver:nv,date:t.date,type:"approve",user:t.by,action:t.action}));
      if(r.special==="obsolete"){u.timeline=[...u.timeline,...sigEntries,{ver:nv,date:stamp,type:"complete",user:r.raisedBy,action:`Obsolete item codes replaced via ${r.id}: ${(r.pairs||[]).filter(x=>x.old&&x.new).map(x=>`${x.old} → ${x.new}`).join(", ")} — Version ${nv}`}];}
      else{(r.changes||[]).forEach(c=>{const f=MFIELDS[c.k];if(f)f.set(u,c.to);});
        if(u.financial&&u.financial.totalOverallCost){const c=u.financial.totalOverallCost;u.financial={...u.financial,marginPercent:c>0?((Number(u.financial.finalPatientPrice)-c)/c)*100:0};}
        u.timeline=[...u.timeline,...sigEntries,{ver:nv,date:stamp,type:"complete",user:r.raisedBy,action:`Combined change ${r.id} applied (${editReqLabel(r)}) — Version ${nv}`}];}
      u.editDiff={fromVersion:nv-1,items:(r.changes||[]).map(c=>({label:c.l,old:c.from||"—",new:c.to||"—"}))};
      u.versionHistory=[...(u.versionHistory||[]),{version:nv,date:stamp.slice(0,10),changedBy:r.raisedBy||"Change Request",change:fin?"Financial edit":"Non-financial edit",summary:`Combined change ${r.id} — ${editReqLabel(r)}`,editDiff:(r.changes||[]).map(c=>({l:c.l,from:c.from,to:c.to}))}];
      return u;}));};
  // Edit Package — one inline mode. Any finance field → FIN (re-runs the 15 stages as a new version,
  // with roles outside the 15 added as numbered stages); otherwise NF (scenario route + PrimeCare confirm).
  const submitEdit=(b,changes,scenIds,reason)=>{
    if(vlReqs.some(r=>r.baseId===b.id&&!r.done)){showToast("A change is already in approval on this package","err");return null;}
    const rt=buildEditRoute(scenIds,b,editDesign,approvalConfig);const fin=rt.finance;
    if(fin)rt.stages.forEach(s=>{if(s.base===6)s.name=approverFor(6,b.branch,b.specialty)||"Chief Surgeon";});
    const id=(fin?"FIN-":"NF-")+String(vlReqs.filter(r=>(r.kind==="fin")===fin).length+1).padStart(3,"0");
    const lbl=scenIds.map(s=>SCEN_SHORT[s]||s).join(" + ");const td=new Date().toISOString().slice(0,10);
    const req={id,kind:fin?"fin":"nf",baseId:b.id,cpt:b.accurateCptName||b.proposedCptName,branch:b.branch,scenarios:scenIds,groupId:scenIds[0],groupName:lbl,changes,reason,
      ...(fin?{stages:rt.stages,stage:1}:{chain:rt.steps,confirmRole:rt.confirm,stage:0}),
      phase:(!fin&&!rt.steps.length)?"confirm":"approval",status:"pending",done:false,raisedBy:me.name,fromVer:b.version||1,toVer:(b.version||1)+1,date:td,stageDate:td,
      timeline:[{by:me.name,action:`Amendment ${id} raised — ${lbl} — "${reason}"`,date:now()}]};
    setVlReqs(prev=>[...prev,req]);
    showToast(`${id} raised — ${fin?`re-running ${rt.total} stages as V${req.toVer}; V${req.fromVer} stays in force`:`routed to ${rt.steps[0]?rt.steps[0].name:"PrimeCare confirm"}`}`);
    return id;
  };
  const actVl=(r,action,comment)=>{
    const asAdmin=!editTurn(r,me)&&me.isSiteAdmin;const tag=asAdmin?" (as CPT-Admin)":"";const td=new Date().toISOString().slice(0,10);
    const up=fn=>setVlReqs(prev=>prev.map(x=>x.id!==r.id?x:fn(x)));
    const curLbl=x=>x.kind==="fin"?((x.stages[x.stage]||{}).full||(x.stages[x.stage]||{}).label):x.phase==="confirm"?`PrimeCare confirm (${x.confirmRole})`:((x.chain[x.stage]||{}).label||"Approver");
    if(action==="reject"){up(x=>({...x,status:"rejected",done:true,phase:"done",timeline:[...x.timeline,{by:me.name,action:`${curLbl(x)} — Rejected${tag}${comment?": "+comment:""}`,date:now()}]}));showToast(`${r.id} rejected — package ${r.baseId} is unchanged`,"warn");return;}
    if(action==="withdraw"){up(x=>({...x,status:"withdrawn",done:true,phase:"done",timeline:[...x.timeline,{by:me.name,action:`Withdrawn — package stays at V${x.fromVer}`,date:now()}]}));showToast(`${r.id} withdrawn — package returns to V${r.fromVer}`,"info");return;}
    if(action==="return"){up(x=>({...x,status:"returned",phase:"returned",returnNote:{by:me.name,text:comment,date:td},timeline:[...x.timeline,{by:me.name,action:`${x.id} returned for changes — with ${x.raisedBy}${tag} — "${comment}"`,date:now()}]}));showToast(`${r.id} returned to ${r.raisedBy}`,"warn");return;}
    if(action==="resubmit"){up(x=>({...x,status:"pending",phase:"approval",stage:x.kind==="fin"?1:0,stageDate:td,changes:comment&&comment.changes?comment.changes:x.changes,returnNote:null,timeline:[...x.timeline,{by:me.name,action:`${x.id} amended and sent round again — restarts at the first step`,date:now()}]}));showToast(`${r.id} resubmitted — restarts at the first step`);return;}
    const x=vlReqs.find(q=>q.id===r.id);if(!x)return;const lbl=curLbl(x);const cm=comment?": "+comment:"";let nx,applyNow=false;
    if(x.kind==="fin"){
      if(x.stage>=x.stages.length-1){applyNow=true;nx={...x,phase:"done",status:"completed",done:true,timeline:[...x.timeline,{by:me.name,action:`${lbl} — Acknowledged${tag} — applied as V${x.toVer}`,date:now()}]};}
      else nx={...x,stage:x.stage+1,stageDate:td,timeline:[...x.timeline,{by:me.name,action:`${lbl} — Approved${tag}${cm}`,date:now()}]};}
    else if(x.phase==="confirm"){applyNow=true;nx={...x,phase:"done",status:"completed",done:true,timeline:[...x.timeline,{by:me.name,action:`Confirmed on PrimeCare${tag} — applied as V${x.toVer}`,date:now()}]};}
    else if(x.stage>=x.chain.length-1)nx={...x,phase:"confirm",stage:x.chain.length,stageDate:td,timeline:[...x.timeline,{by:me.name,action:`${lbl} — Approved${tag}${cm} · awaiting PrimeCare confirm`,date:now()}]};
    else nx={...x,stage:x.stage+1,stageDate:td,timeline:[...x.timeline,{by:me.name,action:`${lbl} — Approved${tag}${cm} · sent to ${x.chain[x.stage+1].label}`,date:now()}]};
    setVlReqs(prev=>prev.map(q=>q.id===x.id?nx:q));
    if(applyNow){applyVl(x);showToast(`${x.id} applied — package ${x.baseId} is now V${x.toVer} · certificate issued`);}
    else showToast(`Approved — ${editStepLabel(nx)}`);
  };
  const[approvalConfig,setApprovalConfig]=useState(APPROVAL_CONFIG_DEFAULT);
  const[chiefSurgeons,setChiefSurgeons]=useState(CHIEF_SURGEONS_DEFAULT);
  const[tplMasters,setTplMasters]=useState(()=>TPL_MASTERS_SEED.map(hydrateTpl));
  // Migration staging (ItemSure pattern): records stay Draft → Pending approval → Migrated; only approval creates the package
  const[migStaged,setMigStaged]=useState([]);
  const stageMigRows=rows=>{setMigStaged(rows.map(r=>({...r,_stageId:String(r.pkgId||"row"+r._row),status:"draft",manager:"",relatedPeople:[],attachments:[],comments:""})));};
  const updateStaged=(sid,patch)=>setMigStaged(prev=>prev.map(r=>r._stageId===sid?{...r,...patch}:r));
  const sendStagedForApproval=sid=>{updateStaged(sid,{status:"pending"});showToast("Sent to manager for approval");};
  const rejectStaged=(sid,note)=>{updateStaged(sid,{status:"draft",rejectNote:note||"Returned by manager"});showToast("Returned to draft");};
  const approveStaged=sid=>{
    const r=migStaged.find(x=>x._stageId===sid); if(!r)return;
    if(allProcs.some(p2=>String(p2.id)===String(r.pkgId))){showToast("PKGID "+r.pkgId+" already exists — nothing migrated","err");return;}
    migrateRows([r]);
    setMigStaged(prev=>prev.map(x=>x._stageId===sid?{...x,status:"migrated"}:x));
    setTimeout(()=>setAllProcs(p2=>p2.map(pp=>String(pp.id)===String(r.pkgId)?{...pp,migrationMeta:{...(pp.migrationMeta||{}),relatedPeople:r.relatedPeople||[],completed:true,approvedBy:r.manager||me.name},attachments:[...(pp.attachments||[]),...(r.attachments||[])]}:pp)),60);
    showToast("Approved — package migrated and live under Approved");};
  const[emailConfig,setEmailConfig]=useState(EMAIL_CONFIG_DEFAULT);
  const[slaConfig,setSlaConfig]=useState(SLA_CONFIG_DEFAULT);
  // #14 — master-data audit
  const[auditLog,setAuditLog]=useState(AUDIT_SEED);
  const logAudit=(entity,key,action,field,oldValue,newValue,note="")=>
    setAuditLog(prev=>[{date:now(),user:me.name,role:me.title,entity,key,action,field,oldValue,newValue,note},...prev]);
  const[deactReqs,setDeactReqs]=useState(DEACT_SEED);
  const[selDeact,setSelDeact]=useState(null);
  const[deactRaise,setDeactRaise]=useState(null);
  const raiseDeact=(type,base)=>{
    // Guard the action, not just the button.
    if(base.status!=="approved"){showToast("Only an approved procedure can be deactivated or reactivated","err");return;}
    const isDeactivated=base.lifecycle==="Deactivated";
    if(type==="Deactivation"&&isDeactivated){showToast("This procedure is already deactivated","warn");return;}
    if(type==="Reactivation"&&!isDeactivated){showToast("This procedure is already active","warn");return;}
    setDeactRaise({type,base});
  };
  const openDeact=r=>{setSelDeact(r.id);setView("deact_detail");};
  const submitDeact=(just,addl)=>{const idn="DR-"+String(deactReqs.length+1).padStart(3,"0");const b=deactRaise.base;const req={id:idn,reqType:deactRaise.type,baseId:b.id,cpt:b.accurateCptName||b.proposedCptName,pkgId:b.systemSetup?.pkgId||"—",opCode:b.systemSetup?.opCode||"—",justification:just,additionalDetails:addl,stage:1,status:"pending",done:false,attachments:[],date:new Date().toISOString().split("T")[0],timeline:[{by:me.name,action:deactRaise.type+" request raised",date:now()}]};setDeactReqs([...deactReqs,req]);const t=deactRaise.type;setDeactRaise(null);setSelDeact(idn);setView("deact_detail");showToast(`${t} request ${idn} raised`);};
  const actDeact=(r,action,comment)=>{setDeactReqs(deactReqs.map(x=>{if(x.id!==r.id)return x;if(action==="reject")return {...x,status:"rejected",done:true,timeline:[...x.timeline,{by:me.name,action:"Rejected"+(comment?": "+comment:""),date:now()}]};const cur=DEACT_STAGES[x.stage-1];const verb=x.stage===DEACT_STAGES.length?"Acknowledged":x.stage===DEACT_STAGES.length-1?"Confirmed change on PrimeCare":"Approved";const last=x.stage>=DEACT_STAGES.length;return {...x,stage:last?x.stage:x.stage+1,status:last?"completed":"pending",done:last,timeline:[...x.timeline,{by:me.name,action:cur.label+" — "+verb+(comment?": "+comment:""),date:now()}]};}));if(action==="approve"&&r.stage>=DEACT_STAGES.length){
      const next=r.reqType==="Deactivation"?"Deactivated":"Active";
      setAllProcs(prev=>prev.map(x=>x.id!==r.baseId?x:{...x,lifecycle:next,
        timeline:[...x.timeline,{date:now(),action:`${r.reqType} approved — procedure marked ${next} (${r.id})`,user:me.name,role:me.title,type:"complete"}]}));
      showToast(""+r.reqType+" complete — procedure marked "+next+" · auto-email sent");
    }};
  const[toast,setToast]=useState(null);

  const showToast=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),4000);};
  const[detailTab,setDetailTab]=useState(null);
  const[setupSection,setSetupSection]=useState(null);
  const nav=useCallback((v,p=null)=>{setView(v);setSelProc(p);setDetailTab(null);if(v!=="setup")setSetupSection(null);},[]);
  const[allFilter,setAllFilter]=useState("all");
  const[autoEdit,setAutoEdit]=useState(null);
  // One builder for Save draft and Submit — a draft keeps its number when it is finally submitted.
  const procFromForm=(fd,mode)=>{
    const nid=fd.draftId||String(Math.max(0,...allProcs.map(x=>parseInt(x.id,10)||0))+1).padStart(5,"0");
    const who=fd.requestorUser||me;const sub=mode==="submit";const prev=allProcs.find(x=>x.id===fd.draftId);
    const entry={manpower:fd.manpower,machinesDevices:fd.machinesDevices||"",consumablesDrugs:fd.consumablesDrugs,labRadiology:fd.labRadiology,extraServices:fd.extraServices||"",accommodationDays:fd.accommodationDays,procedureDuration:fd.procedureDuration};
    return {id:nid,version:1,status:sub?"pending_cmo":"draft",requestDate:sub?new Date().toISOString():(prev?prev.requestDate:new Date().toISOString()),branch:fd.branch,requestor:who,specialty:fd.specialty,proposedCptCode:fd.cptCode,proposedCptName:fd.cptName,cptStatus:"",accurateCptCode:"",accurateCptName:"",
      patientType:fd.patientType,anesthesia:fd.anesthesia,gender:fd.gender,opSkill:fd.opSkill,suggestedPrice:fd.suggestedPrice,...entry,machinesDevicesCost:0,consumablesDrugsCost:0,attachments:fd.attachments||[],
      doctorEntry:sub?entry:null,currentStage:sub?2:1,stageStartDate:new Date().toISOString(),delegatedTo:null,
      templates:{procCons:[],wardsCons:[],procDrugs:[],wardsDrugs:[]},financial:null,systemSetup:null,
      timeline:[...((prev&&prev.timeline)||[]),...(sub?[{date:now(),action:"Request raised and submitted for CMO approval",user:who.name,role:"Doctor",type:"create"}]:(prev?[]:[{date:now(),action:"Draft saved",user:who.name,role:"Doctor",type:"draft"}]))],
      versionHistory:sub?[{version:1,date:new Date().toISOString().split("T")[0],changedBy:who.name,summary:"New procedure request"}]:[]};
  };

  // ─── MIGRATION (#40/#41) — validated rows land as Approved · Active, bypassing the chain ───
  const migrateRows=(rows)=>{
    const stamp=now();const today=new Date().toISOString().slice(0,10);
    const mByNo={};tplMasters.forEach(t=>{mByNo[t.type+":"+t.no]=t;});
    const madeItems=(nums,type)=>{const proc=[],ward=[];
      nums.forEach(no=>{const t=mByNo[type+":"+no];if(!t)return;
        const items=t.items.map(it=>({code:it.code,name:it.name,uom:it.uom,qty:it.qty,unitCost:it.cost,salePrice:it.sale,totalCost:Number((it.qty*it.cost).toFixed(3)),tplNo:t.no,uoms:[{unit:it.uom,cost:it.cost,sale:it.sale}]}));
        (t.ward?ward:proc).push({no:t.no,items});});
      return {proc,ward};};
    const made=rows.map(r=>{
      const P=parseTplList(r.consTpls),Q=parseTplList(r.drugTpls);
      const cons=madeItems(P,1),drugs=madeItems(Q,2);
      const flat=a=>a.reduce((s,t)=>[...s,...t.items],[]);
      const procCons=flat(cons.proc),wardsCons=flat(cons.ward),procDrugs=flat(drugs.proc),wardsDrugs=flat(drugs.ward);
      const tplC=[...procCons,...wardsCons,...procDrugs,...wardsDrugs].reduce((s,i2)=>s+i2.totalCost,0);
      const consC=[...procCons,...wardsCons].reduce((s,i2)=>s+i2.totalCost,0);
      const drugC=[...procDrugs,...wardsDrugs].reduce((s,i2)=>s+i2.totalCost,0);
      const accom=Number(r.accom)||0,addl=Number(r.addl)||0,price=Number(r.price)||0;
      const overall=Number((tplC+accom+addl).toFixed(3));
      const joinNos=a=>a.map(t=>t.no).join(" , ");
      return {
      id:String(r.pkgId),version:1,status:"approved",lifecycle:"Active",migrated:true,
      requestDate:r.extractDate||today,branch:"Migrated",specialty:"",
      requestor:{name:"Migrated (legacy data)",title:"PrimeCare import"},
      proposedCptCode:String(r.cptCode),proposedCptName:r.pkgName,cptStatus:"Existing",
      accurateCptCode:String(r.cptCode),accurateCptName:r.pkgName,
      patientType:"",anesthesia:"",gender:"",opSkill:"",
      suggestedPrice:price,accommodationDays:0,procedureDuration:"",
      manpower:"",labRadiology:"",consumablesDrugs:"",machinesDevices:"",machinesDevicesCost:0,consumablesDrugsCost:0,
      currentStage:16,stageStartDate:today,delegatedTo:null,attachments:[],
      templates:{procCons,wardsCons,procDrugs,wardsDrugs},
      financial:{manpowerCosts:[],manpowerCost:0,surgeryDurationCost:0,accommodationCost:accom,machinesDevicesCosts:[],machinesDevicesCost:0,
        additionalServicesCost:addl,totalServicesCost:accom,totalConsCost:Number(consC.toFixed(3)),totalDrugsCost:Number(drugC.toFixed(3)),
        totalOverallCost:overall,finalPatientPrice:price,ceoAdjustedPrice:null,
        marginPercent:overall>0?Number((((price-overall)/overall)*100).toFixed(1)):0,
        hasCap:r.cap!==""&&r.cap!=null?"Yes":"No",capLimit:Number(r.cap)||0,
        acceptDoctorFees:"Not applicable",advancePayment:"Not applicable",serviceRevenueDoctors:"Not applicable"},
      systemSetup:{opCode:String(r.opCode),opName:String(r.pkgName).slice(0,60),linkedToCpt:"Yes",pkgId:String(r.pkgId),linkedToPkg:"Yes",addedOnSystem:"Yes",
        procConsTemplate:joinNos(cons.proc),wardsConsTemplate:joinNos(cons.ward),procDrugsTemplate:joinNos(drugs.proc),wardsDrugsTemplate:joinNos(drugs.ward),linkingCompleted:"Yes"},
      migrationMeta:{extractDate:r.extractDate||"",latestApprovalDate:r.approvalDate||"",remarksLegacy:r.remarks||"",relatedPeople:[],completed:false,
        drift:(r._warns||[]).filter(w=>w.indexOf("drift")>-1)},
      timeline:[{ver:1,date:stamp,type:"complete",user:"Migration",role:"PrimeCare import",action:`Migrated from legacy data — PKGID ${r.pkgId} · Op ${r.opCode} · costs as of ${r.extractDate||"n/a"}${(r._warns&&r._warns.length)?" · "+r._warns.length+" warning(s)":""}`}],
      versionHistory:[{version:1,date:today,changedBy:"Migration",summary:`Migrated from PrimeCare — templates ${[...P,...Q].join(", ")} · costs as of ${r.extractDate||"n/a"}`}],
    };});
    setAllProcs(prev=>[...prev,...made]);
  };

  // ─── ON-LEAVE COVER (#20 Option B) — Setup approver change + refresh open requests ───
  const openStageCounts=(()=>{const m={};allProcs.forEach(p=>{if(["approved","rejected","cpt_exists"].includes(p.status))return;m[p.branch]=m[p.branch]||{};m[p.branch][p.currentStage]=(m[p.branch][p.currentStage]||0)+1;});return m;})();
  const refreshOpenRequests=(branch,changes)=>{
    const nums=Object.keys(changes).map(Number);let n=0;
    setAllProcs(prev=>prev.map(p=>{
      if(["approved","rejected","cpt_exists"].includes(p.status))return p;
      if(p.branch!==branch||!nums.includes(p.currentStage))return p;
      n++;const ch=changes[p.currentStage];
      // Clearing reassignedTo — a permanent Setup change supersedes any temporary on-leave cover
      return {...p,reassignedTo:null,timeline:[...p.timeline,{date:now(),action:`🔄 Approver refreshed from Setup — Step ${p.currentStage} (${ch.label}): ${ch.from||"— not set —"} → ${ch.to}`,user:me.name,role:me.title,type:"assign"}]};
    }));
    showToast(n>0?`🔄 ${n} open request${n===1?"":"s"} moved to the new approver — auto-email sent`:"No open requests at the changed step(s)",n>0?"ok":"info");
  };

  // ─── ROLE-BASED STAGE CHECK ────────────────────────────────
  // ─── APPROVER RESOLUTION — Setup → Approval Workflow is the source of truth ───
  // Returns the configured approver NAME for a stage on a branch, or null.
  const approverFor=(stage,branch,specialty)=>{
    const c=approvalConfig.find(x=>x.num===stage);
    if(!c||c.active===false)return null;
    if(stage===6&&specialty){const cs=(chiefSurgeons[branch]||{})[specialty];if(cs)return cs;}
    return (c.approvers||{})[branch]||null;
  };
  // Stages switched Off in Setup are skipped by the chain.
  const stageActive=(stage)=>{
    const c=approvalConfig.find(x=>x.num===stage);
    return !c||c.active!==false;
  };
  const nextActiveStage=(from)=>{let s=from;while(s<=15&&!stageActive(s))s++;return s;};

  const canAct=(p)=>{
    if(!p||["approved","rejected","cpt_exists","draft"].includes(p.status))return false;
    const s=p.currentStage;const r=role;
    // On-leave cover (Option A) — a request-wise reassignment overrides everything for this stage only
    if(p.reassignedTo&&p.reassignedTo.stage===s)return p.reassignedTo.email===me.email;
    // If procedure is delegated, only the delegate (by email) can act
    if(p.delegatedTo){
      // delegatedTo can be an email (new format) or role string (legacy)
      if(p.delegatedTo===me.email)return true;
      if(p.delegatedTo===r)return true;
      return false;
    }
    // CPT Exists short path — status-driven, not part of the configurable chain
    if(p.status==="cpt_exists_cfo_ack")return r==="cfo";
    if(p.status==="cpt_exists_cmo_ack")return r==="cmo";
    // Stage 1 is the requesting doctor of THIS request (a returned request comes back to its raiser) — not configurable
    if(s===1)return !!(p.requestor&&p.requestor.email===me.email);
    // Configured chain: the named approver for THIS request's branch acts.
    const cfg=approvalConfig.find(x=>x.num===s);
    if(!cfg)return false;
    if(cfg.active===false)return false;          // step switched Off in Setup
    const name=approverFor(s,p.branch,p.specialty);
    if(name)return me.name===name;               // name from Setup wins
    return cfg.role?r===cfg.role:false;          // fallback only when no approver is set
  };

  // ─── ACTION HANDLER ────────────────────────────────────────
  const handleAction=(proc,action,data={})=>{
    setAllProcs(prev=>{
      const updated=prev.map(p=>{
        if(p.id!==proc.id)return p;
        const u={...p};
        u.timeline=[...u.timeline,{ver:u.version||1,date:now(),action:data.actionLabel||action,user:me.name,role:me.title,type:action,comment:(data.comment||"").trim()||undefined}];

        // Attachments can be added at any step and travel with the request
        if(action==="attach"){u.attachments=data.attachments||[];return u;}
        // Admin override — directly flip lifecycle without the full Deactivation/Reactivation chain
        if(action==="admin_override"){u.lifecycle=data.lifecycle;return u;}
        if(action==="reassign"){u.reassignedTo=data.reassignedTo;return u;}
        // #10 — document requests
        if(action==="doc_request"){u.reqDocs=[...(u.reqDocs||[]),data.doc];return u;}
        if(action==="doc_fulfil"){u.reqDocs=(u.reqDocs||[]).map(d=>d.id===data.docId?{...d,status:"provided",files:data.files,providedBy:data.by,providedDate:data.date}:d);u.attachments=[...(u.attachments||[]),...(data.files||[])];return u;}
        if(action==="doc_na"){u.reqDocs=(u.reqDocs||[]).map(d=>d.id===data.docId?{...d,status:"not_provided",naReason:data.reason,providedBy:data.by,providedDate:data.date}:d);return u;}
        if(action==="reassign_clear"){u.reassignedTo=null;return u;}
        if(action==="migration_complete"){
          u.migrationMeta={...(u.migrationMeta||{}),relatedPeople:data.relatedPeople||[],completed:true};
          u.attachments=[...(u.attachments||[]),...(data.attachments||[])];
          u.timeline=[...u.timeline,{ver:u.version||1,date:now(),type:"acknowledge",user:me.name,role:me.title,action:`Migration record completed — ${(data.relatedPeople||[]).length} related people captured`}];
          showToast("Migration record completed — certificate now carries the related people");
          return u;}

        if(action==="delegate"){
          u.delegatedTo=data.delegate.email; // Store actual user email, not role
          u.delegatedToUser=data.delegate;    // Full user object for display
          u.delegatedBy=me.email;             // Track who delegated for return trip
          u.delegatedByUser={name:me.name,title:me.title,role:me.role,email:me.email,branch:me.branch};
          u.timeline=[...u.timeline,{ver:u.version||1,date:now(),action:`Forwarded to ${data.delegate.name} (${data.delegate.title})`,user:me.name,role:me.title,type:"forward"}];
          showToast(`↗ Forwarded to ${data.delegate.name}`,"info");
          return u;
        }
        if(action==="delegate_confirm"){
          // Delegate has filled data, save it and return to primary
          const primaryName=u.delegatedByUser?.name||"primary approver";
          // Save data filled by delegate (same handlers as approve)
          if(data.cmioData){u.cptStatus=data.cmioData.cptStatus;u.accurateCptCode=data.cmioData.accurateCptCode;u.accurateCptName=data.cmioData.accurateCptName;}
          if(data.fcdData){
            const tCons=(u.templates.procCons.reduce((s,i)=>s+(i.totalCost||0),0))+(u.templates.wardsCons.reduce((s,i)=>s+(i.totalCost||0),0));
            const tDrugs=(u.templates.procDrugs.reduce((s,i)=>s+(i.totalCost||0),0))+(u.templates.wardsDrugs.reduce((s,i)=>s+(i.totalCost||0),0));
            const tOver=tCons+tDrugs+Number(data.fcdData.totalServicesCost||0)+Number(data.fcdData.additionalServicesCost||0);
            const margin=tOver>0?((Number(data.fcdData.finalPatientPrice)-tOver)/tOver)*100:0;
            u.financial={...data.fcdData,totalConsCost:tCons,totalDrugsCost:tDrugs,totalOverallCost:tOver,marginPercent:margin,ceoAdjustedPrice:null};
          }
          if(data.cscmData)u.systemSetup={...(u.systemSetup||{}),...data.cscmData};
          if(data.pkgData)u.systemSetup={...(u.systemSetup||{}),...data.pkgData};
          if(data.linkData)u.systemSetup={...(u.systemSetup||{}),...data.linkData};
          // Clear delegation
          u.delegatedTo=null;
          u.delegatedToUser=null;
          u.delegatedBy=null;
          u.delegatedByUser=null;
          u.timeline=[...u.timeline,{ver:u.version||1,date:now(),action:`Delegate confirmed — returned to ${primaryName} for final action`,user:me.name,role:me.title,type:"complete"}];
          showToast(`Confirmed — returned to ${primaryName}`);
          return u;
        }

        if(action==="approve"||action==="submit"||action==="approve_fcd"){
          // #6 — carry any attachment proof submitted with this approval onto the request
          if(data.attachments)u.attachments=data.attachments;
          // Save stage data
          if(data.cmioData){u.cptStatus=data.cmioData.cptStatus;u.accurateCptCode=data.cmioData.accurateCptCode;u.accurateCptName=data.cmioData.accurateCptName;
            if(data.cmioData.cptStatus==="Exists"&&(u.version||1)<=1){u.status="cpt_exists_cfo_ack";u.currentStage=99;showToast("CPT Exists — routed to CFO for acknowledgement");return u;}}
          if(data.templates)u.templates=data.templates;
          if(data.nursingData)Object.assign(u,data.nursingData);
          if(data.fcdData){
            const tCons=(u.templates.procCons.reduce((s,i)=>s+(i.totalCost||0),0))+(u.templates.wardsCons.reduce((s,i)=>s+(i.totalCost||0),0));
            const tDrugs=(u.templates.procDrugs.reduce((s,i)=>s+(i.totalCost||0),0))+(u.templates.wardsDrugs.reduce((s,i)=>s+(i.totalCost||0),0));
            const tOver=tCons+tDrugs+Number(data.fcdData.totalServicesCost||0)+Number(data.fcdData.additionalServicesCost||0);
            const margin=tOver>0?((Number(data.fcdData.finalPatientPrice)-tOver)/tOver)*100:0;
            u.financial={...data.fcdData,totalConsCost:tCons,totalDrugsCost:tDrugs,totalOverallCost:tOver,marginPercent:margin,ceoAdjustedPrice:null};
          }
          if(data.ceoPrice!=null&&u.financial){
            const oldPrice=u.financial.finalPatientPrice;
            if(Number(data.ceoPrice)!==Number(oldPrice)){
              u.financial={...u.financial,cfoPrice:oldPrice,ceoBy:me.name,ceoDate:now(),ceoAdjustedPrice:Number(data.ceoPrice),finalPatientPrice:Number(data.ceoPrice)};
              u.financial.marginPercent=u.financial.totalOverallCost>0?((Number(data.ceoPrice)-u.financial.totalOverallCost)/u.financial.totalOverallCost)*100:0;
              u.priceAlert={to:"cfo",old:oldPrice,now:Number(data.ceoPrice),by:me.name,date:now()};
            }
          }
          if(data.cscmData)u.systemSetup={...(u.systemSetup||{}),...data.cscmData};
          if(data.pkgData)u.systemSetup={...(u.systemSetup||{}),...data.pkgData};
          if(data.linkData)u.systemSetup={...(u.systemSetup||{}),...data.linkData};

          // Status map: key = the NEW currentStage value after increment
          // Stage 2=CMO, 3=CMIO, 4=Nursing, 5=CNO, 6=ChiefSurgeon, 7=CMO, 8=OtherCNO, 9=OtherCMO, 10=CFO, 11=CEO, 12=CSCM, 13=CFO, 14=CSCM, 15=CFO Ack
          const statusMap={
            3:"pending_cmio",        // after CMO approves → goes to CMIO
            4:"pending_nursing",     // after CMIO approves (New) → goes to Nursing
            5:"pending_cno",         // after Nursing submits → goes to CNO
            6:"pending_surgeon",     // after CNO → Chief Surgeon
            7:"pending_cmo_final",   // after Chief Surgeon → CMO Final
            8:"pending_other_cno",   // after CMO Final → Other Branch CNO
            9:"pending_other_cmo",   // after Other CNO → Other Branch CMO
            10:"pending_cfo_fcd",    // after Other CMO → CFO FCD
            11:"pending_ceo",        // after CFO FCD → CEO
            12:"pending_cscm_setup", // after CEO → CSCM Setup
            13:"pending_cfo_pkg",    // after CSCM Setup → CFO Package
            14:"pending_cscm_link",  // after CFO Package → CSCM Template Link
            15:"pending_ack",        // after CSCM Link → CFO Acknowledgement
          };
          // Advance to the next stage that is switched On in Setup → Approval Workflow.
          // Steps toggled Off are skipped and logged, so the config genuinely drives the chain.
          const wanted=u.currentStage+1;
          const landed=nextActiveStage(wanted);
          if(landed>wanted){
            for(let sk=wanted;sk<landed;sk++){
              const skc=approvalConfig.find(x=>x.num===sk);
              u.timeline=[...u.timeline,{ver:u.version||1,date:now(),action:`⏭ Step ${sk} (${skc?.label||"—"}) skipped — disabled in Setup`,user:"System",role:"System",type:"route"}];
            }
          }
          u.currentStage=landed;
          u.status=statusMap[u.currentStage]||"approved";
          u.stageStartDate=new Date().toISOString();
          u.delegatedTo=null;
          u.reassignedTo=null;
          if(u.currentStage>15){u.status="approved";u.currentStage=16;}
          showToast(`${data.actionLabel||"Approved"}`);
        }else if(action==="reject"){
          u.status="rejected";showToast("Request rejected","err");
        }else if(action==="modify"){
          // Per requirement: stages 5-9 modification returns to Nursing Manager
          // CFO (stage 10) modification also returns to Nursing Manager
          // CMO (stage 2) modification returns to Doctor (stage 1)
          // CMIO (stage 3) modification returns to Doctor if not forwarded
          const fromStage=u.currentStage;
          if(u.currentStage>=5&&u.currentStage<=10){
            u.currentStage=4;u.status="pending_nursing";
          }else{
            // Live: CMO Approval / CMIO Validation send the request back to the requesting doctor (stage 1)
            u.currentStage=1;u.status="modification";u.returnTo=fromStage;
            u.timeline=[...u.timeline,{ver:u.version||1,date:now(),action:"Returned to the requesting doctor (Doctor Request)",user:"System",role:"System",type:"route"}];
          }
          u.stageStartDate=new Date().toISOString();
          u.delegatedTo=null;u.delegatedToUser=null;u.delegatedBy=null;u.delegatedByUser=null;
          u.modifyNote={comment:data.comment||"",by:me.name,role:me.title,stage:STAGES.find(s=>s.num===fromStage)?.label||"",date:now()};
          showToast("↺ Modification requested","warn");
        }else if(action==="resubmit"){
          // Requesting doctor amended a returned request — it goes back to the step that asked for the change
          const to=u.returnTo||2;
          u.amendBefore=data.before||null;Object.assign(u,data.fields||{});
          u.currentStage=to;u.status=to===3?"pending_cmio":"pending_cmo";u.returnTo=null;u.stageStartDate=new Date().toISOString();
          u.timeline=[...u.timeline,{ver:u.version||1,date:now(),action:`Routed back to ${STAGES.find(s=>s.num===to)?.label}`,user:"System",role:"System",type:"route"}];
          showToast(`#${u.id} resubmitted — back with ${STAGES.find(s=>s.num===to)?.label}`);
        }else if(action==="acknowledge"){
          u.status="approved";u.currentStage=16;
          showToast("Acknowledged — Version "+u.version+" active · certificate emailed to notified parties");
        }
        // CPT Exists acknowledgement chain
        else if(action==="ack_cfo_exists"){
          u.status="cpt_exists_cmo_ack";
          u.timeline=[...u.timeline,{ver:u.version||1,date:now(),action:"CFO Acknowledged (CPT Exists)",user:me.name,role:"CFO",type:"acknowledge"}];
          showToast("CFO Acknowledged — routed to CMO");
        }else if(action==="ack_cmo_exists"){
          u.status="cpt_exists";u.currentStage=16;
          u.timeline=[...u.timeline,{ver:u.version||1,date:now(),action:"CMO Acknowledged (CPT Exists) — request closed",user:me.name,role:"CMO",type:"acknowledge"}];
          showToast("CPT Exists — Acknowledged & closed");
        }
        return u;
      });
      return updated;
    });
    // Update selected proc from latest state
    setTimeout(()=>{
      setAllProcs(prev=>{const found=prev.find(p2=>p2.id===proc.id);if(found)setSelProc({...found});return prev;});
    },0);
  };

  // #11/#12 — computed here so the sidebar badges and both pages share one source
  // Live: a requesting doctor sees only the requests they raised; a draft is visible only to the person who saved it.
  const visProcs=allProcs.filter(p=>role==="doctor"?(p.requestor&&p.requestor.email===me.email):(p.status!=="draft"||(p.requestor&&p.requestor.email===me.email)));
  const visIds=new Set(visProcs.map(p=>p.id));
  const visVl=role==="doctor"?vlReqs.filter(r=>visIds.has(r.baseId)):vlReqs;
  const myDrafts=visProcs.filter(p=>p.status==="draft"&&p.requestor&&p.requestor.email===me.email);
  const notifs=buildNotifs(visProcs,canAct,me,slaConfig,visVl);
  const notifUnread=notifs.filter(n=>!readNotifs.includes(n.id));
  const notifUrgent=notifUnread.filter(n=>n.priority==="high").length;
  const myEditTasks=vlReqs.filter(r=>editTurn(r,me));
  const myTaskCount=allProcs.filter(canAct).length+myEditTasks.length;
  const[refreshing,setRefreshing]=useState(false);

  // Live order: My Tasks is the landing page. (Value Anomalies — Phase 2 — is not on the live nav; its view is kept.)
  // ─── URL ROUTER (hash) — every page, request, tab and Setup section has its own link ───
  //   #/my-tasks  #/dashboard  #/requests?status=draft  #/requests/00041/financials  #/new  #/drafts/00017
  //   #/approved  #/in-approvals  #/notifications  #/data-import  #/setup/approvals  #/edit-requests/NF-002
  const VIEW_PATH={mytasks:"my-tasks",dashboard:"dashboard",all:"requests",new:"new",approved:"approved",in_approvals:"in-approvals",notifications:"notifications",migration:"data-import",setup:"setup",anomalies:"value-anomalies"};
  const PATH_VIEW=Object.fromEntries(Object.entries(VIEW_PATH).map(([k,v])=>[v,k]));
  const SB_OF={mytasks:"My Tasks",dashboard:"Dashboard",all:"All Requests",new:"New Procedure",approved:"Approved",notifications:"Notifications",migration:"Data Import",setup:"Setup"};
  const buildHash=()=>{
    if(view==="detail"&&selProc)return {base:"#/requests/"+selProc.id,full:"#/requests/"+selProc.id+(detailTab?"/"+detailTab:"")};
    if(view==="new"&&selProc)return {base:"#/drafts/"+selProc.id};
    if(view==="edit"&&selProc)return {base:"#/edit/"+selProc.id};
    if(view==="vl_detail"&&selVl)return {base:"#/edit-requests/"+selVl};
    if(view==="deact_detail"&&selDeact)return {base:"#/deactivations/"+selDeact};
    if(view==="all")return {base:"#/requests"+(allFilter&&allFilter!=="all"?"?status="+allFilter:"")};
    if(view==="setup")return {base:"#/setup",full:"#/setup"+(setupSection?"/"+setupSection:"")};
    return {base:"#/"+(VIEW_PATH[view]||"my-tasks")};
  };
  const lastBase=useRef(null);const routerReady=useRef(false);
  useEffect(()=>{if(!routerReady.current)return;// the incoming link is read first (below), then the URL follows the screen
    const h=buildHash();const full=h.full||h.base;if(location.hash===full){lastBase.current=h.base;return;}
    // a new page is a new history entry; switching tab / Setup section on the same page just rewrites the link
    if(lastBase.current===h.base)history.replaceState(null,"",full);else history.pushState(null,"",full);lastBase.current=h.base;
  },[view,selProc&&selProc.id,detailTab,allFilter,selVl,selDeact,setupSection]);
  const procsRef=useRef(allProcs);procsRef.current=allProcs;
  const applyHash=()=>{
    const raw=(location.hash||"").replace(/^#\/?/,"");const[path,qs]=raw.split("?");const seg=path.split("/").filter(Boolean);const q=new URLSearchParams(qs||"");
    const find=id=>procsRef.current.find(x=>x.id===id);
    const go=(v,p=null,sb)=>{setView(v);setSelProc(p);setSbPage(sb!==undefined?sb:(SB_OF[v]||""));};
    lastBase.current=null;
    const[a,b,c]=seg;
    if(!a)return go("mytasks");
    if(a==="requests"&&b){const p=find(b);if(p){setDetailTab(c||null);return go("detail",p,"All Requests");}}
    if(a==="requests"){setAllFilter(q.get("status")||"all");return go("all");}
    if(a==="drafts"&&b){const p=find(b);return go("new",p&&p.status==="draft"?p:null,"New Procedure");}
    if(a==="edit"&&b){const p=find(b);if(p)return go("edit",p,"Approved");}
    if(a==="edit-requests"&&b){setSelVl(b);return go("vl_detail",null,"Dashboard");}
    if(a==="deactivations"&&b){setSelDeact(b);return go("deact_detail",null,"Dashboard");}
    if(a==="setup"){setSetupSection(b||null);return go("setup");}
    go(PATH_VIEW[a]||"mytasks");
  };
  useEffect(()=>{if(location.hash&&location.hash!=="#/")applyHash();else history.replaceState(null,"","#/my-tasks");routerReady.current=true;const on=()=>applyHash();window.addEventListener("popstate",on);return()=>window.removeEventListener("popstate",on);},[]);
  const sbItems=[
    {icon:"clock",label:"My Tasks",v:"mytasks",badge:myTaskCount,badgeColor:T.purple},
    {icon:"chart",label:"Dashboard",v:"dashboard"},
    {icon:"clipboard",label:"All Requests",v:"all"},
    ...(role==="doctor"?[{icon:"plus",label:"New Procedure",v:"new"}]:[]),
    {icon:"shieldCheck",label:"Approved",v:"approved"},
    {icon:"bell",label:"Notifications",v:"notifications",badge:notifUnread.length,badgeColor:notifUrgent>0?T.err:T.textMut},
    ...(me.isSiteAdmin?[{icon:"download",label:"Data Import",v:"migration"}]:[]),
    ...(me.isSiteAdmin?[{icon:"settings",label:"Setup",v:"setup"}]:[]),
  ];
  const st={total:visProcs.length,pending:visProcs.filter(e=>!["approved","rejected","cpt_exists","draft"].includes(e.status)).length,done:visProcs.filter(e=>e.status==="approved").length,rej:visProcs.filter(e=>e.status==="rejected").length,myTasks:myTaskCount,drafts:myDrafts.length};

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:T.bodyBg,fontFamily:T.font}}>
      {toast&&<div style={{position:"fixed",top:60,right:20,zIndex:9999,padding:"12px 20px",borderRadius:8,background:toast.type==="ok"?T.ok:toast.type==="err"?T.err:toast.type==="info"?T.info:T.warn,color:"#fff",fontSize:13,fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,0.15)",animation:"slideIn 0.3s ease"}}>{toast.msg}</div>}
      {deactRaise&&<DeactRaiseModal type={deactRaise.type} base={deactRaise.base} onClose={()=>setDeactRaise(null)} onSubmit={submitDeact}/>}
      {vlRaise&&<VlRaiseModal base={vlRaise} opSkills={opSkills} onClose={()=>setVlRaise(null)} onSubmit={submitVl}/>}
      {/* SP HEADER */}
      <div style={{height:48,background:T.headerBg,display:"flex",alignItems:"center",padding:"0 16px",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,5px)",gap:3,cursor:"pointer",padding:6}}>{[...Array(9)].map((_,i)=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:"rgba(255,255,255,0.7)"}}/>)}</div>
          <span style={{color:"#fff",fontSize:14,fontWeight:600}}>{APP.org}</span>
          <div style={{display:"flex",alignItems:"center",background:"rgba(255,255,255,0.15)",borderRadius:4,padding:"5px 14px",marginLeft:20,width:260}}>
            <span style={{color:"rgba(255,255,255,0.5)",fontSize:12}}>⌕ Search across sites</span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{position:"relative"}} ref={userPickerRef}>
            <div onClick={()=>setShowUserPicker(!showUserPicker)} style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.12)",borderRadius:8,padding:"5px 12px",cursor:"pointer",border:"1px solid rgba(255,255,255,0.15)"}}>
              <Av user={me} size={26} color="#fff"/><div style={{lineHeight:1.2}}><div style={{color:"#fff",fontSize:11,fontWeight:600}}>{me.name}</div><div style={{color:"rgba(255,255,255,0.55)",fontSize:9}}>{me.title} · {me.branch}</div></div><span style={{color:"rgba(255,255,255,0.5)",fontSize:10,marginLeft:4}}>▾</span>
            </div>
            {showUserPicker&&<div style={{position:"absolute",top:"100%",right:0,marginTop:4,width:400,background:"#fff",borderRadius:10,boxShadow:"0 12px 40px rgba(0,0,0,0.2)",zIndex:9999,overflow:"hidden",border:`1px solid ${T.border}`}}>
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,background:"#f8fafc"}}><div style={{fontSize:12,fontWeight:700,color:T.text}}>Switch User (Demo)</div><div style={{fontSize:10,color:T.textSec,marginTop:2}}>Select a user to view from their perspective</div></div>
              <div style={{maxHeight:400,overflow:"auto"}}>
                {ROLE_GROUPS.map(grp=>{const users=U.filter(u=>u.role===grp.role);if(!users.length)return null;return<div key={grp.role}>
                  <div style={{padding:"8px 16px",background:"#f9fafb",fontSize:10,fontWeight:700,color:grp.color,textTransform:"uppercase",letterSpacing:0.5,borderBottom:`1px solid ${T.borderLight}`}}>{grp.label} ({users.length})</div>
                  {users.map(u=><div key={u.id} onClick={()=>switchUser(u)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",cursor:"pointer",borderBottom:`1px solid ${T.borderLight}`,background:u.id===selUserId?T.primaryLight:"#fff"}} onMouseEnter={e=>{if(u.id!==selUserId)e.currentTarget.style.background="#f8fafc";}} onMouseLeave={e=>{if(u.id!==selUserId)e.currentTarget.style.background="#fff";}}>
                    <Av user={u} size={30} color={grp.color}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:u.id===selUserId?700:500}}>{u.name}</div><div style={{fontSize:10,color:T.textMut}}>{u.title}</div></div><div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:9,color:T.textSec}}>{u.dept}</div><div style={{fontSize:9,color:T.textMut}}>{u.branch}</div></div>{u.id===selUserId&&<span style={{color:T.ok,fontSize:12,fontWeight:700}}>✓</span>}
                  </div>)}
                </div>;})}
              </div>
            </div>}
          </div>
        </div>
      </div>
      {/* SUBHEADER */}
      <div data-app-header="1" style={{height:52,background:"#fff",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",padding:"0 20px",gap:16,flexShrink:0}}>
        <img src={LOGO} alt={APP.orgFull} style={{height:38,width:"auto",display:"block",flexShrink:0}}/>
        <div style={{width:1,height:30,background:T.border,flexShrink:0}}/>
        <div style={{display:"flex",flexDirection:"column",justifyContent:"center",lineHeight:1.3}}>
          <div style={{display:"flex",alignItems:"baseline",gap:8,flexWrap:"wrap"}}>
            <span style={{fontSize:19,fontWeight:800,color:T.primary,letterSpacing:-0.3}}>{APP.name}</span>
            <span style={{fontSize:12,color:T.textSec,fontWeight:500}}>Clinical Package Costing &amp; Pricing Platform</span>
          </div>
          <div style={{fontSize:10,color:T.textMut,fontStyle:"italic"}}>{APP.tagline}</div>
        </div>
        <div data-tour="header-tools" style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>{setRefreshing(true);setTimeout(()=>{setRefreshing(false);showToast("Refreshed — showing the latest from SharePoint","info");},700);}} title="Refresh" style={{width:34,height:34,borderRadius:9,border:"none",background:"transparent",color:T.textSec,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{display:"inline-flex",transition:"transform 0.7s",transform:refreshing?"rotate(360deg)":"none"}}><Ic n="rotateCcw" s={15}/></span>
          </button>
          <div style={{position:"relative"}}>
            <button onClick={()=>{setSbPage("Notifications");nav("notifications");}} title="Notifications" style={{position:"relative",width:34,height:34,borderRadius:9,border:`1px solid ${T.border}`,background:"#f8fafc",color:T.textSec,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
              <Ic n="bell" s={16}/>
              {notifUnread.length>0&&<span style={{position:"absolute",top:-5,right:-5,minWidth:17,height:17,padding:"0 4px",borderRadius:9,background:notifUrgent>0?"#dc2626":"#f59e0b",color:"#fff",fontSize:9.5,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff"}}>{notifUnread.length}</span>}
            </button>

          </div>
        </div>
      </div>
      {/* LAYOUT */}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <div style={{width:200,background:T.sidebarBg,borderRight:`1px solid ${T.border}`,flexShrink:0,paddingTop:8,position:"relative"}}>
          <nav data-tour="sidebar">{sbItems.map((it,i)=><button key={i} onClick={()=>{setSbPage(it.label);setAllFilter("all");nav(it.v);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 16px",border:"none",background:sbPage===it.label?T.sidebarActive:"transparent",color:sbPage===it.label?T.primary:T.textSec,fontSize:13,fontWeight:sbPage===it.label?600:400,cursor:"pointer",textAlign:"left",fontFamily:T.font,borderLeft:sbPage===it.label?`3px solid ${T.primary}`:"3px solid transparent"}}><Ic n={it.icon} s={15}/>{it.label}{it.p2&&<P2Tag style={{marginLeft:"auto"}}/>}{it.badge>0&&<span style={{marginLeft:"auto",background:it.badgeColor||T.err,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:8}}>{it.badge}</span>}</button>)}</nav>
          <div style={{position:"absolute",bottom:16,left:0,width:200,padding:"12px 16px",borderTop:`1px solid ${T.border}`}}>
            <div style={{fontSize:11,fontWeight:600,color:T.text}}>{me.name}</div>
            <div style={{fontSize:10,color:T.textMut}}>{me.title}</div>
            <div style={{fontSize:10,color:T.textMut}}>{me.dept} · {me.branch}</div>
          </div>
        </div>
        <div data-scroll-main="1" style={{flex:1,overflow:"auto",padding:24,scrollBehavior:"smooth"}}>
          {view==="dashboard"&&<Dashboard st={st} procs={visProcs} onSel={p=>nav("detail",p)} onNew={()=>nav("new")} me={me} role={role} canAct={canAct} deactReqs={deactReqs} onRaiseDeact={raiseDeact} onOpenDeact={openDeact} vlReqs={visVl} onOpenVl={openVl} onMyTasks={()=>{setSbPage("My Tasks");nav("mytasks");}} onDrafts={()=>{setAllFilter("draft");setSbPage("All Requests");nav("all");}} onGo={(v,f)=>{if(v==="all"){setAllFilter(f||"all");setSbPage("All Requests");}else if(v==="approved")setSbPage("Approved");else setSbPage("");nav(v);}}/>}
          {view==="all"&&<AllRequests key={"all-"+allFilter} initStatus={allFilter} procs={visProcs} vlReqs={visVl} onSel={p=>{setAllFilter("all");if(p.status==="draft"){setSbPage("New Procedure");nav("new",p);}else nav("detail",p);}}/>}
          {view==="new"&&<NewProcForm key={"new-"+(selProc?selProc.id:"blank")} draft={selProc&&selProc.status==="draft"?selProc:null} onBack={()=>nav("dashboard")} me={me} chiefSurgeons={chiefSurgeons}
            onSubmit={(fd)=>{
              const np=procFromForm(fd,"submit");
              setAllProcs(prev=>fd.draftId?prev.map(x=>x.id===fd.draftId?np:x):[...prev,np]);showToast(`${np.id} created — routed to CMO Approval (${approverFor(2,np.branch)||"CMO"})`);setSbPage("All Requests");nav("detail",np);}}
            onSaveDraft={(fd,auto)=>{const np=procFromForm(fd,"draft");
              setAllProcs(prev=>prev.some(x=>x.id===np.id)?prev.map(x=>x.id===np.id?np:x):[...prev,np]);if(!auto)showToast(`${np.id} saved as draft.`);return np.id;}}
            onDiscardDraft={(id)=>{setAllProcs(prev=>prev.filter(x=>x.id!==id));showToast("Draft discarded.");setSbPage("All Requests");nav("all");}}
            procs={allProcs} nav={nav} opSkills={opSkills} specialties={specialties} cptCodes={cptCodes}/>}
          {view==="approved"&&<ApprovedPage procs={visProcs} vlReqs={visVl} onSel={p=>nav("detail",p)} onEdit={p=>{setAutoEdit(p.id);nav("detail",p);}}/>}
          {view==="mytasks"&&<MyTasks procs={visProcs} onSel={p=>nav("detail",p)} canAct={canAct} me={me} slaConfig={slaConfig} vlReqs={visVl} onOpenVl={openVl}/>}
          {view==="notifications"&&<NotificationsView notifs={notifs} me={me} read={readNotifs} onRead={ids=>setReadNotifs(prev=>[...new Set([...prev,...ids])])} onSel={p=>nav("detail",p)} onOpenVl={openVl}/>}
          {view==="in_approvals"&&<InApprovalsPage procs={visProcs} onSel={p=>nav("detail",p)} canAct={canAct} slaConfig={slaConfig}/>}
          {view==="detail"&&selProc&&<ProcDetail key={selProc.id} routeTab={detailTab} onTabChange={t=>setDetailTab(t)} proc={allProcs.find(p2=>p2.id===selProc.id)||selProc} role={role} me={me} onBack={()=>nav(selProc?.status==="approved"?"approved":"dashboard")} onAction={handleAction} canAct={canAct} nav={nav} categories={categories} onRaiseDeact={raiseDeact} onRaiseVl={raiseVl} onSubmitVl={(g,pl,r)=>submitVl(g,pl,r,allProcs.find(p2=>p2.id===selProc.id)||selProc)} onSubmitEdit={(ch,sc,rs)=>submitEdit(allProcs.find(p2=>p2.id===selProc.id)||selProc,ch,sc,rs)} onActVl={actVl} amendReq={amendId?vlReqs.find(r=>r.id===amendId):null} onAmendDone={()=>setAmendId(null)} autoEdit={autoEdit} onAutoEditDone={()=>setAutoEdit(null)} editDesign={editDesign} approvalConfig={approvalConfig} opSkills={opSkills} vlReqs={vlReqs.filter(r=>r.baseId===selProc.id)} onOpenVl={openVl} tplMasters={tplMasters}/>}
          {view==="deact_detail"&&<DeactDetail req={deactReqs.find(x=>x.id===selDeact)||{}} me={me} onBack={()=>nav("dashboard")} onAct={actDeact}/>}
          {view==="vl_detail"&&<VlDetail req={vlReqs.find(x=>x.id===selVl)||{}} me={me} onBack={()=>nav("dashboard")} onAct={actVl} procs={allProcs} onOpenProc={(id,amend)=>{const p2=allProcs.find(x=>x.id===id);if(p2){setAmendId(amend?selVl:null);nav("detail",p2);}}} onReassign={(r,u2,why)=>{setVlReqs(prev=>prev.map(x=>{if(x.id!==r.id)return x;const nm=u2.name;if(x.kind==="fin")return {...x,stages:x.stages.map((s,i)=>i===x.stage?{...s,name:nm,coveredFor:s.name}:s),timeline:[...x.timeline,{by:me.name,action:`Step reassigned to ${nm} — ${why}`,date:now()}]};return {...x,chain:x.chain.map((s,i)=>i===x.stage?{...s,name:nm,coveredFor:s.name}:s),timeline:[...x.timeline,{by:me.name,action:`${(x.chain[x.stage]||{}).label} reassigned to ${nm} — ${why}`,date:now()}]};}));showToast(`Step reassigned to ${u2.name}`);}}/>}
          {view==="anomalies"&&<ValueAnomaliesReport procs={allProcs} showToast={showToast}/>}
          {view==="migration"&&<SetupMigration cptCodes={cptCodes} existingIds={allProcs.map(p2=>p2.id)} onCommit={migrateRows} showToast={showToast} onBack={()=>nav("dashboard")} tplMasters={tplMasters} procs={allProcs} onOpenPkg={p2=>nav("detail",p2)} onCompleteRecord={(id,data)=>{setAllProcs(prev=>prev.map(p2=>String(p2.id)!==String(id)?p2:{...p2,migrationMeta:{...(p2.migrationMeta||{}),relatedPeople:data.relatedPeople||[],completed:true},attachments:[...(p2.attachments||[]),...(data.attachments||[])],timeline:[...p2.timeline,{ver:p2.version||1,date:now(),type:"acknowledge",user:me.name,role:me.title,action:`Migration record completed — ${(data.relatedPeople||[]).length} related people captured`}]}));showToast(`PKGID ${id} — migration record completed`);}} migStaged={migStaged} onStage={stageMigRows} onUpdateStaged={updateStaged} onSend={sendStagedForApproval} onApprove={approveStaged} onReject={rejectStaged} users={U}/>}
          {view==="setup"&&!me.isSiteAdmin&&<Card style={{maxWidth:520,padding:32,textAlign:"center"}}>
            <div style={{marginBottom:10,display:"flex",justifyContent:"center"}}><Ic n="lock" s={32} sw={1.6} style={{color:T.textMut}}/></div>
            <div style={{fontSize:16,fontWeight:700,color:T.err,marginBottom:6}}>Access Denied</div>
            <div style={{fontSize:12,color:T.textSec,lineHeight:1.6}}>Setup is restricted to Site Administrators.<br/>You are signed in as <strong>{me.name}</strong> ({me.title}).</div>
            <button onClick={()=>nav("dashboard")} style={{marginTop:16,padding:"8px 18px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",color:T.textSec,fontSize:12,fontWeight:600,cursor:"pointer"}}>← Back to Dashboard</button>
          </Card>}
          {view==="setup"&&me.isSiteAdmin&&<SetupPage routeSection={setupSection} onSection={setSetupSection} opSkills={opSkills} setOpSkills={setOpSkills} categories={categories} setCategories={setCategories} specialties={specialties} setSpecialties={setSpecialties} cptCodes={cptCodes} setCptCodes={setCptCodes} approvalConfig={approvalConfig} setApprovalConfig={setApprovalConfig} chiefSurgeons={chiefSurgeons} setChiefSurgeons={setChiefSurgeons} emailConfig={emailConfig} setEmailConfig={setEmailConfig} showToast={showToast} openCounts={openStageCounts} onRefreshOpen={refreshOpenRequests} slaConfig={slaConfig} setSlaConfig={setSlaConfig} auditLog={auditLog} logAudit={logAudit} existingIds={allProcs.map(p2=>p2.id)} onMigrate={migrateRows} tplMasters={tplMasters} setTplMasters={setTplMasters} procs={allProcs} consMaster={CONS_MASTER} drugsMaster={DRUGS_MASTER} editDesign={editDesign} setEditDesign={setEditDesign} onOpenMigration={()=>{setSbPage("Data Import");nav("migration");}}/>}
          {view==="edit"&&selProc&&<EditProc proc={selProc} me={me} opSkills={opSkills} categories={categories} onBack={()=>nav("approved")} onSubmit={fd=>{
            const up={...selProc,...fd,version:selProc.version+1,status:"pending_cmo",currentStage:2,stageStartDate:new Date().toISOString(),delegatedTo:null,
              timeline:[...selProc.timeline,{ver:selProc.version+1,date:now(),action:`Edit request V${selProc.version+1} submitted`,user:me.name,role:me.title,type:"create"}],
              versionHistory:[...selProc.versionHistory,{version:selProc.version+1,date:new Date().toISOString().split("T")[0],changedBy:me.name,summary:"Edit request submitted"}]};
            const _df=[];const _cmp=(l,a,b)=>{if(String(a==null?"":a)!==String(b==null?"":b))_df.push({label:l,old:(a==null||a==="")?"—":String(a),new:(b==null||b==="")?"—":String(b)});};
            _cmp("Specialty",selProc.specialty,up.specialty);
            _cmp("CPT Code",selProc.accurateCptCode||selProc.proposedCptCode,up.accurateCptCode||up.proposedCptCode);
            _cmp("Patient Type",selProc.patientType,up.patientType);
            _cmp("Anesthesia",selProc.anesthesia,up.anesthesia);
            _cmp("Gender",selProc.gender,up.gender);
            _cmp("Operation Skill",selProc.opSkill,up.opSkill);
            _cmp("Patient Price",selProc.financial&&selProc.financial.finalPatientPrice,up.financial&&up.financial.finalPatientPrice);
            const _tc=t=>["procCons","wardsCons","procDrugs","wardsDrugs"].reduce((s,k)=>s+((t&&t[k])||[]).length,0);
            _cmp("Template items (count)",_tc(selProc.templates),_tc(up.templates));
            up.editDiff={fromVersion:selProc.version,items:_df};
            setAllProcs(prev=>prev.map(p=>p.id===selProc.id?up:p));setSelProc(up);
            showToast(`Edit V${up.version} submitted for #${selProc.id}`);nav("detail",up);
          }}/>}
        </div>
      </div>
      <HelpTours view={view} approvalConfig={approvalConfig}/>
    </div>
  );
}
