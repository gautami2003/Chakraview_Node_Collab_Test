import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConfigureContent from './ConfigureContent';

export default function ConfigurePage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div>Loading...</div>}>
                <ConfigureContent />
            </Suspense>
            <Footer />
        </>
    );
}