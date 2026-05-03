import { useState, useEffect } from 'react'

const BOOT_LINES = [
  'Initializing navigation systems...',
  'Calibrating wormhole drive...',
  'Loading star charts for Sector 7-Gamma...',
  'Syncing crew manifest...',
  'Arming weapon systems...',
  'All systems nominal.',
]

export default function LoadingScreen({ onReady }) {
  const [progress,    setProgress]    = useState(0)
  const [lineIdx,     setLineIdx]     = useState(0)
  const [ready,       setReady]       = useState(false)
  const [launching,   setLaunching]   = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + (Math.random() * 6 + 2)
        return next >= 100 ? 100 : next
      })
    }, 120)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) setReady(true)
    const step = Math.floor((progress / 100) * BOOT_LINES.length)
    setLineIdx(Math.min(step, BOOT_LINES.length - 1))
  }, [progress])

  const handleLaunch = () => {
    setLaunching(true)
    setTimeout(onReady, 600)
  }

  return (
    <div className={`loading-screen${launching ? ' loading-exit' : ''}`}>
      <div className="loading-inner">
        {/* Logo */}
        <div className="loading-logo">
          <div className="loading-title">SPACE SCOUTS</div>
          <div className="loading-sub">FRONTIER COMMAND · PROTOTYPE v0.1</div>
        </div>

        {/* Ship emblem */}
        <div className="loading-emblem">🚀</div>

        {/* Boot log */}
        <div className="loading-boot">
          {BOOT_LINES.slice(0, lineIdx + 1).map((line, i) => (
            <div key={i} className={`boot-line${i === lineIdx ? ' boot-active' : ''}`}>
              <span className="boot-prefix">{'>'}</span> {line}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="loading-bar-wrap">
          <div className="loading-bar-label">
            <span>SYSTEM BOOT</span>
            <span>{Math.min(100, Math.round(progress))}%</span>
          </div>
          <div className="loading-bar-bg">
            <div className="loading-bar-fill" style={{ width: `${Math.min(100, progress)}%` }} />
          </div>
        </div>

        {/* Launch button */}
        <div className={`loading-btn-wrap${ready ? ' loading-btn-visible' : ''}`}>
          <button className="btn btn-cyan loading-launch-btn" onClick={handleLaunch} disabled={!ready}>
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
