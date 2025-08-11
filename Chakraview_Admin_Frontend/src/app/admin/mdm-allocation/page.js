import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MDMAllocationContent from './MDMAllocationContent';

export default function MDMAllocationPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div>Loading...</div>}>
                <MDMAllocationContent />
            </Suspense>
            <Footer />
        </>
    );
}