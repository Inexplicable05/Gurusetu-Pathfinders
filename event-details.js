// Individual Event Details Page JavaScript

class EventDetailsManager {
    constructor() {
        this.eventId = null;
        this.eventData = null;
        
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
        
        this.initializeEventDetails();
    }

    initializeEventDetails() {
        this.setupUserInterface();
        this.getEventIdFromUrl();
        this.loadEventData();
        this.renderEventDetails();
        this.renderRelatedEvents();
        this.setupEventListeners();
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
        }
        
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                authSystem.logout();
            });
        }
    }

    getEventIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        this.eventId = parseInt(urlParams.get('id'));
        
        if (!this.eventId) {
            // Redirect to events page if no ID provided
            window.location.href = 'events.html';
            return;
        }
    }

    loadEventData() {
        // This would normally come from a database/API
        const events = [
            {
                id: 1,
                title: "Spring Networking Mixer",
                description: "Join us for an evening of networking, great food, and meaningful connections with fellow alumni and current students. This event is designed to foster professional relationships and provide opportunities for mentorship, career advice, and collaborative partnerships.",
                fullDescription: "Our Spring Networking Mixer is the premier event for connecting our vibrant alumni community with current students. Whether you're looking to expand your professional network, find mentorship opportunities, or simply catch up with old friends, this event offers something for everyone.\n\nThe evening will feature:\n• Welcome reception with cocktails and hors d'oeuvres\n• Structured networking sessions by industry\n• Panel discussion with successful alumni entrepreneurs\n• Awards ceremony recognizing outstanding alumni achievements\n• Live music and entertainment\n• Photo booth and memorabilia corner\n\nDress code: Business casual to business formal. Parking is available in the hotel garage with validation provided at the event.",
                image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
                date: "2025-04-15",
                time: "6:00 PM - 9:00 PM",
                location: "Grand Ballroom, Hotel Meridien",
                address: "123 University Avenue, City Center, State 12345",
                category: "upcoming",
                hostingCommittee: "Alumni Relations Committee",
                maxAttendees: 150,
                currentAttendees: 89,
                interestedCount: 45,
                tags: ["Networking", "Professional", "Food & Drinks"],
                speakers: [
                    {
                        name: "John Doe",
                        title: "CEO, TechCorp",
                        bio: "Class of 2005, Computer Science. Built TechCorp from a startup to a Fortune 500 company.",
                        image: "https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff&size=80"
                    },
                    {
                        name: "Jane Smith", 
                        title: "VP of Innovation, InnovateCo",
                        bio: "Class of 2008, Business Administration. Leading innovation initiatives in sustainable technology.",
                        image: "https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff&size=80"
                    }
                ],
                schedule: [
                    { time: "6:00 PM", activity: "Registration & Welcome Reception" },
                    { time: "6:30 PM", activity: "Opening Remarks" },
                    { time: "7:00 PM", activity: "Networking Session by Industry" },
                    { time: "8:00 PM", activity: "Panel Discussion" },
                    { time: "8:30 PM", activity: "Awards Ceremony" },
                    { time: "9:00 PM", activity: "Closing & After-party" }
                ],
                requirements: [
                    "Valid student/alumni ID required",
                    "Business casual dress code",
                    "Registration required by April 10th",
                    "Under 21 wristbands available"
                ],
                contact: {
                    name: "Sarah Wilson",
                    email: "events@gurusetu.edu",
                    phone: "(555) 123-4567"
                }
            }
        ];

        this.eventData = events.find(event => event.id === this.eventId);
        
        if (!this.eventData) {
            // Event not found, redirect to events page
            window.location.href = 'events.html';
            return;
        }
    }

    renderEventDetails() {
        if (!this.eventData) return;

        // Update breadcrumb
        const breadcrumb = document.getElementById('breadcrumbEventTitle');
        if (breadcrumb) {
            breadcrumb.textContent = this.eventData.title;
        }

        // Update page title
        document.title = `${this.eventData.title} - GuruSetu`;

        const container = document.getElementById('eventDetailsContainer');
        const eventDate = new Date(this.eventData.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        const isAlumni = authSystem.isAlumni();
        const statusClass = this.eventData.category === 'upcoming' ? 'bg-green-100 text-green-800' :
                           this.eventData.category === 'current' ? 'bg-blue-100 text-blue-800' :
                           'bg-gray-100 text-gray-800';

        container.innerHTML = `
            <!-- Event Hero Image -->
            <div class="relative h-64 md:h-80">
                <img src="${this.eventData.image}" alt="${this.eventData.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div class="flex items-center space-x-3 mb-2">
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${statusClass}">
                            ${this.eventData.category.charAt(0).toUpperCase() + this.eventData.category.slice(1)}
                        </span>
                        <div class="flex space-x-1">
                            ${this.eventData.tags.map(tag => `
                                <span class="px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded text-xs">${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                    <h1 class="text-3xl md:text-4xl font-bold mb-2">${this.eventData.title}</h1>
                    <p class="text-lg opacity-90">${this.eventData.description}</p>
                </div>
            </div>

            <div class="p-8">
                <!-- Quick Info Cards -->
                <div class="grid md:grid-cols-4 gap-4 mb-8">
                    <div class="bg-blue-50 rounded-lg p-4 text-center">
                        <i class="fas fa-calendar text-blue-600 text-xl mb-2"></i>
                        <div class="font-semibold text-gray-900">${formattedDate}</div>
                        <div class="text-sm text-gray-600">${this.eventData.time}</div>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4 text-center">
                        <i class="fas fa-map-marker-alt text-green-600 text-xl mb-2"></i>
                        <div class="font-semibold text-gray-900">${this.eventData.location}</div>
                        <div class="text-sm text-gray-600">View Map</div>
                    </div>
                    <div class="bg-purple-50 rounded-lg p-4 text-center">
                        <i class="fas fa-users text-purple-600 text-xl mb-2"></i>
                        <div class="font-semibold text-gray-900">${this.eventData.currentAttendees}/${this.eventData.maxAttendees}</div>
                        <div class="text-sm text-gray-600">Attendees</div>
                    </div>
                    <div class="bg-orange-50 rounded-lg p-4 text-center">
                        <i class="fas fa-star text-orange-600 text-xl mb-2"></i>
                        <div class="font-semibold text-gray-900">${this.eventData.interestedCount}</div>
                        <div class="text-sm text-gray-600">Interested</div>
                    </div>
                </div>

                <!-- Action Buttons -->
                ${this.eventData.category !== 'past' ? `
                    <div class="flex flex-wrap gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                        <button class="flex-1 md:flex-none bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                            <i class="fas fa-star mr-2"></i>Register Interest
                        </button>
                        ${isAlumni ? `
                            <button class="flex-1 md:flex-none bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                                <i class="fas fa-handshake mr-2"></i>Be a Part
                            </button>
                        ` : ''}
                        <button class="flex-1 md:flex-none bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold">
                            <i class="fas fa-share mr-2"></i>Share Event
                        </button>
                        <button class="flex-1 md:flex-none border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                            <i class="fas fa-calendar-plus mr-2"></i>Add to Calendar
                        </button>
                    </div>
                ` : ''}

                <!-- Event Content Grid -->
                <div class="grid lg:grid-cols-3 gap-8">
                    <!-- Main Content -->
                    <div class="lg:col-span-2 space-y-8">
                        <!-- Full Description -->
                        <section>
                            <h2 class="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                            <div class="prose max-w-none text-gray-700 whitespace-pre-line">
                                ${this.eventData.fullDescription}
                            </div>
                        </section>

                        <!-- Event Schedule -->
                        <section>
                            <h2 class="text-2xl font-bold text-gray-900 mb-4">Event Schedule</h2>
                            <div class="space-y-3">
                                ${this.eventData.schedule.map(item => `
                                    <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                        <div class="flex-shrink-0 w-16 text-sm font-semibold text-blue-600">
                                            ${item.time}
                                        </div>
                                        <div class="flex-1 text-gray-900">
                                            ${item.activity}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </section>

                        <!-- Featured Speakers -->
                        <section>
                            <h2 class="text-2xl font-bold text-gray-900 mb-4">Featured Speakers</h2>
                            <div class="grid md:grid-cols-2 gap-6">
                                ${this.eventData.speakers.map(speaker => `
                                    <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                        <img src="${speaker.image}" alt="${speaker.name}" class="w-16 h-16 rounded-full">
                                        <div class="flex-1">
                                            <h3 class="font-semibold text-gray-900">${speaker.name}</h3>
                                            <p class="text-blue-600 text-sm mb-2">${speaker.title}</p>
                                            <p class="text-gray-600 text-sm">${speaker.bio}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    </div>

                    <!-- Sidebar -->
                    <div class="space-y-6">
                        <!-- Event Details -->
                        <div class="bg-gray-50 rounded-lg p-6">
                            <h3 class="font-semibold text-gray-900 mb-4">Event Details</h3>
                            <div class="space-y-3 text-sm">
                                <div class="flex items-start space-x-3">
                                    <i class="fas fa-map-marker-alt text-gray-400 mt-1"></i>
                                    <div>
                                        <div class="font-medium">${this.eventData.location}</div>
                                        <div class="text-gray-600">${this.eventData.address}</div>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <i class="fas fa-building text-gray-400"></i>
                                    <div>
                                        <div class="font-medium">Hosted by</div>
                                        <div class="text-gray-600">${this.eventData.hostingCommittee}</div>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <i class="fas fa-envelope text-gray-400"></i>
                                    <div>
                                        <div class="font-medium">Contact</div>
                                        <div class="text-gray-600">${this.eventData.contact.name}</div>
                                        <div class="text-blue-600">${this.eventData.contact.email}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Requirements -->
                        <div class="bg-yellow-50 rounded-lg p-6">
                            <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
                                <i class="fas fa-info-circle text-yellow-600 mr-2"></i>
                                Requirements
                            </h3>
                            <ul class="space-y-2 text-sm text-gray-700">
                                ${this.eventData.requirements.map(req => `
                                    <li class="flex items-start space-x-2">
                                        <i class="fas fa-check text-green-500 mt-1 flex-shrink-0"></i>
                                        <span>${req}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>

                        <!-- Map Placeholder -->
                        <div class="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                            <div class="text-center text-gray-500">
                                <i class="fas fa-map text-2xl mb-2"></i>
                                <div class="text-sm">Interactive Map</div>
                                <div class="text-xs">Click to view directions</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderRelatedEvents() {
        // This would normally fetch related events from database
        const relatedEvents = [
            {
                id: 2,
                title: "Innovation Workshop Series",
                image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80",
                date: "2025-05-20",
                category: "upcoming"
            },
            {
                id: 3,
                title: "Annual Scholarship Gala",
                image: "https://images.unsplash.com/photo-1519750157634-b6d493a0f908?w=300&q=80",
                date: "2025-06-10",
                category: "upcoming"
            }
        ];

        const container = document.getElementById('relatedEvents');
        container.innerHTML = relatedEvents.map(event => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" 
                 onclick="window.location.href='event-details.html?id=${event.id}'">
                <img src="${event.image}" alt="${event.title}" class="w-full h-32 object-cover">
                <div class="p-4">
                    <h3 class="font-semibold text-gray-900 mb-2">${event.title}</h3>
                    <p class="text-sm text-gray-600">
                        <i class="fas fa-calendar mr-1"></i>
                        ${new Date(event.date).toLocaleDateString()}
                    </p>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Add any additional event listeners here
    }
}

// Initialize event details manager
const eventDetailsManager = new EventDetailsManager();