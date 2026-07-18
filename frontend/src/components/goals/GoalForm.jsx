import { useState } from 'react'
import { Target, Plus } from 'lucide-react'
import { GOAL_METRICS, currentMonth, formatGoalValue } from '../../lib/goals.js'

export default function GoalForm({ currentMetrics, onCreate }) {
  const [type, setType] = useState('profit')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [saving, setSaving] = useState(false)

  const now = currentMonth()
  const isPct = GOAL_METRICS[type].unit === 'pct'
  const current = currentMetrics[type]

  async function submit(e) {
    e.preventDefault()
    const value = Number(target)
    if (!value || !deadline || deadline <= now || saving) return
    setSaving(true)
    try {
      await onCreate({
        type,
        target: value,
        deadline,
        created: now,
        baseline: current, // progress is measured from today's value
      })
      setTarget('')
      setDeadline('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <Target size={16} />
        </div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Set a new goal</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Metric</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-sm text-slate-700 focus:border-blue-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            {Object.entries(GOAL_METRICS).map(([key, m]) => (
              <option key={key} value={key}>{m.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            Target {isPct ? '(%)' : '(₹/month)'}
          </span>
          <input
            type="number"
            min="0"
            step={isPct ? '0.1' : '1000'}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder={isPct ? 'e.g. 18' : 'e.g. 240000'}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Deadline</span>
          <input
            type="month"
            min={now}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-sm text-slate-700 focus:border-blue-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={saving || !target || !deadline || deadline <= now}
            className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
          >
            <Plus size={14} />
            Add goal
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
        Current {GOAL_METRICS[type].label.toLowerCase()}: {formatGoalValue(current, type)} — progress
        is tracked from this baseline.
      </p>
    </form>
  )
}
