// Technology color mapping system for consistent visual styling

/**
 * Comprehensive technology color mappings
 * Each technology has a consistent color scheme with background, text, and border colors
 * Format: 'bg-{color}-{shade}/20 text-{color}-{lightShade} border-{color}-{shade}/30'
 */
export const technologyColors = {
  // Frontend Frameworks & Libraries
  'React.js': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Vue.js': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Angular': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Svelte': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  
  // Backend Frameworks & Runtime
  'Node.js': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Express.js': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  'Next.js': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  'Nuxt.js': 'bg-green-600/20 text-green-400 border-green-600/30',
  'Fastify': 'bg-gray-600/20 text-gray-400 border-gray-600/30',
  
  // Databases
  'MongoDB': 'bg-green-600/20 text-green-400 border-green-600/30',
  'PostgreSQL': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  'MySQL': 'bg-orange-600/20 text-orange-400 border-orange-600/30',
  'Redis': 'bg-red-600/20 text-red-400 border-red-600/30',
  'SQLite': 'bg-blue-700/20 text-blue-400 border-blue-700/30',
  
  // Programming Languages
  'JavaScript': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'JavaScript (ES6+)': 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  'TypeScript': 'bg-blue-700/20 text-blue-400 border-blue-700/30',
  'Python': 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  'Java': 'bg-orange-700/20 text-orange-400 border-orange-700/30',
  'C#': 'bg-purple-700/20 text-purple-400 border-purple-700/30',
  'Go': 'bg-cyan-600/20 text-cyan-400 border-cyan-600/30',
  'Rust': 'bg-orange-800/20 text-orange-400 border-orange-800/30',
  'PHP': 'bg-indigo-600/20 text-indigo-400 border-indigo-600/30',
  
  // Styling & CSS
  'CSS3': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  'Tailwind CSS': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Bootstrap': 'bg-purple-600/20 text-purple-400 border-purple-600/30',
  'Sass': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'SCSS': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Styled Components': 'bg-pink-600/20 text-pink-400 border-pink-600/30',
  'Emotion': 'bg-pink-700/20 text-pink-400 border-pink-700/30',
  
  // Markup & Templating
  'HTML5': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'EJS': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'Handlebars': 'bg-orange-600/20 text-orange-400 border-orange-600/30',
  'Pug': 'bg-amber-600/20 text-amber-400 border-amber-600/30',
  
  // 3D & Graphics
  'Three.js': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'WebGL': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Canvas API': 'bg-red-600/20 text-red-400 border-red-600/30',
  'D3.js': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  
  // APIs & Services
  'RESTful APIs': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'GraphQL': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'WebSocket': 'bg-green-700/20 text-green-400 border-green-700/30',
  'Socket.io': 'bg-slate-600/20 text-slate-400 border-slate-600/30',
  'JSON': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  
  // Testing
  'Jest': 'bg-red-700/20 text-red-400 border-red-700/30',
  'Vitest': 'bg-yellow-700/20 text-yellow-400 border-yellow-700/30',
  'Cypress': 'bg-green-800/20 text-green-400 border-green-800/30',
  'Playwright': 'bg-blue-800/20 text-blue-400 border-blue-800/30',
  
  // Build Tools & Bundlers
  'Webpack': 'bg-blue-700/20 text-blue-400 border-blue-700/30',
  'Vite': 'bg-purple-600/20 text-purple-400 border-purple-600/30',
  'Rollup': 'bg-red-600/20 text-red-400 border-red-600/30',
  'Parcel': 'bg-amber-600/20 text-amber-400 border-amber-600/30',
  
  // Cloud & DevOps
  'AWS': 'bg-orange-600/20 text-orange-400 border-orange-600/30',
  'Docker': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  'Kubernetes': 'bg-blue-700/20 text-blue-400 border-blue-700/30',
  'Vercel': 'bg-slate-700/20 text-slate-400 border-slate-700/30',
  'Netlify': 'bg-teal-600/20 text-teal-400 border-teal-600/30',
  
  // Mobile Development
  'React Native': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  'Flutter': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Ionic': 'bg-blue-700/20 text-blue-400 border-blue-700/30',
  
  // Version Control & Tools
  'Git': 'bg-orange-700/20 text-orange-400 border-orange-700/30',
  'GitHub': 'bg-gray-700/20 text-gray-400 border-gray-700/30',
  'GitLab': 'bg-orange-600/20 text-orange-400 border-orange-600/30',
  
  // State Management
  'Redux': 'bg-purple-600/20 text-purple-400 border-purple-600/30',
  'Zustand': 'bg-amber-600/20 text-amber-400 border-amber-600/30',
  'MobX': 'bg-orange-600/20 text-orange-400 border-orange-600/30',
  
  // Authentication & Security
  'JWT': 'bg-green-700/20 text-green-400 border-green-700/30',
  'OAuth': 'bg-blue-700/20 text-blue-400 border-blue-700/30',
  'Auth0': 'bg-orange-700/20 text-orange-400 border-orange-700/30',
  
  // CMS & Headless
  'Strapi': 'bg-indigo-600/20 text-indigo-400 border-indigo-600/30',
  'Contentful': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  'Sanity': 'bg-red-600/20 text-red-400 border-red-600/30'
}

/**
 * Color palette for generating default colors for unmapped technologies
 * Uses a variety of colors to ensure visual distinction
 */
const defaultColorPalette = [
  'bg-slate-500/20 text-slate-300 border-slate-500/30',
  'bg-gray-500/20 text-gray-300 border-gray-500/30',
  'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
  'bg-neutral-500/20 text-neutral-300 border-neutral-500/30',
  'bg-stone-500/20 text-stone-300 border-stone-500/30',
  'bg-red-500/20 text-red-300 border-red-500/30',
  'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'bg-lime-500/20 text-lime-300 border-lime-500/30',
  'bg-green-500/20 text-green-300 border-green-500/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'bg-sky-500/20 text-sky-300 border-sky-500/30',
  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
  'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'bg-rose-500/20 text-rose-300 border-rose-500/30'
]

/**
 * Cache for generated default colors to ensure consistency
 */
const generatedColorCache = new Map()

/**
 * Generates a consistent default color for unmapped technologies
 * Uses a hash-based approach to ensure the same technology always gets the same color
 * @param {string} technology - The technology name
 * @returns {string} - Tailwind CSS classes for the technology color
 */
export const generateDefaultTechnologyColor = (technology) => {
  if (!technology || typeof technology !== 'string') {
    return defaultColorPalette[0] // Return first color as fallback
  }
  
  // Check if we've already generated a color for this technology
  if (generatedColorCache.has(technology)) {
    return generatedColorCache.get(technology)
  }
  
  // Generate a simple hash from the technology name
  let hash = 0
  for (let i = 0; i < technology.length; i++) {
    const char = technology.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get a palette index
  const paletteIndex = Math.abs(hash) % defaultColorPalette.length
  const selectedColor = defaultColorPalette[paletteIndex]
  
  // Cache the generated color
  generatedColorCache.set(technology, selectedColor)
  
  return selectedColor
}

/**
 * Gets the appropriate color classes for a technology
 * Returns mapped color if available, otherwise generates a default color
 * @param {string} technology - The technology name
 * @returns {string} - Tailwind CSS classes for the technology color
 */
export const getTechnologyColor = (technology) => {
  if (!technology || typeof technology !== 'string') {
    return generateDefaultTechnologyColor('')
  }
  
  // Return mapped color if available
  if (technologyColors[technology]) {
    return technologyColors[technology]
  }
  
  // Generate and return default color for unmapped technology
  return generateDefaultTechnologyColor(technology)
}

/**
 * Gets all unique technologies from a projects array
 * @param {Array} projects - Array of project objects
 * @returns {Array} - Array of unique technology names
 */
export const getUniqueTechnologies = (projects = []) => {
  const allTechnologies = projects.flatMap(project => project.technologies || [])
  return [...new Set(allTechnologies)].sort()
}

/**
 * Gets technologies that don't have explicit color mappings
 * @param {Array} projects - Array of project objects
 * @returns {Array} - Array of unmapped technology names
 */
export const getUnmappedTechnologies = (projects = []) => {
  const uniqueTechnologies = getUniqueTechnologies(projects)
  return uniqueTechnologies.filter(tech => !technologyColors[tech])
}

/**
 * Generates a color mapping report for all technologies in projects
 * @param {Array} projects - Array of project objects
 * @returns {Object} - Report with mapped and unmapped technologies
 */
export const generateTechnologyColorReport = (projects = []) => {
  const uniqueTechnologies = getUniqueTechnologies(projects)
  const mappedTechnologies = uniqueTechnologies.filter(tech => technologyColors[tech])
  const unmappedTechnologies = getUnmappedTechnologies(projects)
  
  return {
    total: uniqueTechnologies.length,
    mapped: mappedTechnologies.length,
    unmapped: unmappedTechnologies.length,
    mappedTechnologies,
    unmappedTechnologies,
    mappingCoverage: uniqueTechnologies.length > 0 
      ? Math.round((mappedTechnologies.length / uniqueTechnologies.length) * 100) 
      : 100
  }
}

/**
 * Validates that all technology colors follow the expected format
 * @returns {Object} - Validation result with any invalid entries
 */
export const validateTechnologyColors = () => {
  const invalidEntries = []
  const expectedPattern = /^bg-\w+-\d+\/\d+ text-\w+-\d+ border-\w+-\d+\/\d+$/
  
  Object.entries(technologyColors).forEach(([tech, colorClasses]) => {
    if (!expectedPattern.test(colorClasses)) {
      invalidEntries.push({
        technology: tech,
        colorClasses,
        issue: 'Does not match expected format: bg-{color}-{shade}/{opacity} text-{color}-{shade} border-{color}-{shade}/{opacity}'
      })
    }
  })
  
  return {
    isValid: invalidEntries.length === 0,
    invalidEntries,
    totalEntries: Object.keys(technologyColors).length
  }
}

// Export the main color mapping object for backward compatibility
export default technologyColors