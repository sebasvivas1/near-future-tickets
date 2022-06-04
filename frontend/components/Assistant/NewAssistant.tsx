import React from 'react';
import useUser from '../../hooks/useUser';
import Event from '../../models/Event';
import QRScanner from '../QR/QRScanner';

interface NewAssistantProps {
  event: Event;
}

export default function NewAssistant({ event }: NewAssistantProps) {
  const [user] = useUser();

  return (
    <div>
      {user ? (
        <div>
          {user === event?.organizer ? (
            <div>
              <QRScanner />
            </div>
          ) : (
            <div>Only Organizer can do this action</div>
          )}
        </div>
      ) : (
        <div>Not Connected</div>
      )}
    </div>
  );
}
