// Profile Page Logic
class ProfilePage {
  constructor() {
    // Global avatar fallbacks and simple gender guesser
    this.fallbacks = {
      male: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop',
      female: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop',
      neutral: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&h=256&fit=crop'
    };
    this.guessGender = (name = '') => {
      const femaleNames = ['Ananya', 'Neha', 'Priya', 'Lakshmi'];
      const maleNames = ['Aarav', 'Rohit', 'Rohit Mehta'];
      if (femaleNames.some(n => name.toLowerCase().includes(n.toLowerCase()))) return 'female';
      if (maleNames.some(n => name.toLowerCase().includes(n.toLowerCase()))) return 'male';
      return 'neutral';
    };
    document.addEventListener('DOMContentLoaded', () => this.init());
  }

  init() {
    if (!window.authSystem || !authSystem.isLoggedIn()) {
      window.location.href = 'login.html';
      return;
    }

    document.getElementById('authLoader').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';

    this.loadProfileData();
    this.setupTabs();
  }


  loadProfileData() {
    const url = new URL(window.location.href);
    const nameParam = url.searchParams.get('name');

    // Rich, realistic alumni datasets keyed by exact names used across the app

  this.richProfiles = {
      'Aarav Sharma': {
        posts: Array.from({length: 12}).map((_,i)=>({
          author:'Aarav Sharma',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2c?w=256&h=256&fit=crop',
          type:'alumni',
          time: i===0?'1h ago': i===1?'Yesterday': `${i+1}d ago`,
          content: [
            'Mentoring 5 final-year students this term. Drop your questions below!',
            'Shipped a major React performance overhaul at Google India – cut TTI by 38%.',
            'Hosting an AMA on FAANG hiring in India this Friday. Join in!',
            'Built a side-project to visualize interview prep progress. Open-sourcing soon.',
            'Conducted a mock interview marathon with 30+ students – amazing energy!',
          ][i%5],
          image: i%3===0? 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1000&h=500&fit=crop': undefined,
          imageCaption: i%3===0? 'Snippets from our internal dashboard revamp': undefined,
          tags: ['mentorship','react','careers','india'].slice(0, (i%4)+1)
        })),
        portfolio: {
          summary: [
            { icon:'fa-briefcase', title:'Google India', desc:'Senior SWE • Web Performance' },
            { icon:'fa-map-marker-alt', title:'Bengaluru, India', desc:'Open for guest lectures' },
            { icon:'fa-graduation-cap', title:'Batch 2014–2018', desc:'Computer Science' },
          ],
          projects: [
            { title:'Realtime Chat Platform', desc:'WebSockets, Redis, Kubernetes' },
            { title:'Interview Prep Visualizer', desc:'Next.js, D3, Tailwind' },
            { title:'Design System for Dashboards', desc:'Figma, React, Storybook' },
            { title:'Performance Toolkit', desc:'Lighthouse CI, Web Vitals' },
          ],
          certs:['AWS SAA','GCP ACE','CKA','Scrum PSM I']
        },
        opps: [
          { title:'Frontend Engineer', company:'Google India', type:'Full-time', location:'Bengaluru', details:'React, TS. 4+ yrs exp.' },
          { title:'Mentor - System Design', company:'GuruSetu', type:'Volunteer', location:'Remote', details:'Weekly 2 hrs' },
          { title:'Guest Lecture: Web Perf', company:'GuruSetu', type:'Workshop', location:'Hybrid', details:'Hands-on session' },
        ]
      },
      'Dr. Neha Iyer': {
        posts: Array.from({length: 10}).map((_,i)=>({
          author:'Dr. Neha Iyer',
          avatar: 'https://images.unsplash.com/photo-1544005313-3b3c8f3a5f50?w=256&h=256&fit=crop',
          type:'alumni', time: `${i}d ago`,
          content: [
            'Our NeurIPS paper on robust training is out. Code will be public soon.',
            'Hiring 2 research engineers at TechCorp Mumbai – strong PyTorch skills required.',
            'Conducted a seminar on ethical AI – great student turnout!',
            'Benchmarking vision models for low-light scenarios. Results next week.',
          ][i%4],
          image: i%2===0? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&h=500&fit=crop': undefined,
          tags: ['AI','research','PyTorch','NeurIPS'].slice(0,(i%4)+1)
        })),
        portfolio: {
          summary: [
            { icon:'fa-briefcase', title:'TechCorp Mumbai', desc:'CTO • AI Platform' },
            { icon:'fa-map-marker-alt', title:'Mumbai, India', desc:'Advises startups' },
            { icon:'fa-graduation-cap', title:'Batch 2013–2017', desc:'Electronics' },
          ],
          projects: [
            { title:'Low-Light Vision', desc:'CVPR Workshop Best Paper' },
            { title:'Edge AI Suite', desc:'ONNX, TensorRT, CUDA' },
            { title:'ML MLOps Pipeline', desc:'Kubernetes, Kubeflow' },
            { title:'Ethical AI Framework', desc:'Fairness, Privacy' },
          ],
          certs:['DeepLearning.AI','GCP ML Engineer','TensorFlow Dev']
        },
        opps: [
          { title:'Research Engineer - CV', company:'TechCorp', type:'Full-time', location:'Mumbai', details:'PyTorch, CUDA, CV' },
          { title:'AI Seminar - Guest', company:'GuruSetu', type:'Workshop', location:'Chennai', details:'Talk + hands-on' },
        ]
      },
      'Ananya Singh': {
        posts: Array.from({length: 9}).map((_,i)=>({
          author:'Ananya Singh',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop',
          type:'alumni', time:`${i}d ago`,
          content: [
            'Won the UX Design Award 2025 with the team. Sharing a case study soon.',
            'Design system tokens overhaul – accessibility-first colors.',
            'Running a Figma workshop for juniors this weekend.',
          ][i%3],
          image: i%3===0? 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=1200&h=600&fit=crop': undefined,
          tags:['UX','design-system','accessibility'].slice(0,(i%3)+1)
        })),
        portfolio:{
          summary:[
            { icon:'fa-briefcase', title:'Meta India', desc:'Product Manager • Growth' },
            { icon:'fa-map-marker-alt', title:'Hyderabad, India', desc:'Speaker & mentor' },
            { icon:'fa-graduation-cap', title:'Batch 2012–2016', desc:'Information Systems' }
          ],
          projects:[
            { title:'Design System Library', desc:'Figma, Storybook' },
            { title:'Onboarding Funnel', desc:'+12% activation' },
            { title:'A11y Audit', desc:'WCAG AA compliance' }
          ],
          certs:['NN/g UX','PMI-ACP']
        },
        opps:[
          { title:'Product Designer', company:'Flipkart', type:'Full-time', location:'Bengaluru', details:'Figma, Research' },
          { title:'Mentor - UX Careers', company:'GuruSetu', type:'Volunteer', location:'Remote', details:'1:1 sessions' }
        ]
      },
      'Lakshmi Nair': {
        posts: Array.from({length: 8}).map((_,i)=>({
          author:'Lakshmi Nair',
          avatar: 'https://images.unsplash.com/photo-1541216970279-affbfdd55aa1?w=256&h=256&fit=crop',
          type:'alumni', time:`${i}d ago`,
          content: [
            'Bootstrapped BharatStart to 50 employees – hiring across functions!',
            'Looking for partnerships in tier-2 cities for our EduTech pilot.',
            'Hosting a founder Q&A – ask anything about product-market fit.',
          ][i%3],
          tags:['startup','hiring','founder'].slice(0,(i%3)+1)
        })),
        portfolio:{
          summary:[
            { icon:'fa-briefcase', title:'BharatStart', desc:'Founder & CEO' },
            { icon:'fa-map-marker-alt', title:'Kochi, India', desc:'Community builder' },
            { icon:'fa-graduation-cap', title:'Batch 2011–2015', desc:'Computer Science' }
          ],
          projects:[
            { title:'Rural LTE Router', desc:'OpenWRT, ARM' },
            { title:'Learning App', desc:'React Native, Firebase' },
            { title:'Grants Portal', desc:'Django, Postgres' }
          ]
        },
        opps:[
          { title:'Full-stack Engineer', company:'BharatStart', type:'Full-time', location:'Remote', details:'React, Django' },
          { title:'Growth Marketer', company:'BharatStart', type:'Full-time', location:'Remote', details:'SEO, CRM' }
        ]
      }
    };

    // Simple demo dataset composed from existing app data (Indian names)
  const directory = [
      { name: 'Aarav Sharma', type: 'alumni', headline: 'Senior SWE at Google India', location: 'Bengaluru, India', company: 'Google India', grad: 2018, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2c?w=256&h=256&fit=crop', batch: '2014–2018', dept: 'Computer Science', linkedin: '#', website: '#' },
      { name: 'Priya Verma', type: 'student', headline: 'Final Year CS Student', location: 'Delhi, India', company: 'GuruSetu University', grad: 2026, image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=256&h=256&fit=crop', batch: '2022–2026', dept: 'Computer Science', linkedin: '#', website: '#' },
      { name: 'Dr. Neha Iyer', type: 'alumni', headline: 'CTO at TechCorp Mumbai', location: 'Mumbai, India', company: 'TechCorp', grad: 2017, image: 'https://images.unsplash.com/photo-1544005313-3b3c8f3a5f50?w=256&h=256&fit=crop', batch: '2013–2017', dept: 'Electronics', linkedin: '#', website: '#' },
      { name: 'Rohit Gupta', type: 'student', headline: 'MBA Second Year', location: 'Ahmedabad, India', company: 'IIM', grad: 2025, image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=256&h=256&fit=crop', batch: '2023–2025', dept: 'MBA', linkedin: '#', website: '#' },
      { name: 'Ananya Singh', type: 'alumni', headline: 'Product Manager at Meta', location: 'Hyderabad, India', company: 'Meta', grad: 2016, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop', batch: '2012–2016', dept: 'Information Systems', linkedin: '#', website: '#' },
      { name: 'Lakshmi Nair', type: 'alumni', headline: 'Founder of BharatStart', location: 'Kochi, India', company: 'BharatStart', grad: 2015, image: 'https://images.unsplash.com/photo-1541216970279-affbfdd55aa1?w=256&h=256&fit=crop', batch: '2011–2015', dept: 'Computer Science', linkedin: '#', website: '#' }
    ];

    // Default to current user if no name provided
    let profile = directory.find(p => p.name.toLowerCase() === (nameParam || '').toLowerCase());
    if (!profile) {
      const current = authSystem.getCurrentUser();
      profile = {
        name: current.fullName,
        type: current.accountType,
        headline: current.currentRole || (current.accountType === 'student' ? 'Student at GuruSetu University' : 'Alumni'),
        location: 'India',
        company: current.currentRole ? current.currentRole.split(' at ')[1] || '—' : '—',
        grad: current.graduationYear || '—',
        image: current.profileImage,
        batch: current.graduationYear ? `${current.graduationYear - 4}–${current.graduationYear}` : '—',
        dept: current.department ? current.department.replace('-', ' ') : '—',
        linkedin: '#',
        website: '#'
      };
    }

  // Fill header
  const avatarEl = document.getElementById('profileAvatar');
  const gHeader = this.guessGender(profile.name);
  avatarEl.src = profile.image || this.fallbacks[gHeader] || this.fallbacks.neutral;
  avatarEl.onerror = () => { avatarEl.onerror = null; const g = this.guessGender(profile.name); avatarEl.src = this.fallbacks[g] || this.fallbacks.neutral; };
    document.getElementById('profileName').textContent = profile.name;
    const typeTag = document.getElementById('profileType');
    typeTag.textContent = profile.type.charAt(0).toUpperCase() + profile.type.slice(1);
    typeTag.className = `px-3 py-1 rounded-full text-sm ${profile.type === 'alumni' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`;
    document.getElementById('profileHeadline').textContent = profile.headline;
    document.getElementById('profileLocation').textContent = profile.location;
    document.getElementById('profileCompany').textContent = profile.company;
    document.getElementById('profileEdu').textContent = `Class of ${profile.grad}`;
    document.getElementById('profileBatch').textContent = `Batch: ${profile.batch}`;
    document.getElementById('profileDept').textContent = `Department: ${profile.dept}`;
    document.getElementById('profileLinkedIn').href = profile.linkedin;
    document.getElementById('profileWebsite').href = profile.website;

  // Populate sidebars with simple reused items
    this.populateLeft(profile);
    this.populateRight(profile);

    // Render tabs with enriched data when available
    const enriched = this.richProfiles[profile.name] || null;
    this.renderFeed(profile, enriched);
    this.renderOpportunities(profile, enriched);
    this.renderPortfolio(profile, enriched);
  }

  populateLeft(profile){
    const comm = document.getElementById('profileLeftCommunities');
    const follow = document.getElementById('profileLeftFollowing');
    if (comm) {
      const communities = ['Computer Science Alumni','MBA Graduates 2020-2024','Engineering Society','Startup Founders','Data Science Network'];
      comm.innerHTML = communities.map(c => `<div class="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-200"><div class="flex items-center space-x-3"><div class=\"w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center\"><i class=\"fas fa-users text-blue-600 text-sm\"></i></div><div><h3 class=\"font-semibold text-gray-900 text-sm\">${c}</h3><p class=\"text-xs text-gray-500\">+100 members</p></div></div><div class=\"w-3 h-3 bg-green-400 rounded-full\"></div></div>`).join('');
    }
    if (follow) {
      const following = [
        { name:'Aarav Sharma', type:'alumni', position:'Senior SWE • Google India', image:'https://images.unsplash.com/photo-1544005313-94ddf0286df2c?w=64&h=64&fit=crop' },
        { name:'Dr. Neha Iyer', type:'alumni', position:'CTO • TechCorp Mumbai', image:'https://images.unsplash.com/photo-1544005313-3b3c8f3a5f50?w=64&h=64&fit=crop' },
        { name:'Ananya Singh', type:'alumni', position:'PM • Meta India', image:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop' },
        { name:'Lakshmi Nair', type:'alumni', position:'Founder & CEO • BharatStart', image:'https://images.unsplash.com/photo-1541216970279-affbfdd55aa1?w=64&h=64&fit=crop' }
      ];
      follow.innerHTML = following.map(p => {
        const fb = this.fallbacks[this.guessGender(p.name)] || this.fallbacks.neutral;
        return `<div class=\"flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all cursor-pointer border border-transparent hover:border-blue-100\"><img src=\"${p.image || fb}\" onerror=\"this.onerror=null;this.src='${fb}'\" class=\"w-10 h-10 rounded-full object-cover\"/><div class=\"flex-1 min-w-0\"><div class=\"flex items-center space-x-2\"><h3 class=\"font-semibold text-gray-900 text-sm truncate\"><a href=\"profile.html?name=${encodeURIComponent(p.name)}\">${p.name}</a></h3><span class=\"px-2 py-1 text-xs rounded ${p.type==='alumni'?'bg-blue-100 text-blue-700':'bg-green-100 text-green-700'}\">${p.type}</span></div><p class=\"text-xs text-gray-500 truncate\">${p.position}</p></div></div>`;
      }).join('');
    }
  }

  populateRight(profile){
    const opps = document.getElementById('profileRightOpps');
    const evts = document.getElementById('profileRightEvents');
    if (opps){
      const items = [
        { title:'Senior Frontend Developer', company:'Flipkart', type:'Full-time', location:'Bengaluru', salary:'₹30–45 LPA' },
        { title:'React Native Contractor', company:'Zomato', type:'Contract', location:'Remote', salary:'₹2–3 L/month' },
        { title:'AI/ML Workshop', company:'IIT Madras', type:'Workshop', location:'Chennai', salary:'Free' }
      ];
      opps.innerHTML = items.map(i => `<div class=\"p-4 border border-gray-100 rounded-lg hover:border-orange-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all\"><div class=\"flex items-start space-x-4\"><div class=\"w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white\"><i class=\"fas fa-briefcase text-sm\"></i></div><div class=\"flex-1\"><h3 class=\"font-bold text-gray-900 text-sm mb-1\">${i.title}</h3><p class=\"text-gray-600 text-xs mb-2\">${i.company}</p><div class=\"flex items-center justify-between text-xs text-gray-500 mb-2\"><span class=\"font-semibold text-green-600\">${i.salary}</span><span>${i.type} • ${i.location}</span></div><div class=\"flex items-center space-x-2\"><span class=\"px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs border border-orange-200\">${i.type}</span><span class=\"px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs border border-gray-200\">${i.location}</span></div></div></div></div>`).join('');
    }
    if (evts){
      const events = [
        { id:1, title:'Spring Networking Mixer', date:'2025-04-15', time:'6:00 PM', location:'Grand Ballroom', image:'https://images.unsplash.com/photo-1511578314322-379afb476865?w=80&h=60&fit=crop' },
        { id:2, title:'Innovation Workshop', date:'2025-05-20', time:'2:00 PM', location:'Innovation Lab', image:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=80&h=60&fit=crop' }
      ];
      evts.innerHTML = events.map(e => {
        const d = new Date(e.date).toLocaleDateString('en-US',{month:'short',day:'numeric'});
        return `<div class=\"flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100\" onclick=\"window.location.href='events.html?eventId=${e.id}'\"><img src=\"${e.image}\" onerror=\"this.onerror=null;this.src='https://images.unsplash.com/photo-1511578314322-379afb476865?w=80&h=60&fit=crop'\" class=\"w-12 h-9 object-cover rounded\"/><div class=\"flex-1 min-w-0\"><h4 class=\"font-medium text-sm text-gray-900 truncate\">${e.title}</h4><div class=\"flex items-center space-x-2 mt-1\"><span class=\"text-xs text-green-600\"><i class=\"fas fa-calendar-alt mr-1\"></i>${d}</span><span class=\"text-xs text-gray-500\"><i class=\"fas fa-clock mr-1\"></i>${e.time}</span></div></div></div>`;
      }).join('');
    }
  }

  renderFeed(profile, enriched) {
    const feed = document.getElementById('tab-feed');
    const samplePosts = [
      {
        author: profile.name,
        avatar: profile.image,
        type: profile.type,
        time: '1h ago',
        content: profile.type === 'alumni' ? 'Excited to mentor students this semester! Drop your questions below.' : 'Just completed my capstone module on ML. Looking for feedback!',
        tags: profile.type === 'alumni' ? ['mentorship','career'] : ['machine-learning','project']
      },
      {
        author: profile.name,
        avatar: profile.image,
        type: profile.type,
        time: 'Yesterday',
        content: profile.type === 'alumni' ? 'Hiring frontend engineers in Hyderabad. Referrals welcome.' : 'Participated in the campus hackathon over the weekend. Amazing experience!',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
        imageCaption: 'Shipping v1 of our internal dashboard'
      },
      {
        author: profile.name,
        avatar: profile.image,
        type: profile.type,
        time: '3d ago',
        content: 'Sharing my notes on system design interviews. Hope it helps!',
        tags: ['system-design','interview']
      }
    ];

    const posts = (enriched && Array.isArray(enriched.posts) && enriched.posts.length) ? enriched.posts : samplePosts;
    feed.innerHTML = posts.map(p => `
      <div class=\"bg-white rounded-lg border border-gray-200 p-0 hover:border-blue-200 hover:shadow-lg transition-all overflow-hidden\">
        <div class=\"p-6 pb-4\">
          <div class=\"flex items-start space-x-4\">
            <img src=\"${p.avatar}\" onerror=\"this.onerror=null;this.src='${this.fallbacks[this.guessGender(p.author || profile.name)] || this.fallbacks.neutral}'\" class=\"w-12 h-12 rounded-full object-cover\"/>
            <div class=\"flex-1\">
              <div class=\"flex items-center space-x-2 mb-2\">
                <h3 class=\"font-bold text-gray-900\">${p.author}</h3>
                <span class=\"px-3 py-1 text-xs rounded ${p.type==='alumni'?'bg-blue-100 text-blue-700 border border-blue-200':'bg-green-100 text-green-700 border border-green-200'}\">${p.type}</span>
                <span class=\"text-gray-400 text-sm\">•</span>
                <span class=\"text-gray-500 text-sm\">${p.time}</span>
              </div>
              <p class=\"text-gray-800 mb-4 leading-relaxed\">${p.content}</p>
              ${p.tags ? `<div class=\"flex flex-wrap gap-2 mb-4\">${p.tags.map(tag => `<span class=\"px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded text-xs font-medium border border-blue-200\">#${tag}</span>`).join('')}</div>` : ''}
            </div>
          </div>
        </div>
  ${p.image?`<div class=\"relative\"><img src=\"${p.image}\" onerror=\"this.onerror=null;this.src='https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1000&h=500&fit=crop'\" class=\"w-full h-64 object-cover\"><div class=\"absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4\"><p class=\"text-white text-sm font-medium\">${p.imageCaption||''}</p></div></div>`:''}
        <div class=\"p-6 pt-4 border-t border-gray-100\">
          <div class=\"flex items-center space-x-6\">
            <button class=\"post-action\"><i class=\"far fa-heart\"></i><span>24</span></button>
            <button class=\"post-action\"><i class=\"far fa-comment\"></i><span>6</span></button>
            <button class=\"post-action\"><i class=\"far fa-share-square\"></i><span>3</span></button>
            <div class=\"flex-1\"></div>
            <button class=\"post-action\"><i class=\"fas fa-bookmark\"></i></button>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderOpportunities(profile, enriched) {
    const wrap = document.getElementById('tab-opportunities');
    const defaultItems = profile.type === 'alumni' ? [
      { title: 'Frontend Engineer', company: 'Meta India', type: 'Full-time', location: 'Hyderabad', details:'React, TypeScript, GraphQL. 5+ yrs exp.' },
      { title: 'Product Designer', company: 'Flipkart', type: 'Full-time', location: 'Bengaluru', details:'Figma, UX Research, Design Systems.' },
      { title: 'Mentor - System Design', company: 'GuruSetu', type: 'Volunteer', location: 'Remote', details:'Weekly 2 hour sessions.' }
    ] : [
      { title: 'Summer Internship - SDE', company: 'Amazon India', type: 'Internship', location: 'Bengaluru', details:'Data structures, AWS basics preferred.' },
      { title: 'Research Assistant - ML', company: 'IIT Bombay', type: 'Part-time', location: 'Mumbai', details:'Python, PyTorch, publications a plus.' },
      { title: 'Campus Ambassador', company: 'StartupX', type: 'Part-time', location: 'Remote', details:'Community building and events.' }
    ];

    const items = (enriched && Array.isArray(enriched.opps) && enriched.opps.length) ? enriched.opps : defaultItems;

    wrap.innerHTML = items.map(i => `
      <div class=\"p-5 bg-white rounded-lg border border-gray-200 flex items-start space-x-4 hover:shadow-sm\">
        <div class=\"w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white\"><i class=\"fas fa-briefcase\"></i></div>
        <div class=\"flex-1\">
          <h3 class=\"font-semibold text-gray-900\">${i.title}</h3>
          <p class=\"text-sm text-gray-600\">${i.company}</p>
          <div class=\"mt-2 text-xs text-gray-500\">${i.type} • ${i.location}</div>
          <p class=\"text-sm text-gray-600 mt-2\">${i.details}</p>
        </div>
        <button class=\"px-3 py-1 text-sm bg-blue-600 text-white rounded\">${profile.type==='alumni'?'Refer':'Apply'}</button>
      </div>
    `).join('');
  }

  renderPortfolio(profile, enriched) {
    const port = document.getElementById('tab-portfolio');
    const isAlumni = profile.type === 'alumni';
    if (isAlumni) {
      if (enriched && enriched.portfolio) {
        const s = enriched.portfolio;
        const summary = (s.summary||[]).map(it => `<li class=\"flex items-start\"><i class=\"fas ${it.icon} text-blue-600 mt-1 mr-3\"></i><div><div class=\"font-medium\">${it.title}</div><div class=\"text-sm text-gray-600\">${it.desc||''}</div></div></li>`).join('');
        const projects = (s.projects||[]).map(p => `<div class=\"p-4 border rounded-lg\"><h4 class=\"font-medium\">${p.title}</h4><p class=\"text-sm text-gray-600\">${p.desc||''}</p></div>`).join('');
        const certs = (s.certs||[]).map(c => `<span class=\"px-3 py-1 bg-gray-100 rounded\">${c}</span>`).join('');
        port.innerHTML = `
          <div class=\"bg-white rounded-lg border border-gray-200 p-6 space-y-6\">
            <div>
              <h3 class=\"text-lg font-semibold text-gray-900 mb-4\">Career Summary</h3>
              <ul class=\"space-y-3\">${summary}</ul>
            </div>
            <div>
              <h3 class=\"text-lg font-semibold text-gray-900 mb-4\">Highlighted Projects</h3>
              <div class=\"grid sm:grid-cols-2 gap-4\">${projects}</div>
            </div>
            <div>
              <h3 class=\"text-lg font-semibold text-gray-900 mb-4\">Certifications</h3>
              <div class=\"flex flex-wrap gap-2\">${certs}</div>
            </div>
          </div>`;
      } else {
        port.innerHTML = `
          <div class=\"bg-white rounded-lg border border-gray-200 p-6 space-y-6\">
            <div>
              <h3 class=\"text-lg font-semibold text-gray-900 mb-4\">Career Summary</h3>
              <ul class=\"space-y-3\">
                <li class=\"flex items-start\"><i class=\"fas fa-briefcase text-blue-600 mt-1 mr-3\"></i><div><div class=\"font-medium\">${profile.company}</div><div class=\"text-sm text-gray-600\">5+ years • Product & Engineering</div></div></li>
                <li class=\"flex items-start\"><i class=\"fas fa-map-marker-alt text-blue-600 mt-1 mr-3\"></i><div><div class=\"font-medium\">${profile.location}</div><div class=\"text-sm text-gray-600\">Open to mentoring</div></div></li>
                <li class=\"flex items-start\"><i class=\"fas fa-graduation-cap text-blue-600 mt-1 mr-3\"></i><div><div class=\"font-medium\">Batch ${profile.batch}</div><div class=\"text-sm text-gray-600\">${profile.dept}</div></div></li>
                <li class=\"flex items-start\"><i class=\"fas fa-link text-blue-600 mt-1 mr-3\"></i><div><a href=\"${profile.linkedin}\" class=\"text-blue-600 hover:text-blue-700\">LinkedIn</a> • <a href=\"${profile.website}\" class=\"text-blue-600 hover:text-blue-700\">Portfolio Website</a></div></li>
              </ul>
            </div>
            <div>
              <h3 class=\"text-lg font-semibold text-gray-900 mb-4\">Highlighted Projects</h3>
              <div class=\"grid sm:grid-cols-2 gap-4\">
                <div class=\"p-4 border rounded-lg\"><h4 class=\"font-medium\">Realtime Chat Platform</h4><p class=\"text-sm text-gray-600\">WebSockets, Redis, Kubernetes</p></div>
                <div class=\"p-4 border rounded-lg\"><h4 class=\"font-medium\">Design System Library</h4><p class=\"text-sm text-gray-600\">Figma, React, Storybook</p></div>
              </div>
            </div>
            <div>
              <h3 class=\"text-lg font-semibold text-gray-900 mb-4\">Certifications</h3>
              <div class=\"flex flex-wrap gap-2\"><span class=\"px-3 py-1 bg-gray-100 rounded\">AWS SAA</span><span class=\"px-3 py-1 bg-gray-100 rounded\">GCP ACE</span><span class=\"px-3 py-1 bg-gray-100 rounded\">Scrum PSM I</span></div>
            </div>
          </div>
        `;
      }
    } else {
      port.innerHTML = `
        <div class=\"bg-white rounded-lg border border-gray-200 p-6 space-y-6\">
          <div>
            <h3 class=\"text-lg font-semibold text-gray-900 mb-4\">Student Highlights</h3>
            <ul class=\"space-y-3\">
              <li class=\"flex items-start\"><i class=\"fas fa-award text-green-600 mt-1 mr-3\"></i><div><div class=\"font-medium\">Dean's List</div><div class=\"text-sm text-gray-600\">2024</div></div></li>
              <li class=\"flex items-start\"><i class=\"fas fa-project-diagram text-green-600 mt-1 mr-3\"></i><div><div class=\"font-medium\">Capstone: ML-based Recommender</div><div class=\"text-sm text-gray-600\">Python, TensorFlow</div></div></li>
              <li class=\"flex items-start\"><i class=\"fas fa-hand-holding-heart text-green-600 mt-1 mr-3\"></i><div><div class=\"font-medium\">Volunteer: Teaching Assistant</div><div class=\"text-sm text-gray-600\">Data Structures</div></div></li>
            </ul>
          </div>
          <div>
            <h3 class=\"text-lg font-semibold text-gray-900 mb-4\">Skills</h3>
            <div class=\"flex flex-wrap gap-2\"><span class=\"px-3 py-1 bg-gray-100 rounded\">React</span><span class=\"px-3 py-1 bg-gray-100 rounded\">Node.js</span><span class=\"px-3 py-1 bg-gray-100 rounded\">SQL</span><span class=\"px-3 py-1 bg-gray-100 rounded\">ML</span></div>
          </div>
        </div>
      `;
    }
  }
}

new ProfilePage();
