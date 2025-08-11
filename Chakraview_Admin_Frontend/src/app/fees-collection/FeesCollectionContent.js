'use client';

import React, { useEffect } from 'react';
import { useRouter, } from 'next/navigation';

function FeesCollectionContent() {
    const router = useRouter();

    useEffect(() => {
        router.push("/fees-collection/student-login")
    }, [])

    return (
        <>
        </>
    );
}

export default FeesCollectionContent;


