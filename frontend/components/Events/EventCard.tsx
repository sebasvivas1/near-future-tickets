import { useRouter } from 'next/router';
import React from 'react';
import Event from '../../models/Event';

interface EventCardProps {
  data?: Event;
}

export default function EventCard({ data }: EventCardProps) {
  const router = useRouter();
  const [month, setMonth] = React.useState('');
  const [day, setDay] = React.useState('');

  const truncate = (str: string = null) => {
    return str?.length > 31 ? str.substring(0, 30) + '...' : str;
  };
  const formatDate = () => {
    const x: Date = new Date(data?.date);
    const mon = x.toLocaleString('default', { month: 'short' });
    const da = x.toLocaleString('default', { day: 'numeric' });
    setMonth(mon);
    setDay(da);
  };

  React.useEffect(() => {
    formatDate();
  }, []);

  // console.log(month);
  return (
    <div>
      {data !== undefined ? (
        <div className="w-80 my-4 lg:w-96 lg:h-96 group hover:cursor-pointer">
          <div className="relative group-hover:transform group-hover:scale-105 group-hover:duration-500 duration-700">
            <div
              className="absolute -inset-0.5 bg-gradient-to-tl from-green-400 to-blue-700 rounded-lg blur-md
          opacity-75
          group-hover:animate-tilt
          group-hover:opacity-100
          transition
          duration-1000
          group-hover:duration-200"
            ></div>
            <div className="relative">
              <div className="">
                <div>
                  <img
                    src={data?.banner}
                    alt={data?.name}
                    onClick={() => router.push(`/app/event/${data?.index}`)}
                    className="rounded-t-2xl lg:h-64 lg:object-cover cursor-pointer"
                  />
                </div>
                <div className="bg-figma-300 rounded-b-2xl">
                  <div className="flex space-x-4 p-3 ">
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => router.push(`/app/event/${data?.index}`)}
                      >
                        <h2 className="text-lg text-figma-100 lg:text-2xl">
                          {month.toLocaleUpperCase()}
                        </h2>
                        <h2 className="text-figma-500 text-2xl font-semibold lg:text-3xl">
                          {day}
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
                        {truncate(data?.description)}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-80 my-4 lg:w-96 lg:h-96 group hover:cursor-pointer">
          <div className="relative group-hover:transform group-hover:scale-105 group-hover:duration-500 duration-700">
            <div
              className="absolute -inset-0.5 bg-gradient-to-tl from-green-400 to-blue-700 rounded-lg blur-md
          opacity-75
          group-hover:animate-tilt
          group-hover:opacity-100
          transition
          duration-1000
          group-hover:duration-200"
            ></div>
            <div className="relative">
              <div className="">
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
                    <div className="text-center  rounded-md h-6">
                      <div className="text-lg w-full text-figma-100 lg:text-2xl bg-gray-200 rounded-md"></div>
                      <div className="text-figma-500 w-full text-2xl font-semibold lg:text-3xl bg-gray-200 rounded-md"></div>
                    </div>
                    <div>
                      <button type="button">
                        <h2 className="lg:text-xl">{data?.name}</h2>
                      </button>
                      <h2 className="text-sm font-light lg:text-base">
                        {truncate(data?.description)}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
