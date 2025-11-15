'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Message } from '@/lib/supabase';

const ChatPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        router.push('/login');
        return;
      }
      setUserId(session.user.id);
      await loadMessages();
      setLoading(false);

      // Subscribe to real-time messages
      const subscription = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setMessages((prev) => [...prev, payload.new as Message]);
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    };

    checkAuth();
  }, [router]);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
    } else if (data) {
      setMessages(data);
    }
  };

  const uploadFile = async (
    file: File,
    fileType: 'image' | 'voice'
  ): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileType}s/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('message-media')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('message-media')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('File upload failed:', error);
      return null;
    }
  };

  const sendMessage = async (
    content?: string,
    imageUrl?: string,
    voiceUrl?: string
  ) => {
    if (!content && !imageUrl && !voiceUrl) return;
    if (!userId) return;

    try {
      const { error } = await supabase.from('messages').insert([{
        content: content || '',
        sender_id: userId,
        image_url: imageUrl || null,
        voice_url: voiceUrl || null,
        created_at: new Date().toISOString(),
      }]);

      if (error) {
        console.error('Error sending message:', error);
      } else {
        setInput('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSendMessage = async () => {
    await sendMessage(input);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const file = files[0];
    const imageUrl = await uploadFile(file, 'image');

    if (imageUrl) {
      await sendMessage(undefined, imageUrl);
    } else {
      alert('Failed to upload image');
    }
    setUploading(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'voice-message.wav', {
          type: 'audio/wav',
        });

        setUploading(true);
        const voiceUrl = await uploadFile(audioFile, 'voice');

        if (voiceUrl) {
          await sendMessage(undefined, undefined, voiceUrl);
        } else {
          alert('Failed to upload voice message');
        }
        setUploading(false);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
        <Button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600"
        >
          Logout
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">No messages yet</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender_id === userId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {msg.content && <p className="break-words">{msg.content}</p>}
                {msg.image_url && (
                  <img
                    src={msg.image_url}
                    alt="shared"
                    className="max-w-xs rounded mt-2"
                  />
                )}
                {msg.voice_url && (
                  <audio
                    src={msg.voice_url}
                    controls
                    className="mt-2 w-full"
                  />
                )}
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            hidden
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-gray-200 hover:bg-gray-300 text-gray-900"
          >
            📷
          </Button>
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={uploading}
            className={isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'}
          >
            {isRecording ? '⏹️' : '🎤'}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder="Type a message..."
            disabled={uploading || isRecording}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || uploading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;