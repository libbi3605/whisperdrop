
"use client";

import { useState, useRef, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ChatInputProps {
  recipientUsername: string;
  currentUserUsername: string;
}

export default function ChatInput({ recipientUsername, currentUserUsername }: ChatInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { firestore, user } = useFirebase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContent = content.trim();

    if (!trimmedContent || !firestore || !user) {
      return;
    }

    const messagesColRef = collection(firestore, 'messages');
    addDoc(messagesColRef, {
      content: trimmedContent,
      senderId: user.uid,
      senderUsername: currentUserUsername,
      recipientId: `temp_${recipientUsername}`, // placeholder as per previous logic
      recipientUsername: recipientUsername,
      timestamp: serverTimestamp(),
    });
    
    setContent('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-4">
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type an ephemeral message..."
        className="flex-grow resize-none bg-input border-0 focus-visible:ring-1 focus-visible:ring-ring ring-offset-0"
        rows={1}
        aria-label="Chat message input"
      />
      <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0 rounded-full w-12 h-12 transition-transform duration-200 active:scale-90" aria-label="Send message">
        <Send className="w-6 h-6" />
      </Button>
    </form>
  );
}
