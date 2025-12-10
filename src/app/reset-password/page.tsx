import { ResetPasswordForm } from '@/components/reset-password-form';
import { Suspense } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';


function ResetPasswordContent() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-sm">
                <ResetPasswordForm />
            </div>
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
