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
        <p className="text-sm leading-relaxed text-neutral-700">ZH87654321987654321123</p>
        <p className="text-sm leading-relaxed text-neutral-500">商品编号:CRJYG6289</p>
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

function TransactionCard({ onConfirm }: { onConfirm?: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <MessageRow>
      <div className="w-[320px] bg-white rounded-lg p-3 relative">
        {/* 顶部标题区：名字和标签并排 */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="text-base font-semibold text-neutral-800">请阅读确认</div>
          <div className="bg-orange-500 text-white px-2.5 py-1 rounded-full text-xs whitespace-nowrap">
            @绝缘pxzc(卖家)
          </div>
        </div>

        {/* 商品模块 */}
        <div className="flex gap-2.5 bg-neutral-100 rounded-md p-2.5 mb-2.5">
          <div className="w-[100px] h-[80px] rounded overflow-hidden flex-shrink-0">
            <Image
              src="/game-skin.png"
              alt="商品图"
              width={100}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold mb-1.5">【CRJYG6289】金皮1...</div>
            <div className="text-xs text-neutral-500 mb-0.5">原价 ¥120</div>
            <div className="text-lg text-orange-500 font-bold">预估到手 ¥90</div>
          </div>
        </div>

        {/* 交易流程 */}
        <div className="mb-2.5">
          <div className="text-sm font-semibold mb-1.5">交易流程：</div>
          <div className="text-sm text-blue-400 leading-relaxed">
            1.确认账号信息—2.买家上号验号—3.双方换绑账号—4.合同放款
          </div>
          <div className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
            1.请仔细阅读以下须知<br />
            2.点击【<span className="text-orange-500">开始交易</span>】即视为同意交易
          </div>
        </div>

        {/* 须知区域：纯图片背景 + 展开按钮 */}
        <div className="relative mb-2.5">
          <div 
            className={`rounded-md overflow-hidden transition-all duration-300 ${isExpanded ? '' : 'h-24'}`}
          >
            <Image
              src="/transaction-notice.png"
              alt="notice-bg"
              width={296}
              height={isExpanded ? 600 : 96}
              className="w-full object-cover"
              style={{ objectPosition: 'center top' }}
            />
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 text-orange-500 border-none px-4 py-1 rounded-full text-sm cursor-pointer flex items-center gap-1"
          >
            {isExpanded ? '收起 ▲' : '展开 ▼'}
          </button>
        </div>

        {/* 底部按钮 */}
        <button
          onClick={handleConfirm}
          disabled={isConfirmed}
          className={`w-full py-2.5 border-none rounded-md text-sm transition-all duration-300 ${
            isConfirmed
              ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              : 'bg-orange-500 text-white cursor-pointer'
          }`}
        >
          {isConfirmed ? '已确认' : '开始交易'}
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

export function ChatMessages({ messages, typing, onTransactionConfirm }: { messages: Message[]; typing: boolean; onTransactionConfirm?: () => void }) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  return (
    <main className="flex-1 overflow-y-auto bg-neutral-100 pb-2">
      <div className="px-6 py-2 text-center text-xs leading-relaxed text-neutral-500">螃蟹交付专员-绝缘创建了群组</div>
      <OrderCard />
      <ImportantCard />
      <TransactionCard onConfirm={onTransactionConfirm} />
      {messages.map((m) => {
        if (m.sender === "system") return <SystemTip key={m.id} message={m} />
        if (m.sender === "user") return <UserBubble key={m.id} message={m} />
        return <BotBubble key={m.id} message={m} />
      })}
      {typing && <TypingIndicator />}
      <div ref={bottomRef} />
    </main>
  )
}
