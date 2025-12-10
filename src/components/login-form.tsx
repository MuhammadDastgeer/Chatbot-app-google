"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { loginUserAction } from "@/app/actions";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const result = await loginUserAction(values);

    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      });
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: result.message,
      });
    }
  }

  return (
    <div className="w-full text-center">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">Sign In</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-4">or use your account</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input type="email" placeholder="Email" {...field} className="bg-gray-100 dark:bg-gray-800 border-none"/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} placeholder="Password" {...field} className="bg-gray-100 dark:bg-gray-800 border-none pr-10"/>
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowPassword((prev) => !prev)}>
                          {showPassword ? <EyeOff /> : <Eye />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center mt-2">
                <Link href="/forgot-password" passHref>
                    <Button variant="link" className="px-0 h-auto text-sm font-medium text-muted-foreground hover:text-primary">Forgot your password?</Button>
                </Link>
            </div>
            <Button type="submit" className="w-full max-w-xs mx-auto block !h-12 text-base rounded-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </Form>
    </div>
  );
}
