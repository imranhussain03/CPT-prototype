// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════
const ScenChips=({r})=><span style={{display:"inline-flex",gap:4,flexWrap:"wrap"}}>{(r.scenarios||[r.groupId]).map(s=><span key={s} style={{fontSize:9.5,fontWeight:700,padding:"1px 7px",borderRadius:8,background:s==="finance"?"#fffbeb":"#ecfdf5",color:s==="finance"?"#b45309":T.primary,border:`1px solid ${s==="finance"?"#fde68a":T.primary+"30"}`}}>{SCEN_SHORT[s]||s}</span>)}</span>;
const editStatusOf=r=>r.status==="returned"?{k:"returned",l:"Returned for changes",c:T.warn}:r.status==="completed"?{k:"applied",l:"Applied",c:T.ok}:r.status==="rejected"?{k:"rejected",l:"Rejected",c:T.err}:r.status==="withdrawn"?{k:"withdrawn",l:"Withdrawn",c:T.textMut}:r.phase==="confirm"?{k:"confirm",l:`Awaiting PrimeCare confirm (${r.confirmRole})`,c:T.info}:{k:"approval",l:r.kind==="fin"?`In approval — re-running all stages as V${r.toVer}`:"In approval",c:"#b45309"};
function EditReqPanel({title,sub,reqs,fin,me,onOpenVl}){
  const chipsDef=fin?[["approval","In approval"],["returned","Returned"],["approved","Approved"],["applied","Applied"],["rejected","Rejected"],["withdrawn","Withdrawn"]]:[["approval","In approval"],["returned","Returned"],["confirm","Awaiting PrimeCare confirm"],["applied","Applied"],["rejected","Rejected"],["withdrawn","Withdrawn"]];
  const[f,setF]=useState("open");
  const open=reqs.filter(r=>!r.done);
  const shown=f==="open"?open:reqs.filter(r=>editStatusOf(r).k===f);
  const chipC={approval:"#b45309",returned:T.err,confirm:T.info,approved:T.ok,applied:T.ok,rejected:T.err,withdrawn:T.textMut};
  const thS={padding:"9px 12px",fontSize:10,fontWeight:800,color:T.textSec,textTransform:"uppercase",letterSpacing:0.4,textAlign:"left",borderBottom:`1px solid ${T.border}`};
  const tdS={padding:"9px 12px",fontSize:11.5,textAlign:"left",verticalAlign:"middle"};
  return <div style={{marginBottom:24}}>
    <ST>{title} <span style={{fontWeight:500,color:T.textMut,fontSize:12}}>({open.length} open)</span></ST>
    <div style={{fontSize:11,color:T.textSec,margin:"-4px 0 8px"}}>{sub}</div>
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
      {chipsDef.map(([k,l])=>{const n=reqs.filter(r=>editStatusOf(r).k===k).length;const on=f===k;return <button key={k} onClick={()=>setF(on?"open":k)} style={{fontSize:10.5,fontWeight:700,padding:"3px 10px",borderRadius:12,cursor:"pointer",border:`1px solid ${on?chipC[k]:chipC[k]+"40"}`,background:on?chipC[k]:chipC[k]+"10",color:on?"#fff":chipC[k],fontFamily:T.font}}>{l} · {n}</button>;})}
    </div>
    <Card style={{padding:0,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.primaryLight}}>
        {(fin?["Req ID","Base #","Version","Scenarios","Route","Current Step","Status",""]:["Req ID","Base #","Scenarios","Changes","Current Step","Status",""]).map((h,i)=><th key={i} style={thS}>{h}</th>)}
      </tr></thead><tbody>
        {shown.length===0&&<tr><td colSpan={8} style={{padding:20,textAlign:"center",color:T.textMut,fontSize:12}}>{f==="open"?"Nothing open — use the chips to see applied, rejected or withdrawn changes.":"None."}</td></tr>}
        {shown.map(r=>{const s=editStatusOf(r);const mine=editTurn(r,me);const ex=(r.stages||[]).filter(x=>x.extra);
          return <tr key={r.id} onClick={()=>onOpenVl(r)} style={{cursor:"pointer",borderTop:`1px solid ${T.borderLight}`}} onMouseEnter={e=>e.currentTarget.style.background=T.primaryLight} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <td style={{...tdS,fontWeight:700,color:T.primary}}>{r.id}</td>
            <td style={tdS}>{r.baseId}</td>
            {fin&&<td style={tdS}><span style={{fontWeight:600}}>V{r.fromVer} → V{r.toVer}</span></td>}
            <td style={tdS}><ScenChips r={r}/></td>
            {fin?<td style={{...tdS,color:T.textSec}}>Finance 15 stages{ex.map(x=>" + "+x.label).join("")}{ex.length?` = ${r.stages.length}`:""}</td>
              :<td style={{...tdS,color:T.textSec,maxWidth:300}}>{r.special==="obsolete"?`${(r.pairs||[]).length} item code${(r.pairs||[]).length===1?"":"s"}`:`${(r.changes||[]).length} · ${(r.changes||[]).map(c=>c.l).join(", ")}`}</td>}
            <td style={tdS}><span style={{color:T.textSec}}>{r.done?"—":editStepLabel(r)}</span>{mine&&<Badge color={T.purple} bg="#f5f3ff" style={{marginLeft:6}}>Your Turn</Badge>}</td>
            <td style={tdS}><span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:10,color:s.c,background:s.c+"14",whiteSpace:"nowrap"}}>{s.l}</span></td>
            <td style={{...tdS,color:T.textMut}}>→</td>
          </tr>;})}
      </tbody></table>
    </Card>
  </div>;
}
function Dashboard({st,procs,onSel,onNew,me,role,canAct,deactReqs=[],onRaiseDeact=()=>{},onOpenDeact=()=>{},vlReqs=[],onOpenVl=()=>{},onMyTasks=()=>{},onDrafts=()=>{},onGo=()=>{}}){
  const S1=useSort("id",-1);const S2=useSort("id",-1);
  const[more,setMore]=useState(25);
  const openOn=id=>vlReqs.find(r=>r.baseId===id&&!r.done);
  const G1={id:p=>p.id,specialty:p=>p.specialty||"",cpt:p=>p.proposedCptName||"",status:p=>p.status||"",stage:p=>p.currentStage||0};
  const G2={id:p=>p.id,specialty:p=>p.specialty||"",cpt:p=>p.accurateCptName||p.proposedCptName||"",pkgid:p=>(p.systemSetup&&p.systemSetup.pkgId)||"",ver:p=>p.version||1,status:p=>p.status||""};
  const myEdits=vlReqs.filter(r=>editTurn(r,me));
  const myRows=[...procs.filter(canAct).map(p=>({p,stage:STAGES.find(s=>s.num===p.currentStage)?.label||p.status})),
    ...myEdits.map(r=>{const p=procs.find(x=>x.id===r.baseId);const s=r.status==="returned"?"Requestor":r.kind==="fin"?((r.stages[r.stage]||{}).label):r.phase==="confirm"?`PrimeCare confirm (${r.confirmRole})`:((r.chain[r.stage]||{}).short||"");return p&&{p,stage:`Amendment — ${s}`,vl:r};}).filter(Boolean)];
  const thS={padding:"10px 14px",fontSize:10.5,fontWeight:800,color:T.textSec,textTransform:"uppercase",letterSpacing:0.4,textAlign:"left",borderBottom:`1px solid ${T.border}`};
  const approved=S2.sortRows(procs.filter(e=>e.status==="approved"),G2);
  return<div style={{maxWidth:1600}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <div><h1 style={{fontSize:18,fontWeight:600,color:T.text,margin:0}}>CPT Procedure Dashboard</h1><p style={{fontSize:12,color:T.textSec,margin:"2px 0 0"}}>Logged in as: {me.name}</p></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,marginBottom:20}}>
      {[{l:"Total",v:st.total,c:T.primary,go:()=>onGo("all","all")},{l:"My Tasks",v:st.myTasks,c:T.purple,go:onMyTasks},{l:"In Progress",v:st.pending,c:T.warn,go:()=>onGo("in_approvals")},{l:"Approved",v:st.done,c:T.ok,go:()=>onGo("approved")},{l:"Rejected",v:st.rej,c:T.err,go:()=>onGo("all","rejected")}].map((s,i)=>
        <Card key={i} onClick={s.go} style={{padding:"14px 18px",borderLeft:`4px solid ${s.c}`,cursor:"pointer"}}><div style={{fontSize:26,fontWeight:700,color:s.c}}>{s.v}</div><div style={{fontSize:11,color:T.textSec,marginTop:2}}>{s.l}</div></Card>
      )}
      {(role==="doctor"||st.drafts>0)&&<Card onClick={onDrafts} style={{padding:"14px 18px",borderLeft:`4px solid ${T.textMut}`,cursor:"pointer"}}><div style={{fontSize:26,fontWeight:700,color:T.textSec}}>{st.drafts||0}</div><div style={{fontSize:11,color:T.textSec,marginTop:2}}>My Drafts</div></Card>}
    </div>
    {st.myTasks>0&&<Card onClick={onMyTasks} style={{padding:14,marginBottom:20,borderLeft:`4px solid ${T.purple}`,background:"#faf5ff",cursor:"pointer"}}><div style={{display:"flex",alignItems:"center",gap:12}}><Ic n="zap" s={18} style={{color:T.warn}}/><div><div style={{fontSize:13,fontWeight:600}}>You have {st.myTasks} request(s) requiring your action</div><div style={{fontSize:11,color:T.textSec,marginTop:2}}>Click to review and take action</div></div></div></Card>}
    <ST>My Pending Tasks ({myRows.length})</ST>
    <Card style={{padding:0,overflow:"hidden",marginBottom:24,maxHeight:340,overflowY:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}><thead style={{position:"sticky",top:0}}><tr style={{background:T.primaryLight}}>
        <S1.TH k="id">ID</S1.TH><th style={thS}>Type</th><S1.TH k="specialty">Specialty</S1.TH><S1.TH k="cpt">CPT Name</S1.TH><S1.TH k="status">Status</S1.TH><S1.TH k="stage">Stage</S1.TH><th style={thS}>Your Turn</th><th style={{borderBottom:`1px solid ${T.border}`}}/>
      </tr></thead><tbody>
        {myRows.length===0&&<tr><td colSpan={8} style={{padding:24,textAlign:"center",color:T.textMut,fontSize:12}}>Nothing is waiting on you.</td></tr>}
        {myRows.map(({p,stage,vl})=><tr key={p.id+(vl?vl.id:"")} onClick={()=>vl?onOpenVl(vl):onSel(p)} style={{cursor:"pointer",borderBottom:`1px solid ${T.borderLight}`}} onMouseEnter={e=>e.currentTarget.style.background=T.primaryLight} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"10px 14px",fontSize:12,fontWeight:600,color:T.primary}}>{p.id}</td>
          <td style={{padding:"10px 14px"}}><TypeBadge p={vl?{...p,version:2}:p}/></td>
          <td style={{padding:"10px 14px",fontSize:12}}>{p.specialty}</td>
          <td style={{padding:"10px 14px",fontSize:12}}>{(p.accurateCptName||p.proposedCptName||"").slice(0,28)}</td>
          <td style={{padding:"10px 14px"}}><SBadge status={p.status}/></td>
          <td style={{padding:"10px 14px",fontSize:11,color:T.textSec}}>{stage}</td>
          <td style={{padding:"10px 14px"}}><Badge color={T.purple} bg="#f5f3ff">Your Turn</Badge></td>
          <td style={{padding:"10px 14px"}}><span style={{color:T.textMut}}>→</span></td>
        </tr>)}
      </tbody></table>
    </Card>
    <EditReqPanel title="Edit Requests — Non-finance" sub="One request can combine several scenarios — one route, each approver once, then the PrimeCare confirm." reqs={vlReqs.filter(r=>r.kind!=="fin")} fin={false} me={me} onOpenVl={onOpenVl}/>
    <EditReqPanel title="Edit Requests — Finance" sub="Any finance field re-runs all 15 stages as a new version; non-finance changes in the same edit ride along, and a role outside the 15 (CFMO) is added as its own numbered stage — CFMO after 12 is stage 13." reqs={vlReqs.filter(r=>r.kind==="fin")} fin={true} me={me} onOpenVl={onOpenVl}/>
    <ST>Approved Procedures</ST>
    <Card style={{padding:0,overflow:"hidden",marginBottom:24}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.primaryLight}}>
        <S2.TH k="id">ID</S2.TH><S2.TH k="specialty">Specialty</S2.TH><S2.TH k="cpt">CPT Name</S2.TH><S2.TH k="pkgid">PKGID</S2.TH><S2.TH k="ver">Version</S2.TH><S2.TH k="status">Status</S2.TH>
      </tr></thead><tbody>
        {approved.slice(0,more).map(p=>{const o=openOn(p.id);const fin=o&&o.kind==="fin";return <tr key={p.id} onClick={()=>onSel(p)} style={{cursor:"pointer",borderBottom:`1px solid ${T.borderLight}`}} onMouseEnter={e=>e.currentTarget.style.background=T.primaryLight} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"10px 14px",fontSize:12,fontWeight:600,color:T.primary}}>{p.id}</td>
          <td style={{padding:"10px 14px",fontSize:12}}>{p.specialty}</td>
          <td style={{padding:"10px 14px",fontSize:12}}>{(p.accurateCptName||p.proposedCptName||"").slice(0,30)}</td>
          <td style={{padding:"10px 14px",fontSize:12}}>{p.systemSetup?.pkgId||"—"}</td>
          <td style={{padding:"10px 14px",fontSize:12}}>v{fin?o.toVer:p.version}</td>
          <td style={{padding:"10px 14px"}}>{fin?<Badge color={T.warn} bg="#fffbeb">Pending {(o.stages[o.stage]||{}).label}</Badge>:<SBadge status={p.status}/>}</td>
        </tr>;})}
      </tbody></table>
      {approved.length>more&&<div onClick={()=>setMore(more+50)} style={{padding:10,textAlign:"center",fontSize:12,fontWeight:600,color:T.primary,cursor:"pointer",borderTop:`1px solid ${T.border}`}}>Show 50 more of {approved.length}</div>}
    </Card>
    {deactReqs.length>0&&<React.Fragment>
    <ST>Deactivation / Reactivation Requests <P2Tag style={{marginLeft:6}}/></ST>
    <Card style={{padding:0,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.primaryLight}}>
        {["Req ID","Type","Base #","CPT","Current Step","Status",""].map((h,i)=><th key={i} style={thS}>{h}</th>)}
      </tr></thead><tbody>
        {deactReqs.map(r=><tr key={r.id} onClick={()=>onOpenDeact(r)} style={{cursor:"pointer",borderBottom:`1px solid ${T.borderLight}`}} onMouseEnter={e=>e.currentTarget.style.background=T.primaryLight} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"10px 14px",fontSize:12,fontWeight:600,color:T.primary}}>{r.id}</td>
          <td style={{padding:"10px 14px"}}><TypeBadge p={{reqType:r.reqType}}/></td>
          <td style={{padding:"10px 14px",fontSize:12}}>{r.baseId}</td>
          <td style={{padding:"10px 14px",fontSize:12}}>{(r.cpt||"").slice(0,26)}</td>
          <td style={{padding:"10px 14px",fontSize:11,color:T.textSec}}>{r.done?"—":DEACT_STAGES[r.stage-1].label}</td>
          <td style={{padding:"10px 14px"}}><span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:10,color:r.status==="completed"?T.ok:r.status==="rejected"?T.err:T.warn,background:(r.status==="completed"?T.ok:r.status==="rejected"?T.err:T.warn)+"18"}}>{r.status==="completed"?r.reqType+" Done":r.status==="rejected"?"Rejected":"In Approval"}</span></td>
          <td style={{padding:"10px 14px",color:T.textMut}}>→</td>
        </tr>)}
      </tbody></table>
    </Card></React.Fragment>}
  </div>;
}
