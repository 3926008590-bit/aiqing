"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
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
          <span className="text-xs text-neutral-500">螃蟹交付专员-绝缘</span>
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
        <p className="text-sm leading-relaxed text-neutral-700">ZH87654321987654321098</p>
        <p className="text-sm leading-relaxed text-neutral-500">商品编号:CRTTR8765</p>
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
        <p className="mb-1.5 text-sm font-medium text-orange-500">用户_***616(买家)</p>
        <span className="mb-2 inline-block rounded-full bg-orange-500 px-2.5 py-0.5 text-sm font-medium text-white">
          @绝缘pxzc(卖家)
        </span>
        <p className="mb-1 text-sm leading-relaxed text-red-500">
          1.客服服务时间为：09:30-00:30，非服务时段请勿擅自操作流程
        </p>
        <p className="text-sm leading-relaxed text-red-500">2.交易中有问题请及时@或催一催客服</p>
      </div>
    </MessageRow>
  )
}

function TransactionCard() {
  return (
    <MessageRow>
      <div className="w-full max-w-[360px] bg-white rounded-xl shadow-sm p-4">
        {/* 顶部标题 */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-neutral-800">请阅读确认</div>
          <div className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-sm">
            @效率爽快点(卖家)
          </div>
        </div>

        {/* 商品信息 */}
        <div className="flex gap-3 mb-4">
          <div className="w-[120px] h-[100px] rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
            <Image
              src="/game-skin.png"
              alt="商品缩略图"
              width={120}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold mb-2">【CXLQG5071】金皮1...</div>
            <div className="text-sm text-neutral-500 mb-1">原价 ¥120</div>
            <div className="text-xl text-orange-500 font-bold">预估到手 ¥90</div>
          </div>
        </div>

        {/* 交易流程 */}
        <div className="mb-4">
          <div className="text-base font-semibold mb-2">交易流程：</div>
          <div className="text-base text-blue-400 leading-relaxed">
            1.确认账号信息—2.买家上号验号—3.双方换绑账号—4.合同放款
          </div>
          <div className="text-sm text-neutral-600 mt-2 leading-relaxed">
            1.请仔细阅读以下须知<br />
            2.点击【开始交易】即视为同意交易
          </div>
        </div>

        {/* 须知提醒 */}
        <div className="bg-gradient-to-b from-orange-50 to-amber-50 rounded-lg p-3 mb-4">
          <div className="text-lg font-semibold text-center text-neutral-700 mb-3">
            账号交易须知提醒
          </div>
          <div className="flex gap-2">
            <div className="bg-orange-500 text-white px-3 py-1 rounded text-sm">
              卖家须知
            </div>
            <div className="text-orange-500 text-sm flex items-center gap-1">
              展开 ▼
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <button className="w-full py-3 bg-neutral-300 text-neutral-500 border-none rounded-lg text-base cursor-not-allowed">
          开始交易
        </button>
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
          <span className="text-xs text-neutral-500">螃蟹交付专员-绝缘</span>
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
      <div className="px-6 py-2 text-center text-xs leading-relaxed text-neutral-500">螃蟹交付专员-绝缘创建了群组</div>
      <OrderCard />
      <ImportantCard />
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
