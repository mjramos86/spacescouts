import { useEffect, useRef } from 'react'

export default function StarField() {
  const ref = useRef(null)

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    let raf, W, H

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * 9999,
      y: Math.random() * 9999,
      z: Math.random() * 2 + 0.2,
      flicker: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.003 + 0.001,
    }))

    const resize = () => {
      W = c.width  = window.innerWidth
      H = c.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let t = 0
    const draw = () => {
      t += 0.016
      ctx.clearRect(0, 0, W, H)
      for (const s of stars) {
        s.flicker += s.speed
        const alpha = 0.3 + Math.sin(s.flicker) * 0.2
        const size  = s.z * 0.8
        const sx = ((s.x + t * 8) % W + W) % W
        const sy = ((s.y + t * 2) % H + H) % H
        ctx.beginPath()
        ctx.arc(sx, sy, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,215,255,${alpha})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas className="stars" ref={ref} />
}
