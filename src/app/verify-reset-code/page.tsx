import { VerifyResetCodeForm } from '@/components/verify-reset-code-form';
import { Suspense } from 'react';

function VerifyResetCodeContent() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
            <VerifyResetCodeForm />
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