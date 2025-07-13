import React from 'react';

interface HeaderProps {
  email: string | null;
  onPremiumClick: () => void;
}

export function Header({ email, onPremiumClick }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white p-4 sm:p-6 shadow-xl">
      <div className="flex flex-col mb-3 sm:mb-0">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 tracking-wide">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBH31aoPyY7d9q3hMhZiV1rTr3mhfAY5OtIg&s" alt="ForexBot Logo" className="w-7 h-7 rounded-full object-cover" />
          ForexBot
        </h1>
        <p className="text-xs sm:text-sm opacity-90 font-medium">Multi-Agent AI for Gold & Forex Analysis</p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <span className="text-xs sm:text-sm opacity-95 bg-white/10 px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm truncate max-w-full sm:max-w-none">
          {email ? `ID: ${email.length > 20 ? email.substring(0, 20) + '...' : email}` : "No Chat ID set"}
        </span>
        <button
          onClick={onPremiumClick}
          className="bg-white/20 hover:bg-white/30 px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm border border-white/20 whitespace-nowrap"
        >
          Have Premium?
        </button>
      </div>
    </header>
  );
}