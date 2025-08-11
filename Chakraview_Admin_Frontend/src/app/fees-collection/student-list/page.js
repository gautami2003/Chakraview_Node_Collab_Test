import React, { Suspense } from 'react';
import Navbar from '@/components/StudentLoginNavbar';
import Footer from '@/components/Footer';
import StudentListContent from './StudentListContent';

export default function StudentListPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <StudentListContent />
      </Suspense>
      <Footer />
    </>
  );
}