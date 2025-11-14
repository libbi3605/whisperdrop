
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

interface SelectRecipientProps {
  onRecipientSelect: (username: string) => void;
  currentUserUsername?: string;
  error?: string | null;
}

export default function SelectRecipient({ onRecipientSelect, currentUserUsername, error }: SelectRecipientProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onRecipientSelect(values.username);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Start a Conversation</CardTitle>
          <CardDescription>Enter the username of the person you want to chat with.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient's Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a username..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                Start Chat <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {currentUserUsername && (
         <p className="absolute bottom-4 text-xs text-muted-foreground">
            Logged in as: <strong>{currentUserUsername}</strong>
        </p>
      )}
    </main>
  );
}
