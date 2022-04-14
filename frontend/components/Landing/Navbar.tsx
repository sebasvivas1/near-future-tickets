import React from 'react';

export default function Navbar() {
  return (
    <div className="flex justify-between">
      <div className="self-center">
        <h2 className="text-4xl font-semibold text-figma-300">NFT</h2>
      </div>
      <div>
        <button
          type="button"
          className="bg-figma-500 text-figma-400 text-lg p-2 rounded-lg lg:px-4"
        >
          Launch
        </button>
      </div>
    </div>
  );
}
