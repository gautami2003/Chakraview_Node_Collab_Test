import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserDashboardContent from './UserDashboardContent';

export default function Home() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <UserDashboardContent />
      </Suspense>
      <Footer />
    </>
  );
}