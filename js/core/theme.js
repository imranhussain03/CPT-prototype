const{useState,useCallback,useEffect,useRef}=React;

// ═══════════════════════════════════════════════════════════════
// CLINIPACK — CPT PROCEDURE PACKAGE MANAGEMENT v2
// Full Workflow: New + Edit + Delegation + Versioning + SLAs
// All gaps from v1 addressed — demo-ready
// ═══════════════════════════════════════════════════════════════

const T={
  primary:"#006b5e",primaryDark:"#005549",primaryLight:"#e6f5f2",
  headerBg:"#005c4b",sidebarBg:"#fff",sidebarActive:"#e6f5f2",
  bodyBg:"#f4f6f8",cardBg:"#fff",border:"#e2e8f0",borderLight:"#f1f5f9",
  text:"#1e293b",textSec:"#64748b",textMut:"#94a3b8",
  ok:"#059669",warn:"#d97706",err:"#dc2626",info:"#2563eb",
  purple:"#7c3aed",teal:"#0d9488",
  font:"'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
};


// ─── SHARED STYLES ───────────────────────────────────────────
const lbl={display:"block",fontSize:11,fontWeight:600,color:T.textSec,marginBottom:4,letterSpacing:0.2,fontFamily:T.font};
const inp={width:"100%",padding:"8px 10px",borderRadius:6,border:`1px solid ${T.border}`,fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:T.font};
const th={padding:"8px 10px",fontSize:10,fontWeight:600,color:T.textSec,textAlign:"center",borderBottom:`2px solid ${T.border}`,textTransform:"uppercase",letterSpacing:0.3};
const td={padding:"8px 10px",fontSize:12,textAlign:"center",borderBottom:`1px solid ${T.borderLight}`};
