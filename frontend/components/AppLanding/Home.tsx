import { useRouter } from 'next/router';
import React from 'react';
import Event from '../../models/Event';
import EventCard from '../Events/EventCard';
import { initContract } from '../near/near';
export default function Home() {
  const [events, setEvents] = React.useState<Array<Event>>([]);

  const getEvents = async () => {
    const { contracts } = await initContract();
    // @ts-ignore: Unreachable code error
    setEvents(await contracts.nftContract.get_events());
  };

  React.useEffect(() => {
    getEvents();
  }, [events]);
  const router = useRouter();

  return (
    <div className="p-4">
      <div className="flex justify-between h-full">
        <h2 className="text-figma-400 font-semibold">All Events</h2>
        <button
          type="button"
          className="bg-figma-500 text-figma-400 px-4 py-1.5 rounded-lg"
          onClick={() => router.push('/app/new')}
        >
          New Event
        </button>
      </div>
      {events.map((event, i) => (
        <div className="flex justify-center">
          <EventCard data={event} key={i} />
        </div>
      ))}
    </div>
  );
}
