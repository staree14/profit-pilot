import { useMemo } from 'react'
import TopBar from '../components/TopBar.jsx'
import DashboardCards from '../components/dashboard/DashboardCards.jsx'
import ChartsGrid from '../components/dashboard/ChartsGrid.jsx'
import BusinessReport from '../components/dashboard/BusinessReport.jsx'
import { getDashboardData } from '../api/client.js'

export default function AnalyticsPage() {
  const dashboardData = useMemo(() => getDashboardData(), [])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-5 p-5">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Analytics</h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Trends and the full business health report for June 2026.
            </p>
          </div>

          <DashboardCards data={dashboardData.cards} />
          <ChartsGrid chartData={dashboardData.charts} />
          <BusinessReport report={dashboardData.report} />
        </div>
      </div>
    </div>
  )
}
