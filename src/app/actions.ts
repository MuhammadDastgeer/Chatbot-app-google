'use server';

import { z } from 'zod';

const registerUserSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterUserResponse = {
  success: boolean;
  message: string;
};

export async function registerUserAction(data: unknown): Promise<RegisterUserResponse> {
  const validatedFields = registerUserSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors.map((e) => e.message).join(', '),
    };
  }

  const { username, email, password } = validatedFields.data;

  try {
    const response = await fetch('https://o4tdkmt2.rpcl.app/webhook-test/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP error! Status: ${response.status}`;
      console.error('Webhook Error:', errorMessage);
      return {
        success: false,
        message: `Failed to register. ${errorMessage}`,
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      message: responseData.message || 'Registration successful!',
    };
  } catch (error) {
    console.error('Fetch Error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please check your network connection and try again.',
    };
  }
}
