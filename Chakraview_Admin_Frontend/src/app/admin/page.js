import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminDashboardContent from './AdminDashboardContent';

export default function Home() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <AdminDashboardContent />
      </Suspense>
      <Footer />
    </>
  );
}