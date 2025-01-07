import React from 'react'
import { Chatgptlogo } from './public/icons/icons'
import Image from 'next/image'
import { ModeToggle } from '@/components/ThemeToggle'
import SignupForm from '@/components/authentication/Signup-form'

const page = () => {
  return (
    <div className='items-center flex flex-col justify-center gap-6 w-full h-screen ' >
      <div className="">
        <ModeToggle />
      </div>
      <div className="">
        <Image src={Chatgptlogo} alt="Chatgptlogo" width={100} height={100}   />

      </div>
      <div className="">
        <SignupForm />
      </div>
      
    </div>
  )
}

export default page
