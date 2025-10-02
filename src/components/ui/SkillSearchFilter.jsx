import React, { useState, useEffect, useRef } from 'react'
import { skillCategories } from '../../data/skills'

const SkillSearchFilter = ({ 
  onSearch, 
  onFilter, 
  onSort,
  searchTerm = '',
  activeFilters = [],
  sortBy = 'name',
  totalResults = 0
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const searchInputRef = useRef(null)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(localSearchTerm)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [localSearchTerm, onSearch])

  // Filter options
  const proficiencyFilters = [
    { id: 'expert', label: 'Expert (90%+)', min: 90, max: 100 },
    { id: 'advanced', label: 'Advanced (75-89%)', min: 75, max: 89 },
    { id: 'intermediate', label: 'Intermediate (60-74%)', min: 60, max: 74 },
    { id: 'beginner', label: 'Beginner (<60%)', min: 0, max: 59 }
  ]

  const experienceFilters = [
    { id: '3plus', label: '3+ Years', value: '3+' },
    { id: '2plus', label: '2+ Years', value: '2+' },
    { id: '1plus', label: '1+ Years', value: '1+' },
    { id: 'academic', label: 'Academic', value: 'Academic' }
  ]

  const sortOptions = [
    { id: 'name', label: 'Name (A-Z)' },
    { id: 'proficiency', label: 'Proficiency (High-Low)' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Project Count' }
  ]

  const handleFilterToggle = (filterType, filterId) => {
    if (onFilter) {
      const filterKey = `${filterType}-${filterId}`
      const newFilters = activeFilters.includes(filterKey)
        ? activeFilters.filter(f => f !== filterKey)
        : [...activeFilters, filterKey]
      onFilter(newFilters)
    }
  }

  const handleClearFilters = () => {
    setLocalSearchTerm('')
    if (onSearch) onSearch('')
    if (onFilter) onFilter([])
    if (onSort) onSort('name')
  }

  return (
    <div className="skill-search-filter">
      {/* Main Search Bar */}
      <div className="relative mb-6">
        <div className={`relative transition-all duration-300 ${
          isSearchFocused ? 'scale-105' : 'scale-100'
        }`}>
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-neutral-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Search Input */}
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search skills..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`glass-input w-full pl-12 pr-12 py-4 rounded-xl text-lg focus:ring-2 focus:ring-accent-cyan focus:ring-opacity-50 transition-all duration-300 ${
              isSearchFocused ? 'shadow-glow' : ''
            }`}
          />
          
          {/* Clear Search Button */}
          {localSearchTerm && (
            <button
              onClick={() => setLocalSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-slate hover:text-accent-cyan transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {skillCategories.slice(1).map((category) => (
            <button
              key={category.id}
              onClick={() => handleFilterToggle('category', category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeFilters.includes(`category-${category.id}`)
                  ? 'bg-accent-cyan text-primary-dark shadow-glow'
                  : 'glass-button hover:bg-accent-cyan hover:bg-opacity-10 hover:text-accent-cyan'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => onSort && onSort(e.target.value)}
            className="glass-input px-4 py-2 rounded-lg text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters & Results */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-neutral-slate">Active filters:</span>
            {activeFilters.map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center px-3 py-1 text-xs bg-accent-cyan bg-opacity-20 text-accent-cyan rounded-full"
              >
                {filter.replace('-', ': ')}
                <button
                  onClick={() => {
                    const newFilters = activeFilters.filter(f => f !== filter)
                    if (onFilter) onFilter(newFilters)
                  }}
                  className="ml-2 hover:text-cyan-300 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={handleClearFilters}
              className="text-xs text-neutral-slate hover:text-accent-cyan transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-neutral-slate">
          {totalResults} skill{totalResults !== 1 ? 's' : ''} found
        </div>
      </div>
    </div>
  )
}

export default SkillSearchFilter