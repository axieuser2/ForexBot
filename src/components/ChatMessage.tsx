import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4`}>
      <div
        className={`max-w-[85%] sm:max-w-[80%] tablet:max-w-[75%] px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md'
            : 'bg-gradient-to-r from-white to-blue-50 text-gray-800 rounded-bl-md border border-blue-100'
        }`}
      >
        <p className="text-sm sm:text-base leading-relaxed break-words font-medium">{message.text}</p>
      </div>
    </div>
  );
}