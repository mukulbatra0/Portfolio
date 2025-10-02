export const achievements = [
  {
    id: "codewar-first",
    title: "First Position - Code War",
    event: "TIT&S Annual Day",
    date: "April 2024",
    description: "Won first place in competitive programming competition showcasing algorithmic problem-solving skills and coding efficiency under time pressure.",
    icon: "trophy",
    category: "competition",
    color: "#FFD700", // Gold
    details: {
      participants: "50+ students",
      challenges: "Data Structures, Algorithms, Problem Solving",
      duration: "3 hours",
      technologies: ["Java", "Algorithms", "Data Structures"]
    }
  },
  {
    id: "graphico-second",
    title: "Second Position - Graphico Tech",
    event: "Computer Engineering Dept., TIT&S",
    date: "October 2024",
    description: "Secured second position in design and technology event demonstrating creative problem-solving and technical design skills.",
    icon: "medal",
    category: "design",
    color: "#C0C0C0", // Silver
    details: {
      participants: "30+ teams",
      challenges: "UI/UX Design, Technical Innovation",
      duration: "2 days",
      technologies: ["Design Tools", "Frontend Development", "User Experience"]
    }
  },
  {
    id: "academic-excellence",
    title: "Academic Excellence",
    event: "Computer Science Department",
    date: "2023-2024",
    description: "Maintained consistent academic performance with 7.9 CGPA while actively participating in coding competitions and project development.",
    icon: "star",
    category: "academic",
    color: "#22D3EE", // Cyan (brand color)
    details: {
      cgpa: "7.9/10",
      subjects: "DSA, DBMS, Operating Systems, Computer Networks",
      projects: "3+ major projects completed",
      technologies: ["MERN Stack", "Database Design", "System Architecture"]
    }
  },
  {
    id: "project-portfolio",
    title: "Project Portfolio Achievement",
    event: "Personal Development",
    date: "2023-2024",
    description: "Successfully developed and deployed multiple full-stack applications demonstrating proficiency in modern web technologies.",
    icon: "code",
    category: "project",
    color: "#10B981", // Green
    details: {
      projects: "3 major applications",
      technologies: "MERN Stack, RESTful APIs, Database Design",
      deployment: "Live applications with user feedback",
      impact: "Practical solutions for real-world problems"
    }
  }
];

export const achievementCategories = [
  { id: "all", label: "All Achievements", color: "#64748B" },
  { id: "competition", label: "Competitions", color: "#FFD700" },
  { id: "design", label: "Design & Tech", color: "#C0C0C0" },
  { id: "academic", label: "Academic", color: "#22D3EE" },
  { id: "project", label: "Projects", color: "#10B981" }
];

export const getAchievementsByCategory = (category) => {
  if (category === "all") return achievements;
  return achievements.filter(achievement => achievement.category === category);
};

export const getAchievementById = (id) => {
  return achievements.find(achievement => achievement.id === id);
};