import React, { Suspense } from 'react';
import LoginFooter from "@/components/LoginFooter"
import StudentLoginContent from './StudentLoginContent';

export default function StudentLoginPage() {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <StudentLoginContent />
            </Suspense>
            <LoginFooter />
        </>
    );
}