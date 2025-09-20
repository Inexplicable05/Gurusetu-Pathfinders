// shim to original app.js while restructuring
document.addEventListener('DOMContentLoaded', function() {
	if (!window.authSystem) {
		setTimeout(() => {
			checkAuthAndInitialize();
		}, 100);
	} else {
		checkAuthAndInitialize();
	}
});

function checkAuthAndInitialize() {
	const authLoader = document.getElementById('authLoader');
	const mainApp = document.getElementById('mainApp');
	if (!authSystem.isLoggedIn()) {
		window.location.href = 'login.html';
		return;
	}
	if (authLoader) authLoader.style.display = 'none';
	if (mainApp) mainApp.style.display = 'block';
	initializeApp();
}

function initializeApp() {
	setupUserInterface();
	populateCommunities();
	populateFollowing();
	populateFeed();
	populateOpportunities();
	populateEvents();
	setupSidebarEvents();
	setupEventListeners();
}

function setupUserInterface() {
	const currentUser = authSystem.getCurrentUser();
	if (!currentUser) return;
	const userProfileImage = document.getElementById('userProfileImage');
	const userDisplayName = document.getElementById('userDisplayName');
	const dropdownUserName = document.getElementById('dropdownUserName');
	const dropdownUserType = document.getElementById('dropdownUserType');
	if (userProfileImage) userProfileImage.src = currentUser.profileImage;
	if (userDisplayName) userDisplayName.textContent = currentUser.fullName.split(' ')[0];
	if (dropdownUserName) dropdownUserName.textContent = currentUser.fullName;
	if (dropdownUserType) dropdownUserType.textContent = currentUser.accountType.charAt(0).toUpperCase() + currentUser.accountType.slice(1);
	const donationSection = document.getElementById('donationSection');
	const mobileDonationSection = document.getElementById('mobileDonationSection');
	const isStudent = authSystem.isStudent();
	if (donationSection) {
		donationSection.style.removeProperty('display');
		if (isStudent) {
			donationSection.classList.add('md:hidden');
		} else {
			donationSection.classList.remove('md:hidden');
		}
	}
	if (mobileDonationSection) {
		mobileDonationSection.style.removeProperty('display');
		if (isStudent) {
			mobileDonationSection.classList.add('hidden');
		} else {
			mobileDonationSection.classList.remove('hidden');
		}
	}
	setupUserMenu();
}

function setupUserMenu() {
	const userMenuButton = document.getElementById('userMenuButton');
	const userDropdown = document.getElementById('userDropdown');
	const logoutButton = document.getElementById('logoutButton');
	if (userMenuButton && userDropdown) {
		userMenuButton.addEventListener('click', (e) => {
			e.stopPropagation();
			userDropdown.classList.toggle('hidden');
		});
		document.addEventListener('click', () => {
			userDropdown.classList.add('hidden');
		});
		userDropdown.addEventListener('click', (e) => {
			e.stopPropagation();
		});
	}
	if (logoutButton) {
		logoutButton.addEventListener('click', () => {
			authSystem.logout();
		});
	}
}

const communities = {
	"Engineering": [
		{ name: "Computer Science Alumni", members: "2.5k", active: true, department: "CSE" },
		{ name: "Engineering Society", members: "3.2k", active: true, department: "IT" },
		{ name: "Data Science Network", members: "1.5k", active: true, department: "AI" }
	],
	"Design and creative arts": [
		{ name: "Design & Creative Arts", members: "967", active: false, department: "DIC" }
	],
	"Business administration graduates": [
		{ name: "MBA Graduates 2020-2024", members: "1.8k", active: false, department: "MBA" }
	],
	"Startup founders": [
		{ name: "Startup Founders", members: "892", active: false, department: "EDC" }
	]
};

const following = [
	{ name: "Aarav Sharma", type: "alumni", position: "Senior SWE at Google India", profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop" },
	{ name: "Priya Verma", type: "student", position: "CS Final Year", profileImage: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=128&h=128&fit=crop" },
	{ name: "Dr. Neha Iyer", type: "alumni", position: "CTO at TechCorp Mumbai", profileImage: "https://images.unsplash.com/photo-1544005313-3b3c8f3a5f50?w=128&h=128&fit=crop" },
	{ name: "Rohit Gupta", type: "student", position: "MBA Second Year", profileImage: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=128&h=128&fit=crop" },
	{ name: "Ananya Singh", type: "alumni", position: "Product Manager at Meta", profileImage: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=128&h=128&fit=crop" },
	{ name: "Kunal Mehta", type: "student", position: "Engineering Junior", profileImage: "https://images.unsplash.com/photo-1541534401786-2077eed87a74?w=128&h=128&fit=crop" },
	{ name: "Lakshmi Nair", type: "alumni", position: "Founder of BharatStart", profileImage: "https://images.unsplash.com/photo-1541216970279-affbfdd55aa1?w=128&h=128&fit=crop" },
	{ name: "Arjun Desai", type: "student", position: "Business Senior", profileImage: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=128&h=128&fit=crop" }
];

const feedPosts = [
	{
		author: "Aarav Sharma",
		type: "alumni",
		profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop",
		time: "2 hours ago",
		content: "Closed a ₹120 Cr Series B for our startup! Rejections are just redirections. Keep hustling! 🚀",
		image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop",
		imageCaption: "Team celebrating the announcement in Bengaluru",
		likes: 127,
		comments: 23,
		shares: 15,
		tags: ["startup", "funding", "motivation"]
	},
	{
		author: "Priya Verma",
		type: "student",
		profileImage: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=128&h=128&fit=crop",
		time: "4 hours ago",
		content: "Looking for a mentor to transition academic projects to real-world dev. Any alumni willing to guide? 💻",
		image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
		imageCaption: "My latest React + Node project",
		likes: 89,
		comments: 31,
		shares: 8,
		tags: ["mentorship", "career-advice", "computer-science"]
	},
	{
		author: "Dr. Neha Iyer",
		type: "alumni",
		profileImage: "https://images.unsplash.com/photo-1544005313-3b3c8f3a5f50?w=128&h=128&fit=crop",
		time: "6 hours ago",
		content: "Thrilled to share our AI paper accepted at NeurIPS 2025. Grateful for my PhD mentors. 🎓📚",
		image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
		imageCaption: "Visualization from our research on deep nets",
		likes: 203,
		comments: 45,
		shares: 67,
		tags: ["research", "AI", "academic-achievement"]
	},
	{
		author: "Rohit Gupta",
		type: "student",
		profileImage: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=128&h=128&fit=crop",
		time: "8 hours ago",
		content: "MBA case competition coming up. Building a sustainability model for urban farming. Any agtech alumni? 🌱",
		image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
		imageCaption: "Vertical farming prototype",
		likes: 56,
		comments: 18,
		shares: 12,
		tags: ["MBA", "sustainability", "agtech", "case-competition"]
	},
	{
		author: "Ananya Singh",
		type: "alumni",
		profileImage: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=128&h=128&fit=crop",
		time: "1 day ago",
		content: "Our design team won the UX Design Award 2025! Months of research and testing paid off. ✨",
		image: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=600&h=400&fit=crop",
		imageCaption: "Our award-winning app UI",
		likes: 145,
		comments: 32,
		shares: 28,
		tags: ["design", "UX", "award", "product-design"]
	}
];

const opportunities = [
	{ title: "Senior Frontend Developer", company: "TechVision Inc.", type: "Full-time", location: "Remote", salary: "₹60–90 LPA", posted: "2 days ago", category: "job" },
	{ title: "React Native App Development", company: "StartupHub", type: "Freelance", location: "Contract", salary: "₹4–6 L/month", posted: "1 day ago", category: "freelance" },
	{ title: "AI/ML Workshop Series", company: "DataScience Academy", type: "Workshop", location: "Hybrid", salary: "Free", posted: "3 hours ago", category: "workshop" },
	{ title: "Product Marketing Intern", company: "GrowthLabs", type: "Internship", location: "Bengaluru", salary: "₹1.2k/hour", posted: "5 hours ago", category: "internship" },
	{ title: "Backend Engineer - Series A Startup", company: "InnovateTech", type: "Full-time", location: "Hyderabad", salary: "₹45–70 LPA", posted: "1 week ago", category: "job" }
];

const events = [
	{ title: "Alumni Networking Gala 2025", date: "2025-10-15", time: "6:00 PM - 10:00 PM", location: "Grand Ballroom, University Campus", attendees: 245, category: "networking" },
	{ title: "Tech Talk: Future of AI", date: "2025-09-28", time: "2:00 PM - 4:00 PM", location: "Online Webinar", attendees: 156, category: "educational" },
	{ title: "Startup Pitch Competition", date: "2025-10-05", time: "10:00 AM - 6:00 PM", location: "Innovation Hub", attendees: 89, category: "competition" },
	{ title: "Career Fair 2025", date: "2025-11-12", time: "9:00 AM - 5:00 PM", location: "University Convention Center", attendees: 500, category: "career" },
	{ title: "Alumni Mentorship Program Kickoff", date: "2025-09-30", time: "7:00 PM - 9:00 PM", location: "Student Union Building", attendees: 78, category: "mentorship" }
];

function populateCommunities() {
	const container = document.getElementById('communities-section');
	if (!container) return;
	container.innerHTML = '';
	for (const section in communities) {
		const sectionElement = document.createElement('div');
		sectionElement.className = 'py-2';
		const sectionButton = document.createElement('button');
		sectionButton.className = 'w-full flex items-center justify-between text-left font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200';
		sectionButton.innerHTML = `
			<span>${section}</span>
			<i class="fas fa-chevron-down text-xs transform transition-transform duration-300"></i>
		`;
		const communityList = document.createElement('div');
		communityList.className = 'mt-2 space-y-2 pl-4 hidden';
		communities[section].forEach(community => {
			const communityElement = document.createElement('div');
			communityElement.className = 'flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg transition-all duration-300 cursor-pointer';
			const badgeColors = {
				"DIC": "bg-purple-100 text-purple-700",
				"IT": "bg-blue-100 text-blue-700",
				"CSE": "bg-green-100 text-green-700",
				"AI": "bg-yellow-100 text-yellow-700",
				"MBA": "bg-red-100 text-red-700",
				"EDC": "bg-indigo-100 text-indigo-700"
			};
			communityElement.innerHTML = `
				<div class="flex items-center space-x-3">
					<div>
						<h3 class="font-semibold text-gray-900 text-sm">${community.name}</h3>
						<p class="text-xs text-gray-500">${community.members} members</p>
					</div>
				</div>
				<div class="flex items-center space-x-2">
					<span class="px-2 py-1 text-xs rounded ${badgeColors[community.department] || 'bg-gray-100 text-gray-700'} font-medium">${community.department}</span>
					${community.active ?
						'<div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>' :
						'<div class="w-2 h-2 bg-gray-300 rounded-full"></div>'
					}
				</div>
			`;
			communityList.appendChild(communityElement);
		});
		sectionButton.addEventListener('click', () => {
			const icon = sectionButton.querySelector('i');
			communityList.classList.toggle('hidden');
			icon.classList.toggle('rotate-180');
		});
		sectionElement.appendChild(sectionButton);
		sectionElement.appendChild(communityList);
		container.appendChild(sectionElement);
	}
}

function populateFollowing() {
	const containers = document.querySelectorAll('.bg-white.rounded-lg.border.border-gray-200 .p-4.space-y-3');
	const followingContainer = containers[1];
	if (!followingContainer) return;
	following.forEach(person => {
		const personElement = document.createElement('div');
		personElement.className = 'flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-102 hover:shadow-md border border-transparent hover:border-blue-100';
		const tagColor = person.type === 'alumni' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-green-100 text-green-700 border border-green-200';
		personElement.innerHTML = `
			<img src="${person.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=3b82f6&color=fff`}" alt="${person.name}" class="w-10 h-10 rounded-full object-cover transition-all duration-300 hover:shadow-lg hover:scale-110" />
			<div class="flex-1 min-w-0">
				<div class="flex items-center space-x-2">
					<h3 class="font-semibold text-gray-900 text-sm truncate transition-colors duration-200 hover:text-blue-600"><a href="profile.html?name=${encodeURIComponent(person.name)}">${person.name}</a></h3>
					<span class="px-2 py-1 text-xs rounded ${tagColor} font-medium transition-all duration-200 hover:shadow-sm">${person.type}</span>
				</div>
				<p class="text-xs text-gray-500 truncate">${person.position}</p>
			</div>
		`;
		followingContainer.appendChild(personElement);
	});
}

function populateFeed() {
	const feedContainer = document.getElementById('feed-container');
	if (!feedContainer) return;
	feedPosts.forEach(post => {
		const postElement = document.createElement('div');
		postElement.className = 'bg-white rounded-lg border border-gray-200 p-0 hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden';
		const tagColor = post.type === 'alumni' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-green-100 text-green-700 border border-green-200';
		postElement.innerHTML = `
			<div class="p-6 pb-4">
				<div class="flex items-start space-x-4">
					<img src="${post.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=3b82f6&color=fff`}" alt="${post.author}" class="w-12 h-12 rounded-full object-cover transition-all duration-300 hover:shadow-lg hover:scale-110" />
					<div class="flex-1">
						<div class="flex items-center space-x-2 mb-2">
							<h3 class="font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 cursor-pointer"><a href="profile.html?name=${encodeURIComponent(post.author)}">${post.author}</a></h3>
							<span class="px-3 py-1 text-xs rounded ${tagColor} font-semibold transition-all duration-200 hover:shadow-sm">${post.type}</span>
							<span class="text-gray-400 text-sm">•</span>
							<span class="text-gray-500 text-sm">${post.time}</span>
						</div>
						<p class="text-gray-800 mb-4 leading-relaxed">${post.content}</p>
						<div class="flex flex-wrap gap-2 mb-4">
							${post.tags.map(tag => `<span class="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded text-xs font-medium border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 cursor-pointer">#${tag}</span>`).join('')}
						</div>
					</div>
				</div>
			</div>
			${post.image ? `
				<div class="relative">
					<img src="${post.image}" alt="Post image" class="w-full h-64 object-cover cursor-pointer hover:opacity-95 transition-opacity duration-200">
					<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
						<p class="text-white text-sm font-medium">${post.imageCaption}</p>
					</div>
				</div>
			` : ''}
			<div class="p-6 pt-4 border-t border-gray-100">
				<div class="flex items-center space-x-6">
					<button class="post-action">
						<i class="far fa-heart"></i>
						<span>${post.likes}</span>
					</button>
					<button class="post-action">
						<i class="far fa-comment"></i>
						<span>${post.comments}</span>
					</button>
					<button class="post-action">
						<i class="far fa-share-square"></i>
						<span>${post.shares}</span>
					</button>
					<div class="flex-1"></div>
					<button class="post-action">
						<i class="fas fa-bookmark"></i>
					</button>
				</div>
			</div>
		`;
		feedContainer.appendChild(postElement);
	});
}

function populateOpportunities() {
	const containers = document.querySelectorAll('.bg-white.rounded-lg.border.border-gray-200 .p-4.space-y-3');
	const opportunitiesContainer = containers[2];
	if (!opportunitiesContainer) return;
	opportunities.forEach(opportunity => {
		const opportunityElement = document.createElement('div');
		opportunityElement.className = 'p-4 border border-gray-100 rounded-lg hover:border-orange-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg';
		const categoryIcons = { job: 'fas fa-briefcase', freelance: 'fas fa-laptop-code', workshop: 'fas fa-chalkboard-teacher', internship: 'fas fa-graduation-cap' };
		const categoryColors = { job: 'from-blue-400 to-blue-600', freelance: 'from-green-400 to-green-600', workshop: 'from-purple-400 to-purple-600', internship: 'from-orange-400 to-orange-600' };
		opportunityElement.innerHTML = `
			<div class="flex items-start space-x-4">
				<div class="w-10 h-10 bg-gradient-to-br ${categoryColors[opportunity.category]} rounded-lg flex items-center justify-center mt-1 transition-transform duration-300 hover:rotate-12 hover:scale-110 shadow-md">
					<i class="${categoryIcons[opportunity.category]} text-white text-sm"></i>
				</div>
				<div class="flex-1">
					<h3 class="font-bold text-gray-900 text-sm mb-1 transition-colors duration-200 hover:text-orange-600">${opportunity.title}</h3>
					<p class="text-gray-600 text-xs mb-2 font-medium">${opportunity.company}</p>
					<div class="flex items-center text-xs text-gray-500 mb-3">
						<span>${opportunity.posted}</span>
					</div>
					<div class="flex items-center space-x-2">
						<span class="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded text-xs font-medium border border-orange-200">${opportunity.type}</span>
						<span class="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium border border-gray-200">${opportunity.location}</span>
					</div>
				</div>
			</div>
		`;
		opportunitiesContainer.appendChild(opportunityElement);
	});
}

let currentMiniSlide = 0;
let sidebarEventFilter = 'all';

function setupSidebarEvents() {
	setupMiniSlideshow();
	setupFeaturedAlumniAvatars();
	setupSidebarEventCategories();
	populateSidebarEvents();
	setupMiniEventGallery();
	setupSidebarEventListeners();
}

function setupMiniSlideshow() {
	const previousEvents = [
		{ title: "Alumni Homecoming 2024", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&h=150&q=80&fit=crop" },
		{ title: "Tech Innovation Summit", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=150&q=80&fit=crop" },
		{ title: "Career Fair 2024", image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=150&q=80&fit=crop" }
	];
	const miniSlideshow = document.getElementById('miniSlideshow');
	if (miniSlideshow) {
		miniSlideshow.innerHTML = previousEvents.map(event => `
			<div class="w-full flex-shrink-0 cursor-pointer" onclick="window.location.href='events.html'">
				<img src="${event.image}" alt="${event.title}" class="w-full h-32 object-cover">
			</div>
		`).join('');
	}
}

function setupFeaturedAlumniAvatars() {
	const featuredAlumni = [
		{ name: "Aarav Sharma", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop" },
		{ name: "Priya Verma", image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=64&h=64&fit=crop" },
		{ name: "Rohit Gupta", image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=64&h=64&fit=crop" },
		{ name: "Ananya Singh", image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=64&h=64&fit=crop" }
	];
	const container = document.getElementById('featuredAlumniAvatars');
	if (container) {
		container.innerHTML = featuredAlumni.map(alumni => `
			<img src="${alumni.image}" alt="${alumni.name}" 
				 class="w-8 h-8 rounded-full border-2 border-white hover:scale-110 transition-transform cursor-pointer" 
				 title="${alumni.name}"
				 onclick="window.location.href='events.html'">
		`).join('');
	}
}

function setupSidebarEventCategories() {
	const categoryButtons = document.querySelectorAll('.event-category-btn');
	categoryButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			categoryButtons.forEach(btn => {
				btn.classList.remove('active', 'bg-blue-100', 'text-blue-700');
				btn.classList.add('bg-gray-100', 'text-gray-600');
			});
			e.target.classList.add('active', 'bg-blue-100', 'text-blue-700');
			e.target.classList.remove('bg-gray-100', 'text-gray-600');
			sidebarEventFilter = e.target.dataset.category;
			populateSidebarEvents();
		});
	});
}

function populateSidebarEvents() {
	const sidebarEvents = [
		{ id: 1, title: "Spring Networking Mixer", date: "2025-04-15", time: "6:00 PM", location: "Grand Ballroom", category: "upcoming", attendees: 89, maxAttendees: 150, isInterested: false, image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=80&h=60&q=80&fit=crop" },
		{ id: 2, title: "Innovation Workshop", date: "2025-05-20", time: "2:00 PM", location: "Innovation Lab", category: "upcoming", attendees: 62, maxAttendees: 80, isInterested: true, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=80&h=60&q=80&fit=crop" },
		{ id: 3, title: "Career Mentorship Program", date: "2025-03-01", time: "Ongoing", location: "Virtual & Campus", category: "current", attendees: 387, maxAttendees: 500, isInterested: true, image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=80&h=60&q=80&fit=crop" }
	];
	let filteredEvents = sidebarEvents;
	if (sidebarEventFilter !== 'all') {
		filteredEvents = sidebarEvents.filter(event => event.category === sidebarEventFilter);
	}
	const container = document.getElementById('sidebarEvents');
	if (container) {
		container.innerHTML = filteredEvents.slice(0, 3).map(event => createSidebarEventItem(event)).join('');
		container.querySelectorAll('.sidebar-event-item').forEach(item => {
			item.addEventListener('click', (e) => {
				if (!e.target.closest('button')) {
					const eventId = item.dataset.eventId;
					window.location.href = `events.html?eventId=${eventId}`;
				}
			});
		});
		container.querySelectorAll('.sidebar-interest-btn').forEach(btn => {
			btn.addEventListener('click', (e) => {
				e.stopPropagation();
				const eventId = parseInt(btn.dataset.eventId);
				handleSidebarEventInteraction(eventId);
			});
		});
	}
}

function createSidebarEventItem(event) {
	const isAlumni = authSystem.isAlumni();
	const eventDate = new Date(event.date);
	const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	const statusColor = { upcoming: 'text-green-600', current: 'text-blue-600', past: 'text-gray-600' }[event.category] || 'text-gray-600';
	return `
		<div class="sidebar-event-item flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100" data-event-id="${event.id}">
			<img src="${event.image}" alt="${event.title}" class="w-12 h-9 object-cover rounded flex-shrink-0">
			<div class="flex-1 min-w-0">
				<h4 class="font-medium text-sm text-gray-900 truncate">${event.title}</h4>
				<div class="flex items-center space-x-2 mt-1">
					<span class="text-xs ${statusColor}">
						<i class="fas fa-calendar-alt mr-1"></i>
						${formattedDate}
					</span>
					<span class="text-xs text-gray-500">
						<i class="fas fa-clock mr-1"></i>
						${event.time}
					</span>
				</div>
				<div class="flex items-center justify-between mt-2">
					<span class="text-xs text-gray-500">
						<i class="fas fa-users mr-1"></i>
						${event.attendees}/${event.maxAttendees}
					</span>
					<div class="flex space-x-1">
						<button class="sidebar-interest-btn px-2 py-1 text-xs rounded ${event.isInterested ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'} hover:bg-blue-200 transition-colors"
								data-event-id="${event.id}">
							<i class="fas fa-star mr-1"></i>
							${event.isInterested ? 'Registered' : 'Interested'}
						</button>
						${isAlumni && event.category !== 'past' ? `
							<button class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
								<i class="fas fa-handshake mr-1"></i>
								Join
							</button>
						` : ''}
					</div>
				</div>
			</div>
		</div>
	`;
}

function setupMiniEventGallery() {
	const galleryImages = [
		"https://images.unsplash.com/photo-1511578314322-379afb476865?w=100&h=80&q=80&fit=crop",
		"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=80&q=80&fit=crop",
		"https://images.unsplash.com/photo-1556761175-b413da4baf72?w=100&h=80&q=80&fit=crop",
		"https://images.unsplash.com/photo-1519750157634-b6d493a0f908?w=100&h=80&q=80&fit=crop",
		"https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&h=80&q=80&fit=crop",
		"https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=100&h=80&q=80&fit=crop"
	];
	const container = document.getElementById('miniEventGallery');
	if (container) {
		container.innerHTML = galleryImages.slice(0, 6).map(image => `
			<div class="aspect-square overflow-hidden rounded cursor-pointer hover:opacity-80 transition-opacity" onclick="window.location.href='gallery.html'">
				<img src="${image}" alt="Event photo" class="w-full h-full object-cover hover:scale-105 transition-transform">
			</div>
		`).join('');
	}
}

function setupSidebarEventListeners() {
	const prevBtn = document.getElementById('miniPrevSlide');
	const nextBtn = document.getElementById('miniNextSlide');
	if (prevBtn) {
		prevBtn.addEventListener('click', () => {
			currentMiniSlide = currentMiniSlide === 0 ? 2 : currentMiniSlide - 1;
			updateMiniSlideshow();
		});
	}
	if (nextBtn) {
		nextBtn.addEventListener('click', () => {
			currentMiniSlide = (currentMiniSlide + 1) % 3;
			updateMiniSlideshow();
		});
	}
	setInterval(() => {
		currentMiniSlide = (currentMiniSlide + 1) % 3;
		updateMiniSlideshow();
	}, 4000);
}

function updateMiniSlideshow() {
	const slideshow = document.getElementById('miniSlideshow');
	if (slideshow) {
		slideshow.style.transform = `translateX(-${currentMiniSlide * 100}%)`;
	}
}

function handleSidebarEventInteraction(eventId) {
	const button = document.querySelector(`.sidebar-interest-btn[data-event-id="${eventId}"]`);
	if (button) {
		const isCurrentlyInterested = button.classList.contains('bg-blue-100');
		if (isCurrentlyInterested) {
			button.classList.remove('bg-blue-100', 'text-blue-700');
			button.classList.add('bg-gray-100', 'text-gray-600');
			button.innerHTML = '<i class="fas fa-star mr-1"></i>Interested';
			authSystem.showSuccessMessage('Removed from interested events');
		} else {
			button.classList.remove('bg-gray-100', 'text-gray-600');
			button.classList.add('bg-blue-100', 'text-blue-700');
			button.innerHTML = '<i class="fas fa-star mr-1"></i>Registered';
			authSystem.showSuccessMessage('Added to interested events!');
		}
	}
}

function populateEvents() {
	const containers = document.querySelectorAll('.bg-white.rounded-lg.border.border-gray-200 .p-4.space-y-3');
	const eventsContainer = containers[3];
	if (!eventsContainer) return;
	events.forEach(event => {
		const eventElement = document.createElement('div');
		eventElement.className = 'p-4 border border-gray-100 rounded-lg hover:border-indigo-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg';
		const eventDate = new Date(event.date);
		const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
		const categoryColors = { networking: 'from-blue-400 to-blue-600', educational: 'from-green-400 to-green-600', competition: 'from-red-400 to-red-600', career: 'from-purple-400 to-purple-600', mentorship: 'from-orange-400 to-orange-600' };
		const categoryTextColors = { networking: 'text-blue-700 bg-blue-100 border-blue-200', educational: 'text-green-700 bg-green-100 border-green-200', competition: 'text-red-700 bg-red-100 border-red-200', career: 'text-purple-700 bg-purple-100 border-purple-200', mentorship: 'text-orange-700 bg-orange-100 border-orange-200' };
		eventElement.innerHTML = `
			<div class="flex items-start space-x-4">
				<div class="w-12 h-12 bg-gradient-to-br ${categoryColors[event.category]} rounded-lg flex flex-col items-center justify-center text-white shadow-md transition-all duration-300 hover:rotate-6 hover:scale-110">
					<span class="text-xs font-bold">${formattedDate.split(' ')[0].toUpperCase()}</span>
					<span class="text-sm font-bold">${formattedDate.split(' ')[1]}</span>
				</div>
				<div class="flex-1">
					<h3 class="font-bold text-gray-900 text-sm mb-1 transition-colors duration-200 hover:text-indigo-600">${event.title}</h3>
					<p class="text-gray-500 text-xs mb-1 font-medium">${event.time}</p>
					<p class="text-gray-500 text-xs mb-3">${event.location}</p>
					<div class="flex items-center justify-between">
						<span class="px-3 py-1 ${categoryTextColors[event.category]} border rounded text-xs font-medium transition-all duration-200 hover:shadow-sm">${event.category}</span>
						<span class="text-xs text-gray-400 font-medium">${event.attendees} attending</span>
					</div>
				</div>
			</div>
		`;
		eventsContainer.appendChild(eventElement);
	});
}

function setupEventListeners() {
	const searchInput = document.querySelector('input[placeholder="Search..."]');
	if (searchInput) {
		searchInput.addEventListener('input', function(e) {
			const query = e.target.value.toLowerCase();
			console.log('Searching for:', query);
		});
	}
	const sortButtons = document.querySelectorAll('.px-3.py-1.text-sm');
	sortButtons.forEach(button => {
		button.addEventListener('click', function() {
			sortButtons.forEach(btn => {
				btn.classList.remove('text-gray-900');
				btn.classList.add('text-gray-400');
			});
			this.classList.remove('text-gray-400');
			this.classList.add('text-gray-900');
		});
	});
	const donateButtons = document.querySelectorAll('.donation-btn');
	donateButtons.forEach(button => {
		button.addEventListener('click', function() {
			this.classList.add('animate-pulse');
			setTimeout(() => { this.classList.remove('animate-pulse'); }, 1000);
			alert('Thank you for your interest in supporting our community! 🎓💙');
		});
	});
	const createPostInput = document.querySelector('input[placeholder="Share something..."]');
	if (createPostInput) {
		createPostInput.addEventListener('keypress', function(e) {
			if (e.key === 'Enter' && this.value.trim()) {
				createPost(this.value.trim());
				this.value = '';
			}
		});
	}
	const postButton = document.querySelector('button:contains("Post")');
	if (postButton) {
		postButton.addEventListener('click', function() {
			const input = document.querySelector('input[placeholder="Share something..."]');
			if (input && input.value.trim()) {
				createPost(input.value.trim());
				input.value = '';
			}
		});
	}
	document.addEventListener('click', function(e) {
		if (e.target.closest('.fa-heart')) {
			const button = e.target.closest('button');
			const icon = button.querySelector('i');
			if (icon.classList.contains('far')) {
				icon.classList.remove('far');
				icon.classList.add('fas');
				button.classList.add('text-red-500');
				button.style.transform = 'scale(1.2)';
				setTimeout(() => { button.style.transform = 'scale(1)'; }, 200);
			} else {
				icon.classList.remove('fas');
				icon.classList.add('far');
				button.classList.remove('text-red-500');
			}
		}
		if (e.target.closest('.cursor-pointer')) {
			const element = e.target.closest('.cursor-pointer');
			element.style.transform = 'scale(0.98)';
			setTimeout(() => { element.style.transform = 'scale(1)'; }, 100);
		}
	});
	setTimeout(() => {
		const statsElements = document.querySelectorAll('.text-lg.font-bold');
		statsElements.forEach(element => {
			if (element.textContent.includes('₹')) {
				animateNumber(element, 2300000, '₹', 'M+');
			}
		});
	}, 1000);
}

function createPost(content) {
	const feedContainer = document.getElementById('feed-container');
	if (!feedContainer) return;
	const newPost = { author: "You", type: "student", avatar: "YU", time: "Just now", content, image: null, imageCaption: null, likes: 0, comments: 0, shares: 0, tags: [] };
	const postElement = document.createElement('div');
	postElement.className = 'bg-white rounded-lg border border-gray-200 p-0 hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden';
	postElement.innerHTML = `
		<div class="p-6 pb-4">
			<div class="flex items-start space-x-4">
				<div class="w-12 h-12 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full flex items-center justify-center text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-110">${newPost.avatar}</div>
				<div class="flex-1">
					<div class="flex items-center space-x-2 mb-2">
						<h3 class="font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 cursor-pointer">${newPost.author}</h3>
						<span class="px-3 py-1 text-xs rounded bg-green-100 text-green-700 border border-green-200 font-semibold transition-all duration-200 hover:shadow-sm">${newPost.type}</span>
						<span class="text-gray-400 text-sm">•</span>
						<span class="text-gray-500 text-sm">${newPost.time}</span>
					</div>
					<p class="text-gray-800 mb-4 leading-relaxed">${newPost.content}</p>
				</div>
			</div>
		</div>
		<div class="p-6 pt-4 border-t border-gray-100">
			<div class="flex items-center space-x-6">
				<button class="post-action"><i class="far fa-heart"></i><span>${newPost.likes}</span></button>
				<button class="post-action"><i class="far fa-comment"></i><span>${newPost.comments}</span></button>
				<button class="post-action"><i class="far fa-share-square"></i><span>${newPost.shares}</span></button>
				<div class="flex-1"></div>
				<button class="post-action"><i class="fas fa-bookmark"></i></button>
			</div>
		</div>
	`;
	feedContainer.insertBefore(postElement, feedContainer.firstChild);
}

function animateNumber(element, targetNumber, prefix = '', suffix = '') {
	let startNumber = 0;
	const increment = targetNumber / 100;
	const timer = setInterval(() => {
		startNumber += increment;
		if (startNumber >= targetNumber) {
			startNumber = targetNumber;
			clearInterval(timer);
		}
		let displayNumber = Math.floor(startNumber);
		if (targetNumber >= 1000000) {
			displayNumber = (displayNumber / 1000000).toFixed(1);
		} else if (targetNumber >= 1000) {
			displayNumber = (displayNumber / 1000).toFixed(0) + 'K';
		}
		element.textContent = prefix + displayNumber + suffix;
	}, 30);
}

class NotificationManager {
	constructor() {
		this.notifications = [
			{ id: 1, title: "Event Reminder", message: "Spring Networking Mixer is tomorrow at 6:00 PM", type: "event", time: "2 hours ago", read: false },
			{ id: 2, title: "New Connection", message: "Sarah Wilson accepted your connection request", type: "connection", time: "1 day ago", read: false },
			{ id: 3, title: "Scholarship Update", message: "New scholarship opportunities available for students", type: "scholarship", time: "3 days ago", read: true }
		];
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this.setupNotificationSystem());
		} else {
			setTimeout(() => this.setupNotificationSystem(), 1000);
		}
	}
	setupNotificationSystem() {
		this.createNotificationDropdown();
		this.updateNotificationBadge();
	}
	createNotificationDropdown() {
		const notificationButton = document.querySelector('button i.fa-bell');
		if (!notificationButton) return;
		const buttonElement = notificationButton.parentElement;
		buttonElement.addEventListener('click', (e) => {
			e.stopPropagation();
			this.toggleNotificationDropdown();
		});
		const dropdown = document.createElement('div');
		dropdown.id = 'notificationDropdown';
		dropdown.className = 'absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 hidden z-50';
		dropdown.innerHTML = `
			<div class="p-4 border-b border-gray-100"><h3 class="text-lg font-semibold text-gray-900">Notifications</h3></div>
			<div class="max-h-80 overflow-y-auto">${this.notifications.map(notification => this.createNotificationItem(notification)).join('')}</div>
			<div class="p-3 border-t border-gray-100 text-center"><a href="#" class="text-blue-600 hover:text-blue-700 text-sm font-medium">View All Notifications</a></div>`;
		buttonElement.parentElement.classList.add('relative');
		buttonElement.parentElement.appendChild(dropdown);
		document.addEventListener('click', () => { dropdown.classList.add('hidden'); });
		dropdown.addEventListener('click', (e) => e.stopPropagation());
	}
	createNotificationItem(notification) {
		const iconClass = { event: 'fa-calendar-alt text-blue-500', connection: 'fa-user-plus text-green-500', scholarship: 'fa-graduation-cap text-purple-500' }[notification.type] || 'fa-bell text-gray-500';
		return `
			<div class="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${notification.read ? '' : 'bg-blue-50'}">
				<div class="flex items-start space-x-3">
					<div class="flex-shrink-0"><i class="fas ${iconClass} text-lg"></i></div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900 truncate">${notification.title}</p>
						<p class="text-sm text-gray-500 mt-1">${notification.message}</p>
						<p class="text-xs text-gray-400 mt-1">${notification.time}</p>
					</div>
					${!notification.read ? '<div class="w-2 h-2 bg-blue-500 rounded-full"></div>' : ''}
				</div>
			</div>`;
	}
	toggleNotificationDropdown() {
		const dropdown = document.getElementById('notificationDropdown');
		if (dropdown) dropdown.classList.toggle('hidden');
	}
	updateNotificationBadge() {
		const unreadCount = this.notifications.filter(n => !n.read).length;
		const badge = document.querySelector('button i.fa-bell + span');
		if (badge && unreadCount > 0) badge.style.display = 'block';
		else if (badge && unreadCount === 0) badge.style.display = 'none';
	}
	addNotification(notification) {
		this.notifications.unshift({ id: Date.now(), ...notification, time: 'Just now', read: false });
		this.updateNotificationBadge();
		if (window.authSystem) {
			authSystem.showSuccessMessage(`New notification: ${notification.title}`);
		}
	}
}

setTimeout(() => {
	if (window.authSystem && authSystem.isLoggedIn()) {
		window.notificationManager = new NotificationManager();
	}
}, 2000);