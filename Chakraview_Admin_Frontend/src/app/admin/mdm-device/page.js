import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MDMDeviceContent from './MDMDeviceContent';

export default function MDMDevicePage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div>Loading...</div>}>
                <MDMDeviceContent />
            </Suspense>
            <Footer />
        </>
    );
}