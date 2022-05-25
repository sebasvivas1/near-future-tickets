import React from 'react';
import Landing from '../components/Landing/Landing';
import Layout from '../components/Landing/Layout';
import { Seo } from '../components/Seo/Seo';

export default function index() {
  return (
    <div className="min-h-screen min-w-screen bg-figma-200">
      <Layout>
        <Seo
          metaTitle="NEAR Future Tickets"
          metaDescription="Organize events and buy tickets on the Web 3.0"
          shareImage="/logo_vertical.png"
        />
        <Landing />
      </Layout>
    </div>
  );
}
