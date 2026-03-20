import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import AdminLogin from './pages/AdminLogin'
import CRM from './pages/CRM'
import Ebook from './pages/Ebook'
import CalculadoraFinanciera from './pages/CalculadoraFinanciera'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<App />} />
        <Route path="/ebook"         element={<Ebook />} />
        <Route path="/admin"         element={<AdminLogin />} />
        <Route path="/crm"           element={<CRM />} />
        <Route path="/calculadora"   element={<CalculadoraFinanciera />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
