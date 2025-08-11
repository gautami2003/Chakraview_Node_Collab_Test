import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DropRouteContent from './DropRouteContent';

export default function DropRoutePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <DropRouteContent />
      </Suspense>
      <Footer />
    </>
  );
}