import React from 'react';
import Home from '../../components/AppLanding/Home';
import Carousel from '../../components/Carousel/Carousel';
import Layout from '../../components/common/Layout';
import { Seo } from '../../components/Seo/Seo';

export default function LandingDapp() {
  return (
    <Layout>
      <Seo
        metaTitle="Upcoming Events"
        metaDescription="A list of upcoming events"
        shareImage="/logo_vertical.png"
      />
      <Home />
    </Layout>
  );
}
