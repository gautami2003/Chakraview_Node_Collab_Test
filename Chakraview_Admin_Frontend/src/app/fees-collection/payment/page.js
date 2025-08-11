import React, { Suspense } from 'react';
import Navbar from '@/components/StudentLoginNavbar';
import Footer from '@/components/Footer';
import PaymentContent from './PaymentContent';

export default function PaymentPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentContent />
      </Suspense>
      <Footer />
    </>
  );
}