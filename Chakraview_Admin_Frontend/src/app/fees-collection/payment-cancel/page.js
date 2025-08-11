import React, { Suspense } from 'react';
import Navbar from '@/components/StudentLoginNavbar';
import Footer from '@/components/Footer';
import PaymentCancelContent from './PaymentCancelContent';

export default function PaymentCancelPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentCancelContent />
      </Suspense>
      <Footer />
    </>
  );
}