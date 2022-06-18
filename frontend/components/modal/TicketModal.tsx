import React from 'react';
import Token from '../../models/Token';
import Modal from '../modal/Modal';
import QRCode from 'qrcode';

interface TicketModalProps {
  ticket: Token;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TicketModal({ ticket, setOpen, isOpen }: TicketModalProps) {
  const [src, setSrc] = React.useState('');
  React.useEffect(() => {
    QRCode.toDataURL(ticket?.token_id).then((data) => {
      setSrc(data);
    });
  }, []);
  return (
    <Modal
      setOpen={setOpen}
      className="w-full md:w-1/3 bg-white p-12"
      isOpen={isOpen}
    >
      <div className="flex justify-center align-middle w-full mb-10">
        <div>
          <img src={src} alt="Qr" className="w-60 rounded-md" />
        </div>
        <div>
          <h2>Owner: {ticket?.owner_id}</h2>
          <h2>Ticket ID: {ticket?.token_id}</h2>
        </div>
      </div>
    </Modal>
  );
}
