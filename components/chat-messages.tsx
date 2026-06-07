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
        {/* 已作废印章 */}
        <div className="absolute right-3 top-3 rotate-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-neutral-300 opacity-60">
            <span className="text-sm font-bold text-neutral-400">已作废</span>
          </div>
        </div>
        
        {/* 标题区域 */}
        <div className="flex items-center gap-2 px-4 pt-4">
          <p className="text-2xl md:text-3xl font-bold text-neutral-800">请阅读确认</p>
          <span className="inline-block rounded-full bg-gradient-to-r from-orange-400 to-amber-500 px-4 py-2 text-lg font-bold text-white">
            @效率爽快点(卖家)
          </span>
        </div>
        
        {/* 商品信息 */}
        <div className="mx-4 mt-4 rounded-2xl bg-neutral-100 p-4">
          <div className="flex gap-4">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl">
              <Image
                src="/game-skin.png"
                alt="商品缩略图"
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center flex-1">
              <p className="text-xl md:text-2xl font-semibold text-neutral-800">【CXLQG5071】金皮1...</p>
              <p className="mt-2 text-2xl md:text-3xl text-neutral-400 line-through">原价¥120</p>
              <p className="mt-2 text-3xl md:text-4xl font-semibold text-orange-500">预估到手¥90</p>
            </div>
          </div>
        </div>
        
        {/* 交易流程 */}
        <div className="px-4 mt-6">
          <p className="text-2xl md:text-3xl font-bold text-neutral-800">交易流程：</p>
          <p className="mt-3 text-2xl md:text-3xl leading-relaxed text-blue-400 font-semibold">
            1.确认账号信息—2.买家上号验号—3.双方换绑账号—4.合同放款
          </p>
        </div>
        
        {/* 提示文字 */}
        <div className="px-4 mt-6 space-y-3">
          <p className="text-xl md:text-2xl text-neutral-500">1.请仔细阅读以下须知</p>
          <p className="text-xl md:text-2xl text-neutral-500">2.点击【<span className="font-bold text-yellow-600">开始交易</span>】即视为同意交易</p>
        </div>
        
        {/* 账号交易须知提醒区域 */}
        <div className="mx-4 mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-200 via-amber-100 to-orange-200 p-6 relative">
          {/* 装饰背景 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-300/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-300/30 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <p className="text-center text-3xl md:text-4xl font-black text-neutral-700 relative z-10" style={{ textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff' }}>
            账号交易须知提醒
          </p>
          
          {/* 卖家须知区域 */}
          <div className="mt-6 relative z-10">
            <div className="bg-white/80 backdrop-blur rounded-2xl overflow-hidden border-2 border-orange-200">
              {/* 标题栏 */}
              <div className="flex items-center justify-between bg-gradient-to-r from-orange-400 to-transparent p-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-transparent" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}></div>
                <span className="relative z-10 text-xl md:text-2xl font-black text-white">卖家须知</span>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="relative z-10 flex items-center gap-2 rounded-full bg-white px-6 py-2 shadow-lg"
                >
                  <span className="text-xl md:text-2xl font-medium text-amber-600">{isExpanded ? "收起" : "展开"}</span>
                  <svg
                    className={`h-6 w-6 transition-transform text-amber-600 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {/* 展开内容 */}
              {isExpanded && (
                <div className="p-5 space-y-6">
                  {/* 卖家须知内容 */}
                  <div className="space-y-5">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white text-2xl font-bold">
                        01
                      </div>
                      <div className="flex-1">
                        <p className="text-xl md:text-2xl font-semibold text-neutral-800">
                          渠道账号是整体打包出售，若账号同渠道有连体登录的游戏，无法单款游戏拆分出售。
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white text-2xl font-bold">
                        02
                      </div>
                      <div className="flex-1">
                        <p className="text-xl md:text-2xl font-bold text-orange-500">无法换绑请提前告知</p>
                        <p className="text-xl md:text-2xl font-semibold text-neutral-700 mt-1">
                          账号若存在虚拟号注册，绑定手机号停机，注销导致<span className="text-orange-500 font-bold">无法换绑</span>等死绑情况，请提前告知，避免产生个人损失。
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white text-2xl font-bold">
                        03
                      </div>
                      <div className="flex-1">
                        <p className="text-xl md:text-2xl font-bold text-orange-500">4399账号不要空绑定进行交易</p>
                        <p className="text-xl md:text-2xl font-semibold text-neutral-700 mt-1">
                          请务必绑定手机/邮箱/密保问题其中任一项，避免账号有丢失风险。
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white text-2xl font-bold">
                        04
                      </div>
                      <div className="flex-1">
                        <p className="text-xl md:text-2xl font-bold text-orange-500">提前关闭云空间或云服务</p>
                        <p className="text-xl md:text-2xl font-semibold text-neutral-700 mt-1">
                          为避免交易过程中个人隐私泄露，在进行账号换绑前，卖家需提前关闭不同渠道对应的云空间或云服务
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white text-2xl font-bold">
                        05
                      </div>
                      <div className="flex-1">
                        <p className="text-xl md:text-2xl font-semibold text-neutral-800">
                          交易前需<span className="font-bold">卖家确认账号</span>（如华为/小米/vivo/苹果ID等）能否退出，并提前告知<span className="text-orange-500 font-bold">实名、邮箱、银行卡、密保等是否支持换绑/清退。</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 渠道服机制 */}
                  <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl overflow-hidden border border-orange-200">
                    <div className="bg-gradient-to-r from-orange-400 to-transparent p-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-transparent" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}></div>
                      <span className="relative z-10 text-xl md:text-2xl font-black text-white">渠道服机制</span>
                    </div>
                    <div className="p-5">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white text-2xl font-bold">
                          01
                        </div>
                        <div className="flex-1">
                          <p className="text-xl md:text-2xl font-semibold text-neutral-800">
                            因厂商机制不同，各渠道服账号换绑审核期及押款时间各异（如华为3天、应用宝-微信7天、谷歌邮箱7天）。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 收起时的提示 */}
              {!isExpanded && (
                <div className="p-5">
                  <p className="text-center text-lg md:text-xl text-neutral-400">
                    渠道账号是整体打包出售，若账号同渠道有连体登录的游
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 开始交易按钮 */}
        <button className="mx-4 mt-6 mb-6 w-full rounded-2xl bg-neutral-300 py-4 text-3xl md:text-4xl font-medium text-neutral-500">
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
