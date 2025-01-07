import React, { useState } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { appleicon, githubicon, Googleicon, microsofticon } from '@/app/public/icons/icons';

const SocialMediaButtons = () => {
    const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
              <div className="justify-center flex flex-col gap-2">
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
      
    </div>
  )
}

export default SocialMediaButtons
