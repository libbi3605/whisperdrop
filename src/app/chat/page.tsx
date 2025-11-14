"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import ChatLayout from '@/components/chat/chat-layout';
import type { Message } from '@/lib/types';

// Message will self-destruct after this many milliseconds
const MESSAGE_TTL = 30000; // 30 seconds

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const idCounter = useRef(0);

  const getNewId = () => {
    idCounter.current += 1;
    return idCounter.current.toString();
  };

  // Load initial messages on mount
  useEffect(() => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    idCounter.current = 2;
    setMessages([
        {
            id: getNewId(),
            type: 'other',
            content: 'Welcome to WhisperDrop. Messages sent here are ephemeral and will disappear after some time.',
            timestamp: time,
            status: 'read',
        },
        {
            id: getNewId(),
            type: 'other',
            content: 'This is a secure and anonymous chat. Your identity is hidden.',
            timestamp: time,
            status: 'read',
        }
    ]);
  }, []);

  // Simulate receiving a message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.type === 'me' && lastMessage.status !== 'read') {
      const timeout = setTimeout(() => {
        const newMessage: Message = {
          id: getNewId(),
          type: 'other',
          content: 'I see you\'ve sent a message. I\'ll reply now. Remember, our conversation will vanish.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered',
        };
        setMessages(prev => [...prev, newMessage]);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [messages]);


  const handleSendMessage = useCallback((content: string) => {
    const newId = getNewId();
    const newMessage: Message = {
      id: newId,
      type: 'me',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate status update
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newId ? { ...m, status: 'delivered' } : m));
    }, 1000);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newId ? { ...m, status: 'read' } : m));
    }, 2500);

  }, []);

  // Handle ephemeral message deletion
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    messages.forEach(message => {
      // Don't delete initial welcome messages
      if (Number(message.id) > 4) {
        const deletionTimeout = setTimeout(() => {
          setMessages(prev => prev.map(m => m.id === message.id ? { ...m, status: 'deleting' } : m));
          const removalTimeout = setTimeout(() => {
            setMessages(prev => prev.filter(m => m.id !== message.id));
          }, 500); // 0.5s for fade-out animation
          timeouts.push(removalTimeout);
        }, MESSAGE_TTL);
        timeouts.push(deletionTimeout);
      }
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [messages]);

  return <ChatLayout messages={messages} onSendMessage={handleSendMessage} />;
}
