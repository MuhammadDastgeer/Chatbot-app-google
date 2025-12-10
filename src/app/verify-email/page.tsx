import { EmailVerificationForm } from '@/components/email-verification-form';
import { Suspense } from 'react';

function VerifyEmailContent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <EmailVerificationForm />
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
