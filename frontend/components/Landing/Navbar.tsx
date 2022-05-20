import { useRouter } from 'next/router';
import React from 'react';

export default function Navbar() {
  const router = useRouter();
  return (
    <div className="flex justify-between">
      <div className="self-center">
        <img src="/logo_horizontal.png" alt="" className="w-72" />
      </div>
      <div className="self-center">
        <button
          type="button"
          className="bg-figma-500 text-figma-400 text-lg p-2 rounded-lg lg:px-4"
          onClick={() => router.push('/app')}
        >
          Launch
        </button>
      </div>
    </div>
  );
}
