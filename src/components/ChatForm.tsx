import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatFormProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export function ChatForm({ onSendMessage, disabled }: ChatFormProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about gold prices, forex pairs, market trends..."
        className="flex-1 px-4 sm:px-5 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-300 text-sm sm:text-base"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 sm:px-6 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center gap-2 shadow-lg disabled:shadow-none text-sm sm:text-base whitespace-nowrap"
      >
        <Send className="w-3 sm:w-4 h-3 sm:h-4" />
        <span className="hidden sm:inline">Send</span>
        <span className="sm:hidden">Send</span>
      </button>
    </form>
  );
}