// Authentication System for GuruSetu

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.initializeAuth();
    }

    initializeAuth() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('guruSetuUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }

        // Initialize form handlers
        this.initializeLoginForm();
        this.initializeRegisterForm();
        this.initializeAccountTypeTabs();
        this.initializePasswordToggle();
    }

    initializeLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    initializeRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            // Populate graduation years
            this.populateGraduationYears();
            
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
    }

    initializeAccountTypeTabs() {
        // Login page tabs
        const studentTab = document.getElementById('studentTab');
        const alumniTab = document.getElementById('alumniTab');
        
        // Register page tabs
        const studentTabReg = document.getElementById('studentTabReg');
        const alumniTabReg = document.getElementById('alumniTabReg');

        if (studentTab && alumniTab) {
            studentTab.addEventListener('click', () => this.switchAccountType('student', false));
            alumniTab.addEventListener('click', () => this.switchAccountType('alumni', false));
        }

        if (studentTabReg && alumniTabReg) {
            studentTabReg.addEventListener('click', () => this.switchAccountType('student', true));
            alumniTabReg.addEventListener('click', () => this.switchAccountType('alumni', true));
        }
    }

    switchAccountType(type, isRegister = false) {
        const suffix = isRegister ? 'Reg' : '';
        const studentBtn = document.getElementById(`studentTab${suffix}`);
        const alumniBtn = document.getElementById(`alumniTab${suffix}`);

        if (type === 'student') {
            studentBtn.classList.add('active');
            alumniBtn.classList.remove('active');
            
            if (isRegister) {
                document.getElementById('idField').querySelector('label').textContent = 'Student ID';
                document.getElementById('studentId').placeholder = 'Enter your student ID';
                document.getElementById('graduationYear').style.display = 'none';
                document.getElementById('currentRole').style.display = 'none';
                document.getElementById('gradYear').required = false;
            }
        } else {
            alumniBtn.classList.add('active');
            studentBtn.classList.remove('active');
            
            if (isRegister) {
                document.getElementById('idField').querySelector('label').textContent = 'Alumni ID';
                document.getElementById('studentId').placeholder = 'Enter your alumni ID';
                document.getElementById('graduationYear').style.display = 'block';
                document.getElementById('currentRole').style.display = 'block';
                document.getElementById('gradYear').required = true;
            }
        }
    }

    initializePasswordToggle() {
        const toggleButtons = document.querySelectorAll('[id^="togglePassword"]');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const input = button.previousElementSibling;
                const icon = button.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    populateGraduationYears() {
        const yearSelect = document.getElementById('gradYear');
        if (yearSelect) {
            const currentYear = new Date().getFullYear();
            for (let year = currentYear; year >= 1990; year--) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            }
        }
    }

    handleLogin() {
        const form = document.getElementById('loginForm');
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        // Find user by email only; respect stored accountType
        const user = this.users.find(u => u.email === email);
        
        if (user && user.password === password) {
            this.currentUser = user;
            localStorage.setItem('guruSetuUser', JSON.stringify(user));
            this.showSuccessMessage('Login successful! Redirecting...');
            
            // Redirect to main app
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            this.showErrorMessage('Invalid credentials. Please try again.');
        }
    }

    handleRegister() {
        const form = document.getElementById('registerForm');
        const formData = new FormData(form);
        
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        // Validate passwords match
        if (password !== confirmPassword) {
            this.showErrorMessage('Passwords do not match.');
            return;
        }

        // Validate password strength
        if (password.length < 8) {
            this.showErrorMessage('Password must be at least 8 characters long.');
            return;
        }

        const accountType = document.getElementById('studentTabReg').classList.contains('active') ? 'student' : 'alumni';
        
        const newUser = {
            id: Date.now(),
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            password: password,
            accountType: accountType,
            department: formData.get('department'),
            studentId: formData.get('studentId'),
            graduationYear: accountType === 'alumni' ? formData.get('gradYear') : null,
            currentRole: accountType === 'alumni' ? formData.get('jobTitle') : null,
            joinDate: new Date().toISOString(),
            profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.get('fullName'))}&background=3b82f6&color=fff`
        };

        // Check if user already exists
        if (this.users.find(u => u.email === newUser.email)) {
            this.showErrorMessage('An account with this email already exists.');
            return;
        }

        // Add user to database
        this.users.push(newUser);
        this.saveUsers();
        
        this.showSuccessMessage('Account created successfully! Redirecting to login...');
        
        // Redirect to login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }

    loadUsers() {
        const savedUsers = localStorage.getItem('guruSetuUsers');
        if (savedUsers) {
            const list = JSON.parse(savedUsers);
            // Ensure Sarah demo user exists
            if (!list.find(u => u.email === 'sarah@alumni.edu')) {
                list.push({
                    id: Date.now(),
                    fullName: 'Sarah Wilson',
                    email: 'sarah@alumni.edu',
                    password: 'alumni123',
                    accountType: 'alumni',
                    department: 'computer-science',
                    studentId: 'CS2016007',
                    graduationYear: 2016,
                    currentRole: 'Senior Engineer at Amazon India',
                    joinDate: new Date().toISOString(),
                    profileImage: 'https://images.unsplash.com/photo-1544005313-3b3c8f3a5f50?w=128&h=128&fit=crop'
                });
                this.saveUsers(list);
            }
            return list;
        }

        // Default demo users
        const defaultUsers = [
            {
                id: 1,
                fullName: 'Ravi Kumar',
                email: 'ravi@student.edu',
                password: 'student123',
                accountType: 'student',
                department: 'computer-science',
                studentId: 'CS2021001',
                graduationYear: null,
                currentRole: null,
                joinDate: new Date().toISOString(),
                profileImage: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=128&h=128&fit=crop'
            },
            {
                id: 2,
                fullName: 'Asha Menon',
                email: 'asha@alumni.edu',
                password: 'alumni123',
                accountType: 'alumni',
                department: 'computer-science',
                studentId: 'CS2018002',
                graduationYear: 2018,
                currentRole: 'Software Engineer at Google India',
                joinDate: new Date().toISOString(),
                profileImage: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=128&h=128&fit=crop'
            },
            {
                id: 3,
                fullName: 'Arjun Patel',
                email: 'arjun@alumni.edu',
                password: 'alumni123',
                accountType: 'alumni',
                department: 'business',
                studentId: 'BA2015003',
                graduationYear: 2015,
                currentRole: 'Product Manager at Microsoft India',
                joinDate: new Date().toISOString(),
                profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop'
            },
            {
                id: 4,
                fullName: 'Sarah Wilson',
                email: 'sarah@alumni.edu',
                password: 'alumni123',
                accountType: 'alumni',
                department: 'computer-science',
                studentId: 'CS2016007',
                graduationYear: 2016,
                currentRole: 'Senior Engineer at Amazon India',
                joinDate: new Date().toISOString(),
                profileImage: 'https://images.unsplash.com/photo-1544005313-3b3c8f3a5f50?w=128&h=128&fit=crop'
            }
        ];

        this.saveUsers(defaultUsers);
        return defaultUsers;
    }

    saveUsers(users = this.users) {
        localStorage.setItem('guruSetuUsers', JSON.stringify(users));
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    isAlumni() {
        return this.currentUser && this.currentUser.accountType === 'alumni';
    }

    isStudent() {
        return this.currentUser && this.currentUser.accountType === 'student';
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('guruSetuUser');
        window.location.href = 'login.html';
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.auth-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        // Animate in
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
}

// Initialize authentication system
const authSystem = new AuthSystem();

// Make auth system globally available
window.authSystem = authSystem;