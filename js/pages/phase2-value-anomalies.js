// ═══════════════════════════════════════════════════════════════
// PHASE 2 — VALUE ANOMALIES REPORT
// ═══════════════════════════════════════════════════════════════
function ValueAnomaliesReport({procs,showToast}){
  const[expanded,setExpanded]=useState({});
  const all=procs.filter(p=>p.status==="approved").map(p=>{
    const groups=[["Procedure Consumables",p.templates?.procCons],["Wards Consumables",p.templates?.wardsCons],["Procedure Drugs",p.templates?.procDrugs],["Wards Drugs",p.templates?.wardsDrugs]];
    let approvedTotal=0,currentTotal=0;const changed=[];
    groups.forEach(([g,items])=>(items||[]).forEach(it=>{const aUnit=it.unitCost||0;const m=itemMeta(it.code);const uom=(m.uoms||[]).find(u=>u.unit===it.uom);const cUnit=uom?uom.cost:aUnit;approvedTotal+=aUnit*(it.qty||0);currentTotal+=cUnit*(it.qty||0);if(Math.abs(cUnit-aUnit)>0.0001)changed.push({group:g,name:it.name,code:it.code,uom:it.uom,qty:it.qty,aUnit,cUnit,updated:m.updated});}));
    const diffPct=approvedTotal>0?((currentTotal-approvedTotal)/approvedTotal*100):0;
    return {p,approvedTotal,currentTotal,diffPct,changed};
  });
  const rows=all.filter(r=>r.changed.length>0).sort((a,b)=>Math.abs(b.diffPct)-Math.abs(a.diffPct));
  const totalImpact=rows.reduce((s,r)=>s+(r.currentTotal-r.approvedTotal),0);
  const itemsChanged=rows.reduce((s,r)=>s+r.changed.length,0);
  const matched=all.length-rows.length;
  return <div style={{maxWidth:1600}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div><h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:0,display:"flex",alignItems:"center",gap:10}}>Value Anomalies Report <P2Tag/></h1>
      <p style={{fontSize:12,color:T.textSec,margin:"4px 0 0"}}>Runs when the item master is updated with new cost/sale prices. Compares each procedure's approved prices vs the current master — sorted by highest difference, matching procedures auto-hidden.</p></div>
      <button onClick={()=>showToast&&showToast("Value Anomalies report shared by email to related parties")} style={{padding:"8px 16px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>✉️ Share via email</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,margin:"16px 0"}}>
      {[{l:"Procedures flagged",v:rows.length,c:T.err},{l:"Items changed",v:itemsChanged,c:T.warn},{l:"Total cost impact",v:fmtKWD(totalImpact),c:totalImpact>=0?T.err:T.ok},{l:"Matching (hidden)",v:matched,c:T.ok}].map((s,i)=>
        <Card key={i} style={{padding:"14px 16px",borderLeft:`4px solid ${s.c}`}}><div style={{fontSize:20,fontWeight:700,color:s.c}}>{s.v}</div><div style={{fontSize:11,color:T.textSec,marginTop:2}}>{s.l}</div></Card>)}
    </div>
    <div style={{padding:10,marginBottom:16,borderRadius:8,background:"#eff6ff",border:`1px solid ${T.info}30`,fontSize:11,color:T.info}}>Hiding is <strong>per procedure, not per item</strong> — if any one item's price changed, the whole procedure is shown. Click a row to see which items moved.</div>
    {rows.length===0?<Card style={{padding:30,textAlign:"center",color:T.textMut,fontSize:13}}>No anomalies — all approved procedures match the current master prices.</Card>:
    <Card style={{padding:0,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.primaryLight}}>
        {["#","CPT Name","Approved Cost","Current Cost","Δ","% Diff","Items",""].map((h,i)=><th key={i} style={{padding:"10px 12px",fontSize:10,fontWeight:600,color:T.textSec,textAlign:i>=2?"right":"left",borderBottom:`1px solid ${T.border}`}}>{h}</th>)}
      </tr></thead><tbody>
        {rows.map(r=>{const up=r.diffPct>0;const open=!!expanded[r.p.id];
          return <React.Fragment key={r.p.id}>
          <tr onClick={()=>setExpanded({...expanded,[r.p.id]:!open})} style={{cursor:"pointer",borderBottom:`1px solid ${T.borderLight}`}}>
            <td style={{padding:"10px 12px",fontSize:12,fontWeight:600,color:T.primary}}>{r.p.id}</td>
            <td style={{padding:"10px 12px",fontSize:12}}>{r.p.accurateCptName||r.p.proposedCptName}</td>
            <td style={{padding:"10px 12px",fontSize:12,textAlign:"right"}}>{fmtKWD(r.approvedTotal)}</td>
            <td style={{padding:"10px 12px",fontSize:12,textAlign:"right",fontWeight:600}}>{fmtKWD(r.currentTotal)}</td>
            <td style={{padding:"10px 12px",fontSize:12,textAlign:"right",color:up?T.err:T.ok}}>{up?"+":""}{fmtKWD(r.currentTotal-r.approvedTotal)}</td>
            <td style={{padding:"10px 12px",textAlign:"right"}}><span style={{fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:8,color:up?T.err:T.ok,background:up?"#fef2f2":"#ecfdf5"}}>{up?"▲":"▼"} {Math.abs(r.diffPct).toFixed(1)}%</span></td>
            <td style={{padding:"10px 12px",fontSize:11,textAlign:"right",color:T.textSec}}>{r.changed.length}</td>
            <td style={{padding:"10px 12px",color:T.textMut}}>{open?"▾":"▸"}</td>
          </tr>
          {open&&<tr><td colSpan={8} style={{padding:"0 0 8px",background:"#fafbfc"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>
              {["Item","UOM","Qty","Approved Unit","Current Unit","% Diff","Master Updated"].map((h,i)=><th key={i} style={{padding:"6px 12px",fontSize:9,fontWeight:600,color:T.textMut,textAlign:i>=2&&i<6?"right":"left"}}>{h}</th>)}
            </tr></thead><tbody>
              {r.changed.map((c,i)=>{const pd=c.aUnit>0?((c.cUnit-c.aUnit)/c.aUnit*100):0;return <tr key={i} style={{borderTop:`1px solid ${T.borderLight}`}}>
                <td style={{padding:"6px 12px",fontSize:11}}>{c.name}</td>
                <td style={{padding:"6px 12px",fontSize:11,color:T.textSec}}>{c.uom}</td>
                <td style={{padding:"6px 12px",fontSize:11,textAlign:"right"}}>{c.qty}</td>
                <td style={{padding:"6px 12px",fontSize:11,textAlign:"right"}}>{fmtKWD(c.aUnit)}</td>
                <td style={{padding:"6px 12px",fontSize:11,textAlign:"right",fontWeight:600}}>{fmtKWD(c.cUnit)}</td>
                <td style={{padding:"6px 12px",fontSize:11,textAlign:"right",color:pd>0?T.err:T.ok}}>{pd>0?"+":""}{pd.toFixed(1)}%</td>
                <td style={{padding:"6px 12px",fontSize:10,color:T.textMut}}>{c.updated||"—"}</td>
              </tr>;})}
            </tbody></table>
          </td></tr>}
          </React.Fragment>;})}
      </tbody></table>
    </Card>}
  </div>;
}
