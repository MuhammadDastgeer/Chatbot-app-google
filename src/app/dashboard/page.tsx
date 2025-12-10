'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AiWithDastgeerLogo } from '@/components/ai-with-dastgeer-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Plus, Send, MessageSquare, LogOut, Loader2, Paperclip } from 'lucide-react';
import { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type Message = {
  text: string;
  isUser: boolean;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

export default function DashboardPage() {
  const [chats, setChats] = useState<Chat[]>([
    { id: `chat-${Date.now()}`, title: 'New Chat', messages: [] },
  ]);
  const [activeChatId, setActiveChatId] = useState<string>(chats[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeChatId);
  }, [chats, activeChatId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && activeChat && !isLoading) {
      const userMessage: Message = { text: newMessage, isUser: true };
      const messageToSend = newMessage;
      
      setChats(prevChats => {
        const currentChat = prevChats.find(c => c.id === activeChatId);
        if (!currentChat) return prevChats;
  
        const updatedMessages = [...currentChat.messages, userMessage];
        const firstUserMessage = updatedMessages.find(m => m.isUser)?.text || 'New Chat';
        const chatTitle = firstUserMessage.substring(0, 25) + (firstUserMessage.length > 25 ? '...' : '');
        const updatedChat = { ...currentChat, messages: updatedMessages, title: currentChat.messages.length === 0 ? chatTitle : currentChat.title };
        
        return prevChats.map(c => (c.id === activeChatId ? updatedChat : c));
      });

      setNewMessage('');
      setIsLoading(true);

      try {
        const response = await fetch('https://o4tdkmt2.rpcl.app/webhook-test/Chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: messageToSend }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const botMessage: Message = { text: data.output || "Sorry, I didn't get that.", isUser: false };

        setChats((prevChats) => {
            const currentChat = prevChats.find(c => c.id === activeChatId);
            if (!currentChat) return prevChats;

            const messagesWithBot = [...currentChat.messages, botMessage];
            const updatedCurrentChat = {...currentChat, messages: messagesWithBot };
            return prevChats.map(c => c.id === activeChatId ? updatedCurrentChat : c);
        });

      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: Message = { text: "Something went wrong. Please try again.", isUser: false };
        setChats((prevChats) => {
            const currentChat = prevChats.find(c => c.id === activeChatId);
            if (!currentChat) return prevChats;

            const messagesWithError = [...currentChat.messages, errorMessage];
            const updatedCurrentChat = {...currentChat, messages: messagesWithError };
            return prevChats.map(c => c.id === activeChatId ? updatedCurrentChat : c);
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeChat) {
      return;
    }

    setIsLoading(true);
    
    const userMessage: Message = { text: `You have uploaded: ${file.name}`, isUser: true };
    setChats(prevChats => {
        const currentChat = prevChats.find(c => c.id === activeChatId);
        if (!currentChat) return prevChats;

        const updatedMessages = [...currentChat.messages, userMessage];
        const updatedChat = { ...currentChat, messages: updatedMessages };
        return prevChats.map(c => c.id === activeChatId ? updatedChat : c);
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('https://o4tdkmt2.rpcl.app/webhook-test/Chatbot', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const botMessage: Message = { text: data.output || "File processed.", isUser: false };

        setChats((prevChats) => {
            const currentChat = prevChats.find(c => c.id === activeChatId);
            if (!currentChat) return prevChats;

            const messagesWithBot = [...currentChat.messages, botMessage];
            const updatedCurrentChat = {...currentChat, messages: messagesWithBot };
            return prevChats.map(c => c.id === activeChatId ? updatedCurrentChat : c);
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        toast({
            variant: "destructive",
            title: "Upload Failed",
            description: "Could not upload the file. Please try again.",
        });
        const errorMessage: Message = { text: "File upload failed. Please try again.", isUser: false };
         setChats((prevChats) => {
            const currentChat = prevChats.find(c => c.id === activeChatId);
            if (!currentChat) return prevChats;

            const messagesWithError = [...currentChat.messages, errorMessage];
            const updatedCurrentChat = {...currentChat, messages: messagesWithError };
            return prevChats.map(c => c.id === activeChatId ? updatedCurrentChat : c);
        });
    } finally {
        setIsLoading(false);
        // Reset file input
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleNewChat = () => {
    if (activeChat && activeChat.messages.length > 0) {
        const newChat: Chat = {
          id: `chat-${Date.now()}`,
          title: 'New Chat',
          messages: [],
        };
        setChats((prev) => [...prev, newChat]);
        setActiveChatId(newChat.id);
    } else if (activeChat) {
        setChats(prev => prev.map(c => c.id === activeChatId ? {...c, messages: []} : c));
    }
  };
  
  const switchChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
             <AiWithDastgeerLogo />
             <SidebarTrigger className="hidden md:flex"/>
          </div>
          <Button variant="default" className="w-full mt-4 !h-12 text-base rounded-full" onClick={handleNewChat}>
            <Plus className="mr-2" />
            New Chat
          </Button>
        </SidebarHeader>
        <SidebarContent className="p-2">
            <p className="text-xs text-muted-foreground p-2">Previous Chats</p>
            <SidebarMenu>
                 {chats.filter(c => c.id !== activeChatId && c.messages.length > 0).map(chat => (
                    <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton onClick={() => switchChat(chat.id)} isActive={activeChatId === chat.id}>
                            <MessageSquare />
                            <span>{chat.title}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarContent>
        <SidebarHeader>
          <div className="flex items-center justify-end w-full">
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2" />
              Logout
            </Button>
          </div>
        </SidebarHeader>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background">
          <header className="sticky top-0 z-50 flex items-center justify-between w-full h-14 px-4 border-b shrink-0 bg-background">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden"/>
                <h1 className="text-xl font-semibold">{activeChat?.title}</h1>
            </div>
            <div className="flex items-center gap-2">
                <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 pr-4">
                {activeChat && activeChat.messages.map((message, index) => (
                    <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                        <Card className={`max-w-xs md:max-w-md lg:max-w-2xl ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <CardContent className="p-3">
                                <p>{message.text}</p>
                            </CardContent>
                        </Card>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <Card className="max-w-xs md:max-w-md lg:max-w-2xl bg-muted">
                            <CardContent className="p-3 flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Thinking...</span>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {(!activeChat || activeChat.messages.length === 0) && !isLoading && (
                    <div className="flex h-full items-center justify-center">
                        <Card className="w-full max-w-lg text-center">
                            <CardHeader>
                                <CardTitle><AiWithDastgeerLogo /></CardTitle>
                                <CardDescription>How can I help you today? I’m a smart genius assistant.</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                )}
            </div>
            <div className="mt-4 border-t pt-4">
                <div className="relative">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                    <Button 
                        size="icon" 
                        variant="ghost"
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full !h-10 !w-10"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                    >
                       <Paperclip />
                    </Button>
                    <Textarea
                        placeholder="Message AI WITH DASTGEER..."
                        className="pl-14 pr-16 resize-none bg-muted border-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        disabled={isLoading}
                    />
                    <Button 
                        size="icon" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full !h-10 !w-10"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isLoading}
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send />}
                    </Button>
                </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
