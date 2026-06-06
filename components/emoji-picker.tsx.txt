"use client"

const EMOJIS = [
  "😀", "😄", "😁", "😆", "😅", "🤣",
  "😊", "🙂", "😉", "😍", "😘", "😎",
  "🤗", "🤔", "😴", "😭", "😡", "👍",
  "👎", "👌", "🙏", "👏", "💪", "🎉",
  "❤️", "💯", "🔥", "✨", "🦀", "🎮",
]

export function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-1 bg-white px-3 py-3">
      {EMOJIS.map((e) => (
        <button
          key={e}
          type="button"
          onClick={() => onSelect(e)}
          className="flex h-10 items-center justify-center rounded-lg text-2xl active:bg-neutral-100"
        >
          {e}
        </button>
      ))}
    </div>
  )
}
