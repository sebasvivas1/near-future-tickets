import React from 'react';
import { useRouter } from 'next/router';

export default function Landing() {
  const router = useRouter();
  return (
    <div className="">
      <div className="min-h-screen">
        <div className="mt-28 text-center lg:mt-52 relative z-50">
          <h2 className="text-figma-300 text-4xl font-semibold lg:text-7xl">
            NEAR FUTURE TICKETS
          </h2>
          <div className="text-figma-300 text-lg text-center mt-7 lg:text-4xl">
            <h2>
              A new way to <span className="text-figma-500">find</span> and{' '}
              <span className="text-figma-500">organize</span> events
            </h2>
          </div>
        </div>
        <div className="text-center mt-8 lg:mt-14 relative z-50">
          <button
            type="button"
            className="text-figma-300 bg-figma-500 rounded-lg py-2 px-4 text-xl lg:text-2xl lg:px-6"
            onClick={() => router.push('/app')}
          >
            Join Now!
          </button>
        </div>
      </div>
      <div className="min-h-screen">
        <div className="flex">
          <h2>prueba</h2>
        </div>
      </div>
    </div>
  );
}
