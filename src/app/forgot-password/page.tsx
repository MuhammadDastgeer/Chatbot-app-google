import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <div className="absolute top-4 right-4">
            <ThemeToggle />
        </div>
        <div className="w-full max-w-sm">
            <ForgotPasswordForm />
        </div>
    </main>
  );
}
