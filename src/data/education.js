// Education data model for Mukul Batra

export const education = [
  {
    id: 'btech-cs',
    degree: 'B.Tech in Computer Science',
    institution: 'The Technological Institute of Textile and Sciences, Bhiwani',
    location: 'Bhiwani, Haryana',
    period: '2022 – 2026',
    status: 'ongoing',
    cgpa: '7.9',
    description: 'Pursuing Bachelor of Technology in Computer Science with focus on software development, algorithms, and modern web technologies.',
    coursework: [
      'Data Structures and Algorithms',
      'Database Management Systems',
      'Operating Systems',
      'Computer Networks',
      'Software Engineering',
      'Object-Oriented Programming',
      'Web Development',
      'Machine Learning Fundamentals'
    ],
    achievements: [
      'Maintained 7.9 CGPA throughout the program',
      'Active participant in coding competitions',
      'Led multiple academic projects using MERN stack',
      'Winner of Code War competition (April 2024)',
      'Second position in Graphico Tech design event (October 2024)'
    ],
    projects: [
      'PortMySim - SIM porting web application',
      'SydneyEvent - Event management platform',
      'PixiSphere - Interactive 3D visualization'
    ],
    skills: [
      'Java Programming',
      'JavaScript & ES6+',
      'React.js Development',
      'Node.js & Express.js',
      'MongoDB & MySQL',
      'RESTful API Design',
      'Git Version Control'
    ],
    icon: '🎓',
    color: '#22D3EE',
    image: '/assets/images/tits-logo.png'
  },
  {
    id: 'class-12',
    degree: 'Higher Secondary Education (12th)',
    institution: 'Senior Secondary School',
    location: 'Bhiwani, Haryana',
    period: '2020 – 2022',
    status: 'completed',
    percentage: '85%',
    stream: 'Science (PCM)',
    description: 'Completed higher secondary education with Science stream focusing on Physics, Chemistry, and Mathematics.',
    subjects: [
      'Physics',
      'Chemistry', 
      'Mathematics',
      'English',
      'Computer Science'
    ],
    achievements: [
      'Scored 85% in board examinations',
      'Excelled in Mathematics and Computer Science',
      'Participated in science exhibitions',
      'Member of school computer club'
    ],
    icon: '📚',
    color: '#3B82F6',
    image: '/assets/images/school-logo.png'
  },
  {
    id: 'class-10',
    degree: 'Secondary Education (10th)',
    institution: 'Secondary School',
    location: 'Bhiwani, Haryana',
    period: '2018 – 2020',
    status: 'completed',
    percentage: '82%',
    description: 'Completed secondary education with strong foundation in core subjects and early interest in computer science.',
    subjects: [
      'Mathematics',
      'Science',
      'English',
      'Hindi',
      'Social Studies'
    ],
    achievements: [
      'Scored 82% in board examinations',
      'Class representative for 2 consecutive years',
      'Participated in inter-school competitions',
      'Developed early interest in programming'
    ],
    icon: '🏫',
    color: '#10B981',
    image: '/assets/images/secondary-school-logo.png'
  }
]

// Helper functions for education data
export const getCurrentEducation = () => {
  return education.find(edu => edu.status === 'ongoing')
}

export const getCompletedEducation = () => {
  return education.filter(edu => edu.status === 'completed')
}

export const getEducationByLevel = (level) => {
  return education.find(edu => edu.id.includes(level))
}

export const getAllSkillsFromEducation = () => {
  return education
    .filter(edu => edu.skills)
    .flatMap(edu => edu.skills)
    .filter((skill, index, array) => array.indexOf(skill) === index) // Remove duplicates
}

export const getEducationTimeline = () => {
  return education.sort((a, b) => {
    // Sort by start year (descending - most recent first)
    const yearA = parseInt(a.period.split(' – ')[0])
    const yearB = parseInt(b.period.split(' – ')[0])
    return yearB - yearA
  })
}

export const getEducationStats = () => {
  const totalInstitutions = education.length
  const currentEducation = getCurrentEducation()
  const completedEducation = getCompletedEducation()
  const totalYears = education.reduce((total, edu) => {
    const [start, end] = edu.period.split(' – ')
    const startYear = parseInt(start)
    const endYear = end === 'Present' ? new Date().getFullYear() : parseInt(end)
    return total + (endYear - startYear)
  }, 0)

  return {
    totalInstitutions,
    currentEducation: currentEducation?.degree || 'None',
    completedCount: completedEducation.length,
    totalYears,
    currentCGPA: currentEducation?.cgpa || null,
    currentStatus: currentEducation?.status || 'completed'
  }
}

export default education