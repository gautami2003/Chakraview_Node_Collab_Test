import React, { Suspense } from 'react';
import LoginFooter from "@/components/LoginFooter";
import RegisterContent from './RegisterContent';

export default function RegisterPage() {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <RegisterContent />
            </Suspense>
            <LoginFooter />
        </>
    );
}