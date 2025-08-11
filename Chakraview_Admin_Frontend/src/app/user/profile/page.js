import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileContent from './ProfileContent';

export default function ProfilePage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div>Loading...</div>}>
                <ProfileContent />
            </Suspense>
            <Footer />
        </>
    );
}