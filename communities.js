class CommunitiesPage {
  constructor() {
    this.checkAuth();
    this.init();
  }
  init() {
    this.setupUserMenu();
    this.seed();
    this.renderFilters();
    this.renderFeatured();
    this.renderMine();
    this.renderDiscover();
    this.setupSearch();
  }

  checkAuth() {
    if (!window.authSystem || !authSystem.isLoggedIn()) {
      window.location.href = 'login.html';
      return;
    }
    document.getElementById('authLoader').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
  }
  setupUserMenu(){
    const u = authSystem.getCurrentUser();
    const img = document.getElementById('userProfileImage');
    const name = document.getElementById('userDisplayName');
    const dn = document.getElementById('dropdownUserName');
    const dt = document.getElementById('dropdownUserType');
    if (img) img.src = u.profileImage;
    if (name) name.textContent = u.fullName.split(' ')[0];
    if (dn) dn.textContent = u.fullName;
    if (dt) dt.textContent = u.accountType.charAt(0).toUpperCase()+u.accountType.slice(1);
    const btn = document.getElementById('userMenuButton');
    const dd = document.getElementById('userDropdown');
    const lo = document.getElementById('logoutButton');
    if (btn && dd){
      btn.addEventListener('click', (e)=>{ e.stopPropagation(); dd.classList.toggle('hidden'); });
      document.addEventListener('click', ()=> dd.classList.add('hidden'));
      dd.addEventListener('click', (e)=> e.stopPropagation());
    }
    if (lo) lo.addEventListener('click', ()=> authSystem.logout());
    const donation = document.getElementById('donationSection');
    const mobileDonationSection = document.getElementById('mobileDonationSection');
    if (authSystem.isStudent()){
      if (donation) donation.style.display='none';
      if (mobileDonationSection) mobileDonationSection.style.display='none';
    } else {
      if (donation) donation.style.display='flex';
      if (mobileDonationSection) mobileDonationSection.style.display='block';
    }
  }
  seed(){
    this.filters = ['Tech','MBA','Design','Research','Startups','Data Science','Alumni 2016','Alumni 2018','Chennai','Bengaluru'];
    this.featured = [
      { name:'MBA Leaders Network', members: '1.4k', desc:'Business, strategy, and leadership.', cover:'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800&h=400&fit=crop' },
      { name:'Startup Founders', members: '900', desc:'Founders, operators, and builders.', cover:'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop' }
    ];
    this.mine = [
      { name:'Data Science Network', members: '1.5k', desc:'ML/AI discussions and meetups.', cover:'https://images.unsplash.com/photo-1534759846116-5790a4bd345d?w=800&h=400&fit=crop' },
      { name:'Design & Creative Arts', members:'967', desc:'Product design and creativity.', cover:'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800&h=400&fit=crop' }
    ];
    this.discover = [
      { name:'Cloud & DevOps', members:'1.8k', desc:'AWS, Azure, GCP and infra.', cover:'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&h=400&q=60' },
      { name:'Product Managers', members:'2.2k', desc:'Roadmaps, metrics, UX.', cover:'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&h=400&q=60' },
      { name: 'GDG (Google dev club)', members: '1.2k', desc: 'Google Developer Group for students.', cover: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&h=400&q=60' },
      { name: 'IEEE CIS', members: '800', desc: 'IEEE Computational Intelligence Society.', cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&h=400&q=60' },
  { name: 'ACM (Association for Computing Machinery)', members: '1.5k', desc: 'Advancing computing as a science and profession.', cover: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=800&h=400&q=60' },
      { name: 'Toastmasters', members: '500', desc: 'Public speaking and leadership skills.', cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&h=400&q=60' },
  { name: 'CSE Cyber security', members: '700', desc: 'Cyber security enthusiasts and professionals.', cover: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800&h=400&q=60' },
      { name: 'Entrepreneurship cell', members: '900', desc: 'Fostering the spirit of entrepreneurship.', cover: 'https://images.unsplash.com/photo-1529336953121-adb2a8f3d6ec?auto=format&fit=crop&w=800&h=400&q=60' },
  { name: 'National Service Scheme', members: '2k', desc: 'Community service and social welfare.', cover: 'https://images.unsplash.com/photo-1523875194681-bedd468c58bf?auto=format&fit=crop&w=800&h=400&q=60' },
      { name: 'Chess Club', members: '300', desc: 'For all the chess lovers.', cover: 'https://images.unsplash.com/photo-1529692236671-f1dc34149811?auto=format&fit=crop&w=800&h=400&q=60' }
    ];
  }
  card(c){
    const communityUrl = `pages/communities/${c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-community.html`;
    return `
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
        <img src="${c.cover}" alt="${c.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&h=400&q=60';" class="w-full h-32 object-cover"/>
        <div class="p-4">
          <div class="flex items-start justify-between">
            <div>
              <h4 class="font-semibold text-gray-900">${c.name}</h4>
              <p class="text-sm text-gray-600">${c.desc}</p>
            </div>
            <span class="text-xs text-gray-600">${c.members} members</span>
          </div>
          <div class="mt-3 flex items-center justify-end gap-2">
            <button class="px-3 py-1 text-sm bg-blue-600 text-white rounded">Join</button>
            <a href="${communityUrl}" class="px-3 py-1 text-sm border rounded">View</a>
          </div>
        </div>
      </div>`;
  }
  renderFilters(){
    const wrap = document.getElementById('communitiesFilters');
    wrap.innerHTML = this.filters.map(f => `<button class="px-3 py-1 text-sm rounded-full border hover:bg-blue-50">${f}</button>`).join('');
  }
  renderFeatured(){
    document.getElementById('featuredCommunities').innerHTML = this.featured.map(c => this.card(c)).join('');
  }
  renderMine(){
    document.getElementById('myCommunities').innerHTML = this.mine.map(c => this.card(c)).join('');
  }
  renderDiscover(){
    document.getElementById('discoverCommunities').innerHTML = this.discover.map(c => this.card(c)).join('');
  }
  setupSearch(){
    const input = document.getElementById('communitiesSearch');
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase();
      const match = (c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
      document.getElementById('featuredCommunities').innerHTML = this.featured.filter(match).map(c => this.card(c)).join('');
      document.getElementById('myCommunities').innerHTML = this.mine.filter(match).map(c => this.card(c)).join('');
      document.getElementById('discoverCommunities').innerHTML = this.discover.filter(match).map(c => this.card(c)).join('');
    });
  }
}

new CommunitiesPage();
