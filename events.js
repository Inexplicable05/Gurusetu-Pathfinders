// Events Page JavaScript for GuruSetu

class EventsManager {
    constructor() {
        this.currentSlide = 0;
        this.currentFilter = 'all';
        this.events = [];
        this.previousEvents = [];
        this.featuredAlumni = [];
        this.eventGallery = [];
        
        document.addEventListener('DOMContentLoaded', () => {
            this.checkAuthAndInitialize();
        });
    }

    checkAuthAndInitialize() {
        const authLoader = document.getElementById('authLoader');
        const mainApp = document.getElementById('mainApp');
        
        if (!window.authSystem || !authSystem.isLoggedIn()) {
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
            return;
        }
        
        authLoader.style.display = 'none';
        mainApp.style.display = 'block';
        
        this.initializeEvents();
    }

    initializeEvents() {
        this.setupUserInterface();
        this.loadEventData();
        this.setupEventListeners();
        // Apply filter from URL if present before rendering
        const urlParams = new URLSearchParams(window.location.search);
        const filter = urlParams.get('filter');
        if (filter && ['all','upcoming','current','past'].includes(filter)) {
            this.currentFilter = filter;
            // update button UI after DOM renders
            setTimeout(() => {
                const buttons = document.querySelectorAll('.event-filter');
                buttons.forEach(btn => {
                    if (btn.dataset.filter === filter) {
                        buttons.forEach(b => b.classList.remove('active', 'bg-blue-600', 'text-white'));
                        buttons.forEach(b => b.classList.add('bg-gray-200', 'text-gray-700'));
                        btn.classList.add('active', 'bg-blue-600', 'text-white');
                        btn.classList.remove('bg-gray-200', 'text-gray-700');
                    }
                });
            }, 0);
        }
        this.renderSlideshow();
        this.renderFeaturedAlumni();
        this.renderEventGallery();
        this.renderEvents();
        
        // Check if we need to open a specific event
        this.checkForDirectEventAccess();
    }

    checkForDirectEventAccess() {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('eventId');
        
        if (eventId) {
            // Small delay to ensure the page is fully rendered
            setTimeout(() => {
                this.openEventModal(parseInt(eventId));
            }, 500);
        }
    }

    setupUserInterface() {
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
        
        // Show/hide donation buttons based on user type
        const donationSection = document.getElementById('donationSection');
        const mobileDonationSection = document.getElementById('mobileDonationSection');
        
        if (authSystem.isStudent()) {
            // Hide donation buttons for students
            if (donationSection) donationSection.style.display = 'none';
            if (mobileDonationSection) mobileDonationSection.style.display = 'none';
        } else {
            // Show donation buttons for alumni
            if (donationSection) donationSection.style.display = 'flex';
            if (mobileDonationSection) mobileDonationSection.style.display = 'block';
        }
        
        this.setupUserMenu();
    }

    setupUserMenu() {
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

    loadEventData() {
        // Previous events for slideshow
        this.previousEvents = [
            {
                id: 1,
                title: "Alumni Homecoming 2024",
                image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
                date: "March 15, 2024",
                attendees: 500
            },
            {
                id: 2,
                title: "Tech Innovation Summit",
                image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
                date: "February 20, 2024",
                attendees: 300
            },
            {
                id: 3,
                title: "Career Fair 2024",
                image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
                date: "January 10, 2024",
                attendees: 800
            },
            {
                id: 4,
                title: "Annual Sports Meet",
                image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
                date: "December 5, 2023",
                attendees: 600
            }
        ];

        // Past Attendees
        this.featuredAlumni = [
            {
                name: "Aarav Sharma",
                company: "Google India",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop",
                graduationYear: 2018
            },
            {
                name: "Priya Verma",
                company: "Microsoft India",
                image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=128&h=128&fit=crop",
                graduationYear: 2017
            },
            {
                name: "Neha Iyer",
                company: "Apple India",
                image: "https://images.unsplash.com/photo-1544005313-3b3c8f3a5f50?w=128&h=128&fit=crop",
                graduationYear: 2019
            },
            {
                name: "Rohit Gupta",
                company: "Tesla India",
                image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=128&h=128&fit=crop",
                graduationYear: 2016
            },
            {
                name: "Ananya Singh",
                company: "Amazon India",
                image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=128&h=128&fit=crop",
                graduationYear: 2020
            },
            {
                name: "Kunal Mehta",
                company: "Meta India",
                image: "https://images.unsplash.com/photo-1541534401786-2077eed87a74?w=128&h=128&fit=crop",
                graduationYear: 2015
            }
        ];

        // Event gallery images
        this.eventGallery = [
            "https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&q=80",
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80",
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&q=80",
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&q=80",
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&q=80",
            "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&q=80",
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=300&q=80",
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&q=80",
            "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&q=80",
            "https://images.unsplash.com/photo-1519750157634-b6d493a0f908?w=300&q=80",
            "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=300&q=80",
            "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=300&q=80"
        ];

        // Events data
        this.events = [
            {
                id: 1,
                title: "Spring Networking Mixer",
                description: "Join us for an evening of networking, great food, and meaningful connections with fellow alumni and current students.",
                image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80",
                date: "2025-04-15",
                time: "6:00 PM - 9:00 PM",
                location: "Grand Ballroom, Hotel Meridien",
                address: "123 University Avenue, City Center",
                category: "upcoming",
                hostingCommittee: "Alumni Relations Committee",
                maxAttendees: 150,
                currentAttendees: 89,
                isRegistered: false,
                interestedCount: 45,
                tags: ["Networking", "Professional", "Food & Drinks"],
                speakers: ["Rahul Khanna - CEO, TechCorp India", "Meera Nair - VP, InnovateCo"]
            },
            {
                id: 2,
                title: "Innovation Workshop Series",
                description: "A hands-on workshop focusing on emerging technologies and startup methodologies. Perfect for entrepreneurs and tech enthusiasts.",
                image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
                date: "2025-05-20",
                time: "2:00 PM - 6:00 PM",
                location: "Innovation Lab, Main Campus",
                address: "456 Tech Boulevard, University District",
                category: "upcoming",
                hostingCommittee: "Tech Alumni Network",
                maxAttendees: 80,
                currentAttendees: 62,
                isRegistered: true,
                interestedCount: 38,
                tags: ["Technology", "Workshop", "Innovation"],
                speakers: ["Dr. Neha Iyer - AI Researcher", "Arjun Saini - Serial Entrepreneur"]
            },
            {
                id: 3,
                title: "Annual Scholarship Gala",
                description: "Our premier fundraising event supporting student scholarships and academic programs. Black-tie optional.",
                image: "https://images.unsplash.com/photo-1519750157634-b6d493a0f908?w=400&q=80",
                date: "2025-06-10",
                time: "7:00 PM - 11:00 PM",
                location: "University Grand Hall",
                address: "789 Campus Drive, University Center",
                category: "upcoming",
                hostingCommittee: "Scholarship Foundation",
                maxAttendees: 300,
                currentAttendees: 245,
                isRegistered: false,
                interestedCount: 78,
                tags: ["Fundraising", "Gala", "Scholarships"],
                speakers: ["University President", "Alumni Board Chair"]
            },
            {
                id: 4,
                title: "Career Mentorship Program Launch",
                description: "Currently running program connecting alumni mentors with current students for career guidance and professional development.",
                image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&q=80",
                date: "2025-03-01",
                time: "Ongoing Program",
                location: "Virtual & On-Campus",
                address: "Multiple Locations",
                category: "current",
                hostingCommittee: "Career Services",
                maxAttendees: 500,
                currentAttendees: 387,
                isRegistered: true,
                interestedCount: 156,
                tags: ["Mentorship", "Career", "Students"],
                speakers: ["Career Services Director", "Senior Alumni Mentors"]
            },
            {
                id: 5,
                title: "Alumni Homecoming Weekend",
                description: "A weekend filled with campus tours, reunion dinners, sports events, and celebration of our shared heritage.",
                image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80",
                date: "2024-10-15",
                time: "All Day Event",
                location: "Main Campus",
                address: "University Campus, Multiple Venues",
                category: "past",
                hostingCommittee: "Alumni Association",
                maxAttendees: 1000,
                currentAttendees: 892,
                isRegistered: false,
                interestedCount: 234,
                tags: ["Homecoming", "Reunion", "Sports"],
                speakers: ["Alumni Association President", "Class Representatives"]
            },
            {
                id: 6,
                title: "Entrepreneurship Panel Discussion",
                description: "Successful alumni entrepreneurs share their journey, challenges, and advice for aspiring business owners.",
                image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&q=80",
                date: "2024-11-20",
                time: "3:00 PM - 5:00 PM",
                location: "Business School Auditorium",
                address: "321 Business Avenue, Campus East",
                category: "past",
                hostingCommittee: "Business Alumni Network",
                maxAttendees: 200,
                currentAttendees: 165,
                isRegistered: false,
                interestedCount: 87,
                tags: ["Entrepreneurship", "Panel", "Business"],
                speakers: ["Aarav Sharma - Startup Founder", "Ritika Malhotra - Venture Capitalist"]
            }
        ];
    }

    setupEventListeners() {
        // Slideshow navigation
        document.getElementById('prevSlide').addEventListener('click', () => this.previousSlide());
        document.getElementById('nextSlide').addEventListener('click', () => this.nextSlide());
        
        // Auto-advance slideshow
        setInterval(() => this.nextSlide(), 5000);
        
        // Event filters
        const filterButtons = document.querySelectorAll('.event-filter');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Update active state
                filterButtons.forEach(btn => {
                    btn.classList.remove('active', 'bg-blue-600', 'text-white');
                    btn.classList.add('bg-gray-200', 'text-gray-700');
                });
                
                e.target.classList.add('active', 'bg-blue-600', 'text-white');
                e.target.classList.remove('bg-gray-200', 'text-gray-700');
                
                // Filter events
                this.currentFilter = e.target.dataset.filter;
                this.renderEvents();
            });
        });

        // Gallery navigation - View All Photos button
        const viewAllPhotosBtn = document.getElementById('viewAllPhotosBtn');
        if (viewAllPhotosBtn) {
            viewAllPhotosBtn.addEventListener('click', () => {
                window.location.href = 'gallery.html';
            });
        }
        
        // Load more events
        document.getElementById('loadMoreEvents').addEventListener('click', () => {
            // In a real app, this would load more events from the server
            console.log('Loading more events...');
        });
        
        // Close modal
        document.getElementById('eventModal').addEventListener('click', (e) => {
            if (e.target.id === 'eventModal') {
                this.closeEventModal();
            }
        });
    }

    renderSlideshow() {
        const slideshow = document.getElementById('slideshow');
        slideshow.innerHTML = this.previousEvents.map(event => `
            <div class="w-full flex-shrink-0 relative">
                <img src="${event.image}" alt="${event.title}" class="w-full h-64 md:h-80 object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                    <div class="p-6 text-white">
                        <h3 class="text-2xl font-bold mb-2">${event.title}</h3>
                        <p class="text-sm opacity-90">${event.date} • ${event.attendees} attendees</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderFeaturedAlumni() {
        const container = document.getElementById('featuredAlumni');
        container.innerHTML = this.featuredAlumni.map(alumni => `
            <div class="text-center group cursor-pointer">
                <img src="${alumni.image}" alt="${alumni.name}" 
                     class="w-16 h-16 mx-auto rounded-full mb-2 group-hover:scale-105 transition-transform">
                <h4 class="text-sm font-medium text-gray-900">${alumni.name}</h4>
                <p class="text-xs text-gray-500">${alumni.company}</p>
                <p class="text-xs text-gray-400">Class of ${alumni.graduationYear}</p>
            </div>
        `).join('');
    }

    renderEventGallery() {
        const container = document.getElementById('eventGallery');
        container.innerHTML = this.eventGallery.slice(0, 12).map(image => `
            <div class="gallery-image aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
                <img src="${image}" alt="Event photo" class="w-full h-full object-cover hover:scale-105 transition-transform">
            </div>
        `).join('');

        // Add click listeners to gallery images
        container.querySelectorAll('.gallery-image').forEach(imageDiv => {
            imageDiv.addEventListener('click', () => {
                window.location.href = 'gallery.html';
            });
        });
    }

    renderEvents() {
        const container = document.getElementById('eventsContainer');
        let filteredEvents = this.events;
        
        if (this.currentFilter !== 'all') {
            filteredEvents = this.events.filter(event => event.category === this.currentFilter);
        }
        
        container.innerHTML = filteredEvents.map(event => this.createEventCard(event)).join('');
        
        // Add event listeners for event cards
        container.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const eventId = parseInt(card.dataset.eventId);
                    // Navigate to individual event page
                    window.location.href = `event-details.html?id=${eventId}`;
                }
            });
        });
        
        // Add event listeners for interest/participation buttons
        container.querySelectorAll('.interest-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const eventId = parseInt(btn.dataset.eventId);
                const action = btn.dataset.action;
                this.handleEventInteraction(eventId, action);
            });
        });
    }

    createEventCard(event) {
        const currentUser = authSystem.getCurrentUser();
        const isAlumni = authSystem.isAlumni();
        const statusClass = event.category === 'upcoming' ? 'bg-green-100 text-green-800' :
                           event.category === 'current' ? 'bg-blue-100 text-blue-800' :
                           'bg-gray-100 text-gray-800';
        
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        return `
            <div class="event-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" data-event-id="${event.id}">
                <img src="${event.image}" alt="${event.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-3">
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">
                            ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                        </span>
                        <div class="flex space-x-1">
                            ${event.tags.map(tag => `
                                <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <h3 class="text-xl font-bold text-gray-900 mb-2">${event.title}</h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-2">${event.description}</p>
                    
                    <div class="space-y-2 text-sm text-gray-500">
                        <div class="flex items-center">
                            <i class="fas fa-calendar mr-2"></i>
                            <span>${formattedDate}</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-clock mr-2"></i>
                            <span>${event.time}</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-map-marker-alt mr-2"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-users mr-2"></i>
                            <span>${event.currentAttendees}/${event.maxAttendees} attendees</span>
                        </div>
                    </div>
                    
                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-500">${event.interestedCount} interested</span>
                            <div class="flex space-x-2">
                                <button class="interest-btn px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                        data-event-id="${event.id}" data-action="interested">
                                    <i class="fas fa-star mr-1"></i>
                                    ${event.isRegistered ? 'Registered' : 'Interested'}
                                </button>
                                ${isAlumni && event.category !== 'past' ? `
                                    <button class="interest-btn px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                            data-event-id="${event.id}" data-action="participate">
                                        <i class="fas fa-handshake mr-1"></i>
                                        Be a Part
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    handleEventInteraction(eventId, action) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;
        
        if (action === 'interested') {
            event.isRegistered = !event.isRegistered;
            if (event.isRegistered) {
                event.interestedCount++;
                authSystem.showSuccessMessage('You are now registered for this event!');
            } else {
                event.interestedCount--;
                authSystem.showSuccessMessage('Registration cancelled.');
            }
        } else if (action === 'participate') {
            authSystem.showSuccessMessage('Thank you for volunteering to be part of this event!');
        }
        
        this.renderEvents();
    }

    openEventModal(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;
        
        const modal = document.getElementById('eventModal');
        const modalContent = document.getElementById('eventModalContent');
        
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        modalContent.innerHTML = `
            <div class="relative">
                <button onclick="eventsManager.closeEventModal()" class="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100">
                    <i class="fas fa-times"></i>
                </button>
                
                <img src="${event.image}" alt="${event.title}" class="w-full h-64 object-cover">
                
                <div class="p-6">
                    <div class="mb-4">
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${
                            event.category === 'upcoming' ? 'bg-green-100 text-green-800' :
                            event.category === 'current' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }">
                            ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                        </span>
                    </div>
                    
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">${event.title}</h2>
                    
                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 class="font-semibold text-gray-900 mb-3">Event Details</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex items-center">
                                    <i class="fas fa-calendar w-4 mr-3 text-gray-400"></i>
                                    <span>${formattedDate}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-clock w-4 mr-3 text-gray-400"></i>
                                    <span>${event.time}</span>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-map-marker-alt w-4 mr-3 text-gray-400 mt-1"></i>
                                    <div>
                                        <div>${event.location}</div>
                                        <div class="text-gray-500">${event.address}</div>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-users w-4 mr-3 text-gray-400"></i>
                                    <span>${event.currentAttendees}/${event.maxAttendees} attendees</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-building w-4 mr-3 text-gray-400"></i>
                                    <span>${event.hostingCommittee}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 class="font-semibold text-gray-900 mb-3">Speakers</h3>
                            <ul class="text-sm space-y-1">
                                ${event.speakers.map(speaker => `
                                    <li class="flex items-center">
                                        <i class="fas fa-microphone w-4 mr-3 text-gray-400"></i>
                                        ${speaker}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <h3 class="font-semibold text-gray-900 mb-3">Description</h3>
                        <p class="text-gray-700 leading-relaxed">${event.description}</p>
                    </div>
                    
                    <div class="mb-6">
                        <h3 class="font-semibold text-gray-900 mb-3">Tags</h3>
                        <div class="flex flex-wrap gap-2">
                            ${event.tags.map(tag => `
                                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    ${event.category !== 'past' ? `
                        <div class="flex space-x-4 pt-4 border-t">
                            <button class="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                <i class="fas fa-star mr-2"></i>
                                ${event.isRegistered ? 'Registered' : 'Register Interest'}
                            </button>
                            ${authSystem.isAlumni() ? `
                                <button class="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
                                    <i class="fas fa-handshake mr-2"></i>
                                    Be a Part
                                </button>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
    }

    closeEventModal() {
        document.getElementById('eventModal').classList.add('hidden');
        
        // Clear URL parameters if they exist
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('eventId')) {
            // Update URL without reloading the page
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.previousEvents.length;
        this.updateSlideshow();
    }

    previousSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.previousEvents.length - 1 : this.currentSlide - 1;
        this.updateSlideshow();
    }

    updateSlideshow() {
        const slideshow = document.getElementById('slideshow');
        slideshow.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
}

// Initialize events manager
const eventsManager = new EventsManager();