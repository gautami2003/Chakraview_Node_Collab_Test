import React, { Suspense } from 'react';
import LoginFooter from "@/components/LoginFooter"
import LoginContent from './LoginContent';

export default function LoginPage() {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <LoginContent />
            </Suspense>
            <LoginFooter />
        </>
    );
}