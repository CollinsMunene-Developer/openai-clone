/**
 * Authentication Actions: Server-Side Auth Handler
 * --------------------------------------------
 * Think of this as the security desk that:
 *
 * - Processes All Authentication Requests:
 *   • New user registration (signup)
 *   • User login verification
 *   • Password management (reset/update)
 *   • Email verification handling
 *   • Logout processing
 *
 * - Handles Security Validation:
 *   • Validates all form inputs
 *   • Checks for existing accounts
 *   • Verifies password requirements
 *   • Manages email verification status
 *
 * - Manages Response States:
 *   • Success/error messages
 *   • Verification states
 *   • Loading states
 *   • Redirect handling
 */

"use server";

import { cookies } from "next/headers";
import { isValidPassword } from "../utils/auth/password-validation";
import { createClient } from "../utils/supabase/server";
import { AUTH_ALERTS } from "../lib/auth/alerts/auth-alerts";
import {
  AuthFormState,
  ResetPasswordFormState,
  UpdatePasswordFormState,
} from "../types/auth";

/**
 * Handles new user registration
 * Validates inputs, checks for existing accounts, and initiates email verification
 */
export async function signup(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  cookies();
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const errors: AuthFormState["errors"] = {};

  if (!fullName || fullName.trim().length < 2) {
    errors.fullName = AUTH_ALERTS.FORM.VALIDATION.FULL_NAME_REQUIRED.message;
  }

  if (!email || !email.includes("@")) {
    errors.email = AUTH_ALERTS.FORM.VALIDATION.EMAIL_REQUIRED.message;
  }

  if (!isValidPassword(password)) {
    errors.password = AUTH_ALERTS.FORM.VALIDATION.PASSWORD_REQUIREMENTS.message;
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const supabase = await createClient();

  try {
    // First attempt to sign up - if the user exists, Supabase will return an error
    const redirectUrl = new URL(
      `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    );
    redirectUrl.searchParams.set("email_verify", email);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl.toString(),
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      // Handle specific error cases
      if (error.message.includes('User already registered')) {
        // Check if the user is verified by attempting to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: 'dummy-password-to-check-verification',
        });

        const isUnverified = signInError?.message.includes('Email not confirmed');

        return {
          errors: {
            email: isUnverified
              ? AUTH_ALERTS.SIGNUP.ACCOUNT_EXISTS_UNVERIFIED.message
              : AUTH_ALERTS.SIGNUP.ACCOUNT_EXISTS.message,
          },
          verificationPending: isUnverified,
          email: email,
          success: false,
          alert: isUnverified
            ? AUTH_ALERTS.SIGNUP.ACCOUNT_EXISTS_UNVERIFIED
            : AUTH_ALERTS.SIGNUP.ACCOUNT_EXISTS,
        };
      }

      console.error("Signup error:", error);
      return {
        errors: {
          general: AUTH_ALERTS.SIGNUP.ERROR.message,
        },
        success: false,
      };
    }

    // If we get here, the signup was successful
    return {
      success: true,
      message: AUTH_ALERTS.SIGNUP.SUCCESS.message,
      email: email,
    };
  } catch (err) {
    console.error("Signup error:", err);
    return {
      errors: {
        general: AUTH_ALERTS.SIGNUP.ERROR.message,
      },
      success: false,
    };
  }
}

/**
 * Handles user login attempts
 * Validates credentials and manages authentication state
 */
export async function login(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  console.log("Server login action started");
  cookies();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Login attempt for email:", email);
  // Validate inputs
  if (!email || !email.includes("@")) {
    return {
      errors: {
        email: AUTH_ALERTS.FORM.VALIDATION.EMAIL_REQUIRED.message,
      },
      loading: false,
    };
  }

  if (!password) {
    return {
      errors: {
        password: AUTH_ALERTS.FORM.VALIDATION.PASSWORD_REQUIREMENTS.message,
      },
      loading: false,
    };
  }

  try {
    const supabase = await createClient();
    console.log("Supabase client created");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("Auth response received:", authError ? "error" : "success");

    if (authError) {
      if (authError.code === "email_not_confirmed") {
        return {
          errors: {
            general: "email_not_confirmed",
          },
          verificationPending: true,
          email: email,
          loading: false,
        };
      }

      return {
        errors: {
          general: AUTH_ALERTS.LOGIN.ERROR.message,
        },
        loading: false,
      };
    }

    return {
      success: true,
      loading: false,
      message: AUTH_ALERTS.LOGIN.SUCCESS.message,
    };
  } catch (err) {
    console.error("Login server error:", err);
    return {
      errors: {
        general: AUTH_ALERTS.LOGIN.ERROR.message,
      },
      loading: false,
    };
  }
}

/**
 * Combined auth handler for login/signup
 * Routes to appropriate handler based on mode
 */
export async function auth(
  mode: "login" | "signup",
  prevState: AuthFormState,
  formData: FormData
) {
  if (mode === "login") {
    return login(prevState, formData);
  }
  return signup(prevState, formData);
}

/**
 * Handles user logout
 * Clears authentication state and session
 */
export async function logout() {
  cookies();
  const supabase = await createClient();

  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (error) {
    console.error("Error in logout action:", error);
    return { success: false };
  }
}

/**
 * Handles resending verification emails
 * Uses signup flow as PKCE workaround for consistent token format
 */
export async function resendVerification(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return {
      errors: {
        email: AUTH_ALERTS.FORM.VALIDATION.EMAIL_REQUIRED.message,
      },
    };
  }

  const supabase = await createClient();

  try {
    const redirectUrl = new URL(
      `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    );
    redirectUrl.searchParams.set("email_verify", email);
    // *** Workaround to maintain PKCE flow ***
    // Use signUp instead of resend to maintain PKCE flow
    // This is a workaround because the resend method doesn't support PKCE tokens as yet
    // which causes inconsistent verification link formats. By using signUp, we ensure
    // both initial and resent verification links use the same PKCE token format.
    // The "user already exists" error is expected and treated as success.
    // Previously, using resend() would generate a non-PKCE token that resulted in
    // "Could not verify email: No verification code provided" errors in the callback.
    const { error } = await supabase.auth.signUp({
      email,
      password: `${crypto.randomUUID()}${crypto.randomUUID()}`.slice(0, 20),
      options: {
        emailRedirectTo: redirectUrl.toString(),
        data: {
          email_confirm_resend: true, // flag to identify this was a resend
        },
      },
    });

    if (error) {
      if (error.message.includes("unique")) {
        return {
          success: true,
          message: AUTH_ALERTS.VERIFICATION.RESEND_SUCCESS.message,
          email: email,
        };
      }

      return {
        errors: {
          general: AUTH_ALERTS.VERIFICATION.RESEND_ERROR.message,
        },
      };
    }

    return {
      success: true,
      message: AUTH_ALERTS.VERIFICATION.RESEND_SUCCESS.message,
      email: email,
    };
  } catch {
    return {
      errors: {
        general: AUTH_ALERTS.VERIFICATION.RESEND_ERROR.message,
      },
    };
  }
}

/**
 * Initiates password reset process
 * Sends reset instructions to user's email
 */
export async function resetPassword(
  prevState: ResetPasswordFormState,
  formData: FormData
): Promise<ResetPasswordFormState> {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return {
      errors: {
        email: AUTH_ALERTS.FORM.VALIDATION.EMAIL_REQUIRED.message,
      },
    };
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Password reset error:", error);
      }
      return {
        errors: {
          general: AUTH_ALERTS.PASSWORD.RESET_ERROR.message,
        },
      };
    }

    return {
      success: true,
      message: AUTH_ALERTS.PASSWORD.RESET_SUCCESS.message,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Password reset error:", error);
    }
    return {
      errors: {
        general: AUTH_ALERTS.PASSWORD.RESET_ERROR.message,
      },
    };
  }
}

/**
 * Handles password updates
 * Validates new password and updates user credentials
 */
export async function updatePassword(
  prevState: UpdatePasswordFormState,
  formData: FormData
): Promise<UpdatePasswordFormState> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 8) {
    return {
      errors: {
        password: AUTH_ALERTS.FORM.VALIDATION.PASSWORD_MIN_LENGTH.message,
      },
    };
  }

  if (password !== confirmPassword) {
    return {
      errors: {
        confirmPassword:
          AUTH_ALERTS.FORM.VALIDATION.PASSWORDS_DONT_MATCH.message,
      },
    };
  }

  const supabase = await createClient();

  try {
    // Verify we have an authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        errors: {
          general: AUTH_ALERTS.PASSWORD.LINK_EXPIRED.message,
        },
      };
    }

    // Now we can update the password
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Password update error:", error);
      }
      return {
        errors: {
          general: AUTH_ALERTS.PASSWORD.UPDATE_ERROR.message,
        },
      };
    }

    // Sign out after successful password reset
    await supabase.auth.signOut();

    return {
      success: true,
      message: AUTH_ALERTS.PASSWORD.UPDATE_SUCCESS.message,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Password update error:", error);
    }
    return {
      errors: {
        general: AUTH_ALERTS.PASSWORD.UPDATE_ERROR.message,
      },
    };
  }
}
