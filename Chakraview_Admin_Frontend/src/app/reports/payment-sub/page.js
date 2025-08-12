import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaymentSubContent from './PaymentSubContent';

export default function PaymentSubContentPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentSubContent />
      </Suspense>
      <Footer />
    </>
  );
}