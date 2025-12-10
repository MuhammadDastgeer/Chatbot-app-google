import { LoginForm } from '@/components/login-form';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-4xl rounded-lg shadow-2xl bg-card text-card-foreground overflow-hidden md:grid md:grid-cols-2">
        <div className="p-8 md:p-12">
            <LoginForm />
        </div>
        <div className="hidden md:flex flex-col items-center justify-center bg-primary p-12 text-center text-primary-foreground">
            <h1 className="text-3xl font-bold">Hello, Friend!</h1>
            <p className="mt-4">Enter your personal details and start your journey with us</p>
            <Link href="/" className="mt-6 inline-block rounded-md border-2 border-primary-foreground px-6 py-2 text-sm font-semibold hover:bg-primary-foreground hover:text-primary transition-colors">
                Sign Up
            </Link>
        </div>
      </div>
    </main>
  );
}
