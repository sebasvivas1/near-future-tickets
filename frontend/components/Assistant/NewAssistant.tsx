import React from 'react';
import { motion } from 'framer-motion';
import Event from '../../models/Event';
import Token from '../../models/Token';
import { Input } from '../inputs/Input';
import { initContract } from '../near/near';
import TicketPreview from '../Ticket/TicketPreview';

interface NewAssistantProps {
  event: Event;
}

export default function NewAssistant({ event }: NewAssistantProps) {
  const [user, setUser] = React.useState('');
  const [id, setId] = React.useState('');
  const [ticket, setTicket] = React.useState<Token>(null);
  const [confirmed, setConfirmed] = React.useState(false);

  const setUsername = async () => {
    const { contracts } = await initContract();
    setUser(contracts.nftContract.account.accountId);
  };

  React.useEffect(() => {
    setUsername();
  }, []);

  const findTicket = async () => {
    const { contracts } = await initContract();
    // @ts-ignore: Unreachable code error
    const ticket = await contracts.nftContract.nft_token({ token_id: id });
    setTicket(ticket);
    // @ts-ignore: Unreachable code error
    const confirmed = await contracts.nftContract.check_assistance({
      token_id: id,
    });
    if (confirmed === '{"confirmed":false}') {
      setConfirmed(false);
    } else {
      setConfirmed(true);
    }
  };

  const confirmAssistance = async () => {
    const { contracts } = await initContract();
    // @ts-ignore: Unreachable code error
    await contracts.nftContract.confirm_assistance({ token_id: id });
  };

  return (
    <div className="min-h-screen w-full flex justify-center align-middle items-center">
      {user ? (
        <div className="w-full">
          {user === event?.organizer ? (
            <div className="flex justify-center items-center align-middle space-x-14">
              <div className="w-1/4">
                {/* <QRScanner /> */}
                <Input
                  required
                  className="text-figma-400 mt-8 rounded-md"
                  label="Ticket ID *"
                  name="Ticket ID"
                  type="text"
                  placeholder="Enter Ticket Id"
                  value={id}
                  setValue={setId}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="w-full px-2 py-1.5 rounded-md bg-figma-500 text-figma-400 mt-4"
                  onClick={findTicket}
                >
                  Find Ticket
                </motion.button>
              </div>
              <div className="w-1/2">
                {ticket ? (
                  <div className="bg-figma-400 rounded-md flex">
                    <TicketPreview ticket={ticket} />
                    <div className="p-3 w-full min-h-full">
                      <h2>Owner: {ticket?.owner_id}</h2>
                      <h2>Ticket ID: {ticket?.token_id}</h2>
                      {confirmed ? (
                        <div>
                          <motion.button
                            disabled={true}
                            className="w-full px-2 py-1.5 rounded-md bg-figma-500 text-figma-400 text-center mt-4"
                          >
                            Ticket Was already Confirmed
                          </motion.button>
                        </div>
                      ) : (
                        <div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="w-full px-2 py-1.5 rounded-md bg-figma-500 text-figma-400 text-center mt-4"
                            onClick={() => confirmAssistance()}
                          >
                            Confirm Assistance
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-figma-400">
                You are not the organizer of this event.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-figma-400">Not Connected</h2>
        </div>
      )}
    </div>
  );
}
