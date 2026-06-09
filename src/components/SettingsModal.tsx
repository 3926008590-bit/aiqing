import React, { useState, useEffect } from 'react';
import { X, Key, Check } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey } = useChatStore();
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setInputKey(apiKey);
    setSaved(false);
  }, [apiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(inputKey.trim());
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 弹窗 - 微信风格浅色 */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl border border-[#e5e5e5]">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e5e5e5]">
          <div className="flex items-center gap-2">
            <Key size={18} className="text-[#07C160]" />
            <h2 className="font-medium text-base text-[#191919]">API 密钥设置</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#f5f5f5] text-[#888888] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-5">
          <label className="block text-sm text-[#191919] mb-2">
            DeepSeek API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="请输入你的 DeepSeek API Key"
              className="w-full px-3 py-2.5 bg-[#f7f7f7] border border-[#e5e5e5] rounded text-[15px] text-[#191919] placeholder-[#b2b2b2] focus:outline-none focus:border-[#cccccc] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#576b95] text-xs px-2 py-1 rounded"
            >
              {showKey ? '隐藏' : '显示'}
            </button>
          </div>
          <p className="mt-2 text-xs text-[#888888] leading-relaxed">
            前往 DeepSeek 平台获取 API 密钥，使用此对话将消耗 API 额度。
          </p>
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-[#e5e5e5]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded text-sm text-[#191919] hover:bg-[#f5f5f5] transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!inputKey.trim()}
            className={`px-5 py-2 rounded text-sm font-medium transition-colors flex items-center gap-1.5 ${
              inputKey.trim()
                ? saved
                  ? 'bg-[#07C160] text-white'
                  : 'bg-[#07C160] text-white hover:bg-[#06ad56]'
                : 'bg-[#e5e5e5] text-[#b2b2b2] cursor-not-allowed'
            }`}
          >
            {saved && <Check size={16} />}
            {saved ? '已保存' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
};
