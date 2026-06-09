import React, { useState, useRef } from 'react';
import { Message } from '../store/chatStore';
import ReactMarkdown from 'react-markdown';
import { ActionSheet } from './ActionSheet';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  conversationTitle?: string;
  onCopy?: (content: string) => void;
  onDelete?: (messageId: string) => void;
  onRetry?: () => void;
  isError?: boolean;
  avatarColor1?: string;
  avatarColor2?: string;
  avatarImage?: string;
  userAvatarColor1?: string;
  userAvatarColor2?: string;
  userAvatarImage?: string;
  userNickname?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  conversationTitle = '',
  onCopy,
  onDelete,
  onRetry,
  isError = false,
  avatarColor1,
  avatarColor2,
  avatarImage,
  userAvatarColor1,
  userAvatarColor2,
  userAvatarImage,
  userNickname,
}) => {
  const isUser = message.role === 'user';
  const [showActions, setShowActions] = useState(false);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggered = useRef(false);

  const handleTouchStart = () => {
    longPressTriggered.current = false;
    pressTimerRef.current = setTimeout(() => {
      longPressTriggered.current = true;
      setShowActions(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handleMouseDown = () => {
    longPressTriggered.current = false;
    pressTimerRef.current = setTimeout(() => {
      longPressTriggered.current = true;
      setShowActions(true);
    }, 500);
  };

  const handleMouseUp = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handleClick = () => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }
  };

  const actions = [
    ...(onCopy
      ? [
          {
            label: '复制',
            onClick: () => onCopy(message.content),
          },
        ]
      : []),
    ...(!isUser && onRetry
      ? [
          {
            label: '重新发送',
            onClick: () => onRetry(),
          },
        ]
      : []),
    ...(onDelete
      ? [
          {
            label: '删除',
            onClick: () => onDelete(message.id),
            danger: true,
          },
        ]
      : []),
  ];

  return (
    <>
      <div
        className="message-fade-in"
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          display: 'flex',
          padding: '8px 12px',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          gap: '8px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* 头像 - 微信方形圆角风格 */}
        {isUser ? (
          userAvatarImage ? (
            <img
              src={userAvatarImage}
              alt={userNickname || '我'}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                flexShrink: 0,
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                flexShrink: 0,
                background: `linear-gradient(135deg, ${userAvatarColor1 || '#10b981'}, ${userAvatarColor2 || '#059669'})`,
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {userNickname ? userNickname.charAt(0) : '我'}
            </div>
          )
        ) : avatarImage ? (
          <img
            src={avatarImage}
            alt={conversationTitle}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '6px',
              flexShrink: 0,
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '6px',
              flexShrink: 0,
              background: isError
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : avatarColor1 && avatarColor2
                ? `linear-gradient(135deg, ${avatarColor1}, ${avatarColor2})`
                : 'linear-gradient(135deg, #4ecdc4, #44a08d)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isError ? '!' : conversationTitle.charAt(0) || 'AI'}
          </div>
        )}

        {/* 气泡区域 */}
        <div
          style={{
            display: 'flex',
            flexDirection: isUser ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            maxWidth: '70%',
            position: 'relative',
          }}
        >
          {/* 气泡尖角 */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              ...(isUser
                ? {
                    right: '-6px',
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderLeft: '7px solid #95ec69',
                  }
                : {
                    left: '-6px',
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderRight: '7px solid #ffffff',
                  }),
              width: 0,
              height: 0,
              pointerEvents: 'none',
            }}
          />

          {/* 气泡主体 */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '4px',
              fontSize: '16px',
              lineHeight: 1.5,
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              background: isUser ? '#95ec69' : '#ffffff',
              color: isError ? '#fa5151' : '#000000',
              ...(!isUser
                ? { boxShadow: '0 1px 1px rgba(0,0,0,0.04)' }
                : {}),
            }}
          >
            {isUser ? (
              <span>{message.content}</span>
            ) : (
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    if (match) {
                      return (
                        <pre
                          style={{
                            background: '#f5f5f5',
                            borderRadius: '4px',
                            margin: '6px 0',
                            padding: '6px 8px',
                            fontSize: '13px',
                            overflowX: 'auto',
                          }}
                        >
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      );
                    }
                    return (
                      <code
                        style={{
                          background: '#f0f0f0',
                          padding: '2px 4px',
                          borderRadius: '3px',
                          fontSize: '14px',
                          color: '#c7254e',
                        }}
                      >
                        {children}
                      </code>
                    );
                  },
                  p({ children }) {
                    return <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{children}</p>;
                  },
                  ul({ children }) {
                    return (
                      <ul style={{ margin: '4px 0', paddingLeft: '20px', listStyle: 'disc' }}>{children}</ul>
                    );
                  },
                  ol({ children }) {
                    return (
                      <ol style={{ margin: '4px 0', paddingLeft: '20px', listStyle: 'decimal' }}>{children}</ol>
                    );
                  },
                  li({ children }) {
                    return <li style={{ marginBottom: '2px' }}>{children}</li>;
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote
                        style={{
                          borderLeft: '2px solid #cccccc',
                          paddingLeft: '10px',
                          margin: '4px 0',
                          color: '#666666',
                          fontStyle: 'italic',
                        }}
                      >
                        {children}
                      </blockquote>
                    );
                  },
                  strong({ children }) {
                    return <strong style={{ fontWeight: 600 }}>{children}</strong>;
                  },
                  a({ href, children }) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#576b95', textDecoration: 'underline' }}>
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>

      <ActionSheet
        isVisible={showActions}
        onClose={() => setShowActions(false)}
        actions={actions}
      />
    </>
  );
};
