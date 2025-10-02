export const experience = [
  {
    id: "freelance-dev",
    title: "Freelance Full-Stack Developer",
    company: "Self-Employed",
    period: "2023 - Present",
    duration: "1+ years",
    location: "Remote",
    type: "Freelance",
    description: "Developing custom web applications for clients using modern MERN stack technologies, focusing on responsive design and optimal user experience.",
    responsibilities: [
      "Built 5+ responsive web applications using React.js, Node.js, and MongoDB",
      "Improved client website performance by 40% through code optimization and best practices",
      "Implemented RESTful APIs and database optimization for scalable applications",
      "Collaborated with clients to gather requirements and deliver solutions on time",
      "Maintained and updated existing applications with new features and bug fixes"
    ],
    technologies: [
      "React.js", "Node.js", "Express.js", "MongoDB", "JavaScript (ES6+)", 
      "HTML5", "CSS3", "Tailwind CSS", "Git", "RESTful APIs"
    ],
    achievements: [
      "Successfully delivered 5+ projects with 100% client satisfaction",
      "Reduced application load times by 40% on average",
      "Implemented responsive designs that work across all devices",
      "Built scalable backend architectures handling 1000+ concurrent users"
    ],
    projects: ["PortMySim", "SydneyEvent", "PixiSphere"],
    skills_gained: [
      "Full-stack development expertise",
      "Client communication and project management",
      "Performance optimization techniques",
      "Modern web development best practices"
    ],
    logo: "/assets/images/freelance-logo.svg",
    color: "#22D3EE"
  },
  {
    id: "student-developer",
    title: "Computer Science Student & Developer",
    company: "The Technological Institute of Textile and Sciences",
    period: "2022 - Present",
    duration: "2+ years",
    location: "Bhiwani, Haryana",
    type: "Education",
    description: "Pursuing B.Tech in Computer Science while actively developing projects and participating in competitive programming competitions.",
    responsibilities: [
      "Maintained 7.9 CGPA while working on multiple development projects",
      "Participated in competitive programming competitions and hackathons",
      "Collaborated on team projects using modern development methodologies",
      "Mentored junior students in programming and web development",
      "Led technical workshops on MERN stack development"
    ],
    technologies: [
      "Java", "JavaScript", "Python", "C++", "React.js", "Node.js", 
      "MongoDB", "MySQL", "Data Structures", "Algorithms", "DBMS"
    ],
    achievements: [
      "First Position in Code War competition (April 2024)",
      "Second Position in Graphico Tech event (October 2024)",
      "Maintained 7.9 CGPA throughout the program",
      "Completed 3+ major full-stack projects"
    ],
    projects: ["PortMySim", "SydneyEvent", "PixiSphere"],
    skills_gained: [
      "Strong foundation in computer science fundamentals",
      "Problem-solving and algorithmic thinking",
      "Team collaboration and leadership",
      "Project management and time management"
    ],
    logo: "/assets/images/college-logo.svg",
    color: "#10B981"
  },
  {
    id: "aspiring-sde",
    title: "Aspiring Software Development Engineer",
    company: "Future Goals",
    period: "2026 - Future",
    duration: "Career Goal",
    location: "India / Remote",
    type: "Career Goal",
    description: "Seeking opportunities as a Software Development Engineer at top tech companies to contribute to large-scale applications and innovative solutions.",
    responsibilities: [
      "Develop and maintain scalable web applications",
      "Collaborate with cross-functional teams on product development",
      "Implement best practices for code quality and performance",
      "Contribute to system architecture and technical decision making",
      "Mentor junior developers and share knowledge"
    ],
    technologies: [
      "Advanced React.js", "Node.js", "Microservices", "Cloud Technologies",
      "System Design", "DevOps", "Docker", "Kubernetes", "AWS/Azure"
    ],
    achievements: [
      "Target: Join a top-tier tech company",
      "Goal: Contribute to products used by millions",
      "Aspiration: Lead technical teams and projects",
      "Vision: Build innovative solutions that make a difference"
    ],
    projects: ["Future Enterprise Applications", "Scalable Web Platforms"],
    skills_gained: [
      "Advanced system design and architecture",
      "Leadership and team management",
      "Enterprise-level development practices",
      "Innovation and technical excellence"
    ],
    logo: "/assets/images/future-logo.svg",
    color: "#8B5CF6"
  }
];

export const experienceCategories = [
  { id: "all", label: "All Experience", color: "#64748B" },
  { id: "freelance", label: "Freelance", color: "#22D3EE" },
  { id: "education", label: "Education", color: "#10B981" },
  { id: "career_goal", label: "Future Goals", color: "#8B5CF6" }
];

export const getExperienceByType = (type) => {
  if (type === "all") return experience;
  return experience.filter(exp => exp.type.toLowerCase().replace(" ", "_") === type);
};

export const getExperienceById = (id) => {
  return experience.find(exp => exp.id === id);
};

export const getTotalExperience = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2023; // When freelancing started
  return currentYear - startYear + 1;
};