import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AiWithDastgeerLogo } from '@/components/ai-with-dastgeer-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageCircle, FileText, FileSearch, Bot, BrainCircuit, Link2 } from 'lucide-react';


export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'landing-page-hero');
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 md:px-6 border-b shrink-0 bg-background/80 backdrop-blur-sm">
        <AiWithDastgeerLogo />
        <div className="flex items-center gap-2">
          <Link href="/login" passHref>
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/signup" passHref>
            <Button>Sign Up</Button>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Unleash the Power of AI with <span className="text-primary">DASTGEER</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our intelligent chat assistant provides instant answers, helps you with complex tasks, and offers a personalized experience. Sign up to start your journey.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup" passHref>
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login" passHref>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  width="600"
                  height="400"
                  alt={heroImage.description}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                  data-ai-hint={heroImage.imageHint}
                />
              )}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Explore What's Possible</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI assistant is packed with features to help you be more productive and creative.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-start gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
              <Card className="text-left">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Conversational Chatbot</CardTitle>
                  </div>
                  <CardDescription className="pt-2">
                    Engage in natural, human-like conversations. Get instant answers, brainstorm ideas, or just have a friendly chat.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-left">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>RAG Chatbot</CardTitle>
                  </div>
                  <CardDescription className="pt-2">
                    Upload your documents and get insights. Our Retrieval-Augmented Generation model can understand and answer questions based on your files.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-left">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <FileSearch className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>File Analysis</CardTitle>
                  </div>
                  <CardDescription className="pt-2">
                    Analyze complex data from various file types. Extract key information, summarize content, and get actionable insights quickly.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-left">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Link2 className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>MCPLink Chatbot</CardTitle>
                  </div>
                  <CardDescription className="pt-2">
                    Seamlessly integrates with MCPLink to provide contextual assistance and streamline your workflow.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-left">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>DeepRAG Chatbot</CardTitle>
                  </div>
                  <CardDescription className="pt-2">
                    Leverage advanced retrieval techniques for more accurate and in-depth answers from your knowledge base.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-left">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <BrainCircuit className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>VectorMind Assistant</CardTitle>
                  </div>
                  <CardDescription className="pt-2">
                    Harness the power of vector embeddings for superior semantic search and intelligent recommendations.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center h-16 border-t">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AI WITH DASTGEER. All rights reserved.</p>
      </footer>
    </div>
  );
}
