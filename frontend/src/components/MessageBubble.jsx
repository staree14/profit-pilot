import { Volume2 } from 'lucide-react'
import { speak } from '../lib/speech.js'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-2.5 text-[14px] leading-relaxed text-white shadow-sm">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] space-y-2">
        {/* Message content */}
        <div className="group relative rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          {message.content}
          <button
            onClick={() => speak(message.content)}
            aria-label="Read aloud"
            title="Read aloud"
            className="absolute -bottom-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 opacity-0 shadow-sm transition-opacity hover:text-blue-600 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:text-blue-400"
          >
            <Volume2 size={12} strokeWidth={1.75} />
          </button>
        </div>

        {/* Quick action buttons */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {message.actions.map((action) => (
              <button
                key={action.id}
                className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
