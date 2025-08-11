import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SchoolHolidaysContent from './SchoolHolidaysContent';

export default function SchoolHolidaysPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <SchoolHolidaysContent />
      </Suspense>
      <Footer />
    </>
  );
}