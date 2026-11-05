import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n.js'
import './index.css'
import App from './App.jsx'
import { StoreProvider } from './context/StoreContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>,
)