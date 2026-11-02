// ═══════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════
const Badge=({children,color,bg,style:s={}})=><span style={{display:"inline-flex",alignItems:"center",padding:"3px 10px",borderRadius:12,fontSize:11,fontWeight:600,background:bg||(color+"15"),color:color||T.text,letterSpacing:0.2,whiteSpace:"nowrap",...s}}>{children}</span>;
const SBadge=({status})=>{const s=STATUS[status]||{label:status,c:"#6b7280",bg:"#f3f4f6"};return<Badge color={s.c} bg={s.bg}>{s.label}</Badge>;};
// ─── ENTERPRISE ICON SYSTEM (Lucide-style, stroke=currentColor) ───
const IC_PATHS={
  zap:"M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  paperclip:"m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48",
  inboxIn:"M22 12h-6l-2 3h-4l-2-3H2 M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
  fileText:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z M14 2v4a2 2 0 0 0 2 2h4 M10 9H8 M16 13H8 M16 17H8",
  ban:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M4.9 4.9l14.2 14.2",
  rotateCcw:"M3 12a9 9 0 1 0 3-6.7L3 8 M3 3v5h5",
  swap:"M8 3 4 7l4 4 M4 7h16 M16 21l4-4-4-4 M20 17H4",
  clipboard:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z M9 12h6 M9 16h6",
  building:"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4 M10 10h4 M10 14h4 M10 18h4",
  coins:"M8 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M18.09 10.37A6 6 0 1 1 10.34 18 M7 6h1v4 M16.71 13.88l.7.71-2.82 2.82",
  clock:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2",
  star:"m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  x:"M18 6 6 18 M6 6l12 12",
  check:"M20 6 9 17l-5-5",
  forward:"m15 14 5-5-5-5 M20 9H9.5A5.5 5.5 0 0 0 4 14.5V18",
  pencil:"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z M15 5l4 4",
  chevDown:"m6 9 6 6 6-6",
  search:"M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3",
  bell:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0",
  settings:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  chart:"M3 3v16a2 2 0 0 0 2 2h16 M18 17V9 M13 17V5 M8 17v-3",
  pill:"m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z M8.5 8.5l7 7",
  lock:"M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z M7 11V7a5 5 0 0 1 10 0v4",
  filePen:"M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5 M14 2v4a2 2 0 0 0 2 2h4 M13.38 12.62a1 1 0 0 1 3 3L9 23l-4 1 1-4Z",
  folder:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
  download:"M12 15V3 M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5",
  plus:"M5 12h14 M12 5v14",
  more:"M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  alert:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3 M12 9v4 M12 17h.01",
  user:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  shieldCheck:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z m-11 -1 2 2 4-4",
  send:"M14.54 9.46 3.5 20.5 M20.5 3.5l-6 17-3.96-8.04L2.5 8.5l18-5z",
  layers:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z M2 12l8.58 3.91a2 2 0 0 0 1.66 0L22 12 M2 17l8.58 3.91a2 2 0 0 0 1.66 0L22 17",
  home:"m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  arrowRight:"M5 12h14 M12 5l7 7-7 7",
  wrench:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  microscope:"M6 18h8 M3 22h18 M14 22a7 7 0 1 0 0-14h-1 M9 14h2 M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3",
  users:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  bed:"M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9",
  syringe:"m18 2 4 4 M17 7l3-3 M19 9 9.7 18.3a2.4 2.4 0 0 1-3.4 0L5 17a2.4 2.4 0 0 1 0-3.4L14.3 4.3 M9 11l4 4 M5 19l-3 3 M14 4l6 6",
  eye:"M2.06 12.35a1 1 0 0 1 0-.7C3.42 8.1 7.22 5 12 5s8.58 3.1 9.94 6.65a1 1 0 0 1 0 .7C20.58 15.9 16.78 19 12 19s-8.58-3.1-9.94-6.65Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
};
const Ic=({n,s=14,sw=2,style:st={}})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,verticalAlign:"-2px",...st}}>{String(IC_PATHS[n]||"").split(" M").map((d,i)=><path key={i} d={(i>0?"M":"")+d}/>)}</svg>;
const Card=({children,style:s={},onClick})=><div onClick={onClick} style={{background:T.cardBg,borderRadius:8,padding:20,border:`1px solid ${T.border}`,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",...s}}>{children}</div>;
const ST=({children,color=T.primary,style:s={}})=><h3 style={{fontSize:14,fontWeight:700,color,margin:"0 0 16px",fontFamily:T.font,...s}}>{children}</h3>;
const BTN={padding:"9px 20px",borderRadius:8,border:"none",fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:7};
const BTN2={...BTN,background:"#fff",fontWeight:600};
const ActionBar=({label,me,children,comment,more=[],icon="zap",sub})=>(
  <React.Fragment><div style={{height:78}}/><div data-tour="actionbar" style={{position:"fixed",bottom:0,left:200,right:0,zIndex:60,background:"#fff",borderTop:`1px solid ${T.border}`,boxShadow:"0 -8px 24px rgba(15,23,42,0.12)",padding:"12px 80px 12px 24px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
    <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0,flex:"1 1 200px"}}>
      <Ic n={icon} s={15} style={{color:icon==="zap"?T.warn:T.textMut}}/>
      <div style={{minWidth:0}}>
        <div style={{fontSize:12.5,fontWeight:700,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{label}</div>
        <div style={{fontSize:10.5,color:T.textMut}}>{sub||("Acting as "+me.name+" · "+me.title)}</div>
      </div>
    </div>
    {comment}
    <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
      {more.map((it,ix)=><button key={"m"+ix} onClick={it.fn} style={{...BTN2,border:`1px solid ${T.border}`,color:T.textSec}}><Ic n={it.ic} s={13}/>{it.l}</button>)}
      {children}
    </div>
  </div></React.Fragment>
);
function useSort(defK,defD=1){
  const[sk,setSk]=useState(defK);const[sd,setSd]=useState(defD);
  const TH=({k,children,align})=><th onClick={()=>{if(sk===k)setSd(d=>-d);else{setSk(k);setSd(1);}}} style={{padding:"10px 14px",fontSize:10.5,fontWeight:800,color:sk===k?T.primary:T.textSec,textTransform:"uppercase",letterSpacing:0.4,textAlign:align||"left",cursor:"pointer",userSelect:"none",whiteSpace:"nowrap",borderBottom:`1px solid ${T.border}`}}>{children}<span style={{marginLeft:4,fontSize:9,opacity:sk===k?1:0.28}}>{sk===k?(sd>0?"▲":"▼"):"↕"}</span></th>;
  const sortRows=(rows,get)=>[...rows].sort((a,b)=>{const f=get[sk];if(!f)return 0;const x=f(a),y=f(b);return (x<y?-1:x>y?1:0)*sd;});
  return{TH,sortRows};
}
const SecHead=({n,t,sub,c=T.primary})=><div style={{display:"flex",alignItems:"center",gap:10,margin:"20px 0 12px"}}><span style={{width:24,height:24,borderRadius:"50%",background:c,color:"#fff",fontSize:11.5,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{n}</span><div><div style={{fontSize:13,fontWeight:800,color:T.text,letterSpacing:0.2}}>{t}</div>{sub&&<div style={{fontSize:10.5,color:T.textMut,marginTop:1}}>{sub}</div>}</div></div>;
const TILE={padding:"12px 14px",background:"#f8fafc",border:`1px solid ${T.border}`,borderRadius:10,cursor:"pointer"};
const TILE_H={display:"flex",alignItems:"center",gap:6,fontSize:10.5,fontWeight:700,color:T.textSec,textTransform:"uppercase",letterSpacing:0.4};
const TILE_V={fontSize:13,fontWeight:700,color:T.text,marginTop:6};
const TILE_L={fontSize:10.5,fontWeight:600,color:T.primary,marginTop:4};
const PANEL={background:"#f8fafc",border:`1px solid ${T.border}`,borderRadius:10,padding:18};
const PanelHead=({title,sub})=>(
  <div style={{marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${T.borderLight}`}}>
    <div style={{display:"inline-flex",alignItems:"center",gap:7,fontSize:10,fontWeight:800,letterSpacing:0.7,textTransform:"uppercase",color:T.warn}}>
      <span style={{width:7,height:7,borderRadius:"50%",background:T.warn,boxShadow:`0 0 0 3px ${T.warn}22`}}></span>Requires your decision
    </div>
    <div style={{fontSize:15.5,fontWeight:700,color:T.text,marginTop:9}}>{title}</div>
    {sub&&<div style={{fontSize:12,color:T.textSec,marginTop:4,lineHeight:1.5}}>{sub}</div>}
  </div>
);
// PHASE 2 marker — the three items proposed for Phase 2 are built and usable here, but tagged
// at their entry points so scope is unambiguous in client discussions:
//   1. Deactivation request   2. Reactivation request   3. Value Anomalies report
const P2Tag=({style:s={}})=><span style={{display:"inline-flex",alignItems:"center",padding:"2px 7px",borderRadius:10,fontSize:9,fontWeight:800,letterSpacing:0.4,background:"#faf5ff",color:T.purple,border:`1px solid ${T.purple}40`,whiteSpace:"nowrap",...s}}>PHASE 2</span>;
const Av=({user,size=28,color=T.primary})=><div style={{width:size,height:size,borderRadius:"50%",background:color+"18",color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.35,fontWeight:700,flexShrink:0}}>{(user?.name||"?").split(" ").map(n=>n[0]).join("").slice(0,2)}</div>;


// ─── SYNCED FIELD: Shows requestor value + editable input ────
function SyncedField({label,reqValue,value,onChange,required,type="text",placeholder}){
  return<div>
    <label style={lbl}>{label}{required&&<span style={{color:T.err}}> *</span>}</label>
    {reqValue&&<div style={{fontSize:10.5,color:T.textMut,marginBottom:5,display:"flex",alignItems:"center",gap:5}}><Ic n="user" s={10}/>Doctor entered: <strong>{reqValue}</strong></div>}
    {type==="textarea"?<textarea style={{...inp,height:50,resize:"vertical",fontFamily:T.font}} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
    :type==="duration"?<div style={{display:"flex",gap:8,alignItems:"center"}}><input type="number" min="0" max="23" style={{...inp,width:60,textAlign:"center"}} value={(value||"").split(":")[0]||""} onChange={e=>onChange(e.target.value+":"+(value||"0:00").split(":")[1]||"00")} placeholder="HH"/><span style={{fontWeight:600}}>:</span><input type="number" min="0" max="59" style={{...inp,width:60,textAlign:"center"}} value={(value||"").split(":")[1]||""} onChange={e=>onChange(((value||"0:00").split(":")[0]||"0")+":"+e.target.value)} placeholder="MM"/><span style={{fontSize:10,color:T.textMut}}>Hours : Minutes</span></div>
    :type==="kwd"?<input type="number" step="0.001" style={inp} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"0.000"}/>
    :<input type={type} style={inp} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>}
  </div>;
}

// ─── DURATION PICKER (HH:MM) ─────────────────────────────────
function DurationPicker({label,value,onChange,required}){
  const parts=(value||"0:00").split(":");
  const hrs=parts[0]||"0";const mins=parts[1]||"00";
  return<div>
    <label style={lbl}>{label}{required&&<span style={{color:T.err}}> *</span>}</label>
    <div style={{display:"flex",gap:6,alignItems:"center"}}>
      <input type="number" min="0" max="23" style={{...inp,width:60,textAlign:"center"}} value={hrs} onChange={e=>onChange(e.target.value+":"+mins)} placeholder="HH"/>
      <span style={{fontWeight:700,fontSize:16}}>:</span>
      <input type="number" min="0" max="59" style={{...inp,width:60,textAlign:"center"}} value={mins} onChange={e=>onChange(hrs+":"+e.target.value)} placeholder="MM"/>
      <span style={{fontSize:11,color:T.textMut}}>Hours : Minutes</span>
    </div>
  </div>;
}

// ─── KWD INPUT (Accounting Format) ───────────────────────────
function KWDInput({label,value,onChange,required,disabled}){
  return<div>
    <label style={lbl}>{label}{required&&<span style={{color:T.err}}> *</span>}</label>
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <span style={{fontSize:12,fontWeight:600,color:T.textSec}}>KWD</span>
      <input type="number" step="0.001" style={{...inp,flex:1}} value={value||""} onChange={e=>onChange(e.target.value)} disabled={disabled} placeholder="0.000"/>
    </div>
    {value&&Number(value)>0&&<div style={{fontSize:10,color:T.ok,marginTop:2}}>= {fmtKWD(value)}</div>}
  </div>;
}

// ─── LIST CARD (same card UI as OT Templates) ───────────────
// Used for: Manpower, Machines & Devices, Lab & Radiology, Consumables & Drugs
function ListCard({title,items,onChange,placeholder,required,locked,reqItems,before}){
  const[exp,setExp]=useState(items.length===0||!locked);
  const count=items.filter(Boolean).length;
  const borderC=count>0?T.ok:required?T.err:T.border;
  const add=()=>onChange([...items,""]);
  const del=idx=>onChange(items.filter((_,i)=>i!==idx));
  const upd=(idx,val)=>{const u=[...items];u[idx]=val;onChange(u);};
  return<div style={{border:`2px solid ${borderC}`,borderRadius:8,overflow:"hidden",marginBottom:12}}>
    <div onClick={()=>!locked&&setExp(!exp)} style={{padding:"12px 16px",background:count>0?"#f0fdf4":required?"#fef2f2":"#f9fafb",cursor:locked?"default":"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><span style={{fontWeight:700,fontSize:13,color:T.text}}>{title}</span>{required&&<span style={{color:T.err,marginLeft:4,fontSize:10}}>*</span>}<span style={{marginLeft:12,fontSize:11,color:T.textMut}}>{count} {count===1?"entry":"entries"}</span></div>
      {!locked&&<span style={{fontSize:14,color:T.textMut}}>{exp?"▲":"▼"}</span>}
    </div>
    {before!=null&&exp&&<div style={{padding:"6px 16px",background:"#f8fafc",borderTop:`1px solid ${T.borderLight}`,fontSize:10.5,color:T.textMut,display:"flex",alignItems:"center",gap:6}}><Ic n="users" s={11}/>Before this change: <strong style={{color:T.textSec}}>{before||"—"}</strong></div>}
    {exp&&!locked&&<div style={{padding:"10px 12px",background:"#fff"}}>
      {items.map((it,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
        <span style={{width:14,fontSize:12,fontWeight:700,color:T.primary,textAlign:"center"}}>{i+1}</span>
        <input style={{...inp,margin:0,flex:1}} value={it} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();add();}}} onChange={e=>upd(i,e.target.value)} placeholder={placeholder||"Enter description..."}/>
        {items.length>1&&<span onClick={()=>del(i)} title="Remove" style={{cursor:"pointer",color:T.err,fontWeight:700,fontSize:12,width:14,textAlign:"center"}}>✕</span>}
      </div>)}
      <button onClick={add} style={{background:"#fff",border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 12px",fontSize:11,color:T.textSec,cursor:"pointer"}}>+ Add Entry</button>
    </div>}
    {locked&&count>0&&<div style={{padding:10,background:"#fff",fontSize:12}}>
      {items.filter(Boolean).map((it,i)=><div key={i} style={{padding:"4px 10px",borderBottom:`1px solid ${T.borderLight}`,display:"flex",gap:8}}><span style={{fontWeight:600,color:T.primary,width:20}}>{i+1}.</span><span>{it}</span></div>)}
    </div>}
  </div>;
}

// ─── AUTOCOMPLETE (useRef+mousedown close) ───────────────────
function AutoComplete({label:lb,value,onChange,options,placeholder,displayFn,filterFn,disabled}){
  const[q,setQ]=useState("");const[open,setOpen]=useState(false);const ref=useRef(null);
  // Fix: handle string values vs object values for display
  const display=value?(typeof value==="string"?value:(typeof value==="object"&&value!==null?(displayFn?displayFn(value):(value.name||value.code||"")):"")):"";
  const filt=options.filter(o=>filterFn?filterFn(o,q):(typeof o==="string"?o:o.name||"").toLowerCase().includes(q.toLowerCase()));
  useEffect(()=>{if(!open)return;const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[open]);
  return<div style={{position:"relative"}} ref={ref}>
    {lb&&<label style={lbl}>{lb}</label>}
    <input style={{...inp,background:disabled?"#f5f5f5":"#fff"}} placeholder={placeholder||"Type to search..."} value={open?q:display} disabled={disabled} onChange={e=>{setQ(e.target.value);setOpen(true);onChange(e.target.value);}} onFocus={()=>{setQ(display);setOpen(true);}}/>
    {open&&filt.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:9990,background:"#fff",border:`1px solid ${T.border}`,borderRadius:6,boxShadow:"0 8px 24px rgba(0,0,0,0.15)",maxHeight:200,overflow:"auto",marginTop:2}}>
      {filt.slice(0,12).map((o,i)=>{const l2=displayFn?displayFn(o):(typeof o==="string"?o:`${o.code} — ${o.name}`);return<div key={i} onClick={()=>{onChange(o);setQ("");setOpen(false);}} style={{padding:"8px 12px",cursor:"pointer",fontSize:12,borderBottom:`1px solid ${T.borderLight}`}} onMouseEnter={e=>e.currentTarget.style.background=T.primaryLight} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{l2}</div>;})}
    </div>}
    {open&&filt.length===0&&q.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:9990,background:"#fff",border:`1px solid ${T.border}`,borderRadius:6,padding:"10px 12px",marginTop:2,fontSize:11,color:T.textMut}}>No match — free text entry allowed</div>}
  </div>;
}

// ─── PEOPLE PICKER (for requestor name, delegates) ───────────
function PeoplePicker({label:lb,value,onChange,placeholder,filterFn}){
  const[q,setQ]=useState("");const[open,setOpen]=useState(false);const ref=useRef(null);
  const display=value?value.name:"";
  const filt=U.filter(u=>{if(filterFn&&!filterFn(u))return false;if(!q)return true;return u.name.toLowerCase().includes(q.toLowerCase())||u.title.toLowerCase().includes(q.toLowerCase());});
  useEffect(()=>{if(!open)return;const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[open]);
  return<div style={{position:"relative"}} ref={ref}>
    {lb&&<label style={lbl}>{lb}</label>}
    <input style={inp} placeholder={placeholder||"Search users..."} value={open?q:display} onChange={e=>{setQ(e.target.value);setOpen(true);}} onFocus={()=>{setQ("");setOpen(true);}}/>
    {open&&filt.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:9990,background:"#fff",border:`1px solid ${T.border}`,borderRadius:6,boxShadow:"0 8px 24px rgba(0,0,0,0.15)",maxHeight:220,overflow:"auto",marginTop:2}}>
      {filt.slice(0,10).map(u=><div key={u.id} onClick={()=>{onChange(u);setQ("");setOpen(false);}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",cursor:"pointer",borderBottom:`1px solid ${T.borderLight}`,fontSize:12}} onMouseEnter={e=>e.currentTarget.style.background=T.primaryLight} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <Av user={u} size={24}/><div style={{flex:1}}><div style={{fontWeight:500}}>{u.name}</div><div style={{fontSize:10,color:T.textMut}}>{u.title} · {u.branch}</div></div>
      </div>)}
    </div>}
  </div>;
}

// ─── TEMPLATE CARD BUILDER (Item Master — designed for 60+ items) ─

// ─── GROUPED TEMPLATE BUILDER — select Category → Sub-category, then add items under each group ──
// Shared rule: no template row may be saved without a UOM. Used by every submit path.
function tplMissingUom(tpls){
  const all=[...(tpls.procCons||[]),...(tpls.wardsCons||[]),...(tpls.procDrugs||[]),...(tpls.wardsDrugs||[])];
  return all.filter(r=>r.code&&!r.uom).length;
}
function GroupedTemplateBuilder({items,setItems,master,categories}){
  const[selCat,setSelCat]=useState("");
  const[selSub,setSelSub]=useState("");
  const masterCats=Array.from(new Set(master.map(m=>m.cat)));
  const masterSubs=Array.from(new Set(master.map(m=>m.sub)));
  const parents=(categories||[]).filter(c=>c.parentId===null&&c.isActive!==false&&masterCats.includes(c.title)).sort((a,b)=>a.sortOrder-b.sortOrder);
  const subsFor=cat=>{const p=(categories||[]).find(c=>c.parentId===null&&c.title===cat);if(!p)return[];return categories.filter(c=>c.parentId===p.id&&c.isActive!==false&&masterSubs.includes(c.title)).sort((a,b)=>a.sortOrder-b.sortOrder);};
  const addItem=(cat,sub)=>setItems([...items,{code:"",name:"",uom:"",qty:1,unitCost:0,totalCost:0,uoms:[],cat,sub}]);
  // Item-first entry: pick the item and its Category / Sub-category are filled in automatically
  const addKnownItem=m=>{if(items.some(it=>it.code===m.code)){alert(`"${m.name}" is already in this template. Adjust the quantity on the existing row instead.`);return;}const r={code:m.code,name:m.name,uoms:m.uoms,cat:m.cat,sub:m.sub,qty:1,uom:"",unitCost:0,totalCost:0};
    if(m.uoms&&m.uoms.length===1){r.uom=m.uoms[0].unit;r.unitCost=m.uoms[0].cost;r.totalCost=m.uoms[0].cost;}
    setItems([...items,r]);setSelCat(m.cat);setSelSub(m.sub);};
  const updRow=(idx,patch)=>{const u=[...items];u[idx]={...u[idx],...patch};setItems(u);};
  const pickItem=(idx,m)=>{if(items.some((it,j)=>j!==idx&&it.code===m.code)){alert(`"${m.name}" is already in this template.`);return;}const u=[...items];const r={...u[idx],code:m.code,name:m.name,uoms:m.uoms,cat:m.cat,sub:m.sub};if(m.uoms.length===1){r.uom=m.uoms[0].unit;r.unitCost=m.uoms[0].cost;r.totalCost=m.uoms[0].cost*(r.qty||1);}else{r.uom="";r.unitCost=0;r.totalCost=0;}u[idx]=r;setItems(u);};
  const setUom=(idx,uom)=>{const u=[...items];const r={...u[idx]};r.uom=uom;const ud=(r.uoms||[]).find(x=>x.unit===uom);r.unitCost=ud?ud.cost:0;r.totalCost=r.unitCost*(r.qty||1);u[idx]=r;setItems(u);};
  const setQty=(idx,q)=>{const u=[...items];const r={...u[idx]};r.qty=Math.max(1,parseInt(q)||1);r.totalCost=r.unitCost*r.qty;u[idx]=r;setItems(u);};
  const delRow=idx=>setItems(items.filter((_,i)=>i!==idx));
  const groups={};items.forEach((it,i)=>{const c=it.cat||itemMeta(it.code).cat||"Uncategorised";const s=it.sub||itemMeta(it.code).sub||"General";(groups[c]=groups[c]||{});(groups[c][s]=groups[c][s]||[]).push({it,i});});
  const total=items.reduce((s,i)=>s+(i.totalCost||0),0);
  const inputS={...inp,fontSize:11,padding:"6px 8px"};
  return <div>
    <div style={{padding:"10px 12px",background:"#f8fafc",border:`1px solid ${T.border}`,borderRadius:8,marginBottom:12}}>
      {/* Mode A — know the item: search directly, category & sub-category auto-fill */}
      <div style={{marginBottom:10}}>
        <label style={{...lbl,fontSize:10}}>Search item directly <span style={{fontWeight:400,color:T.textMut}}>— category &amp; sub-category fill in automatically</span></label>
        <div style={{position:"relative",overflow:"visible",maxWidth:420}}>
          <AutoComplete value="" onChange={v=>{if(typeof v==="object"&&v.code)addKnownItem(v);}} options={master} placeholder="Type item name or code, then select..." displayFn={m=>`${m.name} — ${m.cat} › ${m.sub}`} filterFn={(m,q2)=>m.name.toLowerCase().includes(q2.toLowerCase())||m.code.toLowerCase().includes(q2.toLowerCase())}/>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,margin:"8px 0"}}><div style={{flex:1,height:1,background:T.border}}/><span style={{fontSize:9,color:T.textMut,fontWeight:600}}>OR PICK BY CATEGORY</span><div style={{flex:1,height:1,background:T.border}}/></div>
      {/* Mode B — know the group: pick category → sub-category → add */}
      <div style={{display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap"}}>
        <div style={{flex:"1 1 180px"}}><label style={{...lbl,fontSize:10}}>Category</label>
          <Select style={inputS} value={selCat} onChange={e=>{setSelCat(e.target.value);setSelSub("");}}><option value="">Select category...</option>{parents.map(p=><option key={p.id} value={p.title}>{p.title}</option>)}</Select></div>
        <div style={{flex:"1 1 200px"}}><label style={{...lbl,fontSize:10}}>Sub-category</label>
          <Select style={inputS} value={selSub} onChange={e=>setSelSub(e.target.value)} disabled={!selCat}><option value="">{selCat?"Select sub-category...":"Pick category first"}</option>{subsFor(selCat).map(s=><option key={s.id} value={s.title}>{s.title}</option>)}</Select></div>
        <button disabled={!selCat} onClick={()=>addItem(selCat,selSub)} style={{padding:"7px 14px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",color:T.textSec,fontSize:11,fontWeight:600,cursor:selCat?"pointer":"not-allowed"}} title="Add an empty row to fill manually">+ Blank row</button>
      </div>
      {selCat&&<div style={{marginTop:8}}>
        <label style={{...lbl,fontSize:10}}>Search items in <strong>{selCat}{selSub?` › ${selSub}`:""}</strong> ({master.filter(m=>m.cat===selCat&&(!selSub||m.sub===selSub)).length} available)</label>
        <AutoComplete value="" onChange={v=>{if(typeof v==="object"&&v.code)addKnownItem(v);}} options={master.filter(m=>m.cat===selCat&&(!selSub||m.sub===selSub))} placeholder={`Search within ${selSub||selCat}...`} displayFn={m=>`${m.name} — ${m.code}`} filterFn={(m,q2)=>m.name.toLowerCase().includes(q2.toLowerCase())||m.code.toLowerCase().includes(q2.toLowerCase())}/>
      </div>}
    </div>
    {items.length===0&&<div style={{padding:24,textAlign:"center",color:T.textMut,fontSize:12,border:`1px dashed ${T.border}`,borderRadius:8}}>No items yet — select a Category &amp; Sub-category above, then click “+ Add Item”.</div>}
    {Object.keys(groups).sort((a,b)=>a.localeCompare(b)).map(cat=>{
      const subKeys=Object.keys(groups[cat]).sort((a,b)=>a.localeCompare(b));
      return <div key={cat} style={{marginBottom:12,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden"}}>
        <div style={{padding:"8px 12px",background:T.primary+"12",fontWeight:700,fontSize:12,color:T.primary}}><Ic n="folder" s={11}/> {cat}</div>
        {subKeys.map(sub=>{const rows=groups[cat][sub];const subTotal=rows.reduce((s,{it})=>s+(it.totalCost||0),0);
          return <div key={sub}>
            <div style={{padding:"5px 12px 5px 20px",background:"#f1f5f9",fontSize:11,fontWeight:600,color:T.textSec,display:"flex",justifyContent:"space-between"}}><span>↳ {sub} <span style={{color:T.textMut,fontWeight:400}}>({rows.length})</span></span><span style={{color:T.primary}}>{fmtKWD(subTotal)}</span></div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:T.primaryLight}}>
                <th style={{...th,textAlign:"left",minWidth:180}}>Item</th>
                <th style={{...th,textAlign:"left",width:90}}>Code</th>
                <th style={{...th,width:90}}>UOM</th>
                <th style={{...th,width:52}}>Qty</th>
                <th style={{...th,width:78}}>Unit Cost (KWD)</th>
                <th style={{...th,width:85}}>Total Cost (KWD)</th>
                <th style={{...th,width:78}}>Unit Sale (KWD)</th>
                <th style={{...th,width:85}}>Total Sale (KWD)</th>
                <th style={{...th,width:26}}></th>
              </tr></thead>
              <tbody>
                {rows.map(({it:row,i:idx})=><tr key={idx} style={{borderBottom:`1px solid ${T.borderLight}`}}>
                  <td style={{...td,padding:"4px 6px",minWidth:180,position:"relative",overflow:"visible"}}><AutoComplete value={row.name} onChange={v=>{if(typeof v==="object"&&v.code)pickItem(idx,v);else updRow(idx,{name:v});}} options={master.filter(m=>m.sub===sub)} placeholder="Search item..." displayFn={m=>m.name} filterFn={(m,q2)=>m.name.toLowerCase().includes(q2.toLowerCase())||m.code.toLowerCase().includes(q2.toLowerCase())}/></td>
                  <td style={{...td,padding:"4px 6px",width:90,color:T.textSec,fontSize:10}}>{row.code||"—"}</td>
                  <td style={{...td,padding:"4px 4px",width:90}}><Select style={{...inp,fontSize:10,padding:"5px 3px",borderColor:row.code&&!row.uom?T.err:undefined,background:row.code&&!row.uom?"#fef2f2":undefined}} value={row.uom} onChange={e=>setUom(idx,e.target.value)}><option value="">UOM *</option>{(row.uoms||[]).map(u2=><option key={u2.unit} value={u2.unit}>{u2.unit}</option>)}</Select></td>
                  <td style={{...td,padding:"4px 4px",width:52}}><input type="number" min="1" value={row.qty} onChange={e=>setQty(idx,e.target.value)} style={{...inp,width:44,textAlign:"center",padding:"5px",fontSize:11}}/></td>
                  <td style={{...td,width:78,color:T.textSec,fontSize:10}}>{fmtKWD(row.unitCost)}</td>
                  <td style={{...td,width:85,fontWeight:700,color:T.primary}}>{fmtKWD(row.totalCost)}</td>
                  <td style={{...td,width:78,color:T.ok,fontSize:10}}>{(()=>{const s=saleForUom(row.code,row.uom);return s!=null?fmtKWD(s):"—";})()}</td>
                  <td style={{...td,width:85,color:T.ok,fontWeight:700}}>{(()=>{const s=saleForUom(row.code,row.uom);return s!=null?fmtKWD(s*(row.qty||0)):"—";})()}</td>
                  <td style={{...td,width:26,padding:"4px"}}><span onClick={()=>delRow(idx)} style={{cursor:"pointer",color:T.err,fontWeight:700}}>✕</span></td>
                </tr>)}
              </tbody>
            </table>
            <div style={{padding:"4px 12px 8px 20px"}}><button onClick={()=>addItem(cat,sub)} style={{background:"none",border:`1px dashed ${T.ok}`,borderRadius:6,padding:"4px 10px",fontSize:10,color:T.ok,cursor:"pointer",fontWeight:500}}>+ Add item to {sub}</button></div>
          </div>;})}
      </div>;})}
    <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",borderRadius:8,border:`1px solid ${T.ok}40`}}>
      <span style={{fontSize:11,color:T.textMut}}>{items.length} items</span>
      <span style={{fontSize:13,fontWeight:700,color:T.primary}}>List Total: {fmtKWD(total)}</span>
    </div>
  </div>;
}


// ─── TEMPLATE MASTERS (per call 2026-07-22: Fares — "we will need the setup… consumable templates or drugs templates") ───
function SetupTplMasters({type,title,masters,setMasters,procs=[],itemMaster=[],showToast,onBack}){
  const[q,setQ]=useState("");const[open,setOpen]=useState(null);const fileRef=useRef(null);
  const mine=masters.filter(t=>t.type===type);
  const codes=new Set(itemMaster.map(i=>String(i.code)));
  const usedBy=no=>procs.filter(p=>{const ss=p.systemSetup||{};const nums=[ss.procConsTemplate,ss.wardsConsTemplate,ss.procDrugsTemplate,ss.wardsDrugsTemplate].join(",");return nums.split(",").map(x=>x.trim()).includes(String(no))||Object.values(p.templates||{}).some(arr=>(arr||[]).some(i=>String(i.tplNo||"")===String(no)));}).length;
  const unlinked=t=>t.items.filter(i=>!codes.has(String(i.code))).length;
  const rows=mine.filter(t=>!q||String(t.no).includes(q)||t.name.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>Number(a.no)-Number(b.no));
  const doImport=file=>{
    const reader=new FileReader();
    reader.onload=e=>{try{
      const wb=XLSX.read(new Uint8Array(e.target.result),{type:"array"});
      const sh=wb.Sheets["P_REPORT"]||wb.Sheets[wb.SheetNames[0]];
      const data=XLSX.utils.sheet_to_json(sh,{defval:""});
      if(!data.length||!("TEMPLETE_ID" in data[0])){alert("Not a P_REPORT export — expected TEMPLETE_ID, TEMPLATETYPE, ITEMCODE… columns.");return;}
      const byId={};let badType=0;
      data.forEach(r=>{const id=String(r.TEMPLETE_ID).trim();if(!id)return;
        const ty=Number(r.TEMPLATETYPE)||type;if(ty!==type){badType++;return;}
        (byId[id]=byId[id]||{no:id,type,name:String(r.TEMPLETE_NAME_EN||("Template "+id)),src:"P_REPORT extract",extractDate:new Date().toISOString().slice(0,10),items:[]}).items.push({code:String(r.ITEMCODE),name:String(r.ITEM_NAME_EN||""),qty:Number(r.QTY)||1,uom:String(r.UNIT_NAME_EN||"Unit"),cost:Number(r.COST_PRICE)||0,sale:Number(r.SALE_PRICE)||0});});
      const ids=Object.keys(byId);if(!ids.length){alert("No rows of this template type found in the file.");return;}
      ids.forEach(id=>{byId[id].ward=/ward/i.test(byId[id].name)||(masters.find(m=>m.no===id)||{}).ward||false;});
      setMasters(prev=>[...prev.filter(m=>!(m.type===type&&ids.includes(m.no))),...ids.map(id=>byId[id])]);
      showToast(`Imported ${ids.length} template(s), ${data.length-badType} item line(s)${badType?` · ${badType} line(s) of the other type skipped`:""}. Ward flags auto-suggested — review the toggles.`);
    }catch(err){alert("Could not read the file: "+err.message);}};
    reader.readAsArrayBuffer(file);
  };
  return <div style={{maxWidth:1600}}>
    <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textSec,padding:0,marginBottom:8,fontFamily:T.font}}>← Back to Setup</button>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:6}}>
      <h1 style={{fontSize:20,fontWeight:600,color:T.text,margin:0,display:"flex",alignItems:"center",gap:10}}><Ic n={type===1?"clipboard":"pill"} s={18}/> {title}</h1>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>fileRef.current&&fileRef.current.click()} style={{display:"inline-flex",alignItems:"center",gap:7,padding:"8px 16px",borderRadius:8,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:T.font}}><Ic n="download" s={13}/>Import P_REPORT</button>
        <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{display:"none"}} onChange={e=>{if(e.target.files[0])doImport(e.target.files[0]);e.target.value="";}}/>
      </div>
    </div>
    <p style={{fontSize:12,color:T.textSec,margin:"0 0 12px"}}>Master templates from PrimeCare (type {type} — {type===1?"Consumables":"Medications"}). Key = template number + item code. Costs are the snapshot as of the extract date. Ward/Common templates are reusable in the Nursing step.</p>
    <Card style={{padding:14,marginBottom:14}}><div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
      <div style={{flex:"1 1 220px",position:"relative"}}><Ic n="search" s={13} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.textMut}}/><input style={{...inp,margin:0,paddingLeft:30,fontSize:12}} placeholder="Search number or name…" value={q} onChange={e=>setQ(e.target.value)}/></div>
      <span style={{fontSize:11,color:T.textMut,fontWeight:600}}>{rows.length} of {mine.length}</span>
    </div></Card>
    <Card style={{padding:0,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:T.primaryLight}}>
          {["No","Template Name","Ward / Common","Items","Unlinked","Cost (KWD)","Sale (KWD)","Used by","Source",""].map((h,i)=><th key={i} style={{padding:"10px 12px",fontSize:10,fontWeight:800,color:T.textSec,textTransform:"uppercase",letterSpacing:0.4,textAlign:i>=3&&i<=7?"right":"left"}}>{h}</th>)}
        </tr></thead>
        <tbody>
          {rows.map(t=><React.Fragment key={t.no}>
            <tr onClick={()=>setOpen(open===t.no?null:t.no)} style={{cursor:"pointer",borderTop:`1px solid ${T.borderLight}`}} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
              <td style={{padding:"10px 12px",fontSize:12.5,fontWeight:800,color:T.primary}}>{t.no}</td>
              <td style={{padding:"10px 12px",fontSize:12}}>{t.name}</td>
              <td style={{padding:"10px 12px"}} onClick={e=>e.stopPropagation()}>
                <button onClick={()=>{setMasters(masters.map(m=>m===t?{...m,ward:!m.ward}:m));showToast(`Template ${t.no} marked ${!t.ward?"Ward/Common (reusable)":"Procedure-specific"}.`);}} style={{padding:"3px 12px",borderRadius:20,border:`1px solid ${t.ward?(T.teal||"#0d9488"):T.border}`,background:t.ward?"#f0fdfa":"#fff",color:t.ward?(T.teal||"#0d9488"):T.textMut,fontSize:10.5,fontWeight:700,cursor:"pointer",fontFamily:T.font}}>{t.ward?"Ward / Common":"Procedure"}</button>
              </td>
              <td style={{padding:"10px 12px",fontSize:12,textAlign:"right"}}>{t.items.length}</td>
              <td style={{padding:"10px 12px",textAlign:"right"}}>{unlinked(t)>0?<span style={{fontSize:10,fontWeight:700,color:T.warn,background:"#fffbeb",padding:"2px 8px",borderRadius:10}}>{unlinked(t)} not in item master</span>:<span style={{fontSize:10,color:T.ok,fontWeight:700}}>all linked</span>}</td>
              <td style={{padding:"10px 12px",fontSize:12,fontWeight:700,textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{tplCost(t).toFixed(3)}</td>
              <td style={{padding:"10px 12px",fontSize:12,textAlign:"right",color:T.textSec,fontVariantNumeric:"tabular-nums"}}>{tplSale(t).toFixed(3)}</td>
              <td style={{padding:"10px 12px",fontSize:12,textAlign:"right"}}>{usedBy(t.no)||"—"}</td>
              <td style={{padding:"10px 12px",fontSize:10,color:t.src.indexOf("Synth")===0?T.warn:T.textMut}}>{t.src.indexOf("Synth")===0?"Synthesized (demo)":"P_REPORT"}</td>
              <td style={{padding:"10px 12px",fontSize:11,color:T.textMut}}>{open===t.no?"▲":"▼"}</td>
            </tr>
            {open===t.no&&<tr><td colSpan={10} style={{padding:0,background:"#fcfdfd"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["","Item Code","Item Name","Qty","UOM","Unit Cost","Unit Sale","Line Cost","Item Master"].map((h,i)=><th key={i} style={{padding:"7px 12px",fontSize:9.5,fontWeight:700,color:T.textMut,textTransform:"uppercase",textAlign:i>=3&&i<=7?"right":"left",borderBottom:`1px solid ${T.borderLight}`}}>{h}</th>)}</tr></thead>
                <tbody>{t.items.map((i2,ix)=><tr key={ix} style={{borderBottom:`1px solid ${T.borderLight}`}}>
                  <td style={{padding:"6px 12px",fontSize:10,color:T.textMut}}>{ix+1}</td>
                  <td style={{padding:"6px 12px",fontSize:11,fontFamily:"monospace"}}>{i2.code}</td>
                  <td style={{padding:"6px 12px",fontSize:11.5}}>{i2.name}</td>
                  <td style={{padding:"6px 12px",fontSize:11.5,textAlign:"right"}}>{i2.qty}</td>
                  <td style={{padding:"6px 12px",fontSize:11}}>{i2.uom}</td>
                  <td style={{padding:"6px 12px",fontSize:11.5,textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{i2.cost.toFixed(3)}</td>
                  <td style={{padding:"6px 12px",fontSize:11.5,textAlign:"right",color:T.textSec,fontVariantNumeric:"tabular-nums"}}>{i2.sale.toFixed(3)}</td>
                  <td style={{padding:"6px 12px",fontSize:11.5,fontWeight:700,textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{(i2.qty*i2.cost).toFixed(3)}</td>
                  <td style={{padding:"6px 12px"}}>{codes.has(String(i2.code))?<span style={{fontSize:10,color:T.ok,fontWeight:700}}>linked</span>:<span style={{fontSize:10,color:T.warn,fontWeight:700}}>not linked</span>}</td>
                </tr>)}</tbody>
              </table>
            </td></tr>}
          </React.Fragment>)}
          {rows.length===0&&<tr><td colSpan={10} style={{padding:36,textAlign:"center",color:T.textMut,fontSize:12}}>No templates — import a P_REPORT extract to begin</td></tr>}
        </tbody>
      </table>
    </Card>
  </div>;
}

// ─── TEMPLATE SUMMARY — TABBED SINGLE-FOCUS VIEW for 60+ items ──
function TemplateSummary({templates,defaultExpand}){
  const cards=[{k:"procCons",t:"Procedure Consumables",items:templates?.procCons||[],req:true,icon:"building"},{k:"wardsCons",t:"Wards Consumables",items:templates?.wardsCons||[],icon:"bed"},{k:"procDrugs",t:"Procedure Drugs",items:templates?.procDrugs||[],req:true,icon:"pill"},{k:"wardsDrugs",t:"Wards Drugs",items:templates?.wardsDrugs||[],icon:"syringe"}];
  const[activeCard,setActiveCard]=useState(cards[0].k);
  const cardTotals=cards.map(c=>({...c,total:c.items.reduce((s,i)=>s+(i.totalCost||0),0)}));
  const grandTotal=cardTotals.reduce((s,c)=>s+c.total,0);
  const active=cardTotals.find(c=>c.k===activeCard)||cardTotals[0];
  return<div>
    {/* Summary strip - click to focus */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:12}}>
      {cardTotals.map(c=>{
        return<div key={c.k} onClick={()=>setActiveCard(c.k)} style={{padding:"10px 12px",borderRadius:8,cursor:"pointer",
          background:activeCard===c.k?"#f0fdf4":"#f8fafc",
          border:activeCard===c.k?`2px solid ${T.ok}`:`1px solid ${T.border}`,
          transition:"all 0.2s"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:11,fontWeight:600,color:activeCard===c.k?T.primary:T.textSec}}><Ic n={c.icon} s={12}/> {c.t.replace("Procedure ","Proc. ").replace("Wards ","Wards ")}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
            <span style={{fontSize:10,color:T.textMut}}>{c.items.length} items</span>
            <span style={{fontSize:12,fontWeight:700,color:T.primary}}>{fmtKWD(c.total)}</span>
          </div>
        </div>;})}
    </div>
    {/* Active card detail - full width */}
    <Card style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Ic n={active.icon} s={16}/>
          <div><div style={{fontSize:14,fontWeight:700,color:T.primary}}>{active.t}</div><div style={{fontSize:11,color:T.textMut}}>{active.items.length} items · Total: {fmtKWD(active.total)}</div></div>
        </div>
        {active.req&&<span style={{fontSize:10,color:T.err,fontWeight:600,padding:"2px 8px",background:"#fef2f2",borderRadius:4}}>Required</span>}
      </div>
      {active.items.length>0?(()=>{
        // Batch 4: enrich each item with Category/Sub-category/Sale/Last-updated (by item code), then group + sort
        const enriched=active.items.map(it=>{const m=itemMeta(it.code);const sale=it.salePrice!=null?it.salePrice:saleForUom(it.code,it.uom);return{...it,_cat:it.cat||m.cat||"Uncategorised",_sub:it.sub||m.sub||"General",_updated:it.updated||m.updated||"—",_sale:sale,_totalSale:sale!=null?sale*(it.qty||0):null};});
        const groups={};enriched.forEach(it=>{groups[it._cat]=groups[it._cat]||{};groups[it._cat][it._sub]=groups[it._cat][it._sub]||[];groups[it._cat][it._sub].push(it);});
        const catKeys=Object.keys(groups).sort((a,b)=>a.localeCompare(b));
        const totalSaleSum=enriched.reduce((s,it)=>s+(it._totalSale||0),0);
        let rn=0;
        return<div style={{maxHeight:420,overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:860}}>
            <thead><tr style={{background:T.primaryLight,position:"sticky",top:0,zIndex:1}}>
              {["#","Code","Name","UOM","Qty","Unit Cost","Total Cost","Sale Price","Total Sale","Last Updated"].map(h=><th key={h} style={{...th,textAlign:h==="#"||h==="Qty"?"center":"left",fontSize:10,whiteSpace:"nowrap"}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {catKeys.map(cat=>{
                const subKeys=Object.keys(groups[cat]).sort((a,b)=>a.localeCompare(b));
                return<React.Fragment key={cat}>
                  <tr><td colSpan={10} style={{padding:"8px 12px",background:T.primary+"12",fontWeight:700,fontSize:11,color:T.primary,textTransform:"uppercase",letterSpacing:0.4}}><Ic n="folder" s={11}/> {cat}</td></tr>
                  {subKeys.map(sub=>{
                    const list=groups[cat][sub].slice().sort((a,b)=>String(a.name||"").localeCompare(String(b.name||"")));
                    return<React.Fragment key={cat+"|"+sub}>
                      <tr><td colSpan={10} style={{padding:"5px 12px 5px 24px",background:"#f1f5f9",fontWeight:600,fontSize:10.5,color:T.textSec}}>↳ {sub} <span style={{color:T.textMut,fontWeight:400}}>({list.length})</span></td></tr>
                      {list.map((it,ii)=>{rn++;return<tr key={cat+sub+ii} style={{borderBottom:`1px solid ${T.borderLight}`,background:rn%2===0?"#f8fafb":"#fff"}}>
                        <td style={{...td,fontWeight:600,color:T.primary,textAlign:"center"}}>{rn}</td>
                        <td style={{...td,textAlign:"left",fontWeight:500}}>{it.code}</td>
                        <td style={{...td,textAlign:"left"}}>{it.name}{it.tplNo&&<span style={{marginLeft:6,fontSize:8.5,fontWeight:800,color:T.primary,background:T.primaryLight,borderRadius:6,padding:"1px 6px"}}>Tpl {it.tplNo}</span>}</td>
                        <td style={{...td,textAlign:"left"}}>{it.uom}</td>
                        <td style={{...td,textAlign:"center",fontWeight:600}}>{it.qty}</td>
                        <td style={{...td,textAlign:"left"}}>{fmtKWD(it.unitCost)}</td>
                        <td style={{...td,textAlign:"left",fontWeight:700,color:T.primary}}>{fmtKWD(it.totalCost)}</td>
                        <td style={{...td,textAlign:"left",color:T.ok}}>{it._sale!=null?fmtKWD(it._sale):"—"}</td>
                        <td style={{...td,textAlign:"left",fontWeight:700,color:T.ok}}>{it._totalSale!=null?fmtKWD(it._totalSale):"—"}</td>
                        <td style={{...td,textAlign:"left",fontSize:10,color:T.textMut,whiteSpace:"nowrap"}}>{it._updated}</td>
                      </tr>;})}
                    </React.Fragment>;
                  })}
                </React.Fragment>;
              })}
              {/* Sub-total row — cost & sale */}
              <tr style={{background:"#eff6ff",borderTop:`2px solid ${T.info}`,fontWeight:700}}>
                <td colSpan={6} style={{...td,textAlign:"right",fontSize:12,color:T.info,padding:"10px 12px"}}>{active.t} — Sub-Total ({active.items.length} items)</td>
                <td style={{...td,textAlign:"left",fontSize:13,fontWeight:700,color:T.info,padding:"10px 12px"}}>{fmtKWD(active.total)}</td>
                <td style={{...td}}></td>
                <td style={{...td,textAlign:"left",fontSize:13,fontWeight:700,color:T.ok,padding:"10px 12px"}}>{fmtKWD(totalSaleSum)}</td>
                <td style={{...td}}></td>
              </tr>
            </tbody>
          </table>
        </div>;
      })():<div style={{padding:30,textAlign:"center",color:T.textMut}}>No items added</div>}
    </Card>
    {/* Grand Total - now spells out all 4 template names */}
    {grandTotal>0&&<div style={{padding:"14px 18px",background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",borderRadius:10,border:`2px solid ${T.ok}40`,marginTop:8}}>
      <div style={{fontSize:11,fontWeight:700,color:T.ok,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>All Templates Total (Proc + Wards)</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr) auto",gap:10,alignItems:"center"}}>
        {cardTotals.map(c=><div key={c.k} style={{padding:"6px 10px",background:"#fff",borderRadius:6,borderLeft:`3px solid ${T.ok}40`}}>
          <div style={{fontSize:10,color:T.textMut,fontWeight:500,display:"flex",alignItems:"center",gap:5}}><Ic n={c.icon} s={11}/>{c.t}</div>
          <div style={{fontSize:13,fontWeight:700,color:c.total>0?T.primary:T.textMut,marginTop:2}}>{fmtKWD(c.total)}</div>
        </div>)}
        <div style={{padding:"10px 16px",background:T.ok,borderRadius:6,color:"#fff",textAlign:"right",minWidth:140}}>
          <div style={{fontSize:10,color:"#fff",opacity:0.9,fontWeight:500}}>GRAND TOTAL</div>
          <div style={{fontSize:18,fontWeight:800,color:"#fff",marginTop:2}}>{fmtKWD(grandTotal)}</div>
        </div>
      </div>
    </div>}
  </div>;
}

// ─── ACTION MODAL — popup for approvals/rejections ──────────
function ActionModal({isOpen,onClose,title,procId,stageName,children,actions,onAction}){
  const[comments,setComments]=useState("");
  if(!isOpen)return null;
  return<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.2s"}}>
    <div style={{background:"#fff",borderRadius:12,width:520,maxWidth:"90vw",maxHeight:"80vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
      <div style={{padding:"20px 24px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:16,fontWeight:700,color:T.text}}>{title}</div>
            <div style={{fontSize:12,color:T.textMut}}>{procId} · {stageName}</div></div>
          <span onClick={onClose} style={{cursor:"pointer",fontSize:20,color:T.textMut,padding:4}}>✕</span>
        </div>
      </div>
      <div style={{padding:"20px 24px"}}>
        {children}
        <div style={{marginTop:16}}>
          <label style={lbl}>Comments / Instructions</label>
          <textarea style={{...inp,height:70,resize:"vertical",fontFamily:T.font}} placeholder="Enter comments..." value={comments} onChange={e=>setComments(e.target.value)}/>
        </div>
      </div>
      <div style={{padding:"16px 24px",borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"flex-end",gap:8}}>
        <button onClick={onClose} style={{padding:"9px 20px",borderRadius:8,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,cursor:"pointer",color:T.textSec,fontFamily:T.font}}>Cancel</button>
        {actions?.map((a,i)=><button key={i} onClick={()=>a.onClick(comments)} style={{padding:"9px 20px",borderRadius:8,border:"none",background:a.color||T.ok,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>{a.icon||""} {a.label}</button>)}
      </div>
    </div>
  </div>;
}

function FinCards({fin,efEdit,stage}){
  if(!fin)return null;
  const cons=fin.totalConsCost||0, drugs=fin.totalDrugsCost||0;
  const tpl=cons+drugs;
  const svc=fin.totalServicesCost||0;
  const addl=fin.additionalServicesCost||0;
  const overall=fin.totalOverallCost||tpl+svc+addl;
  const price=fin.finalPatientPrice||0;
  const margin=fin.marginPercent;
  const pos=margin!=null&&margin>0;
  const NUM={fontVariantNumeric:"tabular-nums",letterSpacing:-0.4};
  const hero=(cap,val,color,sub,pill,tint)=>(
    <div style={{background:tint||"#fff",border:`1px solid ${T.border}`,borderRadius:12,padding:"18px 20px",boxShadow:"0 1px 3px rgba(15,23,42,0.04)",borderTop:`3px solid ${color}`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:10,fontWeight:700,letterSpacing:0.7,textTransform:"uppercase",color:T.textMut}}>{cap}</span>
        {pill}
      </div>
      <div style={{fontSize:26,fontWeight:800,color,marginTop:8,...NUM}}>{val}</div>
      <div style={{fontSize:10.5,color:T.textMut,marginTop:4}}>{sub}</div>
    </div>);
  const row=(l,v,opts={})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:opts.total?"12px 18px":"9px 18px",borderTop:`1px solid ${opts.total?T.border:T.borderLight}`,background:opts.bg||(opts.total?T.primaryLight:opts.sub?"#fcfdfd":"#fff")}}>
      <span style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:12.5,color:opts.total?T.text:opts.sub?T.text:T.textSec,fontWeight:opts.total?800:opts.sub?700:500,paddingLeft:opts.indent?14:0}}>{opts.dot&&<span style={{width:8,height:8,borderRadius:"50%",background:opts.dot,flexShrink:0}}/>}{l}</span>
      <span style={{fontSize:opts.total?14:12.5,fontWeight:opts.total?800:700,color:opts.c||T.text,...NUM}}>{v}</span>
    </div>);
  const terms=[
    {l:"Accept Doctor Fees",v:fin.acceptDoctorFees,k:"acceptDoctorFees"},
    {l:"Advance Payment (Inpatient Visit)",v:fin.advancePayment,k:"advancePayment"},
    {l:"Service Revenue — Doctors",v:fin.serviceRevenueDoctors,k:"serviceRevenueDoctors"},
    {l:"Maximum CAP Limit",v:fin.hasCap==="Yes"?(fin.capLimit?fmtKWD(fin.capLimit):"Yes"):fin.hasCap,k:"capLimit"},
  ].filter(t2=>t2.v||(efEdit&&t2.k));
  return<div style={{marginBottom:18}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12,marginBottom:14}}>
      {hero("Total package cost",fmtKWD(overall),"#334155",`OT Templates ${fmtKWD(tpl)} + Services & LOS ${fmtKWD(svc)}`,null,"#f8fafc")}
      {hero("Final patient price",price?fmtKWD(price):"—",T.primary,fin.ceoAdjustedPrice?"Adjusted & approved by the CEO":(stage&&stage<=11?"Set by the CFO · awaiting CEO review":"Set by the CFO · approved by the CEO"),efEdit&&efEdit("finalPatientPrice"),"#f0fdfa")}
      {hero("Margin (on cost)",margin!=null?margin.toFixed(1)+"%":"—",pos?T.ok:T.err,price&&overall?`${pos?"+":""}${fmtKWD(price-overall)} vs cost`:"Awaiting price",
        margin!=null&&<span style={{fontSize:9.5,fontWeight:800,letterSpacing:0.5,padding:"3px 10px",borderRadius:20,background:pos?"#dcfce7":"#fee2e2",color:pos?T.ok:T.err}}>{pos?"PROFIT":"LOSS"}</span>,pos?"#f0fdf4":"#fef2f2")}
    </div>
    <div style={{border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",background:"#fff"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 18px",background:"#f8fafc"}}>
        <span style={{fontSize:10.5,fontWeight:800,letterSpacing:0.7,textTransform:"uppercase",color:T.textSec}}>Cost composition</span>
        <span style={{fontSize:10,color:T.textMut,fontWeight:600}}>KWD</span>
      </div>
      {row("Consumables — OT templates",fmtKWD(cons),{indent:true,dot:T.info})}
      {row("Drugs — OT templates",fmtKWD(drugs),{indent:true,dot:T.purple})}
      {row("OT Templates subtotal",fmtKWD(tpl),{sub:true,dot:T.primary})}
      {row("Services & LOS — standard costs",fmtKWD(svc),{sub:true,dot:T.teal||"#0d9488"})}
      {addl>0&&row("Additional services",fmtKWD(addl),{sub:true,dot:T.info})}
      {row("Total package cost",fmtKWD(overall),{total:true})}
      {price>0&&row("Final patient price",fmtKWD(price),{total:true,c:T.primary,bg:"#f0fdfa"})}
    </div>
    {terms.length>0&&<div style={{marginTop:14,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 18px",background:"#fff"}}>
      <div style={{fontSize:10.5,fontWeight:800,letterSpacing:0.7,textTransform:"uppercase",color:T.textSec,marginBottom:10}}>Commercial terms</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
        {terms.map((t2,i2)=><div key={i2} style={{display:"flex",flexDirection:"column",gap:4}}>
          <span style={{fontSize:10,color:T.textMut,fontWeight:600}}>{t2.l}</span>
          {(efEdit&&t2.k&&efEdit(t2.k))||<span style={{alignSelf:"flex-start",fontSize:12,fontWeight:700,color:T.primaryDark,background:T.primaryLight,border:`1px solid ${T.primary}25`,borderRadius:8,padding:"3px 10px"}}>{t2.v}</span>}
        </div>)}
      </div>
    </div>}
  </div>;
}

function WfTracker({stages,cur}){
  const total=stages.length;const curStage=stages[Math.min(cur,total-1)]||{};
  const railRef=useRef(null);
  useEffect(()=>{const el=railRef.current;if(el){const act=el.querySelector('[data-act="1"]');if(act&&act.scrollIntoView)act.scrollIntoView({inline:"center",block:"nearest"});}},[cur]);
  return<div style={{background:T.cardBg,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 16px 6px",marginBottom:4}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <span style={{fontSize:10,fontWeight:700,letterSpacing:0.6,textTransform:"uppercase",color:T.textMut}}>Approval workflow</span>
      <span style={{fontSize:11,fontWeight:600,color:T.textSec}}>Step {Math.min(cur+1,total)} of {total} — <span style={{color:T.primary,fontWeight:700}}>{curStage.label}</span></span>
    </div>
    <div ref={railRef} style={{display:"flex",overflowX:"auto",paddingBottom:8,scrollbarWidth:"thin"}}>
      {stages.map((s,i)=>{const done=i<cur;const act=i===cur;
        return<div key={i} data-act={act?"1":"0"} style={{flex:"1 1 0",minWidth:i<stages.length-1?96:72}}>
          <div style={{display:"flex",alignItems:"center"}}>
            <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,background:done?T.primary:act?"#fff":"#fff",border:done?`1.5px solid ${T.primary}`:act?`2px solid ${T.warn}`:`1.5px solid #cbd5e1`,color:done?"#fff":act?T.warn:T.textMut,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9.5,fontWeight:700,boxShadow:act?`0 0 0 3px ${T.warn}22`:"none"}}>{done?<Ic n="check" s={10} sw={3}/>:s.num}</div>
            {i<stages.length-1&&<div style={{flex:1,height:2,margin:"0 4px",borderRadius:1,background:done?T.primary:"#e2e8f0"}}/>}
          </div>
          <div style={{fontSize:9.5,fontWeight:act?700:done?600:500,color:act?T.warn:done?T.primary:T.textMut,lineHeight:1.25,marginTop:5,paddingRight:8}}>{s.label}</div>
          {s.sla&&<div style={{fontSize:8.5,fontWeight:600,color:act?T.warn:T.textMut,marginTop:1}}>SLA {s.sla}</div>}
        </div>;
      })}
    </div>
  </div>;
}

// ─── DELEGATION MODAL ────────────────────────────────────────
function DelegateModal({isOpen,onClose,onSubmit,stageName,delegateRole}){
  const[comment,setComment]=useState("");
  const[query,setQuery]=useState("");
  const[selected,setSelected]=useState(null);
  if(!isOpen)return null;
  // All users available for delegation, with the suggested role first
  const filtered=U.filter(u=>!query||u.name.toLowerCase().includes(query.toLowerCase())||u.title.toLowerCase().includes(query.toLowerCase())||(u.branch||"").toLowerCase().includes(query.toLowerCase()));
  const sorted=[...filtered].sort((a,b)=>(a.role===delegateRole?-1:b.role===delegateRole?1:0));
  return<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.45)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{background:"#fff",borderRadius:12,width:540,maxWidth:"92vw",maxHeight:"85vh",overflowY:"auto",boxShadow:"0 24px 48px rgba(0,0,0,0.15)"}}>
      <div style={{padding:"20px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontSize:16,fontWeight:700,color:T.text}}>Forward / Delegate</div>
          <div style={{fontSize:11,color:T.textSec,marginTop:4}}>Stage: {stageName}</div>
        </div>
        <span onClick={onClose} style={{cursor:"pointer",fontSize:20,color:T.textMut,padding:4}}>✕</span>
      </div>
      <div style={{padding:"20px 24px"}}>
        <label style={lbl}>Forward to <span style={{color:T.err}}>*</span></label>
        <input style={{...inp,marginBottom:8}} placeholder="Search by name, title, or branch..." value={query} onChange={e=>{setQuery(e.target.value);setSelected(null);}}/>
        <div style={{fontSize:10,color:T.textMut,marginBottom:8}}>Can be any user across departments and branches (CEN ↔ NTH)</div>
        <div style={{maxHeight:220,overflowY:"auto",border:`1px solid ${T.borderLight}`,borderRadius:6}}>
          {sorted.length===0?<div style={{padding:16,textAlign:"center",color:T.textMut,fontSize:11}}>No users found</div>:
          sorted.map(u=>{const isSel=selected?.email===u.email;const isSuggested=u.role===delegateRole;
            return<div key={u.email} onClick={()=>setSelected(u)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",cursor:"pointer",borderBottom:`1px solid ${T.borderLight}`,background:isSel?"#eef4ff":"#fff",borderLeft:isSel?`3px solid ${T.purple}`:"3px solid transparent"}}>
              <Av user={u} size={32}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{fontSize:12,fontWeight:600}}>{u.name}</div>
                  {isSuggested&&<span style={{fontSize:9,fontWeight:600,color:T.purple,background:"#faf5ff",padding:"1px 6px",borderRadius:3}}>SUGGESTED</span>}
                </div>
                <div style={{fontSize:10,color:T.textMut}}>{u.title} · {u.branch||"—"}</div>
              </div>
              {isSel&&<span style={{color:T.purple,fontSize:14,fontWeight:700}}>✓</span>}
            </div>;})}
        </div>
        <div style={{marginTop:14}}>
          <label style={lbl}>Comment / Instructions <span style={{color:T.err}}>*</span></label>
          <textarea style={{...inp,height:70,resize:"vertical",fontFamily:T.font}} placeholder="Instructions or reason..." value={comment} onChange={e=>setComment(e.target.value)}/>
        </div>
        <div style={{background:"#faf5ff",padding:10,borderRadius:6,marginTop:12,fontSize:11,color:T.purple,border:`1px solid ${T.purple}15`}}>
          <strong>Flow:</strong> Delegate fills data → presses Confirm → returns to you for final decision (you remain responsible for approval)
        </div>
      </div>
      <div style={{padding:"16px 24px",borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"flex-end",gap:8}}>
        <button onClick={onClose} style={{padding:"8px 18px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,cursor:"pointer",color:T.textSec,fontFamily:T.font}}>Cancel</button>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
          {(!selected||!comment.trim())&&<div style={{fontSize:10,color:T.textMut}}>{!selected?"Select a person":"Add a comment"} to enable</div>}
          <button onClick={()=>{if(!selected){alert("Please select a user");return;}if(!comment.trim()){alert("Comments required");return;}onSubmit(selected,comment);}} disabled={!selected||!comment.trim()} style={{padding:"8px 18px",borderRadius:6,border:"none",background:selected&&comment.trim()?T.purple:"#e2e8f0",color:selected&&comment.trim()?"#fff":T.textMut,fontSize:12,fontWeight:600,cursor:selected&&comment.trim()?"pointer":"not-allowed",fontFamily:T.font}}>↗ Forward {selected?"to "+selected.name.split(" ")[0]:""}</button>
        </div>
      </div>
    </div>
  </div>;
}
