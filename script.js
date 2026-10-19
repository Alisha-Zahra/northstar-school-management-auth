const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const roles = {
  accountant: {name:"Amina Malik", initials:"AM", label:"Accountant", greeting:"Good afternoon, Amina", subtitle:"Here’s what needs your attention across the school today."},
  hod: {name:"Sana Khan", initials:"SK", label:"HOD", greeting:"HOD overview", subtitle:"Verify entries, check documents and return incomplete requests before final approval."},
  gm: {name:"Faisal Ahmed", initials:"FA", label:"GM", greeting:"Management overview", subtitle:"Monitor school-wide performance and make final decisions on important requests."}
};
let currentRole = "accountant";
let currentPage = "overview";
let vendors = [
  {id:"VEN-001",name:"Bright Supplies Co.",category:"Stationery",contact:"Farhan Ahmed",phone:"+92 300 120 8841",email:"accounts@brightsupplies.example",date:"14 Oct 2026",balance:86500,status:"Active",address:"Jutial, Gilgit"},
  {id:"VEN-002",name:"Alpine Uniform House",category:"Uniforms",contact:"Nadia Karim",phone:"+92 301 449 2082",email:"orders@alpineuniforms.example",date:"12 Oct 2026",balance:0,status:"Active",address:"Main Bazar, Gilgit"},
  {id:"VEN-003",name:"Mountain Mechanical",category:"Maintenance",contact:"Usman Shah",phone:"+92 333 201 5678",email:"service@mountainmech.example",date:"10 Oct 2026",balance:48500,status:"Active",address:"Konodas, Gilgit"},
  {id:"VEN-004",name:"Northern Paper Traders",category:"Stationery",contact:"Adeel Hussain",phone:"+92 355 660 3210",email:"sales@northernpaper.example",date:"09 Oct 2026",balance:125000,status:"Review",address:"Gilgit Industrial Area"},
  {id:"VEN-005",name:"Karakoram Transport",category:"Transport",contact:"Imran Baig",phone:"+92 300 777 1190",email:"office@karakoramtransport.example",date:"07 Oct 2026",balance:26000,status:"Active",address:"Airport Road, Gilgit"},
  {id:"VEN-006",name:"Fresh Valley Foods",category:"Food & supplies",contact:"Shazia Ali",phone:"+92 355 130 9911",email:"hello@freshvalley.example",date:"06 Oct 2026",balance:0,status:"Active",address:"Shaheed-e-Millat Road, Gilgit"},
  {id:"VEN-007",name:"Peak Print Studio",category:"Printing",contact:"Bilal Karim",phone:"+92 300 418 7732",email:"print@peakstudio.example",date:"03 Oct 2026",balance:74500,status:"Review",address:"NLI Market, Gilgit"},
  {id:"VEN-008",name:"Summit Electricals",category:"Maintenance",contact:"Kamran Abbas",phone:"+92 355 201 7800",email:"support@summitelectricals.example",date:"01 Oct 2026",balance:24000,status:"Active",address:"Danyor, Gilgit"}
];
let activity = [
  {title:"Fee payment received",detail:"Student fee · Class 6-B",ref:"FEE-2610-084",owner:"Nadia Ali",initials:"NA",date:"15 Oct, 10:42 AM",status:"Recorded",type:"fee"},
  {title:"Stationery invoice",detail:"Bright Supplies Co.",ref:"INV-2026-119",owner:"Farhan Ahmed",initials:"FA",date:"15 Oct, 09:18 AM",status:"Pending HOD",type:"vendor"},
  {title:"Transport fuel expense",detail:"Operations · Transport",ref:"EXP-2610-032",owner:"Sana Khan",initials:"SK",date:"14 Oct, 03:26 PM",status:"In review",type:"expense"},
  {title:"Uniform stock received",detail:"Winter uniforms · 120 units",ref:"STK-2610-018",owner:"Hamza Mir",initials:"HM",date:"14 Oct, 11:05 AM",status:"Completed",type:"stock"}
];

const pageConfig = {
  students:{title:"Students",eyebrow:"STUDENT RECORDS",subtitle:"Find student records, review fee status and keep essential details in one place.",table:"Student directory",tableSub:"Sample records for demonstration.",primary:"＋ Add student",metrics:[["Enrolled students","1,248","Across 28 sections"],["Fee accounts current","91.4%","Paid or on schedule"],["Follow-ups due","37","Require fee review"]],headers:["STUDENT","CLASS","GUARDIAN","FEE STATUS","BALANCE",""],rows:[
    ["Areeba Hassan","Grade 6 · B","Naveed Hassan","Paid","Rs. 0","paid"],["Rayyan Karim","Grade 8 · A","Sadia Karim","Part paid","Rs. 4,500","pending"],["Zoya Ahmed","Grade 4 · C","Farooq Ahmed","Overdue","Rs. 8,000","overdue"],["Daniyal Shah","Grade 7 · A","Mehwish Shah","Paid","Rs. 0","paid"],["Minaal Abbas","Grade 5 · B","Hassan Abbas","Part paid","Rs. 2,500","pending"]]},
  fees:{title:"Fee management",eyebrow:"STUDENT ACCOUNTS",subtitle:"Track collections, dues and fee adjustments with a clear audit trail.",table:"Recent fee entries",tableSub:"Fictional payment records for the prototype.",primary:"＋ Record payment",metrics:[["Collected this month","Rs. 8.42M","↑ 8.2% from September"],["Outstanding","Rs. 1.26M","Across all classes"],["Receipts recorded","846","This month"]],headers:["RECEIPT","STUDENT","CLASS","PAYMENT DATE","AMOUNT","STATUS"],rows:[
    ["FEE-2610-084","Areeba Hassan","Grade 6-B","15 Oct 2026","Rs. 18,500","paid"],["FEE-2610-083","Rayyan Karim","Grade 8-A","15 Oct 2026","Rs. 12,000","paid"],["FEE-2610-082","Minaal Abbas","Grade 5-B","14 Oct 2026","Rs. 9,500","paid"],["FEE-2610-081","Zoya Ahmed","Grade 4-C","14 Oct 2026","Rs. 5,000","pending"],["FEE-2610-080","Daniyal Shah","Grade 7-A","13 Oct 2026","Rs. 18,500","paid"]]},
  inventory:{title:"Inventory",eyebrow:"STOCK & ANCILLARIES",subtitle:"Monitor school supplies, uniforms and reorder needs before they become urgent.",table:"Stock register",tableSub:"Illustrative stock counts; verify before any real purchase.",primary:"＋ Add stock item",metrics:[["Tracked items","186","Across 7 categories"],["Below reorder level","3 items","Action recommended"],["Stock valuation","Rs. 2.84M","Illustrative value"]],headers:["ITEM","CATEGORY","IN STOCK","REORDER AT","LAST UPDATED","STATUS"],rows:[
    ["Grade 4 notebooks","Stationery","42 packs","80 packs","15 Oct 2026","low"],["Winter uniform · M","Uniforms","124 units","40 units","14 Oct 2026","paid"],["A4 paper cartons","Stationery","18 cartons","15 cartons","13 Oct 2026","paid"],["Whiteboard markers","Classroom","9 boxes","12 boxes","12 Oct 2026","low"],["School ties","Uniforms","68 units","25 units","10 Oct 2026","paid"]]},
  expenses:{title:"Expenses",eyebrow:"SPENDING & RECONCILIATION",subtitle:"Review operating costs and keep each expense linked to its supporting record.",table:"Expense register",tableSub:"Sample requests and payments for this demo.",primary:"＋ New expense",metrics:[["Spend this month","Rs. 1.86M","Across 6 cost groups"],["Awaiting approval","Rs. 214,500","4 requests"],["Receipts attached","96.2%","Documentation coverage"]],headers:["REFERENCE","DESCRIPTION","DEPARTMENT","AMOUNT","SUBMITTED BY","STATUS"],rows:[
    ["EXP-2610-032","Transport fuel","Transport","Rs. 26,000","Sana Khan","pending"],["EXP-2610-031","Generator maintenance","Facilities","Rs. 48,500","Hamza Mir","pending"],["EXP-2610-030","Classroom supplies","Academics","Rs. 16,800","Nadia Ali","paid"],["EXP-2610-029","Internet service","IT","Rs. 22,000","Farhan Ahmed","paid"],["EXP-2610-028","Water delivery","Facilities","Rs. 8,500","Amina Malik","paid"]]},
  approvals:{title:"Approval center",eyebrow:"REVIEW & DECISIONS",subtitle:"Follow each request from submission to verification and final decision.",table:"Requests requiring attention",tableSub:"Actions are simulated in this frontend demo.",primary:"＋ New request",metrics:[["Awaiting your action","4 requests","2 submitted today"],["Total requested","Rs. 214,500","Pending decisions"],["Average review time","1.4 days","Last 30 days · sample"]],headers:["REQUEST","SUBMITTED BY","AMOUNT","SUBMITTED","STAGE","ACTION"],rows:[
    ["Generator maintenance","Hamza Mir","Rs. 48,500","15 Oct","HOD review","Review"],["Transport fuel claim","Sana Khan","Rs. 26,000","14 Oct","GM approval","Review"],["Stationery restock","Farhan Ahmed","Rs. 86,500","14 Oct","HOD review","Review"],["Printer servicing","Amina Malik","Rs. 53,500","13 Oct","GM approval","Review"]]},
  reports:{title:"Reports & insights",eyebrow:"SCHOOL PERFORMANCE",subtitle:"A consolidated view of collections, expenses and operational exceptions.",table:"Report catalogue",tableSub:"Use these report types as a prototype for the final reporting module.",primary:"＋ Build report",metrics:[["Fee collection","Rs. 8.42M","October to date"],["Operating spend","Rs. 1.86M","October to date"],["Unresolved exceptions","9","Across 3 workflows"]],headers:["REPORT","PERIOD","OWNER","LAST GENERATED","FORMAT","ACTION"],rows:[
    ["Monthly fee collection","October 2026","Finance","15 Oct 2026","CSV","Export"],["Vendor balances","October 2026","Accounts","14 Oct 2026","CSV","Export"],["Inventory reorder list","Current","Store","15 Oct 2026","CSV","Export"],["Expense approval summary","October 2026","Management","15 Oct 2026","CSV","Export"]]},
  settings:{title:"Workspace settings",eyebrow:"CONFIGURATION",subtitle:"Review demo preferences and role access boundaries.",table:"Role permissions overview",tableSub:"Real access control must be enforced on a backend.",primary:"＋ Add team member",metrics:[["Active demo roles","3","Accountant, HOD, GM"],["Approval stages","2","Verification then final decision"],["Audit events","Enabled","Prototype activity only"]],headers:["CAPABILITY","ACCOUNTANT","HOD","GENERAL MANAGER","NOTES"],rows:[
    ["Record fee payments","Allowed","View","View","Demo permission map"],["Verify invoices","Submit","Allowed","View","HOD checks supporting documents"],["Final expense approval","No","Recommend","Allowed","Final decision owner"],["Manage user access","No","No","Allowed","Backend required for enforcement"]]}
};

function money(value){return "Rs. "+Number(value).toLocaleString("en-PK");}
function toast(message){const el=document.createElement("div");el.className="toast";el.innerHTML='<i>✓</i><span></span>';el.querySelector("span").textContent=message;$("#toastRegion").appendChild(el);setTimeout(()=>el.remove(),3200);}
function escapeHTML(value){return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
function statusClass(status){const s=status.toLowerCase();if(s.includes("paid")||s.includes("recorded")||s.includes("completed")||s==="active")return "paid";if(s.includes("overdue"))return "overdue";if(s.includes("low"))return "low";if(s.includes("review")||s.includes("part"))return "review";return "pending";}
function setPage(page){
  currentPage=page;
  $$(".nav-link[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  $$(".view").forEach(v=>v.classList.remove("active"));
  const view=page==="overview"?$("#overviewView"):page==="vendors"?$("#vendorsView"):$("#genericView");
  view.classList.add("active");
  const titles={overview:"Overview",vendors:"Vendors",...Object.fromEntries(Object.entries(pageConfig).map(([k,v])=>[k,v.title]))};
  $("#crumb").textContent=titles[page]||"Overview";
  $("#sidebar").classList.remove("open");
  if(page==="vendors")renderVendors();
  if(pageConfig[page])renderGeneric(page);
  window.scrollTo({top:0,behavior:"smooth"});
}
function renderActivity(query=""){
  const rows=activity.filter(a=>(a.title+" "+a.detail+" "+a.ref+" "+a.owner).toLowerCase().includes(query.toLowerCase()));
  const body=$("#activityRows");body.innerHTML="";
  rows.forEach(a=>{
    const iconClass={fee:"fee-row",vendor:"vendor-row",expense:"expense-row",stock:"stock-row"}[a.type]||"fee-row";
    const icon={fee:"↙",vendor:"▧",expense:"↗",stock:"▦"}[a.type]||"•";
    const tr=document.createElement("tr");
    tr.innerHTML=`<td><span class="row-icon ${iconClass}">${icon}</span><span class="primary-cell">${escapeHTML(a.title)}</span><small class="cell-sub">${escapeHTML(a.detail)}</small></td><td class="mono">${escapeHTML(a.ref)}</td><td><span class="owner"><span class="owner-avatar">${escapeHTML(a.initials)}</span>${escapeHTML(a.owner)}</span></td><td>${escapeHTML(a.date)}</td><td><span class="status ${statusClass(a.status)}">${escapeHTML(a.status)}</span></td><td><button class="row-more" aria-label="Activity details">···</button></td>`;
    tr.querySelector(".row-more").addEventListener("click",()=>toast(`${a.ref}: ${a.title} · ${a.status}`));body.appendChild(tr);
  });
  $("#activityCount").textContent=`Showing ${rows.length} of ${activity.length} recent activities`;
  if(!rows.length)body.innerHTML='<tr><td colspan="6"><div class="empty-state">No activity matches that search.</div></td></tr>';
}
function renderVendors(){
  const q=($("#vendorSearch")?.value||"").toLowerCase();const f=$("#vendorFilter")?.value||"all";
  const filtered=vendors.filter(v=>(v.name+" "+v.category+" "+v.contact+" "+v.id).toLowerCase().includes(q)&&(f==="all"||v.status===f));
  const body=$("#vendorRows");body.innerHTML="";
  filtered.forEach(v=>{
    const tr=document.createElement("tr");
    const initials=v.name.split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase();
    tr.innerHTML=`<td><div class="vendor-name"><span class="vendor-monogram">${escapeHTML(initials)}</span><span><b>${escapeHTML(v.name)}</b><small>${escapeHTML(v.id)}</small></span></div></td><td>${escapeHTML(v.category)}</td><td>${escapeHTML(v.contact||"Not provided")}</td><td>${escapeHTML(v.date||"—")}</td><td class="amount">${money(v.balance)}</td><td><span class="status ${v.status==="Active"?"active":"review"}">${v.status==="Active"?"Active":"Needs review"}</span></td><td><button class="table-action" data-vendor="${escapeHTML(v.id)}">Details ↗</button></td>`;
    tr.querySelector(".table-action").addEventListener("click",()=>showVendorDetails(v));body.appendChild(tr);
  });
  $("#vendorCount").textContent=`Showing ${filtered.length} of ${vendors.length} vendors`;
  $("#vendorTotal").textContent=vendors.length;
  if(!filtered.length)body.innerHTML='<tr><td colspan="7"><div class="empty-state">No vendors match these filters. Try another search.</div></td></tr>';
}
function showVendorDetails(v){
  const message=`${v.name}\n${v.id} · ${v.category}\nContact: ${v.contact||"Not provided"}\nPhone: ${v.phone||"Not provided"}\nEmail: ${v.email||"Not provided"}\nAddress: ${v.address||"Not provided"}\nOutstanding balance: ${money(v.balance)}\nStatus: ${v.status}\n\nDemo detail view. Invoice and payment history can be connected to the backend later.`;
  alert(message);
}
function renderGeneric(page,query=""){
  const c=pageConfig[page];if(!c)return;
  $("#genericEyebrow").textContent=c.eyebrow;$("#genericTitle").textContent=c.title;$("#genericSubtitle").textContent=c.subtitle;$("#genericTableTitle").textContent=c.table;$("#genericTableSub").textContent=c.tableSub;$("#genericAdd").textContent=c.primary;
  $("#genericMetrics").innerHTML=c.metrics.map(m=>`<article class="generic-stat"><span>${escapeHTML(m[0])}</span><b>${escapeHTML(m[1])}</b><small>${escapeHTML(m[2])}</small></article>`).join("");
  $("#genericHead").innerHTML="<tr>"+c.headers.map(h=>`<th>${escapeHTML(h.toUpperCase())}</th>`).join("")+"</tr>";
  const rows=c.rows.filter(r=>r.join(" ").toLowerCase().includes(query.toLowerCase()));
  $("#genericRows").innerHTML=rows.map(r=>"<tr>"+r.map((cell,i)=>{
    if(i===r.length-1 && ["paid","pending","overdue","low","review"].includes(String(cell).toLowerCase()))return `<td><span class="status ${statusClass(cell)}">${escapeHTML(cell==="paid"?"Paid":cell==="low"?"Low stock":cell==="overdue"?"Overdue":cell==="pending"?"Pending":cell==="review"?"Needs review":cell)}</span></td>`;
    if(page==="approvals"&&cell==="Review")return `<td><button class="table-action review-request">Review ↗</button></td>`;
    if(page==="reports"&&cell==="Export")return `<td><button class="table-action export-report">Export ↓</button></td>`;
    return `<td>${escapeHTML(cell)}</td>`;
  }).join("")+"</tr>").join("");
  $("#genericCount").textContent=`Showing ${rows.length} of ${c.rows.length} demo records`;
  $("#genericNote").textContent=page==="approvals"?"Prototype only: decisions below are simulated in the browser and are not a secure approval system.":"This is a frontend prototype with fictional sample records. Connect and secure a backend before using real school data.";
  if(!rows.length)$("#genericRows").innerHTML='<tr><td colspan="8"><div class="empty-state">No records match your search.</div></td></tr>';
  $$(".review-request",$("#genericRows")).forEach((b,i)=>b.addEventListener("click",()=>reviewRequest(c.rows[i])));
  $$(".export-report",$("#genericRows")).forEach((b,i)=>b.addEventListener("click",()=>downloadCSV([c.headers,c.rows[i]],`${page}-report.csv`)));
}
function reviewRequest(row){
  const choice=prompt(`Demo review: ${row[0]}\nAmount: ${row[2]}\nType A to approve, R to return for correction, or leave blank to cancel.`);
  if(!choice)return;
  if(!["a","r"].includes(choice.toLowerCase())){toast("No change made. Enter A or R to choose an action.");return;}
  toast(choice.toLowerCase()==="a"?"Demo action recorded: approved for the next stage.":"Demo action recorded: returned for correction.");
}
function downloadCSV(rows,filename){
  const csv=rows.map(row=>row.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);toast("CSV export prepared.");
}
function showModal(){ $("#modalBackdrop").hidden=false;document.body.style.overflow="hidden";setTimeout(()=>$('#vendorForm [name="name"]').focus(),30);}
function hideModal(){ $("#modalBackdrop").hidden=true;document.body.style.overflow="";$("#vendorForm").reset();}
let selectedLoginRole = null;
function chooseLoginRole(role){
  if(!roles[role]) return;
  selectedLoginRole=role;
  $$("[data-enter-role]").forEach(btn=>btn.setAttribute("aria-pressed",String(btn.dataset.enterRole===role)));
  $("#loginTitle").textContent=`${roles[role].label} login`;
  $("#loginRoleEyebrow").textContent=`${roles[role].label.toUpperCase()} · SECURE SIGN IN`;
  $("#loginError").hidden=true;$("#loginError").textContent="";
  $("#loginForm").hidden=false;$("#gateHint").textContent="Sign in to continue";
  $("#loginUsername").value="";$("#loginPassword").value="";
  $("#loginUsername").focus();
}
function showRolePicker(){selectedLoginRole=null;$("#loginForm").hidden=true;$("#gateHint").innerHTML='Choose your role to continue <b>→</b>';$$("[data-enter-role]").forEach(btn=>btn.setAttribute("aria-pressed","false"));}
function enterRole(role,user){
  if(!roles[role]) return;
  currentRole=role;$("#roleSelect").value=role;$("#roleGate").hidden=true;$("#appLayout").hidden=false;
  updateRole();
  if(user && user.displayName){$("#profileName").textContent=user.displayName;}
  $("#profileRole").textContent=roles[role].label+" · Signed in";
  setPage("overview");
}
async function checkExistingSession(){
  try{const response=await fetch('/api/session',{credentials:'same-origin'});if(!response.ok)return;const data=await response.json();if(data.authenticated)enterRole(data.user.role,data.user);}
  catch(_){/* The page is served by the local Node server; API errors are shown on sign-in. */}
}
function updateRole(){
  currentRole=$("#roleSelect").value;const r=roles[currentRole];
  $("#appLayout").dataset.role=currentRole;
  $("#profileName").textContent=r.label;$("#profileRole").textContent="Demo workspace";$("#avatar").textContent=r.initials;$("#greeting").innerHTML=`${r.greeting} <span class="spark">✳</span>`;$("#greetingSub").textContent=r.subtitle;
  const allowed={
    accountant:["overview","students","fees","inventory","vendors","expenses","approvals","reports"],
    hod:["overview","students","fees","expenses","approvals","reports"],
    gm:["overview","students","fees","inventory","vendors","expenses","approvals","reports","settings"]
  }[currentRole];
  $$(".sidebar .nav-link[data-page]").forEach(link=>{link.hidden=!allowed.includes(link.dataset.page);});
  if(currentRole==="hod"){$("#pendingMetric").innerHTML='4 <small>reviews</small>';$("#newRequest").textContent="Review requests";$("#newRequest").onclick=()=>setPage("approvals");}
  else if(currentRole==="gm"){$("#pendingMetric").innerHTML='2 <small>decisions</small>';$("#newRequest").textContent="Final decisions";$("#newRequest").onclick=()=>setPage("approvals");}
  else{$("#pendingMetric").innerHTML='12 <small>requests</small>';$("#newRequest").textContent="＋ New request";$("#newRequest").onclick=()=>{setPage("approvals");toast("Open Approval Center to inspect the sample request workflow.");};}
}
function addDemoRecord(){
  const c=pageConfig[currentPage];
  if(currentPage==="approvals"){openVendorModal("New request","This prototype uses the vendor form as a sample data-entry interaction.");return;}
  if(currentPage==="students"){toast("Student form is a planned next module. No record was created.");return;}
  if(currentPage==="fees"){toast("Payment entry is a planned next module. No payment was recorded.");return;}
  if(currentPage==="inventory"){toast("Stock-entry form is a planned next module. No stock was changed.");return;}
  if(currentPage==="expenses"){toast("Expense form is a planned next module. No expense was created.");return;}
  if(currentPage==="reports"){toast("Report builder is a planned next module.");return;}
  if(currentPage==="settings"){toast("Team management needs a secure backend.");return;}
  toast(`${c?.title||"Record"} action is a frontend prototype.`);
}
function openVendorModal(title="Add vendor",subtitle="Create a supplier record for this demo."){$("#modalTitle").textContent=title;$("#modalSubtitle").textContent=subtitle;showModal();}

$$("[data-page]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();setPage(el.dataset.page);}));
$("#mobileMenu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$$("[data-enter-role]").forEach(button=>button.addEventListener("click",()=>chooseLoginRole(button.dataset.enterRole)));
$("#backToRoles").addEventListener("click",showRolePicker);
$("#togglePassword").addEventListener("click",()=>{const input=$("#loginPassword");const show=input.type==="password";input.type=show?"text":"password";$("#togglePassword").textContent=show?"Hide":"Show";$("#togglePassword").setAttribute("aria-label",show?"Hide password":"Show password");});
$("#loginForm").addEventListener("submit",async e=>{
  e.preventDefault();if(!selectedLoginRole)return;
  const submit=$("#loginSubmit"),error=$("#loginError");error.hidden=true;submit.disabled=true;submit.innerHTML='Verifying… <span>⌛</span>';
  try{
    const response=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({role:selectedLoginRole,username:$("#loginUsername").value.trim(),password:$("#loginPassword").value})});
    const data=await response.json().catch(()=>({message:'Unexpected server response.'}));
    if(!response.ok)throw new Error(data.message||'Sign-in failed. Check your credentials.');
    enterRole(data.user.role,data.user);
  }catch(err){error.textContent=err.message||'Could not connect to the authentication server. Make sure you started the project with npm start.';error.hidden=false;}
  finally{submit.disabled=false;submit.innerHTML='Sign in securely <span>→</span>';}
});
async function returnToRolePicker(message){
  try{
    const response=await fetch('/api/logout',{method:'POST',credentials:'same-origin'});
    if(!response.ok) throw new Error('Server could not end the current session.');
  }catch(err){
    // Still show the picker, but warn if the server did not confirm logout.
    console.error('Logout request failed:',err);
  }
  $("#appLayout").hidden=true;
  $("#roleGate").hidden=false;
  showRolePicker();
  if(message) toast(message);
}
$("#switchRoleButton").addEventListener("click",()=>returnToRolePicker('Choose another role and sign in with that account.'));
$("#logoutButton").addEventListener("click",()=>returnToRolePicker('You have been logged out.'));
$("#activitySearch").addEventListener("input",e=>renderActivity(e.target.value));
$("#vendorSearch").addEventListener("input",renderVendors);$("#vendorFilter").addEventListener("change",renderVendors);
$("#addVendor").addEventListener("click",()=>openVendorModal());
$("#modalClose").addEventListener("click",hideModal);$("#cancelModal").addEventListener("click",hideModal);
$("#modalBackdrop").addEventListener("click",e=>{if(e.target===$("#modalBackdrop"))hideModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#modalBackdrop").hidden)hideModal();});
$("#vendorForm").addEventListener("submit",e=>{
  e.preventDefault();const fd=new FormData(e.currentTarget);const name=String(fd.get("name")).trim();const category=String(fd.get("category")).trim();
  if(!name||!category){toast("Please complete the required fields.");return;}
  const vendor={id:`VEN-${String(vendors.length+1).padStart(3,"0")}`,name,category,contact:String(fd.get("contact")).trim(),phone:String(fd.get("phone")).trim(),email:String(fd.get("email")).trim(),address:String(fd.get("address")).trim(),date:"15 Oct 2026",balance:0,status:"Active"};
  vendors.unshift(vendor);activity.unshift({title:"Vendor record created",detail:`${category} · ${name}`,ref:`ACT-${Date.now().toString().slice(-6)}`,owner:roles[currentRole].name,initials:roles[currentRole].initials,date:"Just now",status:"Recorded",type:"vendor"});
  renderVendors();renderActivity($("#activitySearch").value);hideModal();setPage("vendors");toast(`${name} added to this demo session.`);
});
$("#exportSummary").addEventListener("click",()=>downloadCSV([["Metric","October 2026"],["Fees collected","8420000"],["Outstanding fees","1260000"],["Pending approvals","12"],["Inventory health","92.8%"]],"northstar-summary.csv"));
$("#vendorExport").addEventListener("click",()=>downloadCSV([["Vendor ID","Vendor","Category","Contact","Phone","Email","Last invoice","Outstanding PKR","Status"],...vendors.map(v=>[v.id,v.name,v.category,v.contact,v.phone,v.email,v.date,v.balance,v.status])],"northstar-vendors.csv"));
$("#genericExport").addEventListener("click",()=>{const c=pageConfig[currentPage];if(c)downloadCSV([c.headers,...c.rows],`${currentPage}-demo-records.csv`);});
$("#genericAdd").addEventListener("click",addDemoRecord);
$("#genericSearch").addEventListener("input",e=>renderGeneric(currentPage,e.target.value));
$("#newRequest").addEventListener("click",()=>{setPage("approvals");toast("Open Approval Center to inspect the sample request workflow.");});
$("#notificationButton").addEventListener("click",()=>toast("You have 4 items flagged for follow-up in this demo."));
$("#helpButton").addEventListener("click",()=>alert("Quick guide\n\n1. Use the left navigation to open each module.\n2. Switch Accountant, HOD and General Manager from the top-right role selector.\n3. Add a fictional vendor in Vendor directory.\n4. Search activity and export CSV summaries.\n\nThis is a frontend prototype, not a live school system."));
$("#closeNotice").addEventListener("click",()=>$("#monthNotice").remove());
$("#chartRange").addEventListener("change",e=>{$$(".month",$("#chartBody")).forEach((m,i)=>m.style.display=e.target.value==="3"&&i<3?"none":"flex");toast(`Chart updated to the last ${e.target.value} months.`);});
renderActivity();renderVendors();checkExistingSession();
