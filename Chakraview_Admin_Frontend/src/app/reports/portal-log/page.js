import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortalLogContent from './PortalLogContent';

export default function ParentLogPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <PortalLogContent />
      </Suspense>
      <Footer />
    </>
  );
}