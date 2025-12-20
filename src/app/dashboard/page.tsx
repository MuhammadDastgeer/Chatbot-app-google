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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AiWithDastgeerLogo } from '@/components/ai-with-dastgeer-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Plus, Send, MessageSquare, LogOut, Loader2, Mic, Paperclip } from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const { logout } = useAuth();
  useAuth(); // To trigger the auth check effect

  const [chats, setChats] = useState<Chat[]>([
    { id: `chat-${Date.now()}`, title: 'New Chat', messages: [] },
  ]);
  const [activeChatId, setActiveChatId] = useState<string>(chats[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);


  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeChatId);
  }, [chats, activeChatId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !activeChat || isLoading) return;
  
    const userMessage: Message = { text: newMessage, isUser: true };
    const messageToSend = newMessage;
  
    const updatedMessages = [...activeChat.messages, userMessage];
    const firstUserMessage = updatedMessages.find(m => m.isUser)?.text || 'New Chat';
    const chatTitle = firstUserMessage.substring(0, 25) + (firstUserMessage.length > 25 ? '...' : '');
  
    // Add user message and an empty bot message
    setChats(prevChats =>
      prevChats.map(c =>
        c.id === activeChatId
          ? { 
              ...c, 
              messages: [...updatedMessages, { text: '', isUser: false }],
              title: c.messages.length === 0 ? chatTitle : c.title
            }
          : c
      )
    );
  
    setNewMessage('');
    setIsLoading(true);
  
    try {
      const response = await fetch('https://ayvzjvz0.rpcld.net/webhook-test/Chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend }),
      });
  
      if (!response.body) {
        throw new Error("Response body is null");
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = '';
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        accumulatedResponse += decoder.decode(value, { stream: true });
        
        try {
            const parsed = JSON.parse(accumulatedResponse);
            const textToShow = parsed.output || accumulatedResponse;

            setChats(prevChats =>
              prevChats.map(c => {
                if (c.id === activeChatId) {
                  const lastMessage = c.messages[c.messages.length - 1];
                  if (lastMessage && !lastMessage.isUser) {
                    const newMessages = [...c.messages];
                    newMessages[newMessages.length - 1] = { ...lastMessage, text: textToShow };
                    return { ...c, messages: newMessages };
                  }
                }
                return c;
              })
            );
        } catch (e) {
            // In case of incomplete JSON, we just update with what we have.
            // This might show partial JSON but will be corrected on the next chunk.
            setChats(prevChats =>
              prevChats.map(c => {
                if (c.id === activeChatId) {
                  const lastMessage = c.messages[c.messages.length - 1];
                  if (lastMessage && !lastMessage.isUser) {
                    const newMessages = [...c.messages];
                    newMessages[newMessages.length - 1] = { ...lastMessage, text: accumulatedResponse };
                    return { ...c, messages: newMessages };
                  }
                }
                return c;
              })
            );
        }
      }
  
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { text: "Something went wrong. Please try again.", isUser: false };
      setChats(prevChats =>
        prevChats.map(c => {
            if (c.id === activeChatId) {
                const newMessages = [...c.messages];
                // Replace the empty bot message with the error message
                newMessages[newMessages.length - 1] = errorMessage;
                return { ...c, messages: newMessages };
            }
            return c;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
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
  
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  }

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
                        <Card className={`max-w-xs md:max-w-md lg:max-w-2xl ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                            <CardContent className="p-3 prose dark:prose-invert prose-p:text-current prose-code:text-current">
                                {message.text === '' && !message.isUser ? (
                                   <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ))}
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
                <Input
                  placeholder="Ask anything..."
                  className="pl-12 pr-24 h-14 rounded-full text-base bg-muted border-none"
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
                    variant="ghost"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full !h-10 !w-10"
                    onClick={handleFileUploadClick}
                    disabled={isLoading}
                >
                    <Paperclip />
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" />
                 <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Button 
                        size="icon" 
                        variant="ghost"
                        className="rounded-full !h-10 !w-10"
                        disabled={isLoading}
                    >
                        <Mic />
                    </Button>
                    <Button 
                        size="icon" 
                        className="rounded-full !h-10 !w-10"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isLoading}
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send />}
                    </Button>
                 </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

    