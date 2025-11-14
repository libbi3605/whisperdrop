
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatLayout from '@/components/chat/chat-layout';
import SelectRecipient from '@/components/chat/select-recipient';
import type { Message, MessageFromDb } from '@/lib/types';
import { useUser, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { useFirebase } from '@/firebase';

export default function ChatPage() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();

  const [recipient, setRecipient] = useState<{ username: string; uid: string } | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [recipientError, setRecipientError] = useState<string | null>(null);

  // Fetch current user's profile
  const userDocRef = useMemoFirebase(() => {
    return user ? doc(firestore, 'users', user.uid) : null;
  }, [user, firestore]);
  const { data: userData } = useDoc<{ username: string }>(userDocRef);
  const currentUserUsername = userData?.username;

  // Function to create a consistent conversation ID
  const createConversationId = (uid1: string, uid2: string) => {
    return [uid1, uid2].sort().join('_');
  };

  const handleRecipientSelect = async (username: string) => {
    if (!firestore || !user) return;
    setRecipientError(null);

    if(username === currentUserUsername) {
      setRecipientError("You can't start a conversation with yourself.");
      return;
    }

    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setRecipientError("User not found. Please check the username.");
        return;
      }

      const recipientData = querySnapshot.docs[0].data();
      const recipientUid = recipientData.uid;
      
      setRecipient({ username, uid: recipientUid });
      const newConversationId = createConversationId(user.uid, recipientUid);
      setConversationId(newConversationId);

    } catch (error) {
      console.error("Error finding recipient:", error);
      setRecipientError("Something went wrong while trying to find the user.");
    }
  };

  // Real-time listener for messages
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !conversationId) return null;
    return query(collection(firestore, 'conversations', conversationId, 'messages'), orderBy('timestamp', 'asc'));
  }, [firestore, conversationId]);
  
  const { data: dbMessages } = useCollection<MessageFromDb>(messagesQuery);

  const messages: Message[] = useMemoFirebase(() => {
    if (!dbMessages || !user) return [];
    return dbMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      // Note: In a real app, you'd handle Firestore Timestamps more robustly
      timestamp: msg.timestamp ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString() : 'sending...',
      type: msg.senderId === user.uid ? 'me' : 'other',
      status: 'read' // Placeholder status
    }));
  }, [dbMessages, user]);


  const handleSendMessage = async (content: string) => {
    if (!firestore || !user || !conversationId) return;

    try {
      const messagesColRef = collection(firestore, 'conversations', conversationId, 'messages');
      await addDoc(messagesColRef, {
        content,
        senderId: user.uid,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
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

  // If a recipient has not been selected, show the selection screen
  if (!recipient || !conversationId) {
    return (
       <SelectRecipient 
        onRecipientSelect={handleRecipientSelect} 
        currentUserUsername={currentUserUsername || user.email || 'You'}
        error={recipientError}
      />
    );
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
