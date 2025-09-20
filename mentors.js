// Mentors page logic
class MentorsPage {
  constructor(){
    document.addEventListener('DOMContentLoaded', () => this.init());
  }
  init(){
    if(!window.authSystem || !authSystem.isLoggedIn()){
      window.location.href = 'login.html';
      return;
    }
    document.getElementById('authLoader').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    this.seedData();
    this.renderHighlightedMentors();
    this.renderVideos();
    this.renderCourses();
    this.renderBlogs();
    this.setupSearch();
  }
  seedData(){
    // Highlighted mentors and datasets
    this.mentors = [
      { id:1, name:'Aarav Sharma', role:'Senior SWE • Google India', image:'https://images.unsplash.com/photo-1544005313-94ddf0286df2c?w=256&h=256&fit=crop', skills:['System Design','DSA','Career'] },
      { id:2, name:'Dr. Neha Iyer', role:'CTO • TechCorp', image:'https://images.unsplash.com/photo-1544005313-3b3c8f3a5f50?w=256&h=256&fit=crop', skills:['AI/ML','Research','Leadership'] },
      { id:3, name:'Ananya Singh', role:'PM • Meta', image:'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=256&h=256&fit=crop', skills:['Product','UX','Strategy'] },
      { id:4, name:'Rohit Mehta', role:'Cloud Architect • AWS', image:'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=256&h=256&fit=crop', skills:['Cloud','DevOps','Security'] }
    ];

    // Replace with YouTube videos (iframes). Titles will be fetched via oEmbed; fall back to reasonable placeholders.
    this.videos = [
      { id:'y1', url:'https://youtu.be/y-9xqNKLhek?si=VF2A8XQ-kP223IHu', title:'', mentor:'', duration:'', views:'' },
      { id:'y2', url:'https://youtu.be/yZJYb9S8O8c?si=VC1mXQCzeWObDwvR', title:'', mentor:'', duration:'', views:'' },
      { id:'y3', url:'https://youtu.be/rvnKexTI3Q0?si=g-rF8c39rfZ0Wcoc', title:'', mentor:'', duration:'', views:'' }
    ];

    this.courses = [
      { id:'c-sd-101', title:'System Design Mastery', mentor:'Aarav Sharma', rating:4.8, learners:'2,345', price:'₹1,999', thumb:'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&h=340&fit=crop', lessons:42 },
      { id:'c-ml-201', title:'Practical Machine Learning', mentor:'Dr. Neha Iyer', rating:4.9, learners:'1,874', price:'₹2,499', thumb:'https://images.unsplash.com/photo-1551281044-c2e7437e7e77?w=600&h=340&fit=crop', lessons:56 },
      { id:'c-pm-110', title:'Product Management Foundations', mentor:'Ananya Singh', rating:4.7, learners:'3,102', price:'₹1,499', thumb:'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=340&fit=crop', lessons:30 }
    ];

    this.blogs = [
      { id:'b1', title:'Lessons from Scaling to 10M users', author:'Aarav Sharma', cover:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=340&fit=crop', read:'7 min' },
      { id:'b2', title:'Bridging Research and Industry in AI', author:'Dr. Neha Iyer', cover:'https://images.unsplash.com/photo-1534759846116-5790a4bd345d?w=600&h=340&fit=crop', read:'9 min' },
      { id:'b3', title:'Crafting Narratives in Product Roadmaps', author:'Ananya Singh', cover:'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=600&h=340&fit=crop', read:'6 min' }
    ];
  }
  renderHighlightedMentors(){
    const grid = document.getElementById('highlightedMentors');
    grid.innerHTML = this.mentors.map(m => `
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
        <div class="p-5 flex items-center space-x-4">
          <img src="${m.image}" class="w-14 h-14 rounded-full object-cover"/>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">${m.name}</h3>
            <p class="text-sm text-gray-600">${m.role}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              ${m.skills.map(s => `<span class=\"px-2 py-0.5 text-xs bg-gray-100 rounded border\">${s}</span>`).join('')}
            </div>
          </div>
          <a href="profile.html?name=${encodeURIComponent(m.name)}" class="text-blue-600 text-sm">View</a>
        </div>
      </div>
    `).join('');
  }
  async renderVideos(){
    const grid = document.getElementById('alumniVideos');
    // Fetch titles via oEmbed (no API key). If network blocked, fall back gracefully.
    const fetchTitle = async (url) => {
      try {
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        const res = await fetch(oembedUrl);
        if (!res.ok) throw new Error('oEmbed failed');
        const data = await res.json();
        return data.title || '';
      } catch { return ''; }
    };

    const withTitles = await Promise.all(this.videos.map(async (v) => ({
      ...v,
      title: (await fetchTitle(v.url)) || 'Alumni Talk',
      embed: v.url.replace('https://youtu.be/', 'https://www.youtube.com/embed/').split('?')[0]
    })));

    grid.innerHTML = withTitles.map(v => `
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
        <div class="relative aspect-video bg-black">
          <iframe class="w-full h-full" src="${v.embed}" title="${v.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-gray-900">${v.title}</h3>
        </div>
      </div>
    `).join('');
  }
  renderCourses(){
    const grid = document.getElementById('coursesGrid');
    grid.innerHTML = this.courses.map(c => `
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
        <img src="${c.thumb}" class="w-full h-40 object-cover"/>
        <div class="p-4">
          <h3 class="font-semibold text-gray-900">${c.title}</h3>
          <p class="text-sm text-gray-600">${c.mentor}</p>
          <div class="flex items-center justify-between text-sm text-gray-600 mt-2">
            <span><i class="fas fa-star text-yellow-400 mr-1"></i>${c.rating}</span>
            <span>${c.lessons} lessons</span>
            <span class="font-semibold text-green-600">${c.price}</span>
          </div>
          <div class="mt-3 flex items-center justify-end">
            <a href="course.html?id=${encodeURIComponent(c.id)}" class="px-3 py-1 bg-blue-600 text-white rounded text-sm">View Course</a>
          </div>
        </div>
      </div>
    `).join('');
  }
  renderBlogs(){
    const grid = document.getElementById('blogsGrid');
    grid.innerHTML = this.blogs.map(b => `
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
        <img src="${b.cover}" class="w-full h-40 object-cover"/>
        <div class="p-4">
          <h3 class="font-semibold text-gray-900">${b.title}</h3>
          <p class="text-sm text-gray-600">${b.author} • ${b.read} read</p>
        </div>
      </div>
    `).join('');
  }
  setupSearch(){
    const input = document.getElementById('setuQuery');
    const category = document.getElementById('setuCategory');
    const btn = document.getElementById('setuSearchBtn');
    const results = document.getElementById('setuResults');
    const run = () => {
      const q = (input.value || '').toLowerCase();
      const cat = category.value;
      let cards = [];
      const pushMentor = (m) => cards.push(`<div class=\"p-4 border rounded-lg bg-white\"><div class=\"flex items-center space-x-3\"><img src=\"${m.image}\" class=\"w-10 h-10 rounded-full object-cover\"/><div class=\"flex-1\"><div class=\"font-semibold\">${m.name}</div><div class=\"text-xs text-gray-600\">${m.role}</div></div><a href=\"profile.html?name=${encodeURIComponent(m.name)}\" class=\"text-blue-600 text-sm\">Profile</a></div></div>`);
      const pushCourse = (c) => cards.push(`<div class=\"p-4 border rounded-lg bg-white\"><div class=\"font-semibold mb-1\">${c.title}</div><div class=\"text-sm text-gray-600\">${c.mentor}</div><div class=\"text-xs text-gray-500\">${c.lessons} lessons • ${c.price}</div><div class=\"mt-2\"><a class=\"text-blue-600 text-sm\" href=\"course.html?id=${encodeURIComponent(c.id)}\">Open course</a></div></div>`);
      const pushVideo = (v) => cards.push(`<div class=\"p-4 border rounded-lg bg-white\"><div class=\"font-semibold mb-1\">${v.title}</div><div class=\"text-sm text-gray-600\">${v.mentor}</div><div class=\"text-xs text-gray-500\">${v.duration} • ${v.views} views</div></div>`);
      const pushBlog = (b) => cards.push(`<div class=\"p-4 border rounded-lg bg-white\"><div class=\"font-semibold mb-1\">${b.title}</div><div class=\"text-sm text-gray-600\">${b.author}</div><div class=\"text-xs text-gray-500\">${b.read} read</div></div>`);

      if (cat === 'all' || cat === 'mentors') this.mentors.filter(m => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.skills.join(' ').toLowerCase().includes(q)).forEach(pushMentor);
      if (cat === 'all' || cat === 'courses') this.courses.filter(c => c.title.toLowerCase().includes(q) || c.mentor.toLowerCase().includes(q)).forEach(pushCourse);
      if (cat === 'all' || cat === 'videos') this.videos.filter(v => v.title.toLowerCase().includes(q) || v.mentor.toLowerCase().includes(q)).forEach(pushVideo);
      if (cat === 'all' || cat === 'blogs') this.blogs.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)).forEach(pushBlog);

      results.innerHTML = cards.length ? cards.join('') : `<div class="text-gray-500 text-sm">No results. Try different keywords.</div>`;
    };
    btn.addEventListener('click', run);
  }
}

new MentorsPage();
