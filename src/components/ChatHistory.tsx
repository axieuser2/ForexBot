import React, { useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatHistoryProps {
  messages: ChatMessageType[];
}

export function ChatHistory({ messages }: ChatHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="min-h-[150px] sm:min-h-[200px] max-h-[250px] sm:max-h-[350px] overflow-y-auto bg-gradient-to-b from-gray-50 to-blue-50/30 rounded-xl p-3 sm:p-4 mb-4 shadow-inner border border-gray-100 scrollbar-thin"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 text-xs sm:text-sm">
          <MessageCircle className="w-6 sm:w-8 h-6 sm:h-8 mb-2 opacity-50" />
          <span className="text-center px-2">Start a conversation...</span>
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))
      )}
    </div>
  );
}