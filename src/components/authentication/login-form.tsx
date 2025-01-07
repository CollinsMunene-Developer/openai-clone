import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CheckCircle2, AlertCircle } from "lucide-react";
import SocialMediaButtons from "../social-media";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

const LoginForm = () => {
  const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, { message: "Password is required" }),
  });

  const [ showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const showAlert = (
    type: "success" | "error",
    title: string,
    description: string
  ) => {
    setAlertInfo({
      show: true,
      type,
      title,
      description,
    });
    setTimeout(() => {
      setAlertInfo((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  const onSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      // Handle login logic here
      console.log("Login values:", values);
    } catch (error) {
      showAlert(
        "error",
        "Login Error",
        "An error occurred during login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md justify-center flex flex-col">
      {alertInfo.show && (
        <Alert
          variant={alertInfo.type === "success" ? "default" : "destructive"}
          className="mb-4"
        >
          {alertInfo.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{alertInfo.title}</AlertTitle>
          {alertInfo.description && (
            <AlertDescription>{alertInfo.description}</AlertDescription>
          )}
        </Alert>
      )}

      <div className="align-center justify-center flex gap-4 mb-8">
        <h1 className="text-3xl font-bold">Login</h1>
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
                    placeholder="Email address*"
                    {...field}
                    disabled={isLoading}
                    className="w-full font-bold text-xl h-14 border-green-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      className="w-full text-xl font-bold h-14 border-green-400"
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
            className="w-full h-12 bg-green-400 hover:bg-green-700"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Login"}
          </Button>
          <div className="flex justify-between">
            <Link href="/auth/signup">
              <span className="text-green-400">Create an account</span>
            </Link>
            
            <Link href="/auth/forgot-password">
              <span className="text-green-400">Forgot password?</span>
            </Link>
          </div>

        </form>
      </Form>

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
};

export default LoginForm;
