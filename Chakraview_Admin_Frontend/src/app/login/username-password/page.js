import React, { Suspense } from 'react';
import LoginFooter from "@/components/LoginFooter"
import UserNamePasswordContent from './UserNamePasswordContent';

export default function UserNamePasswordPage() {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <UserNamePasswordContent />
            </Suspense>
            <LoginFooter />
        </>
    );
}