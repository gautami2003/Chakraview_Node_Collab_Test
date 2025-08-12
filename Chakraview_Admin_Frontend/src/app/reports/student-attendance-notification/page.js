import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StudentAttendanceNotificationLogContent from './StudentAttendanceNotificationLogContent';

export default function DistanceMessage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <StudentAttendanceNotificationLogContent />
      </Suspense>
      <Footer />
    </>
  );
}