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
        <span className="absolute -top-1.5 right-2 rotate-12 rounded-full bg-red-400 px-2.5 py-0.5 text-[10px] font-bold text-white opacity-80">
          已作废
        </span>
        <div className="flex items-center gap-2 px-3 pt-3">
          <p className="text-sm font-semibold text-neutral-900">请阅读确认</p>
          <span className="inline-block rounded-full bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
            @绝缘pxzc(卖家)
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
              <p className="truncate text-sm font-medium text-neutral-900">【CRTTR8765】金皮1...</p>
              <p className="mt-1 text-xs text-neutral-400 line-through">原价¥120</p>
              <p className="mt-0.5 text-orange-500">
                <span className="text-xs">预估到手¥</span>
                <span className="text-base font-semibold">90</span>
              </p>
            </div>
          </div>
          {isExpanded && (
            <>
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
                <div className="mt-3 space-y-3">
                  <div className="rounded-lg bg-white p-3">
                    <h4 className="mb-2 text-xs font-semibold text-orange-600">卖家须知</h4>
                    <div className="space-y-2 text-xs text-neutral-700">
                      <p><span className="mr-2 inline-block h-4 w-4 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-medium text-white">01</span>渠道账号是整体打包出售，若账号同渠道有连体登录的游戏，无法单款游戏拆分出售。</p>
                      <p><span className="mr-2 inline-block h-4 w-4 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-medium text-white">02</span>无法换绑请提前告知：账号若存在虚拟号注册，绑定手机号停机，注销导致无法换绑等死绑情况，请提前告知，避免产生个人损失。</p>
                      <p><span className="mr-2 inline-block h-4 w-4 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-medium text-white">03</span>4399账号不要空绑定进行交易：请务必绑定手机/邮箱/密保问题其中任一项，避免账号有丢失风险。</p>
                      <p><span className="mr-2 inline-block h-4 w-4 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-medium text-white">04</span>提前关闭云空间或云服务：为避免交易过程中个人隐私泄露，在进行账号换绑前，卖家需提前关闭不同渠道对应的云空间或云服务。</p>
                      <p><span className="mr-2 inline-block h-4 w-4 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-medium text-white">05</span>交易前需卖家确认账号（如华为/小米/vivo/苹果ID等）能否退出，并提前告知实名、邮箱、银行卡、密保等是否支持换绑/清退。</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-3">
                    <h4 className="mb-2 text-xs font-semibold text-orange-600">渠道服务机制</h4>
                    <div className="space-y-2 text-xs text-neutral-700">
                      <p><span className="mr-2 inline-block h-4 w-4 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-medium text-white">01</span>因厂商机制不同，各渠道服务账号换绑审核期及押款时间各异（如华为为3天、应用宝-微信7天，谷歌邮箱7天）。</p>
                      <p><span className="mr-2 inline-block h-4 w-4 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-medium text-white">02</span>渠道服基于安卓系统版本数据共享，可通过对应手机的应用商城下载游戏，使用不同手机账号登录游玩。</p>
                      <p><span className="mr-2 inline-block h-4 w-4 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-medium text-white">03</span>一个手机号仅能同时绑定一个手机渠道账号：若被换绑的手机号在该渠道已有账号，不管是否有游戏角色都请不要继续换绑，否则两个账号会互相抵消并且无法追回，请及时更换其他手机号换绑。</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-3">
                    <h4 className="mb-2 text-xs font-semibold text-orange-600">交易须知</h4>
                    <div className="mb-3">
                      <h5 className="mb-2 text-xs font-medium text-neutral-800">一、验号与取消规则</h5>
                      <div className="space-y-2 text-xs text-neutral-700">
                        <p><span className="mr-2 inline-block h-4 w-4 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-medium text-white">01</span>验号确认无误前双方可无责取消交易；确认验号无误后，单方面取消须支付号价5%违约金；开始挂IP或者押款需支付号价10%违约金。若卖家违约且拒不支付违约金，螃蟹平台将协同其他相关平台对该账号及对应商品进行拉黑并下架处理。</p>
                        <p><span className="mr-2 inline-block h-4 w-4 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-medium text-white">02</span>交易期间（换绑完成前），买方游玩账号、使用资源需双方协商一致。若买家取消交易，且卖家有明确证据表明买家在交易期间私自使用账号内道具、金币等直接影响账号价值的可消耗资源，买家最低需支付号价5%的违约金；若损失金额较大，需双方协商一致后方可取消交易。若24小时内协商不一致，需按平台方案处理。若买家私自开局游戏未造成损失，提出取消交易，且双方无法协商一致，买家需额外支付号价金额2.5%（最低10元）的违约金方可取消交易。</p>
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-2 text-xs font-medium text-neutral-800">二、换绑与履约规则</h5>
                      <div className="space-y-2 text-xs text-neutral-700">
                        <p><span className="mr-2 inline-block h-4 w-4 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-medium text-white">01</span>账号完成任意一项换绑，或进入换绑审核期等情况后仅支持协商解约，不接受单方面赔付违约金取消。因游戏厂商导致换绑失败，双方协商是否押款重试换绑，继续交易。</p>
                        <p><span className="mr-2 inline-block h-4 w-4 shrink-0 rounded-full bg-orange-400 text-center text-[10px] font-medium text-white">02</span>下单后订单（账号换绑审核期、挂IP等情况除外）理论交易时长为24小时内（具体等待交易时长可由双方协定），如双方无法协定一致将按平台判定方案进行，需要在等待交易时长内回应配合交付。如超出理论时长或协定时长，按违约处理。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full rounded-lg bg-neutral-300 py-2.5 text-sm font-medium text-neutral-500">
                开始交易
              </button>
            </>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 flex w-full items-center justify-center gap-1 py-2 text-xs text-neutral-600"
          >
            <span>{isExpanded ? "收起" : "展开"}</span>
            <svg
              className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
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
