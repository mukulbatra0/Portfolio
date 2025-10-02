import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { SECTIONS } from '../../utils/constants'
import { skills, skillCategories, getSkillsByCategory } from '../../data/skills'
import { useDebouncedSearch } from '../../hooks/useDebounce'

const Skills = React.memo(() => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Debounce search for better performance
  const debouncedSearchTerm = useDebouncedSearch(searchTerm, 300)

  // Memoize filtered skills for better performance
  const filteredSkills = useMemo(() => {
    let categorySkills = getSkillsByCategory(activeCategory)
    
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim()
      categorySkills = categorySkills.filter(skill =>
        skill.name.toLowerCase().includes(searchLower) ||
        skill.projects?.some(project => 
          project.toLowerCase().includes(searchLower)
        )
      )
    }
    
    return categorySkills
  }, [activeCategory, debouncedSearchTerm])

  // Debounced search handler
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])

  // Memoize skill statistics for performance
  const stats = useMemo(() => {
    const allSkills = Object.values(skills).flat()
    const totalSkills = allSkills.length
    const averageProficiency = Math.round(
      allSkills.reduce((sum, skill) => sum + skill.proficiency, 0) / totalSkills
    )
    const expertSkills = allSkills.filter(skill => skill.proficiency >= 90).length
    const categories = Object.keys(skills).length

    return { totalSkills, averageProficiency, expertSkills, categories }
  }, [])

  // Get skill icon
  const getSkillIcon = (skillName) => {
    const iconMap = {
      'Java': '☕',
      'JavaScript (ES6+)': '🟨',
      'SQL': '🗃️',
      'HTML5': '🌐',
      'CSS3': '🎨',
      'React.js': '⚛️',
      'HTML': '📄',
      'CSS': '🎨',
      'Tailwind CSS': '💨',
      'Bootstrap': '🅱️',
      'Material UI': '🎭',
      'Node.js': '🟢',
      'Express.js': '🚂',
      'MongoDB': '🍃',
      'MySQL': '🐬',
      'Git': '📚',
      'GitHub': '🐙',
      'VS Code': '💻',
      'npm': '📦',
      'DSA': '🧮',
      'OOP': '🏗️',
      'RESTful APIs': '🔗',
      'SDLC': '🔄',
      'Operating Systems': '💾',
      'DBMS': '🗄️',
      'Computer Networks': '🌐'
    }
    return iconMap[skillName] || '⚡'
  }

  // Get proficiency level
  const getProficiencyLevel = (proficiency) => {
    if (proficiency >= 90) return { level: 'Expert', color: 'text-green-400', bgColor: 'bg-green-400' }
    if (proficiency >= 75) return { level: 'Advanced', color: 'text-blue-400', bgColor: 'bg-blue-400' }
    if (proficiency >= 60) return { level: 'Intermediate', color: 'text-yellow-400', bgColor: 'bg-yellow-400' }
    return { level: 'Beginner', color: 'text-orange-400', bgColor: 'bg-orange-400' }
  }

  return (
    <section 
      id={SECTIONS.SKILLS}
      className="section-spacing relative overflow-hidden bg-primary-dark"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-cyan/10" />
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-heading-2 font-bold text-gradient-primary mb-4">
            🚀 Technical Skills
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent mx-auto rounded-full mb-6" />
          <p className="text-body-large text-neutral-slate max-w-2xl mx-auto">
            Mastering the tools and technologies that power modern web development
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          {[
            { label: 'Technologies', value: stats.totalSkills, icon: '⚡' },
            { label: 'Proficiency', value: `${stats.averageProficiency}%`, icon: '🎯' },
            { label: 'Expert Level', value: stats.expertSkills, icon: '🏆' },
            { label: 'Categories', value: stats.categories, icon: '📚' }
          ].map((stat, index) => (
            <div key={stat.label} className="glass-card text-center p-6 hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-accent-cyan mb-2">{stat.value}</div>
              <div className="text-sm text-neutral-slate font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-neutral-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="glass-input w-full pl-12 pr-4 py-4 rounded-xl text-lg"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {skillCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeCategory === category.id
                  ? 'bg-accent-cyan text-primary-dark'
                  : 'glass-button hover:bg-accent-cyan/20 hover:text-accent-cyan'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Debug Info */}
        <div className="text-center mb-8">
          <p className="text-sm text-neutral-slate">
            Showing {filteredSkills.length} skills in category: {activeCategory}
          </p>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {filteredSkills.map((skill) => {
              const proficiencyInfo = getProficiencyLevel(skill.proficiency)
              return (
                <SkillCard 
                  key={skill.name} 
                  skill={skill} 
                  proficiencyInfo={proficiencyInfo}
                  getSkillIcon={getSkillIcon}
                />
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-heading-4 font-semibold text-neutral-slate mb-4">
              No skills found
            </h3>
            <p className="text-body text-neutral-slate mb-6">
              Try adjusting your search or selecting a different category
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setActiveCategory('all')
              }}
              className="btn-primary"
            >
              Show All Skills
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass-card max-w-4xl mx-auto p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="text-6xl mr-4">🚀</div>
              <h3 className="text-heading-3 font-bold text-gradient-primary">
                Ready to Build Something Amazing?
              </h3>
            </div>
            
            <p className="text-body text-neutral-slate mb-8 max-w-2xl mx-auto">
              With expertise across {stats.totalSkills} technologies 
              and an average proficiency of {stats.averageProficiency}%, 
              I'm ready to tackle your next challenge.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="btn-primary"
                onClick={() => {
                  const element = document.getElementById(SECTIONS.PROJECTS)
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Explore My Projects
              </button>
              
              <button 
                className="btn-secondary"
                onClick={() => {
                  const element = document.getElementById(SECTIONS.CONTACT)
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Let's Collaborate
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
)
// Optimized SkillCard component with React.memo
const SkillCard = React.memo(({ skill, proficiencyInfo, getSkillIcon }) => {
  return (
    <div className="glass-card p-6 hover:scale-105 transition-all duration-300 will-change-transform">
      {/* Skill Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/5 flex items-center justify-center text-2xl">
            {getSkillIcon(skill.name)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-light-gray">{skill.name}</h3>
            <p className="text-xs text-neutral-slate">{skill.experience}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-accent-cyan">{skill.proficiency}%</div>
          <div className="text-xs text-neutral-slate">{proficiencyInfo.level}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-neutral-slate">Proficiency</span>
          <span className="text-sm font-medium text-accent-cyan">{skill.proficiency}%</span>
        </div>
        <div className="relative h-3 bg-neutral-slate/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-cyan to-cyan-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${skill.proficiency}%` }}
          />
        </div>
      </div>

      {/* Projects */}
      {skill.projects && skill.projects.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-neutral-slate mb-2">Projects</h5>
          <div className="flex flex-wrap gap-1">
            {skill.projects.slice(0, 2).map((project) => (
              <span
                key={project}
                className="text-xs px-2 py-1 bg-accent-cyan/10 text-accent-cyan rounded-full border border-accent-cyan/20"
              >
                {project}
              </span>
            ))}
            {skill.projects.length > 2 && (
              <span className="text-xs px-2 py-1 bg-neutral-slate/20 text-neutral-slate rounded-full">
                +{skill.projects.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Proficiency Badge */}
      <div className="absolute top-4 right-4">
        <div className={`w-3 h-3 rounded-full ${proficiencyInfo.bgColor}`} />
      </div>
    </div>
  )
})

SkillCard.displayName = 'SkillCard'

export default Skills