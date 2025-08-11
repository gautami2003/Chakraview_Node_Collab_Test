import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SummaryContent from './SummaryContent';

export default function SummaryPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div>Loading...</div>}>
                <SummaryContent />
            </Suspense>
            <Footer />
        </>
    );
}