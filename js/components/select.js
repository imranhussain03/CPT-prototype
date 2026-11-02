// Live-style dropdown used for every <select> in the app: the open list floats over the page,
// the selected row carries a tick, long lists get a "Type to filter" box and a "+N more" hint.
const optText=c=>c==null||c===false?"":Array.isArray(c)?c.map(optText).join(""):typeof c==="object"?optText(c.props&&c.props.children):String(c);
function Select({value,defaultValue,onChange,style={},children,disabled,title}){
  const opts=[];React.Children.toArray(children).forEach(c=>{if(!c||!c.props)return;if(c.type==="optgroup")React.Children.toArray(c.props.children).forEach(o=>o&&o.props&&opts.push(o));else opts.push(c);});
  const list=opts.map(o=>{const l=optText(o.props.children);return {v:o.props.value!==undefined?String(o.props.value):l,l,dis:!!o.props.disabled};});
  const[inner,setInner]=useState(defaultValue!==undefined?String(defaultValue):(list[0]?list[0].v:""));
  const cur=value!==undefined&&value!==null?String(value):inner;
  const[open,setOpen]=useState(false);const[q,setQ]=useState("");const[pos,setPos]=useState(null);const[atEnd,setAtEnd]=useState(false);
  const ref=useRef(null);const pop=useRef(null);
  useEffect(()=>{if(!open)return;
    const out=e=>{if(ref.current&&!ref.current.contains(e.target)&&pop.current&&!pop.current.contains(e.target))setOpen(false);};
    const sc=e=>{if(pop.current&&pop.current.contains(e.target))return;setOpen(false);};
    const key=e=>{if(e.key==="Escape")setOpen(false);};
    document.addEventListener("mousedown",out);window.addEventListener("scroll",sc,true);document.addEventListener("keydown",key);
    return()=>{document.removeEventListener("mousedown",out);window.removeEventListener("scroll",sc,true);document.removeEventListener("keydown",key);};},[open]);
  const sel=list.find(o=>o.v===cur);
  const placeholder=!cur&&sel&&/^(select|—|-|choose|pick|add )/i.test(sel.l);
  const toggle=()=>{if(disabled)return;if(!open&&ref.current){const r=ref.current.getBoundingClientRect();const below=window.innerHeight-r.bottom;setPos({left:r.left,width:r.width,top:below<300&&r.top>below?null:r.bottom+4,bottom:below<300&&r.top>below?window.innerHeight-r.top+4:null});}setQ("");setAtEnd(false);setOpen(!open);};
  const pick=o=>{if(o.dis)return;setOpen(false);if(value===undefined||value===null)setInner(o.v);onChange&&onChange({target:{value:o.v},currentTarget:{value:o.v}});};
  const showFilter=list.length>7;
  const shown=list.filter(o=>!q||o.l.toLowerCase().includes(q.toLowerCase()));
  const longest=list.reduce((m,o)=>Math.max(m,o.l.length),0);
  const auto=!style.width||style.width==="auto";
  return <div ref={ref} title={title} style={{position:"relative",display:auto?"inline-block":"block",width:auto?undefined:style.width,flex:style.flex,minWidth:style.minWidth,maxWidth:style.maxWidth}}>
    <div onClick={toggle} style={{...inp,...style,width:"100%",margin:style.margin!==undefined?style.margin:0,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,cursor:disabled?"not-allowed":"pointer",background:disabled?"#f5f5f5":(style.background||"#fff"),color:placeholder?T.textMut:(style.color||T.text),minWidth:auto?Math.min(320,longest*7+46):undefined,userSelect:"none",boxSizing:"border-box",borderColor:open?T.primary:(style.borderColor||undefined)}}>
      <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sel?sel.l:""}</span>
      <span style={{display:"inline-flex",color:T.textMut,transform:open?"rotate(180deg)":"none",transition:"transform 0.15s",flexShrink:0}}><Ic n="chevDown" s={13}/></span>
    </div>
    {open&&pos&&<div ref={pop} style={{position:"fixed",left:pos.left,top:pos.top!=null?pos.top:undefined,bottom:pos.bottom!=null?pos.bottom:undefined,minWidth:Math.max(pos.width,160),maxWidth:420,zIndex:10050,background:"#fff",border:`1px solid ${T.border}`,borderRadius:8,boxShadow:"0 10px 30px rgba(15,23,42,0.18)",overflow:"hidden",fontFamily:T.font}}>
      {showFilter&&<div style={{padding:6}}><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Type to filter" style={{...inp,margin:0,fontSize:12,borderColor:T.primary}}/></div>}
      <div onScroll={e=>{const el=e.currentTarget;setAtEnd(el.scrollTop+el.clientHeight>=el.scrollHeight-4);}} style={{maxHeight:260,overflowY:"auto"}}>
        {shown.length===0&&<div style={{padding:"10px 12px",fontSize:11.5,color:T.textMut}}>No match</div>}
        {shown.map((o,i)=>{const on=o.v===cur;return <div key={o.v+"|"+i} onClick={()=>pick(o)} style={{padding:"9px 12px",fontSize:12.5,cursor:o.dis?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,background:on?T.primaryLight:"#fff",color:o.dis?T.textMut:on?T.primary:T.text,fontWeight:on?600:400,borderTop:i?`1px solid ${T.borderLight}`:"none",whiteSpace:"nowrap"}} onMouseEnter={e=>{if(!on&&!o.dis)e.currentTarget.style.background="#f8fafc";}} onMouseLeave={e=>{e.currentTarget.style.background=on?T.primaryLight:"#fff";}}>
          <span style={{overflow:"hidden",textOverflow:"ellipsis"}}>{o.l}</span>{on&&<Ic n="check" s={13} sw={2.6}/>}
        </div>;})}
      </div>
      {showFilter&&q&&<div style={{padding:"6px 12px",fontSize:10.5,color:T.textMut,borderTop:`1px solid ${T.borderLight}`,background:"#f8fafc"}}>{shown.length} of {list.length} match “{q}”</div>}
      {!q&&shown.length>7&&!atEnd&&<div style={{padding:"6px 12px",fontSize:10.5,color:T.textMut,borderTop:`1px solid ${T.borderLight}`,background:"#f8fafc"}}>+{shown.length-7} more — scroll for more</div>}
    </div>}
  </div>;
}
