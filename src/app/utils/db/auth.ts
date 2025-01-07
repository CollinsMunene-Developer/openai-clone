import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import { cache } from "react";
import { Tables } from "@/src/types/models";

export const getUser = cache(async () => {
  cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getUserDetails = cache(async () => {
  cookies();
  const supabase = await createClient();
  const user = await getUser();
  const userId = user?.id;
  try {
    const {data, error} = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
    if(error) throw error;
    return data as Tables<'users'> | null;
    
  } catch (error) {
    console.error('Error in  getUserDetails:', error);
    return null;
    
  }
});
