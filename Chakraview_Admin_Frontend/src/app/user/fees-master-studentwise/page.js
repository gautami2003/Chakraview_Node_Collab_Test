import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeesMasterStudentwiseContent from './FeesMasterStudentwiseContent';

export default function FeesMasterStudentwisePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <FeesMasterStudentwiseContent />
      </Suspense>
      <Footer />
    </>
  );
}