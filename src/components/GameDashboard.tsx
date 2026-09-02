import React, { useEffect } from 'react';
import { useGameStore } from '@/lib/gameStore';

export const GameDashboard: React.FC = () => {
  const { user, templates, initializeTemplates, updateStreak } = useGameStore();

  useEffect(() => {
    initializeTemplates();
    updateStreak();
  }, []);

  const categories = ['jungle', 'space', 'underwater', 'fantasy'] as const;
  const unlockedDrawings = templates.filter(t => t.unlocked).length;
  const completedDrawings = templates.filter(t => t.completed).length;

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 rounded-lg overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 shadow-lg z-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-bold">🎨 ColorQuest</h1>
            <p className="text-purple-200">Creative Adventure for Kids</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">⭐ Level {user.level}</p>
            <p className="text-purple-200">Next: {(5 - (user.completedDrawings.length % 5)) || 5} drawings</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm text-purple-200">Total Coins</p>
            <p className="text-2xl font-bold">💰 {user.totalCoins}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm text-purple-200">Today's Coins</p>
            <p className="text-2xl font-bold">🟡 {user.dailyCoins}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm text-purple-200">Streak</p>
            <p className="text-2xl font-bold">🔥 {user.streak}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm text-purple-200">Completed</p>
            <p className="text-2xl font-bold">✅ {completedDrawings}/{templates.length}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-purple-800">📈 Progress to Level {user.level + 1}</h3>
            <p className="text-sm text-purple-600">{completedDrawings % 5}/5</p>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${((completedDrawings % 5) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Game Modes */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-lg p-4 hover:shadow-lg transition-all">
            <p className="text-2xl mb-2">😌 Relax Mode</p>
            <p className="text-sm">Draw at your own pace</p>
          </button>
          <button className="bg-gradient-to-br from-red-400 to-red-600 text-white rounded-lg p-4 hover:shadow-lg transition-all">
            <p className="text-2xl mb-2">⚡ Challenge Mode</p>
            <p className="text-sm">Speed coloring with bonus coins!</p>
          </button>
        </div>

        {/* World Map Sections */}
        {categories.map((category) => {
          const categoryTemplates = templates.filter(t => t.category === category);
          const categoryCompleted = categoryTemplates.filter(t => t.completed).length;
          const isUnlocked = categoryTemplates.some(t => t.unlocked);

          const categoryEmojis: Record<typeof category, string> = {
            jungle: '🌴',
            space: '🚀',
            underwater: '🌊',
            fantasy: '✨'
          };

          const categoryNames: Record<typeof category, string> = {
            jungle: 'Jungle Kingdom',
            space: 'Space Adventure',
            underwater: 'Underwater World',
            fantasy: 'Fantasy Realm'
          };

          return (
            <div key={category} className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-purple-800">
                  {categoryEmojis[category]} {categoryNames[category]}
                </h3>
                <p className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                  {categoryCompleted}/{categoryTemplates.length}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`rounded-lg overflow-hidden shadow-lg transition-all hover:scale-105 cursor-pointer ${
                      template.unlocked
                        ? 'bg-white'
                        : 'bg-gray-300 opacity-60'
                    }`}
                  >
                    {/* Card Content */}
                    <div className="aspect-square flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 to-blue-200 p-4">
                      <p className="text-5xl mb-2">{template.image}</p>
                      <p className="text-sm font-bold text-center text-purple-800">
                        {template.name}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="p-3 bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-600">
                          {template.difficulty === 'easy' && '⭐ Easy'}
                          {template.difficulty === 'medium' && '⭐⭐ Medium'}
                          {template.difficulty === 'hard' && '⭐⭐⭐ Hard'}
                        </p>
                        <p className="font-bold text-green-600">💰 {template.reward}</p>
                      </div>

                      {template.unlocked ? (
                        <button
                          className={`w-full py-2 rounded-lg font-bold text-white transition-all ${
                            template.completed
                              ? 'bg-gray-400 cursor-default'
                              : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg'
                          }`}
                          disabled={template.completed}
                        >
                          {template.completed ? '✅ Done' : '🎨 Draw'}
                        </button>
                      ) : (
                        <button
                          className="w-full py-2 rounded-lg font-bold text-white bg-gray-400 cursor-not-allowed"
                          disabled
                        >
                          🔒 Locked
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
