import React from 'react';

interface HeaderProps {
  email: string | null;
  onPremiumClick: () => void;
}

export function Header({ email, onPremiumClick }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row tablet:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white p-4 sm:p-6 tablet:p-8 shadow-xl">
      <div className="flex flex-col mb-3 sm:mb-0">
        <h1 className="text-xl sm:text-2xl tablet:text-3xl font-bold flex items-center gap-2 sm:gap-3 tracking-wide">
          <img src="/logo.jpg" alt="ForexBot Logo" className="w-8 h-8 sm:w-9 sm:h-9 tablet:w-10 tablet:h-10 rounded-full object-cover shadow-lg" />
          ForexBot
        </h1>
        <p className="text-sm sm:text-base tablet:text-lg opacity-90 font-medium">Multi-Agent AI for Gold & Forex Analysis</p>
      </div>
      <div className="flex flex-col sm:flex-row tablet:flex-row items-start sm:items-center gap-3 sm:gap-4 tablet:gap-5 w-full sm:w-auto">
        <span className="text-sm sm:text-base opacity-95 bg-white/10 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm truncate max-w-full sm:max-w-none">
          {email ? `ID: ${email.length > 20 ? email.substring(0, 20) + '...' : email}` : "No Chat ID set"}
        </span>
        <button
          onClick={onPremiumClick}
          className="bg-white/20 hover:bg-white/30 px-4 sm:px-6 tablet:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm border border-white/20 whitespace-nowrap min-h-[48px] flex items-center justify-center"
        >
          Have Premium?
        </button>
      </div>
    </header>
  );
}