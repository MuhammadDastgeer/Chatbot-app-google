import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { HitechLogo } from '@/components/hitech-logo';

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-sm">
            <div className="flex justify-center mb-8">
                <HitechLogo />
            </div>
            <ForgotPasswordForm />
        </div>
    </main>
  );
}
