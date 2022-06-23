import React from 'react';
import { useNear } from '../../hooks/useNear';

export default function Connect() {
  const [nearContext] = useNear();
  const connect = async () => {
    await nearContext.walletConnection.requestSignIn();
  };
  return (
    <button
      type="button"
      className="min-h-screen flex items-center justify-center align-middle w-full"
      onClick={connect}
    >
      <img
        src="/near-protocol-near-logo.png"
        alt="near logo"
        className="w-96"
      />
    </button>
  );
}
