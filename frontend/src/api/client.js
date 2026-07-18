// Single seam between the UI and the backend.
// Flip USE_MOCKS to false once the real endpoints exist:
//   POST /chat · GET /dashboard · POST /simulate · POST /ingest
const USE_MOCKS = false

import * as mockApi from '../mocks/api.js'

// TODO: backend — POST /chat
// Response contract (pipeline / evidence / confidence / suggested_followups)
// is documented in ../mocks/api.js and implemented by the disposable stub in
// tools/temp-mock-chat-server/. The UI renders those fields untouched.
export async function sendMessage(text, history) {
  if (USE_MOCKS) return mockApi.sendMessage(text, history)
  const res = await fetch('http://127.0.0.1:8000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text, history }),
  })
  return res.json()
}

// TODO: backend — GET /dashboard (route exists in backend/app/main.py; wire
// once its response matches the cards/charts/recommendations/report shape).
// Falls back to mock even when USE_MOCKS=false so the UI keeps rendering.
export function getDashboardData() {
  // Always return mock data for now because the backend needs
  // file upload (/analyze) to be wired up first!
  return mockApi.getDashboardData()
}

// TODO: backend — POST /simulate
export async function runSimulation(params) {
  // Same here, use mocks until ML integration is fully complete on the frontend
  return mockApi.runSimulation(params)
}

// ---- Goals ----
// TODO: backend — GET /goals · POST /goals · DELETE /goals/:id.
// Mock-backed regardless of USE_MOCKS until those endpoints exist.
// When they land, also send active goals with POST /chat so RAG answers
// become goal-aware.
import * as mockGoals from '../mocks/goals.js'

export async function getGoals() {
  return mockGoals.getGoals()
}

export async function createGoal(goal) {
  return mockGoals.createGoal(goal)
}

export async function deleteGoal(id) {
  return mockGoals.deleteGoal(id)
}

// TODO: backend — GET /profile
export function getProfile() {
  return mockApi.profile
}

// TODO: backend — GET /transactions
export function getTransactions() {
  return mockApi.getTransactions()
}

// TODO: backend — numeric metrics from GET /profit / GET /dashboard
export function getCurrentMetrics() {
  return mockApi.getCurrentMetrics()
}

export { greeting, SEED_SUGGESTIONS } from '../mocks/api.js'
