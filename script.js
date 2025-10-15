// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const skills = document.getElementById('skills').value;
            const goal = document.getElementById('goal').value;
            
            if (!skills || !goal) {
                alert('Please fill in both fields');
                return;
            }
            
            // Show loading
            document.getElementById('loading').style.display = 'block';
            document.getElementById('results').style.display = 'none';
            
            // Generate learning path
            setTimeout(() => {
                generateLearningPath(skills, goal);
                document.getElementById('loading').style.display = 'none';
                document.getElementById('results').style.display = 'block';
                
                document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
            }, 1500);
        });
    }

    // Enter key for chat
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// Main function to generate learning path
function generateLearningPath(skills, goal) {
    const pathResult = document.getElementById('pathResult');
    if (!pathResult) return;
    
    pathResult.innerHTML = '';
    
    // Create path header
    const headerElement = document.createElement('div');
    headerElement.className = 'path-header';
    headerElement.innerHTML = `
        <h2>🎯 Learning Path to Become ${goal}</h2>
        <p class="path-description">From ${skills} to ${goal} - Practical Step-by-Step Guide</p>
        <div class="user-context">
            <p><strong>Your Starting Point:</strong> ${skills}</p>
            <p><strong>Your Destination:</strong> ${goal}</p>
        </div>
    `;
    pathResult.appendChild(headerElement);
    
    // Generate meaningful learning steps
    const steps = createMeaningfulSteps(skills, goal);
    
    // Add each step
    steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'path-step detailed-step';
        stepElement.innerHTML = `
            <div class="step-header">
                <h3><i class="fa-solid fa-${getStepIcon(index)}"></i> Step ${index + 1}: ${step.title}</h3>
                <span class="duration-badge">${step.duration}</span>
            </div>
            <p class="step-description">${step.description}</p>
            
            <div class="step-benefit">
                <h4>🎯 What You'll Achieve:</h4>
                <p>${step.benefit}</p>
            </div>
            
            <div class="step-content">
                <div class="content-section">
                    <h4>📖 Core Concepts to Master</h4>
                    <ul>
                        ${step.learnings.map(learning => `<li>${learning}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="content-section">
                    <h4>🛠️ Practice Projects (Build These)</h4>
                    <ul>
                        ${step.projects.map(project => `<li><strong>${project.title}:</strong> ${project.description}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="content-section">
                    <h4>🌐 Learning Resources</h4>
                    <ul>
                        ${step.resources.map(resource => `<li>${resource}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="step-outcome">
                <h4>✅ By the end of this step, you'll be able to:</h4>
                <ul>
                    ${step.outcomes.map(outcome => `<li>${outcome}</li>`).join('')}
                </ul>
            </div>
        `;
        pathResult.appendChild(stepElement);
    });
    
    // Add final motivation section
    const finalElement = document.createElement('div');
    finalElement.className = 'final-section';
    finalElement.innerHTML = `
        <h3>🚀 You're Ready to Start!</h3>
        <div class="success-guide">
            <h4>📅 How to Follow This Path Successfully:</h4>
            <div class="guide-tips">
                <div class="tip">
                    <h5>⏰ Daily Practice</h5>
                    <p>Spend 45-60 minutes daily. Consistency beats long irregular sessions.</p>
                </div>
                <div class="tip">
                    <h5>🏗️ Build Everything</h5>
                    <p>Don't just watch tutorials. Code along and build the projects.</p>
                </div>
                <div class="tip">
                    <h5>🔁 Don't Skip Steps</h5>
                    <p>Each step builds on previous knowledge. Follow the sequence.</p>
                </div>
                <div class="tip">
                    <h5>🎯 Focus on Understanding</h5>
                    <p>Understand why things work, not just how to make them work.</p>
                </div>
            </div>
        </div>
        
        <div class="career-path">
            <h4>💼 After Completing This Path:</h4>
            <p>You'll have the skills to start applying for <strong>${goal}</strong> positions, freelance projects, 
            or build your own products. You'll have a portfolio of real projects to showcase your abilities.</p>
        </div>
    `;
    pathResult.appendChild(finalElement);
}

// Create meaningful learning steps with clear progression
function createMeaningfulSteps(skills, goal) {
    const goalType = analyzeGoalType(goal);
    
    return [
        {
            title: 'Build Programming Foundation',
            duration: '3 weeks',
            description: 'Learn the absolute basics that every developer needs, regardless of specialization',
            benefit: 'You will understand how programming works and be able to write basic code to solve problems',
            learnings: [
                'How computers understand code',
                'Variables, data types, and basic operations',
                'Conditional logic (if/else statements)',
                'Loops and repetition',
                'Basic functions and code organization',
                'How to debug and fix errors'
            ],
            projects: [
                {
                    title: 'Personal Calculator',
                    description: 'Build a calculator that can add, subtract, multiply, and divide numbers'
                },
                {
                    title: 'Number Guessing Game',
                    description: 'Create a game where the computer picks a random number and the user guesses it'
                },
                {
                    title: 'Simple To-Do List',
                    description: 'Make a console-based app to add, view, and delete tasks'
                }
            ],
            resources: [
                'freeCodeCamp - "Learn to Code" interactive course',
                'Codecademy - "Introduction to Programming"',
                'YouTube: "Programming for Complete Beginners" by FreeCodeCamp'
            ],
            outcomes: [
                'Write and run basic programs',
                'Understand and fix common errors',
                'Break down problems into code steps',
                'Use programming logic to solve simple problems'
            ]
        },
        {
            title: 'Master Essential Development Skills',
            duration: '4 weeks',
            description: 'Learn the specific technologies and tools needed for your goal',
            benefit: 'You will be able to build real applications using industry-standard tools and practices',
            learnings: getCoreLearnings(goalType),
            projects: getCoreProjects(goalType),
            resources: getCoreResources(goalType),
            outcomes: getCoreOutcomes(goalType)
        },
        {
            title: 'Build Complete Real-World Projects',
            duration: '3 weeks',
            description: 'Apply your skills to build portfolio-worthy projects that solve actual problems',
            benefit: 'You will have real projects for your portfolio and understand how to build complete applications',
            learnings: [
                'Project planning and architecture',
                'Working with external APIs and data',
                'User interface design principles',
                'Debugging complex applications',
                'Code organization and best practices'
            ],
            projects: [
                {
                    title: 'Weather Application',
                    description: 'Build an app that shows current weather using a weather API with beautiful UI'
                },
                {
                    title: 'Personal Budget Tracker',
                    description: 'Create an application to track income, expenses, and savings goals'
                },
                {
                    title: 'Blog or Portfolio Website',
                    description: 'Build a responsive website to showcase your work and learning journey'
                }
            ],
            resources: [
                'Frontend Mentor - Real-world project challenges',
                'YouTube: "Build a complete project" tutorials',
                'GitHub - Study how others build similar projects'
            ],
            outcomes: [
                'Build complete applications from scratch',
                'Integrate third-party APIs and services',
                'Create responsive and user-friendly interfaces',
                'Debug and fix issues in complex code'
            ]
        },
        {
            title: 'Advanced Skills & Professional Development',
            duration: '2 weeks',
            duration: '2 weeks',
            description: 'Learn advanced concepts and prepare for professional opportunities',
            benefit: 'You will be ready for job interviews, freelance work, or building your own products',
            learnings: [
                'Performance optimization techniques',
                'Security best practices',
                'Testing your code',
                'Deployment and hosting',
                'Collaboration tools and workflows'
            ],
            projects: [
                {
                    title: 'Optimize Previous Projects',
                    description: 'Go back and improve your earlier projects with better code and features'
                },
                {
                    title: 'Open Source Contribution',
                    description: 'Find a small open-source project and contribute improvements or fixes'
                },
                {
                    title: 'Technical Interview Preparation',
                    description: 'Build small solutions for common coding interview problems'
                }
            ],
            resources: [
                'LeetCode - Practice coding problems',
                'Official documentation for advanced features',
                'Tech interview preparation guides',
                'Professional development blogs'
            ],
            outcomes: [
                'Write efficient and optimized code',
                'Understand and implement security measures',
                'Deploy applications to the web',
                'Collaborate with other developers',
                'Prepare for technical interviews'
            ]
        }
    ];
}

// Analyze what type of goal the user has
function analyzeGoalType(goal) {
    const goalLower = goal.toLowerCase();
    
    if (goalLower.includes('web') || goalLower.includes('frontend') || goalLower.includes('fullstack')) {
        return 'web';
    }
    else if (goalLower.includes('mobile')) {
        return 'mobile';
    }
    else if (goalLower.includes('data')) {
        return 'data';
    }
    else if (goalLower.includes('python')) {
        return 'python';
    }
    else {
        return 'general';
    }
}

// Get core learnings based on goal type
function getCoreLearnings(goalType) {
    const learnings = {
        'web': [
            'HTML5 for website structure and semantics',
            'CSS3 for styling, layouts, and responsive design',
            'JavaScript for interactivity and dynamic content',
            'DOM manipulation to update web pages',
            'Modern CSS with Flexbox and Grid',
            'Basic version control with Git'
        ],
        'mobile': [
            'React Native or Flutter framework',
            'Mobile UI components and navigation',
            'State management for app data',
            'Mobile-specific features (camera, GPS, etc.)',
            'App design principles for small screens',
            'Publishing to app stores'
        ],
        'data': [
            'Python programming for data analysis',
            'Pandas library for data manipulation',
            'Data visualization with Matplotlib/Seaborn',
            'Basic statistics and analysis techniques',
            'Working with CSV and Excel files',
            'Data cleaning and preparation'
        ],
        'python': [
            'Python syntax and advanced features',
            'Working with files and data',
            'Object-oriented programming in Python',
            'Popular Python libraries and frameworks',
            'Building command-line tools',
            'Web scraping and automation'
        ],
        'general': [
            'Advanced programming concepts',
            'Data structures and algorithms',
            'Problem-solving techniques',
            'Code organization and best practices',
            'Debugging complex issues',
            'Software development workflow'
        ]
    };
    
    return learnings[goalType];
}

// Get meaningful projects based on goal type
function getCoreProjects(goalType) {
    const projects = {
        'web': [
            {
                title: 'Responsive Restaurant Website',
                description: 'Build a beautiful website for a restaurant with menu, location, and contact sections'
            },
            {
                title: 'Interactive Quiz App',
                description: 'Create a quiz with multiple questions, score tracking, and results display'
            },
            {
                title: 'Product Landing Page',
                description: 'Design and code a landing page for a product with features and pricing sections'
            }
        ],
        'mobile': [
            {
                title: 'Weather Mobile App',
                description: 'Build a weather app that shows current conditions and forecasts for any city'
            },
            {
                title: 'Note-Taking App',
                description: 'Create an app to write, save, and organize notes with categories'
            },
            {
                title: 'Fitness Tracker',
                description: 'Make an app to track workouts, set goals, and view progress'
            }
        ],
        'data': [
            {
                title: 'Sales Data Analysis',
                description: 'Analyze sales data to find trends, top products, and business insights'
            },
            {
                title: 'COVID-19 Data Visualization',
                description: 'Create charts and graphs to visualize pandemic data and trends'
            },
            {
                title: 'Customer Segmentation',
                description: 'Group customers based on purchasing behavior for marketing strategies'
            }
        ],
        'python': [
            {
                title: 'Web Scraper',
                description: 'Build a tool to extract information from websites and save to files'
            },
            {
                title: 'Automated File Organizer',
                description: 'Create a script that automatically organizes files in folders by type/date'
            },
            {
                title: 'Password Generator',
                description: 'Make a secure password generator with customizable length and character types'
            }
        ],
        'general': [
            {
                title: 'Library Management System',
                description: 'Build a system to manage books, members, and borrowing records'
            },
            {
                title: 'Bank Account Simulator',
                description: 'Create a banking system with accounts, transactions, and balance tracking'
            },
            {
                title: 'Inventory Management',
                description: 'Develop a system to track products, stock levels, and sales'
            }
        ]
    };
    
    return projects[goalType];
}

// Get best learning resources
function getCoreResources(goalType) {
    const resources = {
        'web': [
            'MDN Web Docs - Complete web technology reference',
            'freeCodeCamp - Responsive Web Design certification',
            'JavaScript30 - 30 day Vanilla JS coding challenge',
            'CSS-Tricks - Practical CSS guides and examples'
        ],
        'mobile': [
            'React Native Documentation - Official docs with examples',
            'Flutter Docs - Complete Flutter development guide',
            'App Brewery - Mobile development courses',
            'Expo - Tools for React Native development'
        ],
        'data': [
            'Kaggle Learn - Free data science courses',
            'Real Python - Practical Python tutorials',
            'Towards Data Science - Articles and guides',
            'Python Data Science Handbook - Free online book'
        ],
        'python': [
            'Automate the Boring Stuff - Free Python book',
            'Real Python - Tutorials and articles',
            'Python Official Documentation',
            'Corey Schafer YouTube channel - Python tutorials'
        ],
        'general': [
            'freeCodeCamp - Programming curriculum',
            'The Odin Project - Full stack development',
            'Exercism - Coding practice platform',
            'GitHub Learning Lab - Learn Git and GitHub'
        ]
    };
    
    return resources[goalType];
}

// Get clear outcomes for each goal type
function getCoreOutcomes(goalType) {
    const outcomes = {
        'web': [
            'Build responsive websites that work on all devices',
            'Create interactive web pages with JavaScript',
            'Style beautiful user interfaces with CSS',
            'Use Git to track changes and collaborate',
            'Understand how web browsers work'
        ],
        'mobile': [
            'Build functional mobile applications',
            'Design user-friendly mobile interfaces',
            'Work with device features and APIs',
            'Test apps on different devices',
            'Prepare apps for app store submission'
        ],
        'data': [
            'Clean and prepare data for analysis',
            'Create meaningful data visualizations',
            'Perform basic statistical analysis',
            'Work with data in Python',
            'Present data insights effectively'
        ],
        'python': [
            'Write Python scripts for automation',
            'Work with files and data in Python',
            'Build command-line tools',
            'Use popular Python libraries',
            'Solve problems with Python programming'
        ],
        'general': [
            'Solve complex programming problems',
            'Write clean and maintainable code',
            'Debug and fix issues efficiently',
            'Work with data structures effectively',
            'Plan and build complete applications'
        ]
    };
    
    return outcomes[goalType];
}

// Helper function to get step icons
function getStepIcon(index) {
    const icons = ['seedling', 'graduation-cap', 'rocket', 'crown'];
    return icons[index] || 'circle';
}

// Button functions
function savePath() {
    const goal = document.getElementById('goal').value || 'your goal';
    alert(`Learning path for "${goal}" saved successfully! You can return to it anytime.`);
}

function exportToTXT() {
    const goal = document.getElementById('goal').value || 'Learning Path';
    alert(`"${goal}" learning path exported as text file! Check your downloads.`);
}

function openChat() {
    document.getElementById('chatSection').style.display = 'flex';
}

function closeChat() {
    document.getElementById('chatSection').style.display = 'none';
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (message) {
        addMessageToChat(message, 'user');
        chatInput.value = '';
        
        setTimeout(() => {
            const response = getAIResponse(message);
            addMessageToChat(response, 'ai');
        }, 1000);
    }
}

// Improved AI responses with practical advice
function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    const skills = document.getElementById('skills').value || 'your current skills';
    const goal = document.getElementById('goal').value || 'your goal';
    
    if (lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('first')) {
        return `Perfect! Let's get you started on becoming ${goal}:

🎯 **Your First Week Plan:**
**Days 1-3:** Complete the "Personal Calculator" project from Step 1
**Days 4-7:** Build the "Number Guessing Game" and understand the code

💡 **Success Tip:** Don't rush! Spend time understanding WHY the code works, not just making it work.

📚 **Resources to Start:**
• freeCodeCamp's "Learn to Code" course
• Watch beginner programming tutorials on YouTube

What specific part are you starting with?`;
    }
    else if (lowerMessage.includes('stuck') || lowerMessage.includes('problem') || lowerMessage.includes('error')) {
        return `Don't worry! Every developer gets stuck. Here's how to get unstuck:

🔧 **Problem-Solving Steps:**
1. **Read the error message carefully** - it usually tells you what's wrong
2. **Google the exact error** - someone has solved it before
3. **Check your code step by step** - use console.log to see what's happening
4. **Take a break** - often the solution comes when you return fresh
5. **Ask for help** - use Stack Overflow or programming communities

💡 **For ${goal} specifically:** Make sure you understand the fundamentals from Step 1 before moving forward.

What specific error or problem are you facing?`;
    }
    else if (lowerMessage.includes('project') || lowerMessage.includes('build')) {
        return `Building projects is where real learning happens! For ${goal}:

🏗️ **Project Building Strategy:**
1. **Start Simple** - Complete the basic projects in Step 1 first
2. **Code Along** - Type every character yourself, don't copy-paste
3. **Experiment** - Try changing colors, adding features, breaking things
4. **Debug** - Learn to fix errors (this is valuable skill!)
5. **Complete** - Finish each project fully before moving to next

🎯 **Current Focus:** Which project are you working on? I can help you break it down into smaller steps.`;
    }
    else if (lowerMessage.includes('time') || lowerMessage.includes('long') || lowerMessage.includes('fast')) {
        return `Realistic timeline for ${goal}:

⏰ **Learning Pace Guide:**
• **Fast Pace:** 2-3 hours daily → 3-4 months to job-ready
• **Moderate Pace:** 1 hour daily → 5-6 months to job-ready
• **Weekend Warrior:** 4-5 hours weekends only → 7-8 months

📊 **What Matters Most:**
• **Consistency** > Long sessions
• **Projects built** > Tutorials watched
• **Understanding** > Memorizing

💡 **My Advice:** Aim for 1 hour daily. You'll make steady progress without burning out.

How much time can you commit daily?`;
    }
    else if (lowerMessage.includes('resource') || lowerMessage.includes('learn') || lowerMessage.includes('tutorial')) {
        return `For learning ${goal}, focus on these proven resources:

📚 **Resource Strategy:**
**Primary Resource:** Pick ONE main course (freeCodeCamp recommended)
**Secondary:** Use official documentation for reference
**Practice:** Build the projects in your learning path
**Community:** Join Discord/Slack groups for ${goal}

🎯 **Avoid Resource Hopping:** Don't jump between 10 different tutorials. Stick with one good resource and complete it.

Which resource from your learning path are you using?`;
    }
    else if (lowerMessage.includes('job') || lowerMessage.includes('career') || lowerMessage.includes('work')) {
        return `Great thinking about career opportunities in ${goal}! 

💼 **Path to Getting Hired:**
1. **Complete all 4 steps** in your learning path
2. **Build 5-7 solid projects** for your portfolio
3. **Learn Git and GitHub** to showcase your code
4. **Practice talking about your projects**
5. **Start applying after Step 3 completion**

🎯 **Timeline:** Most people get their first ${goal} job within 3-6 months of consistent learning and project building.

Ready to build your portfolio?`;
    }
    else {
        return `Thanks for your question about "${message}"!

For your journey from ${skills} to ${goal}, remember these key principles:

🎯 **Learning Success Formula:**
• Code daily (consistency beats intensity)
• Build projects (theory + practice = mastery)
• Embrace struggle (getting stuck means you're learning)
• Celebrate progress (every small win matters)

💡 **Right Now:** Which step of your learning path are you currently working on? I can provide specific guidance.`;
    }
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}-message`;
    messageElement.innerHTML = message.replace(/\n/g, '<br>');
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}