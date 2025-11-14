
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatLayout from '@/components/chat/chat-layout';
import SelectRecipient from '@/components/chat/select-recipient';
import type { Message } from '@/lib/types';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';

export default function ChatPage() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipient, setRecipient] = useState<{ username: string; uid: string } | null>(null);

  // Fetch current user's profile
  const userDocRef = useMemoFirebase(() => {
    return user ? doc(firestore, 'users', user.uid) : null;
  }, [user, firestore]);
  const { data: userData } = useDoc<{ username: string }>(userDocRef);
  const currentUserUsername = userData?.username;

  const handleSendMessage = (content: string) => {
    // This will be implemented later
    console.log("Sending message:", content);
  };

  const handleRecipientSelect = (username: string) => {
    // In a real app, you'd look up the user's UID from their username.
    // For now, we'll just set the username and a placeholder UID.
    console.log(`Attempting to start chat with ${username}`);
    // This part will be expanded later to verify the user exists.
    setRecipient({ username, uid: 'placeholder-uid' });
  };

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/signup');
    }
  }, [user, isUserLoading]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // If a recipient has not been selected, show the selection screen
  if (!recipient) {
    return <SelectRecipient onRecipientSelect={handleRecipientSelect} currentUserUsername={currentUserUsername || user.email || 'You'} />;
  }

  // Once a recipient is selected, show the chat layout
  return (
    <ChatLayout
      messages={messages}
      onSendMessage={handleSendMessage}
      recipientUsername={recipient.username}
      currentUserUsername={currentUserUsername}
    />
  );
}
