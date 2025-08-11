import React, { Suspense } from 'react';
import FeesCollectionContent from './FeesCollectionContent';

export default function FeesCollectionPage() {
  return (
    <>
      <Suspense fallback={<div></div>}>
        <FeesCollectionContent />
      </Suspense>
    </>
  );
}