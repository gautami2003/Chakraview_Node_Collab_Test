import React, { Suspense } from 'react';
import Navbar from '@/components/StudentLoginNavbar';
import Footer from '@/components/Footer';
import PaymentStatusContent from './PaymentStatusContent';

export default function PaymentStatusPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentStatusContent />
      </Suspense>
      <Footer />
    </>
  );
}