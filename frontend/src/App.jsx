import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import AppPage from './pages/AppPage.jsx'
import TransactionsPage from './pages/TransactionsPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import GoalsPage from './pages/GoalsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<AppPage />} />
      <Route path="/app/transactions" element={<TransactionsPage />} />
      <Route path="/app/analytics" element={<AnalyticsPage />} />
      <Route path="/app/goals" element={<GoalsPage />} />
    </Routes>
  )
}
