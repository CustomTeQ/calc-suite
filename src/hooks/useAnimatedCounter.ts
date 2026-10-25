import { useState, useEffect, useRef } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useAnimatedCounter(target: number, duration = 250): number {
  const [current, setCurrent] = useState(target)
  // Live on-screen value, so a new target starts from where the number is now, not the old target
  const liveRef = useRef(target)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const from = liveRef.current
    const diff = target - from
    if (diff === 0) return

    // Reduced motion (or zero duration) settles on the first frame instead of counting
    const instant = prefersReducedMotion() || duration <= 0
    const start = performance.now()

    function tick(now: number) {
      const progress = instant ? 1 : Math.min((now - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = from + diff * eased
      liveRef.current = value
      setCurrent(value)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  return current
}
