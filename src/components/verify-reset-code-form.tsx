"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

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
import { verifyResetCodeAction } from "@/app/actions";

const formSchema = z.object({
  email: z.string().email(),
  code: z.string().min(1, {
    message: "Please enter the reset code.",
  }),
});

function VerifyResetCodeFormComponent() {
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

    const result = await verifyResetCodeAction(values);

    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      });
      router.push(`/reset-password?email=${encodeURIComponent(values.email)}&code=${encodeURIComponent(values.code)}`);
    } else {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: result.message,
      });
    }
  }

  return (
    <div className="w-full">
      <div className="text-left mb-8">
        <h1 className="text-4xl font-bold">Verify Code</h1>
        <p className="text-sm text-muted-foreground mt-2">Enter the reset code sent to your email.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...field}
                    readOnly
                    className="bg-gray-100 dark:bg-gray-800 border-none"
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
                <FormControl>
                  <Input placeholder="Reset Code" {...field} className="bg-gray-100 dark:bg-gray-800 border-none"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full max-w-xs mx-auto block !h-12 text-base rounded-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
        </form>
      </Form>
    </div>
  );
}

export function VerifyResetCodeForm() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyResetCodeFormComponent />
        </Suspense>
    )
}
