import { VerifyResetCodeForm } from '@/components/verify-reset-code-form';
import { Suspense } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

function VerifyResetCodeContent() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <div className="w-full max-w-sm">
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
