import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register';

import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)

if ('serviceWorker' in navigator) {
    registerSW();
}
