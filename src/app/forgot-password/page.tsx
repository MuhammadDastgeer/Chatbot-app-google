import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-black p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-4xl rounded-2xl bg-card text-card-foreground shadow-2xl overflow-hidden md:grid md:grid-cols-2">
        <div className="p-8 md:p-12 flex flex-col justify-center">
            <ForgotPasswordForm />
        </div>
        <div className="hidden md:flex flex-col items-center justify-center p-12 text-center bg-primary text-primary-foreground">
          <h2 className="text-4xl font-bold mb-4">Remember It?</h2>
          <p className="mb-8">If you remember your password, just head back to the login page.</p>
          <Link href="/login" passHref>
             <button className="w-full max-w-xs bg-transparent border-2 border-primary-foreground text-primary-foreground font-bold py-3 px-4 rounded-full hover:bg-primary-foreground hover:text-primary transition-colors duration-300">
                Sign In
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
