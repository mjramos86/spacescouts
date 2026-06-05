import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

const preload = document.getElementById('pre-load')

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  // only hide the HTML pre-loader once React has actually mounted
  preload?.remove()
} catch (err) {
  // surface the error instead of leaving a silent "stuck on loading" screen
  if (preload) {
    preload.innerHTML =
      '<div style="color:#ff3355;font-family:monospace;max-width:520px;text-align:center;padding:20px">' +
      '<b>Failed to start.</b><br/>' + String(err && err.message || err) +
      '<br/><br/>Try a hard refresh (Ctrl/Cmd+Shift+R).</div>'
  }
  throw err
}
