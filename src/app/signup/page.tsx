
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useFirebase } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters"),
  password: z.string(),
});

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const { auth, firestore } = useFirebase();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setIsUsernameTaken(false);
    if (!auth || !firestore) return;

    try {
      // We append a dummy domain to the username to use it as an email for Firebase Auth
      const email = `${values.username}@wicker.app`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, values.password);
      const user = userCredential.user;

      // Create a user document in Firestore using the non-blocking function
      const userDocRef = doc(firestore, "users", user.uid);
      setDocumentNonBlocking(userDocRef, {
        username: values.username,
        uid: user.uid,
      }, { merge: false });
      
      // On successful sign-up, redirect to chat
      router.push('/chat');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError("Username already taken. Please choose another one or log in.");
        setIsUsernameTaken(true);
      } else if (error.code === 'auth/weak-password') {
        setError("Password is too weak. Please choose a stronger one (at least 6 characters).");
      }
      else {
        setError("Failed to create account. Please try again.");
      }
      console.error("Sign up error:", error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up for Wicker</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Choose a username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              {isUsernameTaken && (
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/login">Login with existing account</Link>
                </Button>
              )}
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isUsernameTaken}>Create Account</Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
