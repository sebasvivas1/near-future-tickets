import React from 'react';
import Layout from '../../../components/common/Layout';
import NewEvent from '../../../components/Events/NewEvent';
import { Seo } from '../../../components/Seo/Seo';

export default function index() {
  return (
    <Layout>
      <Seo
        metaTitle="Organize a new event!"
        metaDescription="Make your dream come true by organizing your next event!"
        shareImage="/logo_vertical.png"
      />
      <NewEvent />
    </Layout>
  );
}
