// ─── SUITE BAR — the SharePoint top bar the live app sits under ───────────────────────────
// Waffle → app launcher · centred "Search this site" · Next steps · Feedback · Help · account card.
// The account card carries the demo user switcher (every role group, every user).
const SB_ICON={
  waffle:"M5 5h.01 M12 5h.01 M19 5h.01 M5 12h.01 M12 12h.01 M19 12h.01 M5 19h.01 M12 19h.01 M19 19h.01",
  megaphone:"m3 11 18-5v12L3 14v-3z M11.6 16.8a3 3 0 1 1-5.8-1.6",
  feedback:"M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M2 20a5 5 0 0 1 10 0 M15 4h6v6 M21 4l-7 7 M14 16h7 M14 20h4",
  gear:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  help:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01",
  search:"M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3",
  x:"M18 6 6 18 M6 6l12 12",
  check:"M20 6 9 17l-5-5",
};
const SbIc=({n,s=16,w=2})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">{SB_ICON[n].split(" M").map((d,i)=><path key={i} d={(i?"M":"")+d}/>)}</svg>;
const SB_APPS=[["Outlook","#0f6cbd"],["OneDrive","#0364b8"],["Word","#185abd"],["Excel","#107c41"],["PowerPoint","#c43e1c"],["OneNote","#7719aa"],["SharePoint","#036c70"],["Teams","#5059c9"],["Viva","#5b5fc7"],["Engage","#0e7a8b"],["Power Automate","#0066ff"],["More apps","#64748b"]];
const SB_CREATE=["Document","Workbook","Presentation","Survey","Create more"];
const SB_SETTINGS=["Add a page","Add an app","Site contents","Site information","Site permissions","Apply a site template","Site performance","Site usage","Schedule site launch","Change the look"];
const SB_HELP=["Get started","Sharing & permissions","Documents & libraries","Data & lists","Pages","Sites","Troubleshoot"];

function SuiteBar({me,selUserId,switchUser}){
  const[open,setOpen]=useState(null); // launcher | steps | feedback | help | account
  const[q,setQ]=useState("");const[fb,setFb]=useState(null);const[hq,setHq]=useState("");
  const ref=useRef(null);
  useEffect(()=>{if(!open)return;const k=e=>{if(e.key==="Escape")setOpen(null);};const m=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(null);};
    document.addEventListener("keydown",k);document.addEventListener("mousedown",m);return()=>{document.removeEventListener("keydown",k);document.removeEventListener("mousedown",m);};},[open]);
  const tog=k=>{setOpen(open===k?null:k);setFb(null);};
  const iconBtn=(k,icon,title)=><button key={k} title={title} aria-label={title} onClick={()=>tog(k)} style={{width:40,height:48,border:"none",background:open===k?"rgba(255,255,255,0.18)":"transparent",color:"#fff",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}}><SbIc n={icon} s={18} w={1.7}/></button>;
  const initials=(me.name||"").replace(/^(Dr|Mr|Mrs|Ms|Eng)\.?\s+/i,"").split(/\s+/).map(x=>x[0]).slice(0,2).join("").toUpperCase();
  const panel=(title,children)=><div style={{position:"fixed",top:48,right:0,bottom:0,width:320,background:"#fff",boxShadow:"-8px 0 30px rgba(0,0,0,0.18)",zIndex:10060,display:"flex",flexDirection:"column",fontFamily:T.font}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 18px"}}><span style={{fontSize:18,fontWeight:600,color:"#242424"}}>{title}</span><button onClick={()=>setOpen(null)} aria-label="Close" style={{border:"none",background:"none",cursor:"pointer",color:"#424242"}}><SbIc n="x" s={16}/></button></div>
    <div style={{flex:1,overflowY:"auto",padding:"0 18px 18px"}}>{children}</div></div>;
  return <div ref={ref} style={{height:48,background:T.headerBg,display:"flex",alignItems:"center",flexShrink:0,position:"relative",zIndex:10055}}>
    <button title="App launcher" aria-label="App launcher" onClick={()=>tog("launcher")} style={{width:48,height:48,border:"none",background:open==="launcher"?"rgba(255,255,255,0.18)":"transparent",color:"#fff",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}}><SbIc n="waffle" s={20} w={3}/></button>
    <span style={{color:"#fff",fontSize:16,fontWeight:600,marginLeft:4}}>SharePoint</span>
    <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",width:"min(468px,40vw)",height:32,background:"#fff",borderRadius:4,display:"flex",alignItems:"center",gap:8,padding:"0 12px",color:"#616161"}}>
      <SbIc n="search" s={15}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search this site" style={{border:"none",outline:"none",flex:1,fontSize:13,fontFamily:T.font,color:"#242424",background:"transparent"}}/>
    </div>
    <div style={{marginLeft:"auto",display:"flex",alignItems:"center"}}>
      {iconBtn("steps","megaphone","Next steps to improve your site")}
      {iconBtn("feedback","feedback","Provide feedback")}
      {iconBtn("settings","gear","Settings")}
      {iconBtn("help","help","Help")}
      <button title={"Account manager for "+me.name} aria-label={"Account manager for "+me.name} onClick={()=>tog("account")} style={{width:48,height:48,border:"none",background:open==="account"?"rgba(255,255,255,0.18)":"transparent",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{width:32,height:32,borderRadius:"50%",background:"#fff",color:T.headerBg,border:"2px solid rgba(255,255,255,0.7)",fontSize:12,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center"}}>{initials}</span>
      </button>
    </div>

    {open==="launcher"&&<div style={{position:"fixed",top:52,left:4,width:460,background:"#fff",borderRadius:8,boxShadow:"0 12px 40px rgba(0,0,0,0.22)",zIndex:10060,padding:14,fontFamily:T.font}}>
      <div style={{display:"flex",alignItems:"center",gap:8,background:"#f5f5f5",borderRadius:4,padding:"7px 10px",color:"#616161",marginBottom:14}}><SbIc n="search" s={14}/><input autoFocus placeholder="Find Microsoft 365 apps" style={{border:"none",outline:"none",background:"transparent",flex:1,fontSize:12.5,fontFamily:T.font}}/></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px 6px",paddingBottom:14,borderBottom:"1px solid #e5e5e5"}}>
        {SB_APPS.map(([n,c])=><div key={n} onClick={()=>setOpen(null)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer",fontSize:11,color:"#424242",textAlign:"center"}}><span style={{width:34,height:34,borderRadius:8,background:c,color:"#fff",fontWeight:700,fontSize:13,display:"inline-flex",alignItems:"center",justifyContent:"center"}}>{n==="More apps"?"⋯":n[0]}</span>{n}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,paddingTop:14}}>
        {SB_CREATE.map(n=><div key={n} onClick={()=>setOpen(null)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer",fontSize:11,color:"#424242"}}><span style={{width:44,height:34,borderRadius:4,border:"1px solid #e0e0e0",background:n==="Create more"?"#fff":"#f5f5f5",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#616161"}}>{n==="Create more"?"+":""}</span>{n}</div>)}
      </div>
    </div>}

    {open==="steps"&&panel("Next steps",<div style={{fontSize:12.5,color:"#616161",lineHeight:1.6}}>You’re all caught up — there are no suggested next steps for this site right now.</div>)}

    {open==="feedback"&&panel("Submit feedback",<div>
      <div style={{fontSize:12,color:"#616161",marginBottom:10}}>Classify your feedback</div>
      {["Give a compliment","Report a problem","Make a suggestion"].map(k=><button key={k} onClick={()=>setFb(k)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",marginBottom:8,padding:"9px 12px",borderRadius:4,border:fb===k?"2px solid #242424":"none",background:"#0f6cbd",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:T.font}}>{k}</button>)}
      {fb&&<textarea autoFocus placeholder="Tell us more…" style={{...inp,height:80,marginTop:4,fontFamily:T.font}}/>}
      <div style={{fontSize:11,color:"#616161",margin:"10px 0 14px"}}>Learn about data use, your rights, contacting you</div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
        <button disabled={!fb} onClick={()=>setOpen(null)} style={{padding:"6px 18px",borderRadius:4,border:"none",background:fb?"#0f6cbd":"#f0f0f0",color:fb?"#fff":"#bdbdbd",fontSize:13,cursor:fb?"pointer":"default"}}>Submit</button>
        <button onClick={()=>setOpen(null)} style={{padding:"6px 18px",borderRadius:4,border:"1px solid #d1d1d1",background:"#fff",fontSize:13,cursor:"pointer"}}>Cancel</button>
      </div></div>)}

    {open==="settings"&&panel("Settings",<div>
      <div style={{fontSize:14,fontWeight:600,color:"#242424",margin:"2px 0 8px"}}>SharePoint</div>
      {SB_SETTINGS.map(x=><div key={x} onClick={()=>setOpen(null)} style={{padding:"8px 4px",fontSize:13,color:"#242424",cursor:"pointer",borderRadius:4}} onMouseEnter={e=>e.currentTarget.style.background="#f5f5f5"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{x}</div>)}
      <div style={{borderTop:"1px solid #e5e5e5",margin:"14px 0 10px"}}/>
      <div style={{fontSize:14,fontWeight:600,color:"#242424",marginBottom:8}}>Microsoft 365</div>
      {["View all","Language and time zone","Password","Contact preferences"].map(x=><div key={x} style={{padding:"8px 4px",fontSize:13,color:x==="View all"?"#0f6cbd":"#242424",cursor:"pointer"}}>{x}</div>)}
    </div>)}

    {open==="help"&&panel("Help",<div>
      <div style={{display:"flex",alignItems:"center",gap:8,border:"1px solid #d1d1d1",borderRadius:4,padding:"7px 10px",color:"#616161",marginBottom:12}}><SbIc n="search" s={14}/><input autoFocus value={hq} onChange={e=>setHq(e.target.value)} placeholder="Search help" style={{border:"none",outline:"none",flex:1,fontSize:12.5,fontFamily:T.font}}/></div>
      {SB_HELP.filter(h=>!hq||h.toLowerCase().includes(hq.toLowerCase())).map(h=><div key={h} style={{padding:"8px 4px",fontSize:12.5,color:"#242424",cursor:"pointer",borderBottom:"1px solid #f0f0f0"}}>{h}</div>)}
      <div style={{marginTop:16,padding:12,border:"1px solid #e5e5e5",borderRadius:6}}>
        <div style={{fontSize:13,fontWeight:600,color:"#242424",marginBottom:8}}>Explore SharePoint</div>
        <div style={{height:80,borderRadius:4,background:"linear-gradient(135deg,#eef6ff,#f5f5f5)",marginBottom:8}}/>
        <div style={{fontSize:12,color:"#616161"}}>These features are rolling out and might still be coming to your organization.</div>
      </div></div>)}

    {open==="account"&&<div style={{position:"fixed",top:48,right:0,width:380,maxHeight:"calc(100vh - 56px)",background:"#fff",boxShadow:"0 12px 40px rgba(0,0,0,0.22)",zIndex:10060,display:"flex",flexDirection:"column",fontFamily:T.font}}>
      <div style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",fontSize:12,color:"#424242"}}><span>{APP.orgFull}</span><span style={{cursor:"pointer"}}>Sign out</span></div>
      <div style={{display:"flex",alignItems:"center",gap:16,padding:"6px 18px 16px"}}>
        <span style={{width:72,height:72,borderRadius:"50%",border:"1px solid #d1d1d1",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:26,color:"#424242"}}>{initials}</span>
        <div style={{minWidth:0}}><div style={{fontSize:16,fontWeight:700,color:"#242424"}}>{me.name}</div><div style={{fontSize:12,color:"#424242"}}>{me.email}</div>
          <div style={{fontSize:12,color:"#0f6cbd",marginTop:2}}>View account</div><div style={{fontSize:12,color:"#0f6cbd"}}>My profile</div></div>
      </div>
      <div style={{padding:"10px 16px",borderTop:"1px solid #e5e5e5",background:"#f8fafc"}}><div style={{fontSize:12,fontWeight:700,color:T.text}}>Switch User (Demo)</div><div style={{fontSize:10,color:T.textSec,marginTop:2}}>Select a user to view from their perspective</div></div>
      <div style={{overflowY:"auto",flex:1}}>
        {ROLE_GROUPS.map(grp=>{const users=U.filter(u=>u.role===grp.role);if(!users.length)return null;return <div key={grp.role}>
          <div style={{padding:"8px 16px",background:"#f9fafb",fontSize:10,fontWeight:700,color:grp.color,textTransform:"uppercase",letterSpacing:0.5,borderBottom:`1px solid ${T.borderLight}`}}>{grp.label} ({users.length})</div>
          {users.map(u=><div key={u.id} onClick={()=>{setOpen(null);switchUser(u);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",cursor:"pointer",borderBottom:`1px solid ${T.borderLight}`,background:u.id===selUserId?T.primaryLight:"#fff"}} onMouseEnter={e=>{if(u.id!==selUserId)e.currentTarget.style.background="#f8fafc";}} onMouseLeave={e=>{if(u.id!==selUserId)e.currentTarget.style.background="#fff";}}>
            <Av user={u} size={30} color={grp.color}/>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:u.id===selUserId?700:500}}>{u.name}</div><div style={{fontSize:10,color:T.textMut}}>{u.title}</div><div style={{fontSize:9.5,color:T.textMut}}>{u.email}</div></div>
            <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:9,color:T.textSec}}>{u.dept}</div><div style={{fontSize:9,color:T.textMut}}>{u.branch}{u.isSiteAdmin?" · CPT-Admin":""}</div></div>
            {u.id===selUserId&&<span style={{color:T.ok,display:"inline-flex"}}><SbIc n="check" s={14} w={2.6}/></span>}
          </div>)}
        </div>;})}
      </div>
    </div>}
  </div>;
}
