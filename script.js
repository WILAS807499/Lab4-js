// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const loadUsersBtn = document.getElementById('loadUsersBtn');
const userList = document.getElementById('userList');
const contactForm = document.getElementById('contactForm');
const clockElement = document.getElementById('clock');
const loadingIndicator = document.getElementById('loadingIndicator');

// Theme Toggle Functionality
function setupThemeToggle() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            // Save preference to localStorage
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // Update button text
            themeToggle.textContent = isDark ? '🌞 Light Mode' : '🌙 Dark Mode';
        });

        // Set initial button text
        if (document.body.classList.contains('dark-theme')) {
            themeToggle.textContent = '🌞 Light Mode';
        } else {
            themeToggle.textContent = '🌙 Dark Mode';
        }
    }
}

// Fetch and Display Users
async function fetchUsers() {
    try {
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (loadUsersBtn) loadUsersBtn.disabled = true;
        
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const users = await response.json();
        
        if (userList) {
            userList.innerHTML = '';
            users.forEach(user => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="user-name">${user.name}</span>
                    <span class="user-email">${user.email}</span>
                    <span class="user-phone">${user.phone}</span>
                `;
                userList.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        if (userList) {
            userList.innerHTML = '<li class="error">Failed to load users. Please try again later.</li>';
        }
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (loadUsersBtn) loadUsersBtn.disabled = false;
    }
}

// Contact Form Validation
function setupContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('nameInput');
            const emailInput = document.getElementById('emailInput');
            const messageInput = document.getElementById('messageInput');
            const responseElement = document.getElementById('response');
            
            // Trim inputs
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            
            // Validate inputs
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show success message
            if (responseElement) {
                responseElement.innerHTML = `
                    <h3>Thank you, ${name}!</h3>
                    <p>We've received your message and will respond to you at ${email} soon.</p>
                    <p>Your message: "${message}"</p>
                `;
                responseElement.style.display = 'block';
            }
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// FAQ Toggle Functionality
function setupFAQ() {
    document.querySelectorAll('.question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const toggleIcon = question.querySelector('.toggle-icon');
            
            // Toggle answer visibility
            answer.classList.toggle('visible');
            
            // Update toggle icon
            if (answer.classList.contains('visible')) {
                toggleIcon.textContent = '−';
            } else {
                toggleIcon.textContent = '+';
            }
        });
    });
}

// Real-time Clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupContactForm();
    setupFAQ();
    
    // Set up user loading
    if (loadUsersBtn) {
        loadUsersBtn.addEventListener('click', fetchUsers);
    }
    
    // Initialize clock and update every second
    updateClock();
    setInterval(updateClock, 1000);
});