import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StudentContent from './StudentContent';

export default function StudentPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <StudentContent />
      </Suspense>
      <Footer />
    </>
  );
}