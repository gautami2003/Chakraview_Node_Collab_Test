import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PickupRouteContent from './PickupRouteContent';

export default function PickupRoutePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <PickupRouteContent />
      </Suspense>
      <Footer />
    </>
  );
}