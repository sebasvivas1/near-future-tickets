import React from 'react';
import { TwitterIcon, FacebookIcon, TelegramIcon } from '../icons';

export default function Footer() {
  return (
    <div className="bg-figma-500 p-8 min-w-full opacity-80">
      <div className="flex justify-between">
        <div className="self-center">
          <h2 className="text-figma-400 text-lg ">
          © All Rights Reserved - NEAR Future Tickets  
         </h2>
      </div>
         <div className="self-center ">
          <div className='flex space-x-16'>
          <TwitterIcon />
          <FacebookIcon/>
          <TelegramIcon/>
          </div>
        </div>
      </div>
      </div>
  );
}
