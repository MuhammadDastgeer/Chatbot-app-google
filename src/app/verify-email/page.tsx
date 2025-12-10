import { EmailVerificationForm } from '@/components/email-verification-form';
import { Suspense } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

function VerifyEmailContent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <div className="absolute top-4 right-4">
            <ThemeToggle />
        </div>
        <div className="w-full max-w-sm">
            <EmailVerificationForm />
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
