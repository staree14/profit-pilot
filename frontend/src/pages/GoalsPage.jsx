import { useEffect, useState } from 'react'
import { Lightbulb } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import GoalForm from '../components/goals/GoalForm.jsx'
import GoalCard from '../components/goals/GoalCard.jsx'
import { getGoals, createGoal, deleteGoal, getCurrentMetrics } from '../api/client.js'

export default function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [loaded, setLoaded] = useState(false)
  const currentMetrics = getCurrentMetrics()

  useEffect(() => {
    getGoals().then((g) => {
      setGoals(g)
      setLoaded(true)
    })
  }, [])

  async function handleCreate(goal) {
    await createGoal(goal)
    setGoals(await getGoals())
  }

  async function handleDelete(id) {
    await deleteGoal(id)
    setGoals(await getGoals())
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-5 p-5">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Goals</h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Set targets with a deadline — ProfitPilot tracks your pace and prioritises
              recommendations toward closing the gap.
            </p>
          </div>

          <GoalForm currentMetrics={currentMetrics} onCreate={handleCreate} />

          {loaded && goals.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
              No goals yet — set your first target above.
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                currentValue={currentMetrics[goal.type]}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {goals.some((g) => g.type === 'profit') && (
            <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-slate-600 dark:border-blue-900 dark:bg-blue-950/40 dark:text-slate-300">
              <Lightbulb size={15} className="mt-0.5 shrink-0 text-blue-500 dark:text-blue-400" />
              <p>
                Recommendations on Home are now ranked by how much of your profit gap each one
                closes. The advisor chat will use these goals too once the backend goals endpoint
                lands.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
