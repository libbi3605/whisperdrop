"use client";

import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/types';
import ChatHeader from './chat-header';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';

interface ChatLayoutProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export default function ChatLayout({ messages, onSendMessage }: ChatLayoutProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      // Use setTimeout to ensure DOM has updated before scrolling
      setTimeout(() => {
        if(scrollAreaRef.current) {
          scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      <ChatHeader />
      <main ref={scrollAreaRef} className="flex-grow overflow-y-auto p-4 md:p-6">
        <ChatMessages messages={messages} />
      </main>
      <div className="p-4 md:p-6 border-t bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={onSendMessage} />
        </div>
      </div>
    </div>
  );
}
