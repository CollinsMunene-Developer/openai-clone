"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { appleicon, githubicon, Googleicon, microsofticon } from "@/app/public/icons/icons";

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

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const gotoLogin = () => {
    router.push("/login");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Handle your form submission here
  }

  return (
    <div className="w-full max-w-md justify-center flex flex-col space-y-4">
      <div className="align-center justify-center flex gap-4">
        <h1 className="text-4xl  font-bold">Create an account</h1>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="text-gray-400 text-2xl">
                    <Input
                      placeholder="Email address* "
                      {...field}
                      className="w-full font-bold text-xl  max-w-4xl h-14 border-green-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.isSubmitted && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="text-gray-400 text-2xl">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password* "
                        {...field}
                        className="w-full  text-xl  font-bold h-14 max-w-4xl  border-green-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button className=" w-full  max-w-3xl h-12   bg-green-400 hover:bg-green-700 " type="submit">
              Continue
            </Button>
          </form>
        </Form>
        {/* {form.formState.errors.email && (
          <Alert variant="destructive">
            {form.formState.errors.email.message}
          </Alert>
        )}
        {form.formState.errors.password && (
          <Alert variant="destructive">
            {form.formState.errors.password.message}
          </Alert>
        )} */}
      </div>

      <div className="flex gap-6 justify-center">
        <p>Already have an Account?</p>
        <span className="text-green-400 cursor-pointer text-xl " onClick={gotoLogin}  >login</span>
      </div>
      <div className="align-center justify-center flex gap-6">
        <Separator className="w-1/3 text-xl " />
        <p className="text-xl" >OR</p>
        <Separator className="w-1/3" />
      </div>

      <div className=" justify-center flex flex-col gap-4">
        <Button className="w-full justify-start px-14 text-lg  h-12 bg-white text-black flex gap-4 hover:bg-gray-300 ">
          <Image src={Googleicon} alt="Googleicon" width={30} height={30} />
          Continue with Google
        </Button>
        <Button className="w-full justify-start px-14 text-lg  h-12 bg-white text-black flex gap-4 hover:bg-gray-300 ">
          <Image src={microsofticon} alt="microsoft" width={20} height={20} />
          Continue with Microsoft Account
        </Button>
        <Button className="w-full justify-start text-lg px-14 h-12 bg-white text-black flex gap-4 hover:bg-gray-300 ">
          <Image src={appleicon} alt="apple" width={30} height={30} />
          Continue with Apple
        </Button>
        <Button className="w-full justify-start text-lg px-14  h-12 bg-white text-black flex gap-4 hover:bg-gray-300 ">
          <Image src={githubicon} alt="github" width={30} height={30} />
          Continue with Github
        </Button>
          
        <p className="text-gray-400" >By continuing, you agree to our Terms of Service and Privacy Policy.</p>



      </div>

      <div className="flex justify-center gap-4  ">
        <p className="text-green-400" >Terms of use</p>
        |
        <p className="text-green-400" >Privacy Policy</p>
        
      </div>
    </div>
  );
};

export default Signup;
