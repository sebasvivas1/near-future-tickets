import { useRouter } from 'next/router';
import React from 'react';
import { useNear } from '../../hooks/useNear';
import useUser from '../../hooks/useUser';
import Event from '../../models/Event';
import { LogOutIcon } from '../icons';
import { initContract } from '../near/near';
import SearchBar from './SearchBar';

export default function Navbar() {
  const router = useRouter();
  const [nearContext] = useNear();
  const [user, setUser] = useUser();
  const [events, setEvents] = React.useState<Array<Event>>(null);

  const currentPage = router.route;

  const logIn = async () => {
    await nearContext.walletConnection.requestSignIn(
      nearContext.nearConfig.contractName[0]
    );
  };

  const logOut = async () => {
    await setUser('');
    await nearContext.walletConnection.signOut();
  };

  return (
    <div className="w-full text-figma-400 p-4 text-lg">
      <div className="flex justify-between">
        <div className="">
          <h2 className="drop-shadow-md text-3xl">NEAR Future Tickets</h2>
        </div>
        <div className="flex space-x-24">
          <h2>Home</h2>
          <h2>All Events</h2>
          <h2>My Events</h2>
        </div>
        <SearchBar
          className="rounded-lg border-2 h-8 py-px px-3"
          events={events}
        />
        <div>
          {user === '' ? (
            <div>
              <button
                type="button"
                className="bg-figma-500 text-figma-400 font-semibold w-full h-auto px-6 py-2 rounded-lg"
                onClick={() => {
                  logIn();
                }}
              >
                Login
              </button>
            </div>
          ) : (
            <div>
              <h2 className="bg-figma-500 text-figma-400 font-semibold w-full h-auto px-6 py-2 rounded-lg">
                {user}
              </h2>
              <button
                className=" hover:text-gray-400 text-white w-5 h-full ml-3"
                onClick={() => {
                  logOut();
                }}
              >
                <LogOutIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
