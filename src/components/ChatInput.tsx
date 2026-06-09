import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onClear: () => void;
  isLoading: boolean;
  onPersonaEdit?: () => void;
  onPeekPhone?: () => void;
  onMoments?: () => void;
  onRecall?: () => void;
  onGift?: () => void;
  onRedPacket?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading,
  onPersonaEdit,
  onPeekPhone,
  onMoments,
  onRecall,
  onGift,
  onRedPacket,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSend, setShowSend] = useState(false);
  const [showFunctionPanel, setShowFunctionPanel] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 100);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    setShowSend(input.trim().length > 0);
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const functionItems = [
    {
      label: '回溯',
      onClick: onRecall,
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      ),
    },
    {
      label: '礼物',
      onClick: onGift,
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 12 20 22 4 22 4 12" />
          <rect x="2" y="7" width="20" height="5" />
          <line x1="12" y1="22" x2="12" y2="7" />
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </svg>
      ),
    },
    {
      label: '红包',
      onClick: onRedPacket,
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <circle cx="12" cy="12" r="2.5" />
          <line x1="12" y1="3" x2="12" y2="6" />
          <line x1="8" y1="7" x2="8" y2="9" />
          <line x1="16" y1="7" x2="16" y2="9" />
        </svg>
      ),
    },
    {
      label: '查看朋友圈',
      onClick: onMoments,
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <path d="M2 12h4" />
          <path d="M18 12h4" />
          <path d="M12 2v4" />
          <path d="M12 18v4" />
        </svg>
      ),
    },
    {
      label: '偷看手机',
      onClick: onPeekPhone,
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="12" y1="18" x2="12" y2="18.01" />
          <path d="M12 5a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4z" />
        </svg>
      ),
    },
    {
      label: '自定义性格',
      onClick: onPersonaEdit,
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
          <line x1="19" y1="4" x2="19" y2="10" />
          <line x1="22" y1="7" x2="16" y2="7" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        background: '#f7f7f7',
        borderTop: '1px solid #e5e5e5',
        flexShrink: 0,
        minHeight: '56px',
      }}
    >
      {/* 工具栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 8px',
          gap: '4px',
          minHeight: '56px',
        }}
      >
        {/* 语音按钮 */}
        <button
          onClick={() => setShowFunctionPanel(false)}
          style={{
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: 'transparent',
            border: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>

        {/* 输入框 */}
        <div
          style={{
            flex: 1,
            background: '#ffffff',
            borderRadius: '6px',
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            minHeight: '44px',
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowFunctionPanel(false)}
            placeholder=""
            disabled={isLoading}
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '16px',
              lineHeight: 1.5,
              padding: '10px 0',
              color: '#000000',
              minHeight: '24px',
              maxHeight: '100px',
              WebkitAppearance: 'none',
            }}
          />
        </div>

        {/* 表情按钮 */}
        <button
          onClick={() => setShowFunctionPanel(false)}
          style={{
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: 'transparent',
            border: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9.5" />
            <circle cx="9" cy="10" r="1.4" fill="#000000" stroke="none" />
            <circle cx="15" cy="10" r="1.4" fill="#000000" stroke="none" />
            <path d="M8.5 14.5c1 1.5 2.2 2 3.5 2s2.5-.5 3.5-2" />
          </svg>
        </button>

        {/* 发送或加号按钮 */}
        {showSend ? (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              height: '44px',
              padding: '0 14px',
              borderRadius: '6px',
              background: '#07C160',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 500,
              flexShrink: 0,
              border: 'none',
              cursor: 'pointer',
              WebkitAppearance: 'none',
            }}
          >
            发送
          </button>
        ) : (
          <button
            onClick={() => setShowFunctionPanel(!showFunctionPanel)}
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              background: 'transparent',
              border: 'none',
              WebkitAppearance: 'none',
              cursor: 'pointer',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="9.5" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
        )}
      </div>

      {/* 功能面板 */}
      {showFunctionPanel && (
        <div
          style={{
            background: '#f7f7f7',
            padding: '14px 8px 22px 8px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '18px 0',
          }}
        >
          {functionItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setShowFunctionPanel(false);
                if (item.onClick) {
                  item.onClick();
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </div>
              <span style={{ fontSize: '13px', color: '#5a5a5a' }}>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
