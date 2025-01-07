import SignupForm from '@/components/authentication/Signup-form'
import { ModeToggle } from '@/components/ThemeToggle'
import React from 'react'
import Image from 'next/image'
import { Chatgptlogo } from '@/app/public/icons/icons'

const page = () => {
  return (
    <div className='items-center flex flex-col justify-center  w-full h-screen mt-16 ' >
 
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
