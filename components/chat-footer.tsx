"use client"

import { useRef, useState } from "react"
import { Zap, Smile, FileText, AlertCircle, Image as ImageIcon, Plus, Send } from "lucide-react"
import { EmojiPicker } from "./emoji-picker"

interface ChatFooterProps {
  onSend: (text: string) => void
  onSendImage: (url: string) => void
  onUrge: () => void
  onRate: () => void
  onTransaction: () => void
  onComplaint: () => void
}

export function ChatFooter({
  onSend,
  onSendImage,
  onUrge,
  onRate,
  onTransaction,
  onComplaint,
}: ChatFooterProps) {
  const [text, setText] = useState("")
  const [showEmoji, setShowEmoji] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const actions = [
    { icon: Zap, label: "催客服", color: "text-amber-400", onClick: onUrge },
    { icon: Smile, label: "评价", color: "text-rose-400", onClick: onRate },
    { icon: FileText, label: "交易信息", color: "text-green-500", onClick: onTransaction },
    { icon: AlertCircle, label: "投诉建议", color: "text-blue-500", onClick: onComplaint },
  ]

  function handleSend() {
    const value = text.trim()
    if (!value) return
    onSend(value)
    setText("")
    setShowEmoji(false)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onSendImage(url)
    e.target.value = ""
  }

  return (
    <footer className="sticky bottom-0 z-10 bg-neutral-100">
      {/* Action buttons */}
      <div className="flex items-center justify-around px-2 py-2.5">
        {actions.map(({ icon: Icon, label, color, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm active:bg-neutral-50"
          >
            <Icon className={`h-4 w-4 ${color}`} />
            <span className="text-xs text-neutral-700">{label}</span>
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 bg-white px-3 pb-3 pt-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setShowEmoji(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend()
          }}
          placeholder="请输入想咨询的问题…"
          className="h-10 flex-1 rounded-full bg-neutral-100 px-4 text-base text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
        />
        <button
          type="button"
          aria-label="表情"
          onClick={() => setShowEmoji((s) => !s)}
          className="flex h-8 w-8 items-center justify-center"
        >
          <Smile className={`h-7 w-7 ${showEmoji ? "text-orange-500" : "text-neutral-400"}`} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          aria-label="图片"
          onClick={() => fileRef.current?.click()}
          className="flex h-8 w-8 items-center justify-center"
        >
          <ImageIcon className="h-7 w-7 text-neutral-400" strokeWidth={1.5} />
        </button>
        {text.trim() ? (
          <button
            type="button"
            aria-label="发送"
            onClick={handleSend}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        ) : (
          <button type="button" aria-label="更多" className="flex h-8 w-8 items-center justify-center">
            <Plus className="h-7 w-7 text-neutral-400" strokeWidth={1.5} />
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
      </div>

      {/* Emoji panel */}
      {showEmoji && (
        <EmojiPicker
          onSelect={(emoji) => {
            setText((t) => t + emoji)
          }}
        />
      )}
    </footer>
  )
}
