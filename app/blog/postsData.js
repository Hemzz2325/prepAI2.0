export const posts = [
    {
        slug: "how-faang-evaluates-candidates",
        title: "How FAANG Evaluates Candidates",
        excerpt: "The secret sauce behind Google, Meta, and Amazon's hiring process. Learn what they REALLY look for beyond your resume.",
        author: "Placify AI Team",
        date: "Dec 02, 2024",
        category: "FAANG Insights",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        content: `
            <p>Landing a job at a FAANG (Facebook/Meta, Apple, Amazon, Netflix, Google) company is often considered the pinnacle of a software engineering career. But how do these tech giants filter through millions of applications every year to select their engineering talent? It's not just about solving LeetCode puzzles. There is a highly structured rubrics system that engineers and hiring committees use to evaluate you.</p>

            <h2>1. Coding and Technical Competency</h2>
            <p>First and foremost, your technical capabilities are put to the test. This doesn't just mean getting a "correct" answer to a coding problem. Interviewers evaluate:
            <ul>
                <li><strong>Algorithm Design:</strong> Can you select the optimal data structures and design an algorithm that fits the constraints?</li>
                <li><strong>Speed and Accuracy:</strong> Can you implement the solution cleanly in 20-30 minutes?</li>
                <li><strong>Edge Case Handling:</strong> Do you proactively think about null inputs, negative numbers, overflow issues, and scale limits?</li>
            </ul>
            </p>

            <h2>2. Communication and Collaboration</h2>
            <p>FAANG companies do not hire "brilliant jerks" who work in isolation. A major part of the interview rubric is your communication. Do you talk through your thought process? Do you listen to hints given by the interviewer? How do you respond when they point out a bug in your code? Being collaborative, receptive to feedback, and clear in your explanations can make the difference between a Hire and a No-Hire decision.</p>

            <h2>3. System Design and Scalability</h2>
            <p>For mid to senior-level roles, system design interviews are the ultimate differentiator. The hiring committee looks for your ability to design large-scale distributed systems. You will be evaluated on your understanding of:
            <ul>
                <li>Scalability (load balancers, caching, CDN, database sharding)</li>
                <li>Reliability, Availability, and Fault Tolerance</li>
                <li>Data consistency models and API design</li>
            </ul>
            </p>

            <h2>4. Behavioral Fit (The Leadership Principles)</h2>
            <p>Every FAANG company has a core set of values. For example, Amazon is famous for its 16 Leadership Principles (e.g., Customer Obsession, Ownership, Bias for Action). Google looks for "Googliness" (intellectual humility, collaboration, doing the right thing). Meta values speed and moving fast. During behavioral rounds, your past experiences will be closely mapped to these company values to ensure cultural alignment.</p>
        `
    },
    {
        slug: "top-mistakes-freshers-make-in-hr-rounds",
        title: "Top Mistakes Freshers Make in HR Rounds",
        excerpt: "Stop sabotaging your interviews! These 7 rookie mistakes cost freshers their dream jobs. Here's how to avoid them.",
        author: "Placify AI Team",
        date: "Nov 30, 2024",
        category: "Interview Tips",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        content: `
            <p>Many candidates believe that once they pass the technical rounds, the HR interview is just a formality. This is a dangerous misconception. HR rounds are designed to filter out candidates who look great on paper but may be toxic, unmotivated, or a bad fit for the team. Here are the top mistakes freshers make and how to steer clear of them.</p>

            <h2>1. Not Researching the Company</h2>
            <p>When an HR interviewer asks, "Why do you want to work here?" saying "Because it's a reputed company" is a generic, uninspired response. Take 15 minutes before the interview to research the company's products, recent achievements, and culture. Align your personal goals with their mission.</p>

            <h2>2. Speaking Negatively About Past Experiences or Colleagues</h2>
            <p>If you're asked why you left a previous internship or why you had conflict in a college project, never place the blame entirely on others. Speaking negatively about team members or past employers sends an immediate red flag that you are difficult to manage or lack professional maturity.</p>

            <h2>3. Lacking Passion and Enthusiasm</h2>
            <p>Energy is contagious. If you sit through the HR round with a monotone voice and zero energy, the recruiter will assume you are only interested in the salary or are desperate for any job. Show genuine interest in the role, the team's challenges, and how you can contribute.</p>

            <h2>4. Asking No Questions at the End</h2>
            <p>When the interviewer asks, "Do you have any questions for me?" saying "No" is a missed opportunity. It signals a lack of curiosity and interest. Instead, ask about team structure, the daily routine, or upcoming projects that the team is tackling.</p>
        `
    },
    {
        slug: "project-ideas-that-actually-impress-recruiters",
        title: "Project Ideas That Actually Impress Recruiters",
        excerpt: "Forget todo apps. Build these 5 projects that make recruiters say 'When can you start?' Real-world impact guaranteed.",
        author: "Placify AI Team",
        date: "Nov 28, 2024",
        category: "Projects",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        content: `
            <p>Recruiters see hundreds of resumes daily, and almost all of them list the same basic projects: weather apps, e-commerce clones, and simple to-do lists. To stand out, your portfolio needs projects that solve real-world problems, handle state effectively, and showcase your engineering depth.</p>

            <h2>1. Collaborative Real-Time Workspace</h2>
            <p>Instead of a standard note-taking app, build a collaborative document editor like Notion or Google Docs.
            <ul>
                <li><strong>Key Tech:</strong> WebSockets, Socket.io, Redis, CRDTs (Conflict-free Replicated Data Types).</li>
                <li><strong>Why it impresses:</strong> Shows you understand real-time sync, state resolution, and concurrency control.</li>
            </ul>
            </p>

            <h2>2. Custom API Gateway & Rate Limiter</h2>
            <p>Build an API gateway from scratch that can route requests, perform authentication checks, and implement rate limiting.
            <ul>
                <li><strong>Key Tech:</strong> Node.js, Express, Redis (Token Bucket algorithm), Docker.</li>
                <li><strong>Why it impresses:</strong> Demonstrates systems thinking, middleware design, and caching strategies.</li>
            </ul>
            </p>

            <h2>3. AI-Powered Resume Screener</h2>
            <p>Build an application that allows users to upload resumes and parses them against job descriptions to score compatibility.
            <ul>
                <li><strong>Key Tech:</strong> React, Python/Node, OpenAI or Gemini API, PDF parsing libraries.</li>
                <li><strong>Why it impresses:</strong> Displays integration with modern AI technologies, complex file parsing, and asynchronous processing.</li>
            </ul>
            </p>

            <h2>4. Distributed Log Aggregator</h2>
            <p>Create a service that collects logs from multiple apps, processes them, and allows users to search/filter through a web dashboard.
            <ul>
                <li><strong>Key Tech:</strong> Go or Rust, Kafka, Elasticsearch, React.</li>
                <li><strong>Why it impresses:</strong> Shows high performance capability, database optimization, and familiarity with microservices infrastructure.</li>
            </ul>
            </p>
        `
    },
    {
        slug: "system-design-interview-secrets",
        title: "System Design Interview Secrets",
        excerpt: "The 3 patterns that solve 80% of system design questions. Stop memorizing, start understanding scalability.",
        author: "Placify AI Team",
        date: "Nov 25, 2024",
        category: "Technical",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        content: `
            <p>System design interviews can feel incredibly daunting because they are open-ended and have no single "correct" answer. However, senior engineers know that most system design problems can be solved by applying a few repeatable architecture patterns. Here are the secrets to mastering the system design round.</p>

            <h2>1. The Read-Heavy Pattern (Cache Aside)</h2>
            <p>Most popular apps (Twitter, Netflix, Instagram) are read-heavy—meaning users browse content far more than they create it. To design for this:
            <ul>
                <li>Introduce a cache (Redis/Memcached) in front of the database.</li>
                <li>Use CDN for static assets, videos, and images.</li>
                <li>Employ database replication (Read-Replicas) to distribute the read load.</li>
            </ul>
            </p>

            <h2>2. The Write-Heavy Pattern (Message Queues)</h2>
            <p>If you're designing a system like Uber's location tracking, or IoT sensors sending data constantly, writes will bottleneck your database.
            <ul>
                <li>Use a message broker like Apache Kafka or RabbitMQ.</li>
                <li>Buffer the writes in the queue and process them asynchronously in batches.</li>
                <li>This decouples your API gateway from the database and prevents database lockups.</li>
            </ul>
            </p>

            <h2>3. The Search & Analytics Pattern (CQRS)</h2>
            <p>When users want to search, filter, and aggregate data (like searching for products on Amazon), traditional relational databases fail.
            <ul>
                <li>Implement CQRS (Command Query Responsibility Segregation).</li>
                <li>Sync your primary database with Elasticsearch for high-performance text searches.</li>
                <li>Use a data warehouse (like Snowflake or BigQuery) for reporting and analytics.</li>
            </ul>
            </p>
        `
    },
    {
        slug: "resume-red-flags-that-get-you-rejected",
        title: "Resume Red Flags That Get You Rejected",
        excerpt: "ATS systems hate these 9 things. Fix them in 10 minutes and 3x your callback rate. No fluff, just facts.",
        author: "Placify AI Team",
        date: "Nov 22, 2024",
        category: "Resume",
        image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        content: `
            <p>Before a human recruiter ever sees your resume, it goes through an Applicant Tracking System (ATS). If your resume contains formatting or structural mistakes, the ATS will filter it out automatically. Here are the most common resume red flags and how to fix them today.</p>

            <h2>1. Multi-Column Layouts</h2>
            <p>While two-column resumes look beautiful and modern to the human eye, many older ATS systems parse text from left to right. This means they read across columns, turning your resume into a jumbled mess of words. Stick to a clean, single-column layout.</p>

            <h2>2. Using Non-Standard Section Titles</h2>
            <p>Don't name your work experience section "My Professional Journey" or your skills section "What I Can Do." ATS systems look for specific keywords like "Work Experience," "Education," and "Skills." Keep your headings standard so the parser knows exactly where to look.</p>

            <h2>3. Text Inside Tables, Shapes, or Text Boxes</h2>
            <p>Never put important details like your contact info or skills inside a table or graphical text box. Most ATS parsers skip tables and images entirely, meaning those details won't be indexed, and your resume will look blank to the algorithm.</p>

            <h2>4. Lack of Quantifiable Achievements</h2>
            <p>Avoid generic responsibilities like "Responsible for developing the frontend." Instead, use bullet points that show impact: "Developed the frontend interface using React, improving page load speed by 35% and increasing user engagement by 15%." Quantifiable metrics get you hired.</p>
        `
    },
    {
        slug: "salary-negotiation-the-48-hour-rule",
        title: "Salary Negotiation: The 48-Hour Rule",
        excerpt: "One simple trick that got our users 20-30% higher offers. Recruiters don't want you to know this.",
        author: "Placify AI Team",
        date: "Nov 20, 2024",
        category: "Career Advice",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        content: `
            <p>Negotiating your salary is one of the most critical steps in the hiring process, yet most candidates accept the initial offer out of fear of losing the job. One of the most effective strategies to negotiate without tension is the 48-Hour Rule.</p>

            <h2>What is the 48-Hour Rule?</h2>
            <p>When a recruiter calls to extend a job offer and states the compensation, your natural instinct is either to say "yes" immediately or propose a counter-number on the spot. The 48-Hour Rule requires you to do neither.
            Instead, express gratitude: "Thank you so much! I am incredibly excited about this opportunity. Can you send over the written offer details via email so I can review them and get back to you within 48 hours?"</p>

            <h2>Why it Works</h2>
            <p>
            <ul>
                <li><strong>Removes Emotion:</strong> It prevents you from making emotional decisions on the phone.</li>
                <li><strong>Creates Leverage:</strong> It signals to the recruiter that you are evaluating the offer carefully and are not desperate.</li>
                <li><strong>Gives You Time:</strong> It allows you to calculate your budget, compare with market rates, and construct a professional counter-offer.</li>
            </ul>
            </p>

            <h2>Constructing Your Counter-Offer</h2>
            <p>Once you have reviewed the offer, respond with a polite, data-driven email. Reference market averages, your specific skills, and the value you bring to the team. Ask for a 10-15% increase above their initial offer. In 95% of cases, companies will negotiate and meet you somewhere in the middle.</p>
        `
    },
    {
        slug: "dsa-patterns-you-must-know",
        title: "DSA Patterns You MUST Know",
        excerpt: "Master these 15 patterns and solve 90% of LeetCode problems. The cheat sheet senior engineers use.",
        author: "Placify AI Team",
        date: "Nov 18, 2024",
        category: "Technical",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        content: `
            <p>Coding interviews are notoriously difficult, and trying to memorize hundreds of individual LeetCode questions is a recipe for failure. The secret to success lies in pattern recognition. Once you learn to spot the underlying pattern of a problem, you can solve it easily. Here are the core patterns you must master.</p>

            <h2>1. Two Pointers</h2>
            <p>Used for searching pairs in a sorted array or list. By moving two pointers (e.g. one from the start, one from the end) towards each other, you can reduce O(N^2) search times to O(N).
            <ul>
                <li><strong>Typical Problems:</strong> Pair with Target Sum, Valid Palindrome, 3Sum.</li>
            </ul>
            </p>

            <h2>2. Sliding Window</h2>
            <p>Used to perform operations on a specific subarray or substring of a given size, or dynamically sized based on constraints.
            <ul>
                <li><strong>Typical Problems:</strong> Maximum Sum Subarray of Size K, Longest Substring with K Distinct Characters.</li>
            </ul>
            </p>

            <h2>3. Fast and Slow Pointers</h2>
            <p>Also known as the Hare & Tortoise algorithm. Uses two pointers moving at different speeds to detect cycles or find midpoints in linked lists.
            <ul>
                <li><strong>Typical Problems:</strong> Linked List Cycle, Find the Duplicate Number, Middle of the Linked List.</li>
            </ul>
            </p>

            <h2>4. Merge Intervals</h2>
            <p>An efficient pattern to deal with overlapping intervals. Very common in scheduling and calendar problems.
            <ul>
                <li><strong>Typical Problems:</strong> Merge Intervals, Insert Interval, Meeting Rooms.</li>
            </ul>
            </p>
        `
    },
    {
        slug: "why-your-linkedin-isnt-getting-views",
        title: "Why Your LinkedIn Isn't Getting Views",
        excerpt: "5 profile tweaks that got 10x more recruiter messages. Takes 15 minutes, lasts forever.",
        author: "Placify AI Team",
        date: "Nov 15, 2024",
        category: "Career Advice",
        image: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        content: `
            <p>Over 80% of recruiters actively use LinkedIn to source talent. If your profile isn't getting views, you are missing out on inbound career opportunities. Simply creating a profile isn't enough—you need to optimize it for the LinkedIn search algorithm. Here are 5 ways to do it.</p>

            <h2>1. Optimize Your Headline</h2>
            <p>Most job seekers put their current job title as their headline (e.g., "Student at ABC University"). Recruiters don't search for "students." They search for skills. Change your headline to match your target role: "Software Engineer | React, Node.js, TypeScript | Building Scalable Web Apps."</p>

            <h2>2. Write a Compelling "About" Summary</h2>
            <p>Your summary should tell a story. Avoid generic descriptions like "Hardworking professional looking for opportunities." Instead, explain:
            <ul>
                <li>What problems you love solving</li>
                <li>Your core technical skills</li>
                <li>Any major achievements (e.g., "Built an app with 1,000+ active users")</li>
            </ul>
            </p>

            <h2>3. List Your Skills (And Get Endorsements)</h2>
            <p>The LinkedIn search algorithm heavily weighs the skills section. Add up to 50 skills, focusing on the technologies you want to work with. Try to get classmate or colleague endorsements for your top skills to boost search rankings.</p>

            <h2>4. Turn on the "Open to Work" Settings</h2>
            <p>Make sure you have "Open to Work" enabled for recruiters. You don't have to show the green banner publicly if you're currently employed, but enabling the background settings tells recruiters you are open to chat.</p>
        `
    },
    {
        slug: "behavioral-questions-the-star-method-2.0",
        title: "Behavioral Questions: The STAR Method 2.0",
        excerpt: "The updated framework that works in 2024. Examples from real FAANG interviews included.",
        author: "Placify AI Team",
        date: "Nov 12, 2024",
        category: "Interview Tips",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        content: `
            <p>Behavioral questions like "Tell me about a time you failed" or "How do you handle conflict?" are designed to evaluate your emotional intelligence and leadership style. The STAR method is the standard structure to answer these, but in 2024, top tech companies look for the STAR 2.0 version.</p>

            <h2>What is the STAR Method?</h2>
            <p>
            <ul>
                <li><strong>Situation:</strong> Describe the context of the story. Keep it brief (15-20% of your response).</li>
                <li><strong>Task:</strong> Explain what goal you had to achieve or what problem you had to solve.</li>
                <li><strong>Action:</strong> Describe exactly what YOU did to solve the problem. Use "I" instead of "We". This should be the bulk of your answer (50%).</li>
                <li><strong>Result:</strong> Share the positive outcome of your action, with quantifiable numbers if possible.</li>
            </ul>
            </p>

            <h2>The STAR 2.0 Evolution: The "Learning & Reflection"</h2>
            <p>Today, top companies want to see self-awareness. At the end of your STAR response, add a 5th element: <strong>Reflection</strong>.
            Explain what you learned from the experience, how it changed your approach to work, or what you would do differently next time. This demonstrates a growth mindset and elevates your response above other candidates.</p>
        `
    }
];
