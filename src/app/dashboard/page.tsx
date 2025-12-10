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
import { Plus, Send, MessageSquare, LogOut } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeChatId);
  }, [chats, activeChatId]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' && activeChat) {
      const userMessage: Message = { text: newMessage, isUser: true };
      const updatedMessages = [...activeChat.messages, userMessage];
      
      const firstUserMessage = updatedMessages.find(m => m.isUser)?.text || 'New Chat';
      const chatTitle = firstUserMessage.substring(0, 25) + (firstUserMessage.length > 25 ? '...' : '');

      const updatedChat = { ...activeChat, messages: updatedMessages, title: activeChat.messages.length === 0 ? chatTitle : activeChat.title };
      
      const updatedChats = chats.map((c) => (c.id === activeChatId ? updatedChat : c));

      setChats(updatedChats);

      // Simulate a bot response
      setTimeout(() => {
        setChats((prevChats) => {
            const currentChat = prevChats.find(c => c.id === activeChatId);
            if (!currentChat) return prevChats;

            const botMessage: Message = { text: "This is a simulated response.", isUser: false };
            const messagesWithBot = [...currentChat.messages, botMessage];
            const updatedCurrentChat = {...currentChat, messages: messagesWithBot };
            return prevChats.map(c => c.id === activeChatId ? updatedCurrentChat : c);
        });
      }, 1000);

      setNewMessage('');
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      messages: [],
    };
    setChats((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
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
             <SidebarTrigger />
          </div>
          <Button variant="default" className="w-full mt-4 !h-12 text-base rounded-full" onClick={handleNewChat}>
            <Plus className="mr-2" />
            New Chat
          </Button>
        </SidebarHeader>
        <SidebarContent className="p-2">
            <p className="text-xs text-muted-foreground p-2">Previous Chats</p>
            <SidebarMenu>
                 {chats.filter(c => c.messages.length > 0).map(chat => (
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
                <SidebarTrigger />
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
                {(!activeChat || activeChat.messages.length === 0) && (
                    <div className="flex h-full items-center justify-center">
                        <Card className="w-full max-w-lg text-center">
                            <CardHeader>
                                <CardTitle><AiWithDastgeerLogo /></CardTitle>
                                <CardDescription>How can I help you today?</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                )}
            </div>
            <div className="mt-4 border-t pt-4">
                <div className="relative">
                    <Textarea
                        placeholder="Message AI WITH DASTGEER..."
                        className="pr-16 resize-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <Button 
                        size="icon" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full !h-10 !w-10"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                    >
                        <Send />
                    </Button>
                </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}