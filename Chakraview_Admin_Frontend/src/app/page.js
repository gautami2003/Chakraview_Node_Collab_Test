import React, { Suspense } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomeContent from './HomeContent';


export default function Home() {
  return (
    <>
      {/* <Navbar /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContent />
      </Suspense>
      {/* <Footer /> */}
    </>
  );
}