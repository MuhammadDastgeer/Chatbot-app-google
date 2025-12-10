import { ResetPasswordForm } from '@/components/reset-password-form';
import { Suspense } from 'react';

function ResetPasswordContent() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
            <ResetPasswordForm />
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
