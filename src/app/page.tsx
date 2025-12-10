import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AiWithDastgeerLogo } from '@/components/ai-with-dastgeer-logo';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LandingPage() {
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
              <img
                src="https://picsum.photos/seed/ai-bot/600/400"
                width="600"
                height="400"
                alt="AI Chat"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                data-ai-hint="robot abstract"
              />
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
