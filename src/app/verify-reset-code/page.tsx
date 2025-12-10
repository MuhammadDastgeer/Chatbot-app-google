import { VerifyResetCodeForm } from '@/components/verify-reset-code-form';
import { Suspense } from 'react';
import { HitechLogo } from '@/components/hitech-logo';

function VerifyResetCodeContent() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-8">
                <HitechLogo />
            </div>
            <VerifyResetCodeForm />
          </div>
        </main>
    );
}

export default function VerifyResetCodePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyResetCodeContent />
        </Suspense>
    );
}
