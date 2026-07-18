import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Upload, Moon, Sun } from 'lucide-react'
import { getProfile } from '../api/client.js'

// Theme logic from chat_panel.html: data-theme on <html>, persisted as
// 'profitpilot-theme'. Tailwind's dark: variant keys off the same attribute
// (see index.css).
function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('profitpilot-theme') || 'light',
  )
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('profitpilot-theme', theme)
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

const NAV_ITEMS = [
  { to: '/app', label: 'Home', end: true },
  { to: '/app/transactions', label: 'Transactions' },
  { to: '/app/analytics', label: 'Analytics' },
  { to: '/app/goals', label: 'Goals' },
]

export default function TopBar({ onUpload }) {
  const fileRef = useRef(null)
  const [theme, toggleTheme] = useTheme()
  const profile = getProfile()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
            P
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            ProfitPilot
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? <Sun size={15} strokeWidth={1.75} /> : <Moon size={15} strokeWidth={1.75} />}
        </button>

        {onUpload && (
          <>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-white hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
            >
              <Upload size={15} strokeWidth={1.75} />
              Upload Data
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onUpload(file)
                e.target.value = ''
              }}
            />
          </>
        )}

        {/* Profile */}
        <div className="ml-1 flex items-center gap-2">
          <span className="hidden text-sm text-slate-600 sm:block dark:text-slate-300">
            Hi, <span className="font-semibold">{profile.name}</span>
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-xs font-semibold text-white">
            {profile.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  )
}
