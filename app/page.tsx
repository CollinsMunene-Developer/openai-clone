import Signup from '@/components/Signup'
import React from 'react'
import { Chatgptlogo } from './public/icons/icons'
import Image from 'next/image'
import AuthForm from '@/components/Signup'

const page = () => {
  return (
    <div className='items-center flex flex-col justify-center gap-6 w-full h-screen ' >
      <div className="">
        <Image src={Chatgptlogo} alt="Chatgptlogo" width={100} height={100}   />

      </div>
      <div className="">
        <AuthForm />
      </div>
      
    </div>
  )
}

export default page
