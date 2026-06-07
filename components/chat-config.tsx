"use client"

import { useState, createContext, useContext, useEffect, ReactNode } from "react"

export interface ChatConfig {
  customerServiceName: string
  orderNumber: string
  productImage: string
  productId: string
  productName: string
  productDescription: string
  sellerName: string
  originalPrice: string
  finalPrice: string
}

const defaultConfig: ChatConfig = {
  customerServiceName: "螃蟹交付专员-绝缘",
  orderNumber: "ZH87654321987654321123",
  productImage: "/game-skin.png",
  productId: "CRJYG6289",
  productName: "金皮1...",
  productDescription: "游戏商品描述",
  sellerName: "绝缘pxzc",
  originalPrice: "¥120",
  finalPrice: "¥90",
}

const STORAGE_KEY = "chat-config"

function loadConfig(): ChatConfig {
  if (typeof window === "undefined") return defaultConfig
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return { ...defaultConfig, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.error("Failed to load config:", e)
  }
  return defaultConfig
}

function saveConfig(config: ChatConfig) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch (e) {
    console.error("Failed to save config:", e)
  }
}

interface ChatConfigContextType {
  config: ChatConfig
  updateConfig: (updates: Partial<ChatConfig>) => void
  resetConfig: () => void
}

const ChatConfigContext = createContext<ChatConfigContextType | null>(null)

export function ChatConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ChatConfig>(defaultConfig)

  useEffect(() => {
    setConfig(loadConfig())
  }, [])

  const updateConfig = (updates: Partial<ChatConfig>) => {
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates }
      saveConfig(newConfig)
      return newConfig
    })
  }

  const resetConfig = () => {
    setConfig(defaultConfig)
    saveConfig(defaultConfig)
  }

  return (
    <ChatConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </ChatConfigContext.Provider>
  )
}

export function useChatConfig() {
  const context = useContext(ChatConfigContext)
  if (!context) {
    throw new Error("useChatConfig must be used within ChatConfigProvider")
  }
  return context
}
