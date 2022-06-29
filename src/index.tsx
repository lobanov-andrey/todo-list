import App from 'app'
import React from 'react'
import { createRoot } from 'react-dom/client'

const appNode = document.getElementById('app')
if (appNode) {
  const root = createRoot(appNode)
  root.render(<App />)
} else {
  alert('app node not found')
}
