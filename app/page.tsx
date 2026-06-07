"use client"

import { useCallback, useRef, useState } from "react"
import { ChatHeader } from "@/components/chat-header"
import { ChatMessages } from "@/components/chat-messages"
import { ChatFooter } from "@/components/chat-footer"
import { RatingModal, TransactionModal, ComplaintModal } from "@/components/chat-modals"
import { type Message, nowTime, uid, smartReply } from "@/components/chat-types"

type ModalKind = "rating" | "transaction" | "complaint" | null

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)
  const [modal, setModal] = useState<ModalKind>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pushMessage = useCallback((msg: Omit<Message, "id" | "time">) => {
    setMessages((prev) => [...prev, { ...msg, id: uid(), time: nowTime() }])
  }, [])

  const botReply = useCallback((text: string) => {
    setTyping(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [
        ...prev,
        { id: uid(), sender: "bot", type: "text", content: text, time: nowTime() },
      ])
    }, 1200)
  }, [])

  const handleSend = useCallback(
    (text: string) => {
      pushMessage({ sender: "user", type: "text", content: text })
      botReply(smartReply(text))
    },
    [pushMessage, botReply],
  )

  const handleSendImage = useCallback(
    (url: string) => {
      pushMessage({ sender: "user", type: "image", content: url })
      botReply("已收到您的图片，客服正在核实，请稍候～")
    },
    [pushMessage, botReply],
  )

  const handleUrge = useCallback(() => {
    pushMessage({ sender: "system", type: "text", content: "您已催促客服，正策马加鞭为您处理～" })
    botReply("收到您的催促啦！客服会优先为您加急处理，预计 3-5 分钟内回复～")
  }, [pushMessage, botReply])

  const handleTransactionConfirm = useCallback(() => {
    botReply("你已确认，等待对方确认中。")
  }, [botReply])

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col bg-neutral-100">
      <ChatHeader />
      <ChatMessages messages={messages} typing={typing} onTransactionConfirm={handleTransactionConfirm} />
      <ChatFooter
        onSend={handleSend}
        onSendImage={handleSendImage}
        onUrge={handleUrge}
        onRate={() => setModal("rating")}
        onTransaction={() => setModal("transaction")}
        onComplaint={() => setModal("complaint")}
      />

      {modal === "rating" && (
        <RatingModal
          onClose={() => setModal(null)}
          onSubmit={(stars, text) => {
            setModal(null)
            pushMessage({
              sender: "user",
              type: "text",
              content: `我给出了 ${stars} 星评价${text ? `：${text}` : ""}`,
            })
            botReply(`感谢您的 ${stars} 星好评！您的认可是我们最大的动力，祝您游戏愉快～🦀`)
          }}
        />
      )}

      {modal === "transaction" && <TransactionModal onClose={() => setModal(null)} />}

      {modal === "complaint" && (
        <ComplaintModal
          onClose={() => setModal(null)}
          onSubmit={(category, text) => {
            setModal(null)
            pushMessage({
              sender: "user",
              type: "text",
              content: `投诉建议【${category}】${text ? `：${text}` : ""}`,
            })
            botReply(`已收到您关于「${category}」的反馈，客服会尽快跟进核实并给您答复，非常抱歉给您带来不便！`)
          }}
        />
      )}
    </div>
  )
}
