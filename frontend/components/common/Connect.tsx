import React from 'react';
import { useNear } from '../../hooks/useNear';
import useUser from '../../hooks/useUser';
import { initContract } from '../near/near';

export default function Connect() {
  const [nearContext] = useNear();
  const connect = async () => {
    await nearContext.walletConnection.requestSignIn(
      nearContext.nearConfig.contractName[0]
    );
  };
  return (
    <button type="button" onClick={connect}>
      <img
        src="/near-protocol-near-logo.png"
        alt="near logo"
        className="w-96"
      />
    </button>
  );
}
