export type MessageType = "text" | "image"
export type Sender = "user" | "bot" | "system"

export interface Message {
  id: string
  sender: Sender
  type: MessageType
  content: string
  time: string
}

export function nowTime(): string {
  const d = new Date()
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return `${hh}:${mm}`
}

let counter = 0
export function uid(): string {
  counter += 1
  return `m${Date.now()}_${counter}`
}

// Keyword-based smart reply
export function smartReply(input: string): string {
  const text = input.trim()
  if (/价格|多少钱|价钱|几块|多少米|￥|\$/.test(text)) {
    return "本订单预估到手价为 ¥235（原价 ¥288），费用已在下单时锁定，请放心交易～"
  }
  if (/发货|什么时候|多久|多长时间|交付|多快/.test(text)) {
    return "客服正在为您安排交付，正常情况下 3-5 分钟内完成上号验号，请耐心等待哦～"
  }
  if (/退款|退钱|不要了|取消/.test(text)) {
    return "如需退款，可在【交易信息】中发起申请，客服会在 24 小时内为您审核处理。"
  }
  if (/问题|异常|不对|登录不了|进不去|错误|失败/.test(text)) {
    return "麻烦您把遇到的问题截图发我，我这边马上为您核实处理，给您带来不便十分抱歉！"
  }
  if (/谢谢|谢啦|感谢|辛苦|多谢/.test(text)) {
    return "不客气，能帮到您是我的荣幸～祝您游戏愉快！🦀"
  }
  if (/你好|在吗|在不|客服|有人吗/.test(text)) {
    return "您好，我是螃蟹交付专员-凯凯，很高兴为您服务，请问有什么可以帮您？"
  }
  return "已收到您的消息，客服正在快马加鞭为您处理，请稍候～"
}
