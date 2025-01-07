/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
  // Call cookies() first to opt out of caching
  cookies();
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");

  redirect("/");
}

export async function logout()

{
    cookies();
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/auth/login");

}
