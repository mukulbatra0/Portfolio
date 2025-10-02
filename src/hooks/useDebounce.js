import { useState, useEffect } from 'react'

/**
 * Custom hook for debouncing values
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - Debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Custom hook for debounced search functionality
 * @param {string} searchTerm - The search term
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {string} - Debounced search term
 */
export const useDebouncedSearch = (searchTerm, delay = 300) => {
  return useDebounce(searchTerm, delay)
}

export default useDebounce