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
      className="min-h-[200px] sm:min-h-[250px] tablet:min-h-[300px] max-h-[300px] sm:max-h-[400px] tablet:max-h-[450px] overflow-y-auto bg-gradient-to-b from-gray-50 to-blue-50/30 rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 shadow-inner border border-gray-100 scrollbar-thin"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm sm:text-base">
          <MessageCircle className="w-8 sm:w-10 tablet:w-12 h-8 sm:h-10 tablet:h-12 mb-3 opacity-50" />
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