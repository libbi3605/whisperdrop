
import Link from 'next/link';
import { ArrowLeft, Lock, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ChatHeaderProps {
    recipientUsername: string;
}

export default function ChatHeader({ recipientUsername }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-3 border-b shrink-0">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden" asChild>
            <Link href="/">
                <ArrowLeft className="w-5 h-5" />
                <span className="sr-only">Back to Home</span>
            </Link>
        </Button>
        <div className='flex items-center gap-3'>
             <Avatar className="h-8 w-8 border">
                <AvatarFallback>
                    <UserIcon />
                </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {recipientUsername}
            </h2>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-accent">
        <Lock className="w-4 h-4" />
        <span>Encrypted</span>
      </div>
    </header>
  );
}
