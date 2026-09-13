import { useEffect, useRef } from 'react'

type Listener = (x: number, y: number) => void

const listeners = new Set<Listener>()
let mx = typeof window !== 'undefined' ? window.innerWidth * 0.72 : 0
let my = typeof window !== 'undefined' ? window.innerHeight * 0.22 : 0
let rafId = 0
let scheduled = false

function flush() {
  scheduled = false
  document.documentElement.style.setProperty('--mx', mx + 'px')
  document.documentElement.style.setProperty('--my', my + 'px')
  listeners.forEach((fn) => fn(mx, my))
}

function schedule() {
  if (scheduled) return
  scheduled = true
  rafId = requestAnimationFrame(flush)
}

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX
    my = e.clientY
    schedule()
  })
  window.addEventListener(
    'touchmove',
    (e) => {
      const t = e.touches[0]
      if (!t) return
      mx = t.clientX
      my = t.clientY
      schedule()
    },
    { passive: true },
  )
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  schedule()
}

export function subscribeLight(fn: Listener) {
  listeners.add(fn)
  fn(mx, my)
  return () => {
    listeners.delete(fn)
  }
}

/**
 * Attach to an element: sets --sx / --sy (shadow vector away from the
 * cursor-light) and --sr (0..1 proximity ratio) as inline CSS vars.
 */
export function useLightShadow<T extends HTMLElement>(strength = 1) {
  const ref = useRef<T>(null)
  const s = useRef(strength)
  s.current = strength
  useEffect(() => {
    return subscribeLight((x, y) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.width === 0) return
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = cx - x
      const dy = cy - y
      const d = Math.hypot(dx, dy) || 1
      const len = Math.min(14 + 5200 / d, 96) * s.current
      el.style.setProperty('--sx', ((dx / d) * len).toFixed(1) + 'px')
      el.style.setProperty('--sy', ((dy / d) * len).toFixed(1) + 'px')
      el.style.setProperty('--sr', Math.min(1, 260 / d).toFixed(3))
    })
  }, [])
  return ref
}

export { rafId }
