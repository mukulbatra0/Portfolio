export const testimonials = [
  {
    id: "college-professor",
    name: "Dr. Rajesh Kumar",
    role: "Professor & Head of Department",
    company: "Computer Science Department, TIT&S",
    content: "Mukul has consistently demonstrated exceptional problem-solving abilities and a deep understanding of computer science fundamentals. His performance in Data Structures and Algorithms has been outstanding, and his ability to apply theoretical concepts to practical projects is remarkable.",
    rating: 5,
    image: "/assets/images/testimonials/professor.jpg",
    relationship: "Academic Mentor",
    date: "October 2024",
    skills_highlighted: ["Problem Solving", "DSA", "Academic Excellence", "Theoretical Application"],
    project_context: "Academic Projects and Competitive Programming"
  },
  {
    id: "project-teammate",
    name: "Priya Sharma",
    role: "Team Lead & Fellow Student",
    company: "TIT&S Project Team",
    content: "Working with Mukul on our final year project was an incredible experience. His technical skills in the MERN stack are impressive, but what stands out most is his collaborative approach and willingness to help team members. He consistently delivered high-quality code and innovative solutions.",
    rating: 5,
    image: "/assets/images/testimonials/teammate.jpg",
    relationship: "Project Collaborator",
    date: "September 2024",
    skills_highlighted: ["MERN Stack", "Team Collaboration", "Code Quality", "Innovation"],
    project_context: "Final Year Project Development"
  },
  {
    id: "freelance-client",
    name: "Amit Patel",
    role: "Startup Founder",
    company: "TechStart Solutions",
    content: "Mukul developed our company's web application from scratch using React and Node.js. His attention to detail, timely delivery, and ability to understand our business requirements made the entire process smooth. The application performance exceeded our expectations, and his post-delivery support has been excellent.",
    rating: 5,
    image: "/assets/images/testimonials/client.jpg",
    relationship: "Freelance Client",
    date: "August 2024",
    skills_highlighted: ["Full-Stack Development", "Business Understanding", "Timely Delivery", "Client Communication"],
    project_context: "Custom Web Application Development"
  },
  {
    id: "competition-judge",
    name: "Mr. Vikash Singh",
    role: "Senior Software Engineer & Judge",
    company: "Code War Competition",
    content: "Mukul's performance in the Code War competition was exceptional. His algorithmic thinking, code efficiency, and ability to solve complex problems under pressure impressed all the judges. His first-place finish was well-deserved, showcasing both technical excellence and competitive programming skills.",
    rating: 5,
    image: "/assets/images/testimonials/judge.jpg",
    relationship: "Competition Judge",
    date: "April 2024",
    skills_highlighted: ["Algorithmic Thinking", "Competitive Programming", "Problem Solving", "Code Efficiency"],
    project_context: "Code War Competition - First Position"
  },
  {
    id: "mentor-senior",
    name: "Rohit Gupta",
    role: "Senior Developer & Mentor",
    company: "Tech Community Mentor",
    content: "I've been mentoring Mukul for the past year, and his growth has been remarkable. His eagerness to learn new technologies, ask thoughtful questions, and implement feedback shows great potential. His projects demonstrate a solid understanding of modern web development practices and clean code principles.",
    rating: 5,
    image: "/assets/images/testimonials/mentor.jpg",
    relationship: "Technical Mentor",
    date: "November 2024",
    skills_highlighted: ["Learning Agility", "Clean Code", "Modern Web Development", "Growth Mindset"],
    project_context: "Mentorship and Skill Development"
  },
  {
    id: "workshop-participant",
    name: "Neha Agarwal",
    role: "Junior Developer",
    company: "Workshop Attendee",
    content: "Mukul conducted a MERN stack workshop at our college, and his teaching approach was excellent. He explained complex concepts in simple terms, provided hands-on examples, and was patient with all our questions. His passion for technology and teaching is evident in his delivery.",
    rating: 5,
    image: "/assets/images/testimonials/student.jpg",
    relationship: "Workshop Student",
    date: "September 2024",
    skills_highlighted: ["Teaching Ability", "Communication", "Technical Knowledge", "Patience"],
    project_context: "MERN Stack Workshop Delivery"
  }
];

export const testimonialCategories = [
  { id: "all", label: "All Testimonials", color: "#64748B" },
  { id: "academic", label: "Academic", color: "#10B981" },
  { id: "professional", label: "Professional", color: "#22D3EE" },
  { id: "client", label: "Client Work", color: "#8B5CF6" },
  { id: "competition", label: "Competitions", color: "#F59E0B" }
];

export const getTestimonialsByCategory = (category) => {
  if (category === "all") return testimonials;
  
  const categoryMap = {
    academic: ["college-professor", "project-teammate", "workshop-participant"],
    professional: ["mentor-senior", "freelance-client"],
    client: ["freelance-client"],
    competition: ["competition-judge"]
  };
  
  const ids = categoryMap[category] || [];
  return testimonials.filter(testimonial => ids.includes(testimonial.id));
};

export const getTestimonialById = (id) => {
  return testimonials.find(testimonial => testimonial.id === id);
};

export const getAverageRating = () => {
  const totalRating = testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0);
  return (totalRating / testimonials.length).toFixed(1);
};

export const getSkillsFromTestimonials = () => {
  const allSkills = testimonials.flatMap(testimonial => testimonial.skills_highlighted);
  const skillCounts = allSkills.reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(skillCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([skill, count]) => ({ skill, count }));
};