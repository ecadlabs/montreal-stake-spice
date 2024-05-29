import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <>
      <App />
      <div className='footer'>
        <span>© 2024 Tezos.Staking | Terms | Privacy</span>
        <span>Powered by Tezos</span>
      </div>
    </>
  // </React.StrictMode>,
)
