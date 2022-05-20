import { useRouter } from 'next/router';
import React from 'react';
import { useNear } from '../../hooks/useNear';
import useUser from '../../hooks/useUser';
import Event from '../../models/Event';
import { LogOutIcon, SunIcon, UserIcon } from '../icons';
import { initContract } from '../near/near';
import SearchBar from './SearchBar';

export default function Navbar() {
  const router = useRouter();
  const [nearContext] = useNear();
  const [user, setUser] = useUser();
  const [events, setEvents] = React.useState<Array<Event>>(null);
  const [isOpen, setIsOpen] = React.useState(false);

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

  const getEvents = async () => {
    const { contracts } = await initContract();
    // @ts-ignore: Unreachable code error
    setEvents(await contracts.nftContract.get_events());
  };

  React.useEffect(() => {
    getEvents();
  }, []);

  return (
    <div className="min-w-full text-figma-400 px-4 py-2 text-lg self-center h-auto fixed top-0 z-50 bg-figma-200">
      <div className="flex justify-between">
        <div className="self-center">
          <img
            src="/logo_horizontal.png"
            alt=""
            className="w-52 cursor-pointer"
            onClick={() => router.push('/app')}
          />
        </div>
        <div className="self-center">
          <div className="flex space-x-24">
            <button
              type="button"
              onClick={() => router.push('/app')}
              className="hover:bg-figma-100/[.2] p-4"
            >
              <h2
                className={`font-semibold ${
                  currentPage === '/app'
                    ? 'underline underline-offset-8 decoration-figma-500 decoration-4'
                    : ''
                }`}
              >
                Home
              </h2>
            </button>
            <button
              type="button"
              onClick={() => router.push('/app/events')}
              className="hover:bg-figma-100/[.2] p-4"
            >
              <h2
                className={`font-semibold ${
                  currentPage === '/app/events'
                    ? 'underline underline-offset-8 decoration-figma-500 decoration-4'
                    : ''
                }`}
              >
                All Events
              </h2>
            </button>
            <button
              type="button"
              onClick={() => router.push('/app/profile')}
              className="hover:bg-figma-100/[.2] p-4"
            >
              <h2
                className={`font-semibold ${
                  currentPage === '/app/profile'
                    ? 'underline underline-offset-8 decoration-figma-500 decoration-4'
                    : ''
                }`}
              >
                My Events
              </h2>
            </button>
          </div>
        </div>
        <div className="self-center">
          <SearchBar
            className="rounded-lg border-2 h-8 py-px px-3"
            events={events}
          />
        </div>
        <div className="flex justify-center align-middle hover:bg-figma-100/[.2] px-4 hover:cursor-pointer">
          <SunIcon className="w-7" />
        </div>
        <div className="flex self-center">
          {user === '' ? (
            <button
              className="bg-figma-500 w-full rounded-lg px-6 py-1.5 hover:bg-figma-500/[.9] "
              onClick={logIn}
            >
              Login
            </button>
          ) : (
            <div>
              <button
                className="hover:bg-figma-100/[.2] p-4 hover:text-figma-500"
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              >
                <UserIcon className="w-9" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        {isOpen ? (
          <div className="text-figma-300 text-lg flex justify-end w-full">
            <div className="w-1/6 bg-figma-200 p-4">
              <div className="px-6">
                <h2 className="mt-2">{user}</h2>
              </div>
              <div
                className="px-6 hover:text-figma-500 hover:cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                  logOut();
                }}
              >
                <h2 className="mt-2">Logout</h2>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
