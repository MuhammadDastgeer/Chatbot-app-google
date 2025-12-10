import { EmailVerificationForm } from '@/components/email-verification-form';
import { Suspense } from 'react';
import Link from 'next/link';

function VerifyEmailContent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-4xl rounded-lg shadow-2xl bg-card overflow-hidden md:grid md:grid-cols-2">
            <div className="p-8 md:p-12">
                <EmailVerificationForm />
            </div>
            <div className="hidden md:flex flex-col items-center justify-center bg-primary p-12 text-center text-primary-foreground">
                <h1 className="text-3xl font-bold">One Last Step!</h1>
                <p className="mt-4">We've sent a verification code to your email. Please enter it to continue.</p>
                <Link href="/login" className="mt-6 inline-block rounded-md border-2 border-primary-foreground px-6 py-2 text-sm font-semibold hover:bg-primary-foreground hover:text-primary transition-colors">
                    Back to Sign In
                </Link>
            </div>
        </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
