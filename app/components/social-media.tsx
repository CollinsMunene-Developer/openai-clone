"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import {
  appleicon,
  githubicon,
  Googleicon,
  microsofticon,
} from "../public/icons/icons";
import { useFormStatus } from "react-dom";
import { type SocialAuthButtonProps, type SocialAuthState } from "../types/ui";
import { Icons } from "./ui/icons";


function SocialAuthButton({ provider, loading, onClick }: SocialAuthButtonProps) {
  const { pending } = useFormStatus()
  const isLoading = loading || pending
  
  const Icon = {
    github: Icons.gitHub,
    google: Icons.google,
    microsoft: Icons.microsoft,
    apple: Icons.apple,
  }[provider]

  return (
    <Button 
      variant="outline" 
      type="button" 
      disabled={isLoading}
      onClick={onClick}
      className={provider !== 'github' ? '-mt-4' : ''}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icon className="mr-2 h-4 w-4" />
      )}{" "}
      {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </Button>
  )
}

interface SocialMediaButtonsProps {
  onSocialAuthStateChange?: (state: SocialAuthState) => void;
}
export function SocialMediaButtons({
  onSocialAuthStateChange,
}: SocialMediaButtonsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleMicrosoftLogin = async () => {
    try {
      // Call Microsoft login handler
      setIsLoading("microsoft");
      onSocialAuthStateChange?.({
        redirecting: true,
        provider: "microsoft",
      });
      const response = await fetch("/api/auth/microsoft");
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }
      window.location.href = data.url;
    } catch (error) {
      console.error("Microsoft login error:", error);
      onSocialAuthStateChange?.({
        redirecting: false,
        provider: undefined,
      });
    } finally {
      setIsLoading(null);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      setIsLoading("google");
      onSocialAuthStateChange?.({
        redirecting: true,
        provider: "google",
      });

      const response = await fetch("/api/auth/google");
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Google login error:", error);
      onSocialAuthStateChange?.({
        redirecting: false,
        provider: undefined,
      });
    } finally {
      setIsLoading(null);
    }
  };
  const handleGithubLogin = async () => {
    try {
      setIsLoading("github");
      onSocialAuthStateChange?.({
        redirecting: true,
        provider: "github",
      });

      const response = await fetch("/api/auth/github");
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Github login error:", error);
      onSocialAuthStateChange?.({
        redirecting: false,
        provider: undefined,
      });
    } finally {
      setIsLoading(null);
    }
  };
  const handleAppleLogin = async () => {
    try {
      setIsLoading("apple");
      onSocialAuthStateChange?.({
        redirecting: true,
        provider: "apple",
      });

      const response = await fetch("/api/auth/apple");
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Apple login error:", error);
      onSocialAuthStateChange?.({
        redirecting: false,
        provider: undefined,
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div>
      <div className="">
        {/* <Button className="w-full justify-start px-14 text-lg h-12 bg-white text-black flex gap-4 hover:bg-gray-300"
        loading = {isLoading === "google"}
        provider="google"
        onClick={handleGoogleLogin}
        >
          <Image src={Googleicon} alt="Googleicon" width={30} height={30} />
          Continue with Google
        </Button>
        <Button className="w-full justify-start px-14 text-lg h-12 bg-white text-black flex gap-4 hover:bg-gray-300">
          <Image src={microsofticon} alt="microsoft" width={20} height={20} />
          Continue with Microsoft Account
        </Button>
        <Button className="w-full justify-start text-lg px-14 h-12 bg-white text-black flex gap-4 hover:bg-gray-300">
          <Image src={appleicon} alt="apple" width={30} height={30} />
          Continue with Apple
        </Button>
        <Button className="w-full justify-start text-lg px-14 h-12 bg-white text-black flex gap-4 hover:bg-gray-300">
          <Image src={githubicon} alt="github" width={30} height={30} />
          Continue with Github
        </Button> */}

<div className=" gap-2 items-center justify-center flex "> 
<SocialAuthButton 
          provider="google" 
          loading={isLoading === "google"} 
          onClick={handleGoogleLogin}
        />
        <SocialAuthButton 
          provider="microsoft" 
          loading={isLoading === "microsoft"} 
          onClick={handleMicrosoftLogin}
        />
        <SocialAuthButton 
          provider="apple" 
          loading={isLoading === "apple"} 
          onClick={handleAppleLogin}
        />
        <SocialAuthButton 
          provider="github" 
          loading={isLoading === "github"} 
          onClick={handleGithubLogin}
        />
</div>
        <p className="text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
