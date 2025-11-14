
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ChatLayout from '@/components/chat/chat-layout';
import SelectRecipient from '@/components/chat/select-recipient';
import type { Message, MessageFromDb } from '@/lib/types';
import { useUser, useMemoFirebase, useCollection, useDoc } from '@/firebase';
import { doc, collection, query, where, serverTimestamp, orderBy, addDoc, or } from 'firebase/firestore';
import { useFirebase } from '@/firebase';

export default function ChatPage() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();

  const [recipient, setRecipient] = useState<{ username: string; uid: string } | null>(null);
  const [recipientError, setRecipientError] = useState<string | null>(null);

  // Fetch current user's profile
  const userDocRef = useMemoFirebase(() => {
    return user ? doc(firestore, 'users', user.uid) : null;
  }, [user, firestore]);
  const { data: userData } = useDoc<{ username: string }>(userDocRef);
  const currentUserUsername = userData?.username;


  const handleRecipientSelect = async (username: string) => {
    if (!firestore || !user || !currentUserUsername) return;
    setRecipientError(null);

    if(username === currentUserUsername) {
      setRecipientError("You can't start a conversation with yourself.");
      return;
    }

    // For testing: bypass user existence check.
    // Create a placeholder UID for the recipient.
    const recipientUid = `temp_${username}`;
    setRecipient({ username, uid: recipientUid });

  };

  // Real-time listener for messages between the current user and the recipient
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !currentUserUsername || !recipient) return null;
    const messagesRef = collection(firestore, 'messages');
    
    // This query fetches messages where the current user is the sender AND the recipient is correct
    // OR where the current user is the recipient AND the sender is correct.
    const q = query(messagesRef, 
      or(
        where('senderUsername', '==', currentUserUsername),
        where('recipientUsername', '==', currentUserUsername)
      ),
      orderBy('timestamp', 'asc')
    );
    return q;
  }, [firestore, currentUserUsername, recipient]);
  
  const { data: dbMessages } = useCollection<MessageFromDb>(messagesQuery);

  const messages: Message[] = useMemo(() => {
    if (!dbMessages || !user || !recipient || !currentUserUsername) return [];
    // Since the query fetches for both sides, we need to filter to only show messages for the selected conversation
    return dbMessages.filter(msg => 
        (msg.senderUsername === currentUserUsername && msg.recipientUsername === recipient.username) ||
        (msg.senderUsername === recipient.username && msg.recipientUsername === currentUserUsername)
      ).map(msg => ({
        id: msg.id,
        content: msg.content,
        timestamp: msg.timestamp ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString() : 'sending...',
        type: msg.senderId === user.uid ? 'me' : 'other',
        status: 'read' // Placeholder status
      }));
  }, [dbMessages, user, recipient, currentUserUsername]);


  const handleSendMessage = async (content: string) => {
    if (!firestore || !user || !recipient || !currentUserUsername) return;

    const messageData = {
      content,
      senderId: user.uid,
      senderUsername: currentUserUsername,
      recipientId: recipient.uid,
      recipientUsername: recipient.username,
      timestamp: serverTimestamp(),
    };

    try {
        const messagesColRef = collection(firestore, 'messages');
        await addDoc(messagesColRef, messageData);
    } catch(error) {
        console.error("Error sending message:", error);
    }
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

  if (!recipient) {
    return (
       <SelectRecipient 
        onRecipientSelect={handleRecipientSelect} 
        currentUserUsername={currentUserUsername || user.email || 'You'}
        error={recipientError}
      />
    );
  }

  return (
    <ChatLayout
      messages={messages}
      onSendMessage={handleSendMessage}
      recipientUsername={recipient.username}
      currentUserUsername={currentUserUsername}
    />
  );
}
