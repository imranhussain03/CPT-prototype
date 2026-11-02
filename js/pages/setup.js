// ═══════════════════════════════════════════════════════════════
// SETUP — Master data management (Batch 2: Operation Skill list)
// ═══════════════════════════════════════════════════════════════
// SETUP — card hub (Item Evaluation style). Cards open a master-data list section.
// ═══ SETUP — live parity additions: Items Master (SIC), Public Holidays, Edit Design, edit-chain roles ═══
const HOLIDAYS_DEFAULT=[{id:1,name:"Isra & Mi'raj",date:"2027-01-15",isActive:true},{id:2,name:"National Day",date:"2027-02-25",isActive:true},{id:3,name:"Liberation Day",date:"2027-02-26",isActive:true},{id:4,name:"Eid Al-Fitr",date:"2027-03-10",isActive:true},{id:5,name:"Arafat Day",date:"2027-05-16",isActive:true},{id:6,name:"Eid Al-Adha",date:"2027-05-17",isActive:true},{id:7,name:"Islamic New Year",date:"2027-06-06",isActive:true},{id:8,name:"Prophet's Birthday",date:"2026-08-25",isActive:false}];
const SetupBack=({onBack,title,sub,icon,right})=><React.Fragment>
  <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:8,padding:0,fontFamily:T.font}}>← Back to Setup</button>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:14}}>
    <div><h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:0,display:"flex",alignItems:"center",gap:8}}>{icon&&<span>{icon}</span>}{title}</h1>{sub&&<p style={{fontSize:12,color:T.textSec,margin:"4px 0 0",maxWidth:900}}>{sub}</p>}</div>{right}
  </div></React.Fragment>;
function SetupItemsMaster({onBack,showToast}){
  const all=[...CONS_MASTER.map(i=>({...i,kind:"Consumable"})),...DRUGS_MASTER.map(i=>({...i,kind:"Drug"}))];
  const[code,setCode]=useState("");const[cat,setCat]=useState("");const[name,setName]=useState("");const[q,setQ]=useState({});const[synced,setSynced]=useState("21 Sept 2026, 08:51");const[busy,setBusy]=useState(false);
  const cats=[...new Set(all.map(i=>i.cat+" → "+i.sub))].sort();
  const rows=all.filter(i=>(!q.code||String(i.code).startsWith(q.code))&&(!q.cat||(i.cat+" → "+i.sub)===q.cat)&&(!q.name||i.name.toLowerCase().includes(q.name.toLowerCase())));
  return <div style={{maxWidth:1600}}>
    <SetupBack onBack={onBack} title="Items Master (SIC)" sub="The priced item master, mirrored from IEMS. Browse the catalogue, or narrow it by item code or category."/>
    <div style={{padding:"10px 14px",borderRadius:8,background:"#eff6ff",border:"1px solid #bfdbfe",fontSize:11.5,color:"#1e40af",lineHeight:1.55,marginBottom:12}}>
      <strong>Read-only mirror of IEMS.</strong> Items are maintained in the Item Evaluation system — CliniPack never writes back, not the item, its Kind or its prices. <strong>Export for IEMS</strong> downloads every mirrored item with CPT Kind, UOM, Cost and Sale ready to fill in the shape IEMS imports; prices arrive here on the next sync — which is why this screen has an export and no import. <strong>One unit per item</strong>, and it must be the unit the item is issued in.
    </div>
    <Card style={{padding:"12px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
      <div style={{flex:1}}><div style={{fontSize:12.5,fontWeight:700,color:T.text}}>Last synced: {synced}</div><div style={{fontSize:11,color:T.textSec}}>Mirror holds {all.length.toLocaleString()} items · 0 failed · 0 deactivated</div></div>
      <button onClick={()=>showToast("Sync status refreshed","info")} style={{...BTN2,border:`1px solid ${T.border}`,color:T.textSec}}>Refresh status</button>
      <button onClick={()=>{downloadSheet("IEMS_export",[{k:"code",l:"Item Code"},{k:"name",l:"Item Name"},{k:"kind",l:"CPT Kind"},{k:"uom",l:"CPT UOM"},{k:"cost",l:"CPT Cost"},{k:"sale",l:"CPT Sale"}],all.map(i=>({code:i.code,name:i.name,kind:"",uom:"",cost:"",sale:""})));}} style={{...BTN2,border:`1px solid ${T.border}`,color:T.textSec}}><Ic n="download" s={13}/>Export for IEMS</button>
      <button onClick={()=>{setBusy(true);setTimeout(()=>{setBusy(false);setSynced(new Date().toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}));showToast("Sync from IEMS complete — every row examined");},900);}} style={{...BTN,background:T.primary,color:"#fff"}}><Ic n="rotateCcw" s={13}/>{busy?"Syncing…":"Sync from IEMS"}</button>
    </Card>
    <div style={{display:"flex",gap:8,marginBottom:6,flexWrap:"wrap"}}>
      <input style={{...inp,margin:0,width:220}} placeholder="Item code — starts with" value={code} onChange={e=>setCode(e.target.value)}/>
      <Select style={{...inp,margin:0,width:280}} value={cat} onChange={e=>setCat(e.target.value)}><option value="">Any category</option>{cats.map(c=><option key={c}>{c}</option>)}</Select>
      <input style={{...inp,margin:0,flex:1,minWidth:200}} placeholder="Item name contains (whole catalogue)" value={name} onChange={e=>setName(e.target.value)}/>
      <button onClick={()=>setQ({code,cat,name})} style={{...BTN,background:T.primary,color:"#fff"}}>Search</button>
    </div>
    <div style={{fontSize:10.5,color:T.textMut,marginBottom:10}}>Item code and category run against indexed columns on the server. Item name searches the whole catalogue; combining a name with a code or category narrows within that result.</div>
    <Card style={{padding:0,overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.primaryLight}}>{["Item Code","Item Name","Category","Kind","Units & pricing","Active","Last synced"].map(h=><th key={h} style={{...th,textAlign:"left",fontSize:10,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
      <tbody>{rows.map(i=><tr key={i.code} style={{borderTop:`1px solid ${T.borderLight}`}}>
        <td style={{...td,textAlign:"left",fontWeight:700,color:T.primary}}>{i.code}</td><td style={{...td,textAlign:"left"}}>{i.name}</td><td style={{...td,textAlign:"left",color:T.textSec}}>{i.cat} → {i.sub}</td>
        <td style={{...td,textAlign:"left"}}><Badge color={i.kind==="Drug"?T.purple:T.info}>{i.kind}</Badge></td>
        <td style={{...td,textAlign:"left",fontSize:11}}>{(i.uoms||[]).length?(i.uoms||[]).map(u=><div key={u.unit}>{u.unit}: {fmtKWD(u.cost)} / {fmtKWD(u.sale)}</div>):<span style={{color:T.textMut}}>no price</span>}</td>
        <td style={{...td,textAlign:"left"}}><Badge color={T.ok} bg="#ecfdf5">Active</Badge></td><td style={{...td,textAlign:"left",fontSize:11,color:T.textMut}}>{fmtDate(i.updated)}</td></tr>)}</tbody></table></Card>
  </div>;
}
function SetupHolidays({items,setItems,onBack,showToast}){
  const[edit,setEdit]=useState(null);const[q,setQ]=useState("");
  const rows=items.filter(h=>!q||h.name.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>a.date.localeCompare(b.date));
  const save=()=>{if(!edit.name.trim()||!edit.date){alert("Name and date are required");return;}setItems(edit.id?items.map(h=>h.id===edit.id?edit:h):[...items,{...edit,id:Date.now(),isActive:true}]);setEdit(null);showToast("Holiday saved — SLA deadlines recalculated");};
  return <div style={{maxWidth:1600}}>
    <SetupBack onBack={onBack} icon="🗓️" title="Public Holiday" sub={`${items.length} entries · ${items.filter(h=>h.isActive).length} active · counted in every SLA deadline — these dates are skipped, as are Fridays and Saturdays`}
      right={<div style={{display:"flex",gap:8}}><button onClick={()=>downloadSheet("Public_Holidays",[{k:"name",l:"Holiday Name"},{k:"date",l:"Date"}],items)} style={{...BTN2,border:`1px solid ${T.border}`,color:T.textSec}}>⬆ Export</button><button onClick={()=>downloadSheet("Public_Holiday_Import_Template",[{k:"name",l:"Holiday Name"},{k:"date",l:"Date"}],[])} style={{...BTN2,border:`1px solid ${T.border}`,color:T.textSec}}>⬇ Blank Template</button><button onClick={()=>setEdit({name:"",date:""})} style={{...BTN,background:T.primary,color:"#fff"}}>+ Add</button></div>}/>
    <input style={{...inp,marginBottom:10}} placeholder="Search public holiday" value={q} onChange={e=>setQ(e.target.value)}/>
    {edit&&<Card style={{padding:14,marginBottom:10,display:"flex",gap:8,alignItems:"center"}}><input style={{...inp,margin:0,flex:1}} placeholder="Holiday name" value={edit.name} onChange={e=>setEdit({...edit,name:e.target.value})}/><input type="date" style={{...inp,margin:0,width:180}} value={edit.date} onChange={e=>setEdit({...edit,date:e.target.value})}/><button onClick={save} style={{...BTN,background:T.primary,color:"#fff"}}>Save</button><button onClick={()=>setEdit(null)} style={{...BTN2,border:`1px solid ${T.border}`,color:T.textSec}}>Cancel</button></Card>}
    <Card style={{padding:0,overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.primaryLight}}>{["Holiday Name","Date","Active","Actions"].map(h=><th key={h} style={{...th,textAlign:h==="Actions"?"right":"left",fontSize:10,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
      <tbody>{rows.map(h=><tr key={h.id} style={{borderTop:`1px solid ${T.borderLight}`,opacity:h.isActive?1:0.55}}><td style={{...td,textAlign:"left"}}>{h.name}</td><td style={{...td,textAlign:"left"}}>{fmtDate(h.date)}</td>
        <td style={{...td,textAlign:"left"}}>{h.isActive?<Badge color={T.ok} bg="#ecfdf5">Active</Badge>:<Badge color={T.textMut}>Inactive</Badge>}</td>
        <td style={{...td,textAlign:"right",whiteSpace:"nowrap"}}><button onClick={()=>setEdit(h)} style={{...BTN2,padding:"4px 10px",border:`1px solid ${T.border}`,color:T.text,fontSize:11}}>✎ Edit</button> <button onClick={()=>setItems(items.map(x=>x.id===h.id?{...x,isActive:!x.isActive}:x))} style={{...BTN2,padding:"4px 10px",border:`1px solid ${h.isActive?T.warn:T.ok}`,color:h.isActive?T.warn:T.ok,fontSize:11}}>{h.isActive?"⊘ Deactivate":"↻ Reactivate"}</button></td></tr>)}</tbody></table></Card>
  </div>;
}
function SetupEditDesign({design,setDesign,approvalConfig=[],onBack,showToast}){
  const[tab,setTab]=useState("sim");const[sim,setSim]=useState(["clinical","cpt"]);const[newSc,setNewSc]=useState({key:"",name:"",confirm:"CSCM"});
  const sample={branch:"CEN",specialty:"Orthopedics",requestor:{name:"Requesting doctor"}};
  const scen=[...design.scenarios].sort((a,b)=>a.order-b.order);
  const upScen=(id,patch)=>setDesign({...design,scenarios:design.scenarios.map(s=>s.id===id?{...s,...patch}:s)});
  const upRole=(k,patch)=>setDesign({...design,roles:design.roles.map(r=>r.key===k?{...r,...patch}:r)});
  const rt=sim.length?buildEditRoute(sim.filter(id=>(design.scenarios.find(s=>s.id===id)||{}).active),sample,design,approvalConfig):null;
  const tabs=[["sim","Route simulator"],["scen","Edit scenarios"],["fields","Edit fields"],["steps","Scenario steps"],["roles","Roles & stages"]];
  const thS={...th,textAlign:"left",fontSize:10,textTransform:"uppercase"};const tdS={...td,textAlign:"left"};
  const rowsFor=[["2","CMO Approval"],["3","CMIO Validation"],["4","Nursing Templates"],["6","Chief Surgeon"],["9","Other Branch CMO"],["10","Financials (FCD)"],["12","CSCM System Setup"]];
  return <div style={{maxWidth:1600}}>
    <SetupBack onBack={onBack} title="Edit Design" sub={<span>How <strong>Edit Package</strong> routes a change. A new scenario, field or approver is a row here — never a code change. A change here <strong>applies to the next request raised</strong>; a request already raised keeps the route it was given.</span>}/>
    <div style={{display:"flex",gap:0,borderBottom:`2px solid ${T.border}`,marginBottom:16}}>{tabs.map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{padding:"9px 16px",border:"none",background:"none",fontSize:12.5,fontWeight:tab===k?700:500,color:tab===k?T.primary:T.textSec,borderBottom:tab===k?`3px solid ${T.primary}`:"3px solid transparent",marginBottom:-2,cursor:"pointer",fontFamily:T.font}}>{l}</button>)}</div>
    {tab==="sim"&&<Card style={{padding:18}}>
      <ST style={{fontSize:15,margin:"0 0 2px"}}>Route simulator</ST>
      <div style={{fontSize:11.5,color:T.textSec,marginBottom:12}}>Tick the scenarios a request touches — the route below is exactly what that request would be given, from the same rule the raise freezes. Change anything in the other tabs and come back.</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>{scen.filter(s=>s.active).map(s=>{const on=sim.includes(s.id);return <label key={s.id} style={{display:"inline-flex",alignItems:"center",gap:7,padding:"7px 12px",borderRadius:8,border:`1px solid ${on?T.primary:T.border}`,background:on?T.primaryLight:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}><input type="checkbox" checked={on} onChange={()=>setSim(on?sim.filter(x=>x!==s.id):[...sim,s.id])}/>{s.name}</label>;})}</div>
      {!rt&&<div style={{fontSize:12,color:T.textMut}}>Tick at least one scenario.</div>}
      {rt&&!rt.finance&&<React.Fragment><span style={{fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:10,background:"#ecfdf5",color:T.primary}}>{rt.total} steps + PrimeCare confirm ({rt.confirm})</span>
        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginTop:10}}>{rt.steps.map((s,i)=><React.Fragment key={i}><span style={{fontSize:12,padding:"4px 12px",borderRadius:14,border:`1px solid ${T.border}`}}>{s.short}</span><span style={{color:T.textMut}}>→</span></React.Fragment>)}<span style={{fontSize:12,padding:"4px 12px",borderRadius:14,border:`1px solid ${T.info}60`,background:"#eff6ff",color:T.info}}>PrimeCare confirm ({rt.confirm})</span></div></React.Fragment>}
      {rt&&rt.finance&&<React.Fragment><span style={{fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:10,background:"#fffbeb",color:"#b45309"}}>Finance re-run · {rt.total} stages</span>
        <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap",marginTop:10}}>{rt.stages.map((s,i)=><span key={i} style={{fontSize:11,padding:"3px 9px",borderRadius:12,border:`1px solid ${s.extra?T.purple:T.border}`,background:s.extra?"#faf5ff":"#fff",color:s.extra?T.purple:T.text}}><strong>{i+1}</strong> {s.label}</span>)}</div></React.Fragment>}
      <div style={{fontSize:11,color:T.textMut,marginTop:14}}>Each role appears once, in the master order · a single scenario routes exactly as today · any finance scenario re-runs the 15 stages and adds the roles outside the 15 as numbered stages (CFMO after 12 = stage 13; the rest move up one).</div>
    </Card>}
    {tab==="scen"&&<Card style={{padding:0,overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.primaryLight}}>{["Key","Scenario","Finance","PrimeCare confirm","Order","Steps","Active"].map(h=><th key={h} style={thS}>{h}</th>)}</tr></thead>
      <tbody>{scen.map(s=><tr key={s.id} style={{borderTop:`1px solid ${T.borderLight}`,opacity:s.active?1:0.55}}>
        <td style={{...tdS,fontFamily:"monospace",color:T.textSec}}>{s.id}</td>
        <td style={tdS}><input style={{...inp,margin:0}} value={s.name} onChange={e=>upScen(s.id,{name:e.target.value})}/></td>
        <td style={tdS}>{s.finance?<Badge color="#b45309" bg="#fffbeb">Finance — 15 stages</Badge>:"—"}</td>
        <td style={tdS}>{s.finance?<span style={{fontSize:11,color:T.textMut}}>as a financial edit</span>:<Select style={{...inp,margin:0,width:110}} value={s.confirm} onChange={e=>upScen(s.id,{confirm:e.target.value})}><option>CSCM</option><option>FCD</option></Select>}</td>
        <td style={tdS}><input type="number" style={{...inp,margin:0,width:70}} value={s.order} onChange={e=>upScen(s.id,{order:Number(e.target.value)})}/></td>
        <td style={{...tdS,color:T.textSec}}>{s.finance?"15 stages":(s.chain||[]).length}</td>
        <td style={tdS}><span onClick={()=>upScen(s.id,{active:!s.active})} style={{cursor:"pointer"}}><Badge color={s.active?T.ok:T.textMut} bg={s.active?"#ecfdf5":"#f1f5f9"}>{s.active?"On":"Off"}</Badge></span></td></tr>)}
        <tr style={{borderTop:`1px solid ${T.border}`,background:"#f8fafc"}}><td colSpan={7} style={{...tdS,padding:"10px 12px"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:11.5,color:T.textSec}}>Add a scenario:</span>
          <input style={{...inp,margin:0,width:150}} placeholder="key (e.g. theatre)" value={newSc.key} onChange={e=>setNewSc({...newSc,key:e.target.value.replace(/[^a-z0-9_]/gi,"").toLowerCase()})}/>
          <input style={{...inp,margin:0,flex:1}} placeholder="name shown to the requester" value={newSc.name} onChange={e=>setNewSc({...newSc,name:e.target.value})}/>
          <Select style={{...inp,margin:0,width:100}} value={newSc.confirm} onChange={e=>setNewSc({...newSc,confirm:e.target.value})}><option>CSCM</option><option>FCD</option></Select>
          <button onClick={()=>{if(!newSc.key||!newSc.name){alert("Key and name are required");return;}if(design.scenarios.some(s=>s.id===newSc.key)){alert("That key already exists");return;}SCEN_SHORT[newSc.key]=newSc.name.split(" ")[0];setDesign({...design,scenarios:[...design.scenarios,{id:newSc.key,name:newSc.name,confirm:newSc.confirm,chain:[],fields:[],order:Math.max(...design.scenarios.map(s=>s.order))+10,active:true}]});setNewSc({key:"",name:"",confirm:"CSCM"});showToast("Scenario added — give it steps and fields");}} style={{...BTN,background:T.primary,color:"#fff"}}>+ Add scenario</button></div></td></tr>
      </tbody></table>
      <div style={{padding:"8px 12px",fontSize:10.5,color:T.textMut,borderTop:`1px solid ${T.borderLight}`}}>A scenario key is stored on every request that uses it — it cannot be renamed, only switched off. Obsolete item codes is held: switch it on here when it is wanted.</div></Card>}
    {tab==="fields"&&<Card style={{padding:0,overflow:"hidden"}}><div style={{padding:"8px 12px",fontSize:11,color:T.textSec}}><strong>Add an existing column as an editable field:</strong> every field the edit screen can render is already a field — a field needing a new column needs that column in the list first.</div>
      <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.primaryLight}}>{["Field","Edited on tab","Scenario (exactly one)","Active"].map(h=><th key={h} style={thS}>{h}</th>)}</tr></thead>
      <tbody>{Object.keys(MFIELDS).map(k=>{const sid=design.fieldMap[k];const on=((design.scenarios.find(s=>s.id===sid)||{}).active);return <tr key={k} style={{borderTop:`1px solid ${T.borderLight}`}}>
        <td style={tdS}><div style={{fontWeight:600}}>{MFIELDS[k].l}</div><div style={{fontSize:10,color:T.textMut,fontFamily:"monospace"}}>{k}</div></td>
        <td style={{...tdS,color:T.textSec}}>{TAB_LBL[MFIELD_TAB[k]||"overview"]}</td>
        <td style={tdS}><Select style={{...inp,margin:0,maxWidth:420}} value={sid||""} onChange={e=>setDesign({...design,fieldMap:{...design.fieldMap,[k]:e.target.value}})}>{scen.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Select></td>
        <td style={tdS}><Badge color={on?T.ok:T.textMut} bg={on?"#ecfdf5":"#f1f5f9"}>{on?"On":"Off"}</Badge></td></tr>;})}</tbody></table></Card>}
    {tab==="steps"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>{scen.filter(s=>!s.finance).map(s=><Card key={s.id} style={{padding:14,opacity:s.active?1:0.6}}>
      <div style={{fontSize:13,fontWeight:700,color:T.primary}}>{s.name} {s.held&&<span style={{fontSize:9.5,color:T.textMut,background:"#f1f5f9",padding:"1px 6px",borderRadius:6}}>held</span>}</div><div style={{fontSize:10,color:T.textMut,fontFamily:"monospace",marginBottom:8}}>{s.id}</div>
      {(s.chain||[]).map((rk,i)=>{const r=design.roles.find(x=>x.key===rk)||{label:rk};return <div key={rk} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,padding:"4px 0"}}><input type="checkbox" checked onChange={()=>upScen(s.id,{chain:s.chain.filter(x=>x!==rk)})}/><span style={{color:T.textMut}}>{i+1}.</span><span style={{flex:1}}>{r.label}</span><span style={{fontSize:9,fontWeight:700,color:"#b45309"}}>ALSO V1</span></div>;})}
      <Select style={{...inp,margin:"8px 0 0"}} value="" onChange={e=>{if(e.target.value)upScen(s.id,{chain:[...(s.chain||[]),e.target.value]});}}><option value="">+ add an approver step…</option>{design.roles.filter(r=>!(s.chain||[]).includes(r.key)).map(r=><option key={r.key} value={r.key}>{r.label}</option>)}</Select>
      <div style={{fontSize:11,color:T.textSec,marginTop:8}}>→ then confirm on PrimeCare ({s.confirm})</div></Card>)}</div>}
    {tab==="roles"&&<Card style={{padding:0,overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.primaryLight}}>{["Role","Approver row","Branch","Combine order","In the 15?","Finance run: insert after"].map(h=><th key={h} style={thS}>{h}</th>)}</tr></thead>
      <tbody>{design.roles.map(r=>{const a=resolveEditRole(r.key,{branch:"CEN",specialty:"Orthopedics"},design,approvalConfig);const b=resolveEditRole(r.key,{branch:"NTH",specialty:"Orthopedics"},design,approvalConfig);return <tr key={r.key} style={{borderTop:`1px solid ${T.borderLight}`}}>
        <td style={tdS}><div style={{fontWeight:700}}>{r.label}</div><div style={{fontSize:10,color:T.textMut}}>CEN: {a.name} · NTH: {b.name}</div></td>
        <td style={tdS}><Select style={{...inp,margin:0,width:210}} value={String(r.row)} onChange={e=>upRole(r.key,{row:e.target.value==="cfmo"?"cfmo":Number(e.target.value)})}>{rowsFor.map(([n,l])=><option key={n} value={n}>{n} · {l}</option>)}<option value="cfmo">Own row — CFMO - Edit Chain</option></Select></td>
        <td style={{...tdS,color:T.textSec}}>{r.branch==="other"?"other branch":"own"}</td>
        <td style={tdS}><input type="number" style={{...inp,margin:0,width:70}} value={r.order} onChange={e=>upRole(r.key,{order:Number(e.target.value)})}/></td>
        <td style={tdS}>{r.in15?<Badge color={T.ok} bg="#ecfdf5">Yes — absorbed</Badge>:<Badge color={T.purple} bg="#faf5ff">No — extra step</Badge>}</td>
        <td style={tdS}>{r.in15?"—":<Select style={{...inp,margin:0,width:260}} value={r.after} onChange={e=>upRole(r.key,{after:Number(e.target.value)})}>{STAGES.filter(s=>s.num<15).map(s=><option key={s.num} value={s.num}>after {s.num} · {s.label} → becomes stage {s.num+1}</option>)}</Select>}</td></tr>;})}</tbody></table>
      <div style={{padding:"8px 12px",fontSize:10.5,color:T.textMut,borderTop:`1px solid ${T.borderLight}`}}>CFMO is someone in the 15 → point its approver row at that stage (it becomes "absorbed"). CFMO stays separate → change "insert after". A new approver → a new Approval Workflow row and a role row here.</div></Card>}
  </div>;
}
function EditChainRoles({design,setDesign}){
  const[br,setBr]=useState("CEN");
  return <Card style={{padding:18,marginTop:16}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><ST style={{fontSize:14,margin:0}}>Edit-chain roles ({br==="CEN"?"Central Hospital":"North Hospital"})</ST>
      <div style={{display:"flex",gap:6}}>{["CEN","NTH"].map(b=><button key={b} onClick={()=>setBr(b)} style={{padding:"4px 12px",borderRadius:14,border:`1px solid ${br===b?T.primary:T.border}`,background:br===b?T.primaryLight:"#fff",color:br===b?T.primary:T.textSec,fontSize:11,fontWeight:700,cursor:"pointer"}}>{b}</button>)}</div></div>
    <div style={{fontSize:11.5,color:T.textSec,marginBottom:10,maxWidth:900}}>Roles that approve amendments but are not one of the numbered stages above — the CFMO approves Op code changes, and in a finance re-run is added after stage 12. The next edit step for a role goes to the person named here; a step already open keeps its holder.</div>
    <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:T.primaryLight}}><th style={{...th,textAlign:"left"}}>Role</th><th style={{...th,textAlign:"left"}}>Approver — {br} (from AD) *</th></tr></thead>
      <tbody><tr><td style={{...td,textAlign:"left",fontWeight:600}}>CFMO - Edit Chain</td><td style={{...td,textAlign:"left"}}><div style={{maxWidth:340}}><PeoplePicker value={{name:((design.editChain||{}).cfmo||{})[br]||""}} onChange={u=>setDesign({...design,editChain:{...design.editChain,cfmo:{...((design.editChain||{}).cfmo||{}),[br]:u?u.name:""}}})} placeholder="Search AD users..."/></div></td></tr></tbody></table>
  </Card>;
}

function SetupPage({tplMasters=[],setTplMasters=()=>{},procs=[],consMaster=[],drugsMaster=[],chiefSurgeons={},setChiefSurgeons=()=>{},opSkills,setOpSkills,categories=[],setCategories=()=>{},specialties=[],setSpecialties=()=>{},cptCodes=[],setCptCodes=()=>{},approvalConfig=[],setApprovalConfig=()=>{},emailConfig=[],setEmailConfig=()=>{},showToast=()=>{},openCounts={},onRefreshOpen=()=>{},slaConfig=SLA_CONFIG_DEFAULT,setSlaConfig=()=>{},auditLog=[],logAudit=()=>{},existingIds=[],onMigrate=()=>{},editDesign=EDIT_DESIGN_DEFAULT,setEditDesign=()=>{},onOpenMigration=()=>{},routeSection=null,onSection=()=>{}}){
  const[section,setSectionRaw]=useState(routeSection||null);
  const setSection=v=>{setSectionRaw(v);onSection(v);};
  useEffect(()=>{if((routeSection||null)!==section)setSectionRaw(routeSection||null);},[routeSection]);
  const[holidays,setHolidays]=useState(HOLIDAYS_DEFAULT);
  const back=()=>setSection(null);
  const activeCount=opSkills.filter(o=>o.isActive!==false).length;
  const catParents=categories.filter(c=>c.parentId===null).length;
  const catSubs=categories.filter(c=>c.parentId!==null).length;
  if(section==="opSkills") return <SetupSkillList opSkills={opSkills} setOpSkills={setOpSkills} audit={auditLog.filter(a=>a.entity==="Operation Skill")} logAudit={logAudit} onBack={back}/>;
  if(section==="specialties") return <SetupSkillList opSkills={specialties} setOpSkills={setSpecialties} audit={auditLog.filter(a=>a.entity==="CPT Specialty")} logAudit={logAudit} onBack={back} title="CPT Specialty" icon="microscope" usedIn="used in the Doctor Request section" placeholder="e.g. Vascular Surgery"/>;
  if(section==="cptCodes") return <SetupCptList items={cptCodes} setItems={setCptCodes} audit={auditLog.filter(a=>a.entity==="CPT Codes")} logAudit={logAudit} showToast={showToast} onBack={back}/>;
  if(section==="categories") return <SetupCategories categories={categories} setCategories={setCategories} showToast={showToast} onBack={back}/>;
  if(section==="items") return <SetupItemsMaster onBack={back} showToast={showToast}/>;
  if(section==="holidays") return <SetupHolidays items={holidays} setItems={setHolidays} onBack={back} showToast={showToast}/>;
  if(section==="approvals") return <div><SetupApprovals chiefSurgeons={chiefSurgeons} setChiefSurgeons={setChiefSurgeons} config={approvalConfig} setConfig={setApprovalConfig} audit={auditLog.filter(a=>a.entity==="Approval Workflow")} logAudit={logAudit} showToast={showToast} onBack={back} openCounts={openCounts} onRefreshOpen={onRefreshOpen}/><div style={{maxWidth:1600}}><EditChainRoles design={editDesign} setDesign={setEditDesign}/></div></div>;
  if(section==="emails") return <SetupEmails config={emailConfig} setConfig={setEmailConfig} showToast={showToast} onBack={back}/>;
  if(section==="editDesign") return <SetupEditDesign design={editDesign} setDesign={setEditDesign} approvalConfig={approvalConfig} onBack={back} showToast={showToast}/>;
  if(section==="tplCons") return <SetupTplMasters type={1} title="Consumable Templates" masters={tplMasters} setMasters={setTplMasters} procs={procs} itemMaster={consMaster} showToast={showToast} onBack={back}/>;
  if(section==="tplDrugs") return <SetupTplMasters type={2} title="Drugs Templates" masters={tplMasters} setMasters={setTplMasters} procs={procs} itemMaster={drugsMaster} showToast={showToast} onBack={back}/>;
  if(section==="sla") return <SetupSLA config={slaConfig} setConfig={setSlaConfig} showToast={showToast} onBack={back}/>;
  const groupHdr={fontSize:11,fontWeight:700,color:T.textSec,textTransform:"uppercase",letterSpacing:0.5,margin:"18px 0 10px",paddingBottom:6,borderBottom:`2px solid ${T.primary}30`};
  const card=(key,icon,title,lines,fn)=><Card key={key} style={{padding:18,cursor:"pointer",border:`1px solid ${T.border}`}} onClick={fn||(()=>setSection(key))}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>{!/^[a-z]/i.test(icon)?<span style={{fontSize:20}}>{icon}</span>:<Ic n={icon} s={18}/>}<div style={{fontSize:14,fontWeight:600,color:T.text}}>{title}</div></div>
    {lines.map((l,i)=><div key={i} style={{fontSize:11,color:T.textSec}}>{l}</div>)}
    <div style={{marginTop:10,fontSize:11,color:T.primary,fontWeight:600}}>Manage →</div></Card>;
  const grid=ch=><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>{ch}</div>;
  const liveScen=editDesign.scenarios.filter(s=>s.active).length;
  return <div style={{maxWidth:1600}}>
    <div style={{marginBottom:16}}>
      <h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:0}}>Setup &amp; Master Data</h1>
      <p style={{fontSize:12,color:T.textSec,margin:"4px 0 0"}}>Manage system reference lists used across the CPT workflow.</p>
    </div>
    <div style={{padding:14,borderRadius:8,background:"#fef9c3",border:`1px solid #fde047`,display:"flex",alignItems:"flex-start",gap:10}}>
      <Ic n="lock" s={16}/>
      <div style={{flex:1}}>
        <div style={{fontSize:12,fontWeight:600,color:"#854d0e"}}>Restricted Area</div>
        <div style={{fontSize:11,color:"#a16207",marginTop:2,lineHeight:1.5}}>Master data changes affect the entire system. Inactive options are hidden from new requests but preserved in existing procedures.</div>
      </div>
    </div>
    <div style={groupHdr}>📚 Reference Data</div>
    {grid([
      card("categories","folder","Categories",["Two-level hierarchy · read-only mirror of IEMS",`${catParents} parents · ${catSubs} sub-categories`]),
      card("items","layers","Items Master (SIC)",[`${(consMaster.length+drugsMaster.length).toLocaleString()} items`,"Read-only mirror of IEMS · browse or search"]),
      card("opSkills","🛠️","Operation Skill",[`${opSkills.length} entries · ${activeCount} active`,"Used in the Doctor Request section"]),
      card("specialties","microscope","CPT Specialty",[`${specialties.length} entries · ${specialties.filter(s=>s.isActive!==false).length} active`,"Used in the Doctor Request section"]),
      card("cptCodes","fileText","CPT Codes",[`${cptCodes.length} entries`,"Code + Description"]),
      card("holidays","🗓️","Public Holidays",[`${holidays.filter(h=>h.isActive).length} entries`,"Counted in every SLA deadline — Fri/Sat and these dates are skipped"]),
    ])}
    <div style={groupHdr}>🧭 Workflow &amp; Notifications</div>
    {grid([
      card("approvals","🧭","Approval Workflow",["One approver per step, per branch","Choose approvers from Active Directory"]),
      card("sla","⏱️","SLA & Reminders",["Days per step + reminder lead time","Calendar or working days"]),
      card("emails","✉️","Email Notifications",["To / CC / content per event","Per-event on-off switch"]),
      card("editDesign","✏️","Edit Design",[`${liveScen} scenarios · fields, scenario steps, roles & stages`,"Route simulator"]),
    ])}
    <div style={groupHdr}>📋 Template Masters</div>
    {grid([
      card("tplCons","clipboard","Consumable Templates",["Master templates from PrimeCare","P_REPORT import"]),
      card("tplDrugs","pill","Drugs Templates",["Master templates from PrimeCare","P_REPORT import"]),
    ])}
    <div style={groupHdr}>🗂 Records &amp; Data</div>
    {grid([card("migration","download","Data Migration",["Bulk-load approved packages from Excel","Staged, reviewed, then committed"],onOpenMigration)])}
  </div>;
}

// Operation Skill list — mirrors the Item Evaluation Setup list style (no sort order)
function SetupSkillList({opSkills,setOpSkills,onBack,title="Operation Skill",icon="wrench",usedIn="used in the Doctor Request section",placeholder="e.g. Robotic",audit=[],logAudit=()=>{}}){
  const[tab,setTab]=useState("records");
  const[io,setIo]=useState(false);
  const ioEntity={
    name:title,
    cols:[{k:"title",l:"Name",req:true}],
    validate:(r)=>{const e=[];const t=String(r.title||"").trim();
      if(!t)e.push("Name required");
      if(opSkills.some(o=>o.title.toLowerCase()===t.toLowerCase()))e.push("Already in master — kept, not overwritten");
      return e;},
    onCommit:rows=>{
      const base=Math.max(0,...opSkills.map(o=>o.id||0));
      const add=rows.map((r,i)=>({id:base+i+1,title:String(r.title).trim(),isActive:true}));
      setOpSkills([...opSkills,...add]);
      add.forEach(a=>logAudit(title,a.title,"Created","—","—",a.title,"Imported from CSV"));},
  };
  const[search,setSearch]=useState("");
  const[editing,setEditing]=useState(null);
  const[draft,setDraft]=useState({title:""});
  const thCell={padding:"10px 14px",fontSize:11,fontWeight:600,color:T.textSec,textAlign:"left",borderBottom:`1px solid ${T.border}`};
  const actBtn={padding:"4px 10px",marginLeft:6,borderRadius:5,border:`1px solid ${T.border}`,background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",color:T.text,fontFamily:T.font};
  const rows=opSkills.filter(o=>!search||o.title.toLowerCase().includes(search.toLowerCase()));
  const openAdd=()=>{setDraft({title:""});setEditing({mode:"add"});};
  const openEdit=it=>{setDraft({title:it.title});setEditing({mode:"edit",item:it});};
  const save=()=>{const t=draft.title.trim();if(!t){alert("Name is required");return;}if(opSkills.some(o=>o.title.toLowerCase()===t.toLowerCase()&&(!editing.item||o.id!==editing.item.id))){alert("That option already exists");return;}
    if(editing.mode==="add"){const id=Math.max(0,...opSkills.map(o=>o.id||0))+1;setOpSkills([...opSkills,{id,title:t,isActive:true}]);logAudit(title,t,"Created","—","—",t);}
    else {logAudit(title,editing.item.title,"Updated","Name",editing.item.title,t);setOpSkills(opSkills.map(o=>o.id===editing.item.id?{...o,title:t}:o));}
    setEditing(null);};
  const toggle=it=>{const on=it.isActive===false;logAudit(title,it.title,on?"Reactivated":"Deactivated","Active",on?"No":"Yes",on?"Yes":"No");setOpSkills(opSkills.map(o=>o.id===it.id?{...o,isActive:o.isActive===false}:o));};
  const del=it=>{if(window.confirm(`Delete "${it.title}"? It will be removed from the ${title} dropdown.`)){logAudit(title,it.title,"Deleted","—",it.title,"—");setOpSkills(opSkills.filter(o=>o.id!==it.id));}};
  const activeCount=opSkills.filter(o=>o.isActive!==false).length;
  return <div style={{maxWidth:1600}}>
    {io&&<MasterIO entity={ioEntity} onClose={()=>setIo(false)}/>}
    <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:12}}>← Back to Setup</button>
    <SetupTabs tab={tab} setTab={setTab} historyCount={audit.length}/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <div>
        <h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:0,display:"flex",alignItems:"center",gap:9}}>{IC_PATHS[icon]?<Ic n={icon} s={18}/>:icon} {title}</h1>
        <p style={{fontSize:12,color:T.textSec,margin:"4px 0 0"}}>{opSkills.length} entries · {activeCount} active · {usedIn}</p>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>downloadSheet(`${title.replace(/\s+/g,"_")}.xlsx`,[{k:"title",l:"Name"},{k:"isActive",l:"Active"}],opSkills)} style={{padding:"8px 14px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",color:T.textSec,fontSize:12,fontWeight:600,cursor:"pointer"}}>⬆ Export</button>
        <button onClick={()=>setIo(true)} style={{padding:"8px 14px",borderRadius:6,border:`1px solid ${T.primary}`,background:"#fff",color:T.primary,fontSize:12,fontWeight:600,cursor:"pointer"}}>Import</button>
        <button onClick={openAdd} style={{padding:"8px 16px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Add</button>
      </div>
    </div>
    <input style={{...inp,marginBottom:12}} placeholder={`Search ${title.toLowerCase()}...`} value={search} onChange={e=>setSearch(e.target.value)}/>
    <Card style={{padding:0,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:T.primaryLight}}>
          <th style={thCell}>Name</th>
          <th style={{...thCell,width:110,textAlign:"center"}}>Active</th>
          <th style={{...thCell,width:160,textAlign:"right"}}>Actions</th>
        </tr></thead>
        <tbody>
          {rows.length===0&&<tr><td colSpan={3} style={{padding:26,textAlign:"center",color:T.textMut,fontSize:12}}>No entries match your search</td></tr>}
          {rows.map(o=><tr key={o.id} style={{borderTop:`1px solid ${T.borderLight}`,opacity:o.isActive!==false?1:0.55}}>
            <td style={{padding:"10px 14px",fontSize:12,color:T.text,fontWeight:500}}>{o.title}</td>
            <td style={{padding:"10px 14px",textAlign:"center"}}><span onClick={()=>toggle(o)} title="Click to toggle" style={{cursor:"pointer",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:12,background:o.isActive!==false?"#dcfce7":"#f3f4f6",color:o.isActive!==false?T.ok:T.textMut}}>{o.isActive!==false?"Active":"Inactive"}</span></td>
            <td style={{padding:"10px 14px",textAlign:"right",whiteSpace:"nowrap"}}>
              <button onClick={()=>openEdit(o)} style={actBtn}>✎ Edit</button>
              <button onClick={()=>del(o)} style={{...actBtn,color:T.err,borderColor:T.err+"40"}}>🗑 Delete</button>
            </td>
          </tr>)}
        </tbody>
      </table>
    </Card>
    {editing&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={()=>setEditing(null)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:10,padding:22,width:380,boxShadow:"0 10px 40px rgba(0,0,0,0.2)"}}>
        <ST style={{fontSize:15,color:T.primary,marginBottom:14}}>{editing.mode==="edit"?"Edit":"Add"} {title}</ST>
        <label style={lbl}>Name <span style={{color:T.err}}>*</span></label>
        <input style={{...inp,marginBottom:18}} value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} placeholder={placeholder} autoFocus/>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
          <button onClick={()=>setEditing(null)} style={{padding:"8px 16px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
          <button onClick={save} style={{padding:"8px 18px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>{editing.mode==="edit"?"Save":"Add"}</button>
        </div>
      </div>
    </div>}
  </div>;
}

// Categories — two-level hierarchy management (Item Evaluation style)
function SetupCategories({categories,setCategories,showToast,onBack}){
  const[editing,setEditing]=useState(null);
  const[search,setSearch]=useState("");
  const[expandedIds,setExpandedIds]=useState(new Set());
  const matchedIds=new Set();
  if(search){categories.forEach(c=>{if(c.title.toLowerCase().includes(search.toLowerCase())||(c.code||"").toLowerCase().includes(search.toLowerCase())){matchedIds.add(c.id);if(c.parentId)matchedIds.add(c.parentId);}});}
  const effectiveExpanded=search?matchedIds:expandedIds;
  const toggle=id=>{const s=new Set(expandedIds);s.has(id)?s.delete(id):s.add(id);setExpandedIds(s);};
  const expandAll=()=>setExpandedIds(new Set(categories.filter(c=>c.parentId===null).map(c=>c.id)));
  const collapseAll=()=>setExpandedIds(new Set());
  const parents=categories.filter(c=>c.parentId===null&&(!search||matchedIds.has(c.id))).sort((a,b)=>a.sortOrder-b.sortOrder);
  const childrenOf=pid=>categories.filter(c=>c.parentId===pid&&(!search||matchedIds.has(c.id))).sort((a,b)=>a.sortOrder-b.sortOrder);
  const onSave=data=>{
    if(editing.mode==="edit"){setCategories(categories.map(c=>c.id===editing.item.id?{...c,...data}:c));showToast&&showToast(`Updated category "${data.title}"`);}
    else{const newId=Math.max(0,...categories.map(c=>c.id))+1;const parentId=editing.mode==="add-child"?editing.parentId:null;const sortOrder=Math.max(0,...categories.filter(c=>c.parentId===parentId).map(c=>c.sortOrder))+1;setCategories([...categories,{id:newId,parentId,...data,isActive:true,sortOrder}]);showToast&&showToast(`Added ${editing.mode==="add-parent"?"parent":"sub-"}category "${data.title}"`);}
    setEditing(null);};
  const onToggleActive=item=>{
    if(item.isActive){const childrenCount=categories.filter(c=>c.parentId===item.id).length;let msg=`Deactivate "${item.title}"?`;if(childrenCount>0)msg+=`\n\n${childrenCount} sub-categor${childrenCount===1?"y":"ies"} will also be hidden.`;if(!window.confirm(msg))return;}
    setCategories(categories.map(c=>c.id===item.id?{...c,isActive:!c.isActive}:c));showToast&&showToast(`${item.isActive?"Deactivated":"Reactivated"} "${item.title}"`);};
  return <div style={{maxWidth:1600}}>
    <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:12}}>← Back to Setup</button>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <div><h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:0}}>Categories</h1>
      <p style={{fontSize:12,color:T.textSec,margin:"4px 0 0"}}>Two-level hierarchy used to classify and enter template items.</p></div>
      <button onClick={()=>setEditing({mode:"add-parent"})} style={{padding:"8px 16px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Add Parent</button>
    </div>
    <div style={{padding:10,borderRadius:6,background:T.primaryLight,border:`1px solid ${T.primary}40`,marginBottom:14,fontSize:11,color:T.text}}>
      <strong>{categories.filter(c=>c.parentId===null).length}</strong> parent categories · <strong>{categories.filter(c=>c.parentId!==null).length}</strong> sub-categories · <strong>{categories.filter(c=>c.isActive).length}</strong> active
    </div>
    <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
      <input style={{...inp,flex:1}} placeholder="Search by name or code... (matches auto-expand)" value={search} onChange={e=>setSearch(e.target.value)}/>
      <button onClick={expandAll} style={{padding:"7px 12px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:11,cursor:"pointer"}}>Expand All</button>
      <button onClick={collapseAll} style={{padding:"7px 12px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:11,cursor:"pointer"}}>Collapse All</button>
    </div>
    {parents.length===0&&<div style={{padding:30,textAlign:"center",color:T.textMut,fontSize:13,background:"#fff",borderRadius:8,border:`1px solid ${T.border}`}}>{search?`No categories match "${search}"`:"No categories yet"}</div>}
    {parents.map(p=>{const kids=childrenOf(p.id);const exp=effectiveExpanded.has(p.id);const itemsInParent=itemsInCategory(p,categories);
      return <Card key={p.id} style={{marginBottom:10,padding:0,overflow:"hidden",opacity:p.isActive?1:0.5}}>
        <div style={{padding:"12px 16px",background:p.isActive?"#fefce8":"#f3f4f6",borderBottom:exp?`1px solid ${T.border}`:"none",display:"flex",alignItems:"center",gap:10}}>
          <span onClick={()=>toggle(p.id)} style={{cursor:"pointer",fontSize:12,color:T.textSec}}>{exp?"▼":"▶"}</span>
          <Ic n="folder" s={16}/>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:600,color:T.text}}>{p.title} {!p.isActive&&<span style={{fontSize:10,marginLeft:6,color:T.err,fontWeight:700}}>(Inactive)</span>}</div>
            <div style={{fontSize:10,color:T.textMut}}>Code: {p.code} · {kids.length} sub-categor{kids.length===1?"y":"ies"} · <strong style={{color:T.primary}}>{itemsInParent}</strong> item{itemsInParent===1?"":"s"} linked</div>
          </div>
          <button onClick={()=>setEditing({mode:"edit",item:p})} style={{padding:"5px 10px",fontSize:10,borderRadius:4,border:`1px solid ${T.border}`,background:"#fff",cursor:"pointer"}}>Edit</button>
          <button onClick={()=>onToggleActive(p)} style={{padding:"5px 10px",fontSize:10,borderRadius:4,border:`1px solid ${p.isActive?T.warn:T.ok}`,background:"#fff",color:p.isActive?T.warn:T.ok,cursor:"pointer"}}>{p.isActive?"Deactivate":"Reactivate"}</button>
        </div>
        {exp&&<div style={{padding:"8px 16px 12px"}}>
          {kids.length===0&&<div style={{padding:12,textAlign:"center",fontSize:11,color:T.textMut,fontStyle:"italic"}}>No sub-categories yet.</div>}
          {kids.map(k=>{const itemCount=itemsInCategory(k,categories);
            return <div key={k.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderBottom:`1px solid ${T.borderLight}`,opacity:k.isActive?1:0.5}}>
              <span style={{color:T.textMut,fontSize:11}}>↳</span><Ic n="fileText" s={13}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:500,color:T.text}}>{k.title} {!k.isActive&&<span style={{fontSize:9,marginLeft:6,color:T.err,fontWeight:700}}>(Inactive)</span>}</div>
                <div style={{fontSize:10,color:T.textMut}}>Code: {k.code} · <strong style={{color:T.primary}}>{itemCount}</strong> item{itemCount===1?"":"s"} linked</div>
              </div>
              <button onClick={()=>setEditing({mode:"edit",item:k})} style={{padding:"4px 8px",fontSize:10,borderRadius:4,border:`1px solid ${T.border}`,background:"#fff",cursor:"pointer"}}>Edit</button>
              <button onClick={()=>onToggleActive(k)} style={{padding:"4px 8px",fontSize:10,borderRadius:4,border:`1px solid ${k.isActive?T.warn:T.ok}`,background:"#fff",color:k.isActive?T.warn:T.ok,cursor:"pointer"}}>{k.isActive?"Deactivate":"Reactivate"}</button>
            </div>;})}
          <div style={{paddingTop:10}}>
            <button onClick={()=>setEditing({mode:"add-child",parentId:p.id})} style={{padding:"6px 12px",fontSize:11,borderRadius:4,border:`1px dashed ${T.primary}`,background:"#fff",color:T.primary,cursor:"pointer"}}>+ Add sub-category to {p.title}</button>
          </div>
        </div>}
      </Card>;})}
    {editing&&<SetupCategoryModal mode={editing.mode} item={editing.item} onSave={onSave} onClose={()=>setEditing(null)}/>}
  </div>;
}

function SetupCategoryModal({mode,item,onSave,onClose}){
  const[title,setTitle]=useState(item?.title||"");
  const[code,setCode]=useState(item?.code||"");
  const titleLabel=mode==="add-parent"?"Add Parent Category":mode==="add-child"?"Add Sub-Category":"Edit Category";
  const submit=()=>{if(!title.trim()){alert("Name is required");return;}if(!code.trim()){alert("Code is required");return;}onSave({title:title.trim(),code:code.trim()});};
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:10,padding:22,width:400,boxShadow:"0 10px 40px rgba(0,0,0,0.2)"}}>
      <ST style={{fontSize:15,color:T.primary,marginBottom:14}}>{titleLabel}</ST>
      <label style={lbl}>Name <span style={{color:T.err}}>*</span></label>
      <input style={{...inp,marginBottom:12}} value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Instruments" autoFocus/>
      <label style={lbl}>Code <span style={{color:T.err}}>*</span></label>
      <input style={{...inp,marginBottom:18}} value={code} onChange={e=>setCode(e.target.value)} placeholder="e.g. CON-INS"/>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
        <button onClick={onClose} style={{padding:"8px 16px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
        <button onClick={submit} style={{padding:"8px 18px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>{mode==="edit"?"Save":"Add"}</button>
      </div>
    </div>
  </div>;
}

// Raise a value-less (non-financial) edit — only fields with no cost/template impact
function VlRaiseModal({base,opSkills,onClose,onSubmit}){
  const[group,setGroup]=useState(null);
  const[vals,setVals]=useState({});
  const[pairs,setPairs]=useState([{old:"",new:""}]);
  const[reason,setReason]=useState("");
  const pick=g=>{const init={};(g.fields||[]).forEach(k=>{init[k]=MFIELDS[k].get(base)||"";});setVals(init);setPairs([{old:"",new:""}]);setGroup(g);};
  const changed=group&&!group.special?(group.fields||[]).filter(k=>String(vals[k]||"")!==String(MFIELDS[k].get(base)||"")):[];
  const submit=()=>{
    if(!reason.trim()){alert("Reason is required");return;}
    if(group.special==="obsolete"){const p=pairs.filter(x=>x.old.trim()&&x.new.trim());if(!p.length){alert("Enter at least one old → new code pair");return;}onSubmit(group,{pairs:p},reason);return;}
    if(!changed.length){alert("Change at least one field");return;}
    onSubmit(group,{changes:changed.map(k=>({k,l:MFIELDS[k].l,from:MFIELDS[k].get(base)||"—",to:vals[k]||"—"}))},reason);
  };
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9996,padding:20}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:10,padding:22,width:660,maxWidth:"100%",maxHeight:"92vh",overflow:"auto",boxShadow:"0 10px 40px rgba(0,0,0,0.2)"}}>
      <ST style={{fontSize:16,color:T.primary,marginBottom:4}}>✎ Non-Financial Edit — #{base.id}</ST>
      <p style={{fontSize:11,color:T.textSec,margin:"0 0 12px"}}>{base.accurateCptName||base.proposedCptName} · PKGID {base.systemSetup?.pkgId||"—"}</p>
      {!group?<>
        <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:8}}>What are you changing?</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {EDIT_MATRIX.map(g=><div key={g.id} onClick={()=>pick(g)} style={{cursor:"pointer",border:`1px solid ${T.border}`,borderRadius:8,padding:"12px 14px",background:"#fff"}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.primary} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text}}>{g.name}</div>
              <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:T.primaryLight,color:T.primary}}>Raised by {g.raise}</span>
            </div>
            <div style={{fontSize:10,color:T.textMut,marginTop:3}}>Route: {g.chain.join(" → ")} → confirm on PrimeCare ({g.confirm}){g.chain.includes("cfmo")?" · contains CFMO (role pending confirmation)":""}</div>
          </div>)}
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:14}}><button onClick={onClose} style={{padding:"9px 18px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button></div>
      </>:<>
        <button onClick={()=>setGroup(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:T.textSec,marginBottom:8}}>← Change type</button>
        <div style={{padding:9,marginBottom:12,borderRadius:6,background:"#eff6ff",border:`1px solid ${T.info}30`,fontSize:11,color:T.info}}><strong>{group.name}</strong> · route: {group.chain.join(" → ")} → PrimeCare confirm ({group.confirm}).</div>
        {group.special==="obsolete"?<>
          <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:6}}>Obsolete → replacement item codes</div>
          {pairs.map((pr,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
            <input style={{...inp,flex:1}} placeholder="Obsolete code" value={pr.old} onChange={e=>setPairs(pairs.map((x,j)=>j===i?{...x,old:e.target.value}:x))}/>
            <span style={{color:T.textMut}}>→</span>
            <input style={{...inp,flex:1}} placeholder="New code" value={pr.new} onChange={e=>setPairs(pairs.map((x,j)=>j===i?{...x,new:e.target.value}:x))}/>
            {pairs.length>1&&<span onClick={()=>setPairs(pairs.filter((_,j)=>j!==i))} style={{cursor:"pointer",color:T.err,fontWeight:700}}>✕</span>}
          </div>)}
          <button onClick={()=>setPairs([...pairs,{old:"",new:""}])} style={{background:"none",border:`1px dashed ${T.border}`,borderRadius:6,padding:"5px 12px",fontSize:11,color:T.textSec,cursor:"pointer"}}>+ Add pair</button>
          <div style={{fontSize:10,color:T.textMut,marginTop:8}}>Every package using an obsolete code is affected. The certificate will list the template numbers with old and new codes.</div>
        </>:<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          {group.fields.map(k=>{const f=MFIELDS[k];const cur=f.get(base)||"";const chg=String(vals[k]||"")!==String(cur);
            return <div key={k}>
              <label style={lbl}>{f.l}{chg&&<span style={{fontSize:9,color:T.warn,fontWeight:700,marginLeft:6}}>CHANGED</span>}</label>
              {f.text
                ? <input style={{...inp,borderColor:chg?T.warn:T.border}} value={vals[k]||""} onChange={e=>setVals({...vals,[k]:e.target.value})}/>
                : <Select style={{...inp,borderColor:chg?T.warn:T.border}} value={vals[k]||""} onChange={e=>setVals({...vals,[k]:e.target.value})}>
                    <option value="">— not set —</option>
                    {(f.opts||(f.skill?(opSkills||[]).filter(o=>o.isActive!==false).map(o=>o.title):[])).map(o=><option key={o} value={o}>{o}</option>)}
                  </Select>}
              <div style={{fontSize:9,color:T.textMut,marginTop:2}}>Current: {cur||"—"}</div>
            </div>;})}
        </div>}
        <label style={lbl}>Reason for change <span style={{color:T.err}}>*</span></label>
        <textarea style={{...inp,height:60,resize:"vertical",fontFamily:T.font,marginBottom:14}} value={reason} onChange={e=>setReason(e.target.value)} placeholder="e.g. Ministry circular reclassified this procedure"/>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
          <button onClick={onClose} style={{padding:"9px 18px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
          <button onClick={submit} style={{padding:"9px 20px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Submit for Approval</button>
        </div>
      </>}
    </div>
  </div>;
}

// Value-less edit request detail — same layout language as the procedure detail
// Edit request page — NF (non-financial) and FIN (finance re-run). Live parity:
// your-turn / CPT-Admin banners, route list, return-to-raiser, reassign, act-as-admin, withdraw, history.
function editTrackerOf(r){
  if(r.kind==="fin"){const cur=r.done&&r.status==="completed"?r.stages.length:r.status==="returned"?0:r.stage;return {stages:r.stages.map((s,i)=>({num:i+1,label:s.label,sla:s.sla})),cur};}
  const ch=r.chain||[];
  const stages=[{num:1,label:`Raised by ${r.raisedBy}`},...ch.map((s,i)=>({num:i+2,label:s.short||s.label,sla:["CMIO","Other-branch CMIO","PrimeCare"].some(k=>(s.short||"").startsWith(k))?"3 Days":s.role==="cmo"?"1 Day":"2 Days"})),{num:ch.length+2,label:`PrimeCare confirm (${r.confirmRole})`,sla:"3 Days"}];
  const cur=r.status==="returned"?0:r.done?(r.status==="completed"?stages.length:Math.min(r.stage+1,stages.length-1)):r.phase==="confirm"?ch.length+1:r.stage+1;
  return {stages,cur};
}
function VlDetail({req:r,me,onBack,onAct,procs=[],onOpenProc=()=>{},onReassign=()=>{}}){
  const[comment,setComment]=useState("");const[adminOpen,setAdminOpen]=useState(false);
  const[raOpen,setRaOpen]=useState(false);const[raUser,setRaUser]=useState(null);const[raWhy,setRaWhy]=useState("");
  if(!r||!r.id)return <div style={{maxWidth:1600}}><button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec}}>← Back</button><Card style={{padding:30,textAlign:"center",color:T.textMut}}>Request not found.</Card></div>;
  const fin=r.kind==="fin";const chain=r.chain||[];
  const {stages,cur}=editTrackerOf(r);
  const s=editStatusOf(r);const mine=editTurn(r,me);const raiser=r.raisedBy===me.name;
  const curStep=fin?(r.stages[r.stage]||{}):r.phase==="confirm"?{label:`PrimeCare confirm (${r.confirmRole})`,name:r.confirmRole==="FCD"?"CFO":"CSCM"}:(chain[r.stage]||{});
  const curLbl=curStep.full||curStep.label;
  const adminCan=!r.done&&r.status!=="returned"&&!mine&&me.isSiteAdmin;
  const decide=(a)=>{if((a==="reject"||a==="return")&&!comment.trim()){alert(a==="reject"?"Comment required to reject":"Comment required to request modification");return;}onAct(r,a,comment);setComment("");setAdminOpen(false);};
  const decisionPanel=(title,admin)=><Card style={{marginBottom:16,padding:18,border:`1px solid ${T.border}`,borderLeft:`3px solid ${T.warn}`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><ST style={{fontSize:13,color:T.text,margin:0}}>{title}</ST><span style={{fontSize:10,color:T.textMut}}>Acting as {me.name}</span></div>
    <textarea style={{...inp,height:48,resize:"vertical",fontFamily:T.font,marginBottom:8}} placeholder="Comment (required to request modification or reject)..." value={comment} onChange={e=>setComment(e.target.value)}/>
    {curStep.coveredFor&&<div style={{fontSize:11,color:T.purple,marginBottom:8}}>↱ Covering for {curStep.coveredFor} — either of you may decide it.</div>}
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      <button onClick={()=>decide("approve")} style={{padding:"9px 20px",borderRadius:8,border:"none",background:T.ok,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>✓ {r.phase==="confirm"?"Confirm on PrimeCare & apply":fin&&r.stage===r.stages.length-1?"Acknowledge & apply":"Approve"} →</button>
      <button onClick={()=>decide("reject")} style={{padding:"9px 18px",borderRadius:8,border:`1px solid ${T.err}`,background:"#fff",color:T.err,fontSize:12,fontWeight:600,cursor:"pointer"}}>✕ Reject</button>
      {r.phase!=="confirm"&&<button onClick={()=>decide("return")} style={{padding:"9px 18px",borderRadius:8,border:`1px solid ${T.warn}60`,background:"#fff",color:T.warn,fontSize:12,fontWeight:600,cursor:"pointer"}}>Request modification</button>}
    </div>
    {admin&&<div style={{fontSize:10.5,color:T.textMut,marginTop:8}}>The decision is recorded in your name, not theirs.</div>}
  </Card>;
  const stepRow=(n,label,name,state,extra)=><div style={{display:"flex",alignItems:"center",gap:10,fontSize:12,padding:"7px 10px",borderRadius:6,background:state==="done"?"#f0fdf4":state==="cur"?"#fffbeb":"#f8fafc"}}>
    <span style={{width:22,height:22,borderRadius:"50%",background:state==="done"?T.ok:"#e2e8f0",color:state==="done"?"#fff":T.textMut,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{state==="done"?"✓":n}</span>
    <span style={{fontWeight:700,color:T.text}}>{label}</span><span style={{color:T.textSec}}>— {name||"—"}</span>{extra}</div>;
  return <div style={{maxWidth:1600}}>
    <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:8}}>← Back</button>
    <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
      <h1 style={{fontSize:21,fontWeight:700,color:T.text,margin:0}}>{fin?"Financial Edit":"Non-Financial Edit"} · {r.id}</h1>
      <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:10,color:s.c,background:s.c+"18"}}>{s.l}</span>
    </div>
    <p style={{fontSize:12.5,color:T.textSec,margin:"4px 0 12px"}}>Base <a onClick={()=>onOpenProc(r.baseId)} style={{color:T.primary,fontWeight:700,cursor:"pointer"}}>{r.baseId}</a> · {r.cpt} · <strong>{editReqLabel(r)}</strong>{fin&&<span> · V{r.fromVer} → V{r.toVer}</span>} · raised by {r.raisedBy} on {fmtDate(r.date)}</p>
    {mine&&<div style={{display:"flex",alignItems:"center",gap:12,padding:"9px 14px",marginBottom:10,borderRadius:8,background:"#fff",border:`1px solid ${T.border}`,borderLeft:`3px solid ${T.warn}`}}>
      <span style={{fontSize:9.5,fontWeight:800,letterSpacing:0.6,color:T.warn,background:T.warn+"18",padding:"3px 9px",borderRadius:12,whiteSpace:"nowrap"}}>ACTION REQUIRED · YOUR TURN</span>
      <span style={{fontSize:12,color:T.text}}>{r.status==="returned"?"An approver asked for changes. Amend the request on the package and send it round again — nobody else can move it.":r.phase==="confirm"?"Make the change on PrimeCare, then confirm here — confirming applies it to the package as a new version.":"Review the requested change and the reason, then record your decision below."}</span></div>}
    {adminCan&&<div style={{display:"flex",alignItems:"center",gap:12,padding:"9px 14px",marginBottom:10,borderRadius:8,background:"#fff",border:`1px solid ${T.border}`,borderLeft:`3px solid ${T.warn}`}}>
      <span style={{fontSize:9.5,fontWeight:800,letterSpacing:0.6,color:"#b45309",background:"#fef3c7",padding:"3px 9px",borderRadius:12,whiteSpace:"nowrap"}}>CPT-ADMIN · NOT YOUR STEP</span>
      <span style={{fontSize:12,color:T.text}}>This step belongs to {curStep.name||"another approver"}. You can act on it as CPT-Admin, and the decision will be recorded in your name.</span></div>}
    <WfTracker stages={stages} cur={cur}/>
    <div style={{height:12}}/>
    <Card style={{marginBottom:16,padding:20}}>
      <ST style={{fontSize:15,color:T.primary,marginBottom:12}}>{r.special==="obsolete"?"Obsolete Item Code Replacements":`Requested Changes (${(r.changes||[]).length})`}</ST>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{(r.special==="obsolete"?["Obsolete code","New code"]:["Field","From","To"]).map(h=><th key={h} style={{padding:"6px 8px",fontSize:10,fontWeight:700,color:T.textMut,textAlign:"left",textTransform:"uppercase",letterSpacing:0.4,borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
        <tbody>{r.special==="obsolete"
          ?(r.pairs||[]).map((c,i)=><tr key={i} style={{borderTop:`1px solid ${T.borderLight}`}}><td style={{padding:"8px",fontSize:12,color:T.err,textDecoration:"line-through"}}>{c.old}</td><td style={{padding:"8px",fontSize:12,fontWeight:700,color:T.ok}}>{c.new}</td></tr>)
          :(r.changes||[]).map((c,i)=><tr key={i} style={{borderTop:`1px solid ${T.borderLight}`}}><td style={{padding:"8px",fontSize:12}}>{c.l}</td><td style={{padding:"8px",fontSize:12,color:T.textMut}}>{c.from||"—"}</td><td style={{padding:"8px",fontSize:12,fontWeight:700,color:T.warn}}>{c.to||"—"}</td></tr>)}</tbody>
      </table>
      <div style={{marginTop:14,padding:"10px 12px",background:"#eff6ff",borderRadius:8,borderLeft:`3px solid ${T.primary}`}}><div style={{fontSize:10,color:T.primary,fontWeight:800,textTransform:"uppercase",letterSpacing:0.4,marginBottom:3}}>Reason for this change</div><div style={{fontSize:12,color:T.text}}>{r.reason}</div></div>
      {fin&&<div style={{marginTop:10,fontSize:11,color:T.textSec}}>V{r.fromVer} stays approved and in force until this amendment completes. If it is rejected or withdrawn, the package stays at V{r.fromVer}.</div>}
    </Card>
    <Card style={{marginBottom:16,padding:16}}>
      <ST style={{fontSize:13,marginBottom:10}}>Approval route</ST>
      <div style={{display:"flex",flexDirection:"column",gap:5}}>
        {fin?r.stages.map((st,i)=>stepRow(i+1,st.full||st.label,st.name,r.status==="completed"||i<r.stage?"done":i===r.stage&&!r.done&&r.status!=="returned"?"cur":"todo",st.extra&&<span style={{fontSize:9,color:T.purple,background:"#faf5ff",padding:"1px 6px",borderRadius:8}}>extra stage</span>))
          :<React.Fragment>{chain.map((st,i)=>stepRow(i+1,st.label,st.name,(r.status==="completed"||i<r.stage||r.phase==="confirm")?"done":i===r.stage&&!r.done&&r.status!=="returned"?"cur":"todo",st.delegable&&<span style={{fontSize:9,color:T.purple,background:"#faf5ff",padding:"1px 6px",borderRadius:8}}>can delegate</span>))}
            {stepRow("",`Confirm on PrimeCare`,`${r.confirmRole} · ${r.confirmRole==="FCD"?"CFO":"CSCM Manager"}`,r.status==="completed"?"done":r.phase==="confirm"&&!r.done?"cur":"todo")}</React.Fragment>}
      </div>
    </Card>
    {r.status==="returned"&&<Card style={{marginBottom:16,padding:18,borderLeft:`3px solid ${T.warn}`}}>
      <ST style={{fontSize:13,color:"#92400e",margin:"0 0 4px"}}>{raiser?"Returned to you for changes":`Returned to ${r.raisedBy} for changes`}</ST>
      <div style={{fontSize:12,color:T.textSec,lineHeight:1.55,maxWidth:560}}>{r.returnNote?.by} asked for changes before this can continue. The package itself is <strong>unchanged and still approved</strong> — it is the amendment that needs attention. Change what they asked for, then send it round again; it restarts at the first step, because everyone who already approved did so on different values.</div>
      {r.returnNote&&<div style={{margin:"10px 0",padding:"8px 12px",background:"#fffbeb",borderRadius:6,fontSize:12}}>"{r.returnNote.text}"</div>}
      {raiser&&<div style={{display:"flex",gap:8}}><button onClick={()=>onOpenProc(r.baseId,true)} style={{padding:"9px 18px",borderRadius:7,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>Amend on the package →</button>
        <button onClick={()=>{if(window.confirm(`Withdraw ${r.id}? The package stays at V${r.fromVer}.`))onAct(r,"withdraw");}} style={{padding:"9px 16px",borderRadius:7,border:`1px solid ${T.border}`,background:"#fff",color:T.textSec,fontSize:12,fontWeight:600,cursor:"pointer"}}>Withdraw</button></div>}
    </Card>}
    {mine&&r.status!=="returned"&&decisionPanel(`Your decision — ${curLbl}`)}
    {adminCan&&<React.Fragment>
      {adminOpen?decisionPanel(`Administrator decision — ${curLbl}`,true):null}
      <Card style={{marginBottom:12,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div><div style={{fontSize:13,fontWeight:700,color:T.text}}>{curLbl} — {curStep.name} away?</div><div style={{fontSize:11.5,color:T.textSec,marginTop:3,maxWidth:460}}>Name someone to act on this step while its approver is unavailable. The amendment stays where it is; only who holds it changes.</div>
          {raOpen&&<div style={{marginTop:10,display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap"}}><div style={{width:260}}><PeoplePicker label="Cover approver" value={raUser} onChange={setRaUser} placeholder="Search AD users..."/></div><input style={{...inp,width:240,margin:0}} placeholder="Reason (e.g. annual leave)" value={raWhy} onChange={e=>setRaWhy(e.target.value)}/>
            <button onClick={()=>{if(!raUser||!raWhy.trim()){alert("Pick a person and give a reason");return;}onReassign(r,raUser,raWhy);setRaOpen(false);setRaUser(null);setRaWhy("");}} style={{padding:"8px 14px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>Reassign</button></div>}</div>
        <button onClick={()=>setRaOpen(!raOpen)} style={{padding:"6px 12px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:11.5,fontWeight:600,color:T.textSec,cursor:"pointer",whiteSpace:"nowrap"}}>Reassign {curStep.short||curStep.label}</button>
      </Card>
      {!adminOpen&&<Card style={{marginBottom:16,padding:"14px 16px",borderLeft:`3px solid ${T.textMut}`}}>
        <div style={{fontSize:13,fontWeight:700,color:T.textSec}}>This step is with {curStep.name}</div>
        <div style={{fontSize:11.5,color:T.textSec,marginTop:3,maxWidth:460,lineHeight:1.5}}>{curLbl} has not been decided yet, and it is not your step. Nothing is waiting on you.<br/>As <strong>CPT-Admin</strong> you can decide it on their behalf — for a request that is stuck, or an approver who cannot act. The decision is recorded in your name, not theirs.</div>
        <button onClick={()=>setAdminOpen(true)} style={{marginTop:10,padding:"6px 12px",borderRadius:6,border:`1px solid ${T.warn}`,background:"#fff",color:"#b45309",fontSize:11.5,fontWeight:700,cursor:"pointer"}}>Act on this step as CPT-Admin</button>
      </Card>}
    </React.Fragment>}
    {!r.done&&!mine&&!adminCan&&r.status!=="returned"&&<Card style={{marginBottom:16,padding:16,background:"#f8fafc",textAlign:"center",color:T.textMut,fontSize:12}}>Waiting on {curLbl} — {curStep.name}.</Card>}
    {raiser&&!r.done&&r.status!=="returned"&&<div style={{marginBottom:16,textAlign:"right"}}><button onClick={()=>{if(window.confirm(`Withdraw ${r.id}? The package stays at V${r.fromVer}.`))onAct(r,"withdraw");}} style={{padding:"7px 14px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",color:T.textSec,fontSize:11.5,fontWeight:600,cursor:"pointer"}}>Withdraw amendment</button></div>}
    <Card style={{padding:16}}><ST style={{fontSize:13,marginBottom:8}}>History</ST>
      {(r.timeline||[]).slice().reverse().map((t,i,a)=><div key={i} style={{display:"flex",gap:10,fontSize:11,padding:"5px 0",borderBottom:i<a.length-1?`1px solid ${T.borderLight}`:"none"}}><span style={{color:T.textMut,width:120,flexShrink:0}}>{t.date}</span><span style={{fontWeight:600,width:170,flexShrink:0}}>{t.by}</span><span>{t.action}</span></div>)}
    </Card>
  </div>;
}

function SetupCptList({items,setItems,onBack,showToast,audit=[],logAudit=()=>{}}){
  const[tab,setTab]=useState("records");
  const[io,setIo]=useState(false);
  const ioEntity={
    name:"CPT Codes",
    cols:[{k:"code",l:"Code",req:true},{k:"name",l:"Description",req:true},{k:"spec",l:"Specialty",req:false}],
    validate:(r)=>{const e=[];
      if(!/^\d{4,5}$/.test(String(r.code||"").trim()))e.push("Code must be 4–5 digits");
      if(!String(r.name||"").trim())e.push("Description required");
      if(items.some(x=>String(x.code)===String(r.code).trim()))e.push("Already in master — kept, not overwritten");
      return e;},
    onCommit:rows=>{
      const base=Math.max(0,...items.map(i=>i.id||0));
      const add=rows.map((r,i)=>({id:base+i+1,code:String(r.code).trim(),name:String(r.name).trim(),spec:String(r.spec||"").trim(),isActive:true}));
      setItems([...items,...add]);
      add.forEach(a=>logAudit("CPT Codes",a.code,"Created","—","—",`${a.code} — ${a.name}`,"Imported from CSV"));
      showToast&&showToast(`${add.length} CPT code(s) imported`);},
  };
  const[search,setSearch]=useState("");
  const[editing,setEditing]=useState(null);
  const[draft,setDraft]=useState({code:"",name:"",spec:""});
  const thCell={padding:"10px 14px",fontSize:11,fontWeight:600,color:T.textSec,textAlign:"left",borderBottom:`1px solid ${T.border}`};
  const actBtn={padding:"4px 10px",marginLeft:6,borderRadius:5,border:`1px solid ${T.border}`,background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",color:T.text,fontFamily:T.font};
  const rows=items.filter(c=>!search||c.code.toLowerCase().includes(search.toLowerCase())||(c.name||"").toLowerCase().includes(search.toLowerCase()));
  const openAdd=()=>{setDraft({code:"",name:"",spec:""});setEditing({mode:"add"});};
  const openEdit=it=>{setDraft({code:it.code,name:it.name,spec:it.spec||""});setEditing({mode:"edit",item:it});};
  const save=()=>{const c=draft.code.trim(),n=draft.name.trim();
    if(!c){alert("CPT Code is required");return;} if(!n){alert("CPT Description is required");return;}
    if(items.some(x=>x.code===c&&(!editing.item||x.id!==editing.item.id))){alert("That CPT code already exists");return;}
    if(editing.mode==="add"){const id=Math.max(0,...items.map(x=>x.id||0))+1;setItems([...items,{id,code:c,name:n,spec:draft.spec,isActive:true}]);}
    else setItems(items.map(x=>x.id===editing.item.id?{...x,code:c,name:n,spec:draft.spec}:x));
    setEditing(null);showToast&&showToast("CPT code saved");};
  const toggle=it=>setItems(items.map(x=>x.id===it.id?{...x,isActive:x.isActive===false}:x));
  const del=it=>{if(window.confirm(`Delete CPT ${it.code}?`))setItems(items.filter(x=>x.id!==it.id));};
  const activeCount=items.filter(x=>x.isActive!==false).length;
  // #14 — History view
  if(tab==="history") return <div style={{maxWidth:1600}}>
    <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:12}}>← Back to Setup</button>
    <h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:"0 0 10px"}}>CPT Codes</h1>
    <SetupTabs tab={tab} setTab={setTab} historyCount={audit.length}/>
    <EntityHistoryView entries={audit} entity="CPT Codes"/>
  </div>;
  return <div style={{maxWidth:1600}}>
    {io&&<MasterIO entity={ioEntity} onClose={()=>setIo(false)}/>}
    <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:12}}>← Back to Setup</button>
    <SetupTabs tab={tab} setTab={setTab} historyCount={audit.length}/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <div>
        <h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:0}}>CPT Codes</h1>
        <p style={{fontSize:12,color:T.textSec,margin:"4px 0 0"}}>{items.length} entries · {activeCount} active · Code + Description, used in the Doctor Request section</p>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>downloadSheet("CPT_Codes.xlsx",[{k:"code",l:"Code"},{k:"name",l:"Description"},{k:"spec",l:"Specialty"},{k:"isActive",l:"Active"}],items)} style={{padding:"8px 14px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",color:T.textSec,fontSize:12,fontWeight:600,cursor:"pointer"}}>⬆ Export</button>
        <button onClick={()=>setIo(true)} style={{padding:"8px 14px",borderRadius:6,border:`1px solid ${T.primary}`,background:"#fff",color:T.primary,fontSize:12,fontWeight:600,cursor:"pointer"}}>Import</button>
        <button onClick={openAdd} style={{padding:"8px 16px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Add</button>
      </div>
    </div>
    <div style={{padding:10,marginBottom:12,borderRadius:6,background:"#fffbeb",border:`1px solid ${T.warn}40`,fontSize:11,color:"#854d0e"}}><strong>Pending confirmation:</strong> the CPT master is Code + Description only. The Specialty link below is kept so the Specialty → CPT cascade in the request form keeps working — to be confirmed with the client.</div>
    <input style={{...inp,marginBottom:12}} placeholder="Search by CPT code or description..." value={search} onChange={e=>setSearch(e.target.value)}/>
    <Card style={{padding:0,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:T.primaryLight}}>
          <th style={{...thCell,width:110}}>CPT Code</th><th style={thCell}>CPT Description</th><th style={{...thCell,width:170}}>Specialty <span style={{fontWeight:400,color:T.textMut}}>(pending)</span></th><th style={{...thCell,width:90,textAlign:"center"}}>Active</th><th style={{...thCell,width:150,textAlign:"right"}}>Actions</th>
        </tr></thead>
        <tbody>
          {rows.length===0&&<tr><td colSpan={5} style={{padding:26,textAlign:"center",color:T.textMut,fontSize:12}}>No CPT codes match your search</td></tr>}
          {rows.map(c=><tr key={c.id} style={{borderTop:`1px solid ${T.borderLight}`,opacity:c.isActive!==false?1:0.55}}>
            <td style={{padding:"9px 14px",fontSize:12,fontWeight:600,color:T.primary}}>{c.code}</td>
            <td style={{padding:"9px 14px",fontSize:12,color:T.text}}>{c.name}</td>
            <td style={{padding:"9px 14px",fontSize:11,color:T.textSec}}>{c.spec||"—"}</td>
            <td style={{padding:"9px 14px",textAlign:"center"}}><span onClick={()=>toggle(c)} style={{cursor:"pointer",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:12,background:c.isActive!==false?"#dcfce7":"#f3f4f6",color:c.isActive!==false?T.ok:T.textMut}}>{c.isActive!==false?"Active":"Inactive"}</span></td>
            <td style={{padding:"9px 14px",textAlign:"right",whiteSpace:"nowrap"}}>
              <button onClick={()=>openEdit(c)} style={actBtn}>✎ Edit</button>
              <button onClick={()=>del(c)} style={{...actBtn,color:T.err,borderColor:T.err+"40"}}>🗑 Delete</button>
            </td>
          </tr>)}
        </tbody>
      </table>
    </Card>
    {editing&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}} onClick={()=>setEditing(null)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:10,padding:22,width:460,maxWidth:"100%",boxShadow:"0 10px 40px rgba(0,0,0,0.2)"}}>
        <ST style={{fontSize:15,color:T.primary,marginBottom:14}}>{editing.mode==="edit"?"Edit":"Add"} CPT Code</ST>
        <label style={lbl}>CPT Code <span style={{color:T.err}}>*</span></label>
        <input style={{...inp,marginBottom:12}} value={draft.code} onChange={e=>setDraft({...draft,code:e.target.value})} placeholder="e.g. 27447" autoFocus/>
        <label style={lbl}>CPT Description <span style={{color:T.err}}>*</span></label>
        <input style={{...inp,marginBottom:12}} value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})} placeholder="e.g. Total Knee Replacement"/>
        <label style={lbl}>Specialty <span style={{fontWeight:400,color:T.textMut,fontSize:10}}>(pending client confirmation)</span></label>
        <Select style={{...inp,marginBottom:18}} value={draft.spec} onChange={e=>setDraft({...draft,spec:e.target.value})}><option value="">— none —</option>{SPECIALTIES.map(s=><option key={s} value={s}>{s}</option>)}</Select>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
          <button onClick={()=>setEditing(null)} style={{padding:"8px 16px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
          <button onClick={save} style={{padding:"8px 18px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Save</button>
        </div>
      </div>
    </div>}
  </div>;
}

// Approval Workflow config (Batch 7 #19)
function SetupApprovals({config,setConfig,showToast,onBack,openCounts={},onRefreshOpen=()=>{},audit=[],logAudit=()=>{},chiefSurgeons={},setChiefSurgeons=()=>{}}){
  const[tab,setTab]=useState("records");
  const[search,setSearch]=useState("");
  const[branch,setBranch]=useState(BRANCHES[0].code);
  // On-leave / departure cover (#20 Option B) — track approver changes that have not yet been pushed to open requests
  const[dirty,setDirty]=useState({});
  const upd=(idx,patch)=>{const c=config[idx];if("active" in patch)logAudit("Approval Workflow",`Step ${c.num} · ${c.label}`,patch.active?"Reactivated":"Deactivated","Enabled",patch.active?"Off":"On",patch.active?"On":"Off");setConfig(config.map((c2,j)=>j===idx?{...c2,...patch}:c2));};
  const appr=c=>(c.approvers||{})[branch]||"";
  const setApprover=(idx,name)=>{const c=config[idx];if(name!==appr(c)){
      setDirty(d=>({...d,[branch]:{...(d[branch]||{}),[c.num]:{label:c.label,from:appr(c),to:name}}}));
      logAudit("Approval Workflow",`Step ${c.num} · ${c.label}`,"Updated",`Approver (${branch})`,appr(c)||"—",name);
      const openN=(openCounts[branch]||{})[c.num]||0;
      showToast(`Saved — ${c.label} approver for ${bName} is now ${name}.`+(openN>0?` ${openN} open request(s) at this step will follow the new approver.`:" No open requests at this step right now."));
    }setConfig(config.map((c2,j)=>j===idx?{...c2,approvers:{...(c2.approvers||{}),[branch]:name}}:c2));};
  const dirtyForBranch=dirty[branch]||{};
  const dirtyNums=Object.keys(dirtyForBranch).map(Number);
  const affected=dirtyNums.reduce((s,n)=>s+((openCounts[branch]||{})[n]||0),0);
  const doRefresh=()=>{onRefreshOpen(branch,dirtyForBranch);setDirty(d=>({...d,[branch]:{}}));};
  const bName=(BRANCHES.find(b=>b.code===branch)||{}).name||branch;
  const thCell={padding:"10px 14px",fontSize:11,fontWeight:600,color:T.textSec,textAlign:"left",borderBottom:`1px solid ${T.border}`};
  const rows=config.map((c,i)=>({c,i})).filter(({c})=>!search||c.label.toLowerCase().includes(search.toLowerCase())||appr(c).toLowerCase().includes(search.toLowerCase()));
  // #14 — History view
  if(tab==="history") return <div style={{maxWidth:1600}}>
    <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:12}}>← Back to Setup</button>
    <h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:"0 0 10px"}}>🧭 Approval Workflow</h1>
    <SetupTabs tab={tab} setTab={setTab} historyCount={audit.length}/>
    <EntityHistoryView entries={audit} entity="Approval Workflow"/>
  </div>;
  return <div style={{maxWidth:1600}}>
    <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:12}}>← Back to Setup</button>
    <SetupTabs tab={tab} setTab={setTab} historyCount={audit.length}/>
    <h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:0}}>🧭 Approval Workflow</h1>
    <p style={{fontSize:12,color:T.textSec,margin:"4px 0 14px"}}>Each step has one approver per branch (who may delegate). Select the branch, then assign the approver for every stage. Approvers are picked from Active Directory (AD).</p>
    <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",padding:"10px 14px",marginBottom:12,borderRadius:8,background:T.primaryLight,border:`1px solid ${T.primary}30`}}>
      <span style={{fontSize:11,fontWeight:700,color:T.primary,textTransform:"uppercase",letterSpacing:0.4}}>Branch / Environment</span>
      <div style={{display:"flex",gap:6}}>
        {BRANCHES.map(b=><button key={b.code} onClick={()=>setBranch(b.code)} style={{padding:"6px 14px",borderRadius:16,border:branch===b.code?`2px solid ${T.primary}`:`1px solid ${T.border}`,background:branch===b.code?"#fff":"#f8fafc",color:branch===b.code?T.primary:T.textSec,fontSize:11,fontWeight:branch===b.code?700:500,cursor:"pointer"}}>{b.name}</button>)}
      </div>
      <span style={{marginLeft:"auto",fontSize:10,color:T.textMut}}>Editing approvers for <strong>{bName}</strong></span>
    </div>
    {/* On-leave / departure cover — Option B: push the Setup change onto requests already in flight */}
    {dirtyNums.length>0&&<Card style={{marginBottom:12,padding:14,background:"#fffbeb",border:`1px solid ${T.warn}40`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:14,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:280}}>
          <div style={{fontSize:12,fontWeight:700,color:"#92400e",marginBottom:4}}>{dirtyNums.length} approver change{dirtyNums.length===1?"":"s"} not yet applied to open requests</div>
          <div style={{fontSize:11,color:T.textSec,lineHeight:1.5,marginBottom:8}}>New requests already use the new approver. Requests <strong>already in flight</strong> still sit with the previous approver until you refresh them. Only <strong>undecided</strong> steps move — anything already approved is left untouched.</div>
          {dirtyNums.map(n=><div key={n} style={{fontSize:11,color:T.text,padding:"4px 0"}}>
            <strong>Step {n} · {dirtyForBranch[n].label}</strong> — {dirtyForBranch[n].from||"— not set —"} <span style={{color:T.textMut}}>→</span> <strong style={{color:T.primary}}>{dirty[n].to}</strong>
            <span style={{marginLeft:8,fontSize:10,color:T.textMut}}>{((openCounts[branch]||{})[n]||0)} open request{((openCounts[branch]||{})[n]||0)===1?"":"s"} at this step</span>
          </div>)}
        </div>
        <button onClick={doRefresh} disabled={dirtyNums.length===0} style={{padding:"9px 18px",borderRadius:6,border:"none",background:dirtyNums.length===0?"#e5e7eb":T.warn,color:dirtyNums.length===0?T.textMut:"#fff",fontSize:12,fontWeight:700,cursor:dirtyNums.length===0?"not-allowed":"pointer",whiteSpace:"nowrap"}}>🔄 Apply to Open Requests{affected>0?` (${affected})`:""}</button>
      </div>
      <div style={{fontSize:10,color:T.textMut,marginTop:8}}>{affected>0?`${affected} in-flight request(s) will be re-pointed and any temporary cover cleared.`:"No open requests are sitting at these steps — the new approver already applies to current and future requests."}</div>
    </Card>}
    <input style={{...inp,marginBottom:12}} placeholder="Search step or approver..." value={search} onChange={e=>setSearch(e.target.value)}/>
    <Card style={{padding:0,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:T.primaryLight}}>
          <th style={{...thCell,width:50,textAlign:"center"}}>Step</th>
          <th style={thCell}>Stage</th>
          <th style={thCell}>Approver — {bName} (from AD)</th>
          <th style={{...thCell,width:100,textAlign:"center"}}>Enabled</th>
        </tr></thead>
        <tbody>
          {rows.length===0&&<tr><td colSpan={4} style={{padding:24,textAlign:"center",color:T.textMut,fontSize:12}}>No steps match</td></tr>}
          {rows.map(({c,i})=><tr key={i} style={{borderTop:`1px solid ${T.borderLight}`,opacity:c.active!==false?1:0.5}}>
            <td style={{padding:"8px 14px",textAlign:"center",fontSize:11,color:T.textMut}}>{c.num}</td>
            <td style={{padding:"8px 14px",fontSize:12,fontWeight:500,color:T.text}}>{c.label}</td>
            <td style={{padding:"6px 14px"}}><Select style={{...inp,fontSize:12,padding:"6px 8px"}} value={appr(c)} onChange={e=>setApprover(i,e.target.value)}>{!U.some(u=>u.name===appr(c))&&<option value={appr(c)}>{appr(c)||"— not set —"}</option>}{U.map(u=><option key={u.id} value={u.name}>{u.name} — {u.title}</option>)}</Select></td>
            <td style={{padding:"8px 14px",textAlign:"center"}}><span onClick={()=>upd(i,{active:c.active===false})} style={{cursor:"pointer",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:12,background:c.active!==false?"#dcfce7":"#f3f4f6",color:c.active!==false?T.ok:T.textMut}}>{c.active!==false?"On":"Off"}</span></td>
          </tr>)}
        </tbody>
      </table>
    </Card>
    <Card style={{padding:0,overflow:"hidden",marginTop:16}}>
      <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.border}`,background:"#f8fafc"}}>
        <div style={{fontSize:13,fontWeight:800,color:T.text}}>Chief Surgeons — by Specialty ({bName})</div>
        <div style={{fontSize:11,color:T.textSec,marginTop:2}}>Step 6 routes to the chief surgeon of the request's specialty in the request's branch. Specialties without a named chief fall back to the default Step 6 approver above.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"10px 20px",padding:"14px 18px"}}>
        {SPECIALTIES.map(sp=><div key={sp} style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{flex:"0 0 150px",fontSize:12,fontWeight:600,color:T.text}}>{sp}</span>
          <input style={{...inp,margin:0,fontSize:12}} placeholder="Default Step 6 approver" value={(chiefSurgeons[branch]||{})[sp]||""} onChange={e=>{const v=e.target.value;setChiefSurgeons({...chiefSurgeons,[branch]:{...(chiefSurgeons[branch]||{}),[sp]:v}});}} onBlur={e=>{const v=e.target.value;if(v){logAudit("Approval Workflow",`Chief Surgeon · ${sp}`,"Updated",`Chief Surgeon (${branch})`,"",v);showToast(`Saved — Chief Surgeon for ${sp} (${bName}) is ${v}.`);}}}/>
        </div>)}
      </div>
    </Card>
  </div>;
}

// ═══ MIGRATION (#40 bulk + #41 one-to-one) ═══
// Column set per the sample structure Fares shared: one line per package.
// Template line detail (template no, item, cost, sale, qty, UOM) is a SEPARATE report and is not migrated here.
const MIG_COLS=[
  {k:"pkgId",l:"A · PKGID",req:true},
  {k:"cptCode",l:"B · CPT Code",req:true},
  {k:"opCode",l:"C · Operation Code",req:true},
  {k:"pkgName",l:"D · Package Name",req:true},
  {k:"cap",l:"E · Cash Max Financial Limit (CAP)",req:true,num:true},
  {k:"price",l:"F · Package Patient Price",req:true,num:true},
  {k:"gTotal",l:"G · Total All Costs (auto)",num:true,auto:true},
  {k:"accom",l:"H · Patient Accommodation Cost",req:true,num:true},
  {k:"addl",l:"I · Additional Services Cost",req:true,num:true},
  {k:"jc",l:"J · Tot Cost Cons Tpls (auto)",num:true,auto:true},
  {k:"ks",l:"K · Tot Sale Cons Tpls (auto)",num:true,auto:true},
  {k:"ld",l:"L · Tot Cost Drug Tpls (auto)",num:true,auto:true},
  {k:"ms",l:"M · Tot Sale Drug Tpls (auto)",num:true,auto:true},
  {k:"nc",l:"N · Total Templates Cost (auto)",num:true,auto:true},
  {k:"os",l:"O · Total Templates Sale (auto)",num:true,auto:true},
  {k:"consTpls",l:"P · Consumable Template Nos",req:true},
  {k:"drugTpls",l:"Q · Drugs Template Nos",req:true},
  {k:"allTpls",l:"R · All Template Nos"},
  {k:"extractDate",l:"S · Cost/Sale Extract Date",req:true},
  {k:"approvalDocs",l:"T · Approval Docs"},
  {k:"approvalDate",l:"U · Latest Approval Date"},
  {k:"tplLink",l:"V · Templates Doc"},
  {k:"remarks",l:"W · Remarks"},
];
const MIG_SAMPLE=[{"pkgId":"25","cptCode":"31276-1","opCode":"10803025","pkgName":"Nasal/sinus endoscopy surgical with maxillary astronomy with the removal of tissue from maxillary including removal of tissue from frontal sinus when performed","cap":190.467,"price":1019,"gTotal":129.576,"accom":0,"addl":0,"jc":59.8,"ks":102.148,"ld":69.776,"ms":88.319,"nc":129.576,"os":190.467,"consTpls":"324 , 1963","drugTpls":"267 , 325","allTpls":"267 , 324 , 325 , 1963","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-10-17","tplLink":"Open Templates","remarks":""},{"pkgId":"27","cptCode":"69421","opCode":"10803027","pkgName":"Myringotomy including aspiration and/or eustachian tube inflation requiring general anesthesia","cap":128.349,"price":315,"gTotal":99.025,"accom":0,"addl":0,"jc":47.236,"ks":66.65,"ld":51.789,"ms":61.699,"nc":99.025,"os":128.349,"consTpls":"302 , 1963","drugTpls":"267 , 303","allTpls":"267 , 302 , 303 , 1963","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-10-17","tplLink":"Open Templates","remarks":""},{"pkgId":"35","cptCode":"30520","opCode":"10803035","pkgName":"Septoplasty or submucous resection, with or without cartilage scoring, contouring or replacement with graft","cap":240.743,"price":500,"gTotal":165.616,"accom":0,"addl":0,"jc":99.314,"ks":153.504,"ld":66.302,"ms":87.239,"nc":165.616,"os":240.743,"consTpls":"304 , 1963","drugTpls":"267 , 305","allTpls":"267 , 304 , 305 , 1963","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-10-17","tplLink":"Open Templates","remarks":""},{"pkgId":"37","cptCode":"30802","opCode":"10803037","pkgName":"Ablation, soft tissue of inferior turbinates, unilateral or bilateral, any method (eg, electrocautery, radiofrequency ablation, or tissue volume reduction);intramural (ie, submucosal)","cap":291.285,"price":450,"gTotal":207.633,"accom":0,"addl":0,"jc":139.515,"ks":205.835,"ld":68.118,"ms":85.45,"nc":207.633,"os":291.285,"consTpls":"308 , 1963","drugTpls":"267 , 309","allTpls":"267 , 308 , 309 , 1963","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-10-17","tplLink":"Open Templates","remarks":""},{"pkgId":"39","cptCode":"30130-1","opCode":"10803039","pkgName":"PARTIAL TURBINECTOMY","cap":192.277,"price":420,"gTotal":128.504,"accom":0,"addl":0,"jc":57.472,"ks":99.056,"ld":71.032,"ms":93.221,"nc":128.504,"os":192.277,"consTpls":"310 , 1963","drugTpls":"267 , 311","allTpls":"267 , 310 , 311 , 1963","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-10-17","tplLink":"Open Templates","remarks":""},{"pkgId":"40","cptCode":"30130-2","opCode":"10803040","pkgName":"PARTIAL TURBINECTOMY - COBLATION","cap":280.22,"price":520,"gTotal":195.659,"accom":0,"addl":0,"jc":132.376,"ks":196.545,"ld":63.283,"ms":83.675,"nc":195.659,"os":280.22,"consTpls":"312 , 1963","drugTpls":"267 , 313","allTpls":"267 , 312 , 313 , 1963","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-10-17","tplLink":"Open Templates","remarks":""},{"pkgId":"42","cptCode":"30801","opCode":"10803042","pkgName":"Ablation, soft tissue of inferior turbinates, unilateral or bilateral, any method (eg, electrocautery, radiofrequency ablation, or tissue volume reduction); superficial","cap":287.6,"price":450,"gTotal":205.792,"accom":0,"addl":0,"jc":141.04,"ks":207.904,"ld":64.752,"ms":79.696,"nc":205.792,"os":287.6,"consTpls":"306 , 1963","drugTpls":"267 , 307","allTpls":"267 , 306 , 307 , 1963","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-10-17","tplLink":"Open Templates","remarks":""},{"pkgId":"43","cptCode":"21315","opCode":"10803043","pkgName":"Closed treatment of nasal bone fracture; without stabilization","cap":158.751,"price":380,"gTotal":119.043,"accom":0,"addl":0,"jc":57.624,"ks":82.036,"ld":61.419,"ms":76.715,"nc":119.043,"os":158.751,"consTpls":"1963 , 2021","drugTpls":"267 , 2011","allTpls":"267 , 1963 , 2011 , 2021","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"","tplLink":"Open Templates","remarks":"No Approval Date"},{"pkgId":"48","cptCode":"30420","opCode":"10803048","pkgName":"Rhinoplasty, primary; including major septal repair","cap":232.734,"price":1300,"gTotal":173.518,"accom":0,"addl":0,"jc":96.184,"ks":133.264,"ld":77.334,"ms":99.47,"nc":173.518,"os":232.734,"consTpls":"318 , 1964","drugTpls":"266 , 319","allTpls":"266 , 318 , 319 , 1964","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-10-17","tplLink":"Open Templates","remarks":""},{"pkgId":"49","cptCode":"30430","opCode":"10803049","pkgName":"Rhinoplasty, secondary; minor revision (small amount of nasal tip work)","cap":"","price":1125,"gTotal":334.024,"accom":110,"addl":88.9,"jc":71.439,"ks":100.303,"ld":63.685,"ms":81.766,"nc":135.124,"os":182.069,"consTpls":"320 , 1963","drugTpls":"267 , 321","allTpls":"267 , 320 , 321 , 1963","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-10-17","tplLink":"Open Templates","remarks":""},{"pkgId":"54","cptCode":"11442","opCode":"10803054","pkgName":"Excision, other benign lesion including margins, except skin tag (unless listed elsewhere), face, ears, eyelids, nose, lips, mucous membrane; excised diameter 1.1 to 2.0 cm","cap":159.042,"price":920,"gTotal":119.395,"accom":0,"addl":0,"jc":50.522,"ks":74.356,"ld":68.873,"ms":84.686,"nc":119.395,"os":159.042,"consTpls":"1964 , 2033","drugTpls":"266 , 1979 , 2034","allTpls":"266 , 1964 , 1979 , 2033 , 2034","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-12-25","tplLink":"Open Templates","remarks":""},{"pkgId":"55","cptCode":"11444","opCode":"10803055","pkgName":"Excision, other benign lesion including margins, except skin tag (unless listed elsewhere), face, ears, eyelids, nose, lips, mucous membrane; excised diameter 3.1 to 4.0 cm","cap":192.298,"price":1265,"gTotal":144.952,"accom":0,"addl":0,"jc":69.653,"ks":98.883,"ld":75.299,"ms":93.415,"nc":144.952,"os":192.298,"consTpls":"1964 , 2035","drugTpls":"266 , 1979 , 2036","allTpls":"266 , 1964 , 1979 , 2035 , 2036","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-12-25","tplLink":"Open Templates","remarks":""},{"pkgId":"56","cptCode":"30560","opCode":"10803056","pkgName":"Lysis intranasal synechia","cap":181.711,"price":310,"gTotal":123.993,"accom":0,"addl":0,"jc":55.04,"ks":96.085,"ld":68.953,"ms":85.626,"nc":123.993,"os":181.711,"consTpls":"322 , 1963","drugTpls":"267 , 323","allTpls":"267 , 322 , 323 , 1963","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-10-17","tplLink":"Open Templates","remarks":""},{"pkgId":"61","cptCode":"42415","opCode":"10803061","pkgName":"Excision of parotid tumor or parotid gland; lateral lobe, with dissection and preservation of facial nerve","cap":222.491,"price":1382,"gTotal":167.661,"accom":0,"addl":0,"jc":91.664,"ks":128.054,"ld":75.997,"ms":94.437,"nc":167.661,"os":222.491,"consTpls":"1097 , 1963","drugTpls":"267 , 1098","allTpls":"267 , 1097 , 1098 , 1963","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-12-17","tplLink":"Open Templates","remarks":""},{"pkgId":"71","cptCode":"42826-1","opCode":"10803071","pkgName":"COBLATION PARTIAL TONSILLECTOMY","cap":261.493,"price":450,"gTotal":198.253,"accom":0,"addl":0,"jc":141.445,"ks":190.883,"ld":56.808,"ms":70.61,"nc":198.253,"os":261.493,"consTpls":"296 , 1963","drugTpls":"267 , 297","allTpls":"267 , 296 , 297 , 1963","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-10-17","tplLink":"Open Templates","remarks":""},{"pkgId":"73","cptCode":"42825","opCode":"10803073","pkgName":"Tonsillectomy, primary or secondary; younger than age 12","cap":136.782,"price":415,"gTotal":103.54,"accom":0,"addl":0,"jc":48.272,"ks":68.498,"ld":55.268,"ms":68.284,"nc":103.54,"os":136.782,"consTpls":"1964 , 2017","drugTpls":"266 , 267 , 2000","allTpls":"266 , 267 , 1964 , 2000 , 2017","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-10-17","tplLink":"Open Templates","remarks":""},{"pkgId":"74","cptCode":"42826","opCode":"10803074","pkgName":"Tonsillectomy, primary or secondary; age 12 or over","cap":148.432,"price":500,"gTotal":111.701,"accom":0,"addl":0,"jc":47.974,"ks":69.097,"ld":63.727,"ms":79.335,"nc":111.701,"os":148.432,"consTpls":"294 , 1963","drugTpls":"267 , 295","allTpls":"267 , 294 , 295 , 1963","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-10-17","tplLink":"Open Templates","remarks":""},{"pkgId":"76","cptCode":"42821-1","opCode":"10803076","pkgName":"ADENOIDECTOMY + CAT (TONSILLECTOMY BY COBLATION / LASER)","cap":261.456,"price":460,"gTotal":198.91,"accom":0,"addl":0,"jc":143.719,"ks":192.763,"ld":55.191,"ms":68.693,"nc":198.91,"os":261.456,"consTpls":"284 , 1963","drugTpls":"267 , 285","allTpls":"267 , 284 , 285 , 1963","extractDate":"2026-03-10","approvalDocs":"Open Approval","approvalDate":"2025-10-17","tplLink":"Open Templates","remarks":""}];
// Real-file header mapping — accepts Fares' Book1 headers AND our template labels
const MIG_HDR_MAP={"pkgid":"pkgId","cptcode":"cptCode","cpt code":"cptCode","operationcode":"opCode","operation code":"opCode","packagename":"pkgName","package name":"pkgName","cashmaximumfinanciallimit(cap)":"cap","cashmaximumfinanciallimitcap":"cap","cap":"cap","packagepatientprice":"price","package patient price":"price","totalallcosts":"gTotal","patientaccomidaitoncost":"accom","patientaccommodationcost":"accom","additionalservicescost":"addl","totalcostofconsumabletemplates":"jc","totalsaleofconsumabletemplates":"ks","totalcostofdrugstemplates":"ld","totalsaleofdrugstemplates":"ms","totaltemplatescost":"nc","totaltemplatessale":"os","consumablestemplatesnumbers":"consTpls","drugstemplatesnumbers":"drugTpls","alltempletesnumbers":"allTpls","alltemplatesnumbers":"allTpls","templatescostandsaleextractdate":"extractDate","approvaldocslink":"approvalDocs","latestapprovaldate":"approvalDate","templateslink":"tplLink","templates link":"tplLink","remarks":"remarks"};
function parseMigWorkbook(wb){
  const sh=wb.Sheets[wb.SheetNames[0]];
  const raw=XLSX.utils.sheet_to_json(sh,{defval:"",raw:true});
  if(!raw.length)return {err:"The sheet has no data rows."};
  const norm=s=>String(s).toLowerCase().replace(/[\s_]+/g,"").replace(/·/g,"").trim();
  const hdrKeys={};Object.keys(raw[0]).forEach(h=>{const k=MIG_HDR_MAP[norm(h)]||MIG_COLS.find(c=>norm(c.l)===norm(h)||norm(c.l).indexOf(norm(h))>-1)?.k;if(k)hdrKeys[h]=k;});
  const mapped=Object.values(hdrKeys);
  const missing=MIG_COLS.filter(c=>c.req&&!mapped.includes(c.k)).map(c=>c.l);
  if(missing.length)return {err:"Could not find these required columns in the file:\n• "+missing.join("\n• ")};
  const exDate=v=>{if(v==null||v==="")return "";if(v instanceof Date)return v.toISOString().slice(0,10);if(typeof v==="number"&&v>20000){const d=new Date(Math.round((v-25569)*86400*1000));return d.toISOString().slice(0,10);}return String(v).slice(0,10);};
  const rows=raw.map(r=>{const o={};MIG_COLS.forEach(c=>o[c.k]="");
    Object.entries(hdrKeys).forEach(([h,k])=>{let v=r[h];
      if(k==="extractDate"||k==="approvalDate")v=exDate(v);
      else if(typeof v==="number"&&["cap","price","gTotal","accom","addl","jc","ks","ld","ms","nc","os"].includes(k))v=Number(v.toFixed(3));
      o[k]=v==null?"":(typeof v==="string"?v.trim():v);});
    return o;}).filter(o=>String(o.pkgId)!=="");
  return {rows};
}
const parseTplList=s=>String(s||"").split(",").map(x=>x.trim()).filter(Boolean);
// Validation per the 2026-07-22 call — A-F,H,I,P,Q,S mandatory; totals recomputed from Template Masters; drift = warning
function migValidate(rows,cptCodes,existingIds,tplMasters){
  const seen={};
  const mByNo={};(tplMasters||[]).forEach(t=>{mByNo[t.type+":"+t.no]=t;});
  return rows.map((r,i)=>{
    const errs=[],warns=[];
    MIG_COLS.filter(c=>c.req).forEach(c=>{if(r[c.k]===""||r[c.k]==null)errs.push(`${c.l} is required`);});
    MIG_COLS.filter(c=>c.num).forEach(c=>{if(r[c.k]!==""&&r[c.k]!=null&&isNaN(Number(r[c.k])))errs.push(`${c.l} is not a number`);});
    if(r.pkgId){if(seen[r.pkgId])errs.push(`Duplicate PKGID (also row ${seen[r.pkgId]})`);else seen[r.pkgId]=i+1;
      if(existingIds.includes(String(r.pkgId)))errs.push("PKGID already exists in the system");}
    if(r.opCode&&r.pkgId&&!String(r.opCode).endsWith(String(r.pkgId)))warns.push(`Operation Code ${r.opCode} does not follow the 108030+PKGID pattern`);
    if(r.cptCode){const c=String(r.cptCode);const base=c.split("-")[0];
      if((cptCodes||[]).some(x=>String(x.code)===c)){}
      else if((cptCodes||[]).some(x=>String(x.code)===base))warns.push(`CPT ${c} accepted as a local variant of ${base}`);
      else warns.push(`CPT ${c} is not in the CPT master — imported as text`);}
    const P=parseTplList(r.consTpls),Q=parseTplList(r.drugTpls);
    const missP=P.filter(t=>!mByNo["1:"+t]),missQ=Q.filter(t=>!mByNo["2:"+t]);
    if(missP.length)errs.push(`Consumable template(s) not in Setup: ${missP.join(", ")} — import the P_REPORT first`);
    if(missQ.length)errs.push(`Drugs template(s) not in Setup: ${missQ.join(", ")} — import the P_REPORT first`);
    if(r.allTpls){const R=parseTplList(r.allTpls).sort((a,b)=>a-b).join(",");const PQ=[...P,...Q].sort((a,b)=>a-b).join(",");
      if(R!==PQ)warns.push("Column R does not equal P + Q — P and Q win");}
    if(!missP.length&&!missQ.length){
      const cC=P.reduce((s,t)=>s+tplCost(mByNo["1:"+t]),0),cS=P.reduce((s,t)=>s+tplSale(mByNo["1:"+t]),0);
      const dC=Q.reduce((s,t)=>s+tplCost(mByNo["2:"+t]),0),dS=Q.reduce((s,t)=>s+tplSale(mByNo["2:"+t]),0);
      const chk=(v,calc,lbl)=>{if(v!==""&&v!=null&&!isNaN(Number(v))&&Math.abs(Number(v)-calc)>0.01)warns.push(`${lbl} drift: file ${Number(v).toFixed(3)} vs Setup templates ${calc.toFixed(3)} (Δ ${(calc-Number(v)).toFixed(3)})`);};
      chk(r.jc,cC,"J cons cost");chk(r.ld,dC,"L drugs cost");chk(r.nc,cC+dC,"N templates cost");chk(r.os,cS+dS,"O templates sale");
      const g=cC+dC+Number(r.accom||0)+Number(r.addl||0);
      chk(r.gTotal,g,"G total cost");
      const price=Number(r.price||0);
      if(price>0&&g>0&&price<g)warns.push(`Patient Price ${price} is below computed cost ${g.toFixed(3)} — negative margin`);
      r._calc={cC,cS,dC,dS,g};
    }
    return{...r,_row:i+1,_errs:errs,_warns:warns,_ok:errs.length===0};
  });
}
function SetupMigration({cptCodes=[],existingIds=[],onCommit=()=>{},showToast=()=>{},onBack,tplMasters=[],procs=[],onOpenPkg=()=>{},migStaged=[],onStage=()=>{},onUpdateStaged=()=>{},onSend=()=>{},onApprove=()=>{},onReject=()=>{},users=[]}){
  const migFileRef=useRef(null);
  const[view2,setView2]=useState("records"); // records | approval
  const[selRec,setSelRec]=useState(null);    // _stageId of the open record
  const[recTab,setRecTab]=useState("overview");
  const[freeName,setFreeName]=useState("");
  const consN=tplMasters.filter(t=>t.type===1).length,drugN=tplMasters.filter(t=>t.type===2).length;
  const revalidate=r=>migValidate([r],cptCodes,existingIds,tplMasters)[0];
  const readMigFile=f=>{const reader=new FileReader();
    reader.onload=e=>{try{
      const wb=XLSX.read(new Uint8Array(e.target.result),{type:"array",cellDates:true});
      const res=parseMigWorkbook(wb);
      if(res.err){alert(res.err);return;}
      const vr=migValidate(res.rows,cptCodes,existingIds,tplMasters);
      onStage(vr);setSelRec(null);setView2("records");
      showToast(`${vr.length} row(s) staged as Draft — complete each record and send for approval`);
    }catch(err){alert("Could not read the file: "+err.message);}};
    reader.readAsArrayBuffer(f);};
  const loadSample=()=>{const vr=migValidate(MIG_SAMPLE,cptCodes,existingIds,tplMasters);onStage(vr);setSelRec(null);setView2("records");showToast(`${vr.length} sample rows staged as Draft`);};
  const dlTemplate=()=>{try{const ws=XLSX.utils.aoa_to_sheet([MIG_COLS.map(c=>c.l.replace(/^[A-W] · /,"")+(c.req?" *":"")),MIG_COLS.map(c=>{const v=MIG_SAMPLE[0][c.k];return v==null?"":v;})]);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,"Packages");XLSX.writeFile(wb,"CliniPack_Migration_Template.xlsx");}catch(err){alert("Template columns:\n\n"+MIG_COLS.map(c=>c.l+(c.req?" *":"")).join("\n"));}};
  const stat={ready:migStaged.filter(r=>r.status==="draft"&&r._ok&&r.manager).length,
    attention:migStaged.filter(r=>r.status==="draft"&&r._ok&&!r.manager).length,
    error:migStaged.filter(r=>r.status==="draft"&&!r._ok).length,
    pending:migStaged.filter(r=>r.status==="pending").length,
    migrated:migStaged.filter(r=>r.status==="migrated").length};
  const cur=migStaged.find(r=>r._stageId===selRec);
  const drafts=migStaged.filter(r=>r.status!=="migrated"||true);
  const idx=cur?migStaged.indexOf(cur):-1;
  const STCHIP=r=>r.status==="migrated"?<Badge color={T.ok} bg="#ecfdf5">Migrated</Badge>:r.status==="pending"?<Badge color={T.info} bg="#eff6ff">Pending approval</Badge>:<Badge color={T.textSec} bg="#f1f5f9">Draft</Badge>;

  // ═══ RECORD DETAIL (full page, ItemSure "Open / Fix") ═══
  if(cur){
    const mgrOk=!!cur.manager;
    const canSend=cur._ok&&mgrOk&&cur.status==="draft";
    const upd=patch=>{const merged={...cur,...patch};const rv=revalidate(merged);onUpdateStaged(cur._stageId,{...patch,_errs:rv._errs,_warns:rv._warns,_ok:rv._ok,_calc:rv._calc});};
    const F=(k,label,opts={})=>{const c=MIG_COLS.find(x=>x.k===k)||{};
      return <div>
        <label style={lbl}>{label||c.l.replace(/^[A-W] · /,"")}{(opts.req??c.req)&&<span style={{color:T.err}}> *</span>}{opts.fromExcel&&<span style={{fontSize:9,color:T.textMut,fontWeight:500}}> (from Excel)</span>}</label>
        {opts.readOnly
          ?<input readOnly style={{...inp,background:"#f8fafc",cursor:"default"}} value={cur[k]??""}/>
          :<input style={{...inp,borderColor:(cur._errs||[]).some(e2=>e2.indexOf(c.l)>-1)?T.err:inp.border}} type={c.num?"number":k.indexOf("Date")>-1?"date":"text"} value={cur[k]??""} onChange={e=>upd({[k]:e.target.value})}/>}
        {(cur._errs||[]).filter(e2=>c.l&&e2.indexOf(c.l)>-1).map((e2,i2)=><div key={i2} style={{fontSize:10,color:T.err,marginTop:3}}>✕ {e2}</div>)}
      </div>;};
    return <div style={{maxWidth:1200}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <button onClick={()=>setSelRec(null)} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,fontWeight:600,color:T.text,cursor:"pointer",fontFamily:T.font}}>← Back to list</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:11.5,color:T.textSec,fontWeight:600}}>{idx+1} / {migStaged.length}</span>
          <button disabled={idx<=0} onClick={()=>{setSelRec(migStaged[idx-1]._stageId);setRecTab("overview");}} style={{width:32,height:32,borderRadius:8,border:`1px solid ${T.border}`,background:"#fff",cursor:idx>0?"pointer":"default",color:idx>0?T.text:T.textMut}}>‹</button>
          <button disabled={idx>=migStaged.length-1} onClick={()=>{setSelRec(migStaged[idx+1]._stageId);setRecTab("overview");}} style={{width:32,height:32,borderRadius:8,border:`1px solid ${T.border}`,background:"#fff",cursor:idx<migStaged.length-1?"pointer":"default",color:idx<migStaged.length-1?T.text:T.textMut}}>›</button>
        </div>
      </div>
      <Card style={{padding:"14px 20px",marginBottom:14,borderLeft:`4px solid ${cur.status==="migrated"?T.ok:T.primary}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:0.6,textTransform:"uppercase",color:T.textMut}}>Migrated · Historical Record · PKGID {cur.pkgId}</div>
            <div style={{fontSize:17,fontWeight:800,color:T.text,marginTop:2}}>{cur.pkgName}</div>
          </div>
          {STCHIP(cur)}
        </div>
        {cur.rejectNote&&cur.status==="draft"&&<div style={{marginTop:8,fontSize:11,color:"#92400e",background:"#fffbeb",borderRadius:6,padding:"6px 10px"}}>Returned by manager: {cur.rejectNote}</div>}
      </Card>
      <div style={{display:"flex",gap:0,borderBottom:`2px solid ${T.border}`,marginBottom:16}}>
        {[{k:"overview",l:"Overview"},{k:"att",l:`Attachments (${(cur.attachments||[]).length})`}].map(t2=><button key={t2.k} onClick={()=>setRecTab(t2.k)} style={{padding:"10px 18px",border:"none",background:"none",fontSize:13,fontWeight:recTab===t2.k?700:400,color:recTab===t2.k?T.primary:T.textSec,borderBottom:recTab===t2.k?`3px solid ${T.primary}`:"3px solid transparent",cursor:"pointer",marginBottom:-2,fontFamily:T.font}}>{t2.l}</button>)}
      </div>
      {recTab==="overview"&&<React.Fragment>
        <Card style={{padding:20,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <ST style={{fontSize:14,margin:0}}>Imported details</ST>
            <span style={{fontSize:10.5,color:T.textMut}}>Pre-filled from Excel — edit with care</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"12px 16px"}}>
            {F("pkgId","PKGID",{readOnly:true,fromExcel:true})}
            {F("cptCode","CPT Code")}
            {F("opCode","Operation Code")}
            {F("pkgName","Package Name")}
            {F("cap","CAP Limit (KWD)")}
            {F("price","Patient Price (KWD)")}
            {F("accom","Accommodation Cost")}
            {F("addl","Additional Services Cost")}
            {F("consTpls","Consumable Template Nos")}
            {F("drugTpls","Drugs Template Nos")}
            {F("extractDate","Costs Extract Date")}
            {F("approvalDate","Paper Approval Date",{req:false})}
          </div>
          {cur._calc&&<div style={{display:"flex",gap:16,flexWrap:"wrap",marginTop:14,padding:"10px 14px",borderRadius:8,background:"#f8fafc",border:`1px solid ${T.border}`,fontSize:11.5}}>
            <span>Templates cost: <strong>{fmtKWD(cur._calc.cC+cur._calc.dC)}</strong></span>
            <span>Total cost: <strong>{fmtKWD(cur._calc.g)}</strong></span>
            {Number(cur.price)>0&&cur._calc.g>0&&<span>Margin (on cost): <strong style={{color:Number(cur.price)>cur._calc.g?T.ok:T.err}}>{(((Number(cur.price)-cur._calc.g)/cur._calc.g)*100).toFixed(1)}%</strong></span>}
            {(cur._warns||[]).filter(w=>w.indexOf("drift")>-1).map((w,i2)=><span key={i2} style={{color:"#92400e"}}>{w}</span>)}
          </div>}
        </Card>
        <Card style={{padding:20,marginBottom:14}}>
          <ST style={{fontSize:14,margin:"0 0 4px"}}>Related people — signatures on the paper sheet</ST>
          <div style={{fontSize:11,color:T.textSec,marginBottom:10}}>From the scanned approval pack. People who left the organisation can be typed manually.</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
            {(cur.relatedPeople||[]).map((rp,i2)=><span key={i2} style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11.5,fontWeight:600,color:T.text,background:"#f8fafc",border:`1px solid ${T.border}`,borderRadius:8,padding:"4px 8px"}}>
              {rp.name}{rp.free?" (departed)":""}
              <input type="date" value={rp.date||""} onChange={e=>onUpdateStaged(cur._stageId,{relatedPeople:cur.relatedPeople.map((x,k)=>k===i2?{...x,date:e.target.value}:x)})} style={{...inp,width:130,margin:0,padding:"2px 6px",fontSize:10.5}}/>
              <span onClick={()=>onUpdateStaged(cur._stageId,{relatedPeople:cur.relatedPeople.filter((_,k)=>k!==i2)})} style={{cursor:"pointer",display:"inline-flex",color:T.err}}><Ic n="x" s={11}/></span>
            </span>)}
            {(cur.relatedPeople||[]).length===0&&<span style={{fontSize:11,color:T.textMut}}>No people added yet</span>}
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <Select defaultValue="" onChange={e=>{const u2=users.find(x=>x.name===e.target.value);e.target.value="";if(u2&&!(cur.relatedPeople||[]).some(x=>x.name===u2.name))onUpdateStaged(cur._stageId,{relatedPeople:[...(cur.relatedPeople||[]),{name:u2.name,date:"",free:false}]});}} style={{...inp,width:260,margin:0,fontSize:12}}>
              <option value="">Add from Active Directory…</option>
              {users.map(u2=><option key={u2.id} value={u2.name}>{u2.name} — {u2.title}</option>)}
            </Select>
            <input value={freeName} onChange={e=>setFreeName(e.target.value)} placeholder="Person who left the organisation…" style={{...inp,width:240,margin:0,fontSize:12}}/>
            <button onClick={()=>{if(freeName.trim()&&!(cur.relatedPeople||[]).some(x=>x.name===freeName.trim())){onUpdateStaged(cur._stageId,{relatedPeople:[...(cur.relatedPeople||[]),{name:freeName.trim(),date:"",free:true}]});setFreeName("");}}} style={{padding:"8px 14px",borderRadius:8,border:`1px solid ${T.border}`,background:"#fff",fontSize:11.5,fontWeight:700,color:T.textSec,cursor:"pointer",fontFamily:T.font}}>+ Add</button>
          </div>
        </Card>
        <Card style={{padding:20,marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}}>
            <div>
              <label style={lbl}>Manager / Approver (AD) <span style={{color:T.err}}>*</span></label>
              <Select value={cur.manager||""} onChange={e=>onUpdateStaged(cur._stageId,{manager:e.target.value})} style={{...inp,borderColor:mgrOk?inp.border:T.err}}>
                <option value="">Select the approving manager…</option>
                {users.filter(u2=>u2.isSiteAdmin||["cscm","cfo","cmo"].includes(u2.role)).map(u2=><option key={u2.id} value={u2.name}>{u2.name} — {u2.title}</option>)}
              </Select>
              {!mgrOk&&<div style={{fontSize:10.5,color:T.err,marginTop:3}}>Required — select who approves this migration</div>}
            </div>
            <div>
              <label style={lbl}>Comments</label>
              <input value={cur.comments||""} onChange={e=>onUpdateStaged(cur._stageId,{comments:e.target.value})} style={inp} placeholder="Notes for the approver…"/>
            </div>
          </div>
        </Card>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginBottom:20}}>
          {cur.status==="draft"&&<button onClick={()=>{if(!cur._ok){alert("Fix the errors first:\n\n• "+cur._errs.join("\n• "));return;}if(!mgrOk){alert("Select the approving manager first.");return;}onSend(cur._stageId);}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 22px",borderRadius:8,border:"none",background:canSend?T.primary:"#cbd5e1",color:"#fff",fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:T.font}}><Ic n="send" s={13}/>Send to manager for approval</button>}
          {cur.status==="pending"&&<span style={{fontSize:12,color:T.info,fontWeight:600,padding:"10px 0"}}>Waiting for {cur.manager} — see the Manager Approval tab.</span>}
          {cur.status==="migrated"&&<button onClick={()=>{const p2=procs.find(x=>String(x.id)===String(cur.pkgId));if(p2)onOpenPkg(p2);}} style={{padding:"10px 22px",borderRadius:8,border:`1px solid ${T.primary}`,background:"#fff",color:T.primary,fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Open live package →</button>}
        </div>
      </React.Fragment>}
      {recTab==="att"&&<Card style={{padding:20}}>
        <ST style={{fontSize:14,margin:"0 0 10px"}}>Approval documents — scanned packs (e.g. {cur.pkgId}-1.pdf)</ST>
        <AttachmentBox files={cur.attachments||[]} onChange={f=>onUpdateStaged(cur._stageId,{attachments:f})} step="Migration" by="Supply Chain"/>
      </Card>}
    </div>;
  }

  // ═══ LANDING — nothing staged yet ═══
  if(migStaged.length===0){
    return <div style={{maxWidth:1100}}>
      <h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:0}}>Data Import</h1>
      <p style={{fontSize:12,color:T.textSec,margin:"4px 0 14px"}}>Migrate historical packages into CliniPack. Records stay as <strong>Draft</strong> until a manager approves — only then do they become live packages.</p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:14}}>
        <span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11.5,fontWeight:600,padding:"5px 12px",borderRadius:20,background:consN?"#f0fdfa":"#fef2f2",color:consN?(T.teal||"#0d9488"):T.err,border:`1px solid ${consN?(T.teal||"#0d9488"):T.err}30`}}><Ic n={consN?"check":"alert"} s={11} sw={2.6}/>Consumable templates: {consN} in Setup</span>
        <span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11.5,fontWeight:600,padding:"5px 12px",borderRadius:20,background:drugN?"#f0fdfa":"#fef2f2",color:drugN?(T.teal||"#0d9488"):T.err,border:`1px solid ${drugN?(T.teal||"#0d9488"):T.err}30`}}><Ic n={drugN?"check":"alert"} s={11} sw={2.6}/>Drugs templates: {drugN} in Setup</span>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{display:"flex",justifyContent:"flex-end",padding:"12px 16px",borderBottom:`1px solid ${T.borderLight}`}}>
          <button onClick={dlTemplate} style={{display:"inline-flex",alignItems:"center",gap:7,padding:"8px 16px",borderRadius:8,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:T.font}}><Ic n="download" s={13}/>Download Template</button>
        </div>
        <div style={{padding:"44px 24px 48px",textAlign:"center"}}>
          <div style={{width:64,height:64,borderRadius:16,background:"#f0fdfa",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Ic n="download" s={28} sw={1.7} style={{color:T.primary}}/></div>
          <div style={{fontSize:17,fontWeight:800,color:T.text,marginBottom:6}}>Upload your packages Excel</div>
          <div style={{fontSize:12,color:T.textSec,maxWidth:460,margin:"0 auto 20px",lineHeight:1.6}}>Drag your file here or browse. Use the fixed template — one line per package; template numbers must exist in Setup → Templates. Every row uploads in one pass.</div>
          <div onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files&&e.dataTransfer.files[0];if(f)readMigFile(f);}} onClick={()=>migFileRef.current&&migFileRef.current.click()} style={{border:`2px dashed ${T.border}`,borderRadius:12,padding:"26px 20px",maxWidth:560,margin:"0 auto",cursor:"pointer",background:"#fafcfc"}}>
            <div style={{fontSize:13,fontWeight:700,color:T.primary}}>Choose Excel file</div>
            <div style={{fontSize:11,color:T.textMut,marginTop:3}}>.xlsx / .csv — drag & drop or click to browse · Book1 headers recognised</div>
          </div>
          <input ref={migFileRef} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={e=>{if(e.target.files[0])readMigFile(e.target.files[0]);e.target.value="";}}/>
          <button onClick={loadSample} style={{marginTop:16,padding:"7px 14px",borderRadius:8,border:`1px solid ${T.border}`,background:"#fff",fontSize:11.5,fontWeight:600,color:T.textSec,cursor:"pointer",fontFamily:T.font}}>Load Sample File (Fares' 18 packages)</button>
        </div>
      </Card>
    </div>;
  }

  // ═══ RECORDS WORKSPACE ═══
  const list=view2==="approval"?migStaged.filter(r=>r.status==="pending"):migStaged;
  return <div style={{maxWidth:1600}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap",marginBottom:12}}>
      <div>
        <h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:0}}>Data Import</h1>
        <p style={{fontSize:12,color:T.textSec,margin:"4px 0 0"}}>Open a record to review imported data, complete missing fields, and send it to the manager for approval. Records migrate once approved.</p>
      </div>
      <div style={{display:"flex",gap:8}}>
        {[{k:"records",l:"Records"},{k:"approval",l:`Manager Approval${stat.pending?` (${stat.pending})`:""}`}].map(t2=><button key={t2.k} onClick={()=>setView2(t2.k)} style={{padding:"8px 18px",borderRadius:8,border:view2===t2.k?`2px solid ${T.primary}`:`1px solid ${T.border}`,background:view2===t2.k?T.primaryLight:"#fff",color:view2===t2.k?T.primary:T.textSec,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>{t2.l}</button>)}
      </div>
    </div>
    <Card style={{padding:"11px 16px",marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"center",fontSize:11.5,fontWeight:600}}>
          <span style={{color:T.ok}}>● {stat.ready} ready</span>
          <span style={{color:T.warn}}>● {stat.attention} need attention</span>
          <span style={{color:T.err}}>● {stat.error} error</span>
          <span style={{color:T.border}}>|</span>
          <span style={{color:stat.pending?T.info:T.textMut}}>{stat.pending?`${stat.pending} awaiting manager`:"none submitted yet"}</span>
          <span style={{color:stat.migrated?T.ok:T.textMut}}>{stat.migrated} migrated</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={dlTemplate} style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${T.primary}`,background:"#fff",color:T.primary,fontSize:11.5,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Download Template</button>
          <button onClick={()=>migFileRef.current&&migFileRef.current.click()} style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${T.border}`,background:"#fff",color:T.textSec,fontSize:11.5,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Re-upload Excel</button>
          <input ref={migFileRef} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={e=>{if(e.target.files[0])readMigFile(e.target.files[0]);e.target.value="";}}/>
        </div>
      </div>
    </Card>
    <Card style={{padding:0,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:T.primary}}>
          {["","PKGID","Package Name","CPT","Price","Computed Cost","Extract Date","Migration Status",""].map((h,i2)=><th key={i2} style={{padding:"10px 14px",fontSize:10,fontWeight:800,color:"#fff",textTransform:"uppercase",letterSpacing:0.5,textAlign:i2>=4&&i2<=5?"right":"left"}}>{h}</th>)}
        </tr></thead>
        <tbody>
          {list.length===0&&<tr><td colSpan={9} style={{padding:30,textAlign:"center",color:T.textMut,fontSize:12}}>{view2==="approval"?"Nothing waiting for approval":"No records"}</td></tr>}
          {list.map(r=>{const st2=r.status!=="draft"?null:(!r._ok?{c:T.err,l:"Error"}:!r.manager?{c:T.warn,l:"Attention"}:{c:T.ok,l:"Ready"});
            return <tr key={r._stageId} style={{borderTop:`1px solid ${T.borderLight}`,background:r.status==="migrated"?"#f6fefb":st2&&st2.l==="Error"?"#fef7f7":"#fff"}}>
              <td style={{padding:"10px 14px",whiteSpace:"nowrap"}}>{st2?<span style={{fontSize:11,fontWeight:700,color:st2.c}}>● {st2.l}</span>:<span style={{fontSize:11,color:T.textMut}}>—</span>}</td>
              <td style={{padding:"10px 14px",fontSize:12.5,fontWeight:800,color:T.primary}}>{r.pkgId}</td>
              <td style={{padding:"10px 14px",fontSize:11.5,maxWidth:280,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.pkgName}</td>
              <td style={{padding:"10px 14px",fontSize:11.5}}>{r.cptCode}</td>
              <td style={{padding:"10px 14px",fontSize:11.5,textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{fmtKWD(r.price)}</td>
              <td style={{padding:"10px 14px",fontSize:11.5,textAlign:"right",color:T.textSec,fontVariantNumeric:"tabular-nums"}}>{r._calc?fmtKWD(r._calc.g):"—"}</td>
              <td style={{padding:"10px 14px",fontSize:11,color:T.textSec}}>{r.extractDate||"—"}</td>
              <td style={{padding:"10px 14px"}}>{STCHIP(r)}</td>
              <td style={{padding:"8px 14px",textAlign:"right"}}>
                {view2==="approval"
                  ?<div style={{display:"flex",gap:8,justifyContent:"flex-end",alignItems:"center"}}>
                    <span style={{fontSize:10.5,color:T.textMut}}>for {r.manager}</span>
                    <button onClick={()=>onApprove(r._stageId)} style={{padding:"5px 14px",borderRadius:7,border:"none",background:T.ok,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Approve & Migrate</button>
                    <button onClick={()=>onReject(r._stageId,"Please review the data")} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${T.err}`,background:"#fff",color:T.err,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Return</button>
                  </div>
                  :<div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                    <div style={{display:"flex",gap:8}}>
                      {r.status==="migrated"
                        ?<button onClick={()=>{const p2=procs.find(x=>String(x.id)===String(r.pkgId));if(p2)onOpenPkg(p2);}} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${T.primary}55`,background:"#fff",color:T.primary,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Open package →</button>
                        :<button onClick={()=>{setSelRec(r._stageId);setRecTab("overview");}} style={{padding:"5px 14px",borderRadius:7,border:"none",background:st2&&st2.l!=="Ready"?T.warn:T.primary,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>{st2&&st2.l!=="Ready"?"Open / Fix →":"Open"}</button>}
                    </div>
                    {r.status==="draft"&&(r._errs||[]).length>0&&<div style={{fontSize:9.5,color:T.err,maxWidth:340,textAlign:"right",lineHeight:1.5}}>{r._errs.slice(0,2).join(" · ")}{r._errs.length>2?` · +${r._errs.length-2} more`:""}</div>}
                    {r.status==="draft"&&r._ok&&!r.manager&&<div style={{fontSize:9.5,color:"#92400e"}}>Manager not selected</div>}
                  </div>}
              </td>
            </tr>;})}
        </tbody>
      </table>
    </Card>
    <div style={{fontSize:10.5,color:T.textMut,marginTop:10}}>Open a record to review imported data, complete missing fields, and send it to the manager for approval. Records migrate once approved.</div>
  </div>;
}

// SLA & Reminders (#13) — mirrors the Item Evaluation SLA setup
function SetupSLA({config,setConfig,showToast,onBack}){
  const upd=(num,k,v)=>setConfig(config.map(c=>c.num===num?{...c,[k]:v===""?null:Number(v)}:c));
  const thCell={padding:"10px 14px",fontSize:11,fontWeight:600,color:T.textSec,textAlign:"left",borderBottom:`1px solid ${T.border}`};
  const withSla=config.filter(c=>c.slaDays).length;
  const total=config.reduce((s,c)=>s+(c.slaDays||0),0);
  return <div style={{maxWidth:1600}}>
    <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:12}}>← Back to Setup</button>
    <h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:0}}>⏱️ SLA & Reminders</h1>
    <p style={{fontSize:12,color:T.textSec,margin:"4px 0 14px"}}>How long each step may sit before it is overdue, and how many days ahead the approver is reminded. Leave the SLA blank for steps that shouldn't be timed.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
      {[{l:"Steps with an SLA",v:`${withSla} of ${config.length}`,c:T.primary},{l:"Target end-to-end",v:`${total} days`,c:T.info},{l:"Reminder",v:"Daily once overdue",c:T.warn}].map((s,i)=>
        <Card key={i} style={{padding:"12px 14px",borderLeft:`4px solid ${s.c}`}}><div style={{fontSize:10,color:T.textMut,fontWeight:700,textTransform:"uppercase"}}>{s.l}</div><div style={{fontSize:17,fontWeight:700,color:s.c,marginTop:2}}>{s.v}</div></Card>)}
    </div>
    <div style={{padding:10,marginBottom:12,borderRadius:6,background:"#fffbeb",border:`1px solid ${T.warn}40`,fontSize:11,color:"#92400e"}}>Changes apply to <strong>requests already in flight</strong> as well as new ones — a shortened SLA can immediately mark open requests overdue.</div>
    <Card style={{padding:0,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:T.primaryLight}}>
          <th style={{...thCell,width:50,textAlign:"center"}}>Step</th>
          <th style={thCell}>Stage</th>
          <th style={{...thCell,width:150}}>SLA (days)</th>
          <th style={{...thCell,width:190}}>Remind this many days before</th>
        </tr></thead>
        <tbody>
          {config.map(c=><tr key={c.num} style={{borderTop:`1px solid ${T.borderLight}`}}>
            <td style={{padding:"8px 14px",textAlign:"center",fontSize:11,color:T.textMut}}>{c.num}</td>
            <td style={{padding:"8px 14px",fontSize:12,fontWeight:500,color:T.text}}>{c.label}</td>
            <td style={{padding:"6px 14px"}}><input type="number" min="0" style={{...inp,fontSize:12,padding:"6px 8px"}} value={c.slaDays==null?"":c.slaDays} onChange={e=>upd(c.num,"slaDays",e.target.value)} placeholder="none"/></td>
            <td style={{padding:"6px 14px"}}><input type="number" min="0" disabled={!c.slaDays} style={{...inp,fontSize:12,padding:"6px 8px",background:c.slaDays?"#fff":"#f3f4f6"}} value={c.remindBefore==null?"":c.remindBefore} onChange={e=>upd(c.num,"remindBefore",e.target.value)}/></td>
          </tr>)}
        </tbody>
      </table>
    </Card>
    <div style={{display:"flex",justifyContent:"flex-end",marginTop:14}}>
      <button onClick={()=>showToast&&showToast("SLA settings saved — open requests re-evaluated")} style={{padding:"9px 20px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>Save Settings</button>
    </div>
  </div>;
}


// Email Notifications config (Batch 7 #35)
function SetupEmails({config,setConfig,showToast,onBack}){
  const[editing,setEditing]=useState(null);
  const[draft,setDraft]=useState({});
  const thCell={padding:"10px 14px",fontSize:11,fontWeight:600,color:T.textSec,textAlign:"left",borderBottom:`1px solid ${T.border}`};
  const openEdit=e=>{setDraft({...e});setEditing(e.id);};
  const save=()=>{setConfig(config.map(c=>c.id===editing?{...c,...draft}:c));setEditing(null);showToast&&showToast("Email template updated");};
  const toggle=e=>setConfig(config.map(c=>c.id===e.id?{...c,active:c.active===false}:c));
  const actBtn={padding:"4px 10px",borderRadius:5,border:`1px solid ${T.border}`,background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",color:T.text,fontFamily:T.font};
  return <div style={{maxWidth:1600}}>
    <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:12}}>← Back to Setup</button>
    <h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:0}}>✉️ Email Notifications</h1>
    <p style={{fontSize:12,color:T.textSec,margin:"4px 0 14px"}}>Configure the auto-email sent for each event — recipients (To / CC) and the content. Placeholders: {"{id}"}, {"{version}"}.</p>
    <Card style={{padding:0,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:T.primaryLight}}>
          <th style={thCell}>Event</th><th style={thCell}>To</th><th style={thCell}>CC</th><th style={{...thCell,width:90,textAlign:"center"}}>Active</th><th style={{...thCell,width:80,textAlign:"right"}}>Edit</th>
        </tr></thead>
        <tbody>
          {config.map(e=><tr key={e.id} style={{borderTop:`1px solid ${T.borderLight}`,opacity:e.active!==false?1:0.5}}>
            <td style={{padding:"9px 14px",fontSize:12,fontWeight:500,color:T.text}}>{e.event}</td>
            <td style={{padding:"9px 14px",fontSize:11,color:T.textSec}}>{e.to||"—"}</td>
            <td style={{padding:"9px 14px",fontSize:11,color:T.textSec}}>{e.cc||"—"}</td>
            <td style={{padding:"9px 14px",textAlign:"center"}}><span onClick={()=>toggle(e)} style={{cursor:"pointer",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:12,background:e.active!==false?"#dcfce7":"#f3f4f6",color:e.active!==false?T.ok:T.textMut}}>{e.active!==false?"On":"Off"}</span></td>
            <td style={{padding:"9px 14px",textAlign:"right"}}><button onClick={()=>openEdit(e)} style={actBtn}>✎ Edit</button></td>
          </tr>)}
        </tbody>
      </table>
    </Card>
    {editing!=null&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}} onClick={()=>setEditing(null)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:10,padding:22,width:520,maxWidth:"100%",maxHeight:"90vh",overflow:"auto",boxShadow:"0 10px 40px rgba(0,0,0,0.2)"}}>
        <ST style={{fontSize:15,color:T.primary,marginBottom:14}}>Edit Email — {draft.event}</ST>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div><label style={lbl}>To</label><input style={inp} value={draft.to||""} onChange={e=>setDraft({...draft,to:e.target.value})} placeholder="e.g. CMO; CSCM"/></div>
          <div><label style={lbl}>CC</label><input style={inp} value={draft.cc||""} onChange={e=>setDraft({...draft,cc:e.target.value})} placeholder="e.g. CNO"/></div>
        </div>
        <label style={lbl}>Subject</label>
        <input style={{...inp,marginBottom:12}} value={draft.subject||""} onChange={e=>setDraft({...draft,subject:e.target.value})}/>
        <label style={lbl}>Body</label>
        <textarea style={{...inp,height:110,resize:"vertical",fontFamily:T.font,marginBottom:16}} value={draft.body||""} onChange={e=>setDraft({...draft,body:e.target.value})}/>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
          <button onClick={()=>setEditing(null)} style={{padding:"8px 16px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
          <button onClick={save} style={{padding:"8px 18px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Save</button>
        </div>
      </div>
    </div>}
  </div>;
}
