'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/firebase/config';
import SelectRecipient from '@/components/chat/select-recipient';
import ChatLayout from '@/components/chat/chat-layout';

interface Recipient {
  username: string;
}

export default function ChatPage() {
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };
    getSession();
  }, []);

  const handleRecipientSelect = async (username: string) => {
    setRecipient({ username });
  };

  const handleSendMessage = async (content: string) => {
    if (!recipient || !user) {
      console.error('Missing recipient or user');
      return;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: user.id,
            sender_username: user.user_metadata?.username || user.email,
            recipient_username: recipient.username,
            content: content,
            created_at: new Date().toISOString(),
            read: false,
          },
        ]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!recipient) {
    return <SelectRecipient onSelect={handleRecipientSelect} />;
  }

  return (
    <ChatLayout
      recipient={recipient}
      onSendMessage={handleSendMessage}
      onBackClick={() => setRecipient(null)}
    />
  );
}