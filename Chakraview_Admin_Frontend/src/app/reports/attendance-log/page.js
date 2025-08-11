import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AttendanceLogContent from './AttendanceLogContent';

export default function ParentLogPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <AttendanceLogContent />
      </Suspense>
      <Footer />
    </>
  );
}