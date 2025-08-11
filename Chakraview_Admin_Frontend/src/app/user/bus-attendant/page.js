import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BusAttendantContent from './BusAttendantContent';

export default function BusAttendantPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <BusAttendantContent />
      </Suspense>
      <Footer />
    </>
  );
}