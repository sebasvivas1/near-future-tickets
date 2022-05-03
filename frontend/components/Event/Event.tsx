import React from 'react';
import Event from '../../models/Event';

interface EventProps {
  event: Event;
}

export default function EventData({ event }: EventProps) {
  return (
    <div className="min-h-screen lg:flex lg:flex-col">
      <div className="mb-28">
        <div className="lg:flex lg:justify-between lg:w-full lg:h-auto lg:p-8">
          <div className="text-figma-300">
            <h2 className="lg:text-9xl font-semibold">{event?.name}</h2>
            <h2 className="lg:text-2xl ">{event?.description}</h2>
          </div>
          <div className="lg:w-1/4">
            <img src={event?.banner} alt={event?.name} className="" />
          </div>
        </div>
        <div className="text-figma-300 lg:p-8">
          <div>
            <h2 className="lg:text-3xl">Event Information</h2>
            <h2>{event?.name}</h2>
            <h2>Total Capacity: {event?.capacity}</h2>
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
        </div>
      </div>
      <div className="lg:fixed lg:bottom-0 w-full">
        <div className="bg-figma-400 rounded-t-xl lg:py-7 lg:px-11 lg:text-center">
          <div className="lg:flex lg:justify-between">
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
              <h2 className="text-figma-500">Date</h2>
              <h2>17 Apr 2022</h2>
            </div>
            <div>
              <button
                type="button"
                className="bg-figma-500 lg:px-4 lg:py-1.5 text-figma-400 rounded-md"
              >
                Buy Now!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
