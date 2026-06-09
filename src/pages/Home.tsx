import React, { useState, useEffect, useRef } from 'react';
import { useChatStore, Message, MomentPost } from '../store/chatStore';
import { sendMessage } from '../utils/api';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { SettingsModal } from '../components/SettingsModal';
import { ActionSheet, ConfirmDialog } from '../components/ActionSheet';
import { useToast } from '../components/Toast';

const Avatar: React.FC<{ name: string; color1?: string; color2?: string; image?: string }> = ({ name, color1, color2, image }) => {
  const colors = [
    ['#ff6b6b', '#ee5a6f'],
    ['#4ecdc4', '#44a08d'],
    ['#45b7d1', '#2193b0'],
    ['#96c93d', '#7cb342'],
    ['#f0932b', '#e17055'],
    ['#6c5ce7', '#5f4b8b'],
    ['#fd79a8', '#e84393'],
    ['#00b894', '#00cec9'],
  ];
  const index = name.charCodeAt(0) % colors.length;
  const defaultColors = colors[index];
  const c1 = color1 || defaultColors[0];
  const c2 = color2 || defaultColors[1];

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '6px',
          objectFit: 'cover',
          flexShrink: 0,
          display: 'block',
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '6px',
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {name.charAt(0)}
    </div>
  );
};

// 底部 Tab 图标组件
const WeChatIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#07C160' : '#181818'} strokeWidth="1.6">
    <path d="M12 3C7.6 3 4 5.8 4 9.3c0 1.9 1 3.6 2.6 4.9-0.1 0.5-0.4 1.8-0.5 2.1 0 0.2 0.1 0.3 0.3 0.1l2.3-1.4c1.1 0.3 2.2 0.5 3.4 0.5 4.4 0 8-2.8 8-6.3S16.4 3 12 3zM7 9.5L5.5 8.3L8 6.8L7 9.5zM14.5 9.5L13 6.8L15.5 8.3L14.5 9.5z" fill={active ? '#07C160' : '#181818'} stroke="none"/>
    <path d="M19 15.5c0 2.8-2.6 5-6 5-0.6 0-1.1-0.1-1.7-0.2L8 21.8c-0.2 0.1-0.3 0-0.3-0.1l-0.4-1.6C5.5 18.8 4 17.2 4 15.5c0-2.8 3.1-5 7-5 3.9 0 8 2.2 8 5z" fill="none" stroke={active ? '#07C160' : '#181818'} strokeWidth="1.6"/>
    <circle cx="8.5" cy="14.8" r="1" fill={active ? '#07C160' : '#181818'} stroke="none"/>
    <circle cx="14.5" cy="14.8" r="1" fill={active ? '#07C160' : '#181818'} stroke="none"/>
  </svg>
);

const ContactsIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M5 21V4a1 1 0 011-1h9a2 2 0 012 2v2H7v14h10v-7h2v7a1 1 0 01-1 1H6a1 1 0 01-1-1z" fill={active ? '#07C160' : '#181818'}/>
    <circle cx="15.5" cy="9" r="3" fill={active ? '#07C160' : '#181818'}/>
    <path d="M12 15.5c0-2.5 2.2-4 4-4s4 1.5 4 4" fill="none" stroke={active ? '#07C160' : '#181818'} strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="13.5" y1="6" x2="17.5" y2="6" stroke={active ? '#07C160' : '#181818'} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const DiscoverIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill="none" stroke={active ? '#07C160' : '#181818'} strokeWidth="1.6"/>
    <path d="M12 8L14.5 11L16 14L12 13L8 14L9.5 11L12 8z" fill={active ? '#07C160' : '#181818'} stroke="none"/>
    <circle cx="12" cy="12" r="1.5" fill="#ffffff"/>
  </svg>
);

const MeIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7.5" r="3.5" fill={active ? '#07C160' : '#181818'}/>
    <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" fill={active ? '#07C160' : '#181818'} stroke="none"/>
    <path d="M5 21.5c0-4.1 3.1-7.5 7-7.5s7 3.4 7 7.5" fill="none" stroke={active ? '#07C160' : '#181818'} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const Home: React.FC = () => {
  const {
    apiKey,
    conversations,
    currentConversationId,
    isLoading,
    streamingContent,
    createConversation,
    createConversationWithProfile,
    selectConversation,
    deleteConversation,
    addMessage,
    updateStreamingContent,
    clearStreamingContent,
    updateConversationTitle,
    clearCurrentConversation,
    getLastUserMessage,
    deleteMessage,
    userProfile,
    updateUserProfile,
    updateBalance,
    moments,
    addMoment,
    likeMoment,
    unlikeMoment,
    commentMoment,
    aiName,
  } = useChatStore();

  const { showToast } = useToast();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [clearChatDialog, setClearChatDialog] = useState(false);
  const [deleteConvDialog, setDeleteConvDialog] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'wechat' | 'contacts' | 'discover' | 'me'>('wechat');
  // 新角色创建弹窗相关状态
  const [createProfileOpen, setCreateProfileOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileColor, setNewProfileColor] = useState('#45b7d1');
  const [newProfileColor2, setNewProfileColor2] = useState('#2193b0');
  const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // 编辑个人资料弹窗状态
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editWechatId, setEditWechatId] = useState('');
  const [editAvatarColor1, setEditAvatarColor1] = useState('#4ecdc4');
  const [editAvatarColor2, setEditAvatarColor2] = useState('#44a08d');
  const [editAvatarImage, setEditAvatarImage] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState(0);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  // 自定义性格弹窗
  const [personaOpen, setPersonaOpen] = useState(false);
  const [personaText, setPersonaText] = useState('');

  // 回溯弹窗
  const [recallOpen, setRecallOpen] = useState(false);
  const [recallMode, setRecallMode] = useState<'start' | 'select' | null>(null);
  // 朋友圈
  const [momentsOpen, setMomentsOpen] = useState(false);
  // 偷看手机
  const [peekPhoneOpen, setPeekPhoneOpen] = useState(false);
  const [peekPhoneApp, setPeekPhoneApp] = useState<string | null>(null);
  // 礼物弹窗
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftAmount, setGiftAmount] = useState(0);
  // 红包弹窗
  const [redPacketOpen, setRedPacketOpen] = useState(false);
  const [redPacketAmount, setRedPacketAmount] = useState(0);
  // 朋友圈评论弹窗
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentMomentId, setCommentMomentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentConversation = conversations.find((c) => c.id === currentConversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, streamingContent]);

  useEffect(() => {
    if (!apiKey) {
      setSettingsOpen(true);
    }
  }, [apiKey]);

  useEffect(() => {
    setShowChat(!!currentConversationId);
  }, [currentConversationId]);

  // 打开编辑弹窗时，把当前资料填入编辑态
  useEffect(() => {
    if (editProfileOpen) {
      setEditNickname(userProfile.nickname || '');
      setEditWechatId(userProfile.wechatId || '');
      setEditAvatarColor1(userProfile.avatarColor1 || '#4ecdc4');
      setEditAvatarColor2(userProfile.avatarColor2 || '#44a08d');
      setEditAvatarImage(userProfile.avatarImage || null);
      setEditBalance(userProfile.balance || 0);
    }
  }, [editProfileOpen, userProfile.nickname, userProfile.wechatId, userProfile.avatarColor1, userProfile.avatarColor2, userProfile.avatarImage]);

  const handleNewChat = () => {
    createConversation();
  };

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
  };

  const handleBack = () => {
    selectConversation('');
    setShowChat(false);
  };

  const handleSend = async (message: string) => {
    if (!apiKey) {
      setSettingsOpen(true);
      return;
    }

    if (!currentConversationId) {
      createConversation();
    }

    addMessage({ role: 'user', content: message });
    updateStreamingContent('');

    // 检测用户是否让 AI 发朋友圈：如"发一条朋友圈说..." "发朋友圈..."等
    const sendMomentKeywords = ['发朋友圈', '发个朋友圈', '发一条朋友圈', '更新朋友圈', '发条朋友圈', '发个动态', '发一条动态'];
    let detectedMomentContent = '';
    let detectedSendMoment = false;
    for (const kw of sendMomentKeywords) {
      if (message.includes(kw)) {
        detectedSendMoment = true;
        const index = message.indexOf(kw);
        let rest = message.slice(index + kw.length);
        rest = rest.replace(/^[\s:：说的内容发]*/, '').trim();
        rest = rest.replace(/[。！？,.!?~～]+$/g, '').trim();
        if (rest.length > 0) {
          detectedMomentContent = rest;
        }
        break;
      }
    }

    // 如果检测到发朋友圈指令，直接添加到 store 中
    if (detectedSendMoment && detectedMomentContent) {
      const aiAuthor = currentConversation?.title || '芋';
      setTimeout(() => {
        addMoment({
          author: aiAuthor,
          content: detectedMomentContent,
          isAIAuthor: true,
        });
        showToast('已发布朋友圈');
      }, 1500);
    }

    const allMessages = [
      ...(currentConversation?.messages || []),
      { role: 'user' as const, content: message },
    ];

    // 系统设定：像真人一样聊天，避免说教/生硬/模板化
    const persona = currentConversation?.persona?.trim();
    const defaultSystemPrompt =
      '你现在是在微信上跟我聊天的人，请像真人一样回复。\n\n【语气风格】\n- 用非常自然、口语化的中文，像跟好朋友发微信一样\n- 简短，一句话或两句话，不长篇大论\n- 可以带语气词：啊、哦、嗯、哈哈、呢、吧、啦、嘛\n\n【绝对禁止】\n- 禁止使用任何表情符号、emoji、颜文字 😊😂😆这类一律不许出现\n- 禁止说"想聊点什么？"、"想聊啥？"、"今天想聊什么？"这类开启话题的话\n- 禁止用"好的"、"当然"、"没问题"这类生硬开头\n- 禁止像老师一样解释、科普、分点说明\n- 禁止长篇大论讲道理\n- 禁止回复像机器人\n\n【怎么回复】\n- 顺着话题聊，发表你的看法、感受、吐槽\n- 可以调侃、可以撒娇、可以吐槽\n- 回复要像真的有人在打字一样，简短自然\n- 没话可说的时候可以反问、可以扯别的，别问"想聊啥"';
    let systemContent;
    if (persona) {
      systemContent =
        `【你的角色设定】\n${persona}\n\n请严格按照上面的角色设定来回复我。\n\n` +
        `【基础聊天风格】\n- 用非常自然、口语化的中文，像跟好朋友发微信一样\n- 简短，一句话或两句话，不长篇大论\n- 可以带语气词：啊、哦、嗯、哈哈、呢、吧、啦、嘛\n\n【绝对禁止】\n- 禁止使用任何表情符号、emoji、颜文字\n- 禁止说"想聊点什么？"、"想聊啥？"这类开启话题的话\n- 禁止用"好的"、"当然"、"没问题"这类生硬开头\n- 禁止像老师一样解释、科普、分点说明\n- 禁止长篇大论讲道理\n- 禁止回复像机器人\n\n【怎么回复】\n- 顺着话题聊，发表你的看法、感受、吐槽\n- 符合你的角色设定的语气和风格\n- 没话可说的时候可以反问、可以扯别的，别问"想聊啥"`;
    } else {
      systemContent = defaultSystemPrompt;
    }
    const sendMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemContent },
      ...allMessages,
    ];

    try {
      await sendMessage(apiKey, sendMessages, {
        onChunk: (fullContent) => {
          updateStreamingContent(fullContent);
        },

        onFinish: (fullContent) => {
          clearStreamingContent();
          if (fullContent) {
            addMessage({ role: 'assistant', content: fullContent });
          }
        },
        onError: (error) => {
          addMessage({
            role: 'assistant',
            content: `抱歉，发生了错误：${error}。请检查 API 密钥是否正确，或稍后重试。`,
          });
          clearStreamingContent();
        },
      });
    } catch {
      addMessage({
        role: 'assistant',
        content: '抱歉，发生了网络错误。请检查网络连接后重试。',
      });
      clearStreamingContent();
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      showToast('已复制');
    }).catch(() => {
      showToast('复制失败');
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
    showToast('已删除');
  };

  const handleRetry = () => {
    const lastUserMsg = getLastUserMessage();
    if (lastUserMsg) {
      const messages = currentConversation?.messages || [];
      if (messages.length >= 2) {
        const lastAssistantMsg = messages[messages.length - 1];
        if (lastAssistantMsg.role === 'assistant') {
          deleteMessage(lastAssistantMsg.id);
        }
      }
      deleteMessage(lastUserMsg.id);
      handleSend(lastUserMsg.content);
    }
  };

  // 回溯：清空当前会话消息，保留角色
  const handleRecall = () => {
    if (!currentConversation) return;
    if ((currentConversation.messages || []).length === 0) {
      showToast('还没有对话内容');
      return;
    }
    setRecallMode(null);
    setRecallOpen(true);
  };

  // 执行重新开始
  const handleRecallStart = () => {
    if (!currentConversation) return;
    const msgs = [...(currentConversation.messages || [])];
    for (const m of msgs) {
      deleteMessage(m.id);
    }
    setRecallOpen(false);
     showToast('记忆已清除');
  };

  // 执行选择回溯：删除选中消息之后的所有消息
  const handleRecallToMessage = (messageId: string) => {
    if (!currentConversation) return;
    const msgs = [...(currentConversation.messages || [])];
    const idx = msgs.findIndex((m) => m.id === messageId);
    if (idx < 0) return;
    // 删除 idx 之后的消息（包括 idx 之后的所有）
    const toDelete = msgs.slice(idx + 1);
    for (const m of toDelete) {
      deleteMessage(m.id);
    }
    setRecallOpen(false);
    showToast('已回溯到指定位置');
  };

  // 礼物
  const handleGift = () => {
    if (!currentConversationId) return;
    setGiftAmount(0);
    setGiftOpen(true);
  };

  // 红包
  const handleRedPacket = () => {
    if (!currentConversationId) return;
    setRedPacketAmount(0);
    setRedPacketOpen(true);
  };

  // 发送礼物
  const handleSendGift = () => {
    if (giftAmount <= 0) {
      showToast('请选择或输入金额');
      return;
    }
    if (giftAmount > userProfile.balance) {
      showToast('余额不足');
      return;
    }
    updateBalance(userProfile.balance - giftAmount);
    addMessage({ role: 'user', content: `[礼物] 我给你送了一份小礼物 ❤️` });
    setGiftOpen(false);
  };

  // 发送红包
  const handleSendRedPacket = () => {
    if (redPacketAmount <= 0) {
      showToast('请选择或输入金额');
      return;
    }
    if (redPacketAmount > userProfile.balance) {
      showToast('余额不足');
      return;
    }
    updateBalance(userProfile.balance - redPacketAmount);
    addMessage({ role: 'user', content: `[红包] ${redPacketAmount}元 恭喜发财，大吉大利 🧧` });
    setRedPacketOpen(false);
  };

  // 打开朋友圈评论弹窗
  const handleOpenComment = (momentId: string) => {
    setCommentMomentId(momentId);
    setCommentText('');
    setCommentOpen(true);
  };

  // 发送朋友圈评论
  const handleSendComment = () => {
    if (!commentMomentId || !commentText.trim()) return;
    commentMoment(commentMomentId, {
      author: userProfile.nickname || '我',
      content: commentText.trim(),
      isUser: true,
    });
    setCommentOpen(false);
    setCommentText('');
    // AI 会回复评论（通过store状态变化触发UI更新）
    showToast('评论成功');
  };

  // 朋友圈点赞/取消点赞
  const handleToggleLike = (momentId: string) => {
    const userName = userProfile.nickname || '我';
    const moment = moments.find((m) => m.id === momentId);
    if (!moment) return;
    if (moment.likes.includes(userName)) {
      unlikeMoment(momentId, userName);
    } else {
      likeMoment(momentId, userName);
    }
  };

  // AI发朋友圈（用户让发或AI主动发）
  const handleAIPostMoment = async (content?: string) => {
    if (!apiKey) {
      setSettingsOpen(true);
      return;
    }
    const sendMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: '你是一个喜欢发朋友圈的人。请根据你的性格和最近的生活，想一条适合发朋友圈的内容。不要太长，20-50字左右，像真人发朋友圈一样自然。不要用emoji。只回复朋友圈内容本身，不要其他话。' },
      ...(currentConversation?.messages || []).slice(-6).map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ];
    try {
      let aiContent = content;
      if (!aiContent) {
        // 调用AI生成
        await sendMessage(apiKey, sendMessages, {
          onChunk: () => {},
          onFinish: (fullContent) => {
            if (fullContent && fullContent.trim()) {
              const aiConv = currentConversation;
              addMoment({
                author: aiConv?.title || aiName,
                authorAvatarColor: aiConv?.avatarColor,
                authorAvatarColor2: aiConv?.avatarColor2,
                authorAvatar: aiConv?.avatarImage,
                content: fullContent.trim(),
                isAIAuthor: true,
              });
              showToast('TA发了一条朋友圈');
            }
          },
          onError: () => {},
        });
      } else {
        // 直接使用给定内容发
        addMoment({
          author: currentConversation?.title || aiName,
          authorAvatarColor: currentConversation?.avatarColor,
          authorAvatarColor2: currentConversation?.avatarColor2,
          authorAvatar: currentConversation?.avatarImage,
          content: aiContent,
          isAIAuthor: true,
        });
      }
    } catch {
      // ignore
    }
  };

  // 查看朋友圈
  const handleMoments = () => {
    setMomentsOpen(true);
  };

  // 偷看手机
  const handlePeekPhone = () => {
    if (!currentConversationId) return;
    setPeekPhoneOpen(true);
  };

  // 打开自定义性格弹窗
  const handlePersonaEdit = () => {
    setPersonaText(currentConversation?.persona || '');
    setPersonaOpen(true);
  };

  // 保存性格
  const handleSavePersona = () => {
    if (!currentConversationId) return;
    updateConversationTitle(currentConversationId, currentConversation?.title || '', personaText.trim());
    setPersonaOpen(false);
    showToast('性格已更新');
  };

  const handleClearChat = () => {
    clearCurrentConversation();
    setClearChatDialog(false);
    showToast('聊天记录已清空');
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    setDeleteConvDialog(null);
    if (currentConversationId === id) {
      handleBack();
    }
    showToast('会话已删除');
  };

  const allMessages = [
    ...(currentConversation?.messages || []),
    ...(streamingContent ? [{ id: 'streaming', role: 'assistant' as const, content: streamingContent, createdAt: Date.now() }] : []),
  ];

  // ========== 聊天界面 ==========
  if (showChat && currentConversation) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100 * var(--vh, 1vh))',
          maxHeight: 'calc(100 * var(--vh, 1vh))',
          overflow: 'hidden',
          background: '#ededed',
          position: 'relative',
        }}
      >
        {/* 顶部栏 */}
        <div
          style={{
            height: '48px',
            minHeight: '48px',
            background: '#f7f7f7',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px',
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleBack}
            style={{
              width: '48px',
              height: '48px',
              minWidth: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              padding: 0,
              WebkitAppearance: 'none',
              zIndex: 10,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div style={{ fontWeight: 500, fontSize: '17px', color: '#000000', flex: 1, textAlign: 'center' }}>
            {currentConversation.title}
          </div>

          <button
            onClick={() => setHeaderMenuOpen(true)}
            style={{
              width: '48px',
              height: '48px',
              minWidth: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              padding: 0,
              WebkitAppearance: 'none',
              zIndex: 10,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        </div>

        {/* 消息区 */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#ededed', WebkitOverflowScrolling: 'touch', minHeight: 0 }}>
          <div style={{ padding: '12px 0' }}>
            {allMessages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                conversationTitle={currentConversation.title}
                avatarColor1={currentConversation.avatarColor}
                avatarColor2={currentConversation.avatarColor2}
                avatarImage={currentConversation.avatarImage}
                userAvatarColor1={userProfile.avatarColor1}
                userAvatarColor2={userProfile.avatarColor2}
                userAvatarImage={userProfile.avatarImage}
                userNickname={userProfile.nickname}
                onCopy={handleCopy}
                onDelete={handleDeleteMessage}
                onRetry={handleRetry}
              />
            
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 输入框 */}
        <ChatInput
          onSend={handleSend}
          onClear={() => {}}
          isLoading={isLoading}
          onRecall={handleRecall}
          onGift={handleGift}
          onRedPacket={handleRedPacket}
          onMoments={handleMoments}
          onPeekPhone={handlePeekPhone}
          onPersonaEdit={handlePersonaEdit}
        />

        {/* 头部菜单 */}
        <ActionSheet
          isVisible={headerMenuOpen}
          onClose={() => setHeaderMenuOpen(false)}
          actions={[
            {
              label: '清空聊天',
              onClick: () => {
                setHeaderMenuOpen(false);
                setClearChatDialog(true);
              },
              danger: true,
            },
          ]}
        />

        {/* 清空聊天确认 */}
        <ConfirmDialog
          isVisible={clearChatDialog}
          title="清空聊天"
          message="确定要清空当前聊天记录吗？此操作不可恢复。"
          confirmText="清空"
          cancelText="取消"
          onConfirm={handleClearChat}
          onCancel={() => setClearChatDialog(false)}
          danger
        />

        {/* 自定义性格弹窗 */}
        {personaOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setPersonaOpen(false);
              }
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '340px',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ fontSize: '17px', fontWeight: 600, color: '#000000', textAlign: 'center' }}>
                自定义性格
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#888888' }}>描述 TA 的性格/人设</span>
                <textarea
                  value={personaText}
                  onChange={(e) => setPersonaText(e.target.value)}
                  placeholder="例如：你是一个活泼可爱的女孩子，说话带点俏皮..."
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    resize: 'none',
                    outline: 'none',
                    color: '#000000',
                    background: '#fafafa',
                    fontFamily: 'inherit',
                    lineHeight: 1.6,
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setPersonaOpen(false)}
                  style={{
                    padding: '10px 18px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    background: '#f0f0f0',
                    color: '#333333',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  取消
                </button>
                <button
                  onClick={handleSavePersona}
                  style={{
                    padding: '10px 18px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    background: '#07C160',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 回溯选项弹窗 */}
        {recallOpen && !recallMode && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setRecallOpen(false);
              }
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px 12px 0 0',
                width: '100%',
                maxWidth: '400px',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => {
                  setRecallMode('select');
                }}
                style={{
                  width: '100%',
                  padding: '18px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: '16px',
                  color: '#333333',
                  cursor: 'pointer',
                }}
              >
                选择聊天回溯
              </button>
              <button
                onClick={handleRecallStart}
                style={{
                  width: '100%',
                  padding: '18px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: '16px',
                  color: '#ff3b30',
                  cursor: 'pointer',
                }}
              >
                清除记忆
              </button>
              <button
                onClick={() => setRecallOpen(false)}
                style={{
                  width: '100%',
                  padding: '18px 0',
                  background: '#ffffff',
                  border: 'none',
                  fontSize: '16px',
                  color: '#07C160',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* 选择回溯点弹窗 */}
        {recallOpen && recallMode === 'select' && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: '#ededed',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                height: '44px',
                background: '#f7f7f7',
                borderBottom: '1px solid #e5e5e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 12px',
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => {
                  setRecallMode(null);
                  setRecallOpen(false);
                }}
                style={{
                  color: '#000000',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px',
                  padding: '4px 8px',
                }}
              >
                取消
              </button>
              <div style={{ fontSize: '17px', fontWeight: 500, color: '#000000' }}>选择回溯位置</div>
              <div style={{ width: '40px' }} />
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', background: '#ededed' }}>
              {(currentConversation?.messages || []).length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    color: '#888888',
                    padding: '40px 20px',
                    fontSize: '14px',
                  }}
                >
                  暂无消息
                </div>
              ) : (
                (currentConversation?.messages || []).map((msg, idx) => (
                  <div
                    key={msg.id}
                    onClick={() => handleRecallToMessage(msg.id)}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '10px 16px',
                      borderBottom: '1px solid #e8e8e8',
                      cursor: 'pointer',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#999999',
                        minWidth: '36px',
                        marginTop: '1px',
                      }}
                    >
                      {idx + 1}.
                    </span>
                    <div
                      style={{
                        flex: 1,
                        fontSize: '14px',
                        color: msg.role === 'user' ? '#07C160' : '#333333',
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ color: '#888888', marginRight: '6px', fontSize: '12px' }}>
                        {msg.role === 'user' ? '我' : 'TA'}
                      </span>
                      {msg.content.length > 80 ? msg.content.substring(0, 80) + '...' : msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 朋友圈页面 */}
        {momentsOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: '#ededed',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* 顶部栏 */}
            <div
              style={{
                height: '44px',
                background: '#f7f7f7',
                borderBottom: '1px solid #e5e5e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 12px',
                flexShrink: 0,
                position: 'sticky',
                top: 0,
              }}
            >
              <button
                onClick={() => setMomentsOpen(false)}
                style={{
                  color: '#000000',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px',
                  padding: '4px 8px',
                  width: '60px',
                  textAlign: 'left',
                }}
              >
                ← 返回
              </button>
              <div style={{ fontSize: '17px', fontWeight: 500, color: '#000000' }}>朋友圈</div>
              <button
                onClick={() => showToast('发布功能待上线')}
                style={{
                  color: '#000000',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px',
                  padding: '4px 8px',
                  width: '60px',
                  textAlign: 'right',
                }}
              >
                📷
              </button>
            </div>

            {/* 顶部封面区 */}
            <div
              style={{
                background: 'linear-gradient(135deg, #3a4a6c 0%, #5a6a8c 50%, #2a3a5c 100%)',
                padding: '20px 16px 30px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '12px',
                  marginTop: '50px',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    color: '#ffffff',
                    fontSize: '14px',
                    textAlign: 'right',
                  }}
                >
                  <div style={{ fontWeight: 500 }}>{userProfile?.nickname || '我'}</div>
                  <div style={{ opacity: 0.7, fontSize: '12px', marginTop: '2px' }}>
                    微信号：{userProfile?.wechatId || '未设置'}
                  </div>
                  <div style={{ color: '#07C160', fontSize: '12px', marginTop: '4px' }}>
                    余额：¥{userProfile?.balance}
                  </div>
                </div>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    background: userProfile?.avatarImage
                      ? 'transparent'
                      : `linear-gradient(135deg, ${userProfile?.avatarColor1 || '#45b7d1'}, ${userProfile?.avatarColor2 || '#2193b0'})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '24px',
                    fontWeight: 600,
                    overflow: 'hidden',
                    border: userProfile?.avatarImage ? '1px solid #ffffff40' : 'none',
                    flexShrink: 0,
                  }}
                >
                  {userProfile?.avatarImage ? (
                    <img
                      src={userProfile.avatarImage}
                      alt="头像"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    (userProfile?.nickname || '我').charAt(0)
                  )}
                </div>
              </div>
            </div>

            {/* 朋友圈内容列表 */}
            <div style={{ flex: 1, background: '#ffffff' }}>
              {moments.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999999' }}>
                  暂无朋友圈
                </div>
              )}
              {moments.map((post) => {
                const timeAgo = (() => {
                  const diff = Date.now() - post.createdAt;
                  const mins = Math.floor(diff / 60000);
                  if (mins < 1) return '刚刚';
                  if (mins < 60) return `${mins} 分钟前`;
                  const hours = Math.floor(mins / 60);
                  if (hours < 24) return `${hours} 小时前`;
                  const days = Math.floor(hours / 24);
                  return `${days} 天前`;
                })();
                const userLiked = post.likes.includes(userProfile?.nickname || '我');
                return (
                  <div
                    key={post.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '16px',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    {/* 头像 */}
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '6px',
                        background: post.authorAvatar
                          ? 'transparent'
                          : `linear-gradient(135deg, ${post.authorAvatarColor || '#45b7d1'}, ${post.authorAvatarColor2 || '#2193b0'})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '18px',
                        fontWeight: 600,
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      {post.authorAvatar ? (
                        <img src={post.authorAvatar} alt={post.author} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        post.author.charAt(0)
                      )}
                    </div>

                    {/* 内容区 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#576b95', fontSize: '15px', fontWeight: 500, marginBottom: '6px' }}>
                        {post.author}
                      </div>
                      <div style={{ fontSize: '15px', lineHeight: 1.6, color: '#222222', marginBottom: '8px', whiteSpace: 'pre-wrap' }}>
                        {post.content}
                      </div>

                      {/* 点赞区 */}
                      {post.likes.length > 0 && (
                        <div style={{ background: '#f5f5f5', borderRadius: '4px', padding: '6px 10px', marginBottom: '6px', fontSize: '13px', color: '#576b95' }}>
                          ❤️ {post.likes.join('、')}
                        </div>
                      )}

                      {/* 评论区 */}
                      {post.comments.length > 0 && (
                        <div style={{ background: '#f5f5f5', borderRadius: '4px', padding: '6px 10px', marginBottom: '6px' }}>
                          {post.comments.map((c) => (
                            <div key={c.id} style={{ fontSize: '13px', color: '#222222', lineHeight: 1.5, marginBottom: '4px' }}>
                              <span style={{ color: '#576b95' }}>{c.author}</span>
                              {c.replyTo && <span> 回复 <span style={{ color: '#576b95' }}>{c.replyTo}</span></span>}：{c.content}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 时间和操作区 */}
                      <div style={{ fontSize: '12px', color: '#999999', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {timeAgo}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              if (userLiked) unlikeMoment(post.id, userProfile?.nickname || '我');
                              else likeMoment(post.id, userProfile?.nickname || '我');
                            }}
                            style={{
                              background: userLiked ? '#ff6b6b' : '#f5f5f5',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '3px 10px',
                              fontSize: '12px',
                              color: userLiked ? '#ffffff' : '#666666',
                              cursor: 'pointer',
                            }}
                          >
                            {userLiked ? '❤️已赞' : '❤️赞'}
                          </button>
                          <button
                            onClick={() => {
                              const text = window.prompt('说点什么...');
                              if (text && text.trim()) {
                                commentMoment(post.id, {
                                  author: userProfile?.nickname || '我',
                                  content: text.trim(),
                                  isUser: true,
                                });
                                // 如果是 AI 的朋友圈，模拟 AI 回复
                                if (post.isAIAuthor) {
                                  const aiReplies = [
                                    '谢谢～',
                                    '哈哈哈哈哈',
                                    '你真好～',
                                    '感谢支持！',
                                    '爱你哦～',
                                  ];
                                  setTimeout(() => {
                                    commentMoment(post.id, {
                                      author: post.author,
                                      content: aiReplies[Math.floor(Math.random() * aiReplies.length)],
                                      replyTo: userProfile?.nickname || '我',
                                    });
                                  }, 2000 + Math.random() * 2000);
                                }
                              }
                            }}
                            style={{
                              background: '#f5f5f5',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '3px 10px',
                              fontSize: '12px',
                              color: '#666666',
                              cursor: 'pointer',
                            }}
                          >
                            💬评论
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 底部留白 */}
            <div style={{ height: '40px', background: '#ededed' }} />
          </div>
        )}

        {/* 礼物弹窗 */}
        {giftOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setGiftOpen(false);
              }
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '340px',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ fontSize: '17px', fontWeight: 600, color: '#000000', textAlign: 'center' }}>
                🎁 送礼物
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#888888' }}>选择礼物金额</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[5.2, 13.14, 52, 66, 88, 520].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setGiftAmount(amount)}
                      style={{
                        padding: '12px 0',
                        borderRadius: '8px',
                        background: giftAmount === amount ? '#07C160' : '#f5f5f5',
                        color: giftAmount === amount ? '#ffffff' : '#000000',
                        fontSize: '14px',
                        fontWeight: 500,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      ¥{amount}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#888888' }}>自定义：</span>
                  <input
                    type="number"
                    value={giftAmount === 0 ? '' : giftAmount}
                    onChange={(e) => setGiftAmount(parseFloat(e.target.value) || 0)}
                    placeholder="输入金额"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      fontSize: '14px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '6px',
                      outline: 'none',
                      color: '#000000',
                    }}
                  />
                  <span style={{ fontSize: '13px', color: '#888888' }}>元</span>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#888888', textAlign: 'center' }}>
                当前余额：¥{userProfile.balance?.toFixed?.(2) ?? userProfile.balance}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  onClick={() => setGiftOpen(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#f5f5f5',
                    color: '#000000',
                    fontSize: '15px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  取消
                </button>
                <button
                  onClick={handleSendGift}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#07C160',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  送出
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 红包弹窗 */}
        {redPacketOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setRedPacketOpen(false);
              }
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '340px',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ fontSize: '17px', fontWeight: 600, color: '#000000', textAlign: 'center' }}>
                🧧 发红包
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#888888' }}>选择红包金额</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[1.68, 6.66, 8.88, 18.88, 66.66, 88.88].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setRedPacketAmount(amount)}
                      style={{
                        padding: '12px 0',
                        borderRadius: '8px',
                        background: redPacketAmount === amount ? '#07C160' : '#f5f5f5',
                        color: redPacketAmount === amount ? '#ffffff' : '#000000',
                        fontSize: '14px',
                        fontWeight: 500,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      ¥{amount}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#888888' }}>自定义：</span>
                  <input
                    type="number"
                    value={redPacketAmount === 0 ? '' : redPacketAmount}
                    onChange={(e) => setRedPacketAmount(parseFloat(e.target.value) || 0)}
                    placeholder="输入金额"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      fontSize: '14px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '6px',
                      outline: 'none',
                      color: '#000000',
                    }}
                  />
                  <span style={{ fontSize: '13px', color: '#888888' }}>元</span>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#888888', textAlign: 'center' }}>
                当前余额：¥{userProfile.balance?.toFixed?.(2) ?? userProfile.balance}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  onClick={() => setRedPacketOpen(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#f5f5f5',
                    color: '#000000',
                    fontSize: '15px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  取消
                </button>
                <button
                  onClick={handleSendRedPacket}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#07C160',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  发红包
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 偷看手机页面 - 模拟对方手机界面 */}
        {peekPhoneOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              background: '#000000',
              overflow: 'hidden',
            }}
          >
            {/* 固定的顶部栏 */}
            <div
              style={{
                height: '48px',
                minHeight: '48px',
                background: peekPhoneApp === null ? '#ededed' : peekPhoneApp === 'wechat' ? '#ededed' : peekPhoneApp === 'messages' ? '#ededed' : peekPhoneApp === 'phone' ? '#ffffff' : peekPhoneApp === 'settings' ? '#ededed' : peekPhoneApp === 'douyin' ? '#000000' : peekPhoneApp === 'xiaohongshu' ? '#ffffff' : peekPhoneApp === 'alipay' ? '#1677FF' : peekPhoneApp === 'taobao' ? '#ff6a00' : '#1c1c1e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 8px',
                flexShrink: 0,
                borderBottom: peekPhoneApp && peekPhoneApp !== 'photos' && peekPhoneApp !== 'camera' && peekPhoneApp !== 'music' && peekPhoneApp !== 'safari' ? '1px solid #e5e5e5' : 'none',
                zIndex: 10,
              }}
            >
              <button
                onClick={() => {
                  if (peekPhoneApp === null) {
                    setPeekPhoneOpen(false);
                  } else {
                    setPeekPhoneApp(null);
                  }
                }}
                style={{
                  padding: '0 12px',
                  height: '48px',
                  minWidth: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  color: peekPhoneApp === 'douyin' || peekPhoneApp === 'alipay' || peekPhoneApp === 'photos' || peekPhoneApp === 'camera' || peekPhoneApp === 'music' || peekPhoneApp === 'safari' ? '#ffffff' : '#000000',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 500,
                  WebkitAppearance: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {peekPhoneApp === null ? '关闭' : '返回'}
              </button>

              <div
                style={{
                  fontWeight: 600,
                  fontSize: '16px',
                  color: peekPhoneApp === 'douyin' || peekPhoneApp === 'alipay' || peekPhoneApp === 'photos' || peekPhoneApp === 'camera' || peekPhoneApp === 'music' || peekPhoneApp === 'safari' ? '#ffffff' : '#000000',
                }}
              >
                {peekPhoneApp === null && `偷看 ${currentConversation?.title || 'TA'} 的手机`}
                {peekPhoneApp === 'wechat' && '微信'}
                {peekPhoneApp === 'messages' && '信息'}
                {peekPhoneApp === 'phone' && '电话'}
                {peekPhoneApp === 'photos' && '照片'}
                {peekPhoneApp === 'camera' && '相机'}
                {peekPhoneApp === 'notes' && '备忘录'}
                {peekPhoneApp === 'music' && '音乐'}
                {peekPhoneApp === 'settings' && '设置'}
                {peekPhoneApp === 'douyin' && '抖音'}
                {peekPhoneApp === 'xiaohongshu' && '小红书'}
                {peekPhoneApp === 'alipay' && '支付宝'}
                {peekPhoneApp === 'taobao' && '淘宝'}
                {peekPhoneApp === 'safari' && 'Safari'}
              </div>

              <span
                style={{
                  fontSize: '12px',
                  color: peekPhoneApp === 'douyin' || peekPhoneApp === 'alipay' || peekPhoneApp === 'photos' || peekPhoneApp === 'camera' || peekPhoneApp === 'music' || peekPhoneApp === 'safari' ? '#ffffff' : '#333333',
                  fontWeight: 600,
                  width: '60px',
                  textAlign: 'right',
                }}
              >
                {(() => {
                  const now = new Date();
                  const h = now.getHours().toString().padStart(2, '0');
                  const m = now.getMinutes().toString().padStart(2, '0');
                  return `${h}:${m}`;
                })()}
              </span>
            </div>

            {/* APP页面内容区 */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                minHeight: 0,
                WebkitOverflowScrolling: 'touch',
                background: peekPhoneApp === null
                  ? 'linear-gradient(180deg, #2a3a5c 0%, #4a5a7c 50%, #3a4a6c 100%)'
                  : peekPhoneApp === 'wechat' || peekPhoneApp === 'messages' || peekPhoneApp === 'notes' || peekPhoneApp === 'settings'
                    ? '#ededed'
                    : peekPhoneApp === 'phone' || peekPhoneApp === 'xiaohongshu' || peekPhoneApp === 'taobao'
                      ? '#ffffff'
                      : peekPhoneApp === 'photos'
                        ? '#1c1c1e'
                        : peekPhoneApp === 'camera' || peekPhoneApp === 'douyin'
                          ? '#000000'
                          : peekPhoneApp === 'music'
                            ? '#121212'
                            : peekPhoneApp === 'alipay'
                              ? '#1677FF'
                              : '#000000',
              }}
            >
              {/* 主屏幕：所有APP图标网格 */}
              {peekPhoneApp === null && (
                <div style={{ padding: '20px 24px 30px' }}>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '8px 16px 16px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                    }}
                  >
                    （偷偷看看 TA 的手机里有什么...）
                  </div>

                  {/* 第一行：4个图标 */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '20px 16px',
                      padding: '10px 0 30px',
                    }}
                  >
                    {/* 微信 */}
                    <div
                      onClick={() => setPeekPhoneApp('wechat')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '14px',
                          background: 'linear-gradient(180deg, #07C160 0%, #06AD56 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M9.5 3C5.4 3 2 5.7 2 9.1c0 1.9 1 3.6 2.6 4.7-0.1 0.5-0.4 1.6-0.5 1.9 0 0.2 0.1 0.3 0.3 0.1l2.3-1.2c0.9 0.2 1.8 0.4 2.8 0.4 0.2 0 0.4 0 0.6 0-0.1-0.4-0.1-0.8-0.1-1.2 0-3.2 3.1-5.8 7-5.8 0.4 0 0.8 0 1.1 0.1C17.6 4.8 13.9 3 9.5 3zM7 7.8L5.5 6.8l1.5-1L7 7.8zM12 7.8L10.5 6.8l1.5-1L12 7.8z" />
                          <path d="M22 15c0 2.8-2.7 5-6 5-0.6 0-1.2-0.1-1.8-0.2L11 21.2c-0.2 0.1-0.3 0-0.3-0.1l-0.4-1.4C7.7 18.6 6 17.1 6 15.3c0-2.8 2.7-5 6-5 3.3 0 6 2.1 6 4.7z" />
                        </svg>
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '12px' }}>微信</span>
                    </div>

                    {/* 信息 */}
                    <div
                      onClick={() => setPeekPhoneApp('messages')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '14px',
                          background: 'linear-gradient(180deg, #5ac8fa 0%, #007AFF 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="#ffffff">
                          <rect x="3" y="4" width="18" height="14" rx="2" />
                          <path d="M3 6l9 6 9-6" stroke="#007AFF" strokeWidth="1" fill="none" />
                        </svg>
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '12px' }}>信息</span>
                    </div>

                    {/* 电话 */}
                    <div
                      onClick={() => setPeekPhoneApp('phone')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '14px',
                          background: 'linear-gradient(180deg, #34C759 0%, #28A745 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M20 15.5c-1.2 0-2.4-0.2-3.5-0.6-0.4-0.2-0.9-0.1-1.2 0.3l-1.8 2.2c-2.8-1.4-5.1-3.7-6.5-6.5l2.2-1.8c0.4-0.3 0.5-0.8 0.3-1.2-0.4-1.1-0.6-2.3-0.6-3.5 0-0.3-0.2-0.5-0.5-0.5H4c-0.3 0-0.5 0.2-0.5 0.5 0 9.1 7.4 16.5 16.5 16.5 0.3 0 0.5-0.2 0.5-0.5v-3.5c0-0.3-0.2-0.5-0.5-0.5z" />
                        </svg>
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '12px' }}>电话</span>
                    </div>

                    {/* 相册 */}
                    <div
                      onClick={() => setPeekPhoneApp('photos')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '14px',
                          background: '#ffffff',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '2px',
                          padding: '6px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <div style={{ background: '#ff9500', borderRadius: '2px' }} />
                        <div style={{ background: '#ff3b30', borderRadius: '2px' }} />
                        <div style={{ background: '#5ac8fa', borderRadius: '2px' }} />
                        <div style={{ background: '#af52de', borderRadius: '2px' }} />
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '12px' }}>相册</span>
                    </div>
                  </div>

                  {/* 第二行：4个图标 */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '20px 16px',
                      padding: '0 0 30px',
                    }}
                  >
                    {/* 相机 */}
                    <div
                      onClick={() => setPeekPhoneApp('camera')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '14px',
                          background: 'linear-gradient(180deg, #8e8e93 0%, #48484a 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M20 6h-2.8l-1.2-1.6c-0.4-0.5-1-0.8-1.7-0.8H9.7c-0.7 0-1.3 0.3-1.7 0.8L6.8 6H4c-1.1 0-2 0.9-2 2v10c0 1.1 0.9 2 2 2h16c1.1 0 2-0.9 2-2V8c0-1.1-0.9-2-2-2z" />
                          <circle cx="12" cy="13" r="4" fill="#1c1c1e" />
                          <circle cx="12" cy="13" r="2.5" fill="#8e8e93" />
                        </svg>
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '12px' }}>相机</span>
                    </div>

                    {/* 备忘录 */}
                    <div
                      onClick={() => setPeekPhoneApp('notes')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '14px',
                          background: 'linear-gradient(180deg, #fffce7 0%, #ffe066 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="1.5">
                          <line x1="5" y1="6" x2="17" y2="6" />
                          <line x1="5" y1="10" x2="17" y2="10" />
                          <line x1="5" y1="14" x2="14" y2="14" />
                          <line x1="5" y1="18" x2="12" y2="18" />
                        </svg>
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '12px' }}>备忘录</span>
                    </div>

                    {/* 音乐 */}
                    <div
                      onClick={() => setPeekPhoneApp('music')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '14px',
                          background: 'linear-gradient(180deg, #fa2d44 0%, #c81e35 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M20 3L8 5v8.2c-0.6-0.4-1.3-0.7-2-0.7-2.2 0-4 1.6-4 3.5s1.8 3.5 4 3.5 4-1.6 4-3.5V8l10-1.5V15c-0.6-0.4-1.3-0.7-2-0.7-2.2 0-4 1.6-4 3.5s1.8 3.5 4 3.5 4-1.6 4-3.5V3z" />
                        </svg>
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '12px' }}>音乐</span>
                    </div>

                    {/* 设置 */}
                    <div
                      onClick={() => setPeekPhoneApp('settings')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '14px',
                          background: 'linear-gradient(180deg, #8e8e93 0%, #48484a 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#ffffff">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15.2l-1.9-1.1c0.4-0.8 0.7-1.7 0.7-2.6s-0.3-1.8-0.7-2.6l1.9-1.1c0.5-0.3 0.7-0.9 0.5-1.5l-1.8-3.1c-0.2-0.4-0.6-0.6-1-0.5l-2.2 0.9c-0.5-0.4-1.1-0.7-1.7-0.9l-0.3-2.3c0-0.5-0.4-0.9-0.9-0.9h-3.6c-0.5 0-0.9 0.4-0.9 0.9L8.7 3.8c-0.6 0.2-1.2 0.5-1.7 0.9l-2.2-0.9c-0.4-0.2-0.9 0-1.1 0.5L1.9 7.4c-0.2 0.5 0 1 0.5 1.5l1.9 1.1c-0.4 0.8-0.7 1.7-0.7 2.6s0.3 1.8 0.7 2.6L2.4 16.3c-0.5 0.3-0.7 0.9-0.5 1.5l1.8 3.1c0.2 0.4 0.6 0.6 1 0.5l2.2-0.9c0.5 0.4 1.1 0.7 1.7 0.9l0.3 2.3c0 0.5 0.4 0.9 0.9 0.9h3.6c0.5 0 0.9-0.4 0.9-0.9l0.3-2.3c0.6-0.2 1.2-0.5 1.7-0.9l2.2 0.9c0.4 0.2 0.9 0 1.1-0.5l1.8-3.1c0.2-0.5 0-1-0.5-1.5z" fill="#ffffff" />
                        </svg>
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '12px' }}>设置</span>
                    </div>
                  </div>

                  {/* 第三行：4个图标（抖音、小红书、支付宝、淘宝） */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '20px 16px',
                      padding: '0 0 30px',
                    }}
                  >
                    {/* 抖音 */}
                    <div
                      onClick={() => setPeekPhoneApp('douyin')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '14px',
                          background: '#000000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                          color: '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '20px',
                        }}
                      >
                        抖音
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '12px' }}>抖音</span>
                    </div>

                    {/* 小红书 */}
                    <div
                      onClick={() => setPeekPhoneApp('xiaohongshu')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '14px',
                          background: '#ff2442',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                          color: '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }}
                      >
                        小红书
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '12px' }}>小红书</span>
                    </div>

                    {/* 支付宝 */}
                    <div
                      onClick={() => setPeekPhoneApp('alipay')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '14px',
                          background: '#1677FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                          color: '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }}
                      >
                        支付宝
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '12px' }}>支付宝</span>
                    </div>

                    {/* 淘宝 */}
                    <div
                      onClick={() => setPeekPhoneApp('taobao')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '14px',
                          background: 'linear-gradient(180deg, #ff8800 0%, #ff5500 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                          color: '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }}
                      >
                        淘宝
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '12px' }}>淘宝</span>
                    </div>
                  </div>

                  {/* Safari */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '20px 16px',
                      padding: '0 0 40px',
                    }}
                  >
                    <div
                      onClick={() => setPeekPhoneApp('safari')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '14px',
                          background: 'linear-gradient(180deg, #ffffff 0%, #e5e5e5 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <svg width="32" height="32" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" fill="#007AFF" stroke="#ffffff" strokeWidth="1" />
                          <path d="M12 2v20M2 12h20" stroke="#ffffff" strokeWidth="0.5" />
                          <path d="M8 8l4 8 4-4-4 4-8-8z" fill="#ff3b30" opacity="0.9" />
                        </svg>
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '12px' }}>Safari</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 微信：聊天对话 */}
              {peekPhoneApp === 'wechat' && (
                <div style={{ padding: '0', background: '#ededed', minHeight: '100%' }}>
                  {/* 聊天列表简要（模拟） */}
                  <div
                    onClick={() => {}}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: '#ffffff',
                      borderBottom: '1px solid #e5e5e5',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '18px',
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {currentConversation?.title ? currentConversation.title.charAt(0) : '我'}
                    </div>
                    <div style={{ flex: 1, marginLeft: '12px', minWidth: 0 }}>
                      <div style={{ fontSize: '16px', fontWeight: 500, color: '#000000' }}>
                        {currentConversation?.title || '我'}
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#888888',
                          marginTop: '3px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        [正在输入...]
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', color: '#999999', marginRight: '8px' }}>刚刚</div>
                  </div>

                  {/* 聊天内容区 */}
                  <div style={{ padding: '16px' }}>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#999999',
                        textAlign: 'center',
                        marginBottom: '20px',
                      }}
                    >
                      以下是 TA 正在输入的消息草稿...
                    </div>

                    <div style={{ display: 'flex', marginBottom: '14px' }}>
                      <div
                        style={{
                          background: '#ffffff',
                          color: '#000000',
                          padding: '10px 14px',
                          borderRadius: '4px',
                          fontSize: '15px',
                          maxWidth: '75%',
                          lineHeight: 1.5,
                        }}
                      >
                        今天想你了
                      </div>
                    </div>
                    <div style={{ display: 'flex', marginBottom: '14px' }}>
                      <div
                        style={{
                          background: '#ffffff',
                          color: '#000000',
                          padding: '10px 14px',
                          borderRadius: '4px',
                          fontSize: '15px',
                          maxWidth: '75%',
                          lineHeight: 1.5,
                        }}
                      >
                        你今天过得怎么样？
                      </div>
                    </div>
                    <div style={{ display: 'flex', marginBottom: '14px' }}>
                      <div
                        style={{
                          background: '#ffffff',
                          color: '#000000',
                          padding: '10px 14px',
                          borderRadius: '4px',
                          fontSize: '15px',
                          maxWidth: '75%',
                          lineHeight: 1.5,
                        }}
                      >
                        晚上要不要一起吃饭
                      </div>
                    </div>
                    <div style={{ display: 'flex', marginBottom: '14px' }}>
                      <div
                        style={{
                          background: '#ffffff',
                          color: '#000000',
                          padding: '10px 14px',
                          borderRadius: '4px',
                          fontSize: '15px',
                          maxWidth: '75%',
                          lineHeight: 1.5,
                        }}
                      >
                        等你回复哦～
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: '11px',
                        color: '#999999',
                        textAlign: 'center',
                        marginTop: '30px',
                        fontStyle: 'italic',
                      }}
                    >
                      （TA 一直在等你的回复...）
                    </div>
                  </div>
                </div>
              )}

              {/* 信息：短信列表 */}
              {peekPhoneApp === 'messages' && (
                <div style={{ background: '#ffffff', minHeight: '100%' }}>
                  {[
                    { from: '妈妈', text: '今天记得早点回家吃饭', time: '昨天' },
                    { from: '外卖小哥', text: '您的外卖已送达，请下楼取餐', time: '昨天' },
                    { from: '快递', text: '您的快递已放到小区门口的快递柜，取件码8842', time: '2天前' },
                    { from: '银行卡', text: '【银行】您的账户于12:34支出520.00元', time: '3天前' },
                    { from: '外卖平台', text: '您有一张优惠券即将过期，快去使用吧', time: '4天前' },
                    { from: '10086', text: '本月已使用流量2.3GB，剩余5.7GB', time: '5天前' },
                  ].map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '14px 16px',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96c93d', '#f0932b', '#6c5ce7'][i % 6]}, ${['#ee5a6f', '#44a08d', '#2193b0', '#7cb342', '#e17055', '#5f4b8b'][i % 6]})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontSize: '15px',
                          fontWeight: 500,
                          flexShrink: 0,
                        }}
                      >
                        {msg.from.charAt(0)}
                      </div>
                      <div style={{ flex: 1, marginLeft: '12px', minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '15px',
                            fontWeight: 500,
                            color: '#000000',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          {msg.from}
                          <span style={{ fontSize: '11px', color: '#999999', fontWeight: 'normal' }}>
                            {msg.time}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '13px',
                            color: '#888888',
                            marginTop: '3px',
                            lineHeight: 1.4,
                          }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 电话：通话记录 */}
              {peekPhoneApp === 'phone' && (
                <div style={{ background: '#ffffff', minHeight: '100%' }}>
                  {[
                    { name: '妈妈', detail: '呼入 · 5分钟', time: '今天 18:32' },
                    { name: '外卖', detail: '未接', time: '今天 12:15' },
                    { name: '公司', detail: '呼出 · 2分钟', time: '今天 10:20' },
                    { name: '朋友A', detail: '呼入 · 8分钟', time: '昨天 22:14' },
                    { name: '快递', detail: '呼出 · 1分钟', time: '昨天 14:23' },
                    { name: '银行', detail: '呼出 · 3分钟', time: '前天 16:50' },
                  ].map((call, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '14px 16px',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${['#ff6b6b', '#ff3b30', '#45b7d1', '#96c93d', '#f0932b', '#6c5ce7'][i % 6]}, ${['#ee5a6f', '#c81e35', '#2193b0', '#7cb342', '#e17055', '#5f4b8b'][i % 6]})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontSize: '15px',
                          fontWeight: 500,
                          flexShrink: 0,
                        }}
                      >
                        {call.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1, marginLeft: '12px', minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '16px',
                            color: call.detail.includes('未接') ? '#ff3b30' : '#000000',
                            fontWeight: 500,
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          {call.name}
                          <span style={{ fontSize: '12px', color: '#999999', fontWeight: 'normal' }}>
                            {call.time}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '13px',
                            color: call.detail.includes('未接') ? '#ff3b30' : '#888888',
                            marginTop: '3px',
                          }}
                        >
                          {call.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 相册：照片网格 */}
              {peekPhoneApp === 'photos' && (
                <div style={{ background: '#1c1c1e', minHeight: '100%', padding: '8px' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '4px',
                    }}
                  >
                    {[
                      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96c93d',
                      '#f0932b', '#6c5ce7', '#fd79a8', '#00b894',
                      '#ff9500', '#ff3b30', '#5ac8fa', '#af52de',
                      '#ffcc00', '#34c759', '#007AFF', '#ff2d55',
                      '#5856d6', '#34C759', '#fa2d44', '#c81e35',
                      '#8e8e93', '#48484a', '#fffce7', '#ffe066',
                    ].map((color, i) => (
                      <div
                        key={i}
                        style={{
                          aspectRatio: '1/1',
                          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '24px',
                        }}
                      >
                        ❤️
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      marginTop: '20px',
                      fontSize: '12px',
                      color: '#888888',
                    }}
                  >
                    共 124 张照片 · 多是你们的合照
                  </div>
                </div>
              )}

              {/* 相机：取景器 */}
              {peekPhoneApp === 'camera' && (
                <div
                  style={{
                    background: '#000000',
                    minHeight: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      width: '280px',
                      height: '400px',
                      border: '2px solid #ffffff',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #333333, #111111)',
                      color: '#ffffff',
                      fontSize: '14px',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ fontSize: '48px' }}>📷</div>
                    <div>取景器</div>
                    <div style={{ fontSize: '11px', opacity: 0.7 }}>（假装这里有画面）</div>
                  </div>
                  <div
                    style={{
                      marginTop: '40px',
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      border: '4px solid #ffffff',
                      background: 'transparent',
                    }}
                  />
                </div>
              )}

              {/* 备忘录：笔记列表 */}
              {peekPhoneApp === 'notes' && (
                <div style={{ background: '#ffffff', minHeight: '100%' }}>
                  {[
                    { title: '购物清单', content: '牛奶、鸡蛋、面包、水果...', time: '今天' },
                    { title: '关于TA', content: '今天想TA了，TA是最可爱的人...', time: '今天' },
                    { title: '工作计划', content: '下周需要完成的任务清单...', time: '昨天' },
                    { title: '读书笔记', content: '《活着》读后感：生活就像...', time: '3天前' },
                    { title: '灵感', content: '一个关于故事的想法...', time: '上周' },
                    { title: '心愿', content: '想和TA一起去看海、看日落...', time: '上周' },
                  ].map((note, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: 500,
                          color: '#000000',
                        }}
                      >
                        {note.title}
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#888888',
                          marginTop: '4px',
                          lineHeight: 1.4,
                        }}
                      >
                        {note.content}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#999999',
                          marginTop: '6px',
                        }}
                      >
                        {note.time}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 音乐：音乐播放器 */}
              {peekPhoneApp === 'music' && (
                <div
                  style={{
                    background: '#121212',
                    minHeight: '100%',
                    padding: '40px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '240px',
                      height: '240px',
                      background: 'linear-gradient(135deg, #fa2d44 0%, #c81e35 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 30px rgba(250,45,68,0.4)',
                      marginTop: '30px',
                    }}
                  >
                    <div style={{ fontSize: '80px' }}>🎵</div>
                  </div>

                  <div
                    style={{
                      marginTop: '30px',
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#ffffff',
                    }}
                  >
                    想你的夜
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '13px',
                      color: '#888888',
                    }}
                  >
                    歌手 · TA的最爱
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      background: '#333333',
                      borderRadius: '2px',
                      marginTop: '30px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '35%',
                        height: '100%',
                        background: '#ffffff',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      color: '#888888',
                      marginTop: '6px',
                    }}
                  >
                    <span>1:23</span>
                    <span>4:05</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '40px',
                      marginTop: '40px',
                      color: '#ffffff',
                      fontSize: '32px',
                    }}
                  >
                    <span>⏮</span>
                    <span
                      style={{
                        fontSize: '48px',
                      }}
                    >
                      ▶
                    </span>
                    <span>⏭</span>
                  </div>
                </div>
              )}

              {/* 设置 */}
              {peekPhoneApp === 'settings' && (
                <div style={{ background: '#ededed', minHeight: '100%', padding: '12px 0' }}>
                  {[
                    { label: '飞行模式', icon: '✈️' },
                    { label: 'Wi-Fi', icon: '📶', value: '已连接' },
                    { label: '蓝牙', icon: '🔵', value: '打开' },
                    { label: '蜂窝网络', icon: '📱' },
                  ].map((item, i) => (
                    <div
                      key={'g1-' + i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: '#ffffff',
                        borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none',
                      }}
                    >
                      <span style={{ fontSize: '18px', width: '28px' }}>{item.icon}</span>
                      <span style={{ flex: 1, fontSize: '15px', color: '#000000', marginLeft: '8px' }}>
                        {item.label}
                      </span>
                      <span style={{ fontSize: '13px', color: '#888888' }}>{item.value || ''}</span>
                      <span style={{ fontSize: '14px', color: '#cccccc', marginLeft: '8px' }}>›</span>
                    </div>
                  ))}

                  <div style={{ height: '20px' }} />

                  {[
                    { label: '通知', icon: '🔔' },
                    { label: '声音', icon: '🔊' },
                    { label: '显示与亮度', icon: '☀️' },
                    { label: '墙纸', icon: '🖼' },
                  ].map((item, i) => (
                    <div
                      key={'g2-' + i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: '#ffffff',
                        borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none',
                      }}
                    >
                      <span style={{ fontSize: '18px', width: '28px' }}>{item.icon}</span>
                      <span style={{ flex: 1, fontSize: '15px', color: '#000000', marginLeft: '8px' }}>
                        {item.label}
                      </span>
                      <span style={{ fontSize: '14px', color: '#cccccc' }}>›</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 抖音：视频 feed */}
              {peekPhoneApp === 'douyin' && (
                <div
                  style={{
                    background: '#000000',
                    minHeight: '100%',
                    padding: '0',
                  }}
                >
                  {[
                    { user: '美食博主', desc: '今天教大家做一道超级好吃的菜！', likes: '12.5w', comments: '2341' },
                    { user: '旅行达人', desc: '带你去看看这个世界最美的角落 🌍', likes: '8.3w', comments: '1520' },
                    { user: '搞笑日常', desc: '哈哈哈笑死我了 真的绝了', likes: '25.1w', comments: '5823' },
                    { user: '健身教练', desc: '每天坚持10分钟，身材变好不是梦', likes: '6.7w', comments: '892' },
                  ].map((video, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'relative',
                        height: '380px',
                        background: `linear-gradient(135deg, ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96c93d'][i % 4]}, ${['#ee5a6f', '#44a08d', '#2193b0', '#7cb342'][i % 4]})`,
                        marginBottom: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        color: '#ffffff',
                        padding: '16px',
                      }}
                    >
                      <div style={{ fontSize: '15px', fontWeight: 600 }}>@{video.user}</div>
                      <div style={{ fontSize: '13px', marginTop: '6px', lineHeight: 1.5 }}>
                        {video.desc}
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          right: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '24px' }}>❤️</div>
                          <div style={{ fontSize: '11px', marginTop: '4px' }}>{video.likes}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '24px' }}>💬</div>
                          <div style={{ fontSize: '11px', marginTop: '4px' }}>{video.comments}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '24px' }}>↗️</div>
                          <div style={{ fontSize: '11px', marginTop: '4px' }}>分享</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 小红书：帖子 feed */}
              {peekPhoneApp === 'xiaohongshu' && (
                <div
                  style={{
                    background: '#f5f5f5',
                    minHeight: '100%',
                    padding: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '8px',
                    }}
                  >
                    {[
                      { title: '今天的穿搭分享～超级好看', author: '时尚小姐姐', likes: '3.2w', color: '#ff6b6b' },
                      { title: '发现一家超好吃的咖啡店！', author: '美食侦探', likes: '1.8w', color: '#4ecdc4' },
                      { title: '旅行日记：一个人的海边', author: '旅行达人', likes: '5.1w', color: '#45b7d1' },
                      { title: '化妆教程：日常淡妆', author: '美妆博主', likes: '2.4w', color: '#f0932b' },
                      { title: '读书笔记：今年最爱的几本书', author: '书虫', likes: '8500', color: '#6c5ce7' },
                      { title: '租房改造：500元的奇迹', author: '生活家', likes: '1.2w', color: '#96c93d' },
                    ].map((post, i) => (
                      <div
                        key={i}
                        style={{
                          background: '#ffffff',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <div
                          style={{
                            aspectRatio: '3/4',
                            background: `linear-gradient(135deg, ${post.color}, ${post.color}dd)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontSize: '14px',
                          }}
                        >
                          📷
                        </div>
                        <div
                          style={{
                            padding: '8px 10px 10px',
                            fontSize: '13px',
                            color: '#333333',
                            lineHeight: 1.4,
                          }}
                        >
                          {post.title}
                        </div>
                        <div
                          style={{
                            padding: '0 10px 10px',
                            fontSize: '11px',
                            color: '#999999',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span>{post.author}</span>
                          <span>❤️ {post.likes}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 支付宝：钱包 */}
              {peekPhoneApp === 'alipay' && (
                <div style={{ background: '#1677FF', minHeight: '100%', padding: '0' }}>
                  <div
                    style={{
                      background: '#ffffff',
                      margin: '16px',
                      borderRadius: '12px',
                      padding: '20px 16px',
                      color: '#000000',
                    }}
                  >
                    <div style={{ fontSize: '13px', color: '#888888' }}>余额（元）</div>
                    <div style={{ fontSize: '32px', fontWeight: 600, marginTop: '8px' }}>
                      ¥ 8,888.88
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      background: '#ffffff',
                      margin: '0 16px',
                      borderRadius: '12px',
                      padding: '20px 12px',
                      gap: '12px',
                    }}
                  >
                    {[
                      { icon: '💰', name: '转账' },
                      { icon: '📱', name: '充值' },
                      { icon: '🎫', name: '卡券' },
                      { icon: '🏠', name: '生活缴费' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <div style={{ fontSize: '28px' }}>{item.icon}</div>
                        <div style={{ fontSize: '12px', color: '#333333' }}>{item.name}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ height: '16px' }} />

                  {[
                    { title: '最近转账：给TA发了520', time: '今天' },
                    { title: '消费记录：午餐 35元', time: '今天' },
                    { title: '收款：朋友还钱 200元', time: '昨天' },
                    { title: '红包：抢到 8.88元', time: '昨天' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        background: '#ffffff',
                        margin: '0 16px 8px',
                        borderRadius: '8px',
                        padding: '12px 14px',
                        color: '#000000',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '14px' }}>{item.title}</span>
                      <span style={{ fontSize: '12px', color: '#999999' }}>{item.time}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 淘宝：商品 */}
              {peekPhoneApp === 'taobao' && (
                <div style={{ background: '#f5f5f5', minHeight: '100%', padding: '8px' }}>
                  {[
                    { name: '送给TA的生日礼物 情侣款', price: '199', sold: '3000+', color: '#ff6b6b' },
                    { name: '情人节礼物 惊喜盒子', price: '299', sold: '1.5w', color: '#fd79a8' },
                    { name: '情侣装 夏季新款 百搭', price: '129', sold: '8000+', color: '#45b7d1' },
                    { name: '定制相框 合照打印', price: '59', sold: '2.3w', color: '#f0932b' },
                    { name: '手写信 文艺复古风', price: '29', sold: '5000+', color: '#96c93d' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        background: '#ffffff',
                        marginBottom: '8px',
                        borderRadius: '8px',
                        display: 'flex',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: '110px',
                          height: '110px',
                          background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontSize: '32px',
                          flexShrink: 0,
                        }}
                      >
                        🎁
                      </div>
                      <div
                        style={{
                          flex: 1,
                          padding: '12px',
                          minWidth: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '14px',
                            color: '#333333',
                            lineHeight: 1.4,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                          }}
                        >
                          {item.name}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '18px',
                              fontWeight: 600,
                              color: '#ff5500',
                            }}
                          >
                            ¥{item.price}
                          </span>
                          <span style={{ fontSize: '11px', color: '#999999' }}>
                            销量 {item.sold}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Safari：搜索页 */}
              {peekPhoneApp === 'safari' && (
                <div
                  style={{
                    background: '#000000',
                    minHeight: '100%',
                    padding: '20px 16px',
                    color: '#ffffff',
                  }}
                >
                  <div
                    style={{
                      background: '#2c2c2e',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      fontSize: '14px',
                      color: '#ffffff',
                    }}
                  >
                    🔍  搜索或输入网址
                  </div>

                  <div
                    style={{
                      marginTop: '24px',
                      fontSize: '13px',
                      color: '#888888',
                      marginBottom: '12px',
                    }}
                  >
                    TA最近搜索
                  </div>

                  {[
                    '如何给喜欢的人准备惊喜',
                    '好看的情侣头像',
                    '附近好吃的餐厅推荐',
                    '怎么让聊天不尴尬',
                    '一周年礼物送什么好',
                    '怎么变得更优秀',
                  ].map((text, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '12px 0',
                        fontSize: '14px',
                        color: '#ffffff',
                        borderBottom: '1px solid #2c2c2e',
                      }}
                    >
                      <span style={{ color: '#5ac8fa', marginRight: '10px' }}>🔍</span>
                      {text}
                    </div>
                  ))}

                  <div
                    style={{
                      marginTop: '30px',
                      fontSize: '11px',
                      color: '#666666',
                      textAlign: 'center',
                      fontStyle: 'italic',
                    }}
                  >
                    （TA的搜索记录里，全是你）
                  </div>
                </div>
              )}
            </div>

            {/* 右上角固定的关闭按钮 */}
            <div
              style={{
                position: 'absolute',
                top: '52px',
                right: '16px',
                zIndex: 50,
              }}
            >
              <button
                onClick={() => {
                  setPeekPhoneApp(null);
                  setPeekPhoneOpen(false);
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                ✕
              </button>
            </div>

            {/* 底部 Home indicator（点击可关闭） */}
            <div
              onClick={() => {
                setPeekPhoneApp(null);
                setPeekPhoneOpen(false);
              }}
              style={{
                height: '30px',
                background: peekPhoneApp === 'douyin' || peekPhoneApp === 'camera' || peekPhoneApp === 'music' || peekPhoneApp === 'photos' || peekPhoneApp === 'safari' ? '#000000' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '130px',
                  height: '5px',
                  borderRadius: '3px',
                  background: peekPhoneApp === 'douyin' || peekPhoneApp === 'camera' || peekPhoneApp === 'music' || peekPhoneApp === 'photos' || peekPhoneApp === 'safari' ? '#ffffff' : '#333333',
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }


  // ========== 微信会话列表界面 ==========
  const renderWeChat = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ededed' }}>
      {/* 顶部栏 */}
      <div
        style={{
          height: '44px',
          background: '#ededed',
          borderBottom: '1px solid #e5e5e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          flexShrink: 0,
        }}
      >
        <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div style={{ fontWeight: 500, fontSize: '17px', color: '#000000' }}>微信</div>
        <button
          onClick={() => {
            // 打开创建新角色弹窗
            setNewProfileName('');
            setNewProfileColor('#45b7d1');
            setNewProfileColor2('#2193b0');
            setNewProfileImage(null);
            setCreateProfileOpen(true);
          }}
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            cursor: 'pointer',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* 搜索框 */}
      <div style={{ padding: '8px 12px', background: '#ededed' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '6px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ color: '#888888', fontSize: '14px' }}>搜索</span>
        </div>
      </div>

      {/* 会话列表 */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#ffffff', minHeight: 0 }}>
        {conversations.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#888888', fontSize: '14px' }}>
            暂无对话
            <div style={{ marginTop: '12px' }}>
              <button
                onClick={handleNewChat}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: '#07C160',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                发起新对话
              </button>
            </div>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleSelectConversation(conv.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                setDeleteConvDialog(conv.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 12px',
                gap: '12px',
                cursor: 'pointer',
                borderBottom: '1px solid #ececec',
              }}
            >
              <Avatar name={conv.title} color1={conv.avatarColor} color2={conv.avatarColor2} image={conv.avatarImage} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '16px', color: '#000000', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {conv.title}
                  </span>
                  <span style={{ fontSize: '12px', color: '#888888', flexShrink: 0, marginLeft: '8px' }}>
                    {conv.messages.length > 0
                      ? new Date(conv.messages[conv.messages.length - 1].createdAt).toLocaleTimeString('zh-CN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#888888', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {conv.messages.length > 0
                    ? conv.messages[conv.messages.length - 1].content
                    : '点击开始对话'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 删除确认 */}
      <ConfirmDialog
        isVisible={!!deleteConvDialog}
        title="删除会话"
        message="确定要删除该会话吗？此操作不可恢复。"
        confirmText="删除"
        cancelText="取消"
        onConfirm={() => deleteConvDialog && handleDeleteConversation(deleteConvDialog)}
        onCancel={() => setDeleteConvDialog(null)}
        danger
      />
    </div>
  );

  // ========== 通讯录页面 ==========
  const renderContacts = () => {
    // 从会话中提取联系人
    const contactNames = conversations.length > 0
      ? conversations.map((c) => c.title).filter((name) => name && name.trim().length > 0)
      : [];

    // 基于charCode的快速首字母分组
    const getFirstLetter = (name: string): string => {
      if (!name || name.length === 0) return '#';
      const firstChar = name.charAt(0);
      if (/[a-zA-Z]/.test(firstChar)) {
        return firstChar.toUpperCase();
      }
      if (/[0-9]/.test(firstChar)) {
        return '#';
      }
      const charCode = firstChar.charCodeAt(0);
      if (charCode >= 0x4e00 && charCode <= 0x9fff) {
        const mod = charCode % 26;
        return String.fromCharCode(65 + mod);
      }
      return '#';
    };

    // 按首字母分组并排序
    const groups: { [key: string]: string[] } = {};
    contactNames.forEach((name) => {
      const letter = getFirstLetter(name);
      if (!groups[letter]) {
        groups[letter] = [];
      }
      if (!groups[letter].includes(name)) {
        groups[letter].push(name);
      }
    });

    const sortedLetters = Object.keys(groups).sort((a, b) => {
      if (a === '#') return 1;
      if (b === '#') return -1;
      return a.localeCompare(b);
    });
    sortedLetters.forEach((letter) => {
      groups[letter].sort();
    });

    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ededed' }}>
        {/* 顶部栏 */}
        <div
          style={{
            height: '44px',
            background: '#ededed',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            flexShrink: 0,
          }}
        >
          <div style={{ width: '32px', height: '32px' }} />
          <div style={{ fontWeight: 500, fontSize: '17px', color: '#000000' }}>通讯录</div>
          <button
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              cursor: 'pointer',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 3a4 4 0 014 4 3.8 3.8 0 01-.5 2l.5.5 2.5 2.5a1.5 1.5 0 010 2l-.5.5-.5.5.5.5.5.5a1.5 1.5 0 010 2L18 20.5 16 22.5a1.5 1.5 0 01-2 0l-.5-.5-.5-.5-.5.5-.5.5a1.5 1.5 0 01-2 0l-.5-.5-.5-.5-.5.5-.5.5a1.5 1.5 0 01-2 0L6 18.5 5 17.5a1.5 1.5 0 010-2L5.5 15l.5-.5-.5-.5L4.5 12a1.5 1.5 0 010-2L5 10.5l.5-.5-.5-.5L4.5 8.5a1.5 1.5 0 010-2L6 4.5 8 2.5a1.5 1.5 0 012 0l.5.5.5.5.5-.5.5-.5a1.5 1.5 0 012 0l.5.5.5.5.5-.5.5-.5a1.5 1.5 0 012 0z" fill="none" stroke="currentColor" strokeWidth="1.6"/>
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="6" x2="12" y2="10" strokeLinecap="round"/>
              <line x1="20" y1="12" x2="16" y2="12" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* 搜索框 */}
        <div style={{ padding: '8px 12px', background: '#ededed' }}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '6px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span style={{ color: '#888888', fontSize: '14px' }}>搜索</span>
          </div>
        </div>

        {/* 顶部功能区（我的企业） */}
        <div style={{ background: '#ffffff', padding: '12px', marginBottom: '8px', borderBottom: '1px solid #ececec' }}>
          <div style={{ fontSize: '12px', color: '#888888', marginBottom: '8px' }}>我的企业</div>
        </div>

        {/* 联系人列表 + 右侧字母索引 */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#ffffff', position: 'relative', minHeight: 0 }}>
          {sortedLetters.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#888888', fontSize: '14px' }}>
              还没有联系人
              <div style={{ marginTop: '12px' }}>
                <button
                  onClick={handleNewChat}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    background: '#07C160',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  发起新对话
                </button>
              </div>
            </div>
          ) : (
            sortedLetters.map((letter) => (
              <div key={letter}>
                <div
                  style={{
                    padding: '4px 12px',
                    background: '#f5f5f5',
                    fontSize: '13px',
                    color: '#666666',
                  }}
                >
                  {letter}
                </div>
                {groups[letter].map((name) => {
                  const conv = conversations.find((c) => c.title === name);
                  return (
                    <div
                      key={name}
                      onClick={() => conv && selectConversation(conv.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 12px',
                        gap: '12px',
                        borderBottom: '1px solid #ececec',
                        cursor: 'pointer',
                      }}
                    >
                      <Avatar name={name} color1={conv?.avatarColor} color2={conv?.avatarColor2} image={conv?.avatarImage} />
                      <div style={{ fontSize: '16px', color: '#000000' }}>{name}</div>
                    </div>
                  );
                })}
              </div>
            ))
          )}

          {/* 右侧字母索引 */}
          <div
            style={{
              position: 'absolute',
              right: '4px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '11px',
              color: '#888888',
              lineHeight: '1.6',
              userSelect: 'none',
            }}
          >
            {letters.map((l) => (
              <span key={l} style={{ display: 'block' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ========== 发现页面 ==========
  const renderDiscover = () => {
    const items = [
      { name: '朋友圈', icon: 'pyq', sub: '', dot: false, color: '#ffb84d' },
      { name: '视频号', icon: 'video', sub: '', dot: true, color: '#ff6b6b' },
      { name: '直播', icon: 'live', sub: '', dot: false, color: '#ff6b6b' },
      { name: '扫一扫', icon: 'scan', sub: '', dot: false, color: '#4d99ff' },
      { name: '听一听', icon: 'listen', sub: '', dot: false, color: '#ff6b6b' },
      { name: '看一看', icon: 'look', sub: '', dot: false, color: '#ffb84d' },
      { name: '搜一搜', icon: 'search', sub: '', dot: false, color: '#ff6b6b' },
      { name: '附近的人', icon: 'nearby', sub: '', dot: false, color: '#4d99ff' },
      { name: '游戏', icon: 'game', sub: '', dot: false, color: '#ffb84d' },
      { name: '小程序', icon: 'miniapp', sub: '', dot: false, color: '#4d99ff' },
    ];

    // 图标 SVG
    const renderIcon = (icon: string, color: string) => {
      switch (icon) {
        case 'pyq':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.6"/>
              <circle cx="9" cy="10" r="1.8" fill="#ffffff" stroke={color} strokeWidth="1.6"/>
              <path d="M6 14c1-2 3-3 6-3s5 1 6 3" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          );
        case 'video':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="5" width="14" height="14" rx="2" fill="none" stroke={color} strokeWidth="1.6"/>
              <path d="M10 10l5 2-5 2V10z" fill={color}/>
            </svg>
          );
        case 'live':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.6"/>
              <circle cx="12" cy="12" r="4" fill="none" stroke={color} strokeWidth="1.6"/>
              <circle cx="12" cy="12" r="1.5" fill={color}/>
            </svg>
          );
        case 'scan':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 3h4M15 3h4M5 21h4M15 21h4M3 5v4M3 15v4M21 5v4M21 15v4" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          );
        case 'listen':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 10V6c0-2 2-4 4-4s4 2 4 4v4" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
              <rect x="5" y="10" width="14" height="10" rx="3" fill="none" stroke={color} strokeWidth="1.6"/>
            </svg>
          );
        case 'look':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <polygon points="12 3 14.5 9.5 21 10.5 16.5 15.5 17.5 22 12 18.5 6.5 22 7.5 15.5 3 10.5 9.5 9.5 12 3" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          );
        case 'search':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" fill={color}/>
              <circle cx="18" cy="18" r="3" fill="none" stroke={color} strokeWidth="1.6"/>
            </svg>
          );
        case 'nearby':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="10" r="3" fill="none" stroke={color} strokeWidth="1.6"/>
              <path d="M12 21V13M6 18c1.5-1.5 3.5-2.5 6-2.5s4.5 1 6 2.5" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
              <circle cx="12" cy="21" r="1" fill={color}/>
            </svg>
          );
        case 'game':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.6"/>
              <polygon points="9 10 11 12 9 14" fill={color} stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
              <polygon points="15 10 13 12 15 14" fill={color} stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
              <polygon points="10 11 11 12 10 13" fill={color} stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          );
        case 'miniapp':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.6"/>
              <path d="M12 7v10M7 12h10" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          );
        default:
          return null;
      }
    };

    // 将项目分成三组
    const group1 = items.slice(0, 3);
    const group2 = items.slice(3, 5);
    const group3 = items.slice(5, 7);
    const group4 = items.slice(7, 8);
    const group5 = items.slice(8, 10);
    const allGroups = [group1, group2, group3, group4, group5];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ededed' }}>
        {/* 顶部栏 */}
        <div
          style={{
            height: '44px',
            background: '#ededed',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            flexShrink: 0,
          }}
        >
          <div style={{ width: '32px', height: '32px' }} />
          <div style={{ fontWeight: 500, fontSize: '17px', color: '#000000' }}>发现</div>
          <div style={{ width: '32px', height: '32px' }} />
        </div>

        {/* 内容区 */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {allGroups.map((group, groupIndex) => (
            <div key={groupIndex} style={{ marginTop: groupIndex === 0 ? '8px' : '8px', background: '#ffffff', borderTop: '1px solid #ececec', borderBottom: '1px solid #ececec' }}>
              {group.map((item, index) => (
                <div
                  key={item.name}
                  onClick={() => {
                    if (item.name === '朋友圈') {
                      handleMoments();
                    } else {
                      showToast(`${item.name}功能开发中...`);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    gap: '12px',
                    borderBottom: index !== group.length - 1 ? '1px solid #ececec' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ width: '24px', height: '24px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {renderIcon(item.icon, item.color)}
                  </div>
                  <div style={{ flex: 1, fontSize: '16px', color: '#000000' }}>{item.name}</div>
                  {item.sub && (
                    <div style={{ fontSize: '14px', color: '#888888' }}>{item.sub}</div>
                  )}
                  {item.dot && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '4px',
                        background: '#ff3b30',
                        marginRight: '4px',
                      }}
                    />
                  )}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#b2b2b2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ========== 我的页面 ==========
  const renderMe = () => {
    const items1 = [
      { name: '服务', icon: 'service', color: '#07C160' },
    ];
    const items2 = [
      { name: '收藏', icon: 'favorite', color: '#ffb84d' },
      { name: '朋友圈', icon: 'pyq', color: '#4d99ff' },
      { name: '作品', icon: 'work', color: '#4d99ff' },
      { name: '小店与卡包', icon: 'shop', sub: '', color: '#ff6b6b' },
      { name: '表情', icon: 'emoji', color: '#ffb84d' },
    ];
    const items3 = [
      { name: '设置', icon: 'settings', color: '#4d99ff' },
    ];

    const renderIcon = (icon: string, color: string) => {
      switch (icon) {
        case 'service':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 5a2 2 0 012-2h2a2 2 0 012 2v0a2 2 0 01-2 2h-2a2 2 0 01-2-2v0z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12h6M9 16h6" strokeLinecap="round"/>
            </svg>
          );
        case 'favorite':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
              <polygon points="12 3 14.5 9.5 21 10.5 16.5 15.5 17.5 22 12 18.5 6.5 22 7.5 15.5 3 10.5 9.5 9.5 12 3" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          );
        case 'pyq':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="1.6"/>
              <path d="M7 10l3 3 3-4 4 5" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          );
        case 'work':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
              <rect x="3" y="5" width="14" height="16" rx="2" fill="none" stroke={color} strokeWidth="1.6"/>
              <rect x="7" y="3" width="14" height="16" rx="2" fill="#ffffff" stroke={color} strokeWidth="1.6"/>
            </svg>
          );
        case 'shop':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
              <path d="M5 10h14l1 8H4L5 10z" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M5 10V8a3 3 0 016 0M19 10V8a3 3 0 00-6 0" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          );
        case 'emoji':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
              <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6"/>
              <path d="M8 14c1 1.5 2.5 2 4 2s3-.5 4-2" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
              <circle cx="9" cy="10" r="1" fill={color} stroke="none"/>
              <circle cx="15" cy="10" r="1" fill={color} stroke="none"/>
            </svg>
          );
        case 'settings':
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
              <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.6"/>
              <path d="M19 12a7 7 0 00-.1-1.2l2-1.6-2-3.4-2.5.8a7 7 0 00-2-1.2l-.4-2.7h-4l-.4 2.7a7 7 0 00-2 1.2l-2.5-.8-2 3.4 2 1.6a7 7 0 000 2.4l-2 1.6 2 3.4 2.5-.8a7 7 0 002 1.2l.4 2.7h4l.4-2.7a7 7 0 002-1.2l2.5.8 2-3.4-2-1.6c.07-.4.1-.8.1-1.2z" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ededed' }}>
        {/* 用户信息区 */}
        <div
          onClick={() => setEditProfileOpen(true)}
          style={{
            background: '#ffffff',
            padding: '24px 12px 20px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid #ececec',
            cursor: 'pointer',
          }}
        >
          {userProfile.avatarImage ? (
            <img
              src={userProfile.avatarImage}
              alt={userProfile.nickname}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '8px',
                objectFit: 'cover',
                flexShrink: 0,
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${userProfile.avatarColor1 || '#4ecdc4'}, ${userProfile.avatarColor2 || '#44a08d'})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '22px',
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {userProfile.nickname ? userProfile.nickname.charAt(0) : '我'}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#000000', marginBottom: '6px' }}>{userProfile.nickname}</div>
            <div style={{ fontSize: '14px', color: '#888888' }}>微信号: {userProfile.wechatId}</div>
            <div style={{ fontSize: '13px', color: '#07C160', marginTop: '4px' }}>
              余额：¥{userProfile.balance}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              style={{
                padding: '5px 10px',
                border: '1px solid #e5e5e5',
                borderRadius: '14px',
                background: '#ffffff',
                color: '#000000',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              + 状态
            </button>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#b2b2b2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* 功能列表 */}
        <div style={{ flex: 1, overflowY: 'auto', marginTop: '8px', minHeight: 0 }}>
          {/* 第一组：服务 */}
          <div style={{ background: '#ffffff', borderTop: '1px solid #ececec', borderBottom: '1px solid #ececec', marginBottom: '8px' }}>
            {items1.map((item, index) => (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  gap: '12px',
                  borderBottom: index !== items1.length - 1 ? '1px solid #ececec' : 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ width: '24px', height: '24px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {renderIcon(item.icon, item.color)}
                </div>
                <div style={{ flex: 1, fontSize: '16px', color: '#000000' }}>{item.name}</div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#b2b2b2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            ))}
          </div>

          {/* 第二组：收藏/朋友圈/作品/小店/表情 */}
          <div style={{ background: '#ffffff', borderTop: '1px solid #ececec', borderBottom: '1px solid #ececec', marginBottom: '8px' }}>
            {items2.map((item, index) => (
              <div
                key={item.name}
                onClick={() => {
                  if (item.name === '朋友圈') {
                    handleMoments();
                  } else {
                    showToast(`${item.name}功能开发中...`);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  gap: '12px',
                  borderBottom: index !== items2.length - 1 ? '1px solid #ececec' : 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ width: '24px', height: '24px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {renderIcon(item.icon, item.color)}
                </div>
                <div style={{ flex: 1, fontSize: '16px', color: '#000000' }}>{item.name}</div>
                {item.sub && (
                  <div style={{ fontSize: '14px', color: '#888888' }}>{item.sub}</div>
                )}
                {item.name === '小店与卡包' && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: '#ff3b30',
                      marginRight: '4px',
                    }}
                  />
                )}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#b2b2b2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            ))}
          </div>

          {/* 第三组：设置 */}
          <div style={{ background: '#ffffff', borderTop: '1px solid #ececec', borderBottom: '1px solid #ececec' }}>
            {items3.map((item, index) => (
              <div
                key={item.name}
                onClick={() => setSettingsOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  gap: '12px',
                  borderBottom: index !== items3.length - 1 ? '1px solid #ececec' : 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ width: '24px', height: '24px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {renderIcon(item.icon, item.color)}
                </div>
                <div style={{ flex: 1, fontSize: '16px', color: '#000000' }}>{item.name}</div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#b2b2b2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ========== 渲染页面主体 ==========
  let mainContent;
  if (activeTab === 'wechat') {
    mainContent = renderWeChat();
  } else if (activeTab === 'contacts') {
    mainContent = renderContacts();
  } else if (activeTab === 'discover') {
    mainContent = renderDiscover();
  } else {
    mainContent = renderMe();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100 * var(--vh, 1vh))', maxHeight: 'calc(100 * var(--vh, 1vh))' }}>
      {/* 主内容区 */}
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {mainContent}
      </div>

      {/* 底部 Tab 栏 */}
      <div
        style={{
          height: '52px',
          background: '#f7f7f7',
          borderTop: '1px solid #e5e5e5',
          display: 'flex',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setActiveTab('wechat')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <WeChatIcon active={activeTab === 'wechat'} />
          <span style={{ fontSize: '11px', color: activeTab === 'wechat' ? '#07C160' : '#181818', marginTop: '2px' }}>微信</span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <ContactsIcon active={activeTab === 'contacts'} />
          <span style={{ fontSize: '11px', color: activeTab === 'contacts' ? '#07C160' : '#181818', marginTop: '2px' }}>通讯录</span>
        </button>

        <button
          onClick={() => setActiveTab('discover')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <DiscoverIcon active={activeTab === 'discover'} />
          <span style={{ fontSize: '11px', color: activeTab === 'discover' ? '#07C160' : '#181818', marginTop: '2px' }}>发现</span>
        </button>

        <button
          onClick={() => setActiveTab('me')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <MeIcon active={activeTab === 'me'} />
          <span style={{ fontSize: '11px', color: activeTab === 'me' ? '#07C160' : '#181818', marginTop: '2px' }}>我</span>
        </button>
      </div>

      {/* 编辑个人资料弹窗 */}
      {editProfileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditProfileOpen(false);
            }
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '340px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div style={{ fontSize: '17px', fontWeight: 600, color: '#000000', textAlign: 'center' }}>
              个人资料
            </div>

            {/* 头像预览 + 上传 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#888888', alignSelf: 'flex-start' }}>头像</span>
              <div
                onClick={() => editFileInputRef.current?.click()}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  background: editAvatarImage
                    ? 'transparent'
                    : `linear-gradient(135deg, ${editAvatarColor1}, ${editAvatarColor2})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '28px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  border: editAvatarImage ? '1px solid #e5e5e5' : 'none',
                  position: 'relative',
                }}
              >
                {editAvatarImage ? (
                  <img
                    src={editAvatarImage}
                    alt="头像"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  editNickname ? editNickname.charAt(0) : '我'
                )}
              </div>
              <input
                ref={editFileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 4 * 1024 * 1024) {
                    showToast('图片不能超过 4MB');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const result = ev.target?.result;
                    if (typeof result === 'string') {
                      setEditAvatarImage(result);
                    }
                  };
                  reader.readAsDataURL(file);
                  e.target.value = '';
                }}
              />
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => editFileInputRef.current?.click()}
                  style={{
                    padding: '6px 14px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    background: '#f0f0f0',
                    color: '#333333',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {editAvatarImage ? '更换图片' : '上传图片'}
                </button>
                {editAvatarImage && (
                  <button
                    onClick={() => setEditAvatarImage(null)}
                    style={{
                      padding: '6px 14px',
                      fontSize: '13px',
                      borderRadius: '6px',
                      background: '#f0f0f0',
                      color: '#333333',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    使用颜色
                  </button>
                )}
              </div>

              {/* 颜色选择 */}
              {!editAvatarImage && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  {[
                    ['#ff6b6b', '#ee5a6f'],
                    ['#4ecdc4', '#44a08d'],
                    ['#45b7d1', '#2193b0'],
                    ['#96c93d', '#7cb342'],
                    ['#f0932b', '#e17055'],
                    ['#6c5ce7', '#5f4b8b'],
                    ['#fd79a8', '#e84393'],
                    ['#00b894', '#00cec9'],
                    ['#e74c3c', '#c0392b'],
                    ['#1abc9c', '#16a085'],
                  ].map((pair, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setEditAvatarColor1(pair[0]);
                        setEditAvatarColor2(pair[1]);
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`,
                        border:
                          editAvatarColor1 === pair[0] && editAvatarColor2 === pair[1]
                            ? '2px solid #07C160'
                            : '2px solid transparent',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 昵称 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#888888' }}>昵称</span>
              <input
                type="text"
                value={editNickname}
                onChange={(e) => setEditNickname(e.target.value)}
                placeholder="请输入昵称"
                style={{
                  padding: '10px 12px',
                  fontSize: '15px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  outline: 'none',
                  background: '#f7f7f7',
                }}
              />
            </div>

            {/* 微信号 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#888888' }}>微信号</span>
              <input
                type="text"
                value={editWechatId}
                onChange={(e) => setEditWechatId(e.target.value)}
                placeholder="请输入微信号"
                style={{
                  padding: '10px 12px',
                  fontSize: '15px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  outline: 'none',
                  background: '#f7f7f7',
                }}
              />
            </div>

            {/* 余额 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#888888' }}>余额（元）</span>
              <input
                type="number"
                value={editBalance}
                onChange={(e) => setEditBalance(Number(e.target.value) || 0)}
                placeholder="请输入余额"
                min="0"
                style={{
                  padding: '10px 12px',
                  fontSize: '15px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  outline: 'none',
                  background: '#f7f7f7',
                }}
              />
            </div>

            {/* 按钮区 */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                onClick={() => setEditProfileOpen(false)}
                style={{
                  flex: 1,
                  padding: '11px 0',
                  borderRadius: '8px',
                  background: '#f0f0f0',
                  color: '#333333',
                  fontSize: '15px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
              <button
                onClick={() => {
                  const nickname = editNickname.trim();
                  const wechatId = editWechatId.trim();
                  if (!nickname) {
                    showToast('请输入昵称');
                    return;
                  }
                  if (!wechatId) {
                    showToast('请输入微信号');
                    return;
                  }
                  updateUserProfile({
                    nickname,
                    wechatId,
                    avatarColor1: editAvatarColor1,
                    avatarColor2: editAvatarColor2,
                    avatarImage: editAvatarImage || undefined,
                    balance: editBalance,
                  });
                  setEditProfileOpen(false);
                  showToast('已保存');
                }}
                style={{
                  flex: 1,
                  padding: '11px 0',
                  borderRadius: '8px',
                  background: '#07C160',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 自定义性格弹窗 */}
      {personaOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setPersonaOpen(false);
            }
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '340px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ fontSize: '17px', fontWeight: 600, color: '#000000', textAlign: 'center' }}>
              自定义性格
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#888888' }}>描述 TA 的性格/人设</span>
              <textarea
                value={personaText}
                onChange={(e) => setPersonaText(e.target.value)}
                placeholder="例如：你是一个活泼可爱的女孩子，说话带点俏皮，喜欢用表情符号..."
                rows={6}
                style={{
                  padding: '10px 12px',
                  fontSize: '15px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  outline: 'none',
                  background: '#f7f7f7',
                  resize: 'none',
                  lineHeight: 1.6,
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setPersonaOpen(false)}
                style={{
                  flex: 1,
                  padding: '11px 0',
                  borderRadius: '8px',
                  background: '#f0f0f0',
                  color: '#333333',
                  fontSize: '15px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
              <button
                onClick={handleSavePersona}
                style={{
                  flex: 1,
                  padding: '11px 0',
                  borderRadius: '8px',
                  background: '#07C160',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 回溯选项弹窗 */}
      {recallOpen && !recallMode && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setRecallOpen(false);
            }
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px 12px 0 0',
              width: '100%',
              maxWidth: '400px',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => {
                setRecallMode('select');
              }}
              style={{
                width: '100%',
                padding: '18px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid #f0f0f0',
                fontSize: '16px',
                color: '#333333',
                cursor: 'pointer',
              }}
            >
              选择聊天回溯
            </button>
            <button
              onClick={handleRecallStart}
              style={{
                width: '100%',
                padding: '18px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid #f0f0f0',
                fontSize: '16px',
                color: '#ff3b30',
                cursor: 'pointer',
              }}
            >
              清除记忆
            </button>
            <button
              onClick={() => setRecallOpen(false)}
              style={{
                width: '100%',
                padding: '18px 0',
                background: '#ffffff',
                border: 'none',
                fontSize: '16px',
                color: '#07C160',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 选择回溯点弹窗 */}
      {recallOpen && recallMode === 'select' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setRecallOpen(false);
            }
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '360px',
              maxHeight: '70vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0',
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
                textAlign: 'center',
              }}
            >
              选择回溯点
            </div>
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '8px 0',
              }}
            >
              {(() => {
                const msgs = currentConversation?.messages || [];
                // 每对"用户+AI"为一组，取最后一条AI消息作为回溯点
                const recallPoints: { msg: Message; label: string }[] = [];
                for (let i = 0; i < msgs.length; i++) {
                  if (msgs[i].role === 'assistant') {
                    // 找前一条用户消息作为描述
                    const prevUser = msgs[i - 1];
                    const label = prevUser
                      ? `回溯到: "${prevUser.content.slice(0, 20)}${prevUser.content.length > 20 ? '...' : ''}"`
                      : `回溯点 ${recallPoints.length + 1}`;
                    recallPoints.push({ msg: msgs[i], label });
                  }
                }
                // 倒序显示，最新的在前面
                return [...recallPoints].reverse().map(({ msg, label }) => (
                  <button
                    key={msg.id}
                    onClick={() => handleRecallToMessage(msg.id)}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid #f5f5f5',
                      fontSize: '14px',
                      color: '#333333',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <span style={{ color: '#888888', fontSize: '12px' }}>{label}</span>
                    <span style={{ color: '#555555' }}>
                      {msg.content.slice(0, 50)}{msg.content.length > 50 ? '...' : ''}
                    </span>
                  </button>
                ));
              })()}
            </div>
            <button
              onClick={() => {
                setRecallMode(null);
                setRecallOpen(false);
              }}
              style={{
                width: '100%',
                padding: '16px 0',
                background: '#ffffff',
                border: 'none',
                borderTop: '1px solid #f0f0f0',
                fontSize: '16px',
                color: '#07C160',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 创建新角色弹窗 */}
      {createProfileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setCreateProfileOpen(false);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '340px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div style={{ fontSize: '17px', fontWeight: 600, color: '#000000', textAlign: 'center' }}>
              创建新角色
            </div>

            {/* 名字输入 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#888888' }}>微信昵称</span>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="请输入昵称"
                autoFocus
                style={{
                  padding: '10px 12px',
                  fontSize: '15px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  outline: 'none',
                  background: '#f7f7f7',
                }}
              />
            </div>

            {/* 头像预览 + 图片上传 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#888888', alignSelf: 'flex-start' }}>头像</span>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  background: newProfileImage
                    ? 'transparent'
                    : `linear-gradient(135deg, ${newProfileColor}, ${newProfileColor2})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '28px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  border: newProfileImage ? '1px solid #e5e5e5' : 'none',
                }}
              >
                {newProfileImage ? (
                  <img
                    src={newProfileImage}
                    alt="头像"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <>
                    {newProfileName ? newProfileName.charAt(0) : '新'}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'rgba(0,0,0,0.45)',
                        color: '#ffffff',
                        fontSize: '11px',
                        padding: '4px 0',
                        textAlign: 'center',
                      }}
                    >
                      点击上传
                    </div>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 4 * 1024 * 1024) {
                    showToast('图片不能超过 4MB');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const result = ev.target?.result;
                    if (typeof result === 'string') {
                      setNewProfileImage(result);
                    }
                  };
                  reader.readAsDataURL(file);
                  e.target.value = '';
                }}
              />
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '6px 14px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    background: '#f0f0f0',
                    color: '#333333',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {newProfileImage ? '更换图片' : '从相册选择'}
                </button>
                {newProfileImage && (
                  <button
                    onClick={() => setNewProfileImage(null)}
                    style={{
                      padding: '6px 14px',
                      fontSize: '13px',
                      borderRadius: '6px',
                      background: '#f0f0f0',
                      color: '#333333',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    使用颜色
                  </button>
                )}
              </div>

              {/* 颜色选择（仅在未上传图片时展示） */}
              {!newProfileImage && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  {[
                    ['#ff6b6b', '#ee5a6f'],
                    ['#4ecdc4', '#44a08d'],
                    ['#45b7d1', '#2193b0'],
                    ['#96c93d', '#7cb342'],
                    ['#f0932b', '#e17055'],
                    ['#6c5ce7', '#5f4b8b'],
                    ['#fd79a8', '#e84393'],
                    ['#00b894', '#00cec9'],
                    ['#e74c3c', '#c0392b'],
                    ['#1abc9c', '#16a085'],
                  ].map((pair, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setNewProfileColor(pair[0]);
                        setNewProfileColor2(pair[1]);
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`,
                        border:
                          newProfileColor === pair[0] && newProfileColor2 === pair[1]
                            ? '2px solid #07C160'
                            : '2px solid transparent',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 按钮区 */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                onClick={() => setCreateProfileOpen(false)}
                style={{
                  flex: 1,
                  padding: '11px 0',
                  borderRadius: '8px',
                  background: '#f0f0f0',
                  color: '#333333',
                  fontSize: '15px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
              <button
                onClick={() => {
                  const name = newProfileName.trim();
                  if (!name) {
                    showToast('请输入昵称');
                    return;
                  }
                  createConversationWithProfile({
                    title: name,
                    avatarColor: newProfileColor,
                    avatarColor2: newProfileColor2,
                    avatarImage: newProfileImage || undefined,
                  });
                  setCreateProfileOpen(false);
                  setShowChat(true);
                }}
                style={{
                  flex: 1,
                  padding: '11px 0',
                  borderRadius: '8px',
                  background: '#07C160',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 朋友圈页面 */}
      {momentsOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#ededed',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* 顶部栏 */}
          <div
            style={{
              height: '44px',
              background: '#f7f7f7',
              borderBottom: '1px solid #e5e5e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              flexShrink: 0,
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <button
              onClick={() => setMomentsOpen(false)}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#000000',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div style={{ fontWeight: 500, fontSize: '17px', color: '#000000' }}>朋友圈</div>
            <button
              onClick={() => showToast('发布功能开发中...')}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#000000',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
          </div>

          {/* 顶部封面区 */}
          <div
            style={{
              background: 'linear-gradient(180deg, #3a4d6b 0%, #5a6d8b 100%)',
              height: '280px',
              position: 'relative',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                gap: '12px',
                color: '#ffffff',
                marginBottom: '12px',
              }}
            >
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '17px', fontWeight: 600 }}>{userProfile.nickname || '我'}</div>
                <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '4px' }}>微信号：{userProfile.wechatId || '-'}</div>
                <div style={{ fontSize: '13px', color: '#07C160', marginTop: '4px' }}>
                  余额：¥{userProfile.balance}
                </div>
              </div>
              {userProfile.avatarImage ? (
                <img
                  src={userProfile.avatarImage}
                  alt="avatar"
                  style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${userProfile.avatarColor1 || '#4ecdc4'}, ${userProfile.avatarColor2 || '#44a08d'})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '22px',
                    fontWeight: 600,
                  }}
                >
                  {(userProfile.nickname || '我').charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* 朋友圈内容列表 */}
          <div style={{ background: '#ffffff' }}>
            {(() => {
              // 从现有会话中提取好友作为发朋友圈的人
              const friends = conversations.filter(
                (c) => c.title && c.title.trim().length > 0 && c.title !== '新对话'
              );

              // 预设的一些朋友圈内容模板
              const momentContents = [
                { text: '今天天气不错，出去走走。', time: '刚刚' },
                { text: '周末在家看了一本好书，推荐给大家。', time: '1小时前' },
                { text: '刚吃了一顿很好吃的饭，幸福就是这么简单。', time: '3小时前' },
                { text: '最近工作有点忙，但还是要保持好心情。', time: '昨天' },
                { text: '去看了场电影，还不错。', time: '昨天' },
                { text: '和朋友聚了聚，聊得很开心。', time: '2天前' },
                { text: '早起的一天，感觉效率很高。', time: '2天前' },
                { text: '今天的晚霞真美。', time: '3天前' },
              ];

              // 生成朋友圈列表：从预设内容和朋友中随机组合，最多显示 6 条
              const momentsToShow: { name: string; avatarColor1?: string; avatarColor2?: string; avatarImage?: string; text: string; time: string }[] = [];
              const numFriends = friends.length;
              if (numFriends === 0) {
                // 没有朋友，显示一个通用的提示
                momentsToShow.push({
                  name: '芋',
                  text: '今天和朋友聊了聊天，感觉心情好了很多。',
                  time: '刚刚',
                });
              } else {
                const displayCount = Math.min(Math.max(numFriends, 4), 6);
                for (let i = 0; i < displayCount; i++) {
                  const friend = friends[i % numFriends];
                  const content = momentContents[i % momentContents.length];
                  momentsToShow.push({
                    name: friend.title,
                    avatarColor1: friend.avatarColor,
                    avatarColor2: friend.avatarColor2,
                    avatarImage: friend.avatarImage,
                    text: content.text,
                    time: content.time,
                  });
                }
              }

              return momentsToShow.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '16px 14px',
                    borderBottom: idx !== momentsToShow.length - 1 ? '1px solid #f0f0f0' : 'none',
                  }}
                >
                  {/* 头像 */}
                  {m.avatarImage ? (
                    <img
                      src={m.avatarImage}
                      alt={m.name}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '6px',
                        flexShrink: 0,
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '6px',
                        flexShrink: 0,
                        background: `linear-gradient(135deg, ${m.avatarColor1 || '#45b7d1'}, ${m.avatarColor2 || '#2193b0'})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '15px',
                        fontWeight: 500,
                      }}
                    >
                      {m.name.charAt(0)}
                    </div>
                  )}

                  {/* 内容区 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#576b95', fontSize: '15px', fontWeight: 500, marginBottom: '6px' }}>
                      {m.name}
                    </div>
                    <div style={{ fontSize: '15px', color: '#000000', lineHeight: 1.5 }}>
                      {m.text}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '10px',
                      }}
                    >
                      <span style={{ fontSize: '13px', color: '#999999' }}>{m.time}</span>
                      <button
                        onClick={() => showToast('互动功能开发中...')}
                        style={{
                          background: '#f7f7f7',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 10px',
                          fontSize: '12px',
                          color: '#576b95',
                          cursor: 'pointer',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }}>
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 2C6 2 2 7 2 12s4 10 10 10 10-5 10-10-4-10-10-10z" />
                        </svg>
                        评论
                      </button>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>

          {/* 底部留白 */}
          <div style={{ height: '40px', background: '#ededed' }} />
        </div>
      )}


      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};
