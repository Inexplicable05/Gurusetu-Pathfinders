// Course page logic
class CoursePage {
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
    this.loadCourse();
  }
  seedData(){
    this.courses = {
      'c-sd-101': {
        id:'c-sd-101',
        title:'System Design Mastery',
        mentor:'Aarav Sharma',
        rating:4.8,
        learners:'2,345',
        price:'₹1,999',
        thumb:'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1200&h=600&fit=crop',
        lessons:42,
        bullets:[
          'Frameworks to approach any system design question',
          'Deep dives into caching, sharding, queues',
          'Scalability, reliability, and trade-offs'
        ],
        curriculum:[
          'Intro & Mindset for System Design',
          'Latency vs Throughput – You can’t have both',
          'Load Balancers & Reverse Proxies',
          'Databases – SQL vs NoSQL',
          'Caches – Redis patterns',
          'Queues & Event-driven architecture',
          'Design: URL Shortener',
          'Design: Instagram',
          'Mock interview walkthroughs'
        ],
        instructor:{
          name:'Aarav Sharma',
          role:'Senior SWE • Google India',
          avatar:'https://images.unsplash.com/photo-1544005313-94ddf0286df2c?w=256&h=256&fit=crop',
          bio:'Aarav has led distributed system design at scale, mentoring 500+ learners on system design and large-scale architecture.'
        },
        reviews:[
          { name:'Priya Verma', text:'Very practical and well structured. Loved the interview mock sections.', rating:5 },
          { name:'Rohit Gupta', text:'Great coverage of fundamentals to advanced topics.', rating:5 }
        ]
      },
      'c-ml-201': {
        id:'c-ml-201',
        title:'Practical Machine Learning',
        mentor:'Dr. Neha Iyer',
        rating:4.9,
        learners:'1,874',
        price:'₹2,499',
        thumb:'https://images.unsplash.com/photo-1551281044-c2e7437e7e77?w=1200&h=600&fit=crop',
        lessons:56,
        bullets:[
          'End-to-end ML workflows',
          'Feature engineering and MLOps',
          'Deep learning with practical case studies'
        ],
        curriculum:[
          'Python & Data Handling',
          'EDA & Feature Engineering',
          'Modeling – Classic algorithms',
          'Neural Networks intro',
          'CNNs & RNNs',
          'Deployment & Monitoring',
          'Case studies & capstone'
        ],
        instructor:{
          name:'Dr. Neha Iyer',
          role:'CTO • TechCorp',
          avatar:'https://images.unsplash.com/photo-1544005313-3b3c8f3a5f50?w=256&h=256&fit=crop',
          bio:'Neha bridges research and industry, with multiple publications and production ML systems deployed at scale.'
        },
        reviews:[
          { name:'Aman Jain', text:'Hands-on and industry-focused.', rating:5 }
        ]
      },
      'c-pm-110': {
        id:'c-pm-110',
        title:'Product Management Foundations',
        mentor:'Ananya Singh',
        rating:4.7,
        learners:'3,102',
        price:'₹1,499',
        thumb:'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=600&fit=crop',
        lessons:30,
        bullets:[
          'Customer discovery & problem statements',
          'Defining MVPs and roadmaps',
          'Metrics, experimentation, and storytelling'
        ],
        curriculum:[
          'PM Mindset & Responsibilities',
          'User Research 101',
          'PRD & Roadmapping',
          'Design Collaboration',
          'Metrics and A/B tests',
          'Stakeholder management'
        ],
        instructor:{
          name:'Ananya Singh',
          role:'PM • Meta',
          avatar:'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=256&h=256&fit=crop',
          bio:'Ananya has shipped products to millions, focusing on UX and data-driven decisions.'
        },
        reviews:[
          { name:'Kriti', text:'Loved the storytelling section. Very actionable.', rating:5 }
        ]
      }
    };
  }
  loadCourse(){
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');
    const course = this.courses[id] || Object.values(this.courses)[0];
    // Donation visibility per role
    const donationSection = document.getElementById('donationSection');
    if (authSystem.isStudent()) {
      if (donationSection) donationSection.style.display = 'none';
    } else {
      if (donationSection) donationSection.style.display = 'flex';
    }

    document.getElementById('courseThumb').src = course.thumb;
    document.getElementById('courseTitle').textContent = course.title;
    document.getElementById('courseMentor').textContent = course.mentor;
    document.getElementById('courseStats').innerHTML = `<span><i class=\"fas fa-star text-yellow-400 mr-1\"></i>${course.rating}</span><span>${course.lessons} lessons</span>`;
    document.getElementById('courseTitleHero').textContent = course.title;
    document.getElementById('courseMetaHero').textContent = `${course.mentor} • ${course.lessons} lessons • ★ ${course.rating}`;
    document.getElementById('coursePrice').textContent = course.price;
    document.getElementById('courseLearners').textContent = `${course.learners} learners`;
    document.getElementById('courseBullets').innerHTML = course.bullets.map(b => `<li>${b}</li>`).join('');
    document.getElementById('courseCurriculum').innerHTML = course.curriculum.map((c,idx) => `<li class=\"p-3 border rounded-lg flex items-center justify-between\"><div><span class=\"text-gray-400 mr-2\">${(idx+1).toString().padStart(2,'0')}</span>${c}</div><span class=\"text-xs text-gray-500\">Lecture</span></li>`).join('');
    document.getElementById('courseReviews').innerHTML = course.reviews.map(r => `<div class=\"p-4 border rounded-lg\"><div class=\"font-medium\">${r.name}</div><div class=\"text-yellow-400 text-sm\">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div><p class=\"text-sm text-gray-700 mt-1\">${r.text}</p></div>`).join('');

    // Instructor
    document.getElementById('instructorAvatar').src = course.instructor.avatar;
    document.getElementById('instructorName').textContent = course.instructor.name;
    document.getElementById('instructorRole').textContent = course.instructor.role;
    document.getElementById('instructorBio').textContent = course.instructor.bio;
    document.getElementById('instructorProfile').href = `profile.html?name=${encodeURIComponent(course.instructor.name)}`;

    // Actions
    const enrollBtn = document.getElementById('enrollBtn');
    enrollBtn.addEventListener('click', () => {
      enrollBtn.textContent = 'Enrolled';
      enrollBtn.classList.remove('bg-blue-600');
      enrollBtn.classList.add('bg-green-600');
    });
  }
}

new CoursePage();
