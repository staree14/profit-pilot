import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'

// Sequential pipeline reveal (from chat_panel.html's revealPipeline): the
// backend returns the full trace in one response; steps surface one at a
// time, ~400ms apart. Each step is rendered untouched — `label`, plus
// ` · source` when the backend provides one. No frontend-side rewriting
// of retrieval or function-call wording.
const STEP_INTERVAL_MS = 400

export default function AIStatusPanel({ pipeline, isThinking }) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    setVisibleCount(0)
    if (!pipeline || pipeline.length === 0) return
    const id = setInterval(() => {
      setVisibleCount((count) => {
        if (count >= pipeline.length) {
          clearInterval(id)
          return count
        }
        return count + 1
      })
    }, STEP_INTERVAL_MS)
    return () => clearInterval(id)
  }, [pipeline])

  const revealing = visibleCount < (pipeline?.length ?? 0)
  if ((!pipeline || pipeline.length === 0) && !isThinking) return null

  return (
    <div className="border-t border-slate-100 px-4 py-3 dark:border-slate-800">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        AI Pipeline
      </p>
      <div className="space-y-1.5">
        {pipeline?.slice(0, visibleCount).map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-xs"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
              <Check size={11} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-slate-500 dark:text-slate-400">
              {step.label}
              {step.source ? ` · ${step.source}` : ''}
            </span>
          </motion.div>
        ))}
        {(isThinking || revealing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
              <Loader2 size={11} className="animate-spin text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-medium text-blue-600 dark:text-blue-400">Processing...</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
