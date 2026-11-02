// ═══════════════════════════════════════════════════════════════
// PHASE 2 — DEACTIVATION / REACTIVATION
// ═══════════════════════════════════════════════════════════════

// Raise-request modal (entry from Dashboard) — mirrors the New Procedure entry style
function DeactRaiseModal({type,base,onClose,onSubmit}){
  const[just,setJust]=useState("");const[addl,setAddl]=useState("");
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:20}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:10,padding:22,width:560,maxWidth:"100%",maxHeight:"90vh",overflow:"auto",boxShadow:"0 10px 40px rgba(0,0,0,0.2)"}}>
      <ST style={{fontSize:16,color:type==="Deactivation"?T.err:T.ok,marginBottom:4,display:"flex",alignItems:"center",gap:10}}><Ic n={type==="Deactivation"?"ban":"rotateCcw"} s={15}/> {type} Request <P2Tag/></ST>
      <p style={{fontSize:11,color:T.textSec,margin:"0 0 10px"}}>Base #{base.id} · {base.accurateCptName||base.proposedCptName} · PKGID {base.systemSetup?.pkgId||"—"} · Operation {base.systemSetup?.opCode||"—"}</p>
      <label style={lbl}>Justification <span style={{color:T.err}}>*</span></label>
      <textarea style={{...inp,height:76,resize:"vertical",fontFamily:T.font,marginBottom:12}} value={just} onChange={e=>setJust(e.target.value)} placeholder={`Why is this procedure being ${type.toLowerCase()==="deactivation"?"deactivated":"reactivated"}?`} autoFocus/>
      <label style={lbl}>Additional details &amp; instructions</label>
      <textarea style={{...inp,height:76,resize:"vertical",fontFamily:T.font,marginBottom:16}} value={addl} onChange={e=>setAddl(e.target.value)} placeholder="Handling notes for the reviewers / CSCM..."/>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
        <button onClick={onClose} style={{padding:"9px 18px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
        <button onClick={()=>{if(!just.trim()){alert("Justification is required");return;}onSubmit(just,addl);}} style={{padding:"9px 20px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Submit {type} Request</button>
      </div>
    </div>
  </div>;
}

// Deactivation / Reactivation request detail — same layout as the procedure detail (WfTracker + tabs + action panel)
function DeactDetail({req:r,me,onBack,onAct}){
  const[tab,setTab]=useState("overview");const tabView=tab;
  const[comment,setComment]=useState("");
  if(!r||!r.id)return <div style={{maxWidth:1600}}><button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec}}>← Back</button><Card style={{padding:30,textAlign:"center",color:T.textMut}}>Request not found.</Card></div>;
  const done=r.done;
  const wfStages=DEACT_STAGES.map(s=>({num:s.n,label:s.label}));
  const cur=done?DEACT_STAGES.length:(r.stage-1);
  const stColor=r.status==="completed"?T.ok:r.status==="rejected"?T.err:T.warn;
  const stLabel=r.status==="completed"?r.reqType+" — Done":r.status==="rejected"?"Rejected":"In Approval";
  const curStage=DEACT_STAGES[r.stage-1];
  const pct=done?100:Math.round(((r.stage-1)/DEACT_STAGES.length)*100);
  const raisedBy=r.timeline&&r.timeline[0]?r.timeline[0].by:"—";
  const raisedOn=r.date||(r.timeline&&r.timeline[0]?r.timeline[0].date:"—");
  const tabs=[{k:"overview",l:"Overview"},{k:"routing",l:"Routing Chain"},{k:"timeline",l:"Timeline"}];
  return <div style={{maxWidth:1600}}>
    <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:12}}>← Back to Dashboard</button>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:0}}>{r.reqType} Request · {r.id}</h1>
          <TypeBadge p={{reqType:r.reqType}}/>
          <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:10,color:stColor,background:stColor+"18"}}>{stLabel}</span>
        </div>
        <p style={{fontSize:13,color:T.textSec,margin:"4px 0 0"}}>Base #{r.baseId} · {r.cpt} · raised {raisedOn}</p>
      </div>
    </div>
    <WfTracker stages={wfStages} cur={cur}/>
    <div style={{display:"flex",gap:0,borderBottom:`2px solid ${T.border}`,margin:"8px 0 20px"}}>
      {tabs.map(t2=><button key={t2.k} onClick={()=>setTab(t2.k)} style={{padding:"10px 18px",border:"none",background:"none",fontSize:13,fontWeight:tab===t2.k?600:400,color:tab===t2.k?T.primary:T.textSec,borderBottom:tab===t2.k?`3px solid ${T.primary}`:"3px solid transparent",cursor:"pointer",marginBottom:-2,fontFamily:T.font}}>{t2.l}</button>)}
    </div>
    {tabView==="overview"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
        <Card style={{padding:24}}>
          <ST style={{fontSize:15,color:T.primary,marginBottom:16}}>Request Information</ST>
          {[{l:"Request ID",v:r.id},{l:"Type",v:r.reqType},{l:"Base Procedure",v:"#"+r.baseId},{l:"CPT Name",v:r.cpt},{l:"PKGID",v:r.pkgId},{l:"Operation Code",v:r.opCode},{l:"Raised By",v:raisedBy},{l:"Date",v:raisedOn}].map((f,i)=>
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.borderLight}`}}><span style={{fontSize:12,color:T.textSec}}>{f.l}</span><span style={{fontSize:12,fontWeight:500,color:T.text,textAlign:"right",maxWidth:"55%"}}>{f.v||"—"}</span></div>)}
        </Card>
        <Card style={{padding:24}}>
          <ST style={{fontSize:15,color:T.primary,marginBottom:16}}>Approval Progress</ST>
          <div style={{fontSize:11,fontWeight:700,color:T.ok,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Current Step</div>
          <div style={{padding:"12px 14px",background:done?"#ecfdf5":"#fffbeb",borderRadius:8,border:`1px solid ${(done?T.ok:T.warn)}40`,marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:600,color:done?T.ok:T.warn}}>{done?(r.status==="rejected"?"Rejected":r.reqType+" complete & acknowledged"):curStage.label}</div>
            <div style={{fontSize:10,color:T.textMut,marginTop:2}}>Step {done?DEACT_STAGES.length:r.stage} of {DEACT_STAGES.length}</div>
          </div>
          <div style={{fontSize:11,fontWeight:700,color:T.textSec,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Progress</div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6}}><span style={{color:T.textSec}}>{done?DEACT_STAGES.length:r.stage-1} of {DEACT_STAGES.length} approved</span><span style={{fontWeight:600,color:T.primary}}>{pct}%</span></div>
          <div style={{height:6,background:"#e2e8f0",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,background:`linear-gradient(90deg, ${T.ok}, ${T.primary})`,width:pct+"%",transition:"width 0.5s"}}/></div>
        </Card>
      </div>
      <Card style={{marginBottom:20,padding:20}}>
        <ST style={{fontSize:15,color:T.primary,marginBottom:12}}>Justification &amp; Instructions</ST>
        <div style={{marginBottom:12,padding:12,background:"#f8fafc",borderRadius:8,borderLeft:`3px solid ${T.primary}`}}><div style={{fontSize:10,color:T.textMut,fontWeight:700,textTransform:"uppercase",marginBottom:3}}>Justification</div><div style={{fontSize:12,color:T.text}}>{r.justification}</div></div>
        <div style={{padding:12,background:"#f8fafc",borderRadius:8,borderLeft:`3px solid ${T.info}`}}><div style={{fontSize:10,color:T.textMut,fontWeight:700,textTransform:"uppercase",marginBottom:3}}>Additional details &amp; instructions</div><div style={{fontSize:12,color:T.text}}>{r.additionalDetails||"—"}</div></div>
      </Card>
      {r.attachments&&r.attachments.length>0&&<Card style={{marginBottom:20,padding:20}}><ST style={{fontSize:15,color:T.primary,marginBottom:12}}>Attachments</ST><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{r.attachments.map((f,i)=><span key={i} style={{fontSize:12,padding:"7px 12px",background:"#f8fafc",border:`1px solid ${T.border}`,borderRadius:8}}>{attName(f)}</span>)}</div></Card>}
      {!done&&<Card style={{padding:18,background:"#f8fafc",border:`1px solid ${T.border}`,borderLeft:`3px solid ${T.warn}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><ST style={{fontSize:13,color:T.text,margin:0}}>Your decision — {curStage.label}</ST><span style={{fontSize:10,color:T.textMut}}>Acting as {me.name}</span></div>
        <textarea style={{...inp,height:44,resize:"vertical",fontFamily:T.font,marginBottom:10}} placeholder="Comment (required to reject)..." value={comment} onChange={e=>setComment(e.target.value)}/>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{onAct(r,"approve",comment);setComment("");}} style={{padding:"9px 20px",borderRadius:8,border:"none",background:T.ok,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>{r.stage===DEACT_STAGES.length?"Acknowledge":r.stage===DEACT_STAGES.length-1?"✓ Confirm on PrimeCare":"✓ Approve"} →</button>
          <button onClick={()=>{if(!comment.trim()){alert("Comment required to reject");return;}onAct(r,"reject",comment);setComment("");}} style={{padding:"9px 20px",borderRadius:8,border:`1px solid ${T.err}`,background:"#fff",color:T.err,fontSize:12,fontWeight:600,cursor:"pointer"}}>✕ Reject</button>
        </div>
      </Card>}
      {done&&r.status==="completed"&&<div style={{padding:14,borderRadius:8,background:"#ecfdf5",border:`1px solid ${T.ok}40`,fontSize:12,color:T.ok,fontWeight:600}}>{r.reqType} complete &amp; acknowledged — auto-email sent to related parties. Base procedure #{r.baseId} marked {r.reqType==="Deactivation"?"Deactivated":"Reactivated"}.</div>}
    </div>}
    {tabView==="routing"&&<Card style={{padding:20}}>
      <ST style={{fontSize:14,color:T.primary,marginBottom:12}}>Approval Routing Chain (newest first)</ST>
      {[...(r.timeline||[])].reverse().map((t2,i)=><div key={i} style={{display:"flex",gap:10,paddingBottom:12}}>
        <div style={{width:22,height:22,borderRadius:"50%",background:T.ok+"20",color:T.ok,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>✓</div>
        <div><div style={{fontSize:12,fontWeight:600,color:T.text}}>{t2.by}</div><div style={{fontSize:11,color:T.textSec}}>{t2.action}</div><div style={{fontSize:9,color:T.textMut}}>{t2.date}</div></div>
      </div>)}
    </Card>}
    {tabView==="timeline"&&<Card style={{padding:20}}>
      <ST style={{fontSize:14,color:T.primary,marginBottom:12}}>Activity Timeline (newest first)</ST>
      {[...(r.timeline||[])].reverse().map((t2,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.borderLight}`,fontSize:11}}><span style={{color:T.text}}><strong>{t2.by}</strong> · {t2.action}</span><span style={{color:T.textMut}}>{t2.date}</span></div>)}
    </Card>}
  </div>;
}
