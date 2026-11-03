// ─── MASTER DATA ─────────────────────────────────────────────
// ─── PRODUCT IDENTITY ───────────────────────────────────────
const LOGO="assets/innomick-logo.png";
const APP={
  name:"CliniPack",
  full:"CliniPack — Clinical Package Costing & Pricing Platform",
  tagline:"Advance care. Understand cost. Price with confidence.",
  org:"Innomick Technology",           // the tenant / issuing organisation
  orgFull:"Innomick Technology",
};

const BRANCHES=[{code:"CEN",name:"Central Hospital"},{code:"NTH",name:"North Hospital"}];
const SPECIALTIES=["Cardiac Catheterization","Dental","Endoscopy","ENT","General Surgery","Interventional","IVF","Oby/Gyn","Ophthalmology","Orthopedics","Pediatric","Pediatric Surgery","Plastic Surgery","Respiratory","Thoracic Surgery","Urology"];
// Doctor Request pick-lists (Batch 2). Operation Skill list is editable in Setup.
const PATIENT_TYPES=["In-Patient","Out-Patient","Both"];
const ANESTHESIA_OPTS=["Required","Not Required"];
const GENDER_OPTS=["Male","Female","Both"];
const OP_SKILLS_DEFAULT=[
  {id:1,title:"Simple",isActive:true},
  {id:2,title:"Minor",isActive:true},
  {id:3,title:"Major",isActive:true},
  {id:4,title:"Advanced",isActive:true},
  {id:5,title:"With Special Skills",isActive:true},
  {id:6,title:"Cathlab",isActive:true},
  {id:7,title:"Endoscopy",isActive:true},
  {id:8,title:"Cardiact",isActive:false},
  {id:9,title:"Basic Procedure",isActive:true},
  {id:10,title:"Intermediate Procedure",isActive:true},
  {id:11,title:"Complex Procedure",isActive:true},
  {id:12,title:"Highly Specialized",isActive:true},
  {id:13,title:"Microsurgery",isActive:true},
  {id:14,title:"Laparoscopic Surgery",isActive:true},
  {id:15,title:"Robotic Surgery",isActive:true},
  {id:16,title:"Emergency Procedure",isActive:true},
  {id:17,title:"Diagnostic Procedure",isActive:true},
  {id:18,title:"Therapeutic Procedure",isActive:true},
  {id:19,title:"Minimally Invasive",isActive:true},
  {id:20,title:"Reconstructive Surgery",isActive:true},
  {id:21,title:"Critical Care Procedure",isActive:true},
  {id:22,title:"Advanced Intervention",isActive:true},
  {id:23,title:"Specialized Clinical Procedure",isActive:true},
  {id:24,title:"Robotic",isActive:true}
];

const CPT_DB=[
  {code:"31276",name:"Nasal/sinus endoscopy, surgical with frontal sinus exploration",spec:"ENT"},
  {code:"69421",name:"Myringotomy including aspiration and/or eustachian tube inflation",spec:"ENT"},
  {code:"30520",name:"Septoplasty or submucous resection",spec:"ENT"},
  {code:"30802",name:"Ablation, soft tissue of inferior turbinates, intramural",spec:"ENT"},
  {code:"30801",name:"Ablation, soft tissue of inferior turbinates, superficial",spec:"ENT"},
  {code:"30130",name:"Excision inferior turbinate, partial or complete",spec:"ENT"},
  {code:"21315",name:"Closed treatment of nasal bone fracture without stabilization",spec:"ENT"},
  {code:"30420",name:"Rhinoplasty, primary; including major septal repair",spec:"ENT"},
  {code:"30430",name:"Rhinoplasty, secondary; minor revision",spec:"ENT"},
  {code:"11442",name:"Excision, other benign lesion incl. margins, face/ears/nose, 1.1-2.0 cm",spec:"ENT"},
  {code:"11444",name:"Excision, other benign lesion incl. margins, face/ears/nose, 3.1-4.0 cm",spec:"ENT"},
  {code:"30560",name:"Lysis intranasal synechia",spec:"ENT"},
  {code:"42415",name:"Excision of parotid tumor or parotid gland; lateral lobectomy",spec:"ENT"},
  {code:"42825",name:"Tonsillectomy, primary or secondary; younger than age 12",spec:"ENT"},
  {code:"42826",name:"Tonsillectomy, primary or secondary; age 12 or over",spec:"ENT"},
  {code:"42821",name:"Tonsillectomy and adenoidectomy; age 12 or over",spec:"ENT"},
  {code:"27447",name:"Total Knee Replacement",spec:"Orthopedics"},
  {code:"27130",name:"Total Hip Replacement",spec:"Orthopedics"},
  {code:"33533",name:"CABG Single Arterial Graft",spec:"Cardiac Catheterization"},
  {code:"43239",name:"Upper GI Endoscopy with Biopsy",spec:"Endoscopy"},
  {code:"47562",name:"Laparoscopic Cholecystectomy",spec:"General Surgery"},
  {code:"58661",name:"Laparoscopic Removal of Adnexal Structures",spec:"Oby/Gyn"},
  {code:"69436",name:"Tympanostomy",spec:"ENT"},
  {code:"66984",name:"Cataract Surgery with IOL",spec:"Ophthalmology"},
  {code:"19301",name:"Partial Mastectomy",spec:"General Surgery"},
  {code:"55866",name:"Laparoscopic Prostatectomy",spec:"Urology"},
  {code:"29881",name:"Knee Arthroscopy with Meniscectomy",spec:"Orthopedics"},
  {code:"43235",name:"Diagnostic Upper GI Endoscopy",spec:"Endoscopy"},
  {code:"20550",name:"Injection, tendon sheath",spec:"Orthopedics"},
  {code:"10021",name:"Fine needle aspiration biopsy",spec:"General Surgery"},
  {code:"31575",name:"Diagnostic laryngoscopy",spec:"ENT"},
  {code:"45378",name:"Diagnostic colonoscopy",spec:"Gastroenterology"},
  {code:"58558",name:"Hysteroscopy with surgical procedure",spec:"Oby/Gyn"},
  {code:"64721",name:"Carpal tunnel release",spec:"Orthopedics"}
];

// Setup-managed masters (confirmed in review): CPT Specialty and CPT Codes both come from Setup.
// NOTE: client confirmed the CPT master carries Code + Description only. The Specialty link below is
// retained so the cascade keeps working — pending confirmation of how CPT maps to Specialty.
const SPECIALTIES_DEFAULT=[...SPECIALTIES,"Heart Surgery","Dermatology","Neurology","Pediatrics","Oncology","Nephrology","Gastroenterology","Pulmonology","Vascular Surgery","Rheumatology","Psychiatry","Physical Therapy","Hand Surgery"].map((s,i)=>({id:i+1,title:s,isActive:s!=="Heart Surgery"}));
const CPT_CODES_DEFAULT=CPT_DB.map((c,i)=>({id:i+1,code:c.code,name:c.name,spec:c.spec,isActive:true}));

// Consumable Item Master — Item Evaluation Master — shared repository (name, code, Category, Sub-category, UOM, Unit Cost, Sale Price, Last Updated)
const CONS_MASTER=[
  {code:"1020701010474",name:"CELON PRO BREATH APPLICATOR",cat:"Consumables",sub:"ENT Disposables",updated:"2026-03-10 09:00",uoms:[{unit:"PIECE",cost:80.000,sale:104.000}]},
  {code:"CON-001",name:"Surgical Gloves (Sterile)",cat:"Consumables",sub:"Surgical Disposables",updated:"2026-06-12 09:15",uoms:[{unit:"Pair",cost:0.850,sale:1.200},{unit:"Box/50",cost:38.500,sale:52.000}]},
  {code:"CON-002",name:"Suture Vicryl 3-0",cat:"Consumables",sub:"Sutures",updated:"2026-06-10 14:20",uoms:[{unit:"Each",cost:4.200,sale:6.000}]},
  {code:"CON-003",name:"Gauze Swabs 10x10",cat:"Consumables",sub:"Wound Care",updated:"2026-05-28 11:00",uoms:[{unit:"Pack/5",cost:1.100,sale:1.650},{unit:"Box/100",cost:18.750,sale:26.000}]},
  {code:"CON-004",name:"IV Cannula 18G",cat:"Consumables",sub:"IV & Tubing",updated:"2026-06-05 08:45",uoms:[{unit:"Each",cost:0.650,sale:1.000}]},
  {code:"CON-005",name:"Surgical Drape Set",cat:"Consumables",sub:"Surgical Disposables",updated:"2026-06-12 09:15",uoms:[{unit:"Set",cost:12.500,sale:17.500}]},
  {code:"CON-006",name:"Foley Catheter 16Fr",cat:"Consumables",sub:"Catheters & Tubing",updated:"2026-05-30 16:10",uoms:[{unit:"Each",cost:3.200,sale:4.600}]},
  {code:"CON-007",name:"Suction Tubing",cat:"Consumables",sub:"Catheters & Tubing",updated:"2026-05-30 16:10",uoms:[{unit:"Each",cost:2.800,sale:4.000}]},
  {code:"CON-008",name:"Electrosurgical Pencil",cat:"Consumables",sub:"Instruments",updated:"2026-06-01 10:30",uoms:[{unit:"Each",cost:8.500,sale:12.000}]},
  {code:"CON-009",name:"Wound Closure Strips",cat:"Consumables",sub:"Wound Care",updated:"2026-05-28 11:00",uoms:[{unit:"Pack",cost:3.750,sale:5.400}]},
  {code:"CON-010",name:"Surgical Blade No.10",cat:"Consumables",sub:"Instruments",updated:"2026-06-01 10:30",uoms:[{unit:"Each",cost:0.450,sale:0.700},{unit:"Box/100",cost:38.000,sale:52.000}]},
  {code:"CON-011",name:"Hemostatic Clip Applier",cat:"Consumables",sub:"Instruments",updated:"2026-07-08 10:00",uoms:[{unit:"Each",cost:52.000,sale:72.000}]},
  {code:"CON-012",name:"Laparoscopic Trocar 10mm",cat:"Consumables",sub:"Instruments",updated:"2026-06-08 13:25",uoms:[{unit:"Each",cost:65.000,sale:89.000}]},
];
// Drugs Item Master — Item Evaluation Master — shared repository (name, code, Category, Sub-category, UOM, Unit Cost, Sale Price, Last Updated)
const DRUGS_MASTER=[
  {code:"20117010014",name:"SODIUM CHLORIDE 0.9% IV KS-100ML",cat:"Drugs",sub:"IV Fluids",updated:"2026-03-10 09:00",uoms:[{unit:"IV fluid Pack",cost:0.400,sale:0.550}]},
  {code:"DRG-001",name:"Propofol 200mg/20ml",cat:"Drugs",sub:"Anesthetics",updated:"2026-06-11 09:00",uoms:[{unit:"Ampoule",cost:3.500,sale:5.000}]},
  {code:"DRG-002",name:"Fentanyl 100mcg/2ml",cat:"Drugs",sub:"Analgesics",updated:"2026-06-11 09:00",uoms:[{unit:"Ampoule",cost:1.200,sale:1.800}]},
  {code:"DRG-003",name:"Cefazolin 1g",cat:"Drugs",sub:"Antibiotics",updated:"2026-06-03 15:40",uoms:[{unit:"Vial",cost:2.800,sale:4.100}]},
  {code:"DRG-004",name:"Ondansetron 4mg/2ml",cat:"Drugs",sub:"Antiemetics",updated:"2026-05-29 12:15",uoms:[{unit:"Ampoule",cost:1.500,sale:2.200}]},
  {code:"DRG-005",name:"Morphine 10mg/ml",cat:"Drugs",sub:"Analgesics",updated:"2026-07-08 10:00",uoms:[{unit:"Ampoule",cost:2.600,sale:3.600}]},
  {code:"DRG-006",name:"Normal Saline 0.9% 1000ml",cat:"Drugs",sub:"IV Fluids",updated:"2026-05-25 10:05",uoms:[{unit:"Bag",cost:0.950,sale:1.400}]},
  {code:"DRG-007",name:"Midazolam 5mg/ml",cat:"Drugs",sub:"Anesthetics",updated:"2026-06-11 09:00",uoms:[{unit:"Ampoule",cost:1.800,sale:2.600}]},
  {code:"DRG-008",name:"Heparin 5000 IU/ml",cat:"Drugs",sub:"Anticoagulants",updated:"2026-06-02 14:50",uoms:[{unit:"Vial",cost:4.200,sale:6.000}]},
  {code:"DRG-009",name:"Lidocaine 2% 20ml",cat:"Drugs",sub:"Anesthetics",updated:"2026-06-11 09:00",uoms:[{unit:"Vial",cost:1.100,sale:1.650}]},
  {code:"DRG-010",name:"Paracetamol IV 1g/100ml",cat:"Drugs",sub:"Analgesics",updated:"2026-05-27 09:35",uoms:[{unit:"Bag",cost:2.400,sale:3.500}]},
];
// Item master index + lookups (Batch 4: derive Category / Sub-category / Sale / Last-updated by item code)
const ITEM_INDEX={};[...CONS_MASTER,...DRUGS_MASTER].forEach(m=>{ITEM_INDEX[m.code]=m;});
const itemMeta=code=>ITEM_INDEX[code]||{};
const saleForUom=(code,uom)=>{const m=ITEM_INDEX[code];if(!m||!m.uoms)return null;const u=m.uoms.find(x=>x.unit===uom);return u&&u.sale!=null?u.sale:null;};
// Master Categories — two-level hierarchy (parent + sub), managed in Setup, used to group & enter template items
const MASTER_CATEGORIES=[
  {id:1,title:"Consumables",parentId:null,code:"CON",isActive:true,sortOrder:1},
  {id:2,title:"Drugs",parentId:null,code:"DRG",isActive:true,sortOrder:2},
  {id:101,title:"Catheters & Tubing",parentId:1,code:"CON-CAT",isActive:true,sortOrder:1},
  {id:102,title:"Instruments",parentId:1,code:"CON-INS",isActive:true,sortOrder:2},
  {id:103,title:"IV & Tubing",parentId:1,code:"CON-IVT",isActive:true,sortOrder:3},
  {id:104,title:"Surgical Disposables",parentId:1,code:"CON-SUR",isActive:true,sortOrder:4},
  {id:105,title:"Sutures",parentId:1,code:"CON-SUT",isActive:true,sortOrder:5},
  {id:106,title:"Wound Care",parentId:1,code:"CON-WND",isActive:true,sortOrder:6},
  {id:201,title:"Analgesics",parentId:2,code:"DRG-ANL",isActive:true,sortOrder:1},
  {id:202,title:"Anesthetics",parentId:2,code:"DRG-ANE",isActive:true,sortOrder:2},
  {id:203,title:"Antibiotics",parentId:2,code:"DRG-ABT",isActive:true,sortOrder:3},
  {id:204,title:"Antiemetics",parentId:2,code:"DRG-AEM",isActive:true,sortOrder:4},
  {id:205,title:"Anticoagulants",parentId:2,code:"DRG-ACG",isActive:true,sortOrder:5},
  {id:206,title:"IV Fluids",parentId:2,code:"DRG-IVF",isActive:true,sortOrder:6},
];
// Request type (Batch 6 #30): New / Edit / Deactivation / Reactivation
const reqTypeOf=p=>p&&p.migrated?"Migrated":(p&&p.reqType?p.reqType:(p&&p.version>1?"Edit":"New"));
const reqTypeStyle=t=>t==="Migrated"?{c:"#0d9488",bg:"#f0fdfa"}:t==="Edit"?{c:"#b45309",bg:"#fffbeb"}:t==="Deactivation"?{c:"#dc2626",bg:"#fef2f2"}:t==="Reactivation"?{c:"#059669",bg:"#ecfdf5"}:{c:"#2563eb",bg:"#eef2ff"};
const TypeBadge=({p})=>{const t=reqTypeOf(p);const s=reqTypeStyle(t);return <span style={{display:"inline-block",padding:"2px 9px",borderRadius:10,fontSize:10,fontWeight:700,color:s.c,background:s.bg}}>{t}</span>;};
// Attachments control (Batch 6 #22) — used in New Request & Edit
// Attachments are objects {name, step, by, date}; legacy string filenames are tolerated everywhere.
const attName=f=>typeof f==="string"?f:((f&&f.name)||"");
const attMeta=f=>typeof f==="string"?null:f;
function AttachmentBox({files=[],onChange,step=null,by=null,lockExisting=false,existingCount=0}){
  const[view,setView]=useState(null);
  const[renaming,setRenaming]=useState(null);
  const[rn,setRn]=useState("");
  const add=e=>{const items=Array.from(e.target.files||[]).map(f=>({name:f.name,size:f.size,step,by,date:new Date().toISOString().slice(0,10)}));if(items.length)onChange([...(files||[]),...items]);e.target.value="";};
  const del=i=>onChange(files.filter((_,j)=>j!==i));
  const doRename=i=>{const nm=rn.trim();if(!nm){setRenaming(null);return;}onChange(files.map((f,j)=>j===i?(typeof f==="string"?{name:nm}:{...f,name:nm}):f));setRenaming(null);};
  return <div>
    {view!=null&&files[view]&&<div onClick={()=>setView(null)} style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.55)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:10,width:"100%",maxWidth:520,padding:24,textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{marginBottom:8,display:"flex",justifyContent:"center"}}><Ic n="fileText" s={30} sw={1.6} style={{color:T.textMut}}/></div>
        <div style={{fontSize:14,fontWeight:700,color:T.text}}>{attName(files[view])}</div>
        {attMeta(files[view])?.step&&<div style={{fontSize:11,color:T.textMut,marginTop:4}}>Attached at: {attMeta(files[view]).step}{attMeta(files[view]).by?` · by ${attMeta(files[view]).by}`:""}</div>}
        <div style={{fontSize:11,color:T.textSec,margin:"16px 0",padding:"14px",background:"#f8fafc",borderRadius:8}}>Preview opens here in the live system. This prototype stores the file reference, not the file content.</div>
        <button onClick={()=>setView(null)} style={{padding:"8px 20px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>Close</button>
      </div>
    </div>}
    <label style={{display:"block",padding:16,border:`2px dashed #cbd5e1`,borderRadius:8,textAlign:"center",color:"#64748b",cursor:"pointer",fontSize:12,background:"#fafbfc"}}>Click to attach files (reports, quotes, images — any document)
      <div style={{fontSize:10.5,color:T.textMut,marginTop:4}}>Up to 15 MB each · pdf, png, jpg, jpeg, gif, bmp, tif, tiff, doc, docx, xls, xlsx…</div>
      <input type="file" multiple style={{display:"none"}} onChange={add}/></label>
    {files.length>0&&<div style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>
      {files.map((f,i)=>{const nm=attName(f);const meta=attMeta(f);const locked=lockExisting&&i<existingCount;
        return <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"#f0fdf4",border:`1px solid #05966930`,borderRadius:6,fontSize:11}}>
          {renaming===i
            ? <><input autoFocus value={rn} onChange={e=>setRn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")doRename(i);if(e.key==="Escape")setRenaming(null);}} onBlur={()=>doRename(i)} style={{flex:1,fontSize:11,padding:"3px 6px",border:`1px solid ${T.primary}`,borderRadius:4,fontFamily:T.font}}/><span onMouseDown={()=>doRename(i)} style={{cursor:"pointer",color:T.ok,fontWeight:700}} title="Save">✓</span><span onMouseDown={()=>setRenaming(null)} style={{cursor:"pointer",color:T.textMut,fontWeight:700}} title="Cancel">✕</span></>
            : <><span onClick={()=>setView(i)} style={{flex:1,cursor:"pointer",color:T.info,textDecoration:"underline",textDecorationColor:"#05966950"}} title="Open">{nm}</span>
               {f&&f.size!=null&&<span style={{fontSize:10,color:T.textMut}}>{Math.round(f.size/1024)} KB</span>}
               {meta?.step&&<span style={{fontSize:9,color:T.textMut,background:"#fff",padding:"1px 6px",borderRadius:8,border:`1px solid ${T.border}`}}>{meta.step}</span>}
               <span onClick={()=>{setRenaming(i);setRn(nm);}} style={{cursor:"pointer",color:T.textMut}} title="Rename">✎</span>
               {locked
                 ? <span style={{color:T.textMut,fontSize:12}} title="Added earlier in the request — cannot be removed"><Ic n="lock" s={11}/></span>
                 : <span onClick={()=>del(i)} style={{cursor:"pointer",color:"#dc2626",fontWeight:700}} title="Remove">✕</span>}</>}
        </div>;})}
    </div>}
  </div>;
}
// Approval workflow config (Batch 7 #19) — admin can change the approver per step & enable/disable steps
// One approver per stage PER BRANCH (each may delegate). CEN = Central Hospital, NTH = North Hospital.
// Approval config — `num` MUST match STAGES.num (1..15). This is the single source of truth for
// WHO may act at each step: canAct() resolves the approver by name for the request's branch.
// `role` is the fallback used only when no approver name is configured for a branch.
const TPL_MASTERS_SEED=[{"no":"284","type":1,"name":"ADENOIDECTOMY + CAT (TONSILLECTOMY BY COBLAT","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202523938499","Legacy item 284-1",1,"PACKET",59.865,80.136],["10202981836553","Legacy item 284-2",1,"PACKET",12.823,17.165],["10202725763863","Legacy item 284-3",1,"PIECE",11.61,15.541],["10202644854973","Legacy item 284-4",1,"PIECE",53.525,71.649]]},{"no":"294","type":1,"name":"Tonsillectomy, primary or secondary; age 12 ","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202549008934","Legacy item 294-1",1,"PIECE",7.397,10.693],["10202691682483","Legacy item 294-2",1,"PAIR",7.706,11.139],["10202163469421","Legacy item 294-3",1,"PACKET",26.975,38.993]]},{"no":"296","type":1,"name":"COBLATION PARTIAL TONSILLECTOMY","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202777129422","Legacy item 296-1",1,"PACKET",58.86,79.296],["10202166423868","Legacy item 296-2",1,"PACKET",24.916,33.567],["10202728720317","Legacy item 296-3",1,"PAIR",51.773,69.748]]},{"no":"302","type":1,"name":"Myringotomy including aspiration and/or eust","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202150017772","Legacy item 302-1",1,"PACKET",18.309,25.855],["10202410965605","Legacy item 302-2",1,"PAIR",9.386,13.254],["10202254892713","Legacy item 302-3",1,"PACKET",13.645,19.269]]},{"no":"304","type":1,"name":"Septoplasty or submucous resection, with or ","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202701571670","Legacy item 304-1",1,"PACKET",30.013,46.66],["10202724488420","Legacy item 304-2",1,"PACKET",12.948,20.13],["10202786028113","Legacy item 304-3",1,"PIECE",50.457,78.442]]},{"no":"306","type":1,"name":"Ablation, soft tissue of inferior turbinates","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202864623112","Legacy item 306-1",1,"PIECE",24.222,35.78],["10202764656492","Legacy item 306-2",1,"PIECE",35.419,52.32],["10202670930264","Legacy item 306-3",1,"PAIR",22.57,33.34],["10202934543046","Legacy item 306-4",1,"PAIR",52.933,78.192]]},{"no":"308","type":1,"name":"Ablation, soft tissue of inferior turbinates","ward":false,"src":"P_REPORT extract","items":[["1020701010474","CELON PRO BREATH APPLICATOR WB990007",1.0,"PIECE",80.0,104.0],["10202010400005","ANAESTHETIC MASK W/ADJUST. AIR CUSHI",1.0,"PIECE",0.474,0.735],["10202040500011","SUCTION & DIATHERMY BAG 707030-25",1.0,"PIECE",0.235,0.306],["10202092200001","SURGICAL BLADE NO-15",1.0,"PIECE",0.015,0.029],["1020211040220","SUTURE VICRYL PLUS VCP663H UND 70CM ",1.0,"PIECE",1.114,1.449],["10202101400001","SUCTION CATHETER WITH VALVE-14",1.0,"PIECE",0.075,0.098],["10202092300002","STERILE GLOVES POWDER FREE SIZE 8.0",1.0,"PAIR",0.13,0.221],["1020202010227","DISPOSABLE EYE GUARD ADULT S2020",1.0,"PAIR",0.76,0.988],["10202080600009","SYRINGE 50ML CATHETER TIP",1.0,"PIECE",0.075,0.185],["10202092300006","Sterile Gloves Powder Free Size 6.0",1.0,"PAIR",0.13,0.221],["10202041000015","Transparent Film Dressing With Pad 9",1.0,"PIECE",0.37,0.481],["10202080600007","SYRINGE 50/60ML WITH LUER LOCK",1.0,"PIECE",0.073,0.211],["10202010800014","ET Tube Oral Preformed Cuffed Ch-7.5",1.0,"PIECE",0.775,1.56],["10202091200004","LATEX EXAM GLOVES POWDER FREE(LARGE)",10.0,"PIECE",0.01,0.013],["10202090900010","ECG Electrode 50 mm Adult Disposable",3.0,"PIECE",0.018,0.03],["10202090700007","CO2 ABSORBER (CLIC Absorber) DISP(SO",1.0,"1of3",8.52,11.076],["10202080600010","SYRINGE 20ML L/LOCK WITH NEEDLE 21GX",5.0,"PIECE",0.029,0.12],["10202080600006","SYRINGE 1ML LUER SLIP WITH NEEDLE",1.0,"PIECE",0.013,0.039],["10202080600004","SYRINGE 5ML L/LOCK WITH NEEDLE G22X1",5.0,"PIECE",0.013,0.05],["10202080600002","SYRINGE 3ML L/LOCK WITH NEEDLE 21X11",5.0,"PIECE",0.012,0.044],["10202080600001","SYRINGE 10ML L/LOCK WITH NEEDLE G21X",5.0,"PIECE",0.06,0.078],["10202010900002","GUEDEL AIRWAY SIZE-04 100MM (RED)",1.0,"PIECE",0.055,0.072],["10202010500003","Filter-Guard Bacterial Filter",1.0,"PIECE",0.5,0.72],["10202010500001","Anesthesia Breathing Circuit Double ",1.0,"PIECE",3.7,8.125],["1020204070012","GAUZE SWABS STERILE 10X10CM 12PLY DO",2.0,"PACKET",0.155,0.208],["10202101500005","SUCTION TUBING",3.0,"PIECE",0.475,0.923],["10202101500004","SUCTION BAG / LINER 2 LITER",2.0,"PIECE",0.8,1.69],["10202011000005","LARYNGOSCOPE BLADE DISP. SS MACINTOS",1.0,"PIECE",1.5,2.925],["10202040500006","UNIVERSAL PACK",1.0,"PIECE",4.35,5.655],["10202040800004","SURGICAL GOWN STERILE X-LARGE",1.0,"PIECE",1.1,1.43],["10202040800002","SURGICAL GOWN STERILE LARGE",1.0,"PIECE",1.05,1.365],["10202041000019","Wound Closure Strip 1/2\" X 4\" 3M",1.0,"PIECE",0.21,0.273],["10202091200006","LATEX EXAM GLOVES POWDER FREE(MEDIUM",10.0,"PIECE",0.01,0.013],["10202091700005","INTERNAL NASAL SPLINT SILICON PRECUT",1.0,"PIECE",7.0,9.1],["1020209161931","SCH08 BOVIE SUCTION COAGULATOR HANDS",1.0,"PIECE",5.5,7.15],["10202091100005","RAPID RHINO NASAL PACKING # RR750",2.0,"PIECE",7.5,9.75],["10202091000003","ELECTROSURGICAL PLATE ADULT DUAL 250",1.0,"PIECE",0.35,0.455],["10202092300003","STERILE GLOVES POWDER FREE SIZE 6.5",1.0,"PIECE",0.17,0.221],["10202092300001","STERILE GLOVES POWDER FREE SIZE 7.0",1.0,"PIECE",0.17,0.221],["10202092300004","STERILE GLOVES POWDER FREE SIZE 7.5",1.0,"PIECE",0.13,0.221],["10202040700009","TELACOMP STERILE 16PLY 10X10CM 45214",2.0,"PIECE",0.404,0.525],["10202040400009","Underpad Disposable 90 X 60 Cm",6.0,"PIECE",0.072,0.099],["10202110400046","SUTURE COATED VICRYL RAPIDE W9924 4-",1.0,"PIECE",1.258,1.636],["10202040900005","Nurse Cap  White",3.0,"PIECE",0.013,0.016],["10202040900004","SURGEON CAP",3.0,"PIECE",0.016,0.023],["10202091300027","SURGICAL SCRUB BRUSH",2.0,"PIECE",0.09,0.117],["10202040900003","SURGEON'S FACE MASK  3PLY W/ TIE TYP",6.0,"PIECE",0.007,0.009],["10202090700001","Surgical Hand Scrub Solution 500Ml",1.0,"1of3",0.467,0.607],["10202091100003","Probe Cover Ear Thermometer # 06000-",1.0,"PIECE",0.03,0.039],["10202011200003","OXYGEN MASK WITH TUBING ADULT 1135",1.0,"PIECE",0.28,0.364],["1020209161730","DISPOSABLE RESPIRATORY BUBBLE HUMIDI",1.0,"PIECE",0.45,2.86],["10202091200005","LATEX EXAM GLOVES POWDER FREE (SMALL",4.0,"PIECE",0.009,0.013],["1020209162166","CATHETER MOUNT CORREGATED STRAIGHT L",1.0,"PIECE",0.2,1.23],["10202041000011","Surgical Tape (Micropore) 1/2\"",1.0,"1of10",0.016,0.021],["10202100800006","NELATON CATHETER CH-18",2.0,"PIECE",0.038,0.049],["10202080200013","Syringe Pump Extension IVAC Set G304",1.0,"PIECE",1.0,1.3],["10202080500001","Needle Sterile Disposable G18 X 11/2",1.0,"PIECE",0.005,0.013],["1020204030116","DENTAL NEEDLE 27G x25mm",1.0,"PIECE",0.02,0.029],["10202040700005","RIBBON GAUZE WITH X-RAY THREAD 5CM X",2.0,"PIECE",0.21,0.312]]},{"no":"310","type":1,"name":"PARTIAL TURBINECTOMY","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202586603020","Legacy item 310-1",1,"PAIR",16.797,29.566],["10202952958473","Legacy item 310-2",1,"PIECE",8.345,14.689],["10202362096638","Legacy item 310-3",1,"PIECE",9.508,16.736],["10202716782763","Legacy item 310-4",1,"PAIR",16.926,29.793]]},{"no":"312","type":1,"name":"PARTIAL TURBINECTOMY - COBLATION","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202468804211","Legacy item 312-1",1,"PACKET",37.759,56.207],["10202753864767","Legacy item 312-2",1,"PIECE",25.254,37.592],["10202548955962","Legacy item 312-3",1,"PIECE",11.768,17.517],["10202263192149","Legacy item 312-4",1,"PAIR",19.498,29.024],["10202552795162","Legacy item 312-5",1,"PIECE",32.201,47.933]]},{"no":"318","type":1,"name":"Rhinoplasty, primary; including major septal","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202699229278","Legacy item 318-1",1,"PACKET",15.556,21.541],["10202978700210","Legacy item 318-2",1,"PAIR",28.701,39.743],["10202476001182","Legacy item 318-3",1,"PACKET",11.471,15.884],["10202955656247","Legacy item 318-4",1,"PAIR",10.179,14.095],["10202173833652","Legacy item 318-5",1,"PIECE",23.865,33.046]]},{"no":"320","type":1,"name":"Rhinoplasty, secondary; minor revision (smal","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202813128006","Legacy item 320-1",1,"PIECE",19.154,26.895],["10202853221325","Legacy item 320-2",1,"PAIR",7.803,10.956],["10202831472844","Legacy item 320-3",1,"PAIR",13.279,18.645],["10202405582123","Legacy item 320-4",1,"PACKET",25.307,35.535]]},{"no":"322","type":1,"name":"Lysis intranasal synechia","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202472594063","Legacy item 322-1",1,"PIECE",20.449,36.539],["10202481676682","Legacy item 322-2",1,"PIECE",12.402,22.161],["10202630098818","Legacy item 322-3",1,"PIECE",5.43,9.703],["10202334298814","Legacy item 322-4",1,"PAIR",10.863,19.41]]},{"no":"324","type":1,"name":"Nasal/sinus endoscopy surgical with maxillar","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202527239380","Legacy item 324-1",1,"PAIR",20.026,34.876],["10202633120015","Legacy item 324-2",1,"PIECE",14.4,25.078],["10202278634438","Legacy item 324-3",1,"PAIR",19.478,33.922]]},{"no":"1097","type":1,"name":"Excision of parotid tumor or parotid gland; ","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202247023327","Legacy item 1097-1",1,"PAIR",27.003,37.712],["10202398952339","Legacy item 1097-2",1,"PACKET",24.046,33.582],["10202485227600","Legacy item 1097-3",1,"PACKET",9.533,13.314],["10202508495730","Legacy item 1097-4",1,"PIECE",25.186,35.174]]},{"no":"1963","type":1,"name":"\"Wards\" ENT(minor)","ward":true,"src":"P_REPORT extract","items":[["10202080300008","IV Cannula 22G Safety",1.0,"PIECE",0.335,0.436],["10202080200015","Connector Q Syte Stand Alone",1.0,"PIECE",0.6,0.78],["1020208030018","INFUSION SET ALARIS VP SERIES DEHP F",1.0,"PIECE",1.75,2.275],["10202080200001","IV SET MACRO LIFESHEILD PRIMARY SET ",1.0,"PIECE",0.378,0.491],["10202080600001","SYRINGE 10ML L/LOCK WITH NEEDLE G21X",2.0,"PIECE",0.06,0.078],["10202041000017","Spot Bandage",2.0,"PIECE",0.002,0.003],["10202040800005","Patient Gown 125 x 150 cm Long Sleev",1.0,"PIECE",0.15,0.514],["10202041000022","Transparent Film Dressing Iv With Pa",1.0,"PIECE",0.21,0.273],["10202040400009","Underpad Disposable 90 X 60 Cm",5.0,"PIECE",0.072,0.099],["10202040400003","Underpad 60 x 40 cm",2.0,"PIECE",0.035,0.046],["10202040400006","Patient Shorts  Disposable Large",1.0,"PIECE",0.132,0.377],["10202080600006","SYRINGE 1ML LUER SLIP WITH NEEDLE",1.0,"PIECE",0.013,0.039],["1020204070012","GAUZE SWABS STERILE 10X10CM 12PLY DO",5.0,"PACKET",0.155,0.208],["10202091200004","LATEX EXAM GLOVES POWDER FREE(LARGE)",1.0,"PACKET",1.0,1.3]]},{"no":"1964","type":1,"name":"\"Wards\" ENT(major)","ward":true,"src":"Synthesized (demo — pending full extract)","items":[["10202262455407","Legacy item 1964-1",1,"PIECE",1.121,1.566],["10202112952615","Legacy item 1964-2",1,"PAIR",1.839,2.568],["10202992379915","Legacy item 1964-3",1,"PACKET",3.452,4.821]]},{"no":"2017","type":1,"name":"Tonsillectomy, primary or secondary; younger","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202104395478","Legacy item 2017-1",1,"PIECE",9.579,13.625],["10202496483003","Legacy item 2017-2",1,"PACKET",8.899,12.658],["10202708104260","Legacy item 2017-3",1,"PAIR",23.382,33.26]]},{"no":"2021","type":1,"name":"Closed treatment of nasal bone fracture; wit","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202653504709","Legacy item 2021-1",1,"PACKET",18.475,26.345],["10202894337824","Legacy item 2021-2",1,"PIECE",11.522,16.43],["10202590317463","Legacy item 2021-3",1,"PACKET",21.731,30.989]]},{"no":"2033","type":1,"name":"Excision, other benign lesion including marg","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202528400257","Legacy item 2033-1",1,"PAIR",11.809,17.509],["10202781063234","Legacy item 2033-2",1,"PAIR",5.848,8.671],["10202172313951","Legacy item 2033-3",1,"PIECE",4.462,6.616],["10202218034622","Legacy item 2033-4",1,"PAIR",6.206,9.202],["10202745025986","Legacy item 2033-5",1,"PIECE",15.785,23.403]]},{"no":"2035","type":1,"name":"Excision, other benign lesion including marg","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["10202262419487","Legacy item 2035-1",1,"PACKET",9.491,13.496],["10202490423179","Legacy item 2035-2",1,"PACKET",9.699,13.792],["10202127381374","Legacy item 2035-3",1,"PIECE",44.051,62.64]]},{"no":"266","type":2,"name":"ENT (Major)","ward":true,"src":"Synthesized (demo — pending full extract)","items":[["20129938108","Legacy item 266-1",1,"Syringe",0.704,0.95],["20190836544","Legacy item 266-2",1,"Syringe",0.612,0.826],["20173639532","Legacy item 266-3",1,"Amp.",0.789,1.066]]},{"no":"267","type":2,"name":"ENT (Minor)","ward":true,"src":"P_REPORT extract","items":[["20117010014","SODIUM CHLORIDE 0.9% IV KS -100ML",2.0,"IV fluid Pack",0.4,0.55],["20117010019","SODIUM CHLORIDE 0.9% KS 500ML",1.0,"IV fluid Pack",0.6,0.78],["20117010024","BD POSIFLUSH SP SYRINGE 10ML",1.0,"Syringe",0.36,0.47],["20117010025","NORMAL SALINE AMP B.BRAUN 10ML",5.0,"Amp.",0.1,0.13]]},{"no":"285","type":2,"name":"ADENOIDECTOMY + CAT (TONSILLECTOMY BY COBLAT","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20172544046","Legacy item 285-1",1,"IV fluid Pack",21.42,26.584],["20121527244","Legacy item 285-2",1,"Vial",9.3,11.542],["20123715389","Legacy item 285-3",1,"Syringe",22.211,27.567]]},{"no":"295","type":2,"name":"Tonsillectomy, primary or secondary; age 12 ","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20131667923","Legacy item 295-1",1,"Amp.",14.102,17.513],["20180901507","Legacy item 295-2",1,"Syringe",10.021,12.445],["20182903368","Legacy item 295-3",1,"Amp.",7.244,8.996],["20150008920","Legacy item 295-4",1,"Amp.",11.361,14.109],["20145046288","Legacy item 295-5",1,"Syringe",18.739,23.272]]},{"no":"297","type":2,"name":"COBLATION PARTIAL TONSILLECTOMY","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20139902737","Legacy item 297-1",1,"Syringe",14.003,17.356],["20192306098","Legacy item 297-2",1,"Vial",13.823,17.133],["20142130069","Legacy item 297-3",1,"IV fluid Pack",26.722,33.121]]},{"no":"303","type":2,"name":"Myringotomy including aspiration and/or eust","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20136832537","Legacy item 303-1",1,"IV fluid Pack",19.366,22.951],["20113889649","Legacy item 303-2",1,"Amp.",7.742,9.175],["20173382988","Legacy item 303-3",1,"Syringe",8.678,10.285],["20191220385","Legacy item 303-4",1,"Syringe",2.86,3.39],["20170025882","Legacy item 303-5",1,"Syringe",10.883,12.898]]},{"no":"305","type":2,"name":"Septoplasty or submucous resection, with or ","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20123711300","Legacy item 305-1",1,"Vial",11.154,14.672],["20155330357","Legacy item 305-2",1,"Vial",15.392,20.246],["20191907998","Legacy item 305-3",1,"Amp.",11.054,14.54],["20174353833","Legacy item 305-4",1,"Syringe",26.442,34.781]]},{"no":"307","type":2,"name":"Ablation, soft tissue of inferior turbinates","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20198662305","Legacy item 307-1",1,"Amp.",10.963,13.455],["20136752197","Legacy item 307-2",1,"IV fluid Pack",21.793,26.746],["20168240437","Legacy item 307-3",1,"Syringe",12.391,15.207],["20163128543","Legacy item 307-4",1,"IV fluid Pack",3.053,3.747],["20163873226","Legacy item 307-5",1,"Amp.",14.292,17.541]]},{"no":"309","type":2,"name":"Ablation, soft tissue of inferior turbinates","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20127050801","Legacy item 309-1",1,"Amp.",13.017,16.296],["20172458740","Legacy item 309-2",1,"Vial",10.322,12.922],["20189976351","Legacy item 309-3",1,"IV fluid Pack",14.179,17.751],["20157030900","Legacy item 309-4",1,"Vial",9.839,12.318],["20183639904","Legacy item 309-5",1,"Vial",18.501,23.163]]},{"no":"311","type":2,"name":"PARTIAL TURBINECTOMY","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20197197858","Legacy item 311-1",1,"Amp.",10.61,13.919],["20128689916","Legacy item 311-2",1,"IV fluid Pack",17.912,23.498],["20136146343","Legacy item 311-3",1,"Vial",40.25,52.804]]},{"no":"313","type":2,"name":"PARTIAL TURBINECTOMY - COBLATION","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20149321318","Legacy item 313-1",1,"Vial",13.764,18.197],["20153753544","Legacy item 313-2",1,"Syringe",17.916,23.686],["20183061791","Legacy item 313-3",1,"IV fluid Pack",29.343,38.792]]},{"no":"319","type":2,"name":"Rhinoplasty, primary; including major septal","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20157484087","Legacy item 319-1",1,"IV fluid Pack",12.659,16.26],["20179358465","Legacy item 319-2",1,"IV fluid Pack",21.821,28.028],["20177330181","Legacy item 319-3",1,"Vial",40.749,52.34]]},{"no":"321","type":2,"name":"Rhinoplasty, secondary; minor revision (smal","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20178524460","Legacy item 321-1",1,"Amp.",12.012,15.403],["20134576324","Legacy item 321-2",1,"Amp.",20.35,26.095],["20130106149","Legacy item 321-3",1,"Vial",11.126,14.267],["20193094361","Legacy item 321-4",1,"Amp.",3.452,4.427],["20184688894","Legacy item 321-5",1,"Amp.",14.485,18.574]]},{"no":"323","type":2,"name":"Lysis intranasal synechia","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20181232885","Legacy item 323-1",1,"IV fluid Pack",23.656,29.307],["20124241764","Legacy item 323-2",1,"Amp.",16.581,20.542],["20147167180","Legacy item 323-3",1,"Amp.",5.941,7.36],["20123119148","Legacy item 323-4",1,"IV fluid Pack",20.515,25.417]]},{"no":"325","type":2,"name":"Nasal/sinus endoscopy surgical with maxillar","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20118505221","Legacy item 325-1",1,"IV fluid Pack",10.692,13.511],["20177854192","Legacy item 325-2",1,"Vial",14.074,17.785],["20170712824","Legacy item 325-3",1,"IV fluid Pack",15.297,19.331],["20143239798","Legacy item 325-4",1,"Syringe",8.3,10.489],["20185096671","Legacy item 325-5",1,"Vial",19.153,24.203]]},{"no":"1098","type":2,"name":"Excision of parotid tumor or parotid gland; ","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20126323822","Legacy item 1098-1",1,"IV fluid Pack",14.094,17.477],["20119736972","Legacy item 1098-2",1,"Vial",16.857,20.903],["20138546741","Legacy item 1098-3",1,"Syringe",11.916,14.776],["20126421523","Legacy item 1098-4",1,"Vial",30.87,38.281]]},{"no":"1979","type":2,"name":"ENT Common Drugs","ward":true,"src":"Synthesized (demo — pending full extract)","items":[["20159148289","Legacy item 1979-1",1,"Vial",1.194,1.582],["20128422000","Legacy item 1979-2",1,"IV fluid Pack",0.516,0.684],["20122633303","Legacy item 1979-3",1,"IV fluid Pack",0.382,0.506],["20131849997","Legacy item 1979-4",1,"Vial",0.577,0.764],["20131671607","Legacy item 1979-5",1,"IV fluid Pack",0.811,1.074]]},{"no":"2000","type":2,"name":"Tonsillectomy, primary or secondary; younger","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20166542771","Legacy item 2000-1",1,"Vial",13.802,16.931],["20122374072","Legacy item 2000-2",1,"Syringe",9.534,11.695],["20184363365","Legacy item 2000-3",1,"IV fluid Pack",4.296,5.27],["20112426922","Legacy item 2000-4",1,"IV fluid Pack",6.566,8.054],["20154492893","Legacy item 2000-5",1,"Syringe",16.705,20.492]]},{"no":"2011","type":2,"name":"Closed treatment of nasal bone fracture; wit","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20125146464","Legacy item 2011-1",1,"Vial",25.925,32.304],["20124063279","Legacy item 2011-2",1,"Amp.",14.673,18.283],["20115313436","Legacy item 2011-3",1,"Vial",4.263,5.312],["20127388652","Legacy item 2011-4",1,"IV fluid Pack",3.305,4.118],["20144709914","Legacy item 2011-5",1,"IV fluid Pack",10.993,13.698]]},{"no":"2034","type":2,"name":"Excision, other benign lesion including marg","ward":false,"src":"P_REPORT extract","items":[["20102010004","BUPIVACAINE AGUETTANT INJECTION 5MG/",1.0,"Vial",4.0,4.8],["20102010025","PROVIVE 1% VIAL ATC 20ML",2.0,"Vial",0.6,0.7],["20102010029","XYLOCAINE SPRAY 10% 50 ML",1.0,"Spray",2.04,2.38],["20102010027","SEVOFLURANE INHALATION ANESTHETIC 25",1.0,"Unit",19.423,22.663],["20102010015","LIDOCAINE AGUTTANT I.V 200MG/10ML",1.0,"Amp.",0.95,1.25],["20102020001","PETHIDINE HCL 100MG/2ML MOH AMP",1.0,"Amp.",0.266,0.241],["20102020008","LIDOCAINE 2%(RYLIGENCY) PFS",1.0,"Prefilled syringe",1.99,2.4],["20106190020","DYNASTAT PWD&SOLVENT 40MG",1.0,"Vial",2.708,3.206],["20102030009","NIMBEX 20MG/10ML AMP",1.0,"Amp.",1.65,1.912],["20102030011","SUXAMETHONIUM 10MG/ML PFS U.P 10ML",1.0,"Amp.",3.99,5.2],["20112090012","LIPOSIC EYE GEL",1.0,"Tube",1.0,1.17],["20105150012","ATROPINE SULPHATE AGUTTANT 0.2MG/ML ",1.0,"Amp.",2.554,2.97],["20106010028","PARACETAMOL INFUSION 10MG/ML TAMIN -",1.0,"Vial",1.4,1.7],["20106030002","FENTANYL 0.05MG/1ML 2ML AMP",1.0,"Amp.",0.166,0.215],["20106050002","DORMICUM 15MG/3ML AMP",1.0,"Amp.",0.303,0.95],["20108050081","OPTILUBE LUBRICATING JELLY 113GM",1.0,"Unit",0.25,0.325],["20116050005","DEXATON 8MG/2ML INJ",1.0,"Amp.",0.51,0.59],["20117010010","RINGER'S SOLUTION KS 500ML",4.0,"IV fluid Pack",0.6,0.78],["20117010020","SODIUM CHLORIDE 0.9% IRRIGATION KS 1",1.0,"IV fluid Pack",1.64,2.135],["20117010028","NORMAL SALINE 10MLAMP #ATC/KS",5.0,"Amp.",0.044,0.06],["20117010031","WATER FOR INJECTION BP 10ML (PSI) #A",5.0,"Amp.",0.053,0.07],["20118020237","ALCOHOL SWABS -200PCS",5.0,"Pieces",0.002,0.01],["20120060001","NEOSTIGMINE 2.5MG/ML AMP",1.0,"Amp.",2.0,2.6],["20109080008","DELON RUBBING ALCOHOL 70% KHALEEJ 47",1.0,"Unit",0.2,0.26],["20109080017","POVIDONE IODINE 10%-250ML",1.0,"Bottle",5.55,7.2],["20116050010","HYDROCORTISONE 100MG VIAL",1.0,"Vial",0.44,0.52],["20113130001","EMISTOP 8MG/4ML AMP",1.0,"Amp.",7.5,9.0]]},{"no":"2036","type":2,"name":"Excision, other benign lesion including marg","ward":false,"src":"Synthesized (demo — pending full extract)","items":[["20179092953","Legacy item 2036-1",1,"IV fluid Pack",21.68,26.733],["20122007414","Legacy item 2036-2",1,"Syringe",17.298,21.33],["20117721077","Legacy item 2036-3",1,"Vial",30.736,37.9]]}];
const hydrateTpl=t=>({no:t.no,type:t.type,name:t.name,ward:!!t.ward,src:t.src,extractDate:"2026-03-10",
  items:t.items.map(a=>({code:String(a[0]),name:a[1],qty:Number(a[2])||1,uom:a[3],cost:Number(a[4])||0,sale:Number(a[5])||0}))});
const tplCost=t=>t.items.reduce((s,i)=>s+i.qty*i.cost,0);
const tplSale=t=>t.items.reduce((s,i)=>s+i.qty*i.sale,0);
// Chief Surgeon per SPECIALTY per BRANCH (call 2026-07-22) — falls back to the step-6 approver when unset
const CHIEF_SURGEONS_DEFAULT={CEN:Object.fromEntries(SPECIALTIES.map(x=>[x,"Dr. Mohammad Al-Shammari"])),NTH:Object.fromEntries(SPECIALTIES.map(x=>[x,"Dr. Mohammad Al-Shammari"]))};
const APPROVAL_CONFIG_DEFAULT=[
  {num:2,label:"CMO Approval",role:"cmo",approvers:{CEN:"Dr. Fatima Al-Kandari",NTH:"Dr. Nasser Al-Duwaisan"},active:true},
  {num:3,label:"CMIO Validation",role:"cmio",approvers:{CEN:"Dr. Khalid Al-Mutawa",NTH:"Dr. Khalid Al-Mutawa"},active:true},
  {num:4,label:"Nursing Templates",role:"nursing_mgr",approvers:{CEN:"Mrs. Noura Al-Sabah",NTH:"Mrs. Reem Al-Kharafi"},active:true},
  {num:5,label:"CNO Approval",role:"cno",approvers:{CEN:"Mrs. Huda Al-Failakawi",NTH:"Mrs. Reem Al-Kharafi"},active:true},
  {num:6,label:"Chief Surgeon",role:"chief_surgeon",approvers:{CEN:"Dr. Mohammad Al-Shammari",NTH:"Dr. Mohammad Al-Shammari"},active:true},
  {num:7,label:"CMO Final",role:"cmo",approvers:{CEN:"Dr. Fatima Al-Kandari",NTH:"Dr. Nasser Al-Duwaisan"},active:true},
  {num:8,label:"Other Branch CNO",role:"cno_other",approvers:{CEN:"Mrs. Reem Al-Kharafi",NTH:"Mrs. Huda Al-Failakawi"},active:true},
  {num:9,label:"Other Branch CMO",role:"cmo_other",approvers:{CEN:"Dr. Nasser Al-Duwaisan",NTH:"Dr. Fatima Al-Kandari"},active:true},
  {num:10,label:"Financials (FCD)",role:"cfo",approvers:{CEN:"Mr. Yousef Al-Bahar",NTH:"Mr. Yousef Al-Bahar"},active:true},
  {num:11,label:"CEO Price Review",role:"ceo",approvers:{CEN:"Dr. Abdul Rahman Al-Mutairi",NTH:"Dr. Abdul Rahman Al-Mutairi"},active:true},
  {num:12,label:"CSCM System Setup",role:"cscm",approvers:{CEN:"Mr. Fares Al-Methen",NTH:"Mr. Fares Al-Methen"},active:true},
  {num:13,label:"CFO Package Setup",role:"cfo",approvers:{CEN:"Mr. Yousef Al-Bahar",NTH:"Mr. Yousef Al-Bahar"},active:true},
  {num:14,label:"CSCM Template Link",role:"cscm",approvers:{CEN:"Mr. Fares Al-Methen",NTH:"Mr. Fares Al-Methen"},active:true},
  {num:15,label:"CFO Acknowledgement",role:"cfo",approvers:{CEN:"Mr. Yousef Al-Bahar",NTH:"Mr. Yousef Al-Bahar"},active:true},
];
// Auto-email config (Batch 7 #35) — per event: To, CC, subject, body, on/off
const EMAIL_CONFIG_DEFAULT=[
  {id:1,event:"New procedure submitted",to:"CMO",cc:"CSCM",subject:"New CPT Procedure Request #{id}",body:"A new procedure request has been submitted and requires your approval.",active:true},
  {id:2,event:"Edit request submitted",to:"Requestor Manager",cc:"CSCM",subject:"Edit Request #{id} (V{version})",body:"An edit request has been submitted and requires your review.",active:true},
  {id:3,event:"Deactivation request",to:"Requestor Chief; Nurse Manager",cc:"CSCM; CFO",subject:"Deactivation Request #{id}",body:"A deactivation request has been raised for review.",active:true},
  {id:4,event:"Reactivation request",to:"Requestor Chief; Nurse Manager",cc:"CSCM; CFO",subject:"Reactivation Request #{id}",body:"A reactivation request has been raised for review.",active:true},
  {id:5,event:"Approved & Acknowledged",to:"Requestor; CSCM; Finance",cc:"CNO; CMO",subject:"Procedure #{id} Approved & Acknowledged (V{version})",body:"The procedure package has been finalized and acknowledged. The completion certificate ({id}-CERT) is attached to this email.",attachCert:true,active:true},
  {id:6,event:"Rejected",to:"Requestor",cc:"",subject:"Procedure #{id} Rejected",body:"Your request was rejected. Please see the reviewer comments.",active:true},
  {id:7,event:"Modification requested",to:"Requestor / Nursing",cc:"",subject:"Modification requested — #{id}",body:"Changes were requested on your submission. Please review and resubmit.",active:true},
];
const ALL_MASTER_ITEMS=[...CONS_MASTER,...DRUGS_MASTER];
// count master items linked to a category node (parent counts its subs' items)
const itemsInCategory=(node,cats)=>{
  if(node.parentId===null){const subTitles=cats.filter(c=>c.parentId===node.id).map(c=>c.sub||c.title);return ALL_MASTER_ITEMS.filter(i=>i.cat===node.title).length;}
  return ALL_MASTER_ITEMS.filter(i=>i.sub===node.title).length;
};

// ─── AD USERS ────────────────────────────────────────────────
const U=[
  {id:"u1",name:"Dr. Ahmed Al-Rashidi",email:"A.AlRashidi@clinipack-demo.com",dept:"Orthopedics",branch:"CEN",role:"doctor",title:"Consultant Orthopedic Surgeon"},
  {id:"u2",name:"Dr. Fatima Al-Kandari",email:"F.AlKandari@clinipack-demo.com",dept:"Medical Affairs",branch:"CEN",role:"cmo",title:"Chief Medical Officer (CEN)"},
  {id:"u3",name:"Dr. Khalid Al-Mutawa",email:"K.AlMutawa@clinipack-demo.com",dept:"Insurance",branch:"CEN",role:"cmio",title:"Chief Medical Insurance Officer"},
  {id:"u4",name:"Mrs. Sarah Al-Enezi",email:"S.AlEnezi@clinipack-demo.com",dept:"Insurance",branch:"CEN",role:"cmio_del",title:"Insurance Coordinator (CMIO Delegate)"},
  {id:"u5",name:"Mrs. Noura Al-Sabah",email:"N.AlSabah@clinipack-demo.com",dept:"Nursing",branch:"CEN",role:"nursing_mgr",title:"Nursing Manager (CEN)"},
  {id:"u6",name:"Mrs. Huda Al-Failakawi",email:"H.AlFailakawi@clinipack-demo.com",dept:"Nursing",branch:"CEN",role:"cno",title:"Chief Nursing Officer"},
  {id:"u7",name:"Dr. Mohammad Al-Shammari",email:"M.AlShammari@clinipack-demo.com",dept:"Orthopedics",branch:"CEN",role:"chief_surgeon",title:"Chief Surgeon - Orthopedics"},
  {id:"u8",name:"Dr. Nasser Al-Duwaisan",email:"N.AlDuwaisan@clinipack-demo.com",dept:"Medical Affairs",branch:"NTH",role:"cmo_other",title:"Chief Medical Officer (NTH)"},
  {id:"u9",name:"Mrs. Reem Al-Kharafi",email:"R.AlKharafi@clinipack-demo.com",dept:"Nursing",branch:"NTH",role:"cno_other",title:"Chief Nursing Officer (NTH)"},
  {id:"u10",name:"Mr. Yousef Al-Bahar",email:"Y.AlBahar@clinipack-demo.com",dept:"Finance",branch:"CEN",role:"cfo",title:"Chief Financial Officer"},
  {id:"u11",name:"Mr. Ali Al-Mansour",email:"A.AlMansour@clinipack-demo.com",dept:"Finance",branch:"CEN",role:"cfo_del",title:"Finance Manager (CFO Delegate)"},
  {id:"u12",name:"Dr. Abdul Rahman Al-Mutairi",email:"A.AlMutairi@clinipack-demo.com",dept:"Executive",branch:"CEN",role:"ceo",title:"Chief Executive Officer"},
  {id:"u13",name:"Mr. Fares Al-Methen",email:"F.AlMethen@clinipack-demo.com",dept:"CSCM",branch:"CEN",role:"cscm",title:"Manager, Central Supply Chain",isSiteAdmin:true},
  {id:"u16",name:"Eng. AlMutawa",email:"AlMutawa@clinipack-demo.com",dept:"Facilities Management",branch:"CEN",role:"cfmo",title:"Chief Facilities Management Officer"},
  {id:"u14",name:"Mr. Bader Al-Hajri",email:"B.AlHajri@clinipack-demo.com",dept:"CSCM",branch:"CEN",role:"cscm_del",title:"Supply Chain Officer (CSCM Delegate)",isSiteAdmin:true},
  {id:"u15",name:"Dr. Layla Al-Kassab",email:"L.AlKassab@clinipack-demo.com",dept:"Endoscopy",branch:"CEN",role:"doctor",title:"Consultant Gastroenterologist"},
];
const uf=id=>U.find(u=>u.id===id);

const ROLE_GROUPS=[
  {role:"doctor",label:"Doctors (Requestors)",color:T.info},
  {role:"cmo",label:"CMO (Branch)",color:T.purple},
  {role:"cmio",label:"CMIO",color:"#7c3aed"},{role:"cmio_del",label:"CMIO Delegate",color:"#7c3aed"},
  {role:"nursing_mgr",label:"Nursing Manager",color:T.teal},
  {role:"cno",label:"CNO",color:T.teal},{role:"chief_surgeon",label:"Chief Surgeon",color:T.info},
  {role:"cmo_other",label:"Other Branch CMO",color:T.purple},{role:"cno_other",label:"Other Branch CNO",color:T.teal},
  {role:"cfo",label:"CFO",color:T.warn},{role:"cfo_del",label:"CFO Delegate",color:T.warn},
  {role:"ceo",label:"CEO",color:T.err},
  {role:"cscm",label:"CSCM Manager",color:T.primary},{role:"cscm_del",label:"CSCM Delegate",color:T.primary},
  {role:"cfmo",label:"CFMO (Edit chain)",color:"#b45309"},
];

// ─── WORKFLOW STAGES ─────────────────────────────────────────
// Change #15 — Fares asked for "CFO Costing" to read "Financials" everywhere.
const STAGES=[
  {num:1,label:"Doctor Request",sla:"3 Days"},
  {num:2,label:"CMO Approval",sla:"1 Day"},
  {num:3,label:"CMIO Validation",sla:"3 Days",canDelegate:true,delegateTo:"cmio_del"},
  {num:4,label:"Nursing Templates",sla:"6 Days"},
  {num:5,label:"CNO Approval",sla:"5 Days"},
  {num:6,label:"Chief Surgeon",sla:"2 Days"},
  {num:7,label:"CMO Final",sla:"2 Days"},
  {num:8,label:"Other Branch CNO",sla:"2 Days"},
  {num:9,label:"Other Branch CMO",sla:"2 Days"},
  {num:10,label:"Financials (FCD)",sla:"3 Days",canDelegate:true,delegateTo:"cfo_del"},
  {num:11,label:"CEO Price Review",sla:"3 Days"},
  {num:12,label:"CSCM System Setup",sla:"3 Days",canDelegate:true,delegateTo:"cscm_del"},
  {num:13,label:"CFO Package Setup",sla:"2 Days",canDelegate:true,delegateTo:"cfo_del"},
  {num:14,label:"CSCM Template Link",sla:"2 Days",canDelegate:true,delegateTo:"cscm_del"},
  {num:15,label:"CFO Acknowledgement",sla:"2 Days"},
];

// PHASE 2 — Deactivation / Reactivation approval chain (log items #7–#10)
const DEACT_STAGES=[
  {n:1,label:"Requestor Manager"},
  {n:2,label:"Requestor Chief"},
  {n:3,label:"Nurse Manager"},
  {n:4,label:"CNO"},
  {n:5,label:"Chief Surgeon"},
  {n:6,label:"CMO"},
  {n:7,label:"Other Branch CNO"},
  {n:8,label:"Other Branch CMO"},
  {n:9,label:"CFO"},
  {n:10,label:"CSCM — Confirm change on PrimeCare"},
  {n:11,label:"CFO — Acknowledge"},
];
const DEACT_SEED=[
  {id:"DR-001",reqType:"Deactivation",baseId:"00001",cpt:"Total Knee Replacement",pkgId:"1",opCode:"10803001",justification:"Procedure superseded by updated TKR protocol; legacy package no longer used clinically.",additionalDetails:"Confirm with OR scheduling before removing from the active price list. Keep historical records intact.",stage:3,status:"pending",done:false,attachments:["Clinical_committee_minutes.pdf"],timeline:[{by:"Dr. Ahmed Al-Rashidi",action:"Deactivation request raised",date:"2026-07-05 09:00"},{by:"Requestor Manager",action:"Requestor Manager — Approved",date:"2026-07-05 11:00"},{by:"Requestor Chief",action:"Requestor Chief — Approved",date:"2026-07-06 10:00"}]},
];

// Value-less (non-financial) edit — short path agreed in review: Requestor Chief → CMO → CMIO.
// Nursing, CFO and CEO are skipped because nothing financial changes. May be raised by any role.
// NOTE: all fields mirror to PrimeCare — whether a CSCM confirmation step is also required is pending client confirmation.
const VL_STAGES=[
  {n:1,label:"Requestor Chief"},
  {n:2,label:"CMO"},
  {n:3,label:"CMIO"},
];
const VL_FIELDS=[
  {k:"patientType",l:"Patient Type",opts:PATIENT_TYPES},
  {k:"anesthesia",l:"Anesthesia Requirement",opts:ANESTHESIA_OPTS},
  {k:"gender",l:"Gender",opts:GENDER_OPTS},
  {k:"opSkill",l:"Operation Skill",opts:null},
  {k:"acceptDoctorFees",l:"Accept Doctor Fees",opts:["Yes","No","Not applicable"],fin:true},
  {k:"advancePayment",l:"Advance Payment Portion (Inpatient Visit)",opts:["Yes","No","Not applicable"],fin:true},
  {k:"serviceRevenueDoctors",l:"Service Revenue for Doctors",opts:["Direct","Not Direct","Not applicable"],fin:true},
];
const vlCurrent=(p,f)=>f.fin?((p.financial||{})[f.k]||""):(p[f.k]||"");

// ═══ NON-FINANCIAL EDIT ROUTING MATRIX (Fares, 19 Jul) ═══
// Each change-type group has its own approval chain. Duplicate people in a chain are auto-approved
// (resolved by de-duplicating the chain by name). After approvals, the confirm role marks it done on PrimeCare.
const MFIELDS={
  patientType:{l:"Patient Type",opts:PATIENT_TYPES,get:p=>p.patientType||"",set:(u,v)=>{u.patientType=v;}},
  anesthesia:{l:"Anesthesia Requirement",opts:ANESTHESIA_OPTS,get:p=>p.anesthesia||"",set:(u,v)=>{u.anesthesia=v;}},
  gender:{l:"Gender",opts:GENDER_OPTS,get:p=>p.gender||"",set:(u,v)=>{u.gender=v;}},
  opSkill:{l:"Operation Skill",skill:true,get:p=>p.opSkill||"",set:(u,v)=>{u.opSkill=v;}},
  specialty:{l:"Specialty",opts:SPECIALTIES,get:p=>p.specialty||"",set:(u,v)=>{u.specialty=v;}},
  cptCode:{l:"CPT Code",text:true,get:p=>p.accurateCptCode||p.proposedCptCode||"",set:(u,v)=>{u.accurateCptCode=v;}},
  cptName:{l:"CPT Name",text:true,get:p=>p.accurateCptName||p.proposedCptName||"",set:(u,v)=>{u.accurateCptName=v;}},
  pkgId:{l:"PKGID",text:true,get:p=>(p.systemSetup||{}).pkgId||"",set:(u,v)=>{u.systemSetup={...(u.systemSetup||{}),pkgId:v};}},
  pkgName:{l:"Package Name",text:true,get:p=>(p.systemSetup||{}).pkgName||"",set:(u,v)=>{u.systemSetup={...(u.systemSetup||{}),pkgName:v};}},
  acceptDoctorFees:{l:"Accept Doctor Fees",opts:["Yes","No","Not applicable"],fin:true,get:p=>(p.financial||{}).acceptDoctorFees||"",set:(u,v)=>{u.financial={...(u.financial||{}),acceptDoctorFees:v};}},
  advancePayment:{l:"Advance Payment Portion (Inpatient Visit)",opts:["Yes","No","Not applicable"],fin:true,get:p=>(p.financial||{}).advancePayment||"",set:(u,v)=>{u.financial={...(u.financial||{}),advancePayment:v};}},
  serviceRevenueDoctors:{l:"Service Revenue for Doctors",opts:["Direct","Not Direct","Not applicable"],fin:true,get:p=>(p.financial||{}).serviceRevenueDoctors||"",set:(u,v)=>{u.financial={...(u.financial||{}),serviceRevenueDoctors:v};}},
  opCode:{l:"Operation Code",text:true,get:p=>(p.systemSetup||{}).opCode||"",set:(u,v)=>{u.systemSetup={...(u.systemSetup||{}),opCode:v};}},
  opName:{l:"Operation Name",text:true,get:p=>(p.systemSetup||{}).opName||"",set:(u,v)=>{u.systemSetup={...(u.systemSetup||{}),opName:v};}},
  templateNumbers:{l:"Template Numbers",text:true,get:p=>(p.systemSetup||{}).templateNumbers||"",set:(u,v)=>{u.systemSetup={...(u.systemSetup||{}),templateNumbers:v};}},
};
const EDIT_MATRIX=[
  {id:"clinical",name:"Patient Type / Anesthesia / Gender / Operation Skill / Specialty",raise:"Requestor",fields:["patientType","anesthesia","gender","opSkill","specialty"],chain:["req_chief","cmo","cmo_other"],confirm:"CSCM"},
  {id:"cpt",name:"CPT Code / CPT Name",raise:"Requestor",fields:["cptCode","cptName"],chain:["req_chief","cmio","cmo","cmio_other","cmo_other"],confirm:"CSCM"},
  {id:"pkg",name:"PKGID / Package Name",raise:"FCD",fields:["pkgId","pkgName"],chain:["cfo"],confirm:"FCD"},
  {id:"fees",name:"Accept Doctor Fees / Advance Payment / Service Revenue",raise:"FCD",fields:["acceptDoctorFees","advancePayment","serviceRevenueDoctors"],chain:["cfo"],confirm:"CSCM"},
  {id:"opcode",name:"Operation Code / Operation Name / Template Numbers",raise:"CSCM",fields:["opCode","opName","templateNumbers"],chain:["cfmo"],confirm:"CSCM"},
  {id:"obsolete",name:"Obsolete Item Codes (bulk replace)",raise:"CSCM",special:"obsolete",chain:["cscm","cfmo","nursing_mgr","cfo"],delegable:["nursing_mgr"],confirm:"CSCM"},
];
// ═══ EDIT DESIGN (live parity, Nov 2026) ═══
// Edit Package is one inline mode: any field on any tab is editable, and the route builds itself
// from the scenarios the changed fields belong to. Scenarios, field→scenario mapping, scenario steps
// and roles are configuration (Setup → Edit Design) — never a code change.
Object.assign(MFIELDS,{
  suggestedPrice:{l:"Suggested Procedure Patient Price",num:true,tab:"overview",get:p=>p.suggestedPrice==null?"":String(p.suggestedPrice),set:(u,v)=>{u.suggestedPrice=Number(v)||0;}},
  procedureDuration:{l:"Surgery Duration",text:true,tab:"overview",get:p=>p.procedureDuration||"",set:(u,v)=>{u.procedureDuration=v;}},
  accommodationDays:{l:"Accommodation Days",num:true,tab:"overview",get:p=>p.accommodationDays==null?"":String(p.accommodationDays),set:(u,v)=>{u.accommodationDays=Number(v)||0;}},
  finalPatientPrice:{l:"Final Patient Price (CFO)",num:true,tab:"financial",get:p=>(p.financial||{}).finalPatientPrice==null?"":String((p.financial||{}).finalPatientPrice),set:(u,v)=>{u.financial={...(u.financial||{}),finalPatientPrice:Number(v)||0};}},
  capLimit:{l:"Maximum CAP Limit",num:true,tab:"financial",get:p=>(p.financial||{}).capLimit?String((p.financial||{}).capLimit):"",set:(u,v)=>{u.financial={...(u.financial||{}),hasCap:Number(v)?"Yes":"No",capLimit:Number(v)||0};}},
});
const MFIELD_TAB={patientType:"overview",anesthesia:"overview",gender:"overview",opSkill:"overview",specialty:"overview",cptCode:"overview",cptName:"overview",suggestedPrice:"overview",procedureDuration:"overview",accommodationDays:"overview",pkgId:"system",pkgName:"system",opCode:"system",opName:"system",templateNumbers:"system",acceptDoctorFees:"financial",advancePayment:"financial",serviceRevenueDoctors:"financial",finalPatientPrice:"financial",capLimit:"financial"};
const TAB_LBL={overview:"Overview",templates:"OT Templates",financial:"Financials",system:"System Setup"};
EDIT_MATRIX.push({id:"finance",name:"Financial — duration, accommodation, LOS & services, patient price, OT templates",raise:"Any",finance:true,fields:["suggestedPrice","procedureDuration","accommodationDays","finalPatientPrice","capLimit"],chain:[],confirm:null});
const SCEN_SHORT={clinical:"Clinical",cpt:"CPT",pkg:"PKGID",fees:"Fees",opcode:"Op code",obsolete:"Obsolete",finance:"Finance"};
const EDIT_SCEN_DEFAULT=EDIT_MATRIX.map((g,i)=>({...g,order:(i+1)*10,active:g.id!=="obsolete",held:g.id==="obsolete"}));
const EDIT_FIELDMAP_DEFAULT=(()=>{const m={};EDIT_MATRIX.forEach(g=>(g.fields||[]).forEach(k=>{m[k]=g.id;}));return m;})();
// Roles an edit route may name. "row" = the Approval Workflow step that supplies the person.
// in15:false roles are extra numbered stages in a finance re-run, inserted after `after`.
const EDIT_ROLES_DEFAULT=[
  {key:"req_chief",label:"Requestor Chief",row:6,branch:"own",order:10,in15:true},
  {key:"cmio",label:"CMIO",row:3,branch:"own",order:20,in15:true,delegable:true},
  {key:"cmo",label:"Branch CMO",row:2,branch:"own",order:30,in15:true},
  {key:"cmio_other",label:"Other-branch CMIO",row:3,branch:"other",order:40,in15:false,after:8,delegable:true},
  {key:"cmo_other",label:"Other-branch CMO",row:9,branch:"own",order:50,in15:true},
  {key:"cscm",label:"CSCM Manager",row:12,branch:"own",order:60,in15:true},
  {key:"cfmo",label:"CFMO — Chief Facilities Management Officer",row:"cfmo",branch:"own",order:70,in15:false,after:12},
  {key:"nursing_mgr",label:"Nursing Manager",row:4,branch:"own",order:80,in15:true},
  {key:"cfo",label:"CFO",row:10,branch:"own",order:90,in15:true},
];
const EDIT_DESIGN_DEFAULT={scenarios:EDIT_SCEN_DEFAULT,fieldMap:EDIT_FIELDMAP_DEFAULT,roles:EDIT_ROLES_DEFAULT,editChain:{cfmo:{CEN:"Eng. AlMutawa",NTH:"Eng. AlMutawa"}}};
const otherBr=b=>b==="CEN"?"NTH":"CEN";
function resolveEditRole(roleKey,base,design,approvalConfig){
  const r=(design.roles||[]).find(x=>x.key===roleKey)||{key:roleKey,label:roleKey};
  const br=r.branch==="other"?otherBr(base.branch):base.branch;
  const name=r.row==="cfmo"?((design.editChain||{}).cfmo||{})[br]:(((approvalConfig.find(c=>c.num===r.row)||{}).approvers||{})[br]);
  const lbl=r.key==="req_chief"?`Requestor Chief · ${base.specialty||"Specialty"}`:(["cmio","cmo","cmio_other","cmo_other"].includes(r.key)?`${r.label} (${/_other$/.test(r.key)?otherBr(base.branch):br})`:r.label);
  return {role:r.key,label:lbl,short:r.label,name:name||"— not set —",delegable:!!r.delegable,branch:br};
}
// The single rule the raise freezes: scenarios touched → ordered, de-duplicated route.
function buildEditRoute(scenIds,base,design,approvalConfig){
  const scen=(design.scenarios||[]).filter(s=>scenIds.includes(s.id));
  const finance=scen.some(s=>s.finance);
  const roleKeys=[...new Set(scen.flatMap(s=>s.chain||[]))];
  const roles=roleKeys.map(k=>(design.roles||[]).find(r=>r.key===k)).filter(Boolean).sort((a,b)=>a.order-b.order);
  if(!finance){
    const steps=roles.map(r=>resolveEditRole(r.key,base,design,approvalConfig));
    const confirm=scen.some(s=>s.confirm==="CSCM")?"CSCM":(scen.find(s=>s.confirm)||{}).confirm||"CSCM";
    return {finance:false,steps,confirm,total:steps.length};
  }
  const stages=STAGES.map(s=>({num:s.num,label:s.label,sla:s.sla,base:s.num}));
  const extras=roles.filter(r=>!r.in15&&r.after).sort((a,b)=>b.after-a.after);
  extras.forEach(r=>{const ix=stages.findIndex(s=>s.base===r.after);const rr=resolveEditRole(r.key,base,design,approvalConfig);stages.splice(ix+1,0,{label:r.key==="cmio_other"?"Other-branch CMIO":r.label.split(" — ")[0],full:r.label,sla:"2 Days",extra:r.key,name:rr.name});});
  stages.forEach((s,i)=>{s.num=i+1;if(!s.extra){s.name=s.base===1?(base.requestor&&base.requestor.name)||"Requestor":(s.base===6?null:((approvalConfig.find(c=>c.num===s.base)||{}).approvers||{})[base.branch]);}});
  return {finance:true,stages,total:stages.length,extras:extras.map(r=>r.label)};
}
const editReqLabel=r=>(r.scenarios||[r.groupId]).map(s=>SCEN_SHORT[s]||s).join(" + ");
function editStepLabel(r){
  if(!r)return "";
  if(r.status==="returned")return "Returned to the raiser";
  if(r.status==="withdrawn")return "Withdrawn";
  if(r.done)return r.status==="rejected"?"Rejected":"Applied";
  if(r.kind==="fin"){const s=(r.stages||[])[r.stage];return s?`Stage ${r.stage+1} of ${r.stages.length} · ${s.full||s.label}`:"";}
  if(r.phase==="confirm")return `PrimeCare confirm (${r.confirmRole})`;
  const s=r.chain?r.chain[r.stage]:null;return s?`${s.short||s.label} · step ${r.stage+2} of ${(r.chain||[]).length+2}`:"";
}
function editTurn(r,me){
  if(!r||r.done)return false;
  if(r.status==="returned")return r.raisedBy===me.name;
  if(r.kind==="fin"){const s=(r.stages||[])[r.stage];return !!s&&(s.name===me.name);}
  if(r.phase==="confirm"){const need=r.confirmRole==="FCD"?"cfo":"cscm";return me.role===need;}
  const s=r.chain?r.chain[r.stage]:null;return !!s&&s.name===me.name;
}
function resolveMChain(group,base,approvalConfig){
  const branch=base.branch;const other=branch==="CEN"?"NTH":"CEN";
  const at=(num,br)=>((approvalConfig.find(c=>c.num===num)||{}).approvers||{})[br]||"";
  const R={
    req_chief:{label:"Requestor Chief",name:at(6,branch)||"Dr. Mohammad Al-Shammari"},
    cmo:{label:`Branch CMO (${branch})`,name:at(2,branch)},
    cmo_other:{label:`Other-branch CMO (${other})`,name:at(2,other)},
    cmio:{label:`CMIO (${branch})`,name:at(3,branch)},
    cmio_other:{label:`Other-branch CMIO (${other})`,name:at(3,other)},
    cscm:{label:"CSCM Manager",name:at(12,branch)||"Mr. Fares Al-Methen"},
    cfo:{label:"CFO",name:at(10,branch)||"Mr. Yousef Al-Bahar"},
    nursing_mgr:{label:`Nursing Manager (${branch})`,name:at(4,branch)},
    cfmo:{label:"CFMO — Chief Facilities Management Officer",name:"Eng. AlMutawa"},
  };
  const raw=(group.chain||[]).map(r=>({role:r,...(R[r]||{label:r,name:r}),delegable:(group.delegable||[]).includes(r)}));
  const seen=new Set();const chain=[];
  raw.forEach(s=>{if(s.name&&seen.has(s.name)){s.autoApproved=true;return;}if(s.name)seen.add(s.name);chain.push(s);});
  return chain;
}
function mTurn(req,me){
  if(!req||req.done)return false;
  if(req.phase==="confirm"){const need=req.confirmRole==="FCD"?"cfo":"cscm";return me.role===need||!!me.isSiteAdmin;}
  const step=req.chain?req.chain[req.stage]:null;if(!step)return false;
  if(step.placeholder)return !!me.isSiteAdmin;
  return me.name===step.name||!!me.isSiteAdmin;
}
function mStepLabel(req){
  if(!req)return "";
  if(req.done)return req.status==="rejected"?"Rejected":"Applied";
  if(req.phase==="confirm")return `PrimeCare confirm (${req.confirmRole})`;
  const s=req.chain?req.chain[req.stage]:null;return s?s.label:"";
}
// Must-notify list issued with the completion certificate (configurable in Setup → Email Notifications)
// ═══ MASTER IMPORT / EXPORT (#15) ═══
// One wizard reused by every Setup master: download template → upload → validate → preview → commit.
// CSV rather than .xlsx — the prototype carries no SheetJS, and Excel opens CSV natively.
const csvEscape=v=>{const s=String(v==null?"":v);return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s;};
const toCsv=(cols,rows)=>[cols.map(c=>csvEscape(c.l)).join(","),...rows.map(r=>cols.map(c=>csvEscape(r[c.k])).join(","))].join("\n");
const hasXlsx=()=>typeof XLSX!=="undefined";
// Export: real .xlsx when SheetJS is available, CSV otherwise.
const downloadSheet=(name,cols,rows)=>{
  if(hasXlsx()){
    const aoa=[cols.map(c=>c.l),...rows.map(r=>cols.map(c=>r[c.k]??""))];
    const ws=XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"]=cols.map(c=>({wch:Math.max(12,Math.min(40,c.l.length+4))}));
    const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,"Data");
    XLSX.writeFile(wb,name.replace(/\.csv$/i,".xlsx"));
    return;
  }
  downloadCsv(name,cols,rows);
};
// Read a File into rows of arrays — .xlsx via SheetJS, .csv via the built-in parser.
const readSheet=(file)=>new Promise((res,rej)=>{
  const isCsv=/\.csv$/i.test(file.name);
  const rd=new FileReader();
  rd.onerror=()=>rej(new Error("Could not read the file"));
  rd.onload=ev=>{
    try{
      if(isCsv||!hasXlsx()){res(parseCsv(String(ev.target.result)));return;}
      const wb=XLSX.read(new Uint8Array(ev.target.result),{type:"array"});
      const ws=wb.Sheets[wb.SheetNames[0]];
      const aoa=XLSX.utils.sheet_to_json(ws,{header:1,raw:false,defval:""});
      res(aoa.filter(r=>r.some(c=>String(c).trim()!=="")));
    }catch(e){rej(e);}
  };
  if(isCsv||!hasXlsx())rd.readAsText(file); else rd.readAsArrayBuffer(file);
});
const downloadCsv=(name,cols,rows)=>{
  const blob=new Blob([toCsv(cols,rows)],{type:"text/csv;charset=utf-8;"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href);
};
const parseCsv=text=>{
  const rows=[];let cur=[],val="",q=false;
  for(let i=0;i<text.length;i++){const ch=text[i];
    if(q){ if(ch==='"'&&text[i+1]==='"'){val+='"';i++;} else if(ch==='"'){q=false;} else val+=ch; }
    else if(ch==='"')q=true;
    else if(ch===","){cur.push(val);val="";}
    else if(ch==="\n"){cur.push(val);rows.push(cur);cur=[];val="";}
    else if(ch!=="\r")val+=ch;
  }
  if(val||cur.length){cur.push(val);rows.push(cur);}
  return rows.filter(r=>r.some(c=>String(c).trim()!==""));
};
// entity: {name, cols:[{k,l,req}], rows, validate(row,all)->[errors], onCommit(rows)}
function MasterIO({entity,onClose}){
  const[stage,setStage]=useState(1);
  const[parsed,setParsed]=useState([]);
  const[fileName,setFileName]=useState("");
  const cols=entity.cols;
  const handle=async e=>{
    const f=e.target.files?.[0]; if(!f)return;
    let rows;
    try{ rows=await readSheet(f); }catch(err){ alert("Could not read that file: "+err.message); e.target.value=""; return; }
    (()=>{
      if(rows.length<2){alert("The file has no data rows.");return;}
      const hdr=rows[0].map(h=>h.trim().toLowerCase());
      const idx=cols.map(c=>hdr.indexOf(c.l.toLowerCase()));
      const missing=cols.filter((c,i)=>c.req&&idx[i]<0).map(c=>c.l);
      if(missing.length){alert(`Missing required column(s):\n\n• ${missing.join("\n• ")}`);return;}
      const out=rows.slice(1).map((r,i)=>{
        const o={_row:i+2};
        cols.forEach((c,j)=>{o[c.k]=idx[j]>=0?String(r[idx[j]]??"").trim():"";});
        o._errs=entity.validate(o,rows);
        return o;
      });
      setParsed(out);setFileName(f.name);setStage(2);
    })();
    e.target.value="";
  };
  const ok=parsed.filter(r=>r._errs.length===0);
  const bad=parsed.filter(r=>r._errs.length>0);
  return <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.45)",zIndex:9997,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:10,width:"100%",maxWidth:820,maxHeight:"88vh",overflow:"auto",padding:24,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
      <ST style={{fontSize:16,marginBottom:2}}>Import {entity.name}</ST>
      <p style={{fontSize:11,color:T.textMut,margin:"0 0 14px"}}>Step {stage} of 3 — {stage===1?"upload":stage===2?"review":"done"}</p>
      {stage===1&&<>
        <div style={{padding:12,marginBottom:14,borderRadius:6,background:"#eff6ff",border:`1px solid ${T.info}30`,fontSize:11,color:T.info}}>
          Required columns: <strong>{cols.filter(c=>c.req).map(c=>c.l).join(", ")}</strong>{cols.some(c=>!c.req)&&<> · Optional: {cols.filter(c=>!c.req).map(c=>c.l).join(", ")}</>}
        </div>
        <div style={{border:`2px dashed ${T.border}`,borderRadius:8,padding:30,textAlign:"center",background:"#fafbfc"}}>
          <div style={{marginBottom:8,display:"flex",justifyContent:"center"}}><Ic n="fileText" s={26} sw={1.6} style={{color:T.textMut}}/></div>
          <div style={{fontSize:12,color:T.textMut,marginBottom:14}}>Excel (.xlsx) or CSV · first row must be the column headers</div>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
            <label style={{padding:"8px 18px",borderRadius:6,border:"none",background:T.primary,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>Choose file
              <input type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={handle}/></label>
            <button onClick={()=>downloadSheet(`${entity.name.replace(/\s+/g,"_")}_template.xlsx`,cols,[])} style={{padding:"8px 18px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",color:T.textSec,fontSize:12,fontWeight:600,cursor:"pointer"}}>⬇ Download Template</button>
          </div>
        </div>
      </>}
      {stage===2&&<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
          <div style={{fontSize:12,color:T.textSec}}><strong>{fileName}</strong> · {parsed.length} rows</div>
          <div style={{display:"flex",gap:8}}>
            <Badge color={T.ok}>✓ {ok.length} valid</Badge>{bad.length>0&&<Badge color={T.err}>✕ {bad.length} blocked</Badge>}
          </div>
        </div>
        <div style={{maxHeight:340,overflow:"auto",border:`1px solid ${T.border}`,borderRadius:6}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead style={{position:"sticky",top:0,background:T.primaryLight}}><tr>
              <th style={{padding:"7px 9px",textAlign:"left",fontSize:10,color:T.textSec}}>Row</th>
              {cols.map(c=><th key={c.k} style={{padding:"7px 9px",textAlign:"left",fontSize:10,color:T.textSec}}>{c.l}</th>)}
              <th style={{padding:"7px 9px",textAlign:"left",fontSize:10,color:T.textSec}}>Issues</th>
            </tr></thead>
            <tbody>
              {parsed.map(r=><tr key={r._row} style={{borderTop:`1px solid ${T.borderLight}`,background:r._errs.length?"#fef2f2":"#fff"}}>
                <td style={{padding:"6px 9px",color:T.textMut}}>{r._row}</td>
                {cols.map(c=><td key={c.k} style={{padding:"6px 9px"}}>{String(r[c.k]||"—").slice(0,32)}</td>)}
                <td style={{padding:"6px 9px",fontSize:10,color:T.err}}>{r._errs.join("; ")||<span style={{color:T.ok}}>—</span>}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
        {bad.length>0&&<div style={{fontSize:11,color:T.textSec,marginTop:10}}>Rows already in the master are kept as-is (never overwritten). Fix any invalid rows and re-import.</div>}
      </>}
      {stage===3&&<div style={{padding:30,textAlign:"center"}}>
        <div style={{marginBottom:8,display:"flex",justifyContent:"center"}}><Ic n="check" s={30} sw={2.5} style={{color:T.ok}}/></div>
        <div style={{fontSize:14,fontWeight:700,color:T.ok}}>{ok.length} {entity.name} imported</div>
        {bad.length>0&&<div style={{fontSize:11,color:T.textSec,marginTop:6}}>{bad.length} row(s) were not imported (already in the master, or invalid). <strong>Existing data was not changed.</strong></div>}
      </div>}
      <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}>
        <button onClick={onClose} style={{padding:"8px 18px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",color:T.textSec}}>{stage===3?"Close":"Cancel"}</button>
        {stage===2&&<button onClick={()=>{setStage(1);setParsed([]);}} style={{padding:"8px 18px",borderRadius:6,border:`1px solid ${T.border}`,background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",color:T.textSec}}>← Re-upload</button>}
        {stage===2&&<button disabled={ok.length===0} onClick={()=>{entity.onCommit(ok);setStage(3);}} style={{padding:"8px 18px",borderRadius:6,border:"none",background:ok.length?T.ok:"#e5e7eb",color:ok.length?"#fff":T.textMut,fontSize:12,fontWeight:700,cursor:ok.length?"pointer":"not-allowed"}}>Import {ok.length}</button>}
      </div>
    </div>
  </div>;
}

// ═══ MASTER-DATA AUDIT (#14) ═══
// Every Setup change is recorded field-by-field with old → new. Mirrors the Item Evaluation
// master audit log. (In SharePoint this rides on native list versioning; the log is the readable view.)
const AUDIT_SEED=[
  {date:"2026-07-02 09:14",user:"Mr. Fares Al-Methen",role:"CSCM Manager",entity:"CPT Codes",key:"27447",action:"Updated",field:"Specialty",oldValue:"—",newValue:"Orthopedics",note:"Pending insurance confirmation"},
  {date:"2026-07-02 09:20",user:"Mr. Fares Al-Methen",role:"CSCM Manager",entity:"Operation Skill",key:"Cathlab",action:"Created",field:"—",oldValue:"—",newValue:"Cathlab",note:""},
  {date:"2026-06-28 15:40",user:"Mr. Bader Al-Hajri",role:"CSCM Delegate",entity:"Approval Workflow",key:"Step 11 · CEO Price Review",action:"Updated",field:"Approver (CEN)",oldValue:"—",newValue:"Dr. Abdul Rahman Al-Mutairi",note:""},
  {date:"2026-06-25 11:02",user:"Mr. Fares Al-Methen",role:"CSCM Manager",entity:"Categories",key:"Implants",action:"Deactivated",field:"Active",oldValue:"Yes",newValue:"No",note:"Superseded by Orthopedic Implants"},
];
const AUDIT_ACTION={Created:{c:"#059669",icon:"＋"},Updated:{c:"#2563eb",icon:"✎"},Deactivated:{c:"#64748b",icon:"⊘"},Reactivated:{c:"#059669",icon:"↻"},Deleted:{c:"#dc2626",icon:"✕"}};

// Shared Records / History tab strip for every Setup master
function SetupTabs({tab,setTab,historyCount}){
  const b=k=>({padding:"7px 16px",borderRadius:"6px 6px 0 0",border:"none",borderBottom:tab===k?`2px solid ${T.primary}`:"2px solid transparent",background:"transparent",color:tab===k?T.primary:T.textSec,fontSize:12,fontWeight:tab===k?700:500,cursor:"pointer",fontFamily:T.font});
  return <div style={{display:"flex",gap:4,borderBottom:`1px solid ${T.border}`,marginBottom:14}}>
    <button onClick={()=>setTab("records")} style={b("records")}>Records</button>
    <button onClick={()=>setTab("history")} style={b("history")}>History{historyCount>0&&<span style={{marginLeft:6,fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:8,background:T.primaryLight,color:T.primary}}>{historyCount}</span>}</button>
  </div>;
}
// Audit table — search + action + user filters, old → new diffs
function EntityHistoryView({entries,entity}){
  const[q,setQ]=useState("");const[act,setAct]=useState("all");const[usr,setUsr]=useState("all");
  const users=[...new Set(entries.map(e=>e.user))];
  const acts=[...new Set(entries.map(e=>e.action))];
  const rows=entries.filter(e=>(act==="all"||e.action===act)&&(usr==="all"||e.user===usr)&&(!q||`${e.key} ${e.field} ${e.oldValue} ${e.newValue} ${e.note||""}`.toLowerCase().includes(q.toLowerCase())));
  const thc={padding:"9px 12px",fontSize:10,fontWeight:600,color:T.textSec,textAlign:"left",borderBottom:`1px solid ${T.border}`};
  return <div>
    <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
      <input style={{...inp,flex:1,minWidth:200}} placeholder="Search record, field or value..." value={q} onChange={e=>setQ(e.target.value)}/>
      <Select style={{...inp,width:150}} value={act} onChange={e=>setAct(e.target.value)}><option value="all">All actions</option>{acts.map(a=><option key={a} value={a}>{a}</option>)}</Select>
      <Select style={{...inp,width:190}} value={usr} onChange={e=>setUsr(e.target.value)}><option value="all">All users</option>{users.map(u=><option key={u} value={u}>{u}</option>)}</Select>
    </div>
    {rows.length===0&&<Card style={{padding:32,textAlign:"center"}}>
      <div style={{fontSize:30,marginBottom:8}}>📭</div>
      <div style={{fontSize:13,fontWeight:600,color:T.text}}>No history yet for {entity}</div>
      <div style={{fontSize:11,color:T.textMut,marginTop:4}}>Changes made here will appear automatically.</div>
    </Card>}
    {rows.length>0&&<Card style={{padding:0,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:T.primaryLight}}>
          <th style={{...thc,width:130}}>When</th><th style={thc}>Record</th><th style={{...thc,width:95}}>Action</th>
          <th style={{...thc,width:130}}>Field</th><th style={thc}>Change</th><th style={{...thc,width:160}}>By</th>
        </tr></thead>
        <tbody>
          {rows.map((e,i)=>{const a=AUDIT_ACTION[e.action]||{c:T.textMut,icon:"·"};
            return <tr key={i} style={{borderTop:`1px solid ${T.borderLight}`}}>
              <td style={{padding:"8px 12px",fontSize:10,color:T.textMut,whiteSpace:"nowrap"}}>{e.date}</td>
              <td style={{padding:"8px 12px",fontSize:11,fontWeight:600,color:T.text}}>{e.key}</td>
              <td style={{padding:"8px 12px"}}><Badge color={a.c}>{a.icon} {e.action}</Badge></td>
              <td style={{padding:"8px 12px",fontSize:11,color:T.textSec}}>{e.field}</td>
              <td style={{padding:"8px 12px",fontSize:11}}>
                {e.action==="Created"?<span style={{color:T.ok}}>{String(e.newValue).slice(0,40)}</span>
                 :<><span style={{color:T.err,textDecoration:"line-through"}}>{String(e.oldValue??"—").slice(0,40)}</span>
                    <span style={{color:T.textMut,margin:"0 6px"}}>→</span>
                    <span style={{color:T.ok,fontWeight:600}}>{String(e.newValue??"—").slice(0,40)}</span></>}
                {e.note&&<div style={{fontSize:9,color:T.textMut,fontStyle:"italic",marginTop:2}}>{e.note}</div>}
              </td>
              <td style={{padding:"8px 12px",fontSize:10,color:T.textSec}}>{e.user}<div style={{fontSize:9,color:T.textMut}}>{e.role}</div></td>
            </tr>;})}
        </tbody>
      </table>
    </Card>}
  </div>;
}

// ═══ SLA CONFIGURATION (#13) ═══
// Was hardcoded as strings on STAGES ("3 Days"). Now editable in Setup → SLA, with a reminder lead
// time per step. `slaDays:null` = no SLA on that step.
const SLA_CONFIG_DEFAULT=[
  {num:1,label:"Doctor Request",slaDays:3,remindBefore:1},
  {num:2,label:"CMO Approval",slaDays:1,remindBefore:1},
  {num:3,label:"CMIO Validation",slaDays:3,remindBefore:1},
  {num:4,label:"Nursing Templates",slaDays:6,remindBefore:2},
  {num:5,label:"CNO Approval",slaDays:5,remindBefore:1},
  {num:6,label:"Chief Surgeon",slaDays:2,remindBefore:1},
  {num:7,label:"CMO Final",slaDays:2,remindBefore:1},
  {num:8,label:"Other Branch CNO",slaDays:2,remindBefore:1},
  {num:9,label:"Other Branch CMO",slaDays:2,remindBefore:1},
  {num:10,label:"Financials (FCD)",slaDays:3,remindBefore:1},
  {num:11,label:"CEO Price Review",slaDays:3,remindBefore:1},
  {num:12,label:"CSCM System Setup",slaDays:3,remindBefore:1},
  {num:13,label:"CFO Package Setup",slaDays:2,remindBefore:1},
  {num:14,label:"CSCM Template Link",slaDays:2,remindBefore:1},
  {num:15,label:"CFO Acknowledgement",slaDays:2,remindBefore:1},
];
// Working days (live): Fridays, Saturdays and active public holidays are skipped.
const isWorkDay=d=>{const w=d.getDay();if(w===5||w===6)return false;const iso=d.toISOString().slice(0,10);return !(typeof HOLIDAYS_DEFAULT!=="undefined"&&HOLIDAYS_DEFAULT.some(h=>h.isActive!==false&&h.date===iso));};
const workDaysBtw=(a,b)=>{const x=new Date(a);x.setHours(12,0,0,0);const y=new Date(b);y.setHours(12,0,0,0);let n=0;const sign=x<=y?1:-1;while(sign>0?x<y:x>y){x.setDate(x.getDate()+sign);if(isWorkDay(x))n+=sign;}return n;};
const addWorkDays=(d,n)=>{const x=new Date(d||Date.now());x.setHours(12,0,0,0);let k=0;while(k<n){x.setDate(x.getDate()+1);if(isWorkDay(x))k++;}return x;};
// Single place that decides where a live request sits against its SLA.
const slaStateFor=(proc,slaCfg)=>{
  if(!proc||["approved","rejected","cpt_exists"].includes(proc.status))return null;
  const c=(slaCfg||[]).find(x=>x.num===proc.currentStage);
  if(!c||!c.slaDays)return null;
  const elapsed=c.calendar?daysBtw(proc.stageStartDate,new Date()):workDaysBtw(proc.stageStartDate,new Date());
  const left=c.slaDays-elapsed;
  const state=left<0?"overdue":left===0?"due":left<=(c.remindBefore||1)?"soon":"ok";
  return {elapsed,left,slaDays:c.slaDays,state,label:c.label,remindBefore:c.remindBefore||1};
};

// ═══ MY TASKS / NOTIFICATIONS (#11 #12) ═══
// Human-readable verb for whatever the request is waiting on.
// Live "Action required · your turn" wording, per stage
const STAGE_BANNER={
  2:"Review the request in the tabs below — then record your decision in the bar at the bottom.",
  3:"Validate the proposed CPT code in Overview — confirm the accurate code and whether a CPT already exists — then record your decision in the bar at the bottom.",
  4:"Build the OT templates in the OT Templates tab and complete the LOS entries in Overview, then submit from the bar at the bottom.",
  5:"Review the OT templates Nursing built and their costs in the OT Templates tab, then record your decision in the bar at the bottom.",
  6:"Review the clinical plan and the OT templates for this procedure, then record your decision in the bar at the bottom.",
  7:"Give the final clinical sign-off — review the templates and anything amended since your first approval, then record your decision in the bar at the bottom.",
  8:"Review the OT templates on behalf of the other branch, then record your decision in the bar at the bottom.",
  9:"Give the other branch’s clinical approval — review the request and templates, then record your decision in the bar at the bottom.",
  10:"Enter the costing in the Financials panel below — the standard cost of each service line, any additional services, the patient price and the commercial terms — then approve from the bar at the bottom.",
  11:"Review the costing and confirm or adjust the final patient price in the panel below; the margin recalculates as you type. If you change it, the CFO is told the price moved.",
  12:"Create the operation in PrimeCare, then record its code and name in the panel below with the screenshot proof. The code is permanent once linked.",
  13:"Create the package in PrimeCare against the approved price, then record its PKGID in the panel below with the screenshot proof. The PKGID is permanent once linked.",
  14:"Link this package’s OT templates in PrimeCare, then record their template numbers in the panel below with the covering document.",
  15:"Give the final acknowledgement — this closes the request as approved and issues its certificate. Review the completed setup in the tabs below first.",
};
// FCD costs every LOS list per line
const FCD_LINES=p=>{const sp=v=>v?String(v).split(/;\s*|\n/).map(x=>x.trim()).filter(Boolean):[];return [
  {k:"manpowerCosts",sum:"manpowerCost",l:"Manpower",items:sp(p.manpower),c:T.purple,bg:"#faf5ff",ns:"manpower"},
  {k:"machinesDevicesCosts",sum:"machinesDevicesCost",l:"Machines & devices",items:sp(p.machinesDevices),c:T.info,bg:"#eff6ff",ns:"machinesDevices"},
  {k:"labRadiologyCosts",sum:"labRadiologyCost",l:"Lab & radiology",items:sp(p.labRadiology),c:T.teal||"#0d9488",bg:"#f0fdfa",ns:"labRadiology"},
  {k:"consumablesDrugsCosts",sum:"consumablesDrugsLineCost",l:"Consumables & drugs",items:sp(p.consumablesDrugs),c:"#7c3aed",bg:"#f5f3ff",ns:"consumablesDrugs"},
  {k:"extraServicesCosts",sum:"extraServicesCost",l:"Extra services",items:sp(p.extraServices),c:"#d97706",bg:"#fffbeb",ns:"extraServices"},
];};
const TASK_VERB={
  1:"Submit the request",2:"Review & approve",3:"🔎 Validate the CPT code",4:"🧩 Complete the OT templates",
  5:"Nursing approval",6:"Chief Surgeon approval",7:"CMO final approval",8:"Other-branch CNO approval",
  9:"Other-branch CMO approval",10:"Enter the financials",11:"💵 Set the patient price",
  12:"Create & link the operation code",13:"Create the PKGID",14:"🔗 Link the templates",15:"Acknowledge",
};

// ═══ DOCUMENT REQUESTS (#10) ═══
// Anyone in the chain can *ask* for a document (distinct from uploading one). The ask is tracked
// as an obligation until it is satisfied or explicitly marked unavailable.
const DOC_TYPES=["Society / Protocol print-out","Insurance pre-approval","MOH Approval","Clinical committee minutes","Vendor quotation","Biocompatibility / safety report","Other"];
const DOC_STATUS={
  pending:{label:"Pending",c:"#d97706",bg:"#fffbeb",icon:"clock"},
  provided:{label:"Provided",c:"#059669",bg:"#f0fdf4",icon:"check"},
  not_provided:{label:"Not available",c:"#64748b",bg:"#f3f4f6",icon:"x"},
};

// ═══ PRIMECARE CODE LINKING (#9) ═══
// Mirrors the Item Evaluation PrimeCare link: the code is format-checked, requires screenshot
// proof, and is permanent once linked. Patterns are provisional — to be confirmed with Fares.
const PC_RULES={
  // Verified against Fares' package master (Book1, 18 rows, 2026-07):
  //   PKGID          -> 25, 43, 56          (plain integer)
  //   Operation code -> 10803025            (numeric; = "108030" + PKGID in 18/18 rows)
  //   CPT code       -> 30520, 30130-1      (5 digits, optional -N variant suffix)
  opCode:{re:/^\d{6,10}$/,hint:"numeric, 6–10 digits — e.g. 10803025",label:"Operation Code"},
  pkgId:{re:/^\d{1,6}$/,hint:"plain number — e.g. 56",label:"PKGID"},
  cpt:{re:/^\d{5}(-\d{1,2})?$/,hint:"5 digits, optional -N variant — e.g. 30520 or 30130-1",label:"CPT Code"},
  tpl:{re:/^\d{1,6}$/,hint:"template number — e.g. 1963",label:"Template No."},
};
const pcCheck=(kind,val)=>{const r=PC_RULES[kind];if(!val)return"required";return r.re.test(String(val).trim())?null:r.hint;};
const CERT_NOTIFY_LIST=["Requestor","CSCM","Finance","CNO","CMO","Insurance"];

// CPT Exists short path: CMIO→CFO(ack)→CMO(ack)→Done
const EXIST_STAGES=[
  {num:1,label:"Doctor Request",sla:"3 Days"},{num:2,label:"CMO Approval",sla:"1 Day"},{num:3,label:"CMIO Validation",sla:"3 Days"},
  {num:4,label:"CPT Exists — CFO Acknowledgement",sla:"2 Days"},{num:5,label:"CPT Exists — CMO Acknowledgement",sla:"1 Day"},
];

const STATUS={
  draft:{label:"Draft",c:"#6b7280",bg:"#f3f4f6"},
  pending_cmo:{label:"Pending CMO",c:T.purple,bg:"#f5f3ff"},
  pending_cmio:{label:"Pending CMIO",c:"#7c3aed",bg:"#f5f3ff"},
  pending_cmio_delegate:{label:"Delegate Filling (CMIO)",c:"#7c3aed",bg:"#f5f3ff"},
  cpt_exists_cfo_ack:{label:"CPT Exists — Pending CFO Ack",c:T.warn,bg:"#fffbeb"},
  cpt_exists_cmo_ack:{label:"CPT Exists — Pending CMO Ack",c:T.purple,bg:"#f5f3ff"},
  cpt_exists:{label:"CPT Exists — Acknowledged",c:T.info,bg:"#eff6ff"},
  pending_nursing:{label:"Pending Nursing Templates",c:T.teal,bg:"#f0fdfa"},
  pending_cno:{label:"Pending CNO",c:T.teal,bg:"#f0fdfa"},
  pending_surgeon:{label:"Pending Chief Surgeon",c:T.info,bg:"#eff6ff"},
  pending_cmo_final:{label:"Pending CMO Final",c:T.purple,bg:"#f5f3ff"},
  pending_other_cno:{label:"Pending Other Branch CNO",c:T.teal,bg:"#f0fdfa"},
  pending_other_cmo:{label:"Pending Other Branch CMO",c:T.purple,bg:"#f5f3ff"},
  pending_cfo_fcd:{label:"Pending CFO (FCD)",c:T.warn,bg:"#fffbeb"},
  pending_cfo_delegate:{label:"Delegate Filling (CFO)",c:T.warn,bg:"#fffbeb"},
  pending_ceo:{label:"Pending CEO",c:T.err,bg:"#fef2f2"},
  pending_cscm_setup:{label:"Pending CSCM Setup",c:T.primary,bg:T.primaryLight},
  pending_cscm_delegate:{label:"Delegate Filling (CSCM)",c:T.primary,bg:T.primaryLight},
  pending_cfo_pkg:{label:"Pending CFO (Package)",c:T.warn,bg:"#fffbeb"},
  pending_cscm_link:{label:"Pending CSCM Linking",c:T.primary,bg:T.primaryLight},
  pending_ack:{label:"Pending CFO Ack",c:T.warn,bg:"#fffbeb"},
  approved:{label:"Approved & Active",c:T.ok,bg:"#ecfdf5"},
  rejected:{label:"Rejected",c:T.err,bg:"#fef2f2"},
  modification:{label:"Modification Requested",c:"#ea580c",bg:"#fff7ed"},
};

// ─── HELPERS ─────────────────────────────────────────────────
const fmtDate=d=>d?new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):"—";
const fmtDateTime=d=>{if(!d)return"—";if(/^\d{4}-\d{2}-\d{2}$/.test(String(d)))return fmtDate(d);const x=new Date(String(d).length===16?String(d).replace(" ","T"):d);return isNaN(x)?String(d):x.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})+", "+x.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});};
// KWD Accounting Format: thousands comma separated
const fmtKWD=v=>{if(v==null||v==="")return"—";const n=Number(v);return"KWD "+n.toLocaleString("en-US",{minimumFractionDigits:3,maximumFractionDigits:3});};
const daysBtw=(a,b)=>Math.floor((new Date(b)-new Date(a))/86400000);
const now=()=>{const d=new Date(),z=n=>String(n).padStart(2,"0");return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`;};
