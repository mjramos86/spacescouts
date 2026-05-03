const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Exo+2:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');

:root {
  --bg0:#02060f; --bg1:#060d1a; --bg2:#0b1628; --bg3:#101f38;
  --b1:#162a48;  --b2:#1e3c62; --b3:#2a5a90;
  --cyan:#00d4ff; --cyan2:#0088bb; --cyan3:rgba(0,212,255,.12);
  --gold:#ffc530; --gold2:#886a00;
  --green:#00e87a; --red:#ff3355; --purple:#aa44ff;
  --text:#cce0f8;  --dim:#4a6888; --muted:#8aa4c0;
  --f1:'Orbitron',sans-serif; --f2:'Exo 2',sans-serif; --f3:'Share Tech Mono',monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg0);overflow:hidden}

/* ─── ROOT ─── */
.ss{font-family:var(--f2);background:var(--bg0);color:var(--text);
  min-height:100vh;overflow:hidden;position:relative;user-select:none}
.ss::after{content:'';position:fixed;inset:0;
  background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.04) 3px,rgba(0,0,0,.04) 4px);
  pointer-events:none;z-index:9999}

/* ─── STARS CANVAS ─── */
.stars{position:fixed;inset:0;pointer-events:none;z-index:0}

/* ─── TOPBAR ─── */
.topbar{position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;
  padding:10px 20px;background:var(--bg1);border-bottom:1px solid var(--b2);
  font-family:var(--f1);font-size:11px;letter-spacing:.08em}
.topbar-logo{color:var(--cyan);font-size:15px;font-weight:700;text-shadow:0 0 20px var(--cyan)}
.topbar-logo span{color:var(--gold);font-size:10px;margin-left:8px;font-family:var(--f2);letter-spacing:.15em}
.topbar-right{display:flex;gap:20px;align-items:center}
.stat-pill{display:flex;align-items:center;gap:6px;background:var(--bg2);border:1px solid var(--b1);
  padding:4px 10px;border-radius:2px;font-family:var(--f3);font-size:11px}
.stat-pill .lbl{color:var(--dim);font-size:10px}
.stat-pill .val{color:var(--cyan)}
.stat-pill .val.gold{color:var(--gold)}

/* ─── HUB ─── */
.hub{position:relative;z-index:5;padding:16px 20px;display:flex;flex-direction:column;height:calc(100vh - 48px)}
.hub-header{margin-bottom:16px}
.hub-title{font-family:var(--f1);font-size:22px;font-weight:900;color:var(--cyan);
  text-shadow:0 0 30px rgba(0,212,255,.5);letter-spacing:.08em}
.hub-sub{font-family:var(--f3);font-size:11px;color:var(--dim);margin-top:3px;letter-spacing:.1em}
.hub-grid{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(2,1fr);gap:10px;flex:1}
.hub-panel{background:var(--bg2);border:1px solid var(--b1);border-radius:3px;
  padding:16px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;
  display:flex;flex-direction:column;justify-content:space-between;
  clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)}
.hub-panel:hover{border-color:var(--cyan);background:rgba(0,212,255,.06);transform:translateY(-3px);
  box-shadow:0 8px 32px rgba(0,212,255,.12),inset 0 1px 0 rgba(0,212,255,.2)}
.hub-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,var(--cyan),transparent);opacity:0;transition:.2s}
.hub-panel:hover::before{opacity:1}
.hub-panel-icon{font-size:28px;margin-bottom:8px}
.hub-panel-name{font-family:var(--f1);font-size:11px;font-weight:700;color:var(--cyan);
  letter-spacing:.08em;margin-bottom:4px}
.hub-panel-desc{font-size:11px;color:var(--muted);line-height:1.4}
.hub-panel-badge{position:absolute;top:10px;right:14px;font-size:9px;
  background:var(--bg3);border:1px solid var(--b2);padding:2px 7px;
  border-radius:2px;color:var(--dim);font-family:var(--f3);letter-spacing:.06em}
.hub-panel-badge.active{border-color:var(--green);color:var(--green)}
.hub-bottom{margin-top:12px;display:flex;gap:8px}
.xp-block{flex:1;background:var(--bg2);border:1px solid var(--b1);padding:8px 12px;border-radius:3px}
.xp-label{font-family:var(--f1);font-size:9px;color:var(--dim);letter-spacing:.1em;margin-bottom:5px;
  display:flex;justify-content:space-between;align-items:center}
.xp-bar-bg{background:var(--bg3);border-radius:2px;height:5px;overflow:hidden}
.xp-bar-fill{height:100%;border-radius:2px;transition:width .6s ease;
  background:linear-gradient(90deg,var(--cyan2),var(--cyan))}
.xp-bar-fill.gold{background:linear-gradient(90deg,var(--gold2),var(--gold))}

/* ─── BUTTONS ─── */
.btn{font-family:var(--f1);font-size:11px;font-weight:600;letter-spacing:.08em;
  border:1px solid;border-radius:2px;padding:8px 18px;cursor:pointer;transition:all .15s;
  clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)}
.btn-cyan{background:rgba(0,212,255,.1);border-color:var(--cyan);color:var(--cyan)}
.btn-cyan:hover{background:rgba(0,212,255,.2);box-shadow:0 0 16px rgba(0,212,255,.3)}
.btn-gold{background:rgba(255,197,48,.1);border-color:var(--gold);color:var(--gold)}
.btn-gold:hover{background:rgba(255,197,48,.2);box-shadow:0 0 16px rgba(255,197,48,.3)}
.btn-red{background:rgba(255,51,85,.1);border-color:var(--red);color:var(--red)}
.btn-red:hover{background:rgba(255,51,85,.2)}
.btn-ghost{background:transparent;border-color:var(--b2);color:var(--muted)}
.btn-ghost:hover{border-color:var(--b3);color:var(--text)}
.btn:disabled{opacity:.35;cursor:not-allowed}

/* ─── SCREEN WRAPPER ─── */
.screen{position:relative;z-index:5;height:calc(100vh - 48px);overflow:hidden;display:flex;flex-direction:column}

/* ─── SURFACE COMBAT ─── */
.sc{flex:1;display:flex;flex-direction:column;padding:12px 20px;gap:10px;overflow:hidden}
.sc-header{display:flex;align-items:center;justify-content:space-between}
.sc-title{font-family:var(--f1);font-size:14px;font-weight:700;color:var(--cyan);letter-spacing:.08em}
.sc-turn{font-family:var(--f3);font-size:11px;color:var(--gold)}
.sc-field{display:flex;gap:10px;flex:1;min-height:0}
.sc-allies{display:flex;flex-direction:column;gap:8px;width:280px;flex-shrink:0}
.sc-arena{flex:1;background:var(--bg1);border:1px solid var(--b1);border-radius:3px;
  display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;min-width:0}
.sc-arena-bg{position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% 60%,rgba(0,100,50,.15) 0%,transparent 70%),
  repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,.01) 30px,rgba(255,255,255,.01) 31px)}
.sc-enemies{display:flex;flex-direction:column;gap:10px;justify-content:center;position:relative;z-index:2;padding:20px}
.enemy-card{background:var(--bg2);border:1px solid var(--b1);border-radius:3px;padding:10px 14px;
  text-align:center;transition:all .2s;min-width:120px}
.enemy-card.targeted{border-color:var(--red);box-shadow:0 0 16px rgba(255,51,85,.25)}
.enemy-card.dead{opacity:.25;filter:grayscale(1)}
.enemy-icon{font-size:28px;margin-bottom:4px}
.enemy-name{font-family:var(--f1);font-size:9px;color:var(--muted);letter-spacing:.07em;margin-bottom:6px}
.combat-log{background:var(--bg1);border:1px solid var(--b1);border-radius:3px;padding:8px 12px;
  height:72px;overflow-y:auto;font-family:var(--f3);font-size:11px;line-height:1.6}
.log-line{color:var(--muted)}
.log-line.atk{color:var(--red)}
.log-line.heal{color:var(--green)}
.log-line.info{color:var(--cyan)}
.log-line.win{color:var(--gold);font-weight:700}
.ally-card{background:var(--bg2);border:1px solid var(--b1);border-radius:3px;padding:8px 12px;
  transition:all .2s;position:relative}
.ally-card.active{border-color:var(--cyan);box-shadow:0 0 12px rgba(0,212,255,.2)}
.ally-card.dead{opacity:.3;filter:grayscale(1)}
.ally-card.heal-target{border-color:var(--green);box-shadow:0 0 10px rgba(0,232,122,.2);cursor:pointer}
.ally-card.heal-target:hover{background:rgba(0,232,122,.06)}
.ally-row{display:flex;align-items:center;gap:8px;margin-bottom:5px}
.ally-icon{font-size:16px}
.ally-name{font-family:var(--f1);font-size:10px;font-weight:700;color:var(--text);letter-spacing:.06em}
.ally-class{font-size:9px;color:var(--dim);font-family:var(--f3)}
.bar-row{display:flex;align-items:center;gap:6px;margin-bottom:3px}
.bar-label{font-family:var(--f3);font-size:9px;color:var(--dim);width:18px}
.bar-bg{flex:1;background:var(--bg3);border-radius:2px;height:6px;overflow:hidden}
.bar-fill{height:100%;border-radius:2px;transition:width .4s ease}
.bar-val{font-family:var(--f3);font-size:9px;color:var(--muted);width:52px;text-align:right}
.en-fill{background:linear-gradient(90deg,#004488,#0088ff)}
.active-indicator{position:absolute;left:-1px;top:50%;transform:translateY(-50%);
  width:3px;height:60%;background:var(--cyan);border-radius:0 2px 2px 0;
  box-shadow:0 0 8px var(--cyan)}
.cmd-panel{background:var(--bg1);border:1px solid var(--b2);border-radius:3px;padding:10px 14px}
.cmd-title{font-family:var(--f1);font-size:10px;color:var(--cyan);letter-spacing:.1em;margin-bottom:8px}
.cmd-row{display:flex;gap:8px;flex-wrap:wrap}
.cmd-btn{font-family:var(--f1);font-size:10px;font-weight:600;letter-spacing:.06em;
  border:1px solid var(--b2);background:var(--bg2);color:var(--text);
  padding:6px 12px;cursor:pointer;transition:all .15s;border-radius:2px;
  clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)}
.cmd-btn:hover{border-color:var(--cyan);color:var(--cyan);background:rgba(0,212,255,.08)}
.cmd-btn:disabled{opacity:.3;cursor:not-allowed}
.cmd-btn.active{border-color:var(--gold);color:var(--gold);background:rgba(255,197,48,.08)}
.skill-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}
.skill-btn{font-family:var(--f2);font-size:10px;border:1px solid var(--b2);background:var(--bg2);
  color:var(--text);padding:5px 10px;cursor:pointer;transition:all .15s;border-radius:2px}
.skill-btn:hover{border-color:var(--purple);color:var(--purple)}
.skill-btn .cost{color:var(--gold);font-family:var(--f3);font-size:9px}
.skill-btn:disabled{opacity:.3;cursor:not-allowed}

/* ─── SPACE COMBAT ─── */
.space-combat{display:flex;gap:12px;padding:12px 20px;height:calc(100vh - 48px);overflow:hidden}
.grid-wrap{flex:1;display:flex;flex-direction:column;gap:8px;min-width:0}
.grid-title{font-family:var(--f1);font-size:13px;color:var(--cyan);letter-spacing:.08em;
  display:flex;align-items:center;justify-content:space-between}
.grid-container{flex:1;display:grid;border:1px solid var(--b1);border-radius:3px;overflow:hidden;
  background:var(--bg1);position:relative}
.grid-cell{border:1px solid var(--b1);position:relative;cursor:pointer;
  transition:all .15s;display:flex;align-items:center;justify-content:center;font-size:18px;min-height:0}
.grid-cell:hover{filter:brightness(1.3)}
.grid-cell.move-target{box-shadow:inset 0 0 0 2px rgba(0,212,255,.7);cursor:pointer;animation:pulse-cell .8s infinite alternate}
.grid-cell.atk-target{box-shadow:inset 0 0 0 2px rgba(255,51,85,.8);cursor:crosshair}
.grid-cell.selected{box-shadow:inset 0 0 0 2px var(--gold)}
@keyframes pulse-cell{from{background:rgba(0,212,255,.05)}to{background:rgba(0,212,255,.18)}}
.unit-icon{position:relative;z-index:2;text-shadow:0 2px 8px rgba(0,0,0,.8);line-height:1}
.unit-hp-bar{position:absolute;bottom:2px;left:3px;right:3px;height:3px;background:rgba(0,0,0,.5);border-radius:2px}
.unit-hp-fill{height:100%;border-radius:2px;transition:width .3s}
.zone-label{position:absolute;top:2px;left:3px;font-size:7px;font-family:var(--f3);opacity:.7;pointer-events:none;z-index:1}
.space-sidebar{width:230px;display:flex;flex-direction:column;gap:8px;flex-shrink:0}
.ss-panel{background:var(--bg2);border:1px solid var(--b1);border-radius:3px;padding:10px 12px}
.ss-panel-title{font-family:var(--f1);font-size:9px;color:var(--dim);letter-spacing:.12em;margin-bottom:8px;text-transform:uppercase}
.ship-name{font-family:var(--f1);font-size:12px;color:var(--cyan);margin-bottom:2px}
.ship-type{font-size:10px;color:var(--muted);font-family:var(--f3);margin-bottom:8px}
.ability-list{display:flex;flex-direction:column;gap:5px}
.ability-btn{background:var(--bg3);border:1px solid var(--b1);border-radius:2px;padding:6px 8px;
  cursor:pointer;transition:all .15s;text-align:left;width:100%}
.ability-btn:hover{border-color:var(--cyan);background:rgba(0,212,255,.06)}
.ability-btn.selected{border-color:var(--gold);background:rgba(255,197,48,.06)}
.ability-btn:disabled{opacity:.3;cursor:not-allowed}
.ability-name{font-family:var(--f1);font-size:10px;color:var(--text);letter-spacing:.05em}
.ability-desc{font-size:9px;color:var(--dim);font-family:var(--f3);margin-top:2px}
.ability-charges{font-size:9px;color:var(--gold);font-family:var(--f3)}
.enemy-list{display:flex;flex-direction:column;gap:5px}
.e-row{background:var(--bg3);border:1px solid var(--b1);border-radius:2px;padding:5px 8px}
.e-row.dead{opacity:.3;filter:grayscale(1)}
.e-name{font-size:10px;color:var(--text);font-family:var(--f1);margin-bottom:4px;
  display:flex;align-items:center;gap:5px}
.phase-indicator{font-family:var(--f3);font-size:10px;color:var(--gold);padding:6px 10px;
  background:rgba(255,197,48,.06);border:1px solid rgba(255,197,48,.2);border-radius:2px;text-align:center}
.space-log{background:var(--bg1);border:1px solid var(--b1);border-radius:2px;padding:6px 8px;
  height:70px;overflow-y:auto;font-family:var(--f3);font-size:10px;line-height:1.6;
  display:flex;flex-direction:column-reverse;gap:0}
.zone-legend{display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-top:2px}
.zone-legend-item{font-family:var(--f3);font-size:8px;display:flex;align-items:center;gap:4px;color:var(--muted)}
.zone-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}

/* ─── REWARD ─── */
.reward{display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:30px;gap:20px;height:calc(100vh - 48px)}
.reward-title{font-family:var(--f1);font-size:28px;font-weight:900;color:var(--gold);
  text-shadow:0 0 40px rgba(255,197,48,.5);letter-spacing:.1em;animation:glow-pulse 2s infinite alternate}
@keyframes glow-pulse{from{text-shadow:0 0 20px rgba(255,197,48,.3)}to{text-shadow:0 0 60px rgba(255,197,48,.8)}}
.reward-box{background:var(--bg2);border:1px solid var(--b2);border-radius:3px;padding:20px 28px;
  width:100%;max-width:480px;display:flex;flex-direction:column;gap:12px}
.reward-section-title{font-family:var(--f1);font-size:10px;color:var(--dim);letter-spacing:.14em;
  border-bottom:1px solid var(--b1);padding-bottom:5px;margin-bottom:3px}
.loot-item{display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid var(--b1)}
.loot-item:last-child{border-bottom:none}
.loot-rar{font-family:var(--f1);font-size:8px;letter-spacing:.1em;padding:2px 7px;border-radius:2px;
  border:1px solid;background:rgba(0,0,0,.3)}
.loot-name{font-family:var(--f2);font-size:12px;font-weight:600}
.loot-stat{font-family:var(--f3);font-size:10px;color:var(--muted);margin-left:auto}
.xp-gained{display:flex;justify-content:space-between;font-family:var(--f3);font-size:11px;
  color:var(--green);padding:4px 0}

/* ─── CHARACTER SCREEN ─── */
.char-screen{display:flex;gap:12px;padding:16px 20px;height:calc(100vh - 48px);overflow:hidden}
.char-card{background:var(--bg2);border:1px solid var(--b1);border-radius:3px;padding:14px 16px;flex:1}
.char-name{font-family:var(--f1);font-size:16px;font-weight:700;color:var(--cyan);letter-spacing:.08em;margin-bottom:2px}
.char-sub{font-size:11px;color:var(--muted);font-family:var(--f3);margin-bottom:12px}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:14px}
.stat-row{background:var(--bg3);border:1px solid var(--b1);border-radius:2px;padding:6px 10px;
  display:flex;justify-content:space-between;align-items:center}
.stat-key{font-family:var(--f1);font-size:9px;color:var(--dim);letter-spacing:.1em}
.stat-val{font-family:var(--f3);font-size:13px;color:var(--text)}
.skill-card{background:var(--bg3);border:1px solid var(--b1);border-radius:2px;padding:8px 12px;margin-bottom:5px}
.skill-name{font-family:var(--f1);font-size:11px;color:var(--purple);letter-spacing:.06em;margin-bottom:3px}
.skill-desc{font-size:10px;color:var(--muted);font-family:var(--f3)}
.skill-cost{font-size:9px;color:var(--gold);font-family:var(--f3);margin-top:2px}
.section-title{font-family:var(--f1);font-size:9px;color:var(--dim);letter-spacing:.14em;
  margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid var(--b1)}

/* ─── ANIMATIONS ─── */
@keyframes float-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.float-in{animation:float-in .3s ease forwards}
@keyframes hit-flash{0%{filter:brightness(1)}50%{filter:brightness(3) saturate(0)}100%{filter:brightness(1)}}
.hit{animation:hit-flash .3s ease}

/* ─── SCROLLBARS ─── */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:var(--bg1)}
::-webkit-scrollbar-thumb{background:var(--b2);border-radius:2px}

/* ─── MOBILE ─── */
@media(max-width:768px){
  .hub-grid{grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(4,1fr)}
  .space-combat{flex-direction:column}
  .space-sidebar{width:100%;flex-direction:row;flex-wrap:wrap;height:auto}
  .sc-field{flex-direction:column}
  .sc-allies{width:100%;flex-direction:row}
  .char-screen{flex-direction:column;overflow-y:auto}
}
`

export default CSS
