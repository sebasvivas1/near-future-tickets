import React from 'react';
import { useNear } from '../../hooks/useNear';
import useUser from '../../hooks/useUser';
import { initContract } from '../near/near';
import Footer from './Footer';
import MobileNav from './MobileNav';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const [nearContext, setNearContext] = useNear();
  const [user, setUser] = useUser();

  const setNEARContext = async () => {
    const near = await initContract();
    setNearContext(await near);
    console.log('loading context');
    try {
      const userId = await near.walletConnection.getAccountId();
      if (typeof userId == 'string') {
        try {
          console.log('entro al user');
          setUser(userId);
          console.log('El user es' + userId);
          return;
        } catch (e) {
          console.log(e);
          return;
        }
      }
    } catch (e) {
      console.log(e);
      setUser(null);
    }
  };

  React.useEffect(() => {
    if (!nearContext && !user) {
      setNEARContext();
      return;
    }
    return;
  }, [nearContext]);

  return (
    <div className="bg-figma-200 min-h-screen min-w-full">
      <div className="hidden lg:flex">
        <Navbar />
      </div>
      <div className="lg:hidden">
        <MobileNav />
      </div>
      {children}
      <Footer />
    </div>
  );
}
