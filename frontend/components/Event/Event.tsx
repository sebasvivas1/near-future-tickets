import { useRouter } from 'next/router';
import React from 'react';
import useUser from '../../hooks/useUser';
import Event from '../../models/Event';

interface EventProps {
  event: Event;
}

export default function EventData({ event }: EventProps) {
  enum EventStatus {
    Pending,
    Confirmed,
    Canceled,
  }
  const router = useRouter();
  const [user] = useUser();
  return (
    <div className="px-7 mt-8 mx-auto">
    <div className="content-center min-h-screen md:flex md:flex-col lg:flex lg:flex-col px-8 mt-3">
      <div className="mb-28 bg-lime-800 rounded-tr-md rounded-tl-md px-3 mt-3 rounded-b-md">
        <div className="lg:flex lg:justify-between lg:w-full lg:h-auto lg:p-8 sm:flex sm:flex-row md:row-start-1 content-center">
          <div className="text-figma-300 mt-8">
            <h2 className="lg:text-9xl md:text-7xl sm:text-5xl font-semibold">{event?.name}</h2>
            <h2 className="lg:text-2xl md:text-2xl ">{event?.description}</h2>
          </div>
          <div className="px-8 lg:w-1/3 md:w-2/4 sm:w-2/4 mt-8">
            <img src={event?.banner} alt={event?.name} className="rounded-xl" />
          </div>
        </div>
        <div className="bg-emerald-900 rounded-2xl lg:py-7 lg:px-11 lg:text-center">
        <div className="text-figma-300 lg:p-8 lg:flex lg:justify-between">
          <div>
            <h2 className="lg:text-3xl">Event Information</h2>
            <h2>{event?.name}</h2>
            <h2>Total Capacity: {event?.capacity}</h2>
            <h2>Status: {EventStatus[event?.status]}</h2>
            <h2>Date of the event: {event?.date} Hardcoded 17-APR</h2>
            <h2>Available Tickets:</h2>
            {event?.tickets?.map((ticket, x) => (
              <div key={x}>
                <h2>
                  {x + 1} {'. '}
                  {ticket?.metadata?.title.toUpperCase()}
                </h2>
              </div>
            ))}
          </div>
          <div>
            {user === event?.organizer ? (
              <div>
                <button
                  type="button"
                  className="bg-figma-500 lg:px-4 lg:py-1.5 text-figma-400 lg:text-lg font-semibold rounded-lg"
                  onClick={() =>
                    router.push(`/app/event/update/${event?.index}`)
                  }
                >
                  Update Event
                </button>
              </div>
            ) : (
              <div className="bg-figma-500 rounded-2xl lg:w-96 lg:h-36 lg:p-5">
                <h2 className="text-xl">Organizer: {event?.organizer}</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      <div className="lg:fixed lg:bottom-0 md:fixed md:bottom-0 w-full sm:content-center">
        <div className="bg-figma-400 rounded-t-2xl lg:py-7 lg:px-11 lg:text-center">
          <div className="lg:flex lg:justify-evenly md:flex md:justify-evenly sm:justify-center ">
          {event?.tickets?.map((ticket, x) => (
              <div key={x+10}>
                <div className=' px-10 md:px-5 lg:px-0'>
                <h2>
                  {/* {x + 1} {'. '} */}
                  {ticket?.metadata?.title.toUpperCase().trimEnd().split('-')[1]}
                </h2>
                <button className="btn bg-transparent hover:bg-indigo-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Buy now</button>
              </div>
                </div>
            ))}
            {/* <div>
              <h2 className="text-figma-500">Date</h2>
              <h2>17 Apr 2022</h2>
            </div>
            <div>
              <h2 className="text-figma-500">Date</h2>
              <h2>17 Apr 2022</h2>
            </div>
            <div>
              <h2 className="text-figma-500">Date</h2>
              <h2>17 Apr 2022</h2>
            </div>
            <div>
              <h2 className="text-figma-500">Date</h2>
              <h2>17 Apr 2022</h2>
            </div>
            <div>
              <button
                type="button"
                className="bg-figma-500 lg:px-4 lg:py-1.5 text-figma-400 rounded-md"
              >
                Buy Now!
              </button> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
