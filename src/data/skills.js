// Skills data model

export const skills = {
  languages: [
    { name: "Java", proficiency: 85, experience: "2+ years", projects: ["PortMySim"] },
    { name: "JavaScript (ES6+)", proficiency: 90, experience: "2+ years", projects: ["PortMySim", "SydneyEvent", "PixiSphere"] },
    { name: "SQL", proficiency: 80, experience: "2+ years", projects: ["PortMySim"] },
    { name: "HTML5", proficiency: 95, experience: "3+ years", projects: ["PortMySim", "SydneyEvent", "PixiSphere"] },
    { name: "CSS3", proficiency: 90, experience: "3+ years", projects: ["PortMySim", "SydneyEvent", "PixiSphere"] }
  ],
  
  frontend: [
    { name: "React.js", proficiency: 88, experience: "2+ years", projects: ["SydneyEvent", "PixiSphere"] },
    { name: "HTML", proficiency: 95, experience: "3+ years", projects: ["PortMySim", "SydneyEvent", "PixiSphere"] },
    { name: "CSS", proficiency: 90, experience: "3+ years", projects: ["PortMySim", "SydneyEvent", "PixiSphere"] },
    { name: "Tailwind CSS", proficiency: 85, experience: "1+ years", projects: ["PixiSphere"] },
    { name: "Bootstrap", proficiency: 80, experience: "2+ years", projects: ["PortMySim"] },
    { name: "Material UI", proficiency: 75, experience: "1+ years", projects: [] }
  ],
  
  backend: [
    { name: "Node.js", proficiency: 85, experience: "2+ years", projects: ["PortMySim", "SydneyEvent"] },
    { name: "Express.js", proficiency: 85, experience: "2+ years", projects: ["PortMySim", "SydneyEvent"] }
  ],
  
  databases: [
    { name: "MongoDB", proficiency: 80, experience: "2+ years", projects: ["PortMySim"] },
    { name: "MySQL", proficiency: 75, experience: "1+ years", projects: [] }
  ],
  
  tools: [
    { name: "Git", proficiency: 85, experience: "2+ years", projects: ["All Projects"] },
    { name: "GitHub", proficiency: 85, experience: "2+ years", projects: ["All Projects"] },
    { name: "VS Code", proficiency: 90, experience: "3+ years", projects: ["All Projects"] },
    { name: "npm", proficiency: 80, experience: "2+ years", projects: ["All Projects"] }
  ],
  
  concepts: [
    { name: "DSA", proficiency: 85, experience: "2+ years", projects: ["Competitive Programming"] },
    { name: "OOP", proficiency: 80, experience: "2+ years", projects: ["Java Projects"] },
    { name: "RESTful APIs", proficiency: 85, experience: "2+ years", projects: ["PortMySim", "SydneyEvent"] },
    { name: "SDLC", proficiency: 75, experience: "1+ years", projects: ["All Projects"] },
    { name: "Operating Systems", proficiency: 70, experience: "Academic", projects: [] },
    { name: "DBMS", proficiency: 75, experience: "Academic + Projects", projects: ["PortMySim"] },
    { name: "Computer Networks", proficiency: 70, experience: "Academic", projects: [] }
  ]
}

// Skill categories for filtering
export const skillCategories = [
  { id: 'all', name: 'All Skills', icon: '🚀' },
  { id: 'languages', name: 'Languages', icon: '💻' },
  { id: 'frontend', name: 'Frontend', icon: '🎨' },
  { id: 'backend', name: 'Backend', icon: '⚙️' },
  { id: 'databases', name: 'Databases', icon: '🗄️' },
  { id: 'tools', name: 'Tools', icon: '🛠️' },
  { id: 'concepts', name: 'Concepts', icon: '🧠' }
]

// Get all skills flattened
export const getAllSkills = () => {
  return [
    ...skills.languages,
    ...skills.frontend,
    ...skills.backend,
    ...skills.databases,
    ...skills.tools,
    ...skills.concepts
  ]
}

// Get skills by category
export const getSkillsByCategory = (category) => {
  if (category === 'all') return getAllSkills()
  return skills[category] || []
}