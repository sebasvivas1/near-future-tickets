import React from 'react';
import Connect from '../../../components/common/Connect';
import Layout from '../../../components/common/Layout';
import Profile from '../../../components/Profile/Profile';
import useUser from '../../../hooks/useUser';

export default function ProfilePage() {
  const [user] = useUser();
  return <Layout>{user ? <Profile /> : <Connect />}</Layout>;
}
