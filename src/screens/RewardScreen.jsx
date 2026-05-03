export default function RewardScreen({ result, onContinue }) {
  if (!result.victory) {
    return (
      <div className="reward">
        <div className="reward-title" style={{ color: 'var(--red)', textShadow: '0 0 40px rgba(255,51,85,.5)' }}>
          MISSION FAILED
        </div>
        <p style={{ fontFamily: 'var(--f3)', color: 'var(--muted)', fontSize: 13 }}>
          Your crew managed to retreat. No loot recovered.
        </p>
        <button className="btn btn-red" onClick={onContinue}>RETURN TO STATION</button>
      </div>
    )
  }

  return (
    <div className="reward float-in">
      <div className="reward-title">MISSION COMPLETE</div>

      <div className="reward-box">
        <div>
          <div className="reward-section-title">EXPERIENCE GAINED</div>
          <div className="xp-gained"><span>Captain XP</span><span>+{result.xpGain}</span></div>
          <div className="xp-gained"><span>Ship XP</span><span>+{Math.floor(result.xpGain * 0.6)}</span></div>
          <div className="xp-gained"><span>Robot XP (each)</span><span>+{Math.floor(result.xpGain * 0.4)}</span></div>
        </div>

        <div>
          <div className="reward-section-title">CREDITS RECOVERED</div>
          <div className="xp-gained">
            <span>Credits</span>
            <span style={{ color: 'var(--gold)' }}>+{result.credits.toLocaleString()} ₢</span>
          </div>
        </div>

        {result.loot?.length > 0 && (
          <div>
            <div className="reward-section-title">LOOT DROPS</div>
            {result.loot.map((item, i) => (
              <div key={i} className="loot-item">
                <span className="loot-rar" style={{ borderColor: item.col, color: item.col }}>
                  {item.rar.toUpperCase()}
                </span>
                <span className="loot-name" style={{ color: item.col }}>{item.name}</span>
                <span className="loot-stat">{item.st}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="btn btn-gold" onClick={onContinue}>RETURN TO STATION →</button>
    </div>
  )
}
