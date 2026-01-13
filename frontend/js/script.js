// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const filterButtons = document.querySelectorAll('.filter-btn');
const skillsContainer = document.getElementById('skillsContainer');
const projectsContainer = document.getElementById('projectsContainer');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const backToTop = document.querySelector('.back-to-top');
const navbar = document.querySelector('.navbar');

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Toggle mobile menu
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Update active nav link
        navLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
});

// Update active nav link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Load skills from API
async function loadSkills() {
    try {
        const response = await fetch(`${API_BASE_URL}/skills`);
        const skills = await response.json();
        
        skillsContainer.innerHTML = '';
        skills.forEach(skill => {
            const skillCard = createSkillCard(skill);
            skillsContainer.appendChild(skillCard);
            
            // Animate progress bar after a short delay
            setTimeout(() => {
                const progressBar = skillCard.querySelector('.skill-progress-bar');
                progressBar.style.width = `${skill.level}%`;
            }, 200);
        });
        
        // Setup skill filtering
        setupSkillFiltering();
    } catch (error) {
        console.error('Error loading skills:', error);
        skillsContainer.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Error loading skills. Please check if backend is running.</p>
            </div>
        `;
    }
}

// Create skill card element
function createSkillCard(skill) {
    const skillCard = document.createElement('div');
    skillCard.className = 'skill-card';
    skillCard.dataset.category = skill.category;
    
    // Determine category class and text
    let categoryText = skill.category;
    switch(skill.category) {
        case 'frontend': categoryText = 'Frontend'; break;
        case 'backend': categoryText = 'Backend'; break;
        case 'security': categoryText = 'Security'; break;
        case 'blockchain': categoryText = 'Blockchain'; break;
        case 'database': categoryText = 'Database'; break;
        case 'devops': categoryText = 'DevOps'; break;
        default: categoryText = skill.category;
    }
    
    skillCard.innerHTML = `
        <div class="skill-header">
            <div class="skill-name">${skill.name}</div>
            <div class="skill-level">${skill.level}%</div>
        </div>
        <div class="skill-progress">
            <div class="skill-progress-bar" style="width: 0%"></div>
        </div>
        <div class="skill-category">${categoryText}</div>
    `;
    
    return skillCard;
}

// Setup skill filtering
function setupSkillFiltering() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            const skillCards = document.querySelectorAll('.skill-card');
            
            skillCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Load projects from API
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const projects = await response.json();
        
        projectsContainer.innerHTML = '';
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsContainer.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Error loading projects. Please check if backend is running.</p>
            </div>
        `;
    }
}

// Create project card element
function createProjectCard(project) {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    
    // Create technology tags
    const techTags = project.technologies.map(tech => 
        `<span class="tech-tag">${tech}</span>`
    ).join('');
    
    // Create project links
    const demoLink = project.demo 
        ? `<a href="${project.demo}" target="_blank" class="project-link link-demo">
                <i class="fas fa-external-link-alt"></i> Live Demo
           </a>`
        : `<span class="project-link link-demo disabled">
                <i class="fas fa-ban"></i> No Demo
           </span>`;
    
    projectCard.innerHTML = `
        <div class="project-header">
            <h3 class="project-title">${project.title}</h3>
            <span class="project-category">${project.category}</span>
        </div>
        <div class="project-body">
            <p class="project-description">${project.description}</p>
            <div class="project-tech">${techTags}</div>
            <div class="project-links">
                <a href="${project.github}" target="_blank" class="project-link link-github">
                    <i class="fab fa-github"></i> View Code
                </a>
                ${demoLink}
            </div>
        </div>
    `;
    
    return projectCard;
}

// Handle contact form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    // Disable submit button and show loading
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Show success message
            formMessage.textContent = result.message;
            formMessage.className = 'form-message message-success';
            
            // Reset form
            contactForm.reset();
        } else {
            // Show error message
            formMessage.textContent = result.error || 'Failed to send message. Please try again.';
            formMessage.className = 'form-message message-error';
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        formMessage.textContent = 'Network error. Please check if the backend server is running.';
        formMessage.className = 'form-message message-error';
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = '';
        }, 5000);
    }
});

// Typewriter effect for terminal
// Typewriter effect for terminal - UPDATE UNTUK GITHUB
function typeWriterEffect() {
    const terminalBody = document.querySelector('.terminal-body');
    if (!terminalBody) return;
    
    const lines = [
        { prompt: '$', text: 'whoami', delay: 1000 },
        { prompt: '', text: 'Amrosi - Web Developer (lolipop0221)', delay: 500 },
        { prompt: '$', text: 'git status', delay: 1000 },
        { prompt: '', text: '7 repositories • 100% commits • Active', delay: 500 },
        { prompt: '$', text: 'ls ~/projects', delay: 1000 },
        { prompt: '', text: 'web os-project design-method ...', delay: 500 },
        { prompt: '$', text: ' <span class="cursor">█</span>', delay: 0 }
    ];
    
    let currentLine = 0;
    let currentChar = 0;
    
    function typeLine() {
        if (currentLine >= lines.length) {
            return;
        }
        
        const line = lines[currentLine];
        
        if (currentChar === 0) {
            // Create new line
            const lineElement = document.createElement('p');
            terminalBody.appendChild(lineElement);
            
            if (line.prompt) {
                const promptSpan = document.createElement('span');
                promptSpan.className = 'prompt';
                promptSpan.textContent = line.prompt + ' ';
                lineElement.appendChild(promptSpan);
            }
        }
        
        const currentLineElement = terminalBody.lastElementChild;
        
        if (currentChar < line.text.length) {
            // Type next character
            if (line.text[currentChar] === '<') {
                // Handle HTML
                const htmlEnd = line.text.indexOf('>', currentChar);
                const html = line.text.substring(currentChar, htmlEnd + 1);
                currentLineElement.innerHTML += html;
                currentChar = htmlEnd + 1;
            } else {
                currentLineElement.textContent += line.text[currentChar];
                currentChar++;
            }
            setTimeout(typeLine, 50);
        } else {
            // Move to next line
            currentLine++;
            currentChar = 0;
            setTimeout(typeLine, line.delay);
        }
    }
    
    // Clear terminal content
    terminalBody.innerHTML = '';
    
    // Start typing effect
    setTimeout(typeLine, 1000);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load data from API
    loadSkills();
    loadProjects();
    
    // Set initial active nav link
    updateActiveNavLink();
    
    // Start typewriter effect
    setTimeout(typeWriterEffect, 1500);
    
    // Add scroll event for navbar
    window.addEventListener('scroll', updateActiveNavLink);
});