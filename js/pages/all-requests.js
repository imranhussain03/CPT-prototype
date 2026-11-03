// ═══════════════════════════════════════════════════════════════
// ALL REQUESTS
// ═══════════════════════════════════════════════════════════════
function AllRequests({procs,onSel,initStatus="all",vlReqs=[]}){
  const[search,setSearch]=useState("");const[statusF,setStatusF]=useState(initStatus||"all");
  const[branchF,setBranchF]=useState("all");const[specF,setSpecF]=useState("all");const[verF,setVerF]=useState("all");
  const[sortK,setSortK]=useState("date");const[sortD,setSortD]=useState(-1);
  const specs=[...new Set(procs.map(p=>p.specialty).filter(Boolean))].sort();
  const getV={id:p=>p.id,date:p=>new Date(p.requestDate||0).getTime(),specialty:p=>p.specialty||"",cpt:p=>p.accurateCptCode||p.proposedCptCode||"",cptname:p=>p.accurateCptName||p.proposedCptName||"",branch:p=>p.branch||"",status:p=>p.status||"",requestor:p=>(p.requestor&&p.requestor.name)||"",ver:p=>p.version||1};
  const filtered=procs.filter(e=>{
    if(statusF!=="all"&&e.status!==statusF)return false;
    if(branchF!=="all"&&e.branch!==branchF)return false;
    if(specF!=="all"&&e.specialty!==specF)return false;
    if(verF==="v1"&&(e.version||1)>1)return false;
    if(verF==="edits"&&(e.version||1)<2)return false;
    if(search){const q=search.toLowerCase();return e.id.includes(q)||(e.proposedCptCode||"").toLowerCase().includes(q)||(e.accurateCptCode||"").toLowerCase().includes(q)||(e.proposedCptName||"").toLowerCase().includes(q)||((e.requestor&&e.requestor.name)||"").toLowerCase().includes(q);}
    return true;
  }).sort((a,b)=>{const f=getV[sortK]||getV.date;const x=f(a),y=f(b);return (x<y?-1:x>y?1:0)*sortD;});
  const nFilters=(statusF!=="all"?1:0)+(branchF!=="all"?1:0)+(specF!=="all"?1:0)+(verF!=="all"?1:0);
  const TH=({k:kk,children,w})=>(
    <th onClick={()=>{if(sortK===kk)setSortD(d=>-d);else{setSortK(kk);setSortD(kk==="date"?-1:1);}}} style={{padding:"10px 12px",fontSize:10,fontWeight:800,color:sortK===kk?T.primary:T.textSec,textTransform:"uppercase",letterSpacing:0.4,textAlign:"left",cursor:"pointer",userSelect:"none",whiteSpace:"nowrap",width:w}}>
      {children}<span style={{marginLeft:4,fontSize:9,opacity:sortK===kk?1:0.28}}>{sortK===kk?(sortD>0?"▲":"▼"):"↕"}</span>
    </th>);
  const fsel={...inp,fontSize:11.5,width:"auto",minWidth:0,padding:"8px 10px",margin:0};
  return<div style={{maxWidth:1600}}>
    <h1 style={{fontSize:18,fontWeight:600,color:T.text,margin:"0 0 16px"}}>All Procedure Requests</h1>
    <Card style={{padding:14,marginBottom:16}}>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{flex:"1 1 220px",minWidth:200,position:"relative"}}>
          <Ic n="search" s={13} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.textMut}}/>
          <input style={{...inp,fontSize:12,margin:0,paddingLeft:30}} placeholder="Search requests" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <Select style={fsel} value={statusF} onChange={e=>setStatusF(e.target.value)}><option value="all">All Statuses</option>{[...new Set(procs.map(p=>p.status))].sort().map(s=><option key={s} value={s}>{(STATUS[s]||{}).label||s.replace(/_/g," ")}</option>)}</Select>
        <Select style={fsel} value={branchF} onChange={e=>setBranchF(e.target.value)}><option value="all">All Branches</option>{BRANCHES.map(b=><option key={b.code} value={b.code}>{b.name}</option>)}</Select>
        <Select style={fsel} value={specF} onChange={e=>setSpecF(e.target.value)}><option value="all">All Specialties</option>{specs.map(s=><option key={s} value={s}>{s}</option>)}</Select>
        <Select style={fsel} value={verF} onChange={e=>setVerF(e.target.value)}><option value="all">All Versions</option><option value="v1">Original (V1)</option><option value="edits">Edited (V2+)</option></Select>
        {nFilters>0&&<button onClick={()=>{setStatusF("all");setBranchF("all");setSpecF("all");setVerF("all");}} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 12px",borderRadius:8,border:`1px solid ${T.border}`,background:"#fff",fontSize:11.5,fontWeight:600,color:T.textSec,cursor:"pointer"}}><Ic n="x" s={11}/>Clear filters ({nFilters})</button>}
        <span style={{marginLeft:"auto",fontSize:11,color:T.textMut,fontWeight:600}}>{filtered.length} of {procs.length}</span>
      </div>
    </Card>
    <Card style={{padding:0,overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.primaryLight}}>
      <TH k="id">ID</TH>
      <th style={{padding:"10px 12px",fontSize:10,fontWeight:800,color:T.textSec,textTransform:"uppercase",letterSpacing:0.4,textAlign:"left"}}>Type</th>
      <TH k="date">Date</TH><TH k="specialty">Specialty</TH><TH k="cpt">CPT Code</TH><TH k="cptname">CPT Name</TH><TH k="branch">Branch</TH><TH k="status">Status</TH><TH k="requestor">Requestor</TH><TH k="ver">Ver</TH>
    </tr></thead><tbody>
      {filtered.length===0&&<tr><td colSpan={10} style={{padding:40,textAlign:"center",color:T.textMut}}>{procs.length===0?"You are not involved in any packages yet. A package appears here the moment it reaches you, and stays afterwards.":"No packages match your search or filter."}</td></tr>}
      {filtered.map(p=><tr key={p.id} onClick={()=>onSel(p)} style={{cursor:"pointer",borderBottom:`1px solid ${T.borderLight}`}} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
        <td style={{padding:"10px 12px",fontSize:12,fontWeight:600,color:T.primary}}>{p.id}</td>
        <td style={{padding:"10px 12px"}}><TypeBadge p={p}/></td>
        <td style={{padding:"10px 12px",fontSize:11,color:T.textSec}}>{fmtDate(p.requestDate)}</td>
        <td style={{padding:"10px 12px",fontSize:12}}>{p.specialty||"—"}</td>
        <td style={{padding:"10px 12px",fontSize:12}}>{p.accurateCptCode||p.proposedCptCode||"—"}</td>
        <td style={{padding:"10px 12px",fontSize:12}}>{(p.accurateCptName||p.proposedCptName||"—").slice(0,25)}</td>
        <td style={{padding:"10px 12px",fontSize:11}}>{p.branch}</td>
        <td style={{padding:"10px 12px"}}><SBadge status={p.status}/></td>
        <td style={{padding:"10px 12px",fontSize:11,color:T.textSec}}>{p.requestor?.name}</td>
        <td style={{padding:"10px 12px"}}><Badge color={T.info}>V{p.version}</Badge></td>
      </tr>)}
    </tbody></table></Card>
  </div>;
}
// ═══════════════════════════════════════════════════════════════
