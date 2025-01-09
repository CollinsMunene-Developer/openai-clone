"use client"

import * as React from "react"
import { useFormState, useFormStatus } from 'react-dom'

import Link from "next/link"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Alert, AlertTitle, AlertDescription } from "../ui/alert"
import { Info } from "lucide-react"
import { Icons } from "../ui/icons"

import { ResetPasswordFormState } from "../../types/auth"
import { resetPassword } from "../../actions/auth-service"
import { cn } from "../../utils/styles/styleUtils"
function ResetButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button disabled={pending} className="mt-3 bg-black text-white">
      {pending && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
      Send Reset Instructions
    </Button>
  )
}

export function ForgotPasswordForm({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  const [state, formAction] = useFormState<ResetPasswordFormState, FormData>(resetPassword, {})

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {state.success ? (
        <Alert className="bg-blue-50 border-blue-200 [&>svg]:top-3">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-700 font-bold">Check Your Email</AlertTitle>
          <AlertDescription className="text-sm">
            {state.message}
            <div className="mt-2">
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Back to login
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <form action={formAction}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="text-xs text-gray-600" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                name="email"
              />
              {state.errors?.email && (
                <p className="text-sm text-red-500 mt-1">{state.errors.email}</p>
              )}
            </div>
            <ResetButton />
            {state.errors?.general && (
              <p className="text-sm text-red-500 mt-1">{state.errors.general}</p>
            )}
          </div>
        </form>
      )}
    </div>
  )
} 