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
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-3">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about gold prices, forex pairs, market trends..."
        className="flex-1 px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-300 text-base min-h-[48px]"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center gap-2 shadow-lg disabled:shadow-none text-base whitespace-nowrap min-h-[48px]"
      >
        <Send className="w-3 sm:w-4 h-3 sm:h-4" />
        <span>Send</span>
      </button>
    </form>
  );
}