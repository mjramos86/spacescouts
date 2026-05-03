import { useState, useEffect } from 'react'
import { deepClone } from './utils'
import { INIT_STATE } from './data'
import CSS from './styles'

import StarField       from './components/StarField'
import TopBar          from './components/TopBar'
import HubScreen       from './screens/HubScreen'
import SurfaceCombat   from './screens/SurfaceCombat'
import SpaceCombat     from './screens/SpaceCombat'
import CharacterScreen from './screens/CharacterScreen'
import RewardScreen    from './screens/RewardScreen'
import LoadingScreen   from './screens/LoadingScreen'

export default function App() {
  const [screen, setScreen] = useState('loading')
  const [gs, setGs]         = useState(deepClone(INIT_STATE))
  const [result, setResult] = useState(null)

  // Inject global CSS
  useEffect(() => {
    const el = document.createElement('style')
    el.id = 'ss-style'
    el.textContent = CSS
    document.head.appendChild(el)
    return () => document.getElementById('ss-style')?.remove()
  }, [])

  const handleCombatComplete = (r) => {
    setResult(r)
    if (r.victory) {
      setGs(prev => ({
        ...prev,
        captain: { ...prev.captain, xp: prev.captain.xp + (r.xpGain || 0) },
        ship:    { ...prev.ship,    xp: prev.ship.xp    + Math.floor((r.xpGain || 0) * 0.6) },
        credits: prev.credits + (r.credits || 0),
      }))
    }
    setScreen('reward')
  }

  const navBack = () => setScreen('hub')

  return (
    <div className="ss">
      <StarField />
      {screen === 'loading' && <LoadingScreen onReady={() => setScreen('hub')} />}
      {screen !== 'loading' && <TopBar gs={gs} screen={screen} onBack={navBack} />}

      {screen === 'hub'       && <HubScreen       onNavigate={setScreen} gs={gs} />}
      {screen === 'surface'   && <SurfaceCombat   gs={gs} onComplete={handleCombatComplete} />}
      {screen === 'space'     && <SpaceCombat      gs={gs} onComplete={handleCombatComplete} />}
      {screen === 'character' && <CharacterScreen  gs={gs} />}
      {screen === 'ship'      && <CharacterScreen  gs={gs} />}
      {screen === 'crew'      && <CharacterScreen  gs={gs} />}
      {screen === 'reward'    && <RewardScreen     result={result} onContinue={navBack} />}
    </div>
  )
}
