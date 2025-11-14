import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";
import MessageStatus from "./message-status";

const MessageBubble = ({ message }: { message: Message }) => {
  const isMe = message.type === 'me';
  const isDeleting = message.status === 'deleting';

  return (
    <div
      className={cn(
        "flex items-end gap-2 transition-opacity duration-500",
        isMe ? "justify-end" : "justify-start",
        isDeleting ? "opacity-0" : "opacity-100"
      )}
    >
      <div
        className={cn(
          "max-w-md lg:max-w-2xl rounded-2xl px-4 py-2.5 shadow-md",
          isMe
            ? "bg-primary text-primary-foreground rounded-br-lg"
            : "bg-secondary text-secondary-foreground rounded-bl-lg"
        )}
      >
        <p className="whitespace-pre-wrap break-words text-base">{message.content}</p>
        <div className="flex items-center justify-end gap-2 text-xs mt-1.5 opacity-70">
          <span>{message.timestamp}</span>
          {isMe && <MessageStatus status={message.status} />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
