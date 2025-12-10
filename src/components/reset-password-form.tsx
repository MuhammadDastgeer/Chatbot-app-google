"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { resetPasswordAction } from "@/app/actions";

const formSchema = z.object({
  email: z.string().email(),
  code: z.string(),
  newPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
  }),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});


function ResetPasswordFormComponent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      code: code,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    form.setValue("email", email);
    form.setValue("code", code);
  }, [email, code, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const result = await resetPasswordAction(values);

    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      });
      router.push("/login");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
  }

  return (
    <div className="w-full bg-card p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-sm text-muted-foreground mt-2">Enter your new password below.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register("email")} />
            <input type="hidden" {...form.register("code")} />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-6 !h-12 text-base" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </form>
        </Form>
        <p className="mt-8 text-center text-sm text-muted-foreground">
            Suddenly remembered?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
                Sign In
            </Link>
        </p>
    </div>
  );
}


export function ResetPasswordForm() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordFormComponent />
        </Suspense>
    )
}
