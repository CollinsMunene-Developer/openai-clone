"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Icons } from "../ui/icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PasswordInput } from "./password-input";
import { type SignupFormProps,  } from "../../types/ui";
import Link from "next/link";
import SocialMediaButtons from "../social-media";
import { type AuthFormData } from "../../types/api";

function SignUpButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} className="mt-3 bg-green-400 hover:bg-green-700">
      {pending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      Sign Up
    </Button>
  );
}

export function SignupForm({
  signupState,
  signupAction,
  formRef,
  formData,
  setFormData,
  passwordError,
  setPasswordError,
}: SignupFormProps) {
  return (
    <div className="w-full max-w-md justify-center flex flex-col">
      <div className="align-center justify-center flex mb-4">
        <h1 className="text-3xl font-bold">Create Account</h1>
      </div>

      <form ref={formRef} action={signupAction}>
        <div className="grid gap-2">
          <div className="grid">
            <Label htmlFor="fullName" className="text-xs text-gray-600 mb-1">
              Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              type="text"
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect="off"
              disabled={signupState.loading}
              value={formData.signupName}
              onChange={(e) =>
                setFormData((prev: AuthFormData) => ({
                  ...prev,
                  signupName: e.target.value,
                }))
              }
              className="w-full font-bold text-xl h-14 border-green-400"
            />
            {signupState.errors?.fullName && (
              <p className="text-sm text-red-500 mt-1">
                {signupState.errors.fullName}
              </p>
            )}
          </div>

          <div className="grid mt-3">
            <Label htmlFor="email" className="text-xs text-gray-600 mb-1">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="Enter your email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={signupState.loading}
              value={formData.signupEmail}
              onChange={(e) =>
                setFormData((prev: AuthFormData) => ({
                  ...prev,
                  signupEmail: e.target.value,
                }))
              }
              className="w-full font-bold text-xl h-14 border-green-400"
            />
            {signupState.errors?.email && (
              <p className="text-sm text-red-500 mt-1">
                {signupState.errors.email}
              </p>
            )}
          </div>

          <div className="grid mt-3">
            <Label htmlFor="signupPassword" className="text-xs text-gray-600 mb-1">
              Password
            </Label>
            <PasswordInput
              id="signupPassword"
              name="password"
              placeholder="Enter your password"
              autoCapitalize="none"
              autoComplete="new-password"
              value={formData.signupPassword}
              onChange={(e) => {
                setFormData((prev: AuthFormData) => ({
                  ...prev,
                  signupPassword: (e as React.ChangeEvent<HTMLInputElement>)
                    .target.value,
                }));
                setPasswordError(undefined);
              }}
              showRequirements={true}
              showSuccessMessage={true}
              persistRequirements={true}
              className="w-full text-xl font-bold h-14 border-green-400"
            />
            {passwordError && (
              <p className="text-sm text-red-500 mt-1">{passwordError}</p>
            )}
          </div>

          <SignUpButton />
          {signupState.errors?.general && (
            <p className="text-sm text-red-500 mt-1">
              {signupState.errors.general}
            </p>
          )}
        </div>
      </form>

      <span className="mt-3">
        <p>
          Already have Account?{" "}
          <Link href="/auth/login" className="text-green-400 text-center">
            login
          </Link>
        </p>
      </span>

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
  );
}

export default SignupForm;