/**
 * AuthContent: The Authentication UI Container
 * -----------------------------------------
 * Think of this as the main authentication interface that:
 * 
 * - Manages Authentication Views:
 *   • Login/Signup tabs
 *   • Password reset flows
 *   • Form state management
 * 
 * - Handles UI Presentation:
 *   • Responsive layout
 *   • Branding elements
 *   • Dynamic headings and descriptions
 * 
 * - Maintains User Context:
 *   • Tracks selected authentication mode
 *   • Manages alert states
 *   • Handles form transitions
 */

"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { AlertState, AuthContentProps, AuthMode } from "../../types/ui"
import { ForgotPasswordForm } from "./forgot-password-form"
import { ResetPasswordForm } from "./reset-password-form"


export function AuthContent({ 
  variant = "default"   // Controls which authentication view to display
}: AuthContentProps) {
  // Track current authentication mode (signin/signup)
  const [selectedTab, setSelectedTab] = React.useState<AuthMode>("signin")
  
  // Manage alert states for various authentication scenarios
  const [, setAlertState] = React.useState<AlertState>({
    error: null,                              // Current error message
    message: null,                            // Success/info message
    signupState: {},                          // Signup-specific state
    loginState: {},                           // Login-specific state
    verificationState: { expired: false },    // Email verification status
    isPostSignup: false,                      // Track post-signup state
    showVerificationAlert: false              // Control verification alerts
  })

  return (
    // Main container with responsive width and centered content
    <div className="mx-auto flex w-[350px] flex-col justify-center space-y-6 px-4 sm:px-0">
      <div className="flex flex-col items-center space-y-2 text-center">
     
        {/* Dynamic heading based on current view */}
        <h1 className="text-2xl font-semibold tracking-tight">
          {variant === "forgot-password" 
            ? "Reset Password" 
            : variant === "reset-password"
            ? "Create New Password"
            : selectedTab === "signup" 
            ? "Sign up" 
            : "Log in"}
        </h1>
        {/* Dynamic description text */}
        <p className="text-sm text-muted-foreground">
          {variant === "forgot-password" 
            ? "Enter your email to receive reset instructions"
            : variant === "reset-password"
            ? "Enter and confirm your new password"
            : selectedTab === "signup" 
              ? "Enter your details below to create an account"
              : "Sign in to your account"
          }
        </p>
      </div>

      {/* Conditional form rendering based on variant */}
        {variant === "forgot-password" && <ForgotPasswordForm />}
        {variant === "reset-password" && <ResetPasswordForm />}


      {/* Terms and privacy links */}
      <p className="px-8 text-center text-xs text-muted-foreground">
        By clicking sign in or create account, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}
