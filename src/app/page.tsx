import { UserRegistrationForm } from '@/components/user-registration-form';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl rounded-lg shadow-2xl bg-card overflow-hidden md:grid md:grid-cols-2">
        <div className="p-8 md:p-12">
          <UserRegistrationForm />
        </div>
        <div className="hidden md:flex flex-col items-center justify-center bg-primary p-12 text-center text-primary-foreground">
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <p className="mt-4">To keep connected with us please login with your personal info</p>
          <Link href="/login" className="mt-6 inline-block rounded-md border-2 border-primary-foreground px-6 py-2 text-sm font-semibold hover:bg-primary-foreground hover:text-primary transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
