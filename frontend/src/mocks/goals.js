// =====================================================================
// TODO: backend — GET /goals · POST /goals · DELETE /goals/:id
// No endpoint exists yet; this in-memory mock stands in until then.
// Module state means goals survive route changes within a session
// (lost on refresh — fine until the backend lands).
//
// Goal shape:
// {
//   "id": "g1",
//   "type": "profit" | "revenue" | "margin",
//   "target": 240000,          // ₹/month for profit & revenue, % for margin
//   "deadline": "2026-12",     // YYYY-MM
//   "created": "2026-06",      // YYYY-MM, set at creation
//   "baseline": 195000         // metric value when the goal was created —
// }                            // progress is measured from here, not from 0
// =====================================================================

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let nextId = 2
let goals = [
  // Seeded demo goal: profit was ₹1.95L when set in June, target ₹2.4L by
  // December — current profit of ₹1.85L puts it visibly "behind" so the
  // pace/status logic shows in the demo.
  {
    id: 'g1',
    type: 'profit',
    target: 240000,
    deadline: '2026-12',
    created: '2026-06',
    baseline: 195000,
  },
]

export async function getGoals() {
  await sleep(150)
  return [...goals]
}

export async function createGoal({ type, target, deadline, baseline, created }) {
  await sleep(150)
  const goal = { id: `g${nextId++}`, type, target, deadline, baseline, created }
  goals = [...goals, goal]
  return goal
}

export async function deleteGoal(id) {
  await sleep(150)
  goals = goals.filter((g) => g.id !== id)
  return { ok: true }
}
