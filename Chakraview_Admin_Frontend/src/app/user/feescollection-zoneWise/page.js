import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeesCollectionZoneWiseContent from './feesCollectionZoneWiseContent';

export default function FeesCollectionZoneWisePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <FeesCollectionZoneWiseContent />
      </Suspense>
      <Footer />
    </>
  );
}