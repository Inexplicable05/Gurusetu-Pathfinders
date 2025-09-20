// opportunities.js - jobs, internships, freelance, and workshops hub

// Utility: minimal input styling
const style = document.createElement('style');
style.textContent = `
.input-minimal { padding: 0.5rem 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; background: #fff; outline: none; }
.input-minimal:focus { border-color: rgb(59 130 246); box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
.badge { display:inline-flex; align-items:center; gap:6px; padding:2px 8px; border-radius:9999px; font-size:12px; font-weight:600; }
.badge-job { background:#e0f2fe; color:#0369a1; }
.badge-internship { background:#e0f7f1; color:#0f766e; }
.badge-freelance { background:#fef3c7; color:#b45309; }
.badge-workshop { background:#ede9fe; color:#6d28d9; }
.card { background:#fff; border:1px solid #e5e7eb; border-radius:0.75rem; padding:1rem; }
.card:hover { border-color:#c7d2fe; box-shadow:0 4px 14px rgba(99,102,241,0.12) }
.btn { padding:0.5rem 0.75rem; border-radius:0.5rem; border:1px solid #e5e7eb; background:#fff; }
.btn-primary { background: linear-gradient(90deg,#2563eb,#7c3aed); color:#fff; border:none; }
.btn-ghost { background:transparent; color:#374151; }
`;
document.head.appendChild(style);

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

const session = JSON.parse(localStorage.getItem('gs_session') || 'null');

const seedOpps = [
  { id: 'o1', title: 'Frontend Engineer', company: 'Zyra Labs', logo: '🧩', type: 'job', location: 'Bengaluru', mode: 'Hybrid', level: '2-4 yrs', salary: '₹10-16 LPA', postedAt: Date.now()-1000*60*60*6, tags: ['React','Tailwind','TypeScript'], alumni: true, by: 'Ankit Sharma (2016, CSE)' },
  { id: 'o2', title: 'Data Science Intern', company: 'Sutra AI', logo: '🧠', type: 'internship', location: 'Hyderabad', mode: 'Onsite', level: 'Intern', stipend: '₹25k/mo', postedAt: Date.now()-1000*60*60*24*1.5, tags: ['Python','Pandas','ML'], alumni: false },
  { id: 'o3', title: 'Fullstack Developer', company: 'NammaKart', logo: '🛒', type: 'freelance', location: 'Remote', mode: 'Remote', level: 'Contract', pay: '₹1.2L - ₹1.8L', postedAt: Date.now()-1000*60*60*48, tags: ['Node.js','Next.js','MongoDB'], alumni: true, by: 'Priya Verma (2014, IT)' },
  { id: 'o4', title: 'Kubernetes Workshop', company: 'CloudGyan', logo: '☁️', type: 'workshop', location: 'Mumbai', mode: 'Onsite', level: 'Beginner', fee: '₹999', date: '12 Oct', postedAt: Date.now()-1000*60*60*3, tags: ['DevOps','K8s'], alumni: true, by: 'Arjun Rao (2012, ECE)' },
  { id: 'o5', title: 'Android Engineer', company: 'TiffinBox', logo: '📦', type: 'job', location: 'Remote', mode: 'Remote', level: '3+ yrs', salary: '₹14-20 LPA', postedAt: Date.now()-1000*60*60*30, tags: ['Kotlin','Compose'], alumni: false },
];

let opps = [...seedOpps];
let saved = JSON.parse(localStorage.getItem('gs_saved_opps')||'[]');

function timeAgo(ts){
  const d = Math.round((Date.now()-ts)/1000);
  if(d<60) return `${d}s ago`;
  if(d<3600) return `${Math.floor(d/60)}m ago`;
  if(d<86400) return `${Math.floor(d/3600)}h ago`;
  return `${Math.floor(d/86400)}d ago`;
}

function badge(type){
  return `<span class="badge badge-${type}">${type[0].toUpperCase()+type.slice(1)}</span>`;
}

function oppCard(o){
  const isSaved = saved.includes(o.id);
  const right = o.salary || o.stipend || o.pay || o.fee || '';
  const sub = o.level ? `${o.level} · ${o.mode}` : o.mode;
  const alumni = o.alumni ? `<span class="text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-xs font-semibold">Alumni Referral</span>` : '';
  const by = o.by ? `<div class="text-xs text-gray-600">Posted by ${o.by}</div>` : '';
  return `
    <div class="card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div class="flex items-start gap-4">
        <div class="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl">${o.logo||'🏢'}</div>
        <div>
          <div class="flex items-center gap-2 flex-wrap"> <h4 class="text-lg font-semibold text-gray-900">${o.title}</h4> ${badge(o.type)} ${alumni}</div>
          <div class="text-gray-700">${o.company} • ${o.location} • ${sub}</div>
          <div class="flex items-center gap-2 mt-1 flex-wrap">${o.tags.map(t=>`<span class="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs">${t}</span>`).join('')}</div>
          <div class="text-xs text-gray-500 mt-1">${timeAgo(o.postedAt)} ${by}</div>
        </div>
      </div>
      <div class="flex items-center gap-2 self-start md:self-auto">
        ${right?`<div class="text-sm font-medium text-gray-900 mr-2">${right}</div>`:''}
        <button class="btn btn-primary" data-apply="${o.id}"><i class="fas fa-paper-plane mr-2"></i>Apply</button>
        <button class="btn ${isSaved?'bg-yellow-100 border-yellow-300':'btn-ghost'}" data-save="${o.id}">${isSaved?'<i class="fas fa-bookmark text-yellow-600"></i>':'<i class="far fa-bookmark"></i>'}</button>
        <button class="btn btn-ghost" data-details="${o.id}"><i class="fas fa-info-circle"></i></button>
      </div>
    </div>
  `;
}

function render(){
  const list = $('#oppList');
  list.innerHTML = opps.map(oppCard).join('');

  const savedList = $('#savedList');
  const savedOpps = opps.filter(o=>saved.includes(o.id));
  savedList.innerHTML = savedOpps.length? savedOpps.map(oppCard).join('') : '<div class="text-gray-500">No saved items yet.</div>';

  // Bind buttons
  $$('#oppList [data-save], #savedList [data-save]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id = btn.getAttribute('data-save');
      if(saved.includes(id)) saved = saved.filter(s=>s!==id); else saved.push(id);
      localStorage.setItem('gs_saved_opps', JSON.stringify(saved));
      render();
    });
  });
  $$('#oppList [data-apply], #savedList [data-apply]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id = btn.getAttribute('data-apply');
      const o = opps.find(x=>x.id===id);
      alert(`Applied to ${o.title} at ${o.company}! (demo)`);
    });
  });
  $$('#oppList [data-details], #savedList [data-details]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id = btn.getAttribute('data-details');
      openDetails(id);
    });
  });
}

function applyFilters(){
  const q = ($('#oppSearch')?.value||'').toLowerCase();
  const type = $('#oppType')?.value||'all';
  const loc = $('#oppLoc')?.value||'all';
  const savedOnly = $('#savedFilter')?.classList.contains('bg-blue-50');
  const alumniOnly = $('#alumniOnly')?.classList.contains('bg-blue-50');

  let res = [...seedOpps];
  if(q) res = res.filter(o => `${o.title} ${o.company}`.toLowerCase().includes(q));
  if(type!=='all') res = res.filter(o => o.type===type);
  if(loc!=='all') res = res.filter(o => o.location===loc);
  if(savedOnly) res = res.filter(o => saved.includes(o.id));
  if(alumniOnly) res = res.filter(o => o.alumni);
  opps = res;
  render();
}

function wireFilters(){
  ['oppSearch','oppType','oppLoc'].forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener(id==='oppSearch'?'input':'change', applyFilters);
  });
  [['savedFilter','Saved'],['alumniOnly','Referrals by Alumni']].forEach(([id,_])=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('click',()=>{
      el.classList.toggle('bg-blue-50');
      el.classList.toggle('border-blue-300');
      applyFilters();
    });
  });
  const sortLatest = document.getElementById('sortLatest');
  const sortTop = document.getElementById('sortTop');
  sortLatest?.addEventListener('click',()=>{ opps.sort((a,b)=>b.postedAt-a.postedAt); render(); });
  sortTop?.addEventListener('click',()=>{ opps.sort((a,b)=> (b.alumni?1:0)-(a.alumni?1:0)); render(); });
}

function openDetails(id){
  const o = seedOpps.find(x=>x.id===id);
  if(!o) return;
  const details = `\n${o.title} @ ${o.company}\nLocation: ${o.location} (${o.mode})\nLevel: ${o.level||o.type}\nCompensation: ${o.salary||o.stipend||o.pay||o.fee||'—'}\nTags: ${o.tags.join(', ')}\n${o.by?`Referred by: ${o.by}`:''}\n\nThis is a demo details modal. In production, navigate to a dedicated details page with deep-linking.`;
  alert(details);
}

function setupUserMenu(){
  const user = session?.user;
  if(!user){
    window.location.href = 'index.html';
    return;
  }
  $('#userDisplayName').textContent = user.name;
  $('#dropdownUserName').textContent = user.name;
  $('#dropdownUserType').textContent = user.type === 'alumni' ? 'Alumni' : 'Student';
  $('#userProfileImage').src = user.avatar || 'https://i.pravatar.cc/100?img=13';

  const btn = $('#userMenuButton');
  const dd = $('#userDropdown');
  btn.addEventListener('click', () => dd.classList.toggle('hidden'));
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !dd.contains(e.target)) dd.classList.add('hidden');
  });

  $('#logoutButton').addEventListener('click', () => {
    localStorage.removeItem('gs_session');
    window.location.href = 'index.html';
  });
}

function setupDonation(){
  const user = session?.user;
  if(user?.type === 'alumni'){
    document.getElementById('donationSection')?.classList.remove('hidden');
    $$('.donation-btn').forEach(b=>b.addEventListener('click',()=> alert('Donation flow (demo)')));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // auth gate
  if(!session){ window.location.href = 'index.html'; return; }

  setupUserMenu();
  setupDonation();
  wireFilters();
  applyFilters();

  // global search in navbar
  const g = document.getElementById('globalSearch');
  g?.addEventListener('input', ()=>{ document.getElementById('oppSearch').value = g.value; applyFilters(); });

  // show app
  document.getElementById('authLoader').style.display = 'none';
  document.getElementById('mainApp').style.display = 'block';
});
