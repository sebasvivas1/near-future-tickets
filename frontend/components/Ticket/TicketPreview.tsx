import React from 'react';
import Token from '../../models/Token';
import { TicketModal } from '../modal/TicketModal';

interface TicketPreviewProps {
  ticket: Token;
}

export default function TicketPreview({ ticket }: TicketPreviewProps) {
  const [isOpen, setOpen] = React.useState(false);
  const truncate = (str: string = null) => {
    return str?.length > 31 ? str.substring(0, 30) + '...' : str;
  };
  return (
    <div className="flex justify-center align-middle">
      {ticket !== undefined ? (
        <div
          className="w-maxwi px-4 my-4 lg:maxwi group hover:cursor-pointer flex align-middle"
          onClick={() => setOpen(true)}
        >
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
                    src={ticket?.metadata?.media}
                    alt={ticket?.metadata?.title}
                    className="rounded-t-2xl w-maxwi lg:object-contain cursor-pointer"
                  />
                </div>
                <div className="bg-figma-300 rounded-b-2xl h-14 lg:h-20">
                  <div className="flex p-2">
                    <div>
                      <button type="button">
                        <h2 className="text-sm lg:text-xl">
                          {truncate(ticket?.metadata?.title)}
                        </h2>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full my-4 lg:w-56 group hover:cursor-pointer">
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
                    src={ticket?.metadata.media}
                    alt={ticket?.metadata?.title}
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
                        <h2 className="lg:text-xl">
                          {ticket?.metadata?.title}
                        </h2>
                      </button>
                      <h2 className="text-sm font-light lg:text-base">
                        {truncate(ticket?.metadata?.description)}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <TicketModal isOpen={isOpen} setOpen={setOpen} ticket={ticket} />
    </div>
  );
}
