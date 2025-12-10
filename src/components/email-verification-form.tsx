"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

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
import { verifyEmailAction } from "@/app/actions";

const formSchema = z.object({
  email: z.string().email(),
  code: z.string().min(1, {
    message: "Please enter the verification code.",
  }),
});

function EmailVerificationFormComponent() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      code: "",
    },
  });

  useEffect(() => {
    form.setValue("email", email);
  }, [email, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const result = await verifyEmailAction(values);

    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      });
      if (result.message === 'Email verified successfully! You can now log in.') {
        router.push("/login");
      }
    } else {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: result.message,
      });
    }
  }

  return (
    <div className="w-full bg-card p-8 rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Verify Your Email</h1>
        <p className="text-sm text-muted-foreground mt-2">Enter the code sent to your email to complete registration.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full mt-6 !h-12 text-base" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Email
          </Button>
        </form>
      </Form>
       <p className="mt-8 text-center text-sm text-muted-foreground">
          Wrong email?{" "}
          <Link href="/" className="font-medium text-primary hover:underline">
            Register again
          </Link>
        </p>
    </div>
  );
}

export function EmailVerificationForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerificationFormComponent />
    </Suspense>
  )
}
