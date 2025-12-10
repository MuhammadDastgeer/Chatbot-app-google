import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Welcome to your dashboard!</p>
        </CardContent>
      </Card>
    </main>
  );
}
