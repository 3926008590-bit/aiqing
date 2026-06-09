import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  avatarColor?: string; // 自定义头像颜色（hex，如 '#ff6b6b'）
  avatarColor2?: string; // 自定义头像第二个颜色（渐变用）
  avatarImage?: string; // 自定义图片头像（base64 dataURL）
  persona?: string; // 自定义性格/人设
}

export interface UserProfile {
  nickname: string;
  wechatId: string;
  balance: number; // 余额
  avatarColor1?: string;
  avatarColor2?: string;
  avatarImage?: string; // base64 dataURL
}

interface ChatState {
  apiKey: string;
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  streamingContent: string;
  userProfile: UserProfile;

  setApiKey: (key: string) => void;
  getApiKey: () => string;
  createConversation: () => Conversation;
  createConversationWithProfile: (profile: { title: string; avatarColor?: string; avatarColor2?: string; avatarImage?: string }) => Conversation;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => Message;
  updateStreamingContent: (content: string) => void;
  clearStreamingContent: () => void;
  setLoading: (loading: boolean) => void;
  clearCurrentConversation: () => void;
  updateConversationTitle: (id: string, title: string, persona?: string) => void;
  deleteMessage: (messageId: string) => void;
  getLastUserMessage: () => Message | null;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateBalance: (balance: number) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const getInitialConversations = (): Conversation[] => {
  const saved = localStorage.getItem('conversations');
  let conversations: Conversation[] = [];
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        conversations = parsed;
      }
    } catch {
      // ignore
    }
  }
  // 确保好友“芋”的会话存在
  const hasYu = conversations.some((c) => c.title === '芋');
  if (!hasYu) {
    const yuConversation: Conversation = {
      id: generateId(),
      title: '芋',
      messages: [],
      createdAt: Date.now(),
      avatarImage: undefined,
    };
    conversations = [yuConversation, ...conversations];
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }
  return conversations;
};

export const useChatStore = create<ChatState>((set, get) => ({
  apiKey: localStorage.getItem('deepseek_api_key') || '',
  conversations: getInitialConversations(),
  currentConversationId: null,
  isLoading: false,
  streamingContent: '',
  userProfile: (() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      nickname: '芋',
      wechatId: 'i7Y0417',
      balance: 5200,
      avatarColor1: '#4ecdc4',
      avatarColor2: '#44a08d',
      avatarImage: undefined,
    };
  })(),

  setApiKey: (key: string) => {
    localStorage.setItem('deepseek_api_key', key);
    set({ apiKey: key });
  },

  getApiKey: () => get().apiKey,

  createConversation: () => {
    const conversation: Conversation = {
      id: generateId(),
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
    };
    set((state) => ({
      conversations: [conversation, ...state.conversations],
      currentConversationId: conversation.id,
    }));
    localStorage.setItem('conversations', JSON.stringify([conversation, ...get().conversations]));
    return conversation;
  },

  createConversationWithProfile: (profile) => {
    const conversation: Conversation = {
      id: generateId(),
      title: profile.title || '新对话',
      messages: [],
      createdAt: Date.now(),
      avatarColor: profile.avatarColor,
      avatarColor2: profile.avatarColor2,
      avatarImage: profile.avatarImage,
    };
    set((state) => ({
      conversations: [conversation, ...state.conversations],
      currentConversationId: conversation.id,
    }));
    localStorage.setItem('conversations', JSON.stringify([conversation, ...get().conversations]));
    return conversation;
  },

  selectConversation: (id: string) => {
    set({ currentConversationId: id || null, streamingContent: '' });
  },

  deleteConversation: (id: string) => {
    set((state) => {
      const updated = state.conversations.filter((c) => c.id !== id);
      localStorage.setItem('conversations', JSON.stringify(updated));
      return {
        conversations: updated,
        currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
      };
    });
  },

  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: generateId(),
      createdAt: Date.now(),
    };
    set((state) => {
      if (!state.currentConversationId) return state;
      const updated = state.conversations.map((c) =>
        c.id === state.currentConversationId
          ? { ...c, messages: [...c.messages, newMessage] }
          : c
      );
      localStorage.setItem('conversations', JSON.stringify(updated));
      return { conversations: updated };
    });
    return newMessage;
  },

  updateStreamingContent: (content: string) => {
    set({ streamingContent: content });
  },

  clearStreamingContent: () => {
    set({ streamingContent: '' });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  clearCurrentConversation: () => {
    set((state) => {
      if (!state.currentConversationId) return state;
      const updated = state.conversations.map((c) =>
        c.id === state.currentConversationId
          ? { ...c, messages: [] }
          : c
      );
      localStorage.setItem('conversations', JSON.stringify(updated));
      return { conversations: updated };
    });
  },

  updateConversationTitle: (id: string, title: string, persona?: string) => {
    set((state) => {
      const updated = state.conversations.map((c) =>
        c.id === id ? { ...c, title, ...(persona !== undefined ? { persona } : {}) } : c
      );
      localStorage.setItem('conversations', JSON.stringify(updated));
      return { conversations: updated };
    });
  },

  deleteMessage: (messageId: string) => {
    set((state) => {
      if (!state.currentConversationId) return state;
      const updated = state.conversations.map((c) =>
        c.id === state.currentConversationId
          ? { ...c, messages: c.messages.filter((m) => m.id !== messageId) }
          : c
      );
      localStorage.setItem('conversations', JSON.stringify(updated));
      return { conversations: updated };
    });
  },

  getLastUserMessage: () => {
    const state = get();
    if (!state.currentConversationId) return null;
    const conversation = state.conversations.find((c) => c.id === state.currentConversationId);
    if (!conversation) return null;
    const userMessages = conversation.messages.filter((m) => m.role === 'user');
    return userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;
  },

  updateUserProfile: (profile) => {
    set((state) => {
      const updated = { ...state.userProfile, ...profile };
      localStorage.setItem('user_profile', JSON.stringify(updated));
      return { userProfile: updated };
    });
  },

  updateBalance: (balance: number) => {
    set((state) => {
      const updated = { ...state.userProfile, balance };
      localStorage.setItem('user_profile', JSON.stringify(updated));
      return { userProfile: updated };
    });
  },
}));
