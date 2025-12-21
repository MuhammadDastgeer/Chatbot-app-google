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
import { Plus, Send, MessageSquare, LogOut, Loader2, Mic, Paperclip, File as FileIcon, X, Wand2, StopCircle, Bot, Search, Puzzle, Ban, BrainCircuit, Video, Phone } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


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

type ActiveTool = 'createImage' | 'createQuiz' | 'webSearch' | 'deepSearch';

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
  
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const [activeTool, setActiveTool] = useState<ActiveTool | null>(null);


  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeChatId);
  }, [chats, activeChatId]);

  useEffect(() => {
    if (selectedFile && activeChat) {
      handleSendMessage();
    }
  }, [selectedFile]);

  const handleToolUse = (tool: ActiveTool) => {
    setActiveTool(tool);
    // Remove toast placeholders
  };
  
  const handleSendMessage = async () => {
    if ((newMessage.trim() === '' && !selectedFile && !activeTool) || !activeChat || isLoading) return;
    
    setIsLoading(true);

    if(activeTool) {
      let userMessageText = '';
      let prompt = newMessage;
      let endpoint = '';
      let title = activeChat.title;
      let isImageResponse = false;
      
      switch(activeTool) {
        case 'createImage':
          userMessageText = `Generate an image of: ${prompt}`;
          endpoint = 'https://ayvzjvz0.rpcld.net/webhook-test/Generate_image';
          title = activeChat.messages.length === 0 ? 'Image Generation' : title;
          isImageResponse = true;
          break;
        case 'createQuiz':
          userMessageText = `Create a quiz about: ${prompt}`;
          endpoint = 'https://ayvzjvz0.rpcld.net/webhook-test/web_quiz';
          title = activeChat.messages.length === 0 ? 'Quiz Time' : title;
          break;
        case 'webSearch':
          userMessageText = `Search the web for: ${prompt}`;
          endpoint = 'https://ayvzjvz0.rpcld.net/webhook-test/web_quiz';
          title = activeChat.messages.length === 0 ? 'Web Search' : title;
          break;
        case 'deepSearch':
          userMessageText = `Deep search for: ${prompt}`;
          endpoint = 'https://ayvzjvz0.rpcld.net/webhook-test/web_quiz';
          title = activeChat.messages.length === 0 ? 'Deep Search' : title;
          break;
      }
      
      const userMessage: Message = { text: userMessageText, isUser: true };
       setChats(prevChats =>
        prevChats.map(c =>
          c.id === activeChatId
            ? { 
                ...c, 
                messages: [...c.messages, userMessage, { text: '', isUser: false }],
                title: title
              }
            : c
        )
      );
      setNewMessage('');
      setActiveTool(null);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: prompt }),
        });

        if(response.ok) {
          if (isImageResponse) {
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
             const result = await response.json();
             const botMessage: Message = { text: result.output || 'I could not find anything for that.', isUser: false };
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
          }
            
        } else {
            const errorResult = await response.json().catch(() => ({}));
            const errorMessage: Message = { text: `Request failed: ${errorResult.message || 'Unknown error'}`, isUser: false };
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
        }
      } catch (error) {
        console.error("Error with tool:", error);
         const errorMessage: Message = { text: "Something went wrong with the tool. Please try again.", isUser: false };
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
      return;
    }


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
    let userMessage: Message = { text: newMessage, isUser: true };
    const messageToSend = newMessage;
  
    if (newMessage.trim() === '' && !activeChat.messages.some(m => m.isUser)) {
        userMessage.text = "Tell me a fun fact.";
    }

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
        body: JSON.stringify({ message: messageToSend || "Tell me a fun fact." }),
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
        setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        handleSendRecordedVoice(audioBlob);
        stream.getTracks().forEach(track => track.stop()); // Stop microphone access
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not access the microphone. Please check permissions.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSendRecordedVoice = async (audioBlob: Blob) => {
    if (!activeChat) return;
    setIsLoading(true);

    const userMessage: Message = {
      text: 'Voice message',
      isUser: true,
      audioUrl: URL.createObjectURL(audioBlob),
    };

    setChats(prevChats =>
      prevChats.map(c =>
        c.id === activeChatId
          ? {
              ...c,
              messages: [...c.messages, userMessage, { text: '', isUser: false }],
              title: c.messages.length === 0 ? 'Voice Chat' : c.title,
            }
          : c
      )
    );

    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice-message.webm');

    try {
      const response = await fetch('https://ayvzjvz0.rpcld.net/webhook-test/Generate_audio', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const botMessage: Message = {
          text: result.text || '',
          isUser: false,
          audioUrl: result.audio_url,
        };
        
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
        throw new Error(result.message || 'Failed to process audio.');
      }
    } catch (error) {
      console.error("Error sending voice message:", error);
      const errorMessage: Message = { text: "Could not process the voice message. Please try again.", isUser: false };
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

  const getPlaceholderText = () => {
    switch (activeTool) {
      case 'createImage':
        return 'Describe your image';
      case 'createQuiz':
        return 'Enter a topic for the quiz...';
      case 'webSearch':
        return 'What do you want to search for?';
      case 'deepSearch':
        return 'What do you want to deep search for?';
      default:
        return 'Ask anything...';
    }
  };
  
  const getToolIcon = (tool: ActiveTool) => {
    switch (tool) {
      case 'createImage':
        return <Wand2 className="h-4 w-4" />;
      case 'createQuiz':
        return <Puzzle className="h-4 w-4" />;
      case 'webSearch':
        return <Search className="h-4 w-4" />;
      case 'deepSearch':
        return <BrainCircuit className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getToolLabel = (tool: ActiveTool) => {
    switch (tool) {
        case 'createImage':
            return 'Image';
        case 'createQuiz':
            return 'Quiz';
        case 'webSearch':
            return 'Search';
        case 'deepSearch':
            return 'Deep Search';
        default:
            return '';
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
                                      <audio controls src={message.audioUrl} className="w-full mb-2" />
                                    )}
                                    {message.imageUrl && (
                                       <div className="mb-2">
                                          <Image
                                              src={message.imageUrl}
                                              alt="Generated image"
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
                <div className={cn("relative")}>
                    <Input
                      placeholder={getPlaceholderText()}
                      className={cn(
                        "h-14 rounded-full text-base bg-muted border-none pr-28 text-center",
                        activeTool ? "pl-32" : "pl-32"
                      )}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={isLoading || isRecording}
                    />
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button 
                            size="icon" 
                            variant="ghost"
                            className="rounded-full !h-10 !w-10"
                            onClick={handleFileUploadClick}
                            disabled={isLoading || isRecording || !!activeTool}
                        >
                            <Plus />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button 
                                  variant="ghost"
                                  className="rounded-full !h-10 px-4"
                                  disabled={isLoading || isRecording || !!activeTool}
                              >
                                  <Bot />
                                  <span>Tools</span>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                              <DropdownMenuItem onSelect={() => handleToolUse('createImage')}>
                                  <Wand2 className="mr-2 h-4 w-4" />
                                  <span>Create Image</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleToolUse('createQuiz')}>
                                  <Puzzle className="mr-2 h-4 w-4" />
                                  <span>Create Quiz</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleToolUse('webSearch')}>
                                  <Search className="mr-2 h-4 w-4" />
                                  <span>Web Search</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleToolUse('deepSearch')}>
                                  <BrainCircuit className="mr-2 h-4 w-4" />
                                  <span>Deep Search</span>
                              </DropdownMenuItem>
                               <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled>
                                      <Video className="mr-2 h-4 w-4" />
                                      <span>Create Video</span>
                                    </DropdownMenuItem>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Coming soon!</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {activeTool && (
                          <div className="inline-flex items-center gap-2 bg-background border rounded-full px-3 py-1 text-sm">
                            <span className="flex items-center">{getToolIcon(activeTool)}</span>
                            <span>{getToolLabel(activeTool)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="!h-5 !w-5 rounded-full"
                              onClick={() => setActiveTool(null)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                    </div>

                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf" />
                     <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button 
                              size="icon" 
                              variant={isRecording ? "destructive" : "ghost"}
                              className="rounded-full !h-10 !w-10"
                              onClick={handleVoiceButtonClick}
                              disabled={isLoading || !!activeTool}
                          >
                              {isRecording ? <StopCircle /> : <Mic />}
                          </Button>
                        {(newMessage.trim() || selectedFile) ? (
                           <Button 
                              size="icon" 
                              className="rounded-full !h-10 !w-10"
                              onClick={() => handleSendMessage()}
                              disabled={isLoading || isRecording}
                          >
                              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send />}
                          </Button>
                        ) : (
                          <Button 
                              size="icon"
                              variant="ghost"
                              className="rounded-full !h-10 !w-10"
                              onClick={() => { /* TODO: Implement call functionality */ }}
                              disabled={isLoading || !!activeTool || isRecording}
                          >
                              <Phone />
                          </Button>
                        )}
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
