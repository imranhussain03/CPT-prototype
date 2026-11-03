// ═══════════════════════════════════════════════════════════════
// MOCK PROCEDURES
// ═══════════════════════════════════════════════════════════════
const PROCS=[
  {id:"00001",version:1,status:"approved",lifecycle:"Active",requestDate:"2025-11-15",branch:"CEN",
    requestor:uf("u1"),specialty:"Orthopedics",proposedCptCode:"27447",proposedCptName:"Total Knee Replacement",
    cptStatus:"New",accurateCptCode:"27447",accurateCptName:"Total Knee Replacement",
    patientType:"In-Patient",anesthesia:"Required",gender:"Both",opSkill:"Major",
    attachments:["Doctor_request_form.pdf","Insurance_pre-approval.pdf"],
    doctorEntry:{manpower:"2 Surgeons, 1 Anesthetist",machinesDevices:"Arthroscopy tower",consumablesDrugs:"Knee implant system",labRadiology:"X-ray, CBC",accommodationDays:2,procedureDuration:"3:00"},
    suggestedPrice:2800,accommodationDays:3,procedureDuration:"3:30",
    manpower:"2 Surgeons, 1 Anesthetist, 2 Scrub Nurses",labRadiology:"X-ray, CBC, PT/INR, BMP",
    consumablesDrugs:"Knee implant system, bone cement",machinesDevices:"Arthroscopy tower, Tourniquet",machinesDevicesCost:120,consumablesDrugsCost:0,
    currentStage:16,stageStartDate:"2025-12-01",delegatedTo:null,
    templates:{
      procCons:[{code:"CON-005",name:"Surgical Drape Set",uom:"Set",qty:2,unitCost:12.5,totalCost:25,uoms:[]},{code:"CON-002",name:"Suture Vicryl 3-0",uom:"Each",qty:6,unitCost:4.2,totalCost:25.2,uoms:[]},{code:"CON-008",name:"Electrosurgical Pencil",uom:"Each",qty:1,unitCost:8.5,totalCost:8.5,uoms:[]},{code:"CON-001",name:"Surgical Gloves (Sterile)",uom:"Pair",qty:8,unitCost:0.85,totalCost:6.8,uoms:[]},{code:"CON-010",name:"Surgical Blade No.10",uom:"Each",qty:3,unitCost:0.45,totalCost:1.35,uoms:[]},{code:"CON-007",name:"Suction Tubing",uom:"Each",qty:2,unitCost:2.8,totalCost:5.6,uoms:[]},{code:"CON-011",name:"Hemostatic Clip Applier",uom:"Each",qty:1,unitCost:45,totalCost:45,uoms:[]},{code:"CON-006",name:"Foley Catheter 16Fr",uom:"Each",qty:1,unitCost:3.2,totalCost:3.2,uoms:[]},{code:"CON-009",name:"Wound Closure Strips",uom:"Pack",qty:2,unitCost:3.75,totalCost:7.5,uoms:[]},{code:"CON-012",name:"Laparoscopic Trocar 10mm",uom:"Each",qty:2,unitCost:65,totalCost:130,uoms:[]}],
      wardsCons:[{code:"CON-004",name:"IV Cannula 18G",uom:"Each",qty:3,unitCost:0.65,totalCost:1.95,uoms:[]},{code:"CON-003",name:"Gauze Swabs 10x10",uom:"Pack/5",qty:10,unitCost:1.1,totalCost:11,uoms:[]},{code:"CON-001",name:"Surgical Gloves (Sterile)",uom:"Pair",qty:4,unitCost:0.85,totalCost:3.4,uoms:[]},{code:"CON-009",name:"Wound Closure Strips",uom:"Pack",qty:3,unitCost:3.75,totalCost:11.25,uoms:[]}],
      procDrugs:[{code:"DRG-001",name:"Propofol 200mg/20ml",uom:"Ampoule",qty:3,unitCost:3.5,totalCost:10.5,uoms:[]},{code:"DRG-002",name:"Fentanyl 100mcg/2ml",uom:"Ampoule",qty:2,unitCost:1.2,totalCost:2.4,uoms:[]},{code:"DRG-003",name:"Cefazolin 1g",uom:"Vial",qty:3,unitCost:2.8,totalCost:8.4,uoms:[]}],
      wardsDrugs:[{code:"DRG-005",name:"Morphine 10mg/ml",uom:"Ampoule",qty:4,unitCost:2.1,totalCost:8.4,uoms:[]},{code:"DRG-010",name:"Paracetamol IV 1g/100ml",uom:"Bag",qty:6,unitCost:2.4,totalCost:14.4,uoms:[]}],
    },
    financial:{manpowerCosts:[150,80,120],manpowerCost:350,surgeryDurationCost:280,accommodationCost:450,machinesDevicesCosts:[80,40],machinesDevicesCost:120,totalServicesCost:1200,totalConsCost:285.75,totalDrugsCost:44.1,totalOverallCost:1529.85,finalPatientPrice:2800,ceoAdjustedPrice:null,marginPercent:45.4,acceptDoctorFees:"Yes",advancePayment:"Not applicable",serviceRevenueDoctors:"Direct"},
    systemSetup:{opCode:"10803001",opName:"Total Knee Replacement Surgery",linkedToCpt:"Yes",opLocked:true,pkgId:"1",linkedToPkg:"Yes",pkgLocked:true,addedOnSystem:"Yes",procConsTemplate:"TMPL-PC-001",wardsConsTemplate:"TMPL-WC-001",procDrugsTemplate:"TMPL-PD-001",wardsDrugsTemplate:"TMPL-WD-001",linkingCompleted:"Yes"},
    timeline:[
      {date:"2025-11-15 09:00",action:"New procedure request submitted",user:"Dr. Ahmed Al-Rashidi",role:"Doctor",type:"create"},
      {date:"2025-11-15 14:30",action:"CMO Approved",user:"Dr. Fatima Al-Kandari",role:"CMO",type:"approve"},
      {date:"2025-11-16 10:00",action:"CMIO Validated — CPT Status: New",user:"Dr. Khalid Al-Mutawa",role:"CMIO",type:"approve"},
      {date:"2025-11-19 16:00",action:"Nursing templates submitted — 4 cards completed",user:"Mrs. Noura Al-Sabah",role:"Nursing Mgr",type:"complete"},
      {date:"2025-11-20 09:00",action:"CNO → Chief Surgeon → CMO → Other CNO → Other CMO Approved",user:"Multiple",role:"Approvers",type:"approve"},
      {date:"2025-11-22 10:00",action:"CFO approved with FCD details",user:"Mr. Yousef Al-Bahar",role:"CFO",type:"approve"},
      {date:"2025-11-23 09:00",action:"CEO approved — price KWD 2,800.000",user:"Dr. Abdul Rahman Al-Mutairi",role:"CEO",type:"approve"},
      {date:"2025-11-24 08:00",action:"CSCM created operation code 10803001",user:"Mr. Fares Al-Methen",role:"CSCM",type:"complete"},
      {date:"2025-11-25 10:00",action:"CFO created PKGID 1",user:"Mr. Yousef Al-Bahar",role:"CFO",type:"complete"},
      {date:"2025-11-26 08:00",action:"CSCM templates linked on live",user:"Mr. Fares Al-Methen",role:"CSCM",type:"complete"},
      {date:"2025-12-01 09:00",action:"CFO Acknowledged — Version 1 approved",user:"Mr. Yousef Al-Bahar",role:"CFO",type:"acknowledge"},
    ],
    versionHistory:[{version:1,date:"2025-12-01",changedBy:"System",summary:"Initial creation — Approved & Acknowledged"}],
  },
  {id:"00002",version:1,status:"pending_nursing",requestDate:"2026-03-20",branch:"CEN",
    requestor:uf("u15"),specialty:"Endoscopy",proposedCptCode:"43239",proposedCptName:"Upper GI Endoscopy with Biopsy",
    cptStatus:"New",accurateCptCode:"43239",accurateCptName:"Upper GI Endoscopy with Biopsy",
    suggestedPrice:850,accommodationDays:0,procedureDuration:"0:45",
    manpower:"1 Gastroenterologist, 1 Nurse",labRadiology:"CBC, Coagulation panel",
    consumablesDrugs:"Biopsy forceps, specimen containers",machinesDevices:"Endoscopy tower",machinesDevicesCost:0,consumablesDrugsCost:0,
    currentStage:4,stageStartDate:"2026-07-08",delegatedTo:null,
    templates:{procCons:[],wardsCons:[],procDrugs:[],wardsDrugs:[]},
    financial:null,systemSetup:null,
    reqDocs:[
      {id:"DOC-001",type:"Society / Protocol print-out",note:"Needed before CMO can validate the CPT mapping.",by:"Dr. Khalid Al-Mutawa",role:"CMIO",date:"2026-03-22",status:"pending"},
      {id:"DOC-002",type:"Insurance pre-approval",note:"",by:"Dr. Khalid Al-Mutawa",role:"CMIO",date:"2026-03-22",status:"provided",files:["Insurance_preapproval_43239.pdf"],providedBy:"Dr. Layla Al-Kassab",providedDate:"2026-03-23"},
    ],
    timeline:[
      {date:"2026-03-20 10:00",action:"New procedure request submitted",user:"Dr. Layla Al-Kassab",role:"Doctor",type:"create"},
      {date:"2026-03-21 09:30",action:"CMO Approved",user:"Dr. Fatima Al-Kandari",role:"CMO",type:"approve"},
      {date:"2026-03-22 11:00",action:"CMIO Validated — CPT Status: New",user:"Dr. Khalid Al-Mutawa",role:"CMIO",type:"approve"},
    ],
    versionHistory:[{version:1,date:"2026-03-20",changedBy:"Dr. Layla Al-Kassab",summary:"New procedure request"}],
  },
  {id:"00003",version:1,status:"pending_cmo",requestDate:"2026-04-05",branch:"NTH",
    requestor:uf("u1"),specialty:"Orthopedics",proposedCptCode:"29881",proposedCptName:"Knee Arthroscopy with Meniscectomy",
    cptStatus:"",accurateCptCode:"",accurateCptName:"",
    suggestedPrice:1500,accommodationDays:1,procedureDuration:"1:30",
    manpower:"1 Surgeon, 1 Anesthetist, 1 Scrub Nurse",labRadiology:"X-ray, CBC",
    consumablesDrugs:"Arthroscopic instruments",machinesDevices:"Arthroscopy tower",machinesDevicesCost:0,consumablesDrugsCost:0,
    currentStage:2,stageStartDate:"2026-07-14",delegatedTo:null,
    templates:{procCons:[],wardsCons:[],procDrugs:[],wardsDrugs:[]},
    financial:null,systemSetup:null,
    timeline:[{date:"2026-04-05 14:00",action:"New procedure request submitted",user:"Dr. Ahmed Al-Rashidi",role:"Doctor",type:"create"}],
    versionHistory:[{version:1,date:"2026-04-05",changedBy:"Dr. Ahmed Al-Rashidi",summary:"New procedure request"}],
  },
  // Demo spread — one live request per major stage so every approver has something in My Tasks,
  // with stage start dates that exercise overdue / due-today / upcoming against SLA_CONFIG_DEFAULT.
  {id:"00004",version:1,status:"pending_cmio",requestDate:"2026-07-01",branch:"CEN",
    requestor:uf("u1"),specialty:"Orthopedics",proposedCptCode:"27447",proposedCptName:"Total Knee Replacement",
    cptStatus:"",accurateCptCode:"",accurateCptName:"",patientType:"In-Patient",anesthesia:"Required",gender:"Both",opSkill:"Major",
    suggestedPrice:2900,accommodationDays:3,procedureDuration:"3:30",
    manpower:"2 Surgeons, 1 Anesthetist",labRadiology:"X-ray, CBC",consumablesDrugs:"Knee implant",machinesDevices:"Tourniquet",machinesDevicesCost:0,consumablesDrugsCost:0,
    currentStage:3,stageStartDate:"2026-07-13",delegatedTo:null,
    templates:{procCons:[],wardsCons:[],procDrugs:[],wardsDrugs:[]},financial:null,systemSetup:null,
    timeline:[{date:"2026-07-01 09:00",action:"New procedure request submitted",user:"Dr. Ahmed Al-Rashidi",role:"Doctor",type:"create"},
              {date:"2026-07-05 10:00",action:"CMO Approved",user:"Dr. Fatima Al-Kandari",role:"CMO",type:"approve"}],
    versionHistory:[{version:1,date:"2026-07-01",changedBy:"Dr. Ahmed Al-Rashidi",summary:"New procedure request"}]},
  {id:"00005",version:1,status:"pending_cno",requestDate:"2026-06-20",branch:"CEN",
    requestor:uf("u15"),specialty:"Endoscopy",proposedCptCode:"43239",proposedCptName:"Upper GI Endoscopy with Biopsy",
    cptStatus:"New",accurateCptCode:"43239",accurateCptName:"Upper GI Endoscopy with Biopsy",patientType:"Out-Patient",anesthesia:"Required",gender:"Both",opSkill:"Endoscopy",
    suggestedPrice:900,accommodationDays:0,procedureDuration:"0:45",
    manpower:"1 Gastroenterologist, 1 Nurse",labRadiology:"CBC",consumablesDrugs:"Biopsy forceps",machinesDevices:"Endoscopy tower",machinesDevicesCost:0,consumablesDrugsCost:0,
    currentStage:5,stageStartDate:"2026-07-10",delegatedTo:null,
    templates:{procCons:[{code:"CON-005",name:"Surgical Drape Set",uom:"Set",qty:1,unitCost:12.5,totalCost:12.5,uoms:[]}],wardsCons:[],procDrugs:[{code:"DRG-001",name:"Propofol 200mg/20ml",uom:"Ampoule",qty:2,unitCost:3.5,totalCost:7,uoms:[]}],wardsDrugs:[]},
    financial:null,systemSetup:null,
    timeline:[{date:"2026-06-20 09:00",action:"New procedure request submitted",user:"Dr. Layla Al-Kassab",role:"Doctor",type:"create"},
              {date:"2026-07-08 09:00",action:"Nursing templates submitted",user:"Mrs. Noura Al-Sabah",role:"Nursing Mgr",type:"complete"}],
    versionHistory:[{version:1,date:"2026-06-20",changedBy:"Dr. Layla Al-Kassab",summary:"New procedure request"}]},
  {id:"00006",version:1,status:"pending_cfo_fcd",requestDate:"2026-06-10",branch:"NTH",
    requestor:uf("u1"),specialty:"Orthopedics",proposedCptCode:"29881",proposedCptName:"Knee Arthroscopy with Meniscectomy",
    cptStatus:"New",accurateCptCode:"29881",accurateCptName:"Knee Arthroscopy with Meniscectomy",patientType:"In-Patient",anesthesia:"Required",gender:"Both",opSkill:"Minor",
    suggestedPrice:1500,accommodationDays:1,procedureDuration:"1:30",
    manpower:"1 Surgeon, 1 Anesthetist, 1 Scrub Nurse",labRadiology:"X-ray, CBC",consumablesDrugs:"Arthroscopic instruments",machinesDevices:"Arthroscopy tower",machinesDevicesCost:60,consumablesDrugsCost:0,
    currentStage:10,stageStartDate:"2026-07-14",delegatedTo:null,
    templates:{procCons:[{code:"CON-002",name:"Suture Vicryl 3-0",uom:"Each",qty:4,unitCost:4.2,totalCost:16.8,uoms:[]}],wardsCons:[],procDrugs:[{code:"DRG-003",name:"Cefazolin 1g",uom:"Vial",qty:2,unitCost:2.8,totalCost:5.6,uoms:[]}],wardsDrugs:[]},
    financial:null,systemSetup:null,
    timeline:[{date:"2026-06-10 09:00",action:"New procedure request submitted",user:"Dr. Ahmed Al-Rashidi",role:"Doctor",type:"create"},
              {date:"2026-07-02 11:00",action:"Other Branch CMO Approved",user:"Dr. Fatima Al-Kandari",role:"CMO",type:"approve"}],
    versionHistory:[{version:1,date:"2026-06-10",changedBy:"Dr. Ahmed Al-Rashidi",summary:"New procedure request"}]},
  {id:"00007",version:1,status:"pending_ceo",requestDate:"2026-06-01",branch:"CEN",
    requestor:uf("u15"),specialty:"General Surgery",proposedCptCode:"47562",proposedCptName:"Laparoscopic Cholecystectomy",
    cptStatus:"New",accurateCptCode:"47562",accurateCptName:"Laparoscopic Cholecystectomy",patientType:"In-Patient",anesthesia:"Required",gender:"Both",opSkill:"Major",
    suggestedPrice:2200,accommodationDays:2,procedureDuration:"2:00",
    manpower:"2 Surgeons, 1 Anesthetist",labRadiology:"US, CBC, LFT",consumablesDrugs:"Trocars, clips",machinesDevices:"Laparoscopy stack",machinesDevicesCost:90,consumablesDrugsCost:0,
    currentStage:11,stageStartDate:"2026-07-13",delegatedTo:null,
    templates:{procCons:[{code:"CON-012",name:"Laparoscopic Trocar 10mm",uom:"Each",qty:2,unitCost:65,totalCost:130,uoms:[]}],wardsCons:[],procDrugs:[{code:"DRG-002",name:"Fentanyl 100mcg/2ml",uom:"Ampoule",qty:2,unitCost:1.2,totalCost:2.4,uoms:[]}],wardsDrugs:[]},
    financial:{manpowerCosts:[180,90],manpowerCost:270,surgeryDurationCost:200,accommodationCost:300,machinesDevicesCosts:[90],machinesDevicesCost:90,totalServicesCost:860,totalConsCost:130,totalDrugsCost:2.4,totalOverallCost:1182.4,finalPatientPrice:2200,ceoAdjustedPrice:null,marginPercent:46.3,acceptDoctorFees:"Yes",advancePayment:"Yes",serviceRevenueDoctors:"Direct"},
    systemSetup:null,
    timeline:[{date:"2026-06-01 09:00",action:"New procedure request submitted",user:"Dr. Layla Al-Kassab",role:"Doctor",type:"create"},
              {date:"2026-07-13 10:00",action:"CFO approved with FCD details",user:"Mr. Yousef Al-Bahar",role:"CFO",type:"approve_fcd"}],
    versionHistory:[{version:1,date:"2026-06-01",changedBy:"Dr. Layla Al-Kassab",summary:"New procedure request"}]},
  {id:"00008",version:1,status:"pending_cscm_setup",requestDate:"2026-05-20",branch:"CEN",
    requestor:uf("u1"),specialty:"ENT",proposedCptCode:"30520",proposedCptName:"Septoplasty",
    cptStatus:"New",accurateCptCode:"30520",accurateCptName:"Septoplasty",patientType:"Out-Patient",anesthesia:"Required",gender:"Both",opSkill:"Minor",
    suggestedPrice:500,accommodationDays:0,procedureDuration:"1:00",
    manpower:"1 ENT Surgeon, 1 Anesthetist",labRadiology:"CBC",consumablesDrugs:"Nasal packing",machinesDevices:"Endoscope",machinesDevicesCost:40,consumablesDrugsCost:0,
    currentStage:12,stageStartDate:"2026-07-15",delegatedTo:null,
    templates:{procCons:[{code:"CON-005",name:"Surgical Drape Set",uom:"Set",qty:1,unitCost:12.5,totalCost:12.5,uoms:[]}],wardsCons:[],procDrugs:[{code:"DRG-001",name:"Propofol 200mg/20ml",uom:"Ampoule",qty:2,unitCost:3.5,totalCost:7,uoms:[]}],wardsDrugs:[]},
    financial:{manpowerCosts:[120,60],manpowerCost:180,surgeryDurationCost:90,accommodationCost:0,machinesDevicesCosts:[40],machinesDevicesCost:40,totalServicesCost:310,totalConsCost:12.5,totalDrugsCost:7,totalOverallCost:329.5,finalPatientPrice:500,ceoAdjustedPrice:null,marginPercent:34.1,acceptDoctorFees:"Yes",advancePayment:"Not applicable",serviceRevenueDoctors:"Direct"},
    systemSetup:null,
    timeline:[{date:"2026-05-20 09:00",action:"New procedure request submitted",user:"Dr. Ahmed Al-Rashidi",role:"Doctor",type:"create"},
              {date:"2026-07-14 09:00",action:"CEO approved — price KWD 500.000",user:"Dr. Abdul Rahman Al-Mutairi",role:"CEO",type:"approve"}],
    versionHistory:[{version:1,date:"2026-05-20",changedBy:"Dr. Ahmed Al-Rashidi",summary:"New procedure request"}]},
  {id:"00009",version:1,status:"pending_ack",requestDate:"2026-05-01",branch:"CEN",
    requestor:uf("u15"),specialty:"Endoscopy",proposedCptCode:"42415",proposedCptName:"Parotidectomy",
    cptStatus:"New",accurateCptCode:"42415",accurateCptName:"Parotidectomy",patientType:"In-Patient",anesthesia:"Required",gender:"Both",opSkill:"Major",
    suggestedPrice:1800,accommodationDays:2,procedureDuration:"2:30",
    manpower:"2 Surgeons, 1 Anesthetist",labRadiology:"MRI, CBC",consumablesDrugs:"Nerve monitor pads",machinesDevices:"Nerve monitor",machinesDevicesCost:70,consumablesDrugsCost:0,
    currentStage:15,stageStartDate:"2026-07-15",delegatedTo:null,
    templates:{procCons:[{code:"CON-001",name:"Surgical Gloves (Sterile)",uom:"Pair",qty:6,unitCost:0.85,totalCost:5.1,uoms:[]}],wardsCons:[],procDrugs:[{code:"DRG-003",name:"Cefazolin 1g",uom:"Vial",qty:2,unitCost:2.8,totalCost:5.6,uoms:[]}],wardsDrugs:[]},
    financial:{manpowerCosts:[200,100],manpowerCost:300,surgeryDurationCost:240,accommodationCost:300,machinesDevicesCosts:[70],machinesDevicesCost:70,totalServicesCost:910,totalConsCost:5.1,totalDrugsCost:5.6,totalOverallCost:920.7,finalPatientPrice:1800,ceoAdjustedPrice:null,marginPercent:48.9,acceptDoctorFees:"Yes",advancePayment:"Yes",serviceRevenueDoctors:"Direct"},
    systemSetup:{opCode:"10803061",opName:"Parotidectomy",linkedToCpt:"Yes",opLocked:true,pkgId:"61",linkedToPkg:"Yes",pkgLocked:true,addedOnSystem:"Yes",procConsTemplate:"322",wardsConsTemplate:"1963",procDrugsTemplate:"267",wardsDrugsTemplate:"1964",linkingCompleted:"Yes"},
    timeline:[{date:"2026-05-01 09:00",action:"New procedure request submitted",user:"Dr. Layla Al-Kassab",role:"Doctor",type:"create"},
              {date:"2026-07-06 09:00",action:"CSCM linked & locked templates",user:"Mr. Fares Al-Methen",role:"CSCM",type:"complete"}],
    versionHistory:[{version:1,date:"2026-05-01",changedBy:"Dr. Layla Al-Kassab",summary:"New procedure request"}]},
];
// ─── SEED CONSISTENCY: every stage carries ALL data from completed earlier stages ───
(()=>{
  const rich=PROCS.find(p=>p.id==="00001");
  PROCS.forEach(p=>{
    if(p.id==="00001")return;
    const tcount=(p.templates?.procCons||[]).length+(p.templates?.procDrugs||[]).length+(p.templates?.wardsCons||[]).length+(p.templates?.wardsDrugs||[]).length;
    if(p.currentStage>4&&rich&&tcount<8)p.templates=JSON.parse(JSON.stringify(rich.templates));
    if(!p.attachments)p.attachments=[];
    if(p.attachments.length===0)p.attachments.push({name:"Doctor reference — procedure notes.pdf",step:"Stage 1 — Doctor Request",by:(p.requestor&&p.requestor.name)||"Requesting Doctor",date:p.requestDate});
    if(p.currentStage>4&&p.attachments.length===1)p.attachments.push({name:"Nursing template worksheet.xlsx",step:"Stage 4 — Nursing Templates",by:"Mrs. Noura Al-Sabah",date:p.requestDate});
    if(p.currentStage>10&&rich&&!p.financial)p.financial=JSON.parse(JSON.stringify(rich.financial));
    if(p.currentStage>12&&rich&&!p.systemSetup)p.systemSetup=JSON.parse(JSON.stringify(rich.systemSetup));
  });
})();
// ─── LIVE-PARITY SEEDS — more approved packages so every edit state can be demoed ───
(()=>{
  const base=PROCS.find(p=>p.id==="00001");const cl=o=>JSON.parse(JSON.stringify(o));
  const mk=(id,patch)=>({...cl(base),id,...patch});
  PROCS.push(
    mk("00010",{version:2,branch:"NTH",requestDate:"2026-02-10",requestor:uf("u15"),specialty:"Endoscopy",proposedCptCode:"43239",proposedCptName:"Upper GI Endoscopy with Biopsy",accurateCptCode:"43239",accurateCptName:"Upper GI Endoscopy with Biopsy",patientType:"Out-Patient",anesthesia:"Required",gender:"Both",opSkill:"Endoscopy",accommodationDays:0,procedureDuration:"0:45",suggestedPrice:350,
      financial:{...cl(base.financial),finalPatientPrice:2400,marginPercent:56.9,acceptDoctorFees:"No",advancePayment:"Not applicable",serviceRevenueDoctors:"Direct",hasCap:"Yes",capLimit:2200},
      systemSetup:{...cl(base.systemSetup),opCode:"10804239",opName:"Upper GI Endoscopy with Biopsy",pkgId:"200122",procConsTemplate:"324",wardsConsTemplate:"1963",procDrugsTemplate:"325",wardsDrugsTemplate:"267"},
      timeline:[{ver:1,date:"2026-02-10 09:00",action:"New procedure request submitted",user:"Dr. Layla Al-Kassab",role:"Doctor",type:"create"},{ver:1,date:"2026-03-02 10:00",action:"CFO Acknowledged — Version 1 approved",user:"Mr. Yousef Al-Bahar",role:"CFO",type:"acknowledge"},{ver:2,date:"2026-09-12 11:20",action:"Combined change NF-001 applied (Clinical) — Version 2",user:"Mr. Fares Al-Methen",role:"CSCM",type:"complete"}],
      versionHistory:[{version:1,date:"2026-03-02",changedBy:"Dr. Layla Al-Kassab",summary:"Request raised"},{version:2,date:"2026-09-12",changedBy:"Dr. Layla Al-Kassab",change:"Non-financial edit",summary:"Combined change NF-001 — Clinical",editDiff:[{l:"Patient Type",from:"In-Patient",to:"Out-Patient"}]}],
      editDiff:{fromVersion:1,items:[{label:"Patient Type",old:"In-Patient",new:"Out-Patient"}]}}),
    mk("00011",{version:1,branch:"CEN",requestDate:"2026-09-15",migrated:true,requestor:uf("u7"),specialty:"General Surgery",proposedCptCode:"47562",proposedCptName:"Laparoscopic Cholecystectomy",accurateCptCode:"47562",accurateCptName:"Laparoscopic Cholecystectomy",patientType:"In-Patient",opSkill:"Laparoscopic Surgery",accommodationDays:1,procedureDuration:"1:30",suggestedPrice:0,
      financial:{...cl(base.financial),finalPatientPrice:1950,marginPercent:27.5,acceptDoctorFees:"Not applicable",advancePayment:"Not applicable",serviceRevenueDoctors:"Not applicable",hasCap:"Yes",capLimit:1700},
      systemSetup:{...cl(base.systemSetup),opCode:"1080309101",opName:"Laparoscopic Cholecystectomy",pkgId:"9101",procConsTemplate:"324",wardsConsTemplate:"1963",procDrugsTemplate:"325",wardsDrugsTemplate:"267"},
      migrationMeta:{extractDate:"2026-09-30",latestApprovalDate:"2026-09-15",relatedPeople:[],completed:true,approvedBy:"Mr. Fares Al-Methen"},
      timeline:[{ver:1,date:"2026-10-22 14:35",action:"Migrated from legacy data — PKGID 9101 · Op 1080309101 · costs as of 2026-09-30",user:"Migration",role:"PrimeCare import",type:"complete"}],
      versionHistory:[{version:1,date:"2026-10-22",changedBy:"Migration",summary:"Migrated from PrimeCare — templates 324, 1963, 325, 267 · costs as of 2026-09-30"}]}),
    mk("00012",{version:1,branch:"NTH",requestDate:"2026-08-04",requestor:uf("u1"),specialty:"ENT",proposedCptCode:"42826",proposedCptName:"Tonsillectomy, primary or secondary; age 12 or over",accurateCptCode:"42826",accurateCptName:"Tonsillectomy, primary or secondary; age 12 or over",patientType:"In-Patient",opSkill:"Minor",accommodationDays:1,procedureDuration:"1:00",suggestedPrice:900,
      financial:{...cl(base.financial),finalPatientPrice:1650,marginPercent:7.9,acceptDoctorFees:"Yes",advancePayment:"Yes",serviceRevenueDoctors:"Direct",hasCap:"No",capLimit:0},
      systemSetup:{...cl(base.systemSetup),opCode:"10842826",opName:"Tonsillectomy",pkgId:"QA-W2-05",procConsTemplate:"294",wardsConsTemplate:"1963",procDrugsTemplate:"295",wardsDrugsTemplate:"257"},
      timeline:[{ver:1,date:"2026-08-04 09:00",action:"New procedure request submitted",user:"Dr. Ahmed Al-Rashidi",role:"Doctor",type:"create"},{ver:1,date:"2026-09-05 12:00",action:"CFO Acknowledged — Version 1 approved",user:"Mr. Yousef Al-Bahar",role:"CFO",type:"acknowledge"}],
      versionHistory:[{version:1,date:"2026-09-05",changedBy:"Dr. Ahmed Al-Rashidi",summary:"Request raised"}]}),
    mk("00013",{version:1,branch:"CEN",requestDate:"2026-07-12",requestor:uf("u1"),specialty:"Cardiac Catheterization",proposedCptCode:"33533",proposedCptName:"CABG Single Arterial Graft",accurateCptCode:"33533",accurateCptName:"CABG Single Arterial Graft",patientType:"In-Patient",opSkill:"Advanced",accommodationDays:5,procedureDuration:"4:00",suggestedPrice:4200,
      financial:{...cl(base.financial),finalPatientPrice:4650,marginPercent:204.0,acceptDoctorFees:"Yes",advancePayment:"Yes",serviceRevenueDoctors:"Direct",hasCap:"Yes",capLimit:4400},
      systemSetup:{...cl(base.systemSetup),opCode:"10833533",opName:"CABG Single Arterial Graft",pkgId:"4049",procConsTemplate:"2233",wardsConsTemplate:"1883",procDrugsTemplate:"7130",wardsDrugsTemplate:"265"},
      timeline:[{ver:1,date:"2026-07-12 09:00",action:"New procedure request submitted",user:"Dr. Ahmed Al-Rashidi",role:"Doctor",type:"create"},{ver:1,date:"2026-08-20 12:00",action:"CFO Acknowledged — Version 1 approved",user:"Mr. Yousef Al-Bahar",role:"CFO",type:"acknowledge"}],
      versionHistory:[{version:1,date:"2026-08-20",changedBy:"Dr. Ahmed Al-Rashidi",summary:"Request raised"}]})
  );
})();
// ─── REQUESTOR (DOCTOR) VIEW SEEDS — live "Intranet" account parity ───
// Requests sent back to the doctor (Modification Requested, stage 1 — "Complete and submit"),
// drafts the doctor saved but never submitted (Dashboard → My Drafts), and one rejected request.
(()=>{
  const base=PROCS.find(p=>p.id==="00003");const cl=o=>JSON.parse(JSON.stringify(o));
  const ago=n=>{const x=new Date();x.setDate(x.getDate()-n);return x.toISOString().slice(0,10);};
  const doc=uf("u1");const cmo=uf("u2");
  const mk=(id,patch)=>({...cl(base),requestor:doc,branch:doc.branch,attachments:[],reqDocs:[],extraServices:"",...patch,id});
  const back=(id,days,patch,note,by=cmo,from=2)=>mk(id,{status:"modification",currentStage:1,stageStartDate:ago(days),returnTo:from,
    modifyNote:{comment:note,by:by.name,role:by.title,stage:STAGES.find(s=>s.num===from).label,date:ago(days)+" 06:00"},...patch,
    timeline:[{date:ago(days+6)+" 13:53",action:"New procedure request submitted",user:doc.name,role:"Doctor",type:"create"},
      {date:ago(days)+" 06:00",action:`Modification requested: ${note}`,user:by.name,role:by.title,type:"modify"},
      {date:ago(days)+" 06:00",action:"Returned to the requesting doctor (Doctor Request)",user:"System",role:"System",type:"route"}]});
  PROCS.push(
    back("00014",4,{requestDate:ago(10),specialty:"Orthopedics",proposedCptCode:"29881",proposedCptName:"Knee Arthroscopy with Meniscectomy",patientType:"In-Patient",anesthesia:"Required",gender:"Male",opSkill:"Advanced",suggestedPrice:100,accommodationDays:2,procedureDuration:"0:50",
      manpower:"1 Surgeon, 1 Anesthetist",machinesDevices:"Arthroscopy tower",consumablesDrugs:"Bone cement",labRadiology:"X-ray"},"Please add the scrub nurse to man power and confirm the implant list"),
    back("00015",12,{requestDate:ago(19),specialty:"Orthopedics",proposedCptCode:"29881",proposedCptName:"Knee Arthroscopy with Meniscectomy",patientType:"Out-Patient",anesthesia:"Required",gender:"Both",opSkill:"Minor",suggestedPrice:850,accommodationDays:0,procedureDuration:"1:15",
      manpower:"1 Surgeon",machinesDevices:"Arthroscopy tower",consumablesDrugs:"Arthroscopic shaver blade",labRadiology:"CBC"},"Suggested price is missing the day-case basis — please revise"),
    back("00016",13,{requestDate:ago(22),specialty:"ENT",proposedCptCode:"11442",proposedCptName:"Excision, other benign lesion incl. margins, face/ears/nose, 1.1-2.0 cm",patientType:"Out-Patient",anesthesia:"Not Required",gender:"Both",opSkill:"Minor",suggestedPrice:220,accommodationDays:0,procedureDuration:"0:40",
      manpower:"1 Surgeon, 1 Nurse",machinesDevices:"Electrocautery unit",consumablesDrugs:"Sutures 5-0",labRadiology:"Histopathology"},"Attach the histopathology pathway the clinic uses"),
    mk("00017",{status:"draft",currentStage:1,requestDate:ago(1),stageStartDate:ago(1),specialty:"",proposedCptCode:"",proposedCptName:"",patientType:"In-Patient",anesthesia:"Required",gender:"",opSkill:"",suggestedPrice:"",accommodationDays:0,procedureDuration:"0:00",manpower:"",machinesDevices:"",consumablesDrugs:"",labRadiology:"",
      timeline:[{date:ago(1)+" 19:04",action:"Draft saved",user:doc.name,role:"Doctor",type:"draft"}]}),
    mk("00018",{status:"draft",currentStage:1,requestDate:ago(8),stageStartDate:ago(8),specialty:"Cardiac Catheterization",proposedCptCode:"33533",proposedCptName:"CABG Single Arterial Graft",patientType:"In-Patient",anesthesia:"Required",gender:"Both",opSkill:"",suggestedPrice:"",accommodationDays:5,procedureDuration:"4:00",manpower:"2 Surgeons, 1 Perfusionist",machinesDevices:"Heart-lung machine",consumablesDrugs:"",labRadiology:"",
      timeline:[{date:ago(8)+" 10:50",action:"Draft saved",user:doc.name,role:"Doctor",type:"draft"}]}),
    mk("00019",{status:"draft",currentStage:1,requestDate:ago(8),stageStartDate:ago(8),specialty:"ENT",proposedCptCode:"11444",proposedCptName:"Excision, other benign lesion incl. margins, face/ears/nose, 3.1-4.0 cm",patientType:"Out-Patient",anesthesia:"Not Required",gender:"",opSkill:"",suggestedPrice:"",accommodationDays:0,procedureDuration:"0:00",manpower:"",machinesDevices:"",consumablesDrugs:"",labRadiology:"",
      timeline:[{date:ago(8)+" 10:49",action:"Draft saved",user:doc.name,role:"Doctor",type:"draft"}]}),
    mk("00020",{status:"rejected",currentStage:2,requestDate:ago(60),stageStartDate:ago(55),specialty:"Plastic Surgery",proposedCptCode:"15734",proposedCptName:"Muscle Flap Reconstruction",patientType:"In-Patient",anesthesia:"Required",gender:"Both",opSkill:"Major",suggestedPrice:2600,accommodationDays:3,procedureDuration:"3:30",
      timeline:[{date:ago(60)+" 11:57",action:"New procedure request submitted",user:doc.name,role:"Doctor",type:"create"},{date:ago(55)+" 09:12",action:"Rejected: Covered by the existing reconstruction package — raise an edit on it instead",user:cmo.name,role:cmo.title,type:"reject"}]})
  );
})();
// ─── MORE REQUESTOR SEEDS — the live "Intranet" doctor has a request at nearly every status, so the
// Status / Specialty filters list every value (live builds those filters from the requests themselves).
(()=>{
  const base=PROCS.find(p=>p.id==="00003");const rich=PROCS.find(p=>p.id==="00001");const cl=o=>JSON.parse(JSON.stringify(o));
  const ago=n=>{const x=new Date();x.setDate(x.getDate()-n);return x.toISOString().slice(0,10);};
  const doc=uf("u1");
  const mk=(id,br,spec,code,name,status,stage,daysOld,extra={})=>{
    const u={...cl(base),id,branch:br,requestor:doc,specialty:spec,proposedCptCode:code,proposedCptName:name,accurateCptCode:stage>3?code:"",accurateCptName:stage>3?name:"",cptStatus:stage>3?"New":"",
      status,currentStage:stage,requestDate:ago(daysOld),stageStartDate:ago(Math.max(1,Math.round(daysOld/6))),extraServices:"",attachments:[],reqDocs:[],
      timeline:[{date:ago(daysOld)+" 11:57",action:"Request raised and submitted for CMO approval",user:doc.name,role:"Doctor",type:"create"}],
      versionHistory:[{version:1,date:ago(daysOld),changedBy:doc.name,summary:"New procedure request"}],...extra};
    if(stage>4&&stage<99)u.templates=cl(rich.templates);
    if(stage>10&&stage<99)u.financial=cl(rich.financial);
    if(stage>12&&stage<99)u.systemSetup=cl(rich.systemSetup);
    return u;};
  const ex=(id,br,spec,code,name,status,stage,daysOld)=>mk(id,br,spec,code,name,status,stage,daysOld,{cptStatus:"Exists",accurateCptCode:code,accurateCptName:name});
  PROCS.push(
    mk("00021","CEN","Orthopedics","20550","Injection, tendon sheath","pending_cmo",2,41),
    mk("00022","CEN","Orthopedics","27447","Total Knee Replacement","pending_cmo",2,52),
    mk("00023","CEN","Endoscopy","43235","Diagnostic Upper GI Endoscopy","pending_cmio_delegate",3,67,{delegatedTo:uf("u4").email,delegatedToUser:uf("u4"),delegatedBy:uf("u3").email,delegatedByUser:uf("u3")}),
    ex("00024","CEN","Orthopedics","29881","Knee Arthroscopy with Meniscectomy","cpt_exists",16,83),
    ex("00025","CEN","Endoscopy","43235","Diagnostic Upper GI Endoscopy","cpt_exists_cfo_ack",99,84),
    mk("00026","CEN","ENT","11444","Excision, other benign lesion incl. margins, face/ears/nose, 3.1-4.0 cm","pending_nursing",4,87),
    ex("00027","NTH","ENT","69436","Tympanostomy with Tubes","cpt_exists_cmo_ack",99,111),
    mk("00028","CEN","Urology","55700","Prostate Biopsy","pending_cscm_link",14,111),
    mk("00029","NTH","General Surgery","44970","Laparoscopic Appendectomy","pending_cfo_pkg",13,111),
    mk("00030","CEN","IVF","58970","Oocyte Retrieval","pending_cscm_delegate",12,111,{delegatedTo:uf("u14").email,delegatedToUser:uf("u14"),delegatedBy:uf("u13").email,delegatedByUser:uf("u13")}),
    mk("00031","NTH","Dental","41899","Surgical Extraction, Impacted Molar","pending_other_cmo",9,111),
    mk("00032","CEN","Respiratory","31622","Diagnostic Bronchoscopy","pending_other_cno",8,111),
    mk("00033","NTH","Interventional","37226","Femoral Artery Stent","pending_cmo_final",7,111),
    mk("00034","CEN","Thoracic Surgery","32663","Thoracoscopic Lobectomy","pending_surgeon",6,111),
    mk("00035","NTH","Pediatric Surgery","49505","Inguinal Hernia Repair","pending_cno",5,111),
    mk("00036","CEN","Ophthalmology","66984","Cataract Extraction with IOL","pending_ack",15,111),
    mk("00037","NTH","Cardiac Catheterization","92928","Coronary Stent Placement","pending_ceo",11,111),
    mk("00038","NTH","Oby/Gyn","59510","Caesarean Delivery","pending_nursing",4,111),
    ex("00039","CEN","ENT","30520","Septoplasty","cpt_exists",16,111),
    mk("00040","CEN","Orthopedics","27130","Total Hip Arthroplasty","approved",16,111,{migrated:true,version:1,financial:cl(rich.financial),templates:cl(rich.templates),systemSetup:{...cl(rich.systemSetup),pkgId:"LEG-0001"},
      migrationMeta:{extractDate:ago(111),relatedPeople:[],completed:false},
      timeline:[{date:ago(111)+" 11:57",action:"Migrated from legacy data",user:"Migration",role:"PrimeCare import",type:"complete"}],
      versionHistory:[{version:1,date:ago(111),changedBy:"Migration",summary:"Migrated from PrimeCare"}]})
  );
})();

// ─── MULTI-VERSION DEMO (live: CPT-2026-00723 went V1 → V5 through NF and FIN amendments) ───
(()=>{
  const base=PROCS.find(p=>p.id==="00001");const cl=o=>JSON.parse(JSON.stringify(o));const doc=uf("u1");
  const ago=n=>{const x=new Date();x.setDate(x.getDate()-n);return x.toISOString().slice(0,10);};
  const fin={...cl(base.financial),finalPatientPrice:2600,ceoAdjustedPrice:2600,cfoPrice:2450,ceoApproved:true,ceoBy:"Dr. Abdul Rahman Al-Mutairi",ceoDate:ago(5)+" 11:10",manpowerCost:2000,totalServicesCost:2800,totalOverallCost:3129.85,marginPercent:-16.9,hasCap:"Yes",capLimit:2400};
  const tl=(v,dt,action,user,role,type,comment)=>({ver:v,date:dt,action,user,role,type,comment});
  PROCS.push({...cl(base),id:"00042",version:4,status:"approved",lifecycle:"Active",requestDate:ago(70),branch:"NTH",requestor:doc,
    specialty:"ENT",proposedCptCode:"11444",proposedCptName:"Excision, other benign lesion incl. margins, face/ears/nose, 3.1-4.0 cm",accurateCptCode:"11444",accurateCptName:"Excision, other benign lesion incl. margins, face/ears/nose, 3.1-4.0 cm",cptStatus:"New",
    patientType:"In-Patient",anesthesia:"Required",gender:"Male",opSkill:"Advanced Intervention",suggestedPrice:2000,accommodationDays:2,procedureDuration:"2:00",
    manpower:"1 Surgeon; 1 Anesthetist; 2 Scrub Nurses",machinesDevices:"Electrocautery unit; Operating microscope",labRadiology:"CBC; Histopathology",consumablesDrugs:"Sutures 5-0",extraServices:"Dressing review",
    financial:fin,systemSetup:{...cl(base.systemSetup),opCode:"10842042",opName:"Excision benign lesion face 3.1-4.0 cm",pkgId:"4042",pkgName:"Facial Lesion Excision (Large)"},
    currentStage:16,stageStartDate:ago(5),
    editDiff:{fromVersion:3,items:[
      {sec:"fields",label:"Accommodation Days",old:"1",new:"2"},{sec:"fields",label:"Surgery Duration",old:"1:30",new:"2:00"},
      {sec:"los",label:"Man Power",added:["2 Scrub Nurses"],removed:["1 Scrub Nurse"]},
      {sec:"templates",label:"Procedure Consumables",added:["IV Cannula 22G Safety (10202080300008) · 2 PIECE"],removed:["Surgical Blade No.10 (CON-010) · 1 Each"]},
      {sec:"financials",label:"Manpower cost",old:"1200",new:"2000"},{sec:"financials",label:"Total services cost",old:"2000",new:"2800"},{sec:"financials",label:"Total overall cost",old:"2329.850",new:"3129.850"},{sec:"financials",label:"Maximum CAP limit",old:"0",new:"2400"},
    ]},
    versionHistory:[
      {version:1,date:ago(60),changedBy:doc.name,change:"Request raised",summary:"Request raised"},
      {version:2,date:ago(40),changedBy:doc.name,change:"Non-financial edit",summary:"Combined change NF-006 — Clinical + CPT",editDiff:[{l:"Patient Type",old:"Both",new:"In-Patient"},{l:"Specialty",old:"Endoscopy",new:"ENT"},{l:"CPT Code",old:"43239",new:"11444"},{l:"CPT Name",old:"Upper GI Endoscopy with Biopsy",new:"Excision, other benign lesion…"},{l:"Gender",old:"Female",new:"Male"}]},
      {version:3,date:ago(25),changedBy:uf("u10").name,change:"Non-financial edit",summary:"Combined change NF-007 — PKGID + Op code",editDiff:[{l:"PKGID",old:"4041",new:"4042"},{l:"Package Name",old:"Facial Lesion Excision",new:"Facial Lesion Excision (Large)"},{l:"Operation Code",old:"10842041",new:"10842042"}]},
      {version:4,date:ago(5),changedBy:doc.name,change:"Financial edit",summary:"Finance — new version V4",editDiff:[{l:"Accommodation Days",old:"1",new:"2"},{l:"Surgery Duration",old:"1:30",new:"2:00"},{l:"Man Power",old:"1 Scrub Nurse",new:"2 Scrub Nurses"},{l:"Manpower cost",old:"1200",new:"2000"},{l:"Maximum CAP limit",old:"0",new:"2400"}]},
    ],
    timeline:[
      tl(1,ago(70)+" 09:00","Request raised and submitted for CMO approval",doc.name,"Doctor","create"),
      tl(1,ago(60)+" 12:00","CFO acknowledged — package approved and certificate issued for version 1",uf("u10").name,"CFO","acknowledge"),
      tl(2,ago(42)+" 10:00","Amendment NF-006 raised — Clinical + CPT",doc.name,"Doctor","create","Patient pathway changed to in-patient; coding corrected"),
      tl(2,ago(40)+" 15:00","NF-006 confirmed on PrimeCare and applied as version V2",uf("u13").name,"CSCM","complete"),
      tl(3,ago(27)+" 09:30","Amendment NF-007 raised — PKGID + Op code",uf("u10").name,"CFO","create","PrimeCare package re-keyed"),
      tl(3,ago(25)+" 14:00","NF-007 confirmed on PrimeCare and applied as version V3",uf("u10").name,"CFO","complete"),
      tl(4,ago(12)+" 09:00","Financial edit FIN-003 raised — Finance — new version V4",doc.name,"Doctor","create","Longer stay and extra scrub nurse"),
      tl(4,ago(9)+" 11:00","Financials (FCD) — approved; sent to CEO Price Review",uf("u10").name,"CFO","approve"),
      tl(4,ago(8)+" 11:10","CEO approved & adjusted the patient price",uf("u12").name,"CEO","approve"),
      tl(4,ago(5)+" 12:00","CFO acknowledged — package approved and certificate issued for version 4",uf("u10").name,"CFO","acknowledge"),
    ]});
})();
// Edit requests in every state the live Dashboard shows: in approval, returned, awaiting PrimeCare confirm,
// applied, rejected, withdrawn — plus a finance re-run (FIN) that adds Other-branch CMIO and CFMO as numbered stages.
function seedEditReqs(procs,design,cfg){
  const P=id=>procs.find(p=>p.id===id);const d=(n)=>{const x=new Date();x.setDate(x.getDate()-n);return x.toISOString().slice(0,10);};
  const nf=(id,baseId,scen,changes,reason,raisedBy,extra)=>{const b=P(baseId);const rt=buildEditRoute(scen,b,design,cfg);
    return {id,kind:"nf",baseId,cpt:b.accurateCptName||b.proposedCptName,branch:b.branch,scenarios:scen,groupId:scen[0],groupName:scen.map(s=>SCEN_SHORT[s]).join(" + "),changes,reason,chain:rt.steps,confirmRole:rt.confirm,stage:0,phase:"approval",status:"pending",done:false,raisedBy,fromVer:b.version,toVer:b.version+1,date:d(3),stageDate:d(2),timeline:[{by:raisedBy,action:`Amendment ${id} raised — ${scen.map(s=>SCEN_SHORT[s]).join(" + ")} — "${reason}"`,date:d(3)+" 09:10"}],...extra};};
  const out=[];
  out.push(nf("NF-001","00010",["clinical"],[{k:"patientType",l:"Patient Type",from:"In-Patient",to:"Out-Patient",tab:"overview"}],"Day-case pathway agreed with the unit","Dr. Layla Al-Kassab",{fromVer:1,toVer:2,status:"completed",done:true,phase:"done",date:"2026-09-08",timeline:[{by:"Dr. Layla Al-Kassab",action:"Amendment NF-001 raised — Clinical",date:"2026-09-08 09:00"},{by:"Dr. Mohammad Al-Shammari",action:"Requestor Chief — Approved",date:"2026-09-09 10:00"},{by:"Dr. Nasser Al-Duwaisan",action:"Branch CMO — Approved",date:"2026-09-10 11:00"},{by:"Dr. Fatima Al-Kandari",action:"Other-branch CMO — Approved · awaiting PrimeCare confirm",date:"2026-09-11 09:30"},{by:"Mr. Fares Al-Methen",action:"Confirmed on PrimeCare — applied as V2",date:"2026-09-12 11:20"}]}));
  out.push(nf("NF-002","00001",["cpt"],[{k:"cptCode",l:"CPT Code",from:"27447",to:"27446",tab:"overview"},{k:"cptName",l:"CPT Name",from:"Total Knee Replacement",to:"Total Knee Arthroplasty (Unicompartmental)",tab:"overview"}],"Coding audit — unicompartmental variant is what is performed","Dr. Ahmed Al-Rashidi",{stage:1,timeline:[{by:"Dr. Ahmed Al-Rashidi",action:"Amendment NF-002 raised — CPT",date:d(3)+" 09:10"},{by:"Dr. Mohammad Al-Shammari",action:"Requestor Chief — Approved · sent to CMIO (CEN)",date:d(2)+" 13:40"}]}));
  out.push(nf("NF-003","00010",["fees"],[{k:"acceptDoctorFees",l:"Accept Doctor Fees",from:"No",to:"Yes",tab:"financial"},{k:"advancePayment",l:"Advance Payment Portion (Inpatient Visit)",from:"Not applicable",to:"Yes",tab:"financial"}],"Align with the 2027 insurer contract","Mr. Ali Al-Mansour",{status:"returned",phase:"returned",returnNote:{by:"Mr. Yousef Al-Bahar",text:"Advance payment only applies to in-patient — please re-check before sending round again",date:d(1)},timeline:[{by:"Mr. Ali Al-Mansour",action:"Amendment NF-003 raised — Fees",date:d(3)+" 09:10"},{by:"Mr. Yousef Al-Bahar",action:"NF-003 returned for changes — with Mr. Ali Al-Mansour — \"Advance payment only applies to in-patient\"",date:d(1)+" 15:05"}]}));
  out.push(nf("NF-004","00011",["pkg"],[{k:"pkgName",l:"Package Name",from:"Laparoscopic Cholecystectomy",to:"Laparoscopic Cholecystectomy (Day Case)",tab:"system"}],"Package renamed on the price list","Mr. Yousef Al-Bahar",{phase:"confirm",stage:1,timeline:[{by:"Mr. Yousef Al-Bahar",action:"Amendment NF-004 raised — PKGID",date:d(3)+" 09:10"},{by:"Mr. Yousef Al-Bahar",action:"CFO — Approved · awaiting PrimeCare confirm (FCD)",date:d(1)+" 10:00"}]}));
  out.push(nf("NF-005","00011",["clinical"],[{k:"gender",l:"Gender",from:"Both",to:"Female"}],"Raised in error","Dr. Mohammad Al-Shammari",{status:"rejected",done:true,phase:"done",timeline:[{by:"Dr. Mohammad Al-Shammari",action:"Amendment NF-005 raised — Clinical",date:"2026-10-01 09:00"},{by:"Dr. Fatima Al-Kandari",action:"Rejected: not clinically supported",date:"2026-10-02 12:00"}]}));
  const b12=P("00012");const frt=buildEditRoute(["finance","cpt","opcode"],b12,design,cfg);
  const ceoIx=frt.stages.findIndex(s=>s.base===11);
  out.push({id:"FIN-001",kind:"fin",baseId:"00012",cpt:b12.accurateCptName,branch:b12.branch,scenarios:["cpt","opcode","finance"],groupId:"finance",groupName:"CPT + Op code + Finance",
    changes:[{k:"cptCode",l:"CPT Code",from:"42826",to:"42825",tab:"overview"},{k:"opCode",l:"Operation Code",from:"10842826",to:"10842825",tab:"system"},{k:"finalPatientPrice",l:"Final Patient Price (CFO)",from:"1650",to:"1780",tab:"financial"}],
    reason:"Paediatric variant split out — repriced for the new consumables",stages:frt.stages,stage:ceoIx,phase:"approval",status:"pending",done:false,raisedBy:"Dr. Ahmed Al-Rashidi",fromVer:1,toVer:2,date:d(6),stageDate:d(4),
    timeline:frt.stages.slice(0,ceoIx).map((s,i)=>({by:s.name||"Approver",action:`${s.full||s.label} — Approved (V2 re-run)`,date:d(6-Math.min(i,5))+" 10:00"}))});
  out.push({id:"FIN-002",kind:"fin",baseId:"00012",cpt:b12.accurateCptName,branch:b12.branch,scenarios:["finance"],groupId:"finance",groupName:"Finance",changes:[{k:"accommodationDays",l:"Accommodation Days",from:"1",to:"2",tab:"overview"}],reason:"Longer observation",stages:buildEditRoute(["finance"],b12,design,cfg).stages,stage:2,phase:"done",status:"withdrawn",done:true,raisedBy:"Dr. Ahmed Al-Rashidi",fromVer:1,toVer:2,date:"2026-08-20",timeline:[{by:"Dr. Ahmed Al-Rashidi",action:"Amendment FIN-002 raised — Finance",date:"2026-08-20 09:00"},{by:"Dr. Ahmed Al-Rashidi",action:"Withdrawn by the raiser — package stays at V1",date:"2026-08-21 08:30"}]});
  // multi-version demo package 00042 — the applied amendments behind V2, V3 and V4
  out.push(nf("NF-006","00042",["clinical","cpt"],[{k:"patientType",l:"Patient Type",from:"Both",to:"In-Patient",tab:"overview"},{k:"specialty",l:"Specialty",from:"Endoscopy",to:"ENT",tab:"overview"},{k:"cptCode",l:"CPT Code",from:"43239",to:"11444",tab:"overview"},{k:"gender",l:"Gender",from:"Female",to:"Male",tab:"overview"}],"Patient pathway changed to in-patient; coding corrected","Dr. Ahmed Al-Rashidi",{fromVer:1,toVer:2,status:"completed",done:true,phase:"done",date:d(42),timeline:[{by:"Dr. Ahmed Al-Rashidi",action:"Amendment NF-006 raised — Clinical + CPT",date:d(42)+" 10:00"},{by:"Mr. Fares Al-Methen",action:"Confirmed on PrimeCare — applied as V2",date:d(40)+" 15:00"}]}));
  out.push(nf("NF-007","00042",["pkg","opcode"],[{k:"pkgId",l:"PKGID",from:"4041",to:"4042",tab:"system"},{k:"pkgName",l:"Package Name",from:"Facial Lesion Excision",to:"Facial Lesion Excision (Large)",tab:"system"},{k:"opCode",l:"Operation Code",from:"10842041",to:"10842042",tab:"system"}],"PrimeCare package re-keyed","Mr. Yousef Al-Bahar",{fromVer:2,toVer:3,status:"completed",done:true,phase:"done",date:d(27),timeline:[{by:"Mr. Yousef Al-Bahar",action:"Amendment NF-007 raised — PKGID + Op code",date:d(27)+" 09:30"},{by:"Mr. Yousef Al-Bahar",action:"Confirmed on PrimeCare — applied as V3",date:d(25)+" 14:00"}]}));
  {const b=P("00042");const r3=buildEditRoute(["finance"],b,design,cfg);
   out.push({id:"FIN-003",kind:"fin",baseId:"00042",cpt:b.accurateCptName,branch:b.branch,scenarios:["finance"],groupId:"finance",groupName:"Finance",
     changes:[{k:"accommodationDays",l:"Accommodation Days",from:"1",to:"2",tab:"overview"},{k:"procedureDuration",l:"Surgery Duration",from:"1:30",to:"2:00",tab:"overview"},{k:"capLimit",l:"Maximum CAP Limit",from:"0",to:"2400",tab:"financial"}],
     reason:"Longer stay and extra scrub nurse",stages:r3.stages,stage:r3.stages.length,phase:"done",status:"completed",done:true,raisedBy:"Dr. Ahmed Al-Rashidi",fromVer:3,toVer:4,date:d(12),stageDate:d(5),
     timeline:r3.stages.map((s,i)=>({by:s.name||"Approver",action:`${s.full||s.label} — Approved (V4 re-run)`,date:d(12-Math.min(i,7))+" 10:00"}))});}
  return out;
}
