import { useEffect } from 'react'

const TOTAL_MS = 2800

const BOOT_LINES = [
  'Initializing navigation systems...',
  'Calibrating wormhole drive...',
  'Loading star charts for Sector 7-Gamma...',
  'Syncing crew manifest...',
  'Arming weapon systems...',
  'All systems nominal.',
]

export default function LoadingScreen({ onReady }) {
  // Single effect, single timeout — nothing can stall
  useEffect(() => {
    const t = setTimeout(onReady, TOTAL_MS)
    return () => clearTimeout(t)
  }, [onReady])

  return (
    <div className="loading-screen">
      <div className="loading-inner">
        <div className="loading-logo">
          <div className="loading-title">SPACE SCOUTS</div>
          <div className="loading-sub">FRONTIER COMMAND · PROTOTYPE v0.1</div>
        </div>

        <div className="loading-emblem">🚀</div>

        <div className="loading-boot">
          {BOOT_LINES.map((line, i) => (
            <div
              key={i}
              className="boot-line"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <span className="boot-prefix">{'>'}</span> {line}
            </div>
          ))}
        </div>

        <div className="loading-bar-wrap">
          <div className="loading-bar-label">
            <span>SYSTEM BOOT</span>
            <span className="loading-pct">100%</span>
          </div>
          <div className="loading-bar-bg">
            <div className="loading-bar-fill loading-bar-anim" />
          </div>
        </div>

        <button
          className="btn btn-cyan loading-launch-btn loading-btn-appear"
          onClick={onReady}
        >
          ▶ LAUNCH MISSION
        </button>
      </div>
    </div>
  )
}
