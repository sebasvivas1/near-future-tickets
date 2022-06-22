import React from 'react';
import Connect from '../../../components/common/Connect';
import Layout from '../../../components/common/Layout';
import Profile from '../../../components/Profile/Profile';
import useUser from '../../../hooks/useUser';

export default function ProfilePage() {
  const [user] = useUser();
  return (
    <Layout>
      {user ? (
        <Profile />
      ) : (
        <div className="min-h-screen w-full flex justify-center align-middle text-figma-400 text-2xl items-center">
          <Connect />
        </div>
      )}
    </Layout>
  );
}
