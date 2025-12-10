import { LoginForm } from '@/components/login-form';
import { HitechLogo } from '@/components/hitech-logo';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-sm">
            <div className="flex justify-center mb-8">
                <HitechLogo />
            </div>
            <LoginForm />
        </div>
    </main>
  );
}
