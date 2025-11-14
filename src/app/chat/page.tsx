'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  collection,
  query,
  where,
  or,
  Timestamp,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  useFirebase,
  useUser,
  useCollection,
  useMemoFirebase,
  useDoc,
  addDocumentNonBlocking,
} from '@/firebase';
import SelectRecipient from '@/components/chat/select-recipient';
import ChatLayout from '@/components/chat/chat-layout';
import type { Message, MessageFromDb } from '@/lib/types';
import { z } from 'zod';

const recipientSchema = z.object({
  username: z.string(),
  uid: z.string(),
});
type Recipient = z.infer<typeof recipientSchema>;

export default function ChatPage() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  const { data: userData } = useDoc<{ username: string }>(userDocRef);
  const currentUserUsername = userData?.username;

  const handleRecipientSelect = async (username: string) => {
    setError(null);
    if (!firestore || !currentUserUsername) return;

    if (username === currentUserUsername) {
      setError('You cannot start a conversation with yourself.');
      return;
    }
    
    // For testing, we create a dummy recipient if they don't exist.
    setRecipient({ username: username, uid: `temp_${username}` });
  };

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !currentUserUsername || !recipient?.username) {
      return null;
    }
    const q = query(
      collection(firestore, 'messages'),
      or(
        where('senderUsername', '==', currentUserUsername),
        where('recipientUsername', '==', currentUserUsername)
      )
    );
    return q;
  }, [firestore, currentUserUsername, recipient?.username]);

  const { data: messagesFromDb, isLoading: messagesLoading } =
    useCollection<MessageFromDb>(messagesQuery);

  const messages: Message[] = useMemo(() => {
    if (!messagesFromDb || !currentUserUsername || !recipient?.username) return [];

    return messagesFromDb
      .filter(
        (msg) =>
          (msg.senderUsername === currentUserUsername &&
            msg.recipientUsername === recipient.username) ||
          (msg.senderUsername === recipient.username &&
            msg.recipientUsername === currentUserUsername)
      )
      .map((msg) => ({
        id: msg.id,
        content: msg.content,
        type: msg.senderUsername === currentUserUsername ? 'me' : 'other',
        timestamp:
          msg.timestamp instanceof Timestamp
            ? msg.timestamp.toDate().toLocaleTimeString()
            : 'sending...',
        status: 'read',
      }))
      .sort((a, b) => {
        // A simple sort, assuming timestamps are valid after being sent
        if (a.timestamp < b.timestamp) return -1;
        if (a.timestamp > b.timestamp) return 1;
        return 0;
      });
  }, [messagesFromDb, currentUserUsername, recipient?.username]);

  const handleSendMessage = async (content: string) => {
    if (!firestore || !user || !recipient || !currentUserUsername) return;

    addDocumentNonBlocking(collection(firestore, 'messages'), {
      content,
      senderId: user.uid,
      senderUsername: currentUserUsername,
      recipientId: recipient.uid,
      recipientUsername: recipient.username,
      timestamp: serverTimestamp(),
    });
  };

  if (!recipient) {
    return (
      <SelectRecipient
        onRecipientSelect={handleRecipientSelect}
        currentUserUsername={currentUserUsername}
        error={error}
      />
    );
  }

  return (
    <ChatLayout
      recipientUsername={recipient.username}
      messages={messages}
      onSendMessage={handleSendMessage}
      currentUserUsername={currentUserUsername}
    />
  );
}
