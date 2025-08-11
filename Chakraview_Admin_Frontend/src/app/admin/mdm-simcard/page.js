import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MDMSimcardContent from './MDMSimcardContent';

export default function MDMSimcardPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div>Loading...</div>}>
                <MDMSimcardContent />
            </Suspense>
            <Footer />
        </>
    );
}