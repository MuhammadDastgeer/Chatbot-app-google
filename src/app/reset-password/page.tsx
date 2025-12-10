import { ResetPasswordForm } from '@/components/reset-password-form';
import { Suspense } from 'react';
import { HitechLogo } from '@/components/hitech-logo';


function ResetPasswordContent() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
            <div className="w-full max-w-sm">
                <div className="flex justify-center mb-8">
                    <HitechLogo />
                </div>
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
