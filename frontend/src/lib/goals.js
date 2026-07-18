// Pure goal math — used by the Goals page and goal-aware recommendations.
// Progress model:
//   progress = how far the metric has moved from its baseline toward the target
//   expected = how far along the goal's timeline we are
//   on-track when progress keeps pace with the calendar; small grace band so
//   a goal isn't flagged "behind" over rounding noise.

export const GOAL_METRICS = {
  profit: { label: 'Monthly profit', unit: 'inr' },
  revenue: { label: 'Monthly revenue', unit: 'inr' },
  margin: { label: 'Profit margin', unit: 'pct' },
}

export function formatINR(n) {
  if (n == null || Number.isNaN(n)) return '—'
  if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export function formatGoalValue(value, type) {
  return GOAL_METRICS[type]?.unit === 'pct' ? `${Math.round(value * 10) / 10}%` : formatINR(value)
}

// 'YYYY-MM' helpers
export function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

export function monthsBetween(a, b) {
  const [ay, am] = a.split('-').map(Number)
  const [by, bm] = b.split('-').map(Number)
  return (by - ay) * 12 + (bm - am)
}

export function formatMonth(yyyymm) {
  const [y, m] = yyyymm.split('-').map(Number)
  return new Date(y, m - 1).toLocaleString('en-IN', { month: 'short', year: 'numeric' })
}

export function computeGoalProgress(goal, currentValue, nowMonth = currentMonth()) {
  const totalMonths = Math.max(1, monthsBetween(goal.created, goal.deadline))
  const elapsed = Math.min(totalMonths, Math.max(0, monthsBetween(goal.created, nowMonth)))
  const monthsLeft = Math.max(0, monthsBetween(nowMonth, goal.deadline))

  const span = goal.target - goal.baseline
  const moved = currentValue - goal.baseline
  const progress = span === 0 ? 1 : Math.max(0, Math.min(1, moved / span))
  const expected = elapsed / totalMonths

  const gap = goal.target - currentValue
  const achieved = gap <= 0
  // What the metric must gain per remaining month to land the target on time.
  const requiredPace = monthsLeft > 0 ? gap / monthsLeft : gap

  return {
    progress,
    expected,
    monthsLeft,
    gap,
    achieved,
    requiredPace,
    overdue: !achieved && monthsLeft === 0,
    status: achieved ? 'achieved' : progress + 0.05 >= expected ? 'on-track' : 'behind',
  }
}
