import { Camera, FileSpreadsheet } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import { getTransactions } from '../api/client.js'
import { formatINR } from '../lib/goals.js'

// Per-row extraction confidence: green >90%, amber 70–90%, red <70%.
function confidenceColor(c) {
  if (c > 0.9) return 'bg-emerald-500'
  if (c >= 0.7) return 'bg-amber-500'
  return 'bg-red-500'
}

export default function TransactionsPage() {
  const transactions = getTransactions()
  const total = transactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-5 p-5">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Transactions</h1>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Rows extracted from your uploads — OCR ledger photos and CSV imports.
              </p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {transactions.length} rows · <span className="font-semibold text-slate-700 dark:text-slate-200">{formatINR(total)}</span>
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 text-right font-medium">Qty</th>
                  <th className="px-4 py-3 text-right font-medium">Unit price</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 text-right font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-slate-50 last:border-0 dark:border-slate-800/50"
                  >
                    <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{t.date}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">{t.item}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-300">{t.qty}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-300">
                      ₹{t.unit_price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-700 dark:text-slate-200">
                      ₹{t.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-2.5">
                      {t.source === 'ocr' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                          <Camera size={10} /> OCR
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          <FileSpreadsheet size={10} /> CSV
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${confidenceColor(t.confidence)}`} />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {Math.round(t.confidence * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            Rows under 90% confidence should be reviewed before analysis — correction flow lands
            with the extraction panel.
          </p>
        </div>
      </div>
    </div>
  )
}
