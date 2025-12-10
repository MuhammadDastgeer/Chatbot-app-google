import { UserRegistrationForm } from '@/components/user-registration-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <UserRegistrationForm />
    </main>
  );
}
