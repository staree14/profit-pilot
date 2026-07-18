import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

// Collapsible evidence panel (from chat_panel.html): `evidence` is the
// backend's array of { claim, source } items and `confidence` its top-level
// 0..1 score — both rendered untouched, no frontend-side reformatting.
export default function EvidencePanel({ evidence, confidence }) {
  const [expanded, setExpanded] = useState(false)

  if (!evidence || evidence.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border-t border-slate-100 dark:border-slate-800"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
      >
        <span className="flex items-center gap-1.5">
          <BookOpen size={13} />
          Evidence & Sources
          {confidence != null && (
            <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              {Math.round(confidence * 100)}% confidence
            </span>
          )}
        </span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5 px-4 pb-4">
              {evidence.map((item, i) => (
                <div
                  key={i}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {item.source}
                  </span>
                  {' — '}
                  {item.claim}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
