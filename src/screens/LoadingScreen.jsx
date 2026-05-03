import { useState, useEffect, useRef } from 'react'

const BOOT_LINES = [
  'Initializing navigation systems...',
  'Calibrating wormhole drive...',
  'Loading star charts for Sector 7-Gamma...',
  'Syncing crew manifest...',
  'Arming weapon systems...',
  'All systems nominal.',
]

const DURATION = 2000 // ms to fill bar

export default function LoadingScreen({ onReady }) {
  const [progress,  setProgress]  = useState(0)
  const [lineIdx,   setLineIdx]   = useState(0)
  const [ready,     setReady]     = useState(false)
  const [launching, setLaunching] = useState(false)
  const launched = useRef(false)

  const launch = () => {
    if (launched.current) return
    launched.current = true
    setLaunching(true)
    setTimeout(onReady, 500)
  }

  // Fixed-duration progress — no randomness, never stalls
  useEffect(() => {
    const start = performance.now()
    let raf

    const tick = (now) => {
      const elapsed = now - start
      const pct = Math.min(100, (elapsed / DURATION) * 100)
      setProgress(pct)
      setLineIdx(Math.min(
        BOOT_LINES.length - 1,
        Math.floor((pct / 100) * BOOT_LINES.length),
      ))
      if (pct < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setReady(true)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Auto-advance 1.5 s after ready — user never gets stuck
  useEffect(() => {
    if (!ready) return
    const t = setTimeout(launch, 1500)
    return () => clearTimeout(t)
  }, [ready]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`loading-screen${launching ? ' loading-exit' : ''}`}>
      <div className="loading-inner">
        <div className="loading-logo">
          <div className="loading-title">SPACE SCOUTS</div>
          <div className="loading-sub">FRONTIER COMMAND · PROTOTYPE v0.1</div>
        </div>

        <div className="loading-emblem">🚀</div>

        <div className="loading-boot">
          {BOOT_LINES.slice(0, lineIdx + 1).map((line, i) => (
            <div key={i} className={`boot-line${i === lineIdx ? ' boot-active' : ''}`}>
              <span className="boot-prefix">{'>'}</span> {line}
            </div>
          ))}
        </div>

        <div className="loading-bar-wrap">
          <div className="loading-bar-label">
            <span>SYSTEM BOOT</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="loading-bar-bg">
            <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className={`loading-btn-wrap${ready ? ' loading-btn-visible' : ''}`}>
          <button className="btn btn-cyan loading-launch-btn" onClick={launch}>
            ▶ LAUNCH MISSION
          </button>
          <div className="loading-lore">
            Sector 7-Gamma · 3 contracts await · Wormhole stable
          </div>
        </div>
      </div>
    </div>
  )
}
