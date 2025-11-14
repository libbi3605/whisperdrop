import { Button } from "@/components/ui/button";
import { Ghost, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="flex items-center gap-4 mb-4">
        <Ghost className="w-16 h-16 text-primary" />
        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
          WhisperDrop
        </h1>
      </div>
      <p className="max-w-md mb-8 text-lg text-muted-foreground">
        Anonymous. Ephemeral. Secure. Your private conversations disappear without a trace.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8">
          <Link href="/chat">
            Enter Anonymously
          </Link>
        </Button>
        <div className="flex items-center gap-2 text-sm text-accent">
          <ShieldCheck className="w-5 h-5" />
          <span>End-to-End Encrypted</span>
        </div>
      </div>
      <footer className="absolute bottom-4 text-xs text-muted-foreground">
        <p>Your privacy is our priority. No logs. No history. No identity.</p>
      </footer>
    </main>
  );
}
