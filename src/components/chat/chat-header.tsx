import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b shrink-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <Link href="/">
                <ArrowLeft className="w-5 h-5" />
                <span className="sr-only">Back to Home</span>
            </Link>
        </Button>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Wicker
        </h1>
      </div>
      <div className="flex items-center gap-2 text-sm text-accent animate-pulse">
        <Lock className="w-4 h-4" />
        <span>Encrypted</span>
      </div>
    </header>
  );
}
