import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import TopBar from '../components/TopBar.jsx'
import ChatPanel from '../components/ChatPanel.jsx'
import DashboardCards from '../components/dashboard/DashboardCards.jsx'
import ChartsGrid from '../components/dashboard/ChartsGrid.jsx'
import RecommendationCard from '../components/dashboard/RecommendationCard.jsx'
import WhatIfSimulator from '../components/dashboard/WhatIfSimulator.jsx'
import BusinessReport from '../components/dashboard/BusinessReport.jsx'
import { sendMessage, greeting, getDashboardData, runSimulation, getGoals, getCurrentMetrics } from '../api/client.js'
import { computeGoalProgress, formatINR, formatMonth } from '../lib/goals.js'
import { speak } from '../lib/speech.js'

const PIPELINE_STEP_MS = 400 // keep in sync with AIStatusPanel
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function AppPage() {
  // Chat state
  const [messages, setMessages] = useState([
    { role: 'assistant', content: greeting.reply, ...greeting },
  ])
  const [thinking, setThinking] = useState(false)
  // Pipeline currently shown in AIStatusPanel — set the moment a response
  // arrives so its trace reveals BEFORE the reply bubble (chat_panel.html logic).
  const [activePipeline, setActivePipeline] = useState(greeting.pipeline)
  const [chatExpanded, setChatExpanded] = useState(false)

  // Dashboard data
  const dashboardData = useMemo(() => getDashboardData(), [])

  // Goal-aware recommendations: when a profit goal exists, rank by how much
  // of the monthly profit gap each recommendation closes — so the list reads
  // as a plan toward the target, not a random set of tips.
  const [goals, setGoals] = useState([])
  useEffect(() => {
    getGoals().then(setGoals)
  }, [])

  const profitGoal = goals.find((g) => g.type === 'profit')
  const goalProgress = profitGoal
    ? computeGoalProgress(profitGoal, getCurrentMetrics().profit)
    : null

  const recommendations = useMemo(() => {
    const recs = dashboardData.recommendations ?? []
    if (!goalProgress || goalProgress.achieved) return recs
    return [...recs].sort((a, b) => (b.recoveryMonthly ?? 0) - (a.recoveryMonthly ?? 0))
  }, [dashboardData, goalProgress])

  async function handleSend(text, attachment, viaVoice) {
    if (thinking) return // one request in flight at a time (chips can double-fire)
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setThinking(true)
    try {
      const history = next.map(({ role, content }) => ({ role, content }))
      const res = await sendMessage(text, history)
      const pipeline = res.pipeline ?? []
      setActivePipeline(pipeline)
      // Let the trace finish revealing, then land the reply.
      await sleep(pipeline.length * PIPELINE_STEP_MS + 150)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.reply, ...res }])
      if (viaVoice) speak(res.reply)
    } finally {
      setThinking(false)
    }
  }

  function handleUpload(file) {
    console.log('upload:', file.name)
    // TODO: POST /ingest
  }

  function handleExplainRecommendation(title) {
    handleSend(`Explain this recommendation: ${title}`)
  }

  async function handleSimulate(params) {
    return runSimulation(params)
  }

  // Dynamic widths for expand/collapse
  const leftWidth = chatExpanded ? '30%' : '55%'
  const rightWidth = chatExpanded ? '70%' : '45%'

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar onUpload={handleUpload} />

      <div className="flex min-h-0 flex-1">
        {/* LEFT — Dashboard (scrollable) */}
        <motion.div
          animate={{ width: leftWidth }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-0 overflow-y-auto"
        >
          <div className="space-y-5 p-5">
            {/* KPI Cards */}
            <DashboardCards data={dashboardData.cards} />

            {/* Charts */}
            <ChartsGrid chartData={dashboardData.charts} />

            {/* Recommendations */}
            <div>
              <h2 className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Recommendations
              </h2>
              {goalProgress && !goalProgress.achieved && (
                <p className="mb-3 text-xs text-slate-400 dark:text-slate-500">
                  Prioritised for your profit goal — {formatINR(goalProgress.gap)}/mo gap to close
                  by {formatMonth(profitGoal.deadline)}
                </p>
              )}
              <div className={goalProgress && !goalProgress.achieved ? 'space-y-3' : 'mt-3 space-y-3'}>
                {recommendations.map((rec) => (
                  <RecommendationCard
                    key={rec.title}
                    recommendation={rec}
                    goalGap={goalProgress && !goalProgress.achieved ? goalProgress.gap : null}
                    onExplain={handleExplainRecommendation}
                  />
                ))}
              </div>
            </div>

            {/* What-if Simulator */}
            <WhatIfSimulator onSimulate={handleSimulate} />

            {/* Download Action */}
            <div className="pt-4 flex justify-center">
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download Business Report (PDF)
              </button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Chat (resizable) */}
        <motion.div
          animate={{ width: rightWidth }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-0"
        >
          <ChatPanel
            messages={messages}
            thinking={thinking}
            pipeline={activePipeline}
            onSend={handleSend}
            expanded={chatExpanded}
            onToggleExpand={() => setChatExpanded(!chatExpanded)}
          />
        </motion.div>
      </div>
    </div>
  )
}
