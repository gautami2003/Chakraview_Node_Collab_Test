import React, { Suspense } from 'react';
import LoginFooter from "@/components/LoginFooter";
import StudentSignupContent from './StudentSignupContent';

export default function StudentSignupPage() {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <StudentSignupContent />
            </Suspense>
            <LoginFooter />
        </>
    );
}