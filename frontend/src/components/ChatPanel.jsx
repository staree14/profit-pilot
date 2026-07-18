import { useEffect, useRef } from 'react'
import { Sparkles, Maximize2, Minimize2 } from 'lucide-react'
import MessageBubble from './MessageBubble.jsx'
import Composer from './Composer.jsx'
import SuggestedQuestions from './chat/SuggestedQuestions.jsx'
import EvidencePanel from './chat/EvidencePanel.jsx'
import AIStatusPanel from './chat/AIStatusPanel.jsx'

export default function ChatPanel({ messages, thinking, pipeline, onSend, expanded, onToggleExpand }) {
  const listRef = useRef(null)

  // Latest assistant message drives evidence and follow-up chips.
  // pipeline comes in as a prop so its reveal can start while the reply
  // is still being held back (see AppPage.handleSend).
  const latestAssistant = [...messages].reverse().find((m) => m.role === 'assistant')

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, thinking])

  return (
    <section className="flex h-full min-h-0 flex-col border-l border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-sm">
            <Sparkles size={16} strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Gemma Business Advisor</div>
            <div className="truncate text-xs text-slate-500 dark:text-slate-400">
              AI-powered profit analysis
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
          <button
            onClick={onToggleExpand}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 dark:border-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Message list */}
      <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:300ms]" />
            </div>
          </div>
        )}
      </div>

      {/* AI Pipeline — revealed step by step, straight from the response */}
      <AIStatusPanel pipeline={pipeline} isThinking={thinking} />

      {/* Evidence + confidence, straight from the response */}
      <EvidencePanel
        evidence={latestAssistant?.evidence}
        confidence={latestAssistant?.confidence}
      />

      {/* Follow-up chips, straight from the response */}
      {latestAssistant?.suggested_followups && (
        <SuggestedQuestions
          suggestions={latestAssistant.suggested_followups}
          onSelect={(text) => onSend(text)}
        />
      )}

      {/* Composer */}
      <Composer onSend={onSend} disabled={thinking} />
    </section>
  )
}
