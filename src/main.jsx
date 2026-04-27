import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import AdminLogin from './pages/AdminLogin'
import CRM from './pages/CRM'
import Ebook from './pages/Ebook'
import CalculadoraFinanciera from './pages/CalculadoraFinanciera'
import Agente from './pages/Agente'
import Descarga from './pages/Descarga'
import './index.css'

const ownDomains = ['bber.space', 'www.bber.space']
const basename = ownDomains.includes(window.location.hostname) ? '/' : '/bber'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/"              element={<App />} />
        <Route path="/ebook"         element={<Ebook />} />
        <Route path="/descarga"      element={<Descarga />} />
        <Route path="/admin"         element={<AdminLogin />} />
        <Route path="/crm"           element={<CRM />} />
        <Route path="/calculadora"   element={<CalculadoraFinanciera />} />
        <Route path="/agente"        element={<Agente />} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
