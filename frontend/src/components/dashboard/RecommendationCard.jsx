import { Target } from 'lucide-react'

const priorityConfig = {
  high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200 dark:border-red-900', badge: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200 dark:border-amber-900', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' },
  low: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200 dark:border-blue-900', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' },
}

export default function RecommendationCard({ recommendation, onExplain, goalGap }) {
  const {
    title,
    priority = 'medium',
    reason,
    confidence,
    estimatedRecovery,
    recoveryMonthly,
  } = recommendation

  const config = priorityConfig[priority] || priorityConfig.medium
  // How much of the user's monthly profit-goal gap this action closes.
  const gapShare =
    goalGap > 0 && recoveryMonthly
      ? Math.min(100, Math.round((recoveryMonthly / goalGap) * 100))
      : null

  return (
    <div
      className={`rounded-xl border ${config.border} bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-slate-900`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.badge}`}>
              {priority}
            </span>
            {confidence && (
              <span className="text-[10px] font-medium text-slate-400">
                {confidence}% confidence
              </span>
            )}
            {gapShare != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <Target size={10} />
                Closes {gapShare}% of your goal gap
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
          {reason && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{reason}</p>
          )}
        </div>
        {estimatedRecovery && (
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-medium text-slate-400">Est. Recovery</p>
            <p className="text-sm font-bold text-emerald-600">{estimatedRecovery}</p>
          </div>
        )}
      </div>

      {/* Confidence bar */}
      {confidence && (
        <div className="mt-3">
          <div className="h-1 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-1 rounded-full bg-emerald-500 transition-all"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      )}

      {/* Explain button */}
      <div className="mt-4 flex items-center border-t border-slate-100 pt-3">
        <button
          onClick={() => onExplain?.(title)}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          Ask Gemma to Explain
        </button>
      </div>
    </div>
  )
}
