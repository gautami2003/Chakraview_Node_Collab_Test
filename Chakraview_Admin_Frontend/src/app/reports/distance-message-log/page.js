import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DistanceMessageContent from './DistanceMessageContent';

export default function DistanceMessage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <DistanceMessageContent />
      </Suspense>
      <Footer />
    </>
  );
}