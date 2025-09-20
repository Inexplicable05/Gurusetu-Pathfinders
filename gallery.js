// Professional Photo Gallery JavaScript
class PhotoGallery {
    constructor() {
        this.photos = [];
        this.filteredPhotos = [];
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.searchQuery = '';
        this.currentView = 'grid';
        this.photosPerPage = 12;
        this.currentPage = 1;
        this.currentPhotoIndex = 0;
        this.authSystem = window.authSystem;
        
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadSamplePhotos();
        this.setupEventListeners();
        this.setupUserProfile();
        this.renderPhotos();
        this.updateStats();
    }

    checkAuth() {
        if (!this.authSystem || !this.authSystem.isLoggedIn()) {
            window.location.href = 'login.html';
            return;
        }

        // Hide loader and show main app
        document.getElementById('authLoader').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
    }

    setupUserProfile() {
        const currentUser = this.authSystem.getCurrentUser();
        if (!currentUser) return;
        
        const userProfileImage = document.getElementById('userProfileImage');
        const userDisplayName = document.getElementById('userDisplayName');
        const dropdownUserName = document.getElementById('dropdownUserName');
        const dropdownUserType = document.getElementById('dropdownUserType');
        
        if (userProfileImage) userProfileImage.src = currentUser.profileImage;
        if (userDisplayName) userDisplayName.textContent = currentUser.fullName.split(' ')[0];
        if (dropdownUserName) dropdownUserName.textContent = currentUser.fullName;
        if (dropdownUserType) dropdownUserType.textContent = currentUser.accountType.charAt(0).toUpperCase() + currentUser.accountType.slice(1);
        
        // Show/hide donation buttons based on user type (no inline styles)
        const donationSection = document.getElementById('donationSection');
        const mobileDonationSection = document.getElementById('mobileDonationSection');
        const isStudent = this.authSystem.isStudent();

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
                this.authSystem.logout();
            });
        }
    }

    loadSamplePhotos() {
        // Sample photo data for the gallery
        this.photos = [
            {
                id: 1,
                title: "Opening Ceremony",
                description: "The grand opening of our Spring Networking Mixer with inspiring welcome speech",
                event: "Spring Networking Mixer 2024",
                category: "networking",
                imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop",
                date: "2024-03-15",
                photographer: "Sarah Johnson",
                likes: 45,
                tags: ["opening", "ceremony", "networking", "speech"]
            },
            {
                id: 2,
                title: "Tech Innovation Showcase",
                description: "Alumni presenting cutting-edge technology solutions and innovations",
                event: "Tech Alumni Conference 2024",
                category: "tech",
                imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
                date: "2024-02-20",
                photographer: "Mike Chen",
                likes: 67,
                tags: ["technology", "innovation", "presentation", "conference"]
            },
            {
                id: 3,
                title: "Networking Reception",
                description: "Alumni and students connecting over cocktails and meaningful conversations",
                event: "Spring Networking Mixer 2024",
                category: "networking",
                imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=400&fit=crop",
                date: "2024-03-15",
                photographer: "David Liu",
                likes: 38,
                tags: ["networking", "reception", "cocktails", "conversations"]
            },
            {
                id: 4,
                title: "Homecoming Parade",
                description: "Colorful parade celebrating our university spirit and alumni pride",
                event: "Alumni Homecoming Weekend",
                category: "homecoming",
                imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
                date: "2024-10-12",
                photographer: "Emily Rodriguez",
                likes: 92,
                tags: ["homecoming", "parade", "celebration", "spirit"]
            },
            {
                id: 5,
                title: "Fundraising Gala Dinner",
                description: "Elegant evening supporting student scholarships and academic programs",
                event: "Annual Scholarship Gala",
                category: "fundraising",
                imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=400&fit=crop",
                date: "2024-05-10",
                photographer: "Alexandra Kim",
                likes: 78,
                tags: ["gala", "fundraising", "dinner", "scholarship"]
            },
            {
                id: 6,
                title: "Workshop Session",
                description: "Interactive workshop on entrepreneurship and business development",
                event: "Entrepreneurship Workshop",
                category: "workshop",
                imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
                date: "2024-04-18",
                photographer: "James Wilson",
                likes: 34,
                tags: ["workshop", "entrepreneurship", "business", "interactive"]
            },
            {
                id: 7,
                title: "Panel Discussion",
                description: "Industry leaders sharing insights on career development and trends",
                event: "Tech Alumni Conference 2024",
                category: "tech",
                imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop",
                date: "2024-02-20",
                photographer: "Lisa Zhang",
                likes: 56,
                tags: ["panel", "discussion", "career", "industry", "leaders"]
            },
            {
                id: 8,
                title: "Student Awards Ceremony",
                description: "Celebrating outstanding student achievements and academic excellence",
                event: "Annual Student Awards",
                category: "networking",
                imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop",
                date: "2024-06-15",
                photographer: "Robert Taylor",
                likes: 89,
                tags: ["awards", "ceremony", "students", "excellence"]
            },
            {
                id: 9,
                title: "Campus Tour",
                description: "Alumni revisiting their alma mater and exploring new facilities",
                event: "Alumni Homecoming Weekend",
                category: "homecoming",
                imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&h=400&fit=crop",
                date: "2024-10-12",
                photographer: "Maria Garcia",
                likes: 42,
                tags: ["campus", "tour", "facilities", "nostalgia"]
            },
            {
                id: 10,
                title: "Charity Auction",
                description: "Exciting auction raising funds for community development projects",
                event: "Annual Scholarship Gala",
                category: "fundraising",
                imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
                date: "2024-05-10",
                photographer: "Kevin Park",
                likes: 71,
                tags: ["auction", "charity", "fundraising", "community"]
            },
            {
                id: 11,
                title: "Coding Bootcamp",
                description: "Intensive coding workshop for students interested in software development",
                event: "Tech Skills Workshop",
                category: "workshop",
                imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop",
                date: "2024-07-22",
                photographer: "Anna Chen",
                likes: 48,
                tags: ["coding", "bootcamp", "workshop", "software", "development"]
            },
            {
                id: 12,
                title: "Alumni Reunion Dinner",
                description: "Heartwarming reunion bringing together classmates from different decades",
                event: "Class Reunion Celebration",
                category: "networking",
                imageUrl: "https://images.unsplash.com/photo-1414016642750-7fdd78dc33d9?w=600&h=400&fit=crop",
                date: "2024-08-30",
                photographer: "Thomas Brown",
                likes: 95,
                tags: ["reunion", "dinner", "classmates", "celebration"]
            }
        ];

        this.filteredPhotos = [...this.photos];
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Sort functionality
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFilters();
            });
        }

        // Filter chips
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.applyFilters();
            });
        });

        // View toggle
        const gridView = document.getElementById('gridView');
        const listView = document.getElementById('listView');
        
        if (gridView) {
            gridView.addEventListener('click', () => {
                this.currentView = 'grid';
                gridView.classList.add('bg-blue-600', 'text-white');
                gridView.classList.remove('bg-white', 'text-gray-600');
                listView.classList.add('bg-white', 'text-gray-600');
                listView.classList.remove('bg-blue-600', 'text-white');
                this.renderPhotos();
            });
        }

        if (listView) {
            listView.addEventListener('click', () => {
                this.currentView = 'list';
                listView.classList.add('bg-blue-600', 'text-white');
                listView.classList.remove('bg-white', 'text-gray-600');
                gridView.classList.add('bg-white', 'text-gray-600');
                gridView.classList.remove('bg-blue-600', 'text-white');
                this.renderPhotos();
            });
        }

        // Load more button
        const loadMore = document.getElementById('loadMore');
        if (loadMore) {
            loadMore.addEventListener('click', () => {
                this.currentPage++;
                this.renderPhotos(true);
            });
        }

        // Clear filters
        const clearFilters = document.getElementById('clearFilters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // Reset search
        const resetSearch = document.getElementById('resetSearch');
        if (resetSearch) {
            resetSearch.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // Modal functionality
        this.setupModalListeners();
    }

    setupModalListeners() {
        const photoModal = document.getElementById('photoModal');
        const closeModal = document.getElementById('closeModal');
        const prevPhoto = document.getElementById('prevPhoto');
        const nextPhoto = document.getElementById('nextPhoto');

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                photoModal.classList.add('hidden');
            });
        }

        if (photoModal) {
            photoModal.addEventListener('click', (e) => {
                if (e.target === photoModal) {
                    photoModal.classList.add('hidden');
                }
            });
        }

        if (prevPhoto) {
            prevPhoto.addEventListener('click', () => {
                this.showPreviousPhoto();
            });
        }

        if (nextPhoto) {
            nextPhoto.addEventListener('click', () => {
                this.showNextPhoto();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!photoModal.classList.contains('hidden')) {
                switch(e.key) {
                    case 'Escape':
                        photoModal.classList.add('hidden');
                        break;
                    case 'ArrowLeft':
                        this.showPreviousPhoto();
                        break;
                    case 'ArrowRight':
                        this.showNextPhoto();
                        break;
                }
            }
        });
    }

    applyFilters() {
        this.filteredPhotos = this.photos.filter(photo => {
            // Apply category filter
            if (this.currentFilter !== 'all' && photo.category !== this.currentFilter) {
                return false;
            }

            // Apply search filter
            if (this.searchQuery) {
                const searchTerms = this.searchQuery.split(' ');
                return searchTerms.every(term => 
                    photo.title.toLowerCase().includes(term) ||
                    photo.description.toLowerCase().includes(term) ||
                    photo.event.toLowerCase().includes(term) ||
                    photo.tags.some(tag => tag.toLowerCase().includes(term))
                );
            }

            return true;
        });

        // Apply sorting
        this.filteredPhotos.sort((a, b) => {
            switch(this.currentSort) {
                case 'newest':
                    return new Date(b.date) - new Date(a.date);
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'event-name':
                    return a.event.localeCompare(b.event);
                case 'most-liked':
                    return b.likes - a.likes;
                default:
                    return 0;
            }
        });

        this.currentPage = 1;
        this.renderPhotos();
        this.updateFilterStatus();
    }

    renderPhotos(append = false) {
        const container = document.getElementById('galleryContainer');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.photosPerPage;
        const endIndex = startIndex + this.photosPerPage;
        const photosToShow = this.filteredPhotos.slice(startIndex, endIndex);

        if (!append) {
            container.innerHTML = '';
        }

        if (this.currentView === 'grid') {
            container.className = 'gallery-grid';
            photosToShow.forEach((photo, index) => {
                const photoCard = this.createPhotoCard(photo, startIndex + index);
                container.appendChild(photoCard);
            });
        } else {
            container.className = 'space-y-4';
            photosToShow.forEach((photo, index) => {
                const photoRow = this.createPhotoRow(photo, startIndex + index);
                container.appendChild(photoRow);
            });
        }

        // Update load more button visibility
        const loadMore = document.getElementById('loadMore');
        if (loadMore) {
            const hasMore = endIndex < this.filteredPhotos.length;
            loadMore.style.display = hasMore ? 'block' : 'none';
        }

        // Show/hide no results message
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.classList.toggle('hidden', this.filteredPhotos.length > 0);
        }

        // Update results count
        this.updateResultsCount();
    }

    createPhotoCard(photo, index) {
        const card = document.createElement('div');
        card.className = 'photo-card bg-white rounded-xl shadow-lg overflow-hidden';
        
        card.innerHTML = `
            <div class="relative h-full">
                <img src="${photo.imageUrl}" alt="${photo.title}" class="w-full h-full object-cover">
                <div class="photo-overlay">
                    <h3 class="font-semibold text-lg mb-1">${photo.title}</h3>
                    <p class="text-blue-200 text-sm mb-2">${photo.event}</p>
                    <p class="text-gray-300 text-xs">${this.formatDate(photo.date)} • ${photo.likes} likes</p>
                </div>
                
                <!-- Quick actions -->
                <div class="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors" title="Like">
                        <i class="far fa-heart text-sm"></i>
                    </button>
                    <button class="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors" title="Share">
                        <i class="fas fa-share text-sm"></i>
                    </button>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            this.openPhotoModal(photo, index);
        });

        return card;
    }

    createPhotoRow(photo, index) {
        const row = document.createElement('div');
        row.className = 'bg-white rounded-xl shadow-lg overflow-hidden flex cursor-pointer hover:shadow-xl transition-shadow';
        
        row.innerHTML = `
            <div class="w-48 h-32 flex-shrink-0">
                <img src="${photo.imageUrl}" alt="${photo.title}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 p-6">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h3 class="font-semibold text-lg text-gray-900 mb-1">${photo.title}</h3>
                        <p class="text-blue-600 text-sm mb-2">${photo.event}</p>
                        <p class="text-gray-600 text-sm mb-3 line-clamp-2">${photo.description}</p>
                        <div class="flex items-center space-x-4 text-xs text-gray-500">
                            <span>${this.formatDate(photo.date)}</span>
                            <span>By ${photo.photographer}</span>
                            <span>${photo.likes} likes</span>
                        </div>
                    </div>
                    
                    <div class="flex space-x-2 ml-4">
                        <button class="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Like">
                            <i class="far fa-heart text-red-500"></i>
                        </button>
                        <button class="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Share">
                            <i class="fas fa-share text-blue-500"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        row.addEventListener('click', () => {
            this.openPhotoModal(photo, index);
        });

        return row;
    }

    openPhotoModal(photo, index) {
        const modal = document.getElementById('photoModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalEvent = document.getElementById('modalEvent');
        const modalImage = document.getElementById('modalImage');
        const modalDescription = document.getElementById('modalDescription');
        const modalDate = document.getElementById('modalDate');
        const modalPhotographer = document.getElementById('modalPhotographer');

        if (modalTitle) modalTitle.textContent = photo.title;
        if (modalEvent) modalEvent.textContent = photo.event;
        if (modalImage) {
            modalImage.src = photo.imageUrl;
            modalImage.alt = photo.title;
        }
        if (modalDescription) modalDescription.textContent = photo.description;
        if (modalDate) modalDate.textContent = this.formatDate(photo.date);
        if (modalPhotographer) modalPhotographer.textContent = `Photo by ${photo.photographer}`;

        this.currentPhotoIndex = index;
        modal.classList.remove('hidden');
    }

    showPreviousPhoto() {
        const newIndex = this.currentPhotoIndex > 0 ? this.currentPhotoIndex - 1 : this.filteredPhotos.length - 1;
        this.openPhotoModal(this.filteredPhotos[newIndex], newIndex);
    }

    showNextPhoto() {
        const newIndex = this.currentPhotoIndex < this.filteredPhotos.length - 1 ? this.currentPhotoIndex + 1 : 0;
        this.openPhotoModal(this.filteredPhotos[newIndex], newIndex);
    }

    updateStats() {
        const totalPhotos = document.getElementById('totalPhotos');
        const totalEvents = document.getElementById('totalEvents');

        if (totalPhotos) {
            totalPhotos.textContent = this.photos.length;
        }

        if (totalEvents) {
            const uniqueEvents = [...new Set(this.photos.map(photo => photo.event))];
            totalEvents.textContent = uniqueEvents.length;
        }
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = this.filteredPhotos.length;
        }
    }

    updateFilterStatus() {
        const clearFilters = document.getElementById('clearFilters');
        const searchQuery = document.getElementById('searchQuery');
        
        const hasActiveFilters = this.currentFilter !== 'all' || this.searchQuery;
        
        if (clearFilters) {
            clearFilters.classList.toggle('hidden', !hasActiveFilters);
        }
        
        if (searchQuery) {
            if (this.searchQuery) {
                searchQuery.classList.remove('hidden');
                searchQuery.querySelector('span').textContent = this.searchQuery;
            } else {
                searchQuery.classList.add('hidden');
            }
        }
    }

    resetFilters() {
        // Reset all filters
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.currentSort = 'newest';
        this.currentPage = 1;

        // Update UI
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
            if (chip.dataset.filter === 'all') {
                chip.classList.add('active');
            }
        });

        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';

        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) sortSelect.value = 'newest';

        // Apply filters and render
        this.applyFilters();
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.photoGallery = new PhotoGallery();
});