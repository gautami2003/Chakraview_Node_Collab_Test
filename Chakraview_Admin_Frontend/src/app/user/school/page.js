import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SchoolContent from './SchoolContent';

export default function SchoolPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <SchoolContent />
      </Suspense>
      <Footer />
    </>
  );
}