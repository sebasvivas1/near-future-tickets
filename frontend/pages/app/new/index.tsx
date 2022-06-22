import React from 'react';
import Connect from '../../../components/common/Connect';
import Layout from '../../../components/common/Layout';
import NewEvent from '../../../components/Events/NewEvent';
import { Seo } from '../../../components/Seo/Seo';
import useUser from '../../../hooks/useUser';

export default function index() {
  const [user] = useUser();
  return (
    <Layout>
      <Seo
        metaTitle="Organize a new event!"
        metaDescription="Make your dream come true by organizing your next event!"
        shareImage="/logo_vertical.png"
      />
      {user ? (
        <NewEvent />
      ) : (
        <div className="min-h-screen w-full flex justify-center align-middle text-figma-400 text-2xl items-center">
          <Connect />
        </div>
      )}
    </Layout>
  );
}
