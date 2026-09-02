import { create } from 'zustand';

export interface DrawingTemplate {
  id: string;
  name: string;
  category: 'animals' | 'space' | 'underwater' | 'jungle' | 'fantasy';
  difficulty: 'easy' | 'medium' | 'hard';
  image: string;
  reward: number;
  unlocked: boolean;
  completed: boolean;
  animationId?: string;
}

export interface UnlockedItem {
  id: string;
  type: 'brush' | 'color' | 'sticker' | 'stamp';
  name: string;
  icon: string;
}

export interface UserProgress {
  level: number;
  totalCoins: number;
  dailyCoins: number;
  streak: number;
  lastActiveDate: string;
  completedDrawings: string[];
  unlockedItems: UnlockedItem[];
}

export interface GameState {
  user: UserProgress;
  templates: DrawingTemplate[];
  currentDrawing: string | null;
  gameMode: 'relax' | 'challenge';
  selectedBrush: string;
  selectedColor: string;
  
  // Actions
  addCoins: (amount: number) => void;
  completeDrawing: (templateId: string) => void;
  unlockItem: (item: UnlockedItem) => void;
  selectBrush: (brushId: string) => void;
  selectColor: (color: string) => void;
  setGameMode: (mode: 'relax' | 'challenge') => void;
  updateStreak: () => void;
  initializeTemplates: () => void;
  getCurrentTemplate: () => DrawingTemplate | null;
}

export const useGameStore = create<GameState>((set, get) => ({
  user: {
    level: 1,
    totalCoins: 0,
    dailyCoins: 0,
    streak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedDrawings: [],
    unlockedItems: [
      {
        id: 'brush-basic',
        type: 'brush',
        name: 'Basic Brush',
        icon: '🖌️',
      },
      {
        id: 'color-red',
        type: 'color',
        name: 'Red',
        icon: '🔴',
      },
      {
        id: 'color-blue',
        type: 'color',
        name: 'Blue',
        icon: '🔵',
      },
      {
        id: 'color-yellow',
        type: 'color',
        name: 'Yellow',
        icon: '🟡',
      },
    ],
  },
  templates: [],
  currentDrawing: null,
  gameMode: 'relax',
  selectedBrush: 'brush-basic',
  selectedColor: '#FF0000',

  addCoins: (amount: number) =>
    set((state) => ({
      user: {
        ...state.user,
        totalCoins: state.user.totalCoins + amount,
        dailyCoins: state.user.dailyCoins + amount,
      },
    })),

  completeDrawing: (templateId: string) =>
    set((state) => ({
      user: {
        ...state.user,
        completedDrawings: [...state.user.completedDrawings, templateId],
        level: Math.floor(state.user.completedDrawings.length / 5) + 1,
      },
      templates: state.templates.map((t) =>
        t.id === templateId ? { ...t, completed: true } : t
      ),
    })),

  unlockItem: (item: UnlockedItem) =>
    set((state) => ({
      user: {
        ...state.user,
        unlockedItems: [...state.user.unlockedItems, item],
      },
    })),

  selectBrush: (brushId: string) =>
    set({ selectedBrush: brushId }),

  selectColor: (color: string) =>
    set({ selectedColor: color }),

  setGameMode: (mode: 'relax' | 'challenge') =>
    set({ gameMode: mode }),

  updateStreak: () =>
    set((state) => {
      const today = new Date().toISOString().split('T')[0];
      const lastDate = state.user.lastActiveDate;
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split('T')[0];

      let newStreak = state.user.streak;
      if (lastDate === yesterday) {
        newStreak += 1;
      } else if (lastDate !== today) {
        newStreak = 1;
      }

      return {
        user: {
          ...state.user,
          streak: newStreak,
          lastActiveDate: today,
        },
      };
    }),

  initializeTemplates: () =>
    set(() => ({
      templates: [
        // Jungle Templates
        {
          id: 'jungle-lion',
          name: 'Lion King',
          category: 'jungle',
          difficulty: 'easy',
          image: '🦁',
          reward: 10,
          unlocked: true,
          completed: false,
          animationId: 'lion-walk',
        },
        {
          id: 'jungle-tiger',
          name: 'Tiger Stripes',
          category: 'jungle',
          difficulty: 'medium',
          image: '🐯',
          reward: 20,
          unlocked: true,
          completed: false,
          animationId: 'tiger-roar',
        },
        {
          id: 'jungle-monkey',
          name: 'Playful Monkey',
          category: 'jungle',
          difficulty: 'easy',
          image: '🐵',
          reward: 10,
          unlocked: true,
          completed: false,
          animationId: 'monkey-jump',
        },

        // Space Templates
        {
          id: 'space-rocket',
          name: 'Rocket to Moon',
          category: 'space',
          difficulty: 'medium',
          image: '🚀',
          reward: 25,
          unlocked: false,
          completed: false,
          animationId: 'rocket-fly',
        },
        {
          id: 'space-alien',
          name: 'Friendly Alien',
          category: 'space',
          difficulty: 'hard',
          image: '👽',
          reward: 30,
          unlocked: false,
          completed: false,
          animationId: 'alien-dance',
        },
        {
          id: 'space-ufo',
          name: 'Flying UFO',
          category: 'space',
          difficulty: 'medium',
          image: '🛸',
          reward: 25,
          unlocked: false,
          completed: false,
          animationId: 'ufo-fly',
        },

        // Underwater Templates
        {
          id: 'underwater-fish',
          name: 'Rainbow Fish',
          category: 'underwater',
          difficulty: 'easy',
          image: '🐠',
          reward: 15,
          unlocked: false,
          completed: false,
          animationId: 'fish-swim',
        },
        {
          id: 'underwater-whale',
          name: 'Friendly Whale',
          category: 'underwater',
          difficulty: 'hard',
          image: '🐋',
          reward: 35,
          unlocked: false,
          completed: false,
          animationId: 'whale-swim',
        },
        {
          id: 'underwater-octopus',
          name: 'Octopus Dance',
          category: 'underwater',
          difficulty: 'medium',
          image: '🐙',
          reward: 20,
          unlocked: false,
          completed: false,
          animationId: 'octopus-dance',
        },

        // Fantasy Templates
        {
          id: 'fantasy-dragon',
          name: 'Magic Dragon',
          category: 'fantasy',
          difficulty: 'hard',
          image: '🐉',
          reward: 40,
          unlocked: false,
          completed: false,
          animationId: 'dragon-fly',
        },
        {
          id: 'fantasy-unicorn',
          name: 'Sparkle Unicorn',
          category: 'fantasy',
          difficulty: 'medium',
          image: '🦄',
          reward: 25,
          unlocked: false,
          completed: false,
          animationId: 'unicorn-prance',
        },
        {
          id: 'fantasy-phoenix',
          name: 'Fire Phoenix',
          category: 'fantasy',
          difficulty: 'hard',
          image: '🔥🦅',
          reward: 35,
          unlocked: false,
          completed: false,
          animationId: 'phoenix-fly',
        },
      ],
    })),

  getCurrentTemplate: () => {
    const state = get();
    if (!state.currentDrawing) return null;
    return state.templates.find((t) => t.id === state.currentDrawing) || null;
  },
}));
