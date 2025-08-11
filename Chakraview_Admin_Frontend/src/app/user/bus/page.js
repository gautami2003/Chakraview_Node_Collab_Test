import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BusContent from './BusContent';

export default function BusPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <BusContent />
      </Suspense>
      <Footer />
    </>
  );
}