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
  email?: string;
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
      email: email,
    };
  } catch (error) {
    console.error('Fetch Error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please check your network connection and try again.',
    };
  }
}

const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().min(1, 'Verification code is required'),
});

type VerifyEmailResponse = {
  success: boolean;
  message: string;
};

export async function verifyEmailAction(data: unknown): Promise<VerifyEmailResponse> {
  const validatedFields = verifyEmailSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors.map((e) => e.message).join(', '),
    };
  }

  const { email, code } = validatedFields.data;

  try {
    const response = await fetch('https://o4tdkmt2.rpcl.app/webhook-test/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP error! Status: ${response.status}`;
      console.error('Webhook Error:', errorMessage);
      return {
        success: false,
        message: `Verification failed. ${errorMessage}`,
      };
    }

    const responseData = await response.json();
    if (responseData.message === 'Email verified successfully! You can now log in.') {
        return {
          success: true,
          message: responseData.message
        };
    }
    
    return {
      success: true,
      message: responseData.message || 'Email verified successfully!',
    };
  } catch (error) {
    console.error('Fetch Error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please check your network connection and try again.',
    };
  }
}

const loginUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginUserResponse = {
  success: boolean;
  message: string;
};

export async function loginUserAction(data: unknown): Promise<LoginUserResponse> {
  const validatedFields = loginUserSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors.map((e) => e.message).join(', '),
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const response = await fetch('https://o4tdkmt2.rpcl.app/webhook-test/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const responseData = await response.json().catch(() => ({ message: 'Login failed due to a server error.' }));

    if (!response.ok) {
      return {
        success: false,
        message: responseData.message || `HTTP error! Status: ${response.status}`,
      };
    }

    if (responseData.message === 'Invalid password') {
        return {
            success: false,
            message: responseData.message,
        };
    }

    return {
      success: true,
      message: responseData.message || 'Login successful!',
    };
  } catch (error) {
    console.error('Fetch Error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please check your network connection and try again.',
    };
  }
}
