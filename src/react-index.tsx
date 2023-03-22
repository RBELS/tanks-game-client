import React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'

const containerHTMLEl = document.getElementById('app-root')!
const root = ReactDOM.createRoot(containerHTMLEl)
root.render(<App />)
