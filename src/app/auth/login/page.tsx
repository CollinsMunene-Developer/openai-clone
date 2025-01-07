/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from 'react'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/GlobalAuthStateManager';
import LoginForm from '@/components/authentication/login-form';
import { AlertProvider } from '@/context/GlobalAlertManager';

const Login = () => {
  return (
    <div className='items-center flex justify-center ' >
    <LoginForm />
    </div>
  )
}

export default Login
