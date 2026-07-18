import { Trash2, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { GOAL_METRICS, computeGoalProgress, formatGoalValue, formatMonth } from '../../lib/goals.js'

const statusConfig = {
  achieved: {
    label: 'Achieved',
    Icon: CheckCircle2,
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
    bar: 'bg-emerald-500',
  },
  'on-track': {
    label: 'On track',
    Icon: TrendingUp,
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    bar: 'bg-blue-500',
  },
  behind: {
    label: 'Behind',
    Icon: AlertTriangle,
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    bar: 'bg-amber-500',
  },
}

export default function GoalCard({ goal, currentValue, onDelete }) {
  const metric = GOAL_METRICS[goal.type]
  const p = computeGoalProgress(goal, currentValue)
  const config = statusConfig[p.status]
  const { Icon } = config

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {metric.label}: {formatGoalValue(goal.target, goal.type)}
          </h4>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            by {formatMonth(goal.deadline)} · set {formatMonth(goal.created)} at{' '}
            {formatGoalValue(goal.baseline, goal.type)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.badge}`}>
            <Icon size={11} />
            {config.label}
          </span>
          <button
            onClick={() => onDelete(goal.id)}
            aria-label="Delete goal"
            className="rounded-md p-1 text-slate-300 transition-colors hover:bg-slate-50 hover:text-red-500 dark:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-red-400"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Progress bar with expected-pace marker */}
      <div className="mt-3">
        <div className="relative h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-1.5 rounded-full transition-all ${config.bar}`}
            style={{ width: `${Math.round(p.progress * 100)}%` }}
          />
          {/* where progress should be by now to stay on pace */}
          <div
            className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full bg-slate-400 dark:bg-slate-500"
            style={{ left: `${Math.round(p.expected * 100)}%` }}
            title="Expected progress by now"
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
          <span>{Math.round(p.progress * 100)}% there</span>
          <span>expected {Math.round(p.expected * 100)}% by now</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <GoalStat label="Current" value={formatGoalValue(currentValue, goal.type)} />
        <GoalStat
          label="Gap"
          value={p.achieved ? 'Done' : formatGoalValue(p.gap, goal.type)}
        />
        <GoalStat
          label={p.overdue ? 'Deadline' : 'Needed / month'}
          value={
            p.achieved
              ? '—'
              : p.overdue
                ? 'Passed'
                : `+${formatGoalValue(p.requiredPace, goal.type)}`
          }
        />
      </div>
    </div>
  )
}

function GoalStat({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 px-2 py-1.5 dark:bg-slate-950">
      <p className="text-[10px] text-slate-400 dark:text-slate-500">{label}</p>
      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{value}</p>
    </div>
  )
}
