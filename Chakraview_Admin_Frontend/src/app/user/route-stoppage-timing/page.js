import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RouteStoppageTimingContent from './RouteStoppageTimingContent';

export default function RouteStoppageTimingPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <RouteStoppageTimingContent />
      </Suspense>
      <Footer />
    </>
  );
}