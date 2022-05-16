import { useRouter } from 'next/router';
import React from 'react';
import Event from '../../models/Event';

interface EventCardProps {
  data: Event;
}

export default function EventCard({ data }: EventCardProps) {
  console.log(data);
  const months: Map<number, string> = new Map<number,string>([
    [1, 'January'],
    [2, 'February'],
    [3, 'March'],
    [4, 'April'],
    [5, 'May'],
    [6, 'June'],
    [7, 'July'],
    [8, 'August'],
    [9, 'September'],
    [10, 'October'],
    [11, 'November'],
    [12, 'December'],
  ]);
  function getMonth(monthInNumber: number): string {
    return months.get(monthInNumber);
  }
  const router = useRouter();
  return (
    <div className="w-80 my-4 lg:w-96 lg:h-96 md:w-75 md:h-75 sm:w-60 sm:h-60">
      <div>
        <div>
          <img
            src={data?.banner}
            alt={data?.name}
            onClick={() => router.push(`/app/event/${data?.index}`)}
            className="rounded-t-2xl lg:h-64 lg:object-cover cursor-pointer"
          />
        </div>
        <div className="bg-figma-300 rounded-b-2xl">
          <div className="flex space-x-4 p-3">
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push(`/app/event/${data?.index}`)}
              >
                <h2 className="text-lg text-figma-100 lg:text-2xl">
                  {getMonth(parseInt(data?.date.trimEnd().split('-')[1]))}
                </h2>
                <h2 className="text-figma-500 text-2xl font-semibold lg:text-3xl">
                  {data?.date.trimEnd().split('-')[0]}
                  //{console.log(data?.date)}
                </h2>
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => router.push(`/app/event/${data?.index}`)}
              >
                <h2 className="lg:text-xl">{data?.name}</h2>
              </button>
              <h2 className="text-sm font-light lg:text-base">
                {data?.description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
