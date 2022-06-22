import React from 'react';
import useUser from '../../hooks/useUser';
import Token from '../../models/Token';
import { initContract } from '../near/near';
import TicketPreview from '../Ticket/TicketPreview';

export default function Profile() {
  const [tickets, setTickets] = React.useState<Array<Token>>([]);
  const [user] = useUser();
  const [confirmed, setConfirmed] = React.useState<Array<Token>>([]);
  const [notConfirmed, setNotConfirmed] = React.useState<Array<Token>>([]);
  const getTickets = async () => {
    const { contracts } = await initContract();
    setTickets(
      // @ts-ignore: Unreachable code error
      await contracts.nftContract.nft_tokens_for_owner({
        account_id: user,
        from_index: '0',
        limit: 200,
      })
    );
    await refactorExtra();
  };

  const refactorExtra = () => {
    const notConf = [];
    const conf = [];
    tickets.forEach((ticket) => {
      const extra = ticket?.metadata?.extra;
      if (extra === '{"confirmed":false}') {
        notConf.push(ticket);
        // console.table(ticket);
      } else {
        conf.push(ticket);
        // console.table(ticket);
      }
      setConfirmed(conf);
      setNotConfirmed(notConf);
    });
  };

  React.useEffect(() => {
    getTickets();
  }, [tickets]);
  return (
    <div className="p-4 lg:p-8 min-h-screen">
      <div className="">
        <h2 className="text-figma-400 text-xl mt-16 font-semibold lg:text-2xl lg:self-center lg:mt-24">
          Already Confirmed Tickets
        </h2>
      </div>
      <div className="mt-3 md:grid md:grid-cols-3 md:gap-3 lg:grid-cols-6">
        {confirmed.map((ticket, idx) => (
          <div className="" key={idx}>
            <TicketPreview ticket={ticket} />
          </div>
        ))}
      </div>
      <div className="">
        <h2 className="text-figma-400 text-xl mt-16 font-semibold lg:text-2xl lg:self-center lg:mt-24">
          Not Confirmed Tickets
        </h2>
      </div>
      <div className="mt-3 md:grid md:grid-cols-3 md:gap-3 lg:grid-cols-6">
        {notConfirmed.map((ticket, idx) => (
          <div className="" key={idx}>
            <TicketPreview ticket={ticket} />
          </div>
        ))}
      </div>
    </div>
  );
}
