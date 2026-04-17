import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import InfoPage from './pages/InfoPage'
import LoginPage from './pages/LoginPage'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route
        path='/services'
        element={
          <InfoPage
            title='Healthcare Security Services'
            description='Explore managed threat detection, prescription integrity checks, doctor identity verification, and compliance-ready security operations for healthcare ecosystems.'
          />
        }
      />
      <Route
        path='/security'
        element={
          <InfoPage
            title='Built For Zero-Trust Healthcare'
            description='Medicare Secure combines encryption, behavioral telemetry, tamper-proof logs, and policy controls to secure every clinical and prescription workflow.'
          />
        }
      />
      <Route
        path='/about'
        element={
          <InfoPage
            title='Mission-Driven Cybersecurity'
            description='We are building the trust layer for digital healthcare with AI-safe operations, verified identities, and transparent auditability across systems.'
          />
        }
      />
      <Route
        path='/contact'
        element={
          <InfoPage
            title='Talk To Medicare Secure'
            description='Connect with our team to design a secure rollout for your hospital, pharmacy chain, diagnostics network, or public health platform.'
          />
        }
      />
      <Route
        path='/login'
        element={<LoginPage />}
      />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

export default App