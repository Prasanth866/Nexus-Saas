import { useState } from 'react'
import AuthPage from './pages/AuthPage'
import DemoPage from './pages/DemoPage'
import OrganizationGatewayPage from './pages/OrganizationGatewayPage'

function App() {
  const [page, setPage] = useState<'demo' | 'login' | 'signup' | 'gateway'>('demo')

  if (page === 'demo') {
    return <DemoPage onOpenAuth={(mode) => setPage(mode ?? 'login')} />
  }

  if (page === 'gateway') {
    return <OrganizationGatewayPage />
  }

  return <AuthPage initialMode={page} onAuthSuccess={() => setPage('gateway')} />
}

export default App
