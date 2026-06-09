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
  avatarColor?: string;
  avatarColor2?: string;
  avatarImage?: string;
  persona?: string;
}

export interface MomentComment {
  id: string;
  author: string; // 评论者昵称
  content: string;
  createdAt: number;
  isUser?: boolean; // 是否是用户评论
  replyTo?: string; // 回复谁的名字
}

export interface MomentPost {
  id: string;
  author: string; // 发布者昵称
  authorAvatar?: string;
  authorAvatarColor?: string;
  authorAvatarColor2?: string;
  content: string;
  createdAt: number;
  likes: string[]; // 点赞的人的名字
  comments: MomentComment[];
  isAIAuthor?: boolean; // 是否是当前AI发的
}

export interface UserProfile {
  nickname: string;
  wechatId: string;
  balance: number;
  avatarColor1?: string;
  avatarColor2?: string;
  avatarImage?: string;
}

interface ChatState {
  apiKey: string;
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  streamingContent: string;
  userProfile: UserProfile;
  moments: MomentPost[];
  aiName: string; // 当前AI的名字（当前对话对象的名字）

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
  addMoment: (post: Omit<MomentPost, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
  likeMoment: (momentId: string, userName: string) => void;
  unlikeMoment: (momentId: string, userName: string) => void;
  commentMoment: (momentId: string, comment: Omit<MomentComment, 'id' | 'createdAt'>) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const getInitialMoments = (): MomentPost[] => {
  const saved = localStorage.getItem('moments');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  // 默认几条朋友圈
  const now = Date.now();
  return [
    {
      id: generateId(),
      author: '芋',
      content: '今天天气真好，出来走走～',
      createdAt: now - 1000 * 60 * 60 * 2,
      likes: ['小敏', '阿杰'],
      comments: [
        { id: generateId(), author: '小敏', content: '是呀！', createdAt: now - 1000 * 60 * 60 },
      ],
      isAIAuthor: true,
    },
    {
      id: generateId(),
      author: '芋',
      content: '最近在追一部剧，好好看～',
      createdAt: now - 1000 * 60 * 60 * 24,
      likes: ['阿杰'],
      comments: [],
      isAIAuthor: true,
    },
  ];
};

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
  moments: getInitialMoments(),
  aiName: '芋',
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
      aiName: conversation.title,
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
      aiName: conversation.title,
    }));
    localStorage.setItem('conversations', JSON.stringify([conversation, ...get().conversations]));
    return conversation;
  },

  selectConversation: (id: string) => {
    const conv = get().conversations.find((c) => c.id === id);
    set({ currentConversationId: id || null, streamingContent: '', aiName: conv?.title || '芋' });
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
      return {
        conversations: updated,
        ...(state.currentConversationId === id ? { aiName: title } : {}),
      };
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

  addMoment: (post) => {
    const newPost: MomentPost = {
      ...post,
      id: generateId(),
      createdAt: Date.now(),
      likes: [],
      comments: [],
    };
    set((state) => {
      const updated = [newPost, ...state.moments];
      localStorage.setItem('moments', JSON.stringify(updated));
      return { moments: updated };
    });
  },

  likeMoment: (momentId: string, userName: string) => {
    set((state) => {
      const updated = state.moments.map((m) => {
        if (m.id !== momentId) return m;
        if (m.likes.includes(userName)) return m;
        return { ...m, likes: [...m.likes, userName] };
      });
      localStorage.setItem('moments', JSON.stringify(updated));
      return { moments: updated };
    });
  },

  unlikeMoment: (momentId: string, userName: string) => {
    set((state) => {
      const updated = state.moments.map((m) => {
        if (m.id !== momentId) return m;
        return { ...m, likes: m.likes.filter((n) => n !== userName) };
      });
      localStorage.setItem('moments', JSON.stringify(updated));
      return { moments: updated };
    });
  },

  commentMoment: (momentId: string, comment) => {
    const newComment: MomentComment = {
      ...comment,
      id: generateId(),
      createdAt: Date.now(),
    };
    set((state) => {
      const updated = state.moments.map((m) => {
        if (m.id !== momentId) return m;
        return { ...m, comments: [...m.comments, newComment] };
      });
      localStorage.setItem('moments', JSON.stringify(updated));
      return { moments: updated };
    });
  },
}));
