import { useRouter } from 'next/router';
import React from 'react';
import useUser from '../../hooks/useUser';
import Event from '../../models/Event';
import Modal from '../modal/Modal';
import { initContract } from '../near/near';
import TokenSeriesJson from '../../models/TokenSeriesJson';
import GiftIcon from '../icons/GiftIcon';
import { Input } from '../inputs/Input';
import { ONE_NEAR_IN_YOCTO } from '../utils';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import Geocode from 'react-geocode';
import QRIcon from '../icons/QRIcon';

interface EventProps {
  event: Event;
}
type Libraries = (
  | 'drawing'
  | 'geometry'
  | 'localContext'
  | 'places'
  | 'visualization'
)[];
const libraries: Libraries = ['places'];
export default function EventData({ event }: EventProps) {
  const router = useRouter();
  const [user] = useUser();
  const [isOpen, setIsOpen] = React.useState(false);
  const [receiver, setReceiver] = React.useState(user);
  const [asGift, setAsGif] = React.useState(false);
  const [month, setMonth] = React.useState('');
  const [day, setDay] = React.useState('');
  const [year, setYear] = React.useState('');
  const [center, setCenter] = React.useState({ lat: 0, lng: 0 });

  Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  const formatDate = () => {
    const x: Date = new Date(event?.date);
    const mon = x.toLocaleString('default', { month: 'long' });
    setMonth(mon);
    const y = event?.date?.split('-');
    setDay(y[2]);
    setYear(y[0]);
  };

  // Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  React.useEffect(() => {
    formatDate();
  }, []);

  const buyTicket = async (
    ticket: TokenSeriesJson,
    forMe: boolean,
    receiver?: string
  ) => {
    if (forMe) {
      setReceiver(user);
    }
    const { contracts } = await initContract();
    // @ts-ignore: Unreachable code error
    await contracts.nftContract.mint_ticket(
      {
        token_series_id: ticket.token_series_id,
        receiver_id: receiver,
      },
      '300000000000000',
      BigInt(ticket?.price + 465000000000000000000000).toString()
    );
  };

  const refactorLocation = async (location) => {
    const L = {
      lat: 0,
      lng: 0,
    };
    await Geocode.fromAddress(location).then(
      (resp) => {
        const { lat, lng } = resp.results[0].geometry.location;
        L.lat = lat;
        L.lng = lng;
        setCenter(L);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  React.useEffect(() => {
    if (event?.location !== '' || null) {
      const location = event?.location;
      refactorLocation(location);
    }
  }, []);

  return (
    <div className="min-h-screen lg:flex lg:flex-col lg:mt-24">
      <div className="mb-28 bg-transparent rounded-tr-md rounded-tl-md px-3 mt-3 rounded-b-md">
        <div className="lg:flex lg:justify-between lg:w-full lg:h-auto lg:p-8 bg-bg-event sm:flex sm:flex-row md:row-start-1 content-center">
          <div className="text-figma-300 lg:w-6/12">
            <h2 className="lg:text-8xl md:text-7xl sm:text-5xl font-semibold xl:w-3/6 lg:w-2/6 md-lg:w-2/6 md:w-1/4 sm:w-1/4 ml-5 mr-5">{event?.name}</h2>
            <h2 className="lg:text-2xl mt-4 md:text-xs">{event?.description}</h2>
          </div>
          <div className=/*lg:w-1/3*/ "px-8  lg:w-3/6 md:w-3/4 sm:w-3/4 mt-8 ">
            <img src={event?.banner} alt={event?.name} className="rounded-xl ml-2 mr-2" />
          </div>
        </div>

        <div className="bg-transparent rounded-2xl lg:py-7 lg:px-11">
        <div className="text-figma-300 lg:p-8 lg:flex lg:justify-between lg:align-middle">
          <div>
            <h2 className="lg:text-3xl">Event Information</h2>
            <h2>{event?.name}</h2>
            <h2>Total Capacity: {event?.capacity}</h2>
            <h2>Status: {event?.status}</h2>
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
              <div className="space-x-3">
                <button
                  type="button"
                  className="bg-figma-500 lg:px-4 lg:py-1.5 text-figma-400 lg:text-lg font-semibold rounded-lg align-top"
                  title="Verify assistant"
                  onClick={() =>
                    router.push(`/app/event/${event?.index}/assistant`)
                  }
                >
                  <QRIcon className="w-7" />
                </button>
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
              <div className="bg-figma-500 rounded-2xl lg:w-96 lg:h-36 lg:p-5 ">
                <h2 className="text-xl">Organizer: {event?.organizer}</h2>
              </div>
            )}
          </div>
        </div>
        {isLoaded ? (
          <div className="px-6 mb-8 text-left">
            <h2 className="text-figma-300 mb-3">{event?.location}</h2>
            <GoogleMap
              center={center}
              zoom={16}
              mapContainerClassName="w-96 h-48 rounded-xl"
              options={{
                streetViewControl: false,
                mapTypeControl: false,
              }}
            >
              <Marker position={center} />
            </GoogleMap>
          </div>
        ) : (
          <div>
            <h2>map loading...</h2>
          </div>
        )}
      </div>
      </div>
      <div className="lg:fixed lg:bottom-0 w-full">
        <div className="bg-figma-400 rounded-t-2xl lg:py-7 lg:px-11 lg:text-center">
          <div className="lg:flex lg:justify-between">
            <div>
              <h2 className="text-figma-500">Date</h2>
              <h2>
                {day} {month} {year}
              </h2>
            </div>
            <div>
              <h2 className="text-figma-500">Time</h2>
              <h2>{event?.time}</h2>
            </div>
            <div>
              <h2 className="text-figma-500">Price</h2>
              <h2>4/7/14 NEAR</h2>
            </div>

            <div>
              <button
                type="button"
                className="bg-figma-500 lg:px-4 lg:py-1.5 text-figma-400 rounded-md"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                Buy Now!
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        setOpen={setIsOpen}
        isOpen={isOpen}
        className="w-5/6 bg-gray-200 p-12 h-3/4"
      >
        <div className="w-full">
          {event.tickets.map((ticketType, index) => (
            <div
              key={index}
              className="text-gray-700 lg:mt-3 lg:flex lg:flex-col w-1/3 bg-gray-300/[.4] rounded-lg overflow-scroll items-center align-middle lg:mb-3 font-semibold"
            >
              <img src={ticketType?.metadata?.media} alt="Ticket banner" className='w-full h-auto object-contain'/>
              <div className="text-xl py-1 lg:flex lg:justify-between w-full">
                <div>
                <h2>
                  {ticketType?.metadata?.title || 'No Ticket'} 
                </h2>
                </div>
                <div>
                  <h2>
                  Price:{' '}
                  {Math.round(
                    (ticketType?.price / ONE_NEAR_IN_YOCTO + Number.EPSILON) *
                      100
                  ) / 100} NEAR
                  </h2>
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-between lg:py-3 items-center align-middle w-full">
                  <div className="w-full">
                  {!asGift ? (
                    <button
                      type="button"
                      className="lg:px-4 lg:py-1.5 rounded-lg bg-figma-500 text-figma-400 lg:text-lg font-semibold drop-shadow-md lg:w-full"
                      onClick={() => buyTicket(ticketType, true, receiver)}
                    >
                      Buy for me
                    </button>
                  ) : null}
                  </div>
                  <div
                    className=" text-figma-500 cursor-pointer drop-shadow-md"
                    onClick={() => setAsGif(!asGift)}
                  >
                    <GiftIcon className={`w-9 ${asGift ? 'hidden': 'block'}`} />
                  </div>
                </div>
                {asGift ? (
                  <div>
                  <div className="text-gray-800 w-full flex justify-between">
                    <div className="w-full">
                    <h2>Receiver Account</h2>
                    <Input
                      required
                      type="text"
                      id="receiver"
                      name="receiver"
                      placeholder=""
                      className="h-8 text-sm rounded-lg my-3 text-black"
                      setValue={setReceiver}
                      label=""
                    />
                    </div>
                     <div
                    className=" text-figma-500 cursor-pointer drop-shadow-md flex align-middle mt-2"
                    onClick={() => setAsGif(!asGift)}
                  >
                    <GiftIcon className="w-9" />
                  </div>
                  </div>
                    <button
                      type="button"
                      className="lg:px-4 lg:py-1.5 rounded-lg bg-figma-500 text-figma-400 w-full"
                      onClick={() => buyTicket(ticketType, false, receiver)}
                    >
                      Buy as Gift
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
