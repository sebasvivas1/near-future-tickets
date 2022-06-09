import { useRouter } from 'next/router';
import React from 'react';
import { useNear } from '../../hooks/useNear';
import useUser from '../../hooks/useUser';
import { LoginIcon } from '../icons';
import { LogOutModal } from '../modal/LogOutModal';

export default function MobileNav() {
  const router = useRouter();
  const [user] = useUser();
  const [nearContext] = useNear();
  const [showModal, setShowModal] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const currentPage = router.route;

  const logIn = async () => {
    await nearContext.walletConnection.requestSignIn(
      nearContext.nearConfig.contractName[0]
    );
  };

  function onMenuClick() {
    setShowMenu(!showMenu);
  }
  function onClick() {
    setShowModal(true);
  }
  return (
    <div className="w-full fixed z-50 bg-figma-200 py-2">
      <div className="flex w-full justify-between items-center px-2">
        <div
          className={`menu-btn w-12 h-12 justify-center ${showMenu ? 'open' : ''}`}
          onClick={onMenuClick}
        >
          <div className="menu-btn__burger h-1 w-6 mt-4 ml-3"></div>
        </div>

        <div className="lg:hidden" onClick={() => router.push('/app')}>
          <img src="/logo_horizontal.png" alt="logo" className="w-36" />
        </div>
        <div>
          {user ? (
            <div className="">
              <button
                onClick={() => router.push('/app/profile')}
                className="bg-figma-300 rounded-full text-figma-300 p-4"
              ></button>
            </div>
          ) : (
            <div>
              <button
                className="bg-figma-100 px-2 py-1.5 text-figma-300 drop-shadow-md rounded-lg"
                onClick={logIn}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        {showMenu ? (
          <div className="bg-gray-600/[.7] text-figma-400 min-h-screen flex text-lg absolute w-full">
            <div className="px-6 bg-figma-200 w-3/4">
              <h2
                className={`mt-2 ${
                  currentPage === '/app'
                    ? 'underline underline-offset-8 decoration-figma-500 decoration-4'
                    : ''
                }`}
                onClick={() => router.push('/app')}
              >
                Home
              </h2>
              <h2
                className={`mt-2 ${
                  currentPage === '/app/events'
                    ? 'underline underline-offset-8 decoration-figma-500 decoration-4'
                    : ''
                }`}
                onClick={() => router.push('/app/events')}
              >
                All Events
              </h2>

              <h2
                className={`mt-2 ${
                  currentPage === '/app/profile'
                    ? 'underline underline-offset-8 decoration-figma-500 decoration-4'
                    : ''
                }`}
                onClick={() => router.push('/app/profile')}
              >
                Profile
              </h2>
              {user ? (
                <button className="mt-2" onClick={() => onClick()}>
                  Logout
                </button>
              ) : (
                <h2
                  className="mt-2
                  "
                  onClick={() => logIn()}
                >
                  Login
                </h2>
              )}
            </div>
          </div>
        ) : null}
      </div>
      <LogOutModal setOpen={setShowModal} isOpen={showModal} />
    </div>
  );
}
