"use client";

import { useState } from 'react';
import ChatLayout from '@/components/chat/chat-layout';
import type { Message } from '@/lib/types';
import { useAuth } from '@/firebase'; // Assuming useAuth hook is available

export default function ChatPage() {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handleSendMessage = (content: string) => {
    // This will be implemented later
    console.log("Sending message:", content);
  };

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!user) {
    // This is a fallback, ideally middleware should handle this
    // For now, we can show a message or redirect
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  return <ChatLayout messages={messages} onSendMessage={handleSendMessage} />;
}
