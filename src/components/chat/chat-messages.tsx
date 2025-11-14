import type { Message } from '@/lib/types';
import MessageBubble from './message-bubble';

interface ChatMessagesProps {
  messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
          </div>
      )}
    </div>
  );
}
