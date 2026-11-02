// ═══════════════════════════════════════════════════════════════
// APPROVED & IN APPROVALS PAGES (same as v1 — working correctly)
// ═══════════════════════════════════════════════════════════════
function ApprovedPage({procs,onSel,onEdit,vlReqs=[]}){
  const openOn=id=>vlReqs.find(r=>r.baseId===id&&!r.done);
  const approved=procs.filter(p=>p.status==="approved");const[search,setSearch]=useState("");
  const[branchF,setBranchF]=useState("all");const[specF,setSpecF]=useState("all");const[lifeF,setLifeF]=useState("all");
  const specs=[...new Set(approved.map(p=>p.specialty).filter(Boolean))].sort();
  const AP=useSort("id");
  const GA={id:p=>p.id,requestor:p=>(p.requestor&&p.requestor.name)||"",specialty:p=>p.specialty||"",cpt:p=>p.accurateCptCode||p.proposedCptCode||"",cptname:p=>p.accurateCptName||p.proposedCptName||"",pkgid:p=>(p.systemSetup&&p.systemSetup.pkgId)||"",ver:p=>p.version||1,vdate:p=>new Date((p.versionHistory&&p.versionHistory.length&&p.versionHistory[p.versionHistory.length-1].date)||0).getTime()};
  const filtered=approved.filter(p=>(branchF==="all"||p.branch===branchF)&&(specF==="all"||p.specialty===specF)&&(lifeF==="all"||(lifeF==="active"?p.lifecycle!=="Deactivated":p.lifecycle==="Deactivated"))).filter(p=>!search||(p.id+p.proposedCptName+p.accurateCptName+p.specialty+p.proposedCptCode).toLowerCase().includes(search.toLowerCase()));
  return<div style={{maxWidth:1600}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <h1 style={{fontSize:18,fontWeight:600,color:T.text,margin:0}}>Approved & Acknowledged Procedures</h1>
      <button onClick={()=>{const csv="ID,Specialty,CPT Code,CPT Name,PKGID,Version,Status,Patient Price\n"+approved.map(p=>`${p.id},${p.specialty},${p.accurateCptCode||p.proposedCptCode},${(p.accurateCptName||p.proposedCptName||"").replace(",","")},${p.systemSetup?.pkgId||""},V${p.version},Active,${p.financial?.finalPatientPrice||""}`).join("\n");const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="CPT_Approved_Procedures.csv";a.click();}} style={{padding:"7px 14px",borderRadius:6,border:`1px solid ${T.ok}`,background:"#ecfdf5",color:T.ok,fontSize:11,fontWeight:600,cursor:"pointer"}}>Export to Excel</button>
    </div>
    <Card style={{padding:14,marginBottom:16}}><div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
      <div style={{flex:"1 1 200px",minWidth:180,position:"relative"}}><Ic n="search" s={13} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.textMut}}/><input style={{...inp,fontSize:12,margin:0,paddingLeft:30}} placeholder="Search ID, CPT, specialty…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <Select style={{...inp,fontSize:11.5,width:"auto",margin:0,padding:"8px 10px"}} value={branchF} onChange={e=>setBranchF(e.target.value)}><option value="all">All Branches</option>{BRANCHES.map(b=><option key={b.code} value={b.code}>{b.name}</option>)}</Select>
      <Select style={{...inp,fontSize:11.5,width:"auto",margin:0,padding:"8px 10px"}} value={specF} onChange={e=>setSpecF(e.target.value)}><option value="all">All Specialties</option>{specs.map(s=><option key={s} value={s}>{s}</option>)}</Select>
      <Select style={{...inp,fontSize:11.5,width:"auto",margin:0,padding:"8px 10px"}} value={lifeF} onChange={e=>setLifeF(e.target.value)}><option value="all">Lifecycle: All</option><option value="active">Active</option><option value="deactivated">Deactivated</option></Select>
      <span style={{marginLeft:"auto",fontSize:11,color:T.textMut,fontWeight:600}}>{filtered.length} of {approved.length}</span>
    </div></Card>
    <Card style={{padding:0,overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.primaryLight}}>
      <AP.TH k="id">Unique ID</AP.TH><AP.TH k="requestor">Requestor</AP.TH><AP.TH k="specialty">Specialty</AP.TH><AP.TH k="cpt">CPT Code</AP.TH><AP.TH k="cptname">CPT Name</AP.TH><AP.TH k="pkgid">PKGID</AP.TH><th style={{padding:"10px 12px",fontSize:10.5,fontWeight:800,color:T.textSec,textTransform:"uppercase",letterSpacing:0.4,textAlign:"left",borderBottom:`1px solid ${T.border}`}}>Template #s</th><AP.TH k="ver">Version</AP.TH><AP.TH k="vdate">Version Date</AP.TH><th style={{padding:"10px 12px",fontSize:10.5,fontWeight:800,color:T.textSec,textTransform:"uppercase",letterSpacing:0.4,textAlign:"left",borderBottom:`1px solid ${T.border}`}}>Status</th><th style={{borderBottom:`1px solid ${T.border}`}}/>
    </tr></thead><tbody>
      {filtered.length===0&&<tr><td colSpan={10} style={{padding:40,textAlign:"center",color:T.textMut}}>No approved procedures</td></tr>}
      {AP.sortRows(filtered,GA).map(p=><tr key={p.id} style={{borderBottom:`1px solid ${T.borderLight}`}} onMouseEnter={e=>e.currentTarget.style.background=T.primaryLight} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <td onClick={()=>onSel(p)} style={{padding:"10px 12px",fontSize:12,fontWeight:600,color:T.primary,cursor:"pointer"}}>{p.id}</td>
        <td onClick={()=>onSel(p)} style={{padding:"10px 12px",fontSize:12,cursor:"pointer"}}>{(p.requestor&&p.requestor.name)||"—"}</td>
        <td onClick={()=>onSel(p)} style={{padding:"10px 12px",fontSize:12,cursor:"pointer"}}>{p.specialty}</td>
        <td onClick={()=>onSel(p)} style={{padding:"10px 12px",fontSize:12,cursor:"pointer"}}>{p.accurateCptCode||p.proposedCptCode}</td>
        <td onClick={()=>onSel(p)} style={{padding:"10px 12px",fontSize:12,cursor:"pointer"}}>{(p.accurateCptName||p.proposedCptName||"").slice(0,25)}</td>
        <td onClick={()=>onSel(p)} style={{padding:"10px 12px",fontSize:12,cursor:"pointer"}}>{p.systemSetup?.pkgId||"—"}</td>
        <td onClick={()=>onSel(p)} style={{padding:"10px 12px",fontSize:10,color:T.textMut,cursor:"pointer"}}>{p.systemSetup?[p.systemSetup.procConsTemplate,p.systemSetup.wardsConsTemplate,p.systemSetup.procDrugsTemplate,p.systemSetup.wardsDrugsTemplate].filter(Boolean).join(", "):"—"}</td>
        <td onClick={()=>onSel(p)} style={{padding:"10px 12px",cursor:"pointer"}}><Badge color={T.info}>V{p.version}</Badge></td>
        <td onClick={()=>onSel(p)} style={{padding:"10px 12px",fontSize:11,color:T.textSec,cursor:"pointer"}}>{fmtDate(p.versionHistory?.[p.versionHistory.length-1]?.date)}</td>
        <td onClick={()=>onSel(p)} style={{padding:"10px 12px",cursor:"pointer"}}><Badge color={T.ok} bg="#ecfdf5">Active</Badge></td>
        <td style={{padding:"10px 12px"}}>{(()=>{const o=openOn(p.id);return <button disabled={!!o} title={o?`${o.id} is in approval — one change at a time`:"Edit Package"} onClick={()=>!o&&onEdit(p)} style={{padding:"5px 12px",borderRadius:6,border:`1px solid ${o?T.warn+"55":T.warn}`,background:o?"#fff":"#fffbeb",color:o?T.warn+"88":T.warn,fontSize:10,fontWeight:600,whiteSpace:"nowrap",cursor:o?"not-allowed":"pointer"}}>✎ Edit</button>;})()}</td>
      </tr>)}
    </tbody></table></Card>
  </div>;
}

// Notifications (#11) — an in-app inbox for what the system would email out.
// Sources: your pending actions, SLA breaches on your steps, and open document requests.
function buildNotifs(procs,canAct,me,slaConfig,vlReqs=[]){
  const out=[];
  procs.forEach(p=>{
    const sla=slaStateFor(p,slaConfig);
    const mine=p.requestor&&p.requestor.email===me.email;
    if(canAct(p)&&p.status==="modification"){
      const mn=p.modifyNote||{};
      out.push({id:`mod-${p.id}-${mn.date||""}`,type:"action",priority:"high",ref:p.id,
        title:"Modification requested",
        body:`Modification requested: The ${mn.stage||"CMO Approval"} stage has requested changes to ${p.id}. Please review and update the request.`,
        quote:mn.comment?{by:mn.by,role:"requested changes",text:mn.comment}:null,date:mn.date||p.stageStartDate,proc:p,overdue:sla?.state==="overdue"});
    }else if(canAct(p)){
      const od=sla?.state==="overdue";
      out.push({id:`act-${p.id}-${p.currentStage}`,type:"action",priority:od?"high":"medium",ref:p.id,
        title:TASK_VERB[p.currentStage]||"Action required",
        ...(()=>{const lastAppr=[...(p.timeline||[])].reverse().find(t=>t.type&&t.type!=="route"&&t.type!=="reassign");
          const prev=p.currentStage===2?null:(STAGES.find(s=>s.num===p.currentStage-1)||{}).label;const cur=STAGES.find(s=>s.num===p.currentStage)?.label||"your step";const nm=p.accurateCptName||p.proposedCptName;
          const cover=p.reassignedTo&&p.reassignedTo.email===me.email;
          return {body:cover?`You have been asked to cover ${cur} on ${nm}. It applies to this request only and keeps its original due date.`:prev?`${prev} has been completed for ${nm}. The request is now in ${cur} and is waiting on your review${od?", and is past its due date — action is required immediately.":"."}`:`${nm} has been submitted. The request is now in ${cur}, waiting on your review${od?", and is past its due date — action is required immediately.":"."}`,
            quote:lastAppr&&lastAppr.comment?{by:lastAppr.user,role:"approved",text:lastAppr.comment}:null};})(),
        date:p.stageStartDate,proc:p,overdue:od,
        meta:sla?(od?`${Math.abs(sla.left)} day(s) overdue`:sla.state==="due"?"Due today":`${sla.left} day(s) left`):null});
    }
    // Requestor alerts — the outcome of a request you raised
    if(mine&&p.status==="approved"&&(p.currentStage||0)>=16){const last=(p.timeline||[])[p.timeline.length-1]||{};
      out.push({id:`ok-${p.id}-v${p.version||1}`,type:"alert",priority:"medium",ref:p.id,title:"Approved",
        body:`${p.accurateCptName||p.proposedCptName} has completed every approval stage and is now approved.`,date:last.date||p.requestDate,proc:p,overdue:false});}
    if(mine&&p.status==="rejected"){const last=(p.timeline||[])[p.timeline.length-1]||{};
      out.push({id:`rj-${p.id}`,type:"alert",priority:"medium",ref:p.id,title:"Rejected",
        body:`${p.accurateCptName||p.proposedCptName} was rejected. The reviewer's comment is on the request's timeline.`,date:last.date||p.requestDate,proc:p,overdue:false});}
    (p.reqDocs||[]).filter(d=>d.status==="pending").forEach(d=>{
      out.push({id:`doc-${p.id}-${d.id}`,type:"docreq",priority:"medium",ref:p.id,
        title:`Document requested — ${d.type}`,
        body:`Asked by ${d.by} (${d.role}) on ${p.id}.`,quote:d.note?{by:d.by,text:d.note}:null,
        date:d.date,proc:p,overdue:false,meta:null});
    });
    if(p.priceAlert&&me.role==="cfo"){
      out.push({id:`pa-${p.id}`,type:"alert",priority:"high",ref:p.id,
        title:"CEO changed the patient price",
        body:`The CEO changed the patient price for ${p.accurateCptName||p.proposedCptName} after you costed it. Open the Financials tab to see both figures with the recalculated margin. No action is needed.`,
        date:p.priceAlert.date,proc:p,overdue:false});
    }
    if(p.reassignedTo&&p.reassignedTo.email===me.email){
      out.push({id:`ra-${p.id}`,type:"alert",priority:"high",ref:p.id,
        title:"You are covering an approval step",
        body:`Step ${p.reassignedTo.stage} — ${p.reassignedTo.reason}. Assigned by ${p.reassignedTo.by}.`,
        date:p.reassignedTo.date,proc:p,overdue:false});
    }
  });
  // Edit requests — your turn, and the outcome of every amendment (applied / rejected / withdrawn)
  vlReqs.forEach(r=>{
    const proc=procs.find(p=>p.id===r.baseId);
    if(editTurn(r,me))out.push({id:`ed-${r.id}-${r.status}-${r.stage}-${r.phase}`,type:"action",priority:r.status==="returned"?"high":"medium",ref:r.baseId,vl:r.id,
      title:r.status==="returned"?"Amend the returned change and resubmit it":r.phase==="confirm"?"Confirm the change on PrimeCare":"Approve or reject a requested change",
      body:`${r.id} · ${editReqLabel(r)} on ${r.baseId} — ${r.status==="returned"?"returned to you for changes":editStepLabel(r)}.`,
      quote:r.status==="returned"&&r.returnNote?{by:r.returnNote.by,text:r.returnNote.text}:null,date:r.stageDate||r.date,proc,overdue:false});
    if(r.done&&(me.isSiteAdmin||r.raisedBy===me.name)){
      const t=r.status==="completed"?`${r.id} was confirmed${r.kind==="fin"?" at final acknowledgement":" on PrimeCare"} and applied to ${r.baseId} as version V${r.toVer}. The change is now in force.`
        :r.status==="rejected"?`${r.id} was rejected, so ${r.baseId} is unchanged and stays as it was. Open the request to read why.`
        :`${r.id} was withdrawn — ${r.baseId} stays at V${r.fromVer}.`;
      out.push({id:`eo-${r.id}-${r.status}`,type:"alert",priority:"medium",ref:r.baseId,vl:r.id,title:r.status==="completed"?"Change applied":r.status==="rejected"?"Change rejected":"Change withdrawn",body:t,date:(r.timeline[r.timeline.length-1]||{}).date||r.date,proc,overdue:false});
    }
  });
  const rank={high:0,medium:1};
  return out.sort((a,b)=>(rank[a.priority]-rank[b.priority])||(new Date(b.date)-new Date(a.date)));
}
const NOTIF_KIND={
  action:{label:"Action",c:"#dc2626",icon:"zap"},
  docreq:{label:"Document",c:"#2563eb",icon:"inboxIn"},
  alert:{label:"Alert",c:"#d97706",icon:"bell"},
};
const cptRef=id=>id;
function NotificationsView({notifs,onSel,onOpenVl=()=>{},me,read=[],onRead=()=>{}}){
  const[filter,setFilter]=useState("all");
  const counts={all:notifs.length,action:notifs.filter(n=>n.type==="action").length,docreq:notifs.filter(n=>n.type==="docreq").length,alert:notifs.filter(n=>n.type==="alert").length};
  const urgent=notifs.filter(n=>n.priority==="high"&&!read.includes(n.id)).length;
  const shown=filter==="all"?notifs:notifs.filter(n=>n.type===filter);
  const tabs=[{k:"all",l:"All"},{k:"action",l:"Action Required"},{k:"docreq",l:"Document Requests"},{k:"alert",l:"Alerts"}];
  const open=n=>{onRead([n.id]);if(n.vl&&n.type==="action")onOpenVl(n.vl);else if(n.proc)onSel(n.proc);};
  return <div style={{maxWidth:1240}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
      <div><h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:0,display:"flex",alignItems:"center",gap:10}}>Notifications
        {urgent>0&&<span style={{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:10,background:T.err,color:"#fff"}}>{urgent} URGENT</span>}</h1>
        <p style={{fontSize:12,color:T.textSec,margin:"4px 0 0"}}>{notifs.length} notifications for {me.name}</p></div>
      <button onClick={()=>onRead(notifs.map(n=>n.id))} style={{padding:"7px 14px",borderRadius:7,border:`1px solid ${T.primary}`,background:"#fff",color:T.primary,fontSize:11.5,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Mark all as read</button>
    </div>
    <div style={{display:"flex",gap:6,margin:"14px 0",flexWrap:"wrap"}}>
      {tabs.map(t=><button key={t.k} onClick={()=>setFilter(t.k)} style={{padding:"5px 14px",borderRadius:16,border:filter===t.k?`1.5px solid ${T.primary}`:`1px solid ${T.border}`,background:filter===t.k?T.primaryLight:"#fff",color:filter===t.k?T.primary:T.textSec,fontSize:11,fontWeight:filter===t.k?700:500,cursor:"pointer",fontFamily:T.font}}>{t.l} ({counts[t.k]})</button>)}
    </div>
    {shown.length===0&&<Card style={{padding:40,textAlign:"center"}}>
      <div style={{fontSize:34,marginBottom:8}}>📭</div>
      <div style={{fontSize:14,fontWeight:600,color:T.text}}>Nothing here</div>
      <div style={{fontSize:11,color:T.textMut,marginTop:4}}>No notifications in this view.</div>
    </Card>}
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {shown.map(n=>{const k=NOTIF_KIND[n.type];const unread=!read.includes(n.id);const hot=n.type==="action"&&n.priority==="high";const tc=n.type==="action"?T.err:k.c;
        return <div key={n.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",borderRadius:8,border:`1px solid ${hot?"#fecaca":T.border}`,borderLeft:`4px solid ${tc}`,background:hot?"#fef2f2":"#fff",opacity:unread?1:0.72}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3,flexWrap:"wrap"}}>
              <span style={{fontSize:9,fontWeight:800,letterSpacing:0.6,textTransform:"uppercase",padding:"2px 7px",borderRadius:4,color:tc,background:tc+"14"}}>{k.label}</span>
              <span style={{fontSize:12.5,fontWeight:700,color:T.text}}>{cptRef(n.ref)}</span>
              <span style={{fontSize:11,color:T.textSec,fontWeight:600}}>{n.title}</span>
              {n.overdue&&<Badge color={T.err}>OVERDUE</Badge>}
            </div>
            <div style={{fontSize:11.5,color:T.textSec}}>{n.body}</div>
            {n.quote&&<div style={{marginTop:6,padding:"6px 10px",background:"#fff",border:`1px solid ${T.borderLight}`,borderRadius:6,fontSize:11}}><strong>{n.quote.by} ({n.quote.role||"asked it"}):</strong> “{n.quote.text}”</div>}
            <div style={{fontSize:10,color:T.textMut,marginTop:5,display:"flex",alignItems:"center",gap:5}}><Ic n="clock" s={10}/>{fmtDate(n.date)}{n.meta&&<span style={{marginLeft:8,fontWeight:600,color:n.overdue?T.err:T.textMut}}>{n.meta}</span>}</div>
          </div>
          {unread&&<span title="Unread" style={{width:8,height:8,borderRadius:"50%",background:T.primary,flexShrink:0}}/>}
          <button onClick={()=>open(n)} style={{padding:"6px 14px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:T.font,flexShrink:0}}>Open →</button>
        </div>;})}
    </div>
  </div>;
}

// My Tasks — live landing page. Overdue / Due today / Upcoming, each its own table; amendments
// (edit requests) sit in the same list as type "Amendment".
const TASK_TODO={1:"Complete and submit",2:"Approve, send back or reject",3:"Validate the CPT — approve, send back or reject",4:"Build the OT templates and check LOS & services",5:"Approve or send back",6:"Approve or send back",7:"Approve, send back or reject",8:"Approve or send back",9:"Approve or send back",10:"Enter the financials (FCD)",11:"Approve the patient price",12:"Create & link the operation code on PrimeCare",13:"Create the PKGID on PrimeCare",14:"Link the templates on PrimeCare",15:"Acknowledge"};
const AmendBadge=()=><span style={{fontSize:9.5,fontWeight:700,padding:"2px 8px",borderRadius:10,color:"#7c3aed",background:"#f5f3ff",border:"1px solid #ddd6fe"}}>Amendment</span>;
const addDays=(d,n)=>{const x=new Date(d||Date.now());x.setDate(x.getDate()+n);return x;};
const dayDiff=d=>{const a=new Date();a.setHours(0,0,0,0);const b=new Date(d);b.setHours(0,0,0,0);return Math.round((b-a)/86400000);};
function MyTasks({procs,onSel,canAct,me,slaConfig,vlReqs=[],onOpenVl=()=>{}}){
  const[q,setQ]=useState("");
  const procRows=procs.filter(canAct).map(p=>{const sla=slaStateFor(p,slaConfig);
    const due=sla?addDays(null,sla.left):addDays(p.stageStartDate,3);
    const todo=p.delegatedTo===me.email?"Fill in the forwarded step and return it":(p.status||"").indexOf("cpt_exists")===0?"Acknowledge":p.reassignedTo&&p.reassignedTo.email===me.email?"Covering for the approver while they are away":(TASK_TODO[p.currentStage]||"Review");
    return {key:"p"+p.id,id:p.id,spec:p.specialty,type:<TypeBadge p={p}/>,name:p.accurateCptName||p.proposedCptName,todo,due,open:()=>onSel(p)};});
  const vlRows=vlReqs.filter(r=>editTurn(r,me)).map(r=>{const b=procs.find(p=>p.id===r.baseId)||{};
    const todo=r.status==="returned"?"Amend the returned change and resubmit it":r.phase==="confirm"?"Confirm the change on PrimeCare — this applies it to the package":"Approve or reject a requested change to this package";
    return {key:"v"+r.id,id:r.baseId,sub:r.id,spec:b.specialty,type:<AmendBadge/>,name:r.cpt,todo,due:addDays(r.stageDate||r.date,3),open:()=>onOpenVl(r.id)};});
  const all=[...procRows,...vlRows].filter(t=>!q||(t.id+(t.sub||"")+(t.name||"")+(t.spec||"")+t.todo).toLowerCase().includes(q.toLowerCase())).sort((a,b)=>a.due-b.due);
  const groups={overdue:all.filter(t=>dayDiff(t.due)<0),due:all.filter(t=>dayDiff(t.due)===0),upcoming:all.filter(t=>dayDiff(t.due)>0)};
  const cards=[
    {k:"overdue",l:"Overdue",c:T.err,icon:"alert",sub:"Action required immediately"},
    {k:"due",l:"Due today",c:T.warn,icon:"clock",sub:"Last day before breach"},
    {k:"upcoming",l:"Upcoming",c:T.info,icon:"clipboard",sub:"Within SLA"},
  ];
  const thS={...th,textAlign:"left",fontSize:10,textTransform:"uppercase",letterSpacing:0.4};
  return <div style={{maxWidth:1240}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:14}}>
      <h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:0}}>My Tasks</h1>
      <div style={{position:"relative",width:200}}><Ic n="search" s={13} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.textMut}}/><input style={{...inp,fontSize:12,margin:0,paddingLeft:30}} placeholder="Search my tasks" value={q} onChange={e=>setQ(e.target.value)}/></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
      {cards.map(s=><Card key={s.k} style={{padding:"14px 16px",borderLeft:`4px solid ${s.c}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8,color:s.c}}><Ic n={s.icon} s={14}/><div style={{fontSize:24,fontWeight:800}}>{groups[s.k].length}</div></div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginTop:2}}><span style={{fontSize:12,fontWeight:600,color:T.text}}>{s.l}</span><span style={{fontSize:10,color:T.textMut}}>{s.sub}</span></div>
      </Card>)}
    </div>
    {all.length===0&&<Card style={{padding:40,textAlign:"center"}}>
      <div style={{fontSize:34,marginBottom:8}}>✨</div>
      <div style={{fontSize:14,fontWeight:600,color:T.text}}>You're all caught up</div>
      <div style={{fontSize:11,color:T.textMut,marginTop:4}}>Nothing is waiting on you right now.</div>
    </Card>}
    {cards.filter(s=>groups[s.k].length>0).map(s=><div key={s.k} style={{marginBottom:18}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,color:s.c}}><Ic n={s.icon} s={13}/><span style={{fontSize:13,fontWeight:700}}>{s.l}</span><span style={{fontSize:11,color:T.textMut,fontWeight:600}}>{groups[s.k].length}</span><span style={{fontSize:11,color:T.textMut}}>{s.sub}</span></div>
      <Card style={{padding:0,overflow:"hidden",maxHeight:300,overflowY:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead style={{position:"sticky",top:0}}><tr style={{background:T.primaryLight}}>
            <th style={thS}>Request ▾</th><th style={thS}>Type</th><th style={thS}>CPT Name ↕</th><th style={thS}>What you need to do ↕</th><th style={thS}>Due ↕</th><th style={thS}></th>
          </tr></thead>
          <tbody>{groups[s.k].map(t=><tr key={t.key} onClick={t.open} style={{borderTop:`1px solid ${T.borderLight}`,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <td style={{...td,textAlign:"left",textAlign:"left"}}><div style={{fontSize:12,fontWeight:700,color:T.primary}}>{t.id}{t.sub&&<span style={{fontSize:10,color:"#7c3aed",fontWeight:700,marginLeft:6}}>{t.sub}</span>}</div><div style={{fontSize:10,color:T.textMut}}>{t.spec}</div></td>
            <td style={{...td,textAlign:"left",textAlign:"left"}}>{t.type}</td>
            <td style={{...td,textAlign:"left",maxWidth:300,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</td>
            <td style={{...td,textAlign:"left",color:T.text}}>{t.todo}</td>
            <td style={{...td,textAlign:"left",whiteSpace:"nowrap",color:s.k==="overdue"?T.err:T.textSec,fontWeight:s.k==="overdue"?600:400}}>{fmtDate(t.due)}</td>
            <td style={{...td,textAlign:"left",textAlign:"right",color:T.textSec}}>→</td>
          </tr>)}</tbody>
        </table>
      </Card>
    </div>)}
  </div>;
}
