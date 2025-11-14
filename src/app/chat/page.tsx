
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatLayout from '@/components/chat/chat-layout';
import type { Message } from '@/lib/types';
import { useAuth } from '@/firebase';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handleSendMessage = (content: string) => {
    // This will be implemented later
    console.log("Sending message:", content);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signup');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <ChatLayout messages={messages} onSendMessage={handleSendMessage} />;
}
