import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
import BusOperatorsContent from './BusOperatorsContent';

export default function BusOperatorsPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <BusOperatorsContent />
      </Suspense>
      <Footer />
    </>
  );
}