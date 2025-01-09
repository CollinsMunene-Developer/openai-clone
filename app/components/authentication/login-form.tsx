"use client"

import * as React from "react"
import { useFormStatus } from 'react-dom'
import { Icons } from "../ui/icons"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { PasswordInput } from "./password-input"
import Link from "next/link"
import { LoginFormProps } from "../../types/ui"
import SocialMediaButtons from "../social-media"

function SignInButton() {
  const { pending } = useFormStatus()
  
  return React.useMemo(() => (
    <Button 
      disabled={pending}
      className="w-full h-12 bg-green-400 hover:bg-green-700"
    >
      {pending && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
      <span className="text-white">Sign In</span>
    </Button>
  ), [pending])
}

export function LoginForm({
  loginState = { loading: false },  // Provide default value
  loginAction,
  formRef,
  formData,
  setFormData,
  loginErrors
}: LoginFormProps) {
  const isLoading = loginState?.loading ?? false  // Safe access with fallback

  return (
    <div className="w-full max-w-md justify-center flex flex-col">
      <div className="align-center justify-center flex gap-4 mb-8">
        <h1 className="text-3xl font-bold">Login</h1>
      </div>

      <form ref={formRef} action={loginAction}>
        <div className="grid gap-6">
          <div className="grid">
            <Label htmlFor="loginEmail" className="text-xs text-gray-600 mb-1">
              Email
            </Label>
            <Input
              id="loginEmail"
              name="email"
              placeholder="Email address*"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={formData.loginEmail}
              onChange={e => setFormData((prev) => ({ 
                ...prev, 
                loginEmail: e.target.value 
              }))}
              className="w-full font-bold text-xl h-14 border-green-400"
            />
            {loginErrors?.email && (
              <p className="text-sm text-red-500 mt-1">{loginErrors.email}</p>
            )}
          </div>

          <div className="grid">
            <Label htmlFor="loginPassword" className="text-xs text-gray-600 mb-1">
              Password
            </Label>
            <PasswordInput
              id="loginPassword"
              name="password"
              placeholder="Password*"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              value={formData.loginPassword}
              onChange={e => setFormData((prev) => ({ 
                ...prev, 
                loginPassword: (e as React.ChangeEvent<HTMLInputElement>).target.value 
              }))}
              showRequirements={false}
              showSuccessMessage={false}
              className="w-full text-xl font-bold h-14 border-green-400"
            />
            {loginErrors?.password && (
              <p className="text-sm text-red-500 mt-1">{loginErrors.password}</p>
            )}
          </div>

          <SignInButton />

          <div className="flex justify-between">
            <Link href="/auth/signup">
              <span className="text-green-400">Create an account</span>
            </Link>

            <Link href="/auth/forgot-password">
              <span className="text-green-400">Forgot password?</span>
            </Link>
          </div>
        </div>
      </form>

      <div className="mt-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 h-px bg-gray-300"></div>
          <p className="mx-4 text-gray-500">OR</p>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
      </div>

      <SocialMediaButtons />

      <div className="mt-6 flex justify-center gap-4 text-sm">
        <p className="text-green-400 cursor-pointer">Terms of use</p>
        <span className="text-gray-500">|</span>
        <p className="text-green-400 cursor-pointer">Privacy Policy</p>
      </div>
    </div>
  )
}