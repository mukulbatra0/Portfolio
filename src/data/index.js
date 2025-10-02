// Central data exports

export { personalInfo } from './personalInfo.js'
export { skills, skillCategories, getAllSkills, getSkillsByCategory } from './skills.js'
export { projects, projectCategories, getProjectsByCategory, getProjectById, getFeaturedProjects } from './projects.js'
export { education, getEducationByLevel, getCurrentEducation, getCompletedEducation } from './education.js'
export { achievements, achievementCategories, getAchievementsByCategory, getAchievementsByYear, getRecentAchievements, getAchievementStats } from './achievements.js'
export { experience, experienceTypes, getExperienceByType, getCurrentExperience, getPastExperience, getTotalExperienceDuration, getExperienceStats } from './experience.js'
export { testimonials, testimonialCategories, getTestimonialsByCategory, getTestimonialsByRating, getRecentTestimonials, getVerifiedTestimonials, getTestimonialStats, getSkillsFromTestimonials } from './testimonials.js'