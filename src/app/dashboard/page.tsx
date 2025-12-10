import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
       <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-end">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg bg-card">
            <CardHeader>
            <CardTitle className="text-3xl text-center">Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-center text-muted-foreground">Welcome to your dashboard!</p>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
