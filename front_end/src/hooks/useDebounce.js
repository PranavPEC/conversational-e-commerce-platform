import { useEffect, useState } from 'react'

// ── useDebounce ──
// Reusable debounce hook for delaying rapid state changes (like search input)
// before triggering side-effects such as API requests.
function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => clearTimeout(timerId)
    }, [value, delay])

    return debouncedValue
}

export default useDebounce
