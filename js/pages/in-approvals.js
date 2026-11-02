function InApprovalsPage({procs,onSel,canAct,slaConfig=SLA_CONFIG_DEFAULT}){
  const pending=procs.filter(p=>!["approved","rejected","cpt_exists","draft"].includes(p.status));
  const[q,setQ]=useState("");const[statusF,setStatusF]=useState("all");const[branchF,setBranchF]=useState("all");const[specF,setSpecF]=useState("all");const[verF,setVerF]=useState("all");
  const S=useSort("id",-1);
  const stageOf=p=>p.status&&p.status.indexOf("cpt_exists")===0?p.status:(STAGES.find(x=>x.num===p.currentStage)||{}).label||p.status;
  const slaOf=p=>{const x=slaStateFor(p,slaConfig);if(!x)return {t:"No SLA",c:T.textMut,k:9};return x.state==="overdue"?{t:"Overdue",c:T.err,k:0}:x.state==="due"?{t:"Due today",c:T.warn,k:1}:{t:x.left+" d left",c:T.ok,k:2+x.left};};
  const G={id:p=>p.id,specialty:p=>p.specialty||"",cpt:p=>p.accurateCptName||p.proposedCptName||"",ver:p=>p.version||1,stage:p=>stageOf(p),elapsed:p=>daysBtw(p.requestDate,new Date()),sla:p=>slaOf(p).k,status:p=>(STATUS[p.status]||{}).label||p.status};
  const specs=[...new Set(pending.map(p=>p.specialty).filter(Boolean))].sort();
  const statuses=[...new Set(pending.map(p=>p.status))].sort();
  const rows=S.sortRows(pending.filter(p=>(statusF==="all"||p.status===statusF)&&(branchF==="all"||p.branch===branchF)&&(specF==="all"||p.specialty===specF)&&(verF==="all"||(verF==="v1"?(p.version||1)===1:(p.version||1)>1))&&(!q||(p.id+" "+(p.proposedCptName||"")+" "+(p.accurateCptName||"")+" "+((p.requestor||{}).name||"")).toLowerCase().includes(q.toLowerCase()))),G);
  const fsel={...inp,fontSize:11.5,width:"auto",margin:0,padding:"8px 10px"};
  const td={padding:"10px 12px",fontSize:12};
  return<div style={{maxWidth:1600}}>
    <h1 style={{fontSize:18,fontWeight:600,color:T.text,margin:"0 0 16px"}}>In Approvals Tracker</h1>
    <Card style={{padding:14,marginBottom:16}}><div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
      <div style={{flex:"1 1 220px",minWidth:200,position:"relative"}}><Ic n="search" s={13} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.textMut}}/><input style={{...inp,fontSize:12,margin:0,paddingLeft:30}} placeholder="Search ID, CPT, requestor…" value={q} onChange={e=>setQ(e.target.value)}/></div>
      <Select style={fsel} value={statusF} onChange={e=>setStatusF(e.target.value)}><option value="all">All Statuses</option>{statuses.map(x=><option key={x} value={x}>{(STATUS[x]||{}).label||x}</option>)}</Select>
      <Select style={fsel} value={branchF} onChange={e=>setBranchF(e.target.value)}><option value="all">All Branches</option>{BRANCHES.map(b=><option key={b.code} value={b.code}>{b.name}</option>)}</Select>
      <Select style={fsel} value={specF} onChange={e=>setSpecF(e.target.value)}><option value="all">All Specialties</option>{specs.map(x=><option key={x} value={x}>{x}</option>)}</Select>
      <Select style={fsel} value={verF} onChange={e=>setVerF(e.target.value)}><option value="all">All Versions</option><option value="v1">Original (V1)</option><option value="edits">Edited (V2+)</option></Select>
      <span style={{marginLeft:"auto",fontSize:11,color:T.textMut,fontWeight:600}}>{rows.length} of {pending.length}</span>
    </div></Card>
    <Card style={{padding:0,overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.primaryLight}}>
      <S.TH k="id">ID</S.TH><th style={{padding:"10px 12px",fontSize:10.5,fontWeight:800,color:T.textSec,textTransform:"uppercase",letterSpacing:0.4,textAlign:"left"}}>Type</th><S.TH k="specialty">Specialty</S.TH><S.TH k="cpt">CPT Name</S.TH><S.TH k="ver">Ver</S.TH><S.TH k="stage">Stage</S.TH><S.TH k="elapsed">Elapsed</S.TH><S.TH k="sla">SLA</S.TH><S.TH k="status">Status</S.TH>
    </tr></thead><tbody>
      {rows.length===0&&<tr><td colSpan={9} style={{padding:40,textAlign:"center",color:T.textMut}}>Nothing is in approval</td></tr>}
      {rows.map(p=>{const sl=slaOf(p);const fw=p.delegatedToUser||(p.reassignedTo&&p.reassignedTo.stage===p.currentStage?p.reassignedTo:null);
        return<tr key={p.id} onClick={()=>onSel(p)} style={{cursor:"pointer",borderBottom:`1px solid ${T.borderLight}`}} onMouseEnter={e=>e.currentTarget.style.background=T.primaryLight} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{...td,fontWeight:600,color:T.primary}}>{p.id}</td>
          <td style={td}><TypeBadge p={p}/></td>
          <td style={td}>{p.specialty||"—"}</td>
          <td style={td}>{p.accurateCptName||p.proposedCptName||"—"}</td>
          <td style={td}><Badge color={T.ok}>V{p.version||1}</Badge></td>
          <td style={td}>{stageOf(p)}{fw&&<div><span style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:3,fontSize:9.5,fontWeight:700,color:T.purple,background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:10,padding:"1px 8px"}}><Ic n="forward" s={9}/>{fw.name}</span></div>}</td>
          <td style={td}>{daysBtw(p.requestDate,new Date())} d</td>
          <td style={{...td,color:sl.c,fontWeight:sl.k===0?600:400}}>{sl.t}</td>
          <td style={td}><SBadge status={p.status}/></td>
        </tr>;})}
    </tbody></table></Card>
  </div>;
}
