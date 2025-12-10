import { EmailVerificationForm } from '@/components/email-verification-form';
import { Suspense } from 'react';
import { HitechLogo } from '@/components/hitech-logo';

function VerifyEmailContent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-sm">
            <div className="flex justify-center mb-8">
                <HitechLogo />
            </div>
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
