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
import { Plus, Send, MessageSquare, LogOut, Loader2, Mic, Paperclip, File as FileIcon, X, Wand2, ImageIcon, ScanSearch } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import Image from 'next/image';


type Message = {
  text: string;
  isUser: boolean;
  file?: File;
  imageUrl?: string;
  audioUrl?: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

type ImageMode = 'analyze' | 'generate' | null;

export default function DashboardPage() {
  const { logout } = useAuth();
  useAuth(); // To trigger the auth check effect
  const { toast } = useToast();

  const [chats, setChats] = useState<Chat[]>([
    { id: `chat-${Date.now()}`, title: 'New Chat', messages: [] },
  ]);
  const [activeChatId, setActiveChatId] = useState<string>(chats[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageMode, setImageMode] = useState<ImageMode>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageForAnalysis, setImageForAnalysis] = useState<File | null>(null);


  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeChatId);
  }, [chats, activeChatId]);

  useEffect(() => {
    if (selectedFile && activeChat && !imageMode) {
      handleSendMessage();
    }
  }, [selectedFile]);

  const handleSendMessage = async () => {
    if ((newMessage.trim() === '' && !selectedFile) || !activeChat || isLoading) return;

    setIsLoading(true);

    if (selectedFile) {
        const userMessage: Message = { text: newMessage, isUser: true, file: selectedFile };
        const fileToUpload = selectedFile;
        const messageToSend = newMessage;

        const updatedMessages = [...activeChat.messages, userMessage];

        setChats(prevChats =>
          prevChats.map(c =>
            c.id === activeChatId
              ? { 
                  ...c, 
                  messages: updatedMessages,
                  title: c.messages.length === 0 ? 'File Chat' : c.title
                }
              : c
          )
        );
        
        setNewMessage('');
        setSelectedFile(null);

        const formData = new FormData();
        formData.append('file', fileToUpload);
        if (messageToSend.trim() !== '') {
            formData.append('message', messageToSend);
        }

        try {
            const response = await fetch('https://ayvzjvz0.rpcld.net/webhook-test/Chatbot', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    title: "File Analysis Complete",
                    description: result.output || "The file has been processed successfully.",
                });
            } else {
                 toast({
                    variant: "destructive",
                    title: "Upload Failed",
                    description: result.message || "Could not process the file.",
                });
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Could not upload the file. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
        return;
    }

    // Regular text message logic
    const userMessage: Message = { text: newMessage, isUser: true };
    const messageToSend = newMessage;
  
    const updatedMessages = [...activeChat.messages, userMessage];
    const firstUserMessage = updatedMessages.find(m => m.isUser)?.text || 'New Chat';
    const chatTitle = firstUserMessage.substring(0, 25) + (firstUserMessage.length > 25 ? '...' : '');
  
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        if (imageMode === 'analyze') {
            setImageForAnalysis(file);
        } else {
            setSelectedFile(file);
        }
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handleImageModeSelect = (mode: ImageMode) => {
    setImageMode(mode);
    // Close popover
  };

  const cancelImageMode = () => {
    setImageMode(null);
    setImagePrompt('');
    setImageForAnalysis(null);
  };

  const handleImageAction = async () => {
    if (isLoading || !activeChat) return;

    if (imageMode === 'analyze' && imageForAnalysis) {
      setIsLoading(true);
      const imageUrl = URL.createObjectURL(imageForAnalysis);
      const userMessage: Message = { text: imagePrompt, isUser: true, imageUrl: imageUrl };

      setChats(prevChats =>
        prevChats.map(c =>
          c.id === activeChatId
            ? { 
                ...c, 
                messages: [...c.messages, userMessage, { text: '', isUser: false }],
                title: c.messages.length === 0 ? (imagePrompt.substring(0, 20) || 'Image Analysis') : c.title
              }
            : c
        )
      );

      const formData = new FormData();
      formData.append('image', imageForAnalysis);
      if (imagePrompt.trim() !== '') {
        formData.append('text', imagePrompt);
      }
      
      cancelImageMode();

      try {
        const response = await fetch('https://ayvzjvz0.rpcld.net/webhook-test/image', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        
        let botMessage: Message;
        if (response.ok && Array.isArray(result) && result.length > 0 && result[0].text) {
           botMessage = { text: result[0].text, isUser: false };
        } else {
           botMessage = { text: result.message || "Could not analyze the image.", isUser: false };
        }

        setChats(prevChats =>
            prevChats.map(c => {
                if (c.id === activeChatId) {
                    const newMessages = [...c.messages];
                    newMessages[newMessages.length - 1] = botMessage;
                    return { ...c, messages: newMessages };
                }
                return c;
            })
        );
      } catch (error) {
        console.error("Error analyzing image:", error);
        const errorMessage: Message = { text: "Could not analyze the image. Please try again.", isUser: false };
        setChats(prevChats =>
            prevChats.map(c => {
                if (c.id === activeChatId) {
                    const newMessages = [...c.messages];
                    newMessages[newMessages.length - 1] = errorMessage;
                    return { ...c, messages: newMessages };
                }
                return c;
            })
        );
      } finally {
        setIsLoading(false);
      }
    } else if (imageMode === 'generate' && imagePrompt.trim()) {
      setIsLoading(true);
      const userMessage: Message = { text: `Generate an image of: ${imagePrompt}`, isUser: true };

      setChats(prevChats =>
        prevChats.map(c =>
          c.id === activeChatId
            ? {
                ...c,
                messages: [...c.messages, userMessage, { text: '', isUser: false }],
                title: c.messages.length === 0 ? (imagePrompt.substring(0, 20) || 'Image Generation') : c.title
              }
            : c
        )
      );

      const promptToSend = imagePrompt;
      cancelImageMode();

      try {
        const response = await fetch('https://ayvzjvz0.rpcld.net/webhook-test/Generate_image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: promptToSend }),
        });

        if (response.ok) {
          const imageBlob = await response.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          const botMessage: Message = { text: '', isUser: false, imageUrl: imageUrl };

          setChats(prevChats =>
            prevChats.map(c => {
              if (c.id === activeChatId) {
                const newMessages = [...c.messages];
                newMessages[newMessages.length - 1] = botMessage;
                return { ...c, messages: newMessages };
              }
              return c;
            })
          );

        } else {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.message || 'Failed to generate image.');
        }
      } catch (error) {
        console.error("Error generating image:", error);
        const errorMessage: Message = { text: "Could not generate the image. Please try again.", isUser: false };
        setChats(prevChats =>
            prevChats.map(c => {
                if (c.id === activeChatId) {
                    const newMessages = [...c.messages];
                    newMessages[newMessages.length - 1] = errorMessage;
                    return { ...c, messages: newMessages };
                }
                return c;
            })
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSendVoiceMessage = async () => {
    if (newMessage.trim() === '' || !activeChat || isLoading) return;
  
    setIsLoading(true);
    const userMessage: Message = { text: newMessage, isUser: true };
    const textToSend = newMessage;
  
    setChats(prevChats =>
      prevChats.map(c =>
        c.id === activeChatId
          ? {
              ...c,
              messages: [...c.messages, userMessage, { text: '', isUser: false }],
              title: c.messages.length === 0 ? 'Voice Note' : c.title,
            }
          : c
      )
    );
  
    setNewMessage('');
  
    try {
      const response = await fetch('https://ayvzjvz0.rpcld.net/webhook-test/Generate_audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend }),
      });
  
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const botMessage: Message = { text: '', isUser: false, audioUrl: audioUrl };
  
        setChats(prevChats =>
          prevChats.map(c => {
            if (c.id === activeChatId) {
              const newMessages = [...c.messages];
              newMessages[newMessages.length - 1] = botMessage;
              return { ...c, messages: newMessages };
            }
            return c;
          })
        );
      } else {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || 'Failed to generate audio.');
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      const errorMessage: Message = { text: "Could not generate the audio. Please try again.", isUser: false };
      setChats(prevChats =>
        prevChats.map(c => {
          if (c.id === activeChatId) {
            const newMessages = [...c.messages];
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
                            <CardContent className="p-3">
                                <div className="prose dark:prose-invert prose-p:text-current prose-code:text-current prose-pre:bg-muted/50 prose-pre:text-current">
                                {message.text === '' && !message.isUser && !message.file && !message.imageUrl && !message.audioUrl ? (
                                   <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    {message.audioUrl && (
                                      <audio controls src={message.audioUrl} className="w-full" />
                                    )}
                                    {message.imageUrl && (
                                       <div className="mb-2">
                                          <Image
                                              src={message.imageUrl}
                                              alt="Uploaded image"
                                              width={300}
                                              height={300}
                                              className="rounded-md object-cover"
                                            />
                                       </div>
                                    )}
                                    {message.file && (
                                      <div className="mb-2">
                                          <div className="inline-flex items-center gap-3 bg-card border rounded-lg p-2 text-card-foreground">
                                              <div className="bg-destructive/20 text-destructive p-2 rounded-lg">
                                                 <FileIcon className="h-6 w-6" />
                                              </div>
                                              <div>
                                                  <p className="text-sm font-medium">{message.file.name}</p>
                                                  <p className="text-xs text-muted-foreground">{message.file.type.split('/')[1]?.toUpperCase()}</p>
                                              </div>
                                              {isLoading && message.isUser && (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                              )}
                                          </div>
                                      </div>
                                    )}
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                                  </>
                                )}
                                </div>
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
              <div className="space-y-2">
                {imageMode && (
                  <div className="relative rounded-lg border bg-background p-2 flex gap-2 items-center">
                    <Input
                      placeholder={imageMode === 'analyze' ? 'Describe or edit an image...' : 'Enter a prompt to generate an image...'}
                      className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      disabled={isLoading}
                    />
                    {imageMode === 'analyze' && (
                      <div>
                        {imageForAnalysis ? (
                          <div className="inline-flex items-center gap-2 text-sm bg-muted p-1 rounded-md">
                            <FileIcon className="h-4 w-4" />
                            <span className="text-xs truncate max-w-20">{imageForAnalysis.name}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setImageForAnalysis(null)} disabled={isLoading}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="outline" size="sm" onClick={handleFileUploadClick} disabled={isLoading}>
                            <Plus className="mr-2 h-4 w-4" />
                            Image
                          </Button>
                        )}
                      </div>
                    )}
                    <Button 
                      size="icon" 
                      className="rounded-full !h-8 !w-8 flex-shrink-0"
                      onClick={handleImageAction}
                      disabled={isLoading || (imageMode === 'analyze' && !imageForAnalysis) || (imageMode === 'generate' && !imagePrompt.trim())}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      className="rounded-full !h-8 !w-8 flex-shrink-0"
                      onClick={cancelImageMode}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4"/>
                    </Button>
                  </div>
                )}
                {selectedFile && (
                    <div className="mb-2">
                        <div className="inline-flex items-center gap-3 bg-card border rounded-lg p-2">
                            <div className="bg-destructive/20 text-destructive p-2 rounded-lg">
                               <FileIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{selectedFile.name}</p>
                                <p className="text-xs text-muted-foreground">{selectedFile.type.split('/')[1]?.toUpperCase()}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="!h-7 !w-7 rounded-full" onClick={removeSelectedFile}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
                <div className={cn("relative", imageMode && 'opacity-50 pointer-events-none')}>
                    <Input
                      placeholder="Ask anything..."
                      className="pl-24 pr-24 h-14 rounded-full text-base bg-muted border-none"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={isLoading || !!imageMode}
                    />
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button 
                            size="icon" 
                            variant="ghost"
                            className="rounded-full !h-10 !w-10"
                            onClick={handleFileUploadClick}
                            disabled={isLoading || !!imageMode}
                        >
                            <Paperclip />
                        </Button>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button 
                                    size="icon" 
                                    variant="ghost"
                                    className="rounded-full !h-10 !w-10"
                                    disabled={isLoading || !!imageMode}
                                >
                                    <Wand2 />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2 mb-2">
                               <div className="flex flex-col gap-2">
                                    <Button variant="ghost" className="justify-start" onClick={() => handleImageModeSelect('analyze')}>
                                        <ScanSearch className="mr-2" />
                                        Analyze image
                                    </Button>
                                    <Button variant="ghost" className="justify-start" onClick={() => handleImageModeSelect('generate')}>
                                        <ImageIcon className="mr-2" />
                                        Generate an image
                                    </Button>
                               </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                     <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Button 
                            size="icon" 
                            variant="ghost"
                            className="rounded-full !h-10 !w-10"
                            onClick={handleSendVoiceMessage}
                            disabled={isLoading || !!imageMode || !newMessage.trim()}
                        >
                            <Mic />
                        </Button>
                        <Button 
                            size="icon" 
                            className="rounded-full !h-10 !w-10"
                            onClick={handleSendMessage}
                            disabled={(!newMessage.trim() && !selectedFile) || isLoading || !!imageMode}
                        >
                            {isLoading && !imageMode ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send />}
                        </Button>
                     </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
