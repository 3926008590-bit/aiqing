"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import type { ReactNode } from "react"
import type { Message } from "./chat-types"

function MessageRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 px-3 py-2">
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
        <Image
          src="/crab-avatar.png"
          alt="螃蟹交付专员头像"
          width={36}
          height={36}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="text-xs text-neutral-500">螃蟹交付专员-凯凯凯</span>
          <span className="rounded bg-amber-400 px-1.5 py-px text-[10px] font-medium text-white">官方</span>
          <span className="ml-1 text-[11px] text-neutral-400">05/07 13:32</span>
        </div>
        {children}
      </div>
    </div>
  )
}

function OrderCard() {
  return (
    <MessageRow>
      <div className="w-fit max-w-full rounded-xl rounded-tl-sm border border-neutral-100 bg-white px-4 py-3 shadow-sm">
        <p className="mb-1.5 text-base font-semibold text-neutral-900">订单已支付</p>
        <p className="text-sm leading-relaxed text-neutral-500">订单编号:</p>
        <p className="text-sm leading-relaxed text-neutral-700">ZH21590414336825520954</p>
        <p className="text-sm leading-relaxed text-neutral-500">商品编号:CRTTR5293</p>
      </div>
    </MessageRow>
  )
}

function ImportantCard() {
  return (
    <MessageRow>
      <div className="relative w-full max-w-full rounded-xl rounded-tl-sm border-2 border-red-400 bg-white px-4 py-3">
        <span className="absolute -top-px right-0 rounded-bl-xl rounded-tr-xl bg-red-500 px-2.5 py-1 text-[11px] font-medium text-white">
          重要步骤
        </span>
        <p className="mb-1.5 text-base font-semibold text-neutral-900">温馨小贴士</p>
        <p className="mb-1.5 text-sm font-medium text-orange-500">@@用户_***616(买家)</p>
        <span className="mb-2 inline-block rounded-full bg-orange-500 px-2.5 py-0.5 text-sm font-medium text-white">
          @效率爽快点(卖家)
        </span>
        <p className="mb-1 text-sm leading-relaxed text-red-500">
          1.客服服务时间为：09:30-00:30，非服务时段请勿擅自操作流程
        </p>
        <p className="text-sm leading-relaxed text-red-500">2.交易中有问题请及时@或催一催客服</p>
      </div>
    </MessageRow>
  )
}

function ProductCard() {
  return (
    <MessageRow>
      <div className="relative w-full max-w-full overflow-hidden rounded-xl rounded-tl-sm border border-neutral-100 bg-white shadow-sm">
        <span className="absolute right-2 top-3 rotate-6 rounded-full border-2 border-green-500/70 px-2 py-0.5 text-[11px] font-bold text-green-600/80">
          已完成
        </span>
        <div className="flex items-center gap-2 px-3 pt-3">
          <p className="text-sm font-semibold text-neutral-900">请阅读确认</p>
          <span className="inline-block rounded-full bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
            @效率爽快点(卖家)
          </span>
        </div>
        <div className="flex gap-3 p-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
            <Image
              src="/game-skin.png"
              alt="商品缩略图"
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-col justify-center">
            <p className="truncate text-sm font-medium text-neutral-900">【CRTTR5293】金皮3...</p>
            <p className="mt-1 text-sm text-neutral-400 line-through">原价¥288</p>
            <p className="mt-0.5 text-orange-500">
              <span className="text-sm">预估到手¥</span>
              <span className="text-lg font-semibold">235</span>
            </p>
          </div>
        </div>
      </div>
    </MessageRow>
  )
}

function TransactionCard() {
  return (
    <MessageRow>
      <div className="relative w-full max-w-full overflow-hidden rounded-xl rounded-tl-sm border border-neutral-100 bg-white shadow-sm">
        <span className="absolute -top-1.5 right-2 rotate-12 rounded-full bg-red-400 px-2.5 py-0.5 text-[10px] font-bold text-white opacity-80">
          已作废
        </span>
        <div className="flex items-center gap-2 px-3 pt-3">
          <p className="text-sm font-semibold text-neutral-900">请阅读确认</p>
          <span className="inline-block rounded-full bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
            @效率爽快点(卖家)
          </span>
        </div>
        <div className="p-3">
          <div className="flex gap-3 rounded-lg bg-neutral-100 p-2">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
              <Image
                src="/game-skin.png"
                alt="商品缩略图"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-col justify-center">
              <p className="truncate text-sm font-medium text-neutral-900">【CXLQG5071】金皮1...</p>
              <p className="mt-1 text-xs text-neutral-400 line-through">原价¥120</p>
              <p className="mt-0.5 text-orange-500">
                <span className="text-xs">预估到手¥</span>
                <span className="text-base font-semibold">90</span>
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-neutral-700">交易流程:</p>
            <p className="text-xs leading-relaxed text-blue-500">
              1.确认账号信息—2.买家上号验号—3.双方换绑账号—4.合同放款
            </p>
          </div>
          <div className="mt-3 space-y-1 text-xs text-neutral-500">
            <p>1.请仔细阅读以下须知</p>
            <p>2.点击【开始交易】即视为同意交易</p>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg bg-gradient-to-br from-orange-50 to-amber-100 p-3">
            <p className="text-center text-sm font-semibold text-neutral-700">账号交易须知提醒</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="rounded-full bg-orange-200 px-2 py-0.5 text-[10px] font-medium text-orange-600">
                卖家须知
              </span>
              <button className="flex items-center gap-1 text-xs text-neutral-600">
                <span>展开</span>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-neutral-500">
              渠道账号是整体打包出售，若账号同渠道有连体登录的游
            </p>
          </div>
          <button className="mt-4 w-full rounded-lg bg-neutral-300 py-2.5 text-sm font-medium text-neutral-500">
            开始交易
          </button>
        </div>
      </div>
    </MessageRow>
  )
}

function BotBubble({ message }: { message: Message }) {
  return (
    <div className="flex gap-2 px-3 py-2">
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
        <Image
          src="/crab-avatar.png"
          alt="螃蟹交付专员头像"
          width={36}
          height={36}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="text-xs text-neutral-500">螃蟹交付专员-凯凯凯</span>
          <span className="rounded bg-amber-400 px-1.5 py-px text-[10px] font-medium text-white">官方</span>
          <span className="ml-1 text-[11px] text-neutral-400">{message.time}</span>
        </div>
        <BubbleBody message={message} side="left" />
      </div>
    </div>
  )
}

function UserBubble({ message }: { message: Message }) {
  return (
    <div className="flex justify-end px-3 py-2">
      <div className="flex max-w-[75%] flex-col items-end">
        <BubbleBody message={message} side="right" />
      </div>
    </div>
  )
}

function BubbleBody({ message, side }: { message: Message; side: "left" | "right" }) {
  if (message.type === "image") {
    return (
      <div className={`overflow-hidden rounded-xl ${side === "right" ? "rounded-tr-sm" : "rounded-tl-sm"}`}>
        <Image
          src={message.content || "/placeholder.svg"}
          alt="发送的图片"
          width={160}
          height={160}
          className="h-40 w-40 object-cover"
        />
      </div>
    )
  }
  return (
    <div
      className={`w-fit max-w-full whitespace-pre-wrap break-words rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
        side === "right"
          ? "rounded-tr-sm bg-orange-500 text-white"
          : "rounded-tl-sm border border-neutral-100 bg-white text-neutral-800 shadow-sm"
      }`}
    >
      {message.content}
    </div>
  )
}

function SystemTip({ message }: { message: Message }) {
  return (
    <div className="px-6 py-2 text-center text-xs leading-relaxed text-neutral-500">{message.content}</div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-2 px-3 py-2">
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
        <Image
          src="/crab-avatar.png"
          alt="螃蟹交付专员头像"
          width={36}
          height={36}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-5 flex items-center gap-1 rounded-xl rounded-tl-sm border border-neutral-100 bg-white px-4 py-3 shadow-sm">
        <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-300 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-300 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-300" />
      </div>
    </div>
  )
}

export function ChatMessages({ messages, typing }: { messages: Message[]; typing: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  return (
    <main className="flex-1 overflow-y-auto bg-neutral-100 pb-2">
      <OrderCard />
      <ImportantCard />
      <ProductCard />
      {messages.map((m) => {
        if (m.sender === "system") return <SystemTip key={m.id} message={m} />
        if (m.sender === "user") return <UserBubble key={m.id} message={m} />
        return <BotBubble key={m.id} message={m} />
      })}
      {typing && <TypingIndicator />}
      <TransactionCard />
      <div ref={bottomRef} />
    </main>
  )
}
