import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Hub from './pages/Hub'
import Curso from './pages/Curso'
import Ebook from './pages/Ebook'
import Descarga from './pages/Descarga'
import CalculadoraFinanciera from './pages/CalculadoraFinanciera'
import './index.css'

const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const CRM        = lazy(() => import('./pages/CRM'))
const Agente     = lazy(() => import('./pages/Agente'))

const ownDomains = ['bber.space', 'www.bber.space']
const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
const basename = (ownDomains.includes(window.location.hostname) || isLocalhost) ? '/' : '/bber'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/"            element={<Hub />} />
          <Route path="/curso"       element={<Curso />} />
          <Route path="/ebook"       element={<Ebook />} />
          <Route path="/descarga"    element={<Descarga />} />
          <Route path="/calculadora" element={<CalculadoraFinanciera />} />
          <Route path="/admin"       element={<AdminLogin />} />
          <Route path="/crm"         element={<CRM />} />
          <Route path="/agente"      element={<Agente />} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
)
