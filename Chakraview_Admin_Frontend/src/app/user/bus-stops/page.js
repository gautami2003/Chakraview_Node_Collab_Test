import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BusStopsContent from './BusStopsContent';

export default function BusStopsPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <BusStopsContent />
      </Suspense>
      <Footer />
    </>
  );
}