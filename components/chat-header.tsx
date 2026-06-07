import { ChevronLeft, MoreHorizontal, Check } from "lucide-react"

const steps = ["确认账号信息", "买家上号验号", "双方换绑账号"]

export function ChatHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white">
      {/* Top nav bar */}
      <div className="flex h-12 items-center justify-start pl-3 pr-3">
        <button aria-label="返回" className="flex h-8 w-8 shrink-0 items-center justify-center">
          <ChevronLeft className="h-6 w-6 text-neutral-800" />
        </button>
        <h1 className="ml-2.5 text-left text-base font-semibold text-neutral-900">CXLQG5071超自然行动组</h1>
        <button aria-label="更多" className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center">
          <MoreHorizontal className="h-6 w-6 text-neutral-800" />
        </button>
      </div>

      {/* Step labels */}
      <div className="flex items-center justify-center gap-3 px-3 pb-2.5">
        {steps.map((step) => (
          <div key={step} className="flex items-center gap-1 text-green-600">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
              <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
            </span>
            <span className="text-xs font-medium">{step}</span>
          </div>
        ))}
      </div>
    </header>
  )
}
