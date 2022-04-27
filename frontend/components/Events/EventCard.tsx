import React from 'react';
import Event from '../../models/Event';

interface EventCardProps {
  data: Event;
}

export default function EventCard({ data }: EventCardProps) {
  return (
    <div className="w-80 my-4">
      <div>
        <div>
          <img src={data?.banner} alt={data?.name} className="rounded-t-2xl" />
        </div>
        <div className="bg-figma-300 rounded-b-2xl">
          <div className="flex space-x-4 p-3">
            <div className="text-center">
              <h2 className="text-lg text-figma-100">APR</h2>
              <h2 className="text-figma-500 text-2xl font-semibold">17</h2>
            </div>
            <div>
              <h2 className="">{data?.name}</h2>
              <h2 className="text-sm font-light">{data?.description}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
