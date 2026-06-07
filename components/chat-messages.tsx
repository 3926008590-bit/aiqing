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
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <MessageRow>
      <div className="relative w-full max-w-full overflow-hidden rounded-xl rounded-tl-sm border border-neutral-100 bg-white shadow-sm">
        <div className="absolute right-4 top-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-neutral-300 opacity-60">
          <span className="text-xs font-medium text-neutral-400">已作废</span>
        </div>
        <div className="flex items-center gap-2 px-4 pt-4">
          <p className="text-base font-semibold text-neutral-900">请阅读确认</p>
          <span className="inline-block rounded-full bg-orange-500 px-3 py-1 text-sm font-medium text-white">
            @效率爽快点(卖家)
          </span>
        </div>
        <div className="mx-4 mt-3 rounded-lg bg-neutral-100 p-3">
          <div className="flex gap-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
              <Image
                src="/game-skin.png"
                alt="商品缩略图"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-base font-medium text-neutral-900">【CXLQG5071】金皮1...</p>
              <p className="mt-1 text-sm text-neutral-400 line-through">原价¥120</p>
              <p className="mt-1 text-lg font-semibold text-orange-500">预估到手¥90</p>
            </div>
          </div>
        </div>
        <div className="px-4 mt-4">
          <p className="text-base font-medium text-neutral-900">交易流程:</p>
          <p className="mt-2 text-sm leading-relaxed text-blue-500">
            1.确认账号信息—2.买家上号验号—3.双方换绑账号—4.合同放款
          </p>
        </div>
        <div className="px-4 mt-4 space-y-1.5">
          <p className="text-sm text-neutral-500">1.请仔细阅读以下须知</p>
          <p className="text-sm text-neutral-500">2.点击【<span className="font-medium text-orange-500">开始交易</span>】即视为同意交易</p>
        </div>
        <div className="mx-4 mt-4 overflow-hidden rounded-lg bg-gradient-to-br from-orange-50 to-amber-100 p-4">
          <p className="text-center text-base font-semibold text-neutral-700">账号交易须知提醒</p>
          <div className="mt-3 flex items-center justify-between rounded-lg bg-white/70 p-3">
            <span className="rounded-full bg-orange-400 px-2 py-1 text-xs font-semibold text-white">卖家须知</span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700"
            >
              <span>{isExpanded ? "收起" : "展开"}</span>
              <svg
                className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {isExpanded && (
            <div className="mt-3 space-y-3">
              <div className="rounded-lg bg-white p-3">
                <div className="space-y-2.5 text-xs">
                  <p><span className="mr-2 inline-block h-5 w-5 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-bold text-white">01</span><span className="font-medium text-orange-600">渠道账号是整体打包出售</span>，若账号同渠道有连体登录的游戏，无法单款游戏拆分出售。</p>
                  <p><span className="mr-2 inline-block h-5 w-5 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-bold text-white">02</span><span className="font-medium text-orange-600">无法换绑请提前告知</span><br />账号若存在虚拟号注册，绑定手机号停机，注销导致无法换绑等死绑情况，请提前告知，避免产生个人损失。</p>
                  <p><span className="mr-2 inline-block h-5 w-5 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-bold text-white">03</span><span className="font-medium text-orange-600">4399账号不要空绑定进行交易</span><br />请务必绑定手机/邮箱/密保问题其中任一项，避免账号有丢失风险。</p>
                  <p><span className="mr-2 inline-block h-5 w-5 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-bold text-white">04</span><span className="font-medium text-orange-600">提前关闭云空间或云服务</span><br />为避免交易过程中个人隐私泄露，在进行账号换绑前，卖家需提前关闭不同渠道对应的云空间或云服务。</p>
                  <p><span className="mr-2 inline-block h-5 w-5 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-bold text-white">05</span><span className="font-medium text-orange-600">交易前需卖家确认账号</span>（如华为/小米/vivo/苹果ID等）能否退出，并提前告知实名、邮箱、银行卡、密保等是否支持换绑/清退。</p>
                </div>
              </div>
              <div className="rounded-lg bg-white p-3">
                <h4 className="mb-2 text-xs font-semibold text-orange-600">渠道服务机制</h4>
                <div className="space-y-2.5 text-xs">
                  <p><span className="mr-2 inline-block h-5 w-5 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-bold text-white">01</span>因厂商机制不同，各渠道服务账号换绑审核期及押款时间各异（如华为为3天、应用宝-微信7天，谷歌邮箱7天）。</p>
                  <p><span className="mr-2 inline-block h-5 w-5 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-bold text-white">02</span>渠道服基于安卓系统版本数据共享，可通过对应手机的应用商城下载游戏，使用不同手机账号登录游玩。</p>
                  <p><span className="mr-2 inline-block h-5 w-5 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-bold text-white">03</span><span className="font-medium text-orange-600">一个手机号仅能同时绑定一个手机渠道账号</span><br />若被换绑的手机号在该渠道已有账号，不管是否有游戏角色都请不要继续换绑，否则两个账号会互相抵消并且无法追回，请及时更换其他手机号换绑。</p>
                </div>
              </div>
            </div>
          )}
          {!isExpanded && (
            <p className="mt-2 text-center text-xs text-neutral-400">
              渠道账号是整体打包出售，若账号同渠道有连体登录的游
            </p>
          )}
        </div>
        <button className="mx-4 mt-4 mb-4 w-full rounded-lg bg-neutral-300 py-3 text-base font-medium text-neutral-500">
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
