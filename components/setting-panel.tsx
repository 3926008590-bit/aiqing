"use client"

import { useState, useRef } from "react"
import { X, RotateCcw, Upload } from "lucide-react"
import { useChatConfig, type ChatConfig } from "./chat-config"

interface SettingPanelProps {
  onClose: () => void
}

export function SettingPanel({ onClose }: SettingPanelProps) {
  const { config, updateConfig, resetConfig } = useChatConfig()
  const [formData, setFormData] = useState<ChatConfig>(config)
  const [activeTab, setActiveTab] = useState<"basic" | "product" | "seller" | "user">("basic")
  const productImageRef = useRef<HTMLInputElement>(null)
  const userAvatarRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    updateConfig(formData)
    onClose()
  }

  const handleReset = () => {
    if (confirm("确定要重置所有设置吗？")) {
      resetConfig()
      setFormData({
        customerServiceName: "螃蟹交付专员-绝缘",
        orderNumber: "ZH87654321987654321123",
        productImage: "/game-skin.png",
        productId: "CRJYG6289",
        productName: "金皮1...",
        productDescription: "游戏商品描述",
        sellerName: "绝缘pxzc",
        originalPrice: "¥120",
        finalPrice: "¥90",
        userName: "用户_***616",
        userAvatar: "",
      })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, field: "productImage" | "userAvatar") => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setFormData({ ...formData, [field]: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const tabs = [
    { key: "basic", label: "基础设置" },
    { key: "product", label: "商品信息" },
    { key: "seller", label: "卖家信息" },
    { key: "user", label: "我的信息" },
  ]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-x-0 bottom-0 z-[60] max-h-[85vh] overflow-hidden rounded-t-2xl bg-white">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-neutral-100 bg-white">
          <div className="flex h-14 items-center justify-between px-4">
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center">
              <X className="h-5 w-5 text-neutral-500" />
            </button>
            <h2 className="text-base font-semibold text-neutral-900">DIY设置</h2>
            <button onClick={handleReset} className="flex h-8 w-8 items-center justify-center">
              <RotateCcw className="h-4 w-4 text-neutral-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-4 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-orange-500 text-white"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(85vh-120px)] overflow-y-auto p-4">
          {/* 基础设置 */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <FormField label="客服名称">
                <input
                  type="text"
                  value={formData.customerServiceName}
                  onChange={(e) => setFormData({ ...formData, customerServiceName: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="例如：螃蟹交付专员-绝缘"
                />
              </FormField>

              <FormField label="订单编号">
                <input
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="例如：ZH123456789"
                />
              </FormField>

              <FormField label="商品编号">
                <input
                  type="text"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="例如：CRJYG6289"
                />
              </FormField>
            </div>
          )}

          {/* 商品信息 */}
          {activeTab === "product" && (
            <div className="space-y-4">
              <FormField label="商品图">
                <div className="flex flex-col gap-3">
                  {formData.productImage && (
                    <img
                      src={formData.productImage}
                      alt="商品预览"
                      className="h-32 w-full rounded-lg object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => productImageRef.current?.click()}
                    className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-600 hover:border-orange-500 hover:text-orange-500"
                  >
                    <Upload className="h-4 w-4" />
                    从相册选择图片
                  </button>
                  <input
                    ref={productImageRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleFileSelect(e, "productImage")}
                  />
                </div>
              </FormField>

              <FormField label="商品名称">
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="例如：金皮1..."
                />
              </FormField>

              <FormField label="商品介绍">
                <textarea
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  rows={3}
                  placeholder="商品描述..."
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="原价">
                  <input
                    type="text"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                    placeholder="¥120"
                  />
                </FormField>

                <FormField label="预估到手">
                  <input
                    type="text"
                    value={formData.finalPrice}
                    onChange={(e) => setFormData({ ...formData, finalPrice: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                    placeholder="¥90"
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* 卖家信息 */}
          {activeTab === "seller" && (
            <div className="space-y-4">
              <FormField label="卖家名称">
                <input
                  type="text"
                  value={formData.sellerName}
                  onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="例如：绝缘pxzc"
                />
              </FormField>
            </div>
          )}

          {/* 我的信息 */}
          {activeTab === "user" && (
            <div className="space-y-4">
              <FormField label="我的头像">
                <div className="flex flex-col gap-3">
                  {formData.userAvatar && (
                    <img
                      src={formData.userAvatar}
                      alt="我的头像"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => userAvatarRef.current?.click()}
                    className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-600 hover:border-orange-500 hover:text-orange-500"
                  >
                    <Upload className="h-4 w-4" />
                    从相册选择头像
                  </button>
                  <input
                    ref={userAvatarRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleFileSelect(e, "userAvatar")}
                  />
                </div>
              </FormField>

              <FormField label="我的昵称">
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="例如：用户_***616"
                />
              </FormField>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-neutral-100 bg-white p-4">
          <button
            onClick={handleSave}
            className="w-full rounded-full bg-orange-500 py-3 text-base font-medium text-white active:bg-orange-600"
          >
            保存设置
          </button>
        </div>
      </div>
    </>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</label>
      {children}
    </div>
  )
}
