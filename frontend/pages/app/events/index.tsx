import React from 'react';
import Layout from '../../../components/common/Layout';
import Events from '../../../components/Events/Events';
import { Seo } from '../../../components/Seo/Seo';

export default function index() {
  return (
    <Layout>
      <Seo
        metaTitle="Event Gallery"
        metaDescription="A list of all events"
        shareImage="/logo_vertical.png"
      />
      <Events />
    </Layout>
  );
}
