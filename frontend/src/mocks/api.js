// =====================================================================
// API CONTRACT — POST /chat
// This is the exact shape the backend must return. Do not deviate.
// It matches tools/temp-mock-chat-server/mock_chat_server.py and the
// reference implementation in tools/chat-panel/chat_panel.html.
//
// pipeline / evidence / confidence / suggested_followups are rendered by
// the frontend UNTOUCHED — all retrieval and function-call wording is
// authored backend-side, never reformatted here.
//
// Request:  { "message": string, "history": [{ "role": "user"|"assistant", "content": string }] }
// Response:
// {
//   "reply": "...",
//   "pipeline": [{ "label": "retrieving 'discount optimization'", "source": "SBA guide p.12" }],
//                 // "source" optional; steps revealed in order, ~400ms apart
//   "evidence": [{ "claim": "...", "source": "SBA guide p.34" }],
//   "confidence": 0.82,
//   "suggested_followups": ["...", "..."],
//   "actions": [{ "id": "...", "label": "..." }]
// }
// =====================================================================

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// TODO: backend — GET /profile (or fold into GET /dashboard)
export const profile = {
  name: 'Priya',
  business: 'ABC Retail',
}

// Numeric current values for goal math (the dashboard cards hold formatted
// strings). TODO: backend — real values live in GET /profit and GET /dashboard.
export function getCurrentMetrics() {
  return {
    profit: 185400, // ₹/month
    revenue: 1204500, // ₹/month
    margin: 15.4, // %
  }
}

export const SEED_SUGGESTIONS = [
  'Why did profits decrease this month?',
  'Which customers are reducing profitability?',
  'What products should I bundle?',
  'How can I increase profit by 10%?',
  'Show my biggest profit leak.',
]

// Proactive greeting — same response shape as POST /chat, rendered on load.
export const greeting = {
  reply:
    "Hello! I've finished reviewing your June ledger for ABC Retail. Revenue grew 12% to ₹12.0L — good news. But profit slipped to ₹1.85L, and your margin is down from 18% to 15.4%. I found 3 places where money is leaking, worth about ₹1.2L per month. Want me to walk you through the biggest one?",
  pipeline: [
    { label: 'reading ledger_june_2026.csv' },
    { label: 'calling find_profit_leaks() → 3 results' },
    { label: 'computing monthly health score → 78/100' },
  ],
  evidence: [],
  confidence: null,
  suggested_followups: SEED_SUGGESTIONS,
  actions: [],
}

// ---- canned responses, varied by input so the demo can be rehearsed ----

const profitLeakResponse = {
  reply:
    'Your margin fell from 18% to 15.4%. Root cause: Product A sold at a 22% average discount in June. It moves at volume, but after discount it nets almost nothing — that alone is costing you around ₹22,000 a month. Second, Customer XYZ pays 45 days late on average, which is quietly financing their business with your cash. Third, delivery costs rose 8% but your prices did not.',
  pipeline: [
    { label: 'reading ledger_june_2026.csv' },
    { label: 'calling find_profit_leaks() → 3 results' },
    { label: "retrieving 'discount optimization'", source: 'SBA guide p.12' },
    { label: 'generating recommendation' },
  ],
  evidence: [
    { claim: 'Product A average discount was 22% in June', source: 'Ledger analysis' },
    { claim: 'Margin fell from 18% to 15.4% month-over-month', source: 'Ledger analysis' },
    {
      claim: 'Discounts above 15% typically require volume increases of 40% or more to break even',
      source: 'SBA pricing strategy guide p.12',
    },
  ],
  confidence: 0.82,
  suggested_followups: [
    'What if I cut the discount to 10%?',
    'Which customer is worst?',
    'How do I fix late payments?',
  ],
  actions: [{ id: 'draft_email', label: 'Draft supplier email' }],
}

const ragResponse = {
  reply:
    'For a retail business like yours, retention usually beats acquisition on cost — the guidance I found suggests a repeat customer costs 5–7x less to serve than winning a new one. Three practical steps for ABC Retail: start a simple purchase-count reward (every 10th purchase gets 10% off), send a WhatsApp reminder to customers inactive for 30+ days, and prioritise your top 20 customers — they drive 61% of your revenue.',
  pipeline: [
    { label: "retrieving 'customer retention strategies'", source: 'SBA guide p.34' },
    { label: "retrieving 'loyalty programs for small retail'", source: 'SBA guide p.36' },
    { label: 'generating recommendation' },
  ],
  evidence: [
    {
      claim: 'Retaining an existing customer costs 5–7x less than acquiring a new one',
      source: 'SBA customer retention guide p.34',
    },
    { claim: 'Top 20 customers drive 61% of revenue', source: 'Ledger analysis' },
    { claim: '34 customers have been inactive for 30+ days', source: 'Ledger analysis' },
  ],
  confidence: 0.78,
  suggested_followups: [
    'Draft a WhatsApp win-back message',
    'Who are my top 20 customers?',
    'Why did profits decrease this month?',
  ],
  actions: [],
}

const simulationResponse = {
  reply:
    "I ran the numbers. Cutting Product A's discount from 22% to 10% recovers roughly ₹22,000 per month, assuming volume drops no more than 8% — and Product A's demand has been steady for 4 months, so that's a reasonable assumption. Your margin would move from 15.4% to about 17.2%. The risk is low: even if volume drops 15%, you still come out ₹9,000 ahead.",
  pipeline: [
    { label: 'calling simulate(discount=10%) → projected margin 17.2%' },
    { label: 'checking Product A volume stability → steady, 4 months' },
    { label: 'generating recommendation' },
  ],
  evidence: [
    { claim: 'Projected recovery is ₹22,000 per month at a 10% discount', source: 'Simulation engine' },
    { claim: 'Projected margin improves from 15.4% to 17.2%', source: 'Simulation engine' },
    {
      claim: 'Break-even holds unless volume drops more than 15%',
      source: 'SBA pricing strategy guide p.12',
    },
  ],
  confidence: 0.85,
  suggested_followups: [
    'What if volume drops 20%?',
    'Apply this to the simulator',
    'Draft a price update notice',
  ],
  actions: [{ id: 'open_simulator', label: 'Open simulator' }],
}

const draftEmailResponse = {
  reply:
    'Here is a draft you can send:\n\nSubject: Payment reminder — invoice #2041\n\nDear XYZ Traders,\n\nI hope business is going well. This is a gentle reminder that invoice #2041 for ₹48,500, dated 3 June, is now 15 days past due. We value our partnership and would appreciate payment by Friday, 25 July.\n\nIf payment has already been made, please ignore this note. For any questions about the invoice, reply here or call us directly.\n\nWarm regards,\nABC Retail\n\nWant me to make it firmer, or shorter?',
  pipeline: [
    { label: 'calling get_receivables(customer=XYZ) → ₹48,500 overdue' },
    { label: 'drafting payment reminder' },
  ],
  evidence: [
    { claim: 'Invoice #2041 for ₹48,500 is 15 days past due', source: 'Receivables ledger' },
    { claim: 'XYZ Traders pays 45 days late on average', source: 'Receivables ledger' },
  ],
  confidence: 0.9,
  suggested_followups: ['Make it firmer', 'Which customer is hurting me most?', 'How do I avoid late payments?'],
  actions: [],
}

function pickResponse(text) {
  const t = text.toLowerCase()
  if (t.includes('draft') || t.includes('email') || t.includes('reminder')) return draftEmailResponse
  if (t.includes('what if') || t.includes('discount') || t.includes('simulat')) return simulationResponse
  if (t.includes('retention') || t.includes('how do i') || t.includes('how can i') || t.includes('bundle')) return ragResponse
  return profitLeakResponse
}

// TODO: backend — replace with POST /chat
export async function sendMessage(text, history) {
  void history // sent to the real backend later; unused by the mock
  await sleep(1200)
  return pickResponse(text)
}

// ============ Dashboard Mock Data ============

export function getDashboardData() {
  return {
    cards: {
      revenue: {
        title: 'Total Revenue',
        value: '₹12,04,500',
        change: '↑ 12% from last month',
        changeType: 'positive',
      },
      profit: {
        title: 'Net Profit',
        value: '₹1,85,400',
        change: '↓ 8.2% from last month',
        changeType: 'negative',
      },
      margin: {
        title: 'Profit Margin',
        value: '15.4%',
        change: '↓ 2.6% from last month',
        changeType: 'negative',
      },
      leakage: {
        title: 'Est. Profit Leakage',
        value: '₹1,20,000/mo',
        change: 'Critical',
        changeType: 'negative',
      },
      forecast: {
        title: '3-Month Forecast',
        value: 'Stable Growth',
        change: '82% ML Confidence',
        changeType: 'neutral',
      },
    },
    charts: {
      revenueProfitTrend: [
        { month: 'Jan', revenue: 8.5, profit: 2.1 },
        { month: 'Feb', revenue: 9.2, profit: 2.25 },
        { month: 'Mar', revenue: 8.8, profit: 2.05 },
        { month: 'Apr', revenue: 9.5, profit: 2.15 },
        { month: 'May', revenue: 10.2, profit: 2.0 },
        { month: 'Jun', revenue: 12.04, profit: 1.85 },
      ],
      profitLeakageBreakdown: [
        { category: 'Discount Leakage', loss: 42000 },
        { category: 'Late Payments', loss: 28000 },
        { category: 'Low Margin Products', loss: 18000 },
        { category: 'Returns', loss: 8000 },
        { category: 'Inventory Waste', loss: 4000 },
      ],
      productProfitability: [
        { name: 'Product B', profit: 65000, margin: 28 },
        { name: 'Product A', profit: 42000, margin: 12 },
        { name: 'Product C', profit: 31000, margin: 22 },
        { name: 'Product D', profit: 28000, margin: 18 },
      ],
      profitForecast: [
        { month: 'Mar', historical: 2.05, predicted: null },
        { month: 'Apr', historical: 2.15, predicted: null },
        { month: 'May', historical: 2.00, predicted: null },
        { month: 'Jun', historical: 1.85, predicted: 1.85 },
        { month: 'Jul', historical: null, predicted: 1.95 },
        { month: 'Aug', historical: null, predicted: 2.14 },
        { month: 'Sep', historical: null, predicted: 2.30 },
      ],
    },
    recommendations: [
      {
        title: 'Reduce Product A discount from 22% to 10%',
        priority: 'high',
        reason: 'Product A moves at high volume, but the 22% discount destroys its contribution margin.',
        confidence: 85,
        estimatedRecovery: '₹22,000/mo',
        recoveryMonthly: 22000, // ₹/month, numeric — used for goal-gap math
      },
      {
        title: 'Enforce payment terms with Customer XYZ',
        priority: 'high',
        reason: 'Customer XYZ consistently pays 45 days late, acting as an interest-free loan at your expense.',
        confidence: 82,
        estimatedRecovery: '₹48,500 cashflow',
        recoveryMonthly: null, // one-time cash unlock, not recurring profit
      },
      {
        title: 'Review pricing on low-margin products',
        priority: 'medium',
        reason: 'Products with <15% margin are dragging overall profitability down as operating costs rise.',
        confidence: 72,
        estimatedRecovery: '₹15,000/mo',
        recoveryMonthly: 15000,
      },
    ],
  }
}

// ============ Transactions Mock ============
// TODO: backend — GET /transactions (rows land here from POST /extract for
// OCR'd ledger photos and POST /analyze for CSV imports).

export function getTransactions() {
  return [
    { id: 't1', date: '2026-06-03', item: 'Product A', qty: 12, unit_price: 450, amount: 5400, source: 'ocr', confidence: 0.96 },
    { id: 't2', date: '2026-06-04', item: 'Product B', qty: 3, unit_price: 1200, amount: 3600, source: 'ocr', confidence: 0.71 },
    { id: 't3', date: '2026-06-05', item: 'Product C', qty: 8, unit_price: 620, amount: 4960, source: 'csv', confidence: 1 },
    { id: 't4', date: '2026-06-09', item: 'Product A', qty: 20, unit_price: 450, amount: 9000, source: 'csv', confidence: 1 },
    { id: 't5', date: '2026-06-11', item: 'Product D', qty: 5, unit_price: 880, amount: 4400, source: 'ocr', confidence: 0.88 },
    { id: 't6', date: '2026-06-14', item: 'Product B', qty: 6, unit_price: 1200, amount: 7200, source: 'ocr', confidence: 0.93 },
    { id: 't7', date: '2026-06-18', item: 'Product E', qty: 15, unit_price: 240, amount: 3600, source: 'ocr', confidence: 0.64 },
    { id: 't8', date: '2026-06-21', item: 'Product A', qty: 10, unit_price: 430, amount: 4300, source: 'ocr', confidence: 0.91 },
    { id: 't9', date: '2026-06-25', item: 'Product C', qty: 4, unit_price: 620, amount: 2480, source: 'csv', confidence: 1 },
    { id: 't10', date: '2026-06-28', item: 'Product D', qty: 7, unit_price: 880, amount: 6160, source: 'ocr', confidence: 0.97 },
  ]
}

// ============ Simulation Mock ============

export async function runSimulation(params) {
  await sleep(1500) // Simulate Gemma processing
  
  // Calculate mock impacts based on the params passed in (price, discount, collection, marketing)
  let profitChange = 0;
  if (params.priceChange) profitChange += 28400; // Fake math for demo
  if (params.discountChange) profitChange += 22000;
  if (params.collectionDays) profitChange += 5000;
  
  const currentProfit = 185400;
  const projectedProfit = currentProfit + profitChange;
  
  // Fake graph data showing the simulation trend
  const graphData = [
    { month: 'Jun', current: 1.85, projected: 1.85 },
    { month: 'Jul', current: 1.95, projected: 1.95 + (profitChange / 100000) * 0.3 },
    { month: 'Aug', current: 2.14, projected: 2.14 + (profitChange / 100000) * 0.7 },
    { month: 'Sep', current: 2.30, projected: 2.30 + (profitChange / 100000) },
  ];

  // Simple verdict logic
  const isRecommended = profitChange > 0;
  
  return {
    impact: {
      currentProfit: `₹${(currentProfit/100000).toFixed(2)}L`,
      projectedProfit: `₹${(projectedProfit/100000).toFixed(2)}L`,
      difference: profitChange >= 0 ? `+₹${profitChange.toLocaleString()}/mo` : `-₹${Math.abs(profitChange).toLocaleString()}/mo`,
      confidence: '84%',
      risk: profitChange > 25000 ? 'Medium' : 'Low',
      reward: profitChange > 20000 ? 'High' : 'Moderate',
      projectedMargin: '18.6%',
    },
    graph: graphData,
    verdict: {
      status: isRecommended ? 'Recommended' : 'Not Recommended',
      color: isRecommended ? 'green' : 'red',
      reason: isRecommended 
        ? `Adjusting these parameters improves monthly profit by ₹${profitChange.toLocaleString()} while maintaining an acceptable churn risk.`
        : `This strategy increases churn probability by 22%, which outweighs the expected short-term gains.`,
    }
  }
}
