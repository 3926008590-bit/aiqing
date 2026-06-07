"use client"

import { useState } from "react"
import { ChevronLeft, MoreHorizontal, Check, FileText, MessageSquare, AlertTriangle, Star, Copy, Share2, ChevronRight, Settings } from "lucide-react"

const steps = ["确认账号信息", "买家上号验号", "双方换绑账号"]

interface FunctionMenuProps {
  onClose: () => void
  onAction: (action: string) => void
}

function FunctionMenu({ onClose, onAction }: FunctionMenuProps) {
  const menuItems = [
    { icon: Settings, label: "DIY设置", action: "settings" },
    { icon: FileText, label: "订单详情", action: "order" },
    { icon: MessageSquare, label: "交易信息", action: "transaction" },
    { icon: AlertTriangle, label: "投诉建议", action: "complaint" },
    { icon: Star, label: "服务评价", action: "rating" },
    { icon: Copy, label: "复制订单编号", action: "copy" },
    { icon: Share2, label: "分享会话", action: "share" },
  ]

  const handleClick = (action: string) => {
    onAction(action)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up rounded-t-2xl bg-white pb-8 pt-2">
        {/* Drag Handle */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-300" />
        
        {/* Menu Items */}
        <div className="px-4">
          {menuItems.map((item) => (
            <button
              key={item.action}
              onClick={() => handleClick(item.action)}
              className="flex w-full items-center gap-4 border-b border-neutral-100 py-4 text-left last:border-0"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
                <item.icon className="h-5 w-5 text-orange-500" />
              </div>
              <span className="flex-1 text-base text-neutral-800">{item.label}</span>
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

interface ChatHeaderProps {
  onMenuAction?: (action: string) => void
}

export function ChatHeader({ onMenuAction }: ChatHeaderProps) {
  const [showMenu, setShowMenu] = useState(false)

  const handleMenuAction = (action: string) => {
    if (onMenuAction) {
      onMenuAction(action)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-white">
        {/* Top nav bar */}
        <div className="flex h-12 items-center justify-start pl-3 pr-3">
          <button aria-label="返回" className="flex h-8 w-8 shrink-0 items-center justify-center">
            <ChevronLeft className="h-6 w-6 text-neutral-800" />
          </button>
          <h1 className="ml-2.5 text-left text-base font-semibold text-neutral-900">CRJYG6289超自然行动组</h1>
          <button 
            aria-label="更多" 
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center"
            onClick={() => setShowMenu(true)}
          >
            <MoreHorizontal className="h-6 w-6 text-neutral-800" />
          </button>
        </div>

        {/* Step labels */}
        <div className="flex items-center justify-center gap-3 px-3 pb-2.5">
          {steps.map((step) => (
            <div key={step} className="flex items-center gap-1 text-green-600">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
              </span>
              <span className="text-xs font-medium">{step}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Function Menu */}
      {showMenu && (
        <FunctionMenu 
          onClose={() => setShowMenu(false)} 
          onAction={handleMenuAction}
        />
      )}
    </>
  )
}
