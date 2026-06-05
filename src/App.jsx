import { useState, useEffect, useCallback } from 'react'
import { INIT_META, SAVE_KEY } from './data'
import { loadMeta, saveMeta } from './game'

import StarField      from './components/StarField'
import TopBar         from './components/TopBar'
import LoadingScreen  from './screens/LoadingScreen'
import StationScreen  from './screens/StationScreen'
import RunScreen      from './screens/RunScreen'
import SummaryScreen  from './screens/SummaryScreen'

export default function App() {
  const [screen, setScreen] = useState('loading')
  const [meta, setMeta]     = useState(() => loadMeta(SAVE_KEY, INIT_META))
  const [result, setResult] = useState(null)
  const [newBest, setNewBest] = useState(false)

  // persist meta whenever it changes
  useEffect(() => { saveMeta(SAVE_KEY, meta) }, [meta])

  const startRun = useCallback(() => {
    setMeta((m) => ({ ...m, totalRuns: m.totalRuns + 1 }))
    setResult(null)
    setNewBest(false)
    setScreen('run')
  }, [])

  const endRun = useCallback((r) => {
    const best = r.reached > meta.bestDepth
    setNewBest(best)
    setMeta((m) => ({
      ...m,
      credits: m.credits + (r.creditsEarned || 0),
      crystals: m.crystals + (r.reached >= 5 ? Math.floor(r.reached / 5) : 0),
      bestDepth: Math.max(m.bestDepth, r.reached),
      totalKills: m.totalKills + (r.kills || 0),
    }))
    setResult(r)
    setScreen('summary')
  }, [meta.bestDepth])

  return (
    <div className="ss">
      <StarField />
      {screen === 'loading' && <LoadingScreen onReady={() => setScreen('station')} />}
      {screen !== 'loading' && screen !== 'run' && (
        <TopBar meta={meta} screen={screen} onBack={() => setScreen('station')} />
      )}

      {screen === 'station' && <StationScreen meta={meta} setMeta={setMeta} onJump={startRun} />}
      {screen === 'run'     && <RunScreen meta={meta} onEnd={endRun} />}
      {screen === 'summary' && (
        <SummaryScreen result={result} meta={meta} newBest={newBest} onContinue={() => setScreen('station')} />
      )}
    </div>
  )
}
