"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { login, signup } from "@/app/actions/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { useAuth } from "@/app/Context/authContext";
import { appleicon, githubicon, Googleicon, microsofticon } from "@/app/public/icons/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

const AuthForm = () => {
  const { 
    isLogin, 
    setIsLogin, 
    getTitle
  } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    type: 'success' | 'error';
    title: string;
    description?: string;
  }>({
    show: false,
    type: 'success',
    title: '',
    description: ''
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange"
  });

  const showAlert = (type: 'success' | 'error', title: string, description?: string) => {
    setAlertInfo({
      show: true,
      type,
      title,
      description
    });
    
    // Hide alert after 5 seconds
    setTimeout(() => {
      setAlertInfo(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);

      if (isLogin) {
        await login(formData);
      } else {
        await signup(formData);
        setIsLogin(true);
        showAlert(
          'success',
          'Account created successfully',
          'Please log in with your credentials'
        );
      }
    } catch (error) {
      console.error('Authentication error:', error);
      showAlert(
        'error',
        'Authentication Error',
        'An error occurred during authentication. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    form.reset();
    setAlertInfo(prev => ({ ...prev, show: false }));
  };

  return (
    <div className="w-full max-w-md justify-center flex flex-col space-y-4">
      {alertInfo.show && (
        <Alert variant={alertInfo.type === 'success' ? 'default' : 'destructive'} className="mb-4">
          {alertInfo.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{alertInfo.title}</AlertTitle>
          {alertInfo.description && (
            <AlertDescription>
              {alertInfo.description}
            </AlertDescription>
          )}
        </Alert>
      )}

      <div className="align-center justify-center flex gap-4">
        <h1 className="text-4xl font-bold">{getTitle()}</h1>
      </div>

      {/* Rest of your component remains the same */}
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Email FormField */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email address*"
                      {...field}
                      disabled={isLoading}
                      className="w-full font-bold text-xl max-w-4xl h-14 border-green-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Password FormField */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password*"
                        {...field}
                        disabled={isLoading}
                        className="w-full text-xl font-bold h-14 max-w-4xl border-green-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              className="w-full max-w-3xl h-12 bg-green-400 hover:bg-green-700" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : isLogin ? "Login" : "Sign up"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Rest of your JSX remains the same */}
      <div className="flex gap-6 justify-center">
        <p>{isLogin ? "Don't have an account?" : "Already have an Account?"}</p>
        <span 
          className="text-green-400 cursor-pointer text-xl"
          onClick={toggleAuthMode}
        >
          {isLogin ? "Sign up" : "Login"}
        </span>
      </div>

      <div className="align-center justify-center flex gap-6">
        <Separator className="w-1/3 text-xl" />
        <p className="text-xl">OR</p>
        <Separator className="w-1/3" />
      </div>

      <div className="justify-center flex flex-col gap-4">
        <Button 
          className="w-full justify-start px-14 text-lg h-12 bg-white text-black flex gap-4 hover:bg-gray-300"
          disabled={isLoading}
        >
          <Image src={Googleicon} alt="Googleicon" width={30} height={30} />
          Continue with Google
        </Button>
        <Button 
          className="w-full justify-start px-14 text-lg h-12 bg-white text-black flex gap-4 hover:bg-gray-300"
          disabled={isLoading}
        >
          <Image src={microsofticon} alt="microsoft" width={20} height={20} />
          Continue with Microsoft Account
        </Button>
        <Button 
          className="w-full justify-start text-lg px-14 h-12 bg-white text-black flex gap-4 hover:bg-gray-300"
          disabled={isLoading}
        >
          <Image src={appleicon} alt="apple" width={30} height={30} />
          Continue with Apple
        </Button>
        <Button 
          className="w-full justify-start text-lg px-14 h-12 bg-white text-black flex gap-4 hover:bg-gray-300"
          disabled={isLoading}
        >
          <Image src={githubicon} alt="github" width={30} height={30} />
          Continue with Github
        </Button>

        <p className="text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <p className="text-green-400">Terms of use</p>
        |
        <p className="text-green-400">Privacy Policy</p>
      </div>
    </div>
  );
};

export default AuthForm;