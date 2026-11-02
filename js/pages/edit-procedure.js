// ═══════════════════════════════════════════════════════════════
// EDIT PROCEDURE — with Save→Confirm two-step
// ═══════════════════════════════════════════════════════════════
function EditProc({proc:p,me,onBack,onSubmit,opSkills=OP_SKILLS_DEFAULT,categories=MASTER_CATEGORIES}){
  const toArr=v=>v?(typeof v==="string"?v.split(";").map(s=>s.trim()).filter(Boolean):(Array.isArray(v)?v:[""])):[""];
  const[fd,setFd]=useState({accommodationDays:p.accommodationDays,procedureDuration:p.procedureDuration,suggestedPrice:p.financial?.finalPatientPrice||p.suggestedPrice||"",patientType:p.patientType||"",anesthesia:p.anesthesia||"",gender:p.gender||"",opSkill:p.opSkill||""});
  const[manpower,setManpower]=useState(toArr(p.manpower));
  const[machines,setMachines]=useState(toArr(p.machinesDevices));
  const[consDrugs,setConsDrugs]=useState(toArr(p.consumablesDrugs));
  const[labRad,setLabRad]=useState(toArr(p.labRadiology));
  const[procCons,setProcCons]=useState(p.templates?.procCons||[]);
  const[wardsCons,setWardsCons]=useState(p.templates?.wardsCons||[]);
  const[procDrugs,setProcDrugs]=useState(p.templates?.procDrugs||[]);
  const[wardsDrugs,setWardsDrugs]=useState(p.templates?.wardsDrugs||[]);
  const[activeTpl,setActiveTpl]=useState("procCons");
  const[attachments,setAttachments]=useState(p.attachments||[]);
  const[step,setStep]=useState("fill");
  const upd=(k,v)=>setFd(pr=>({...pr,[k]:v}));
  const buildOut=()=>({...fd,manpower:manpower.filter(Boolean).join("; "),machinesDevices:machines.filter(Boolean).join("; "),consumablesDrugs:consDrugs.filter(Boolean).join("; "),labRadiology:labRad.filter(Boolean).join("; "),templates:{procCons,wardsCons,procDrugs,wardsDrugs},attachments});

  // Review/Confirm step — rich layout like New Procedure
  if(step==="confirm"){
    const splitList=(arr)=>arr.filter(Boolean).map(s=>s.trim());
    // Batch 5 (#31): show old → new for changed fields
    const oldNew=(l,oldv,newv,fmt=x=>x)=>{const o=(oldv==null||oldv==="")?"—":String(fmt(oldv));const n=(newv==null||newv==="")?"—":String(fmt(newv));const chg=o!==n;return {l,v:chg?`${o} → ${n}`:n,chg};};
    const mpItems=splitList(manpower);
    const mdItems=splitList(machines);
    const cdItems=splitList(consDrugs);
    const lrItems=splitList(labRad);
    return<div style={{maxWidth:1600}}>
      <button onClick={()=>setStep("fill")} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:12}}>← Back to Edit</button>
      <ST color={T.primary} style={{fontSize:18}}>Confirm Edit — Procedure #{p.id} → V{p.version+1}</ST>
      <p style={{fontSize:12,color:T.textSec,margin:"-12px 0 16px"}}>Review changes below and press "Confirm" to submit V{p.version+1}.</p>

      {/* Section 1: Basic info + Locked fields */}
      <Card style={{marginBottom:14,padding:20}}>
        <ST style={{fontSize:13,color:T.primary,marginBottom:12}}>Procedure Info (locked & changed values)</ST>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 24px"}}>
          {[
            {l:"Procedure ID",v:p.id,locked:true},
            {l:"Version",v:`V${p.version} → V${p.version+1}`},
            {l:"Specialty",v:p.specialty,locked:true},
            {l:"CPT Code",v:p.accurateCptCode||p.proposedCptCode,locked:true},
            {l:"CPT Name",v:p.accurateCptName||p.proposedCptName,locked:true},
            {l:"PKGID",v:p.systemSetup?.pkgId||"—",locked:true},
            {l:"Operation Code",v:p.systemSetup?.opCode||"—",locked:true},
            {l:"Branch",v:BRANCHES.find(b=>b.code===p.branch)?.name||p.branch,locked:true},
            oldNew("Patient Type",p.patientType,fd.patientType),
            oldNew("Anesthesia Requirement",p.anesthesia,fd.anesthesia),
            oldNew("Gender",p.gender,fd.gender),
            oldNew("Operation Skill",p.opSkill,fd.opSkill),
            oldNew("Accommodation Days",p.accommodationDays,fd.accommodationDays,x=>x+" days"),
            oldNew("Surgery Duration",p.procedureDuration,fd.procedureDuration,x=>x+" hrs"),
            oldNew("Final Patient Price",p.financial?.finalPatientPrice||p.suggestedPrice,fd.suggestedPrice,fmtKWD),
          ].map((it,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.borderLight}`,background:it.chg?"#fffbeb":"transparent"}}>
            <span style={{fontSize:12,color:T.textSec}}>{it.l} {it.locked&&<span style={{fontSize:9,color:T.textMut,marginLeft:4,display:"inline-flex"}}><Ic n="lock" s={10}/></span>}{it.chg&&<span style={{fontSize:9,color:T.warn,fontWeight:700,marginLeft:6,padding:"1px 6px",background:"#fff7ed",borderRadius:8}}>CHANGED</span>}</span>
            <span style={{fontSize:12,fontWeight:it.chg?700:500,color:it.chg?T.warn:T.text,textAlign:"right",maxWidth:"60%"}}>{it.v||"—"}</span>
          </div>)}
        </div>
      </Card>

      {/* Section 2: LOS & Services */}
      <Card style={{marginBottom:14,padding:20}}>
        <ST style={{fontSize:13,color:T.primary,marginBottom:12}}>LOS & Services Updates</ST>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[
            {l:"Man Power",icon:"users",items:mpItems,c:T.purple,bg:"#faf5ff"},
            {l:"Machines & Devices",icon:"wrench",items:mdItems,c:T.info,bg:"#eff6ff"},
            {l:"Major Consumables & Drugs",icon:"pill",items:cdItems,c:"#7c3aed",bg:"#f5f3ff"},
            {l:"Lab & Radiology Needs",icon:"microscope",items:lrItems,c:T.teal||"#0d9488",bg:"#f0fdfa"},
          ].map((f,i)=><div key={i} style={{padding:0,background:"#fff",borderRadius:8,border:`1px solid ${T.borderLight}`,borderLeft:`3px solid ${f.c}`,overflow:"hidden",display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:f.bg,borderBottom:`1px solid ${T.borderLight}`}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <Ic n={f.icon} s={13}/>
                <span style={{fontSize:11,color:f.c,fontWeight:700,textTransform:"uppercase",letterSpacing:0.3}}>{f.l}</span>
              </div>
              <span style={{fontSize:10,color:T.textMut,fontWeight:600,padding:"2px 8px",background:"#fff",borderRadius:10,border:`1px solid ${T.border}`}}>{f.items.length} {f.items.length===1?"item":"items"}</span>
            </div>
            <div style={{padding:"10px 14px",maxHeight:200,overflowY:"auto",flex:1}}>
              {f.items.length===0?<div style={{fontSize:11,color:T.textMut,fontStyle:"italic",padding:"6px 0"}}>Not specified</div>:
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {f.items.map((it,j)=><div key={j} style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:11,color:T.text,padding:"3px 0",borderBottom:j<f.items.length-1?`1px dashed ${T.borderLight}`:"none"}}>
                  <span style={{color:f.c,fontWeight:700,minWidth:20,fontSize:10,background:f.bg,borderRadius:3,padding:"1px 5px",textAlign:"center"}}>{j+1}</span>
                  <span style={{flex:1,lineHeight:1.4}}>{it}</span>
                </div>)}
              </div>}
            </div>
          </div>)}
        </div>
      </Card>

      {/* Section 3: OT Templates */}
      <Card style={{marginBottom:14,padding:20}}>
        <ST style={{fontSize:13,color:T.primary,marginBottom:12}}>OT Templates</ST>
        <TemplateSummary templates={{procCons,wardsCons,procDrugs,wardsDrugs}} defaultExpand/>
      </Card>

      <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
        <button onClick={()=>setStep("fill")} style={{padding:"9px 20px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,cursor:"pointer",fontFamily:T.font}}>← Back to Edit</button>
        <button onClick={()=>{const o=buildOut();const t=o.templates||{procCons,wardsCons,procDrugs,wardsDrugs};const miss=tplMissingUom(t);if(miss){alert(`${miss} template item(s) have no UOM selected. Choose a UOM for every item before submitting.`);return;}onSubmit(o);}} style={{padding:"10px 24px",borderRadius:6,border:"none",background:T.ok,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>✓ Confirm Edit V{p.version+1}</button>
      </div>
    </div>;
  }

  // Edit step — main fill form
  const tplCards=[
    {k:"procCons",t:"Procedure Consumables",items:procCons,setItems:setProcCons,master:CONS_MASTER,req:true,icon:"building"},
    {k:"wardsCons",t:"Wards Consumables",items:wardsCons,setItems:setWardsCons,master:CONS_MASTER,icon:"bed"},
    {k:"procDrugs",t:"Procedure Drugs",items:procDrugs,setItems:setProcDrugs,master:DRUGS_MASTER,req:true,icon:"pill"},
    {k:"wardsDrugs",t:"Wards Drugs",items:wardsDrugs,setItems:setWardsDrugs,master:DRUGS_MASTER,icon:"syringe"},
  ];
  const activeTplCard=tplCards.find(c=>c.k===activeTpl)||tplCards[0];
  const tplGrandTotal=tplCards.reduce((s,c)=>s+c.items.reduce((s2,i)=>s2+(i.totalCost||0),0),0);

  return<div style={{maxWidth:1600}}>
    <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,marginBottom:12}}>← Back to Approved</button>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
      <div>
        <ST color={T.primary} style={{fontSize:18,marginBottom:4}}>Edit Procedure #{p.id}</ST>
        <p style={{fontSize:12,color:T.textSec,margin:0}}>Current: V{p.version} · Will create new V{p.version+1} after approval chain</p>
      </div>
      <div style={{padding:"6px 12px",background:"#fffbeb",border:`1px solid ${T.warn}40`,borderRadius:8,fontSize:11,color:T.warn,fontWeight:600}}>Edit Mode</div>
    </div>

    {/* Locked Fields - prominent reference card */}
    <Card style={{marginBottom:16,padding:16,background:"linear-gradient(135deg,#f8fafc,#fff)",border:`1px solid ${T.border}`}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
        <Ic n="lock" s={13}/>
        <ST style={{fontSize:13,color:T.textSec,margin:0}}>Locked Fields (cannot be changed in this version)</ST>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
        {[["Specialty",p.specialty],["CPT Code",p.accurateCptCode||p.proposedCptCode],["CPT Name",(p.accurateCptName||p.proposedCptName||"").slice(0,22)],["PKGID",p.systemSetup?.pkgId||"—"],["Operation Code",p.systemSetup?.opCode||"—"]].map(([l,v],i)=>
          <div key={i} style={{padding:"8px 10px",background:"#fff",borderRadius:6,border:`1px solid ${T.border}`}}><div style={{fontSize:9,color:T.textMut,fontWeight:600,textTransform:"uppercase",marginBottom:2}}>{l}</div><div style={{fontSize:11,fontWeight:600,color:T.text}}>{v}</div></div>)}
      </div>
    </Card>

    {/* Changeable: numeric/single fields */}
    <Card style={{marginBottom:16,padding:20}}>
      <ST style={{fontSize:14,color:T.primary,marginBottom:12}}>Changeable Fields</ST>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
        <div><label style={lbl}>Patient Type <span style={{color:T.err}}>*</span></label><Select style={inp} value={fd.patientType} onChange={e=>upd("patientType",e.target.value)}><option value="">Select...</option>{PATIENT_TYPES.map(o=><option key={o} value={o}>{o}</option>)}</Select></div>
        <div><label style={lbl}>Anesthesia Requirement <span style={{color:T.err}}>*</span></label><Select style={inp} value={fd.anesthesia} onChange={e=>upd("anesthesia",e.target.value)}><option value="">Select...</option>{ANESTHESIA_OPTS.map(o=><option key={o} value={o}>{o}</option>)}</Select></div>
        <div><label style={lbl}>Gender <span style={{color:T.err}}>*</span></label><Select style={inp} value={fd.gender} onChange={e=>upd("gender",e.target.value)}><option value="">Select...</option>{GENDER_OPTS.map(o=><option key={o} value={o}>{o}</option>)}</Select></div>
        <div><label style={lbl}>Operation Skill <span style={{color:T.err}}>*</span></label><Select style={inp} value={fd.opSkill} onChange={e=>upd("opSkill",e.target.value)}><option value="">Select...</option>{opSkills.filter(o=>o.isActive!==false).map(o=><option key={o.id} value={o.title}>{o.title}</option>)}</Select></div>
        <div><label style={lbl}>Accommodation Days</label><input type="number" min="0" style={inp} value={fd.accommodationDays} onChange={e=>upd("accommodationDays",e.target.value)}/></div>
        <DurationPicker label="Surgery Duration" value={fd.procedureDuration} onChange={v=>upd("procedureDuration",v)}/>
        <KWDInput label="Final Patient Price" value={fd.suggestedPrice} onChange={v=>upd("suggestedPrice",v)}/>
      </div>
    </Card>

    {/* LOS & Services */}
    <Card style={{marginBottom:16,padding:20}}>
      <ST style={{fontSize:14,color:T.primary,marginBottom:12}}>LOS & Services</ST>
      <ListCard title="Man Power Details" items={manpower} onChange={setManpower} placeholder="e.g. 1 Surgeon, 1 Anesthetist..."/>
      <ListCard title="Machines & Devices" items={machines} onChange={setMachines} placeholder="e.g. Arthroscopy tower..."/>
      <ListCard title="Major Consumables & Drugs" items={consDrugs} onChange={setConsDrugs} placeholder="e.g. Knee implant system..."/>
      <ListCard title="Lab & Radiology Needs" items={labRad} onChange={setLabRad} placeholder="e.g. X-ray, CBC..."/>
    </Card>

    <Card style={{marginBottom:16,padding:20}}>
      <ST style={{fontSize:14,color:T.primary,marginBottom:12}}>Attachments</ST>
      <AttachmentBox step="Edit Request" by={me.name} lockExisting existingCount={(p.attachments||[]).length} files={attachments} onChange={setAttachments}/>
    </Card>

    {/* OT Templates - tabbed builder same as New flow */}
    <Card style={{marginBottom:16,padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <ST style={{fontSize:14,color:T.primary,margin:0}}>OT Templates — Edit / Add / Remove Items</ST>
        <div style={{fontSize:10,color:T.textMut,padding:"3px 10px",background:"#f8fafc",borderRadius:10,border:`1px solid ${T.border}`}}>4 cards</div>
      </div>
      <div style={{background:"#eff6ff",padding:10,borderRadius:6,marginBottom:14,fontSize:11,color:T.info}}>Click a tab to view/edit each template. Existing items are preserved from V{p.version}. Add, modify quantities, or remove items as needed.</div>
      {/* Tab strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
        {tplCards.map(c=>{const tot=c.items.reduce((s,i)=>s+(i.totalCost||0),0);const isActive=activeTpl===c.k;
          return<div key={c.k} onClick={()=>setActiveTpl(c.k)} style={{padding:"10px 12px",borderRadius:"10px 10px 0 0",cursor:"pointer",
            background:isActive?"#fff":"#f8fafc",
            border:isActive?`2px solid ${c.items.length>0?T.ok:c.req?T.err:T.border}`:`1px solid ${T.border}`,
            borderBottom:isActive?"2px solid #fff":"1px solid "+T.border,
            marginBottom:isActive?-2:0,position:"relative",zIndex:isActive?1:0}}>
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
      <div style={{border:`2px solid ${activeTplCard.items.length>0?T.ok:activeTplCard.req?T.err:T.border}`,borderRadius:"0 0 10px 10px",borderTop:"none",background:"#fff"}}>
        <div style={{padding:"8px 14px",display:"flex",justifyContent:"flex-end",alignItems:"center",borderBottom:`1px solid ${T.borderLight}`,background:"#fafbfc"}}>
          <span style={{fontSize:11,fontWeight:600,color:T.primary}}>{activeTplCard.icon} {activeTplCard.t} · {activeTplCard.items.length} items</span>
        </div>
        <div style={{padding:12}}>
          <GroupedTemplateBuilder items={activeTplCard.items} setItems={activeTplCard.setItems} master={activeTplCard.master} categories={categories}/>
        </div>
        <table style={{display:"none"}}>
          <thead><tr style={{background:T.primaryLight}}>
            <th style={{...th,width:30,textAlign:"center"}}>#</th>
            <th style={{...th,minWidth:130,textAlign:"left"}}>Item Code</th>
            <th style={{...th,minWidth:180,textAlign:"left"}}>Item Name</th><th style={{...th,minWidth:130,background:"#faf5ff"}}>Category / Sub-cat</th>
            <th style={{...th,minWidth:85}}>UOM</th>
            <th style={{...th,width:55}}>Qty</th>
            <th style={{...th,width:95,background:"#e8f5e9"}}>Unit Cost</th>
            <th style={{...th,width:100,background:"#e8f5e9"}}>Total</th><th style={{...th,width:90,background:"#eef7ff"}}>Sale Price</th><th style={{...th,width:95,background:"#eef7ff"}}>Total Sale</th><th style={{...th,minWidth:110,background:"#eef7ff"}}>Last Updated</th>
            <th style={{...th,width:30}}></th>
          </tr></thead>
          <tbody>
            {activeTplCard.items.map((row,idx)=><tr key={idx} style={{borderBottom:`1px solid ${T.borderLight}`,background:idx%2===1?"#f8fafb":"#fff"}}>
              <td style={{...td,fontWeight:600,color:T.primary,textAlign:"center",fontSize:10}}>{idx+1}</td>
              <td style={{...td,textAlign:"left",padding:"4px 6px",position:"relative",overflow:"visible"}}><AutoComplete value={row.code} onChange={v=>{const u=[...activeTplCard.items];const r={...u[idx]};if(typeof v==="object"&&v.code){r.code=v.code;r.name=v.name;r.uoms=v.uoms;r.cat=v.cat;r.sub=v.sub;if(v.uoms.length===1){r.uom=v.uoms[0].unit;r.unitCost=v.uoms[0].cost;r.totalCost=v.uoms[0].cost*r.qty;}else{r.uom="";r.unitCost=0;r.totalCost=0;}}else{r.code=v;}u[idx]=r;activeTplCard.setItems(u);}} options={activeTplCard.master} placeholder="Code..." displayFn={m=>m.code} filterFn={(m,q2)=>m.code.toLowerCase().includes(q2.toLowerCase())}/></td>
              <td style={{...td,textAlign:"left",padding:"4px 6px",position:"relative",overflow:"visible"}}><AutoComplete value={row.name} onChange={v=>{const u=[...activeTplCard.items];const r={...u[idx]};if(typeof v==="object"&&v.code){r.code=v.code;r.name=v.name;r.uoms=v.uoms;r.cat=v.cat;r.sub=v.sub;if(v.uoms.length===1){r.uom=v.uoms[0].unit;r.unitCost=v.uoms[0].cost;r.totalCost=v.uoms[0].cost*r.qty;}else{r.uom="";r.unitCost=0;r.totalCost=0;}}else{r.name=v;}u[idx]=r;activeTplCard.setItems(u);}} options={activeTplCard.master} placeholder="Item name..." displayFn={m=>m.name} filterFn={(m,q2)=>m.name.toLowerCase().includes(q2.toLowerCase())}/></td><td style={{...td,fontSize:9,color:T.purple,padding:"4px 6px"}}><div style={{fontWeight:600}}>{itemMeta(row.code).cat||row.cat||"—"}</div><div style={{color:T.textMut}}>{(itemMeta(row.code).sub||row.sub)?"↳ "+(itemMeta(row.code).sub||row.sub):""}</div></td>
              <td style={{...td,padding:"4px 4px"}}><Select style={{...inp,fontSize:10,padding:"5px 3px"}} value={row.uom} onChange={e=>{const u=[...activeTplCard.items];const r={...u[idx]};r.uom=e.target.value;const ud=r.uoms?.find(u2=>u2.unit===e.target.value);r.unitCost=ud?ud.cost:0;r.totalCost=r.unitCost*r.qty;u[idx]=r;activeTplCard.setItems(u);}}><option value="">UOM</option>{(row.uoms||[]).map(u2=><option key={u2.unit} value={u2.unit}>{u2.unit}</option>)}</Select></td>
              <td style={{...td,padding:"4px 4px"}}><input type="number" min="1" value={row.qty} onChange={e=>{const u=[...activeTplCard.items];const r={...u[idx]};r.qty=Math.max(1,parseInt(e.target.value)||1);r.totalCost=r.unitCost*r.qty;u[idx]=r;activeTplCard.setItems(u);}} style={{...inp,width:45,textAlign:"center",padding:"5px",fontSize:11}}/></td>
              <td style={{...td,fontWeight:500,color:T.textSec,fontSize:10,background:idx%2===1?"#f0f7f1":"#f5faf6"}}>{fmtKWD(row.unitCost)}</td>
              <td style={{...td,fontWeight:700,color:T.primary,fontSize:11,background:idx%2===1?"#f0f7f1":"#f5faf6"}}>{fmtKWD(row.totalCost)}</td><td style={{...td,color:T.ok,fontSize:10,background:idx%2===1?"#eef7ff":"#f5fbff"}}>{(()=>{const s=row.salePrice!=null?row.salePrice:saleForUom(row.code,row.uom);return s!=null?fmtKWD(s):"—";})()}</td><td style={{...td,color:T.ok,fontWeight:700,fontSize:11,background:idx%2===1?"#eef7ff":"#f5fbff"}}>{(()=>{const s=row.salePrice!=null?row.salePrice:saleForUom(row.code,row.uom);return s!=null?fmtKWD(s*(row.qty||0)):"—";})()}</td><td style={{...td,color:T.textMut,fontSize:9,whiteSpace:"nowrap"}}>{itemMeta(row.code).updated||"—"}</td>
              <td style={{...td,padding:"4px"}}><span onClick={()=>activeTplCard.setItems(activeTplCard.items.filter((_,i2)=>i2!==idx))} style={{cursor:"pointer",color:T.err,fontWeight:700,fontSize:13,opacity:0.7}}>✕</span></td>
            </tr>)}
            {activeTplCard.items.length===0&&<tr><td colSpan={12} style={{padding:30,textAlign:"center",color:T.textMut,fontSize:12}}>No items yet — click <strong>+ Add Item</strong> to start building this template</td></tr>}
            {/* Sub-Total row */}
            {activeTplCard.items.length>0&&<tr style={{background:"#eff6ff",borderTop:`2px solid ${T.info}`,fontWeight:700}}>
              <td colSpan={7} style={{...td,textAlign:"right",fontSize:12,color:T.info,padding:"10px 12px"}}>{activeTplCard.t} — List Total ({activeTplCard.items.length} items)</td>
              <td style={{...td,textAlign:"left",fontSize:14,fontWeight:700,color:T.info,padding:"10px 12px"}}>{fmtKWD(activeTplCard.items.reduce((s,i)=>s+(i.totalCost||0),0))}</td>
              <td style={{...td}}></td>
              <td style={{...td,textAlign:"left",fontSize:13,fontWeight:700,color:T.ok,padding:"10px 12px"}}>{fmtKWD(activeTplCard.items.reduce((s,i)=>{const sp=i.salePrice!=null?i.salePrice:saleForUom(i.code,i.uom);return s+(sp!=null?sp*(i.qty||0):0);},0))}</td>
              <td colSpan={2} style={{...td}}></td>
            </tr>}
          </tbody>
        </table>
      </div>
      {tplGrandTotal>0&&<div style={{padding:"12px 16px",background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",borderRadius:8,border:`2px solid ${T.ok}40`,marginTop:12}}>
        <div style={{fontSize:10,color:T.ok,fontWeight:700,textTransform:"uppercase",letterSpacing:0.4,marginBottom:6}}>All Templates Total (Proc + Wards)</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr) auto",gap:8,alignItems:"center"}}>
          {tplCards.map(c=>{const tot=c.items.reduce((s,i)=>s+(i.totalCost||0),0);return<div key={c.k} style={{padding:"4px 8px",fontSize:10}}><div style={{color:T.textMut,display:"flex",alignItems:"center",gap:4}}><Ic n={c.icon} s={10}/>{c.t}</div><div style={{fontSize:12,fontWeight:700,color:tot>0?T.primary:T.textMut}}>{fmtKWD(tot)}</div></div>;})}
          <div style={{padding:"6px 14px",background:T.ok,borderRadius:6,color:"#fff",textAlign:"right"}}><div style={{fontSize:9,opacity:0.9}}>GRAND TOTAL</div><div style={{fontSize:15,fontWeight:800}}>{fmtKWD(tplGrandTotal)}</div></div>
        </div>
      </div>}
    </Card>

    <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}>
      <button onClick={onBack} style={{padding:"9px 20px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,cursor:"pointer",fontFamily:T.font}}>Cancel</button>
      <button onClick={()=>setStep("confirm")} style={{padding:"10px 24px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>Review →</button>
    </div>
  </div>;
}
