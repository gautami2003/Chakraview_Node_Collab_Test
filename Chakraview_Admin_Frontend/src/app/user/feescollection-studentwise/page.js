import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeesCollectionStudentwiseContent from './FeesCollectionStudentwiseContent';

export default function FeesCollectionStudentwisePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <FeesCollectionStudentwiseContent />
      </Suspense>
      <Footer />
    </>
  );
}