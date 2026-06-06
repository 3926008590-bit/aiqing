"use client"

import { useState } from "react"
import { X, Star } from "lucide-react"

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-5 pb-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
          <button aria-label="关闭" onClick={onClose} className="flex h-7 w-7 items-center justify-center">
            <X className="h-5 w-5 text-neutral-400" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function RatingModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (stars: number, text: string) => void
}) {
  const [stars, setStars] = useState(5)
  const [text, setText] = useState("")
  return (
    <ModalShell title="服务评价" onClose={onClose}>
      <div className="mb-4 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setStars(n)} aria-label={`${n}星`}>
            <Star
              className={`h-9 w-9 ${n <= stars ? "fill-amber-400 text-amber-400" : "fill-neutral-200 text-neutral-200"}`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="说说您的评价吧…"
        className="h-24 w-full resize-none rounded-xl bg-neutral-100 p-3 text-base text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onSubmit(stars, text)}
        className="mt-4 h-11 w-full rounded-full bg-orange-500 text-base font-medium text-white active:bg-orange-600"
      >
        提交评价
      </button>
    </ModalShell>
  )
}

const ORDER_INFO = [
  { label: "订单编号", value: "ZH21590414336825520954" },
  { label: "商品编号", value: "CRTTR5293" },
  { label: "商品名称", value: "【CRTTR5293】金皮3..." },
  { label: "原价", value: "¥288" },
  { label: "预估到手", value: "¥235" },
  { label: "订单状态", value: "已支付 · 交付中" },
  { label: "下单时间", value: "05/07 13:32" },
]

export function TransactionModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="交易信息" onClose={onClose}>
      <div className="divide-y divide-neutral-100">
        {ORDER_INFO.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3">
            <span className="text-sm text-neutral-500">{row.label}</span>
            <span
              className={`max-w-[60%] truncate text-sm ${row.label === "预估到手" ? "font-semibold text-orange-500" : "text-neutral-800"}`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </ModalShell>
  )
}

const CATEGORIES = ["账号异常", "交付延迟", "客服态度", "价格问题", "其他"]

export function ComplaintModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (category: string, text: string) => void
}) {
  const [category, setCategory] = useState(CATEGORIES[0])
  const [text, setText] = useState("")
  return (
    <ModalShell title="投诉建议" onClose={onClose}>
      <p className="mb-2 text-sm text-neutral-500">问题分类</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              category === c ? "bg-orange-500 text-white" : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="请描述您遇到的问题…"
        className="h-24 w-full resize-none rounded-xl bg-neutral-100 p-3 text-base text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onSubmit(category, text)}
        className="mt-4 h-11 w-full rounded-full bg-orange-500 text-base font-medium text-white active:bg-orange-600"
      >
        提交
      </button>
    </ModalShell>
  )
}
