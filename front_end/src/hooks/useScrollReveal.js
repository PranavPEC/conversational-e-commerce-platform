import { useEffect, useRef, useState } from 'react'

// ── Scroll Reveal ──
// Reusable hook so PerksBar, FeaturedProducts, SocialProofBanner (and any
// future section) can fade + slide up into view without duplicating
// IntersectionObserver setup in each component.
//
// Usage:
//   const [ref, isVisible] = useScrollReveal()
//   <section ref={ref} className={`... ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//
// Reveals once and stays visible — scrolling back up won't re-hide the
// section, which feels more natural than re-triggering every time.
function useScrollReveal({ threshold = 0.15 } = {}) {
    const ref = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const node = ref.current
        if (!node) return

        // Element already on screen on mount (e.g. tall viewport) — skip the
        // observer round-trip and reveal immediately.
        const rect = node.getBoundingClientRect()
        if (rect.top < window.innerHeight * (1 - threshold)) {
            setIsVisible(true)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(node)
                }
            },
            { threshold }
        )

        observer.observe(node)

        return () => observer.disconnect()
    }, [threshold])

    return [ref, isVisible]
}

export default useScrollReveal