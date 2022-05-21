import { useRouter } from 'next/router';
import React from 'react';
import Event from '../../models/Event';
import EventCard from '../Events/EventCard';
import { initContract } from '../near/near';

export default function Events() {
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
    <div className="lg:mt-24 min-h-screen">
      {events.length > 0 ? (
        <div>
          <div className="p-4 lg:p-8">
            <div className="flex justify-between h-full lg:px-9">
              <h2 className="text-figma-400 font-semibold lg:text-2xl lg:self-center">
                Upcoming Events
              </h2>
              <button
                type="button"
                className="bg-figma-500 text-figma-400 px-4 py-1.5 rounded-lg lg:px-6 lg:py-2 lg:text-xl"
                onClick={() => router.push('/app/new')}
              >
                New Event
              </button>
            </div>
            <div className="lg:grid lg:grid-cols-3 lg:justify-items-center lg:mt-8">
              {events.map((event, i) => (
                <div className="" key={i}>
                  <EventCard data={event} key={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* <div>
            <Carousel />
          </div> */}
          <div className="p-4 lg:p-8">
            <div className="flex justify-between h-full lg:px-9">
              <h2 className="text-figma-400 font-semibold lg:text-2xl lg:self-center">
                Loading Events...
              </h2>
              <button
                type="button"
                className="bg-figma-500 text-figma-400 px-4 py-1.5 rounded-lg lg:px-6 lg:py-2 lg:text-xl hover:bg-figma-300 hover:text-figma-500 transition duration-700 hover:duration-300"
                onClick={() => router.push('/app/new')}
              >
                New Event
              </button>
            </div>
            <div className="lg:grid lg:grid-cols-3 lg:justify-items-center lg:mt-8">
              <div className="">
                <EventCard />
              </div>
              <div className="">
                <EventCard />
              </div>
              <div className="">
                <EventCard />
              </div>
              <div className="">
                <EventCard />
              </div>
              <div className="">
                <EventCard />
              </div>
              <div className="">
                <EventCard />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
