import { Check, CheckCheck } from "lucide-react";
import type { Message } from "@/lib/types";

const MessageStatus = ({ status }: { status: Message['status'] }) => {
  if (status === 'sent') {
    return <Check className="w-4 h-4" />;
  }
  if (status === 'delivered') {
    return <CheckCheck className="w-4 h-4" />;
  }
  if (status === 'read' || status === 'deleting') {
    return <CheckCheck className="w-4 h-4 text-accent" />;
  }
  return null;
};

export default MessageStatus;
