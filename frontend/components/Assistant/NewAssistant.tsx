import React from 'react';
import Event from '../../models/Event';
import { initContract } from '../near/near';
import QRScanner from '../QR/QRScanner';

interface NewAssistantProps {
  event: Event;
}

export default function NewAssistant({ event }: NewAssistantProps) {
  const [user, setUser] = React.useState('');

  const setUsername = async () => {
    const { contracts } = await initContract();
    setUser(contracts.nftContract.account.accountId);
  };

  React.useEffect(() => {
    setUsername();
  }, []);
  console.log(user);
  return (
    <div className="min-h-screen">
      {user ? (
        <div>
          {user === event?.organizer ? (
            <div>
              <QRScanner />
            </div>
          ) : (
            <div>
              <p>You are not the organizer of this event.</p>
            </div>
          )}
        </div>
      ) : (
        <div>Not Connected</div>
      )}
    </div>
  );
}
