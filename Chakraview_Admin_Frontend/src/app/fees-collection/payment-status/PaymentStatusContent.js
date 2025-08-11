'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getData } from '@/utils/feesCollectionApi';
import "../../styles/payment.css";
import SvgImage from '@/components/SvgImage';

function PaymentStatusContent() {
    const [feesData, setFeesData] = useState({});

    const searchParams = useSearchParams();
    const id = searchParams.get("token");
    const decoded = atob(id);
    console.log(decoded);

    useEffect(() => {
        try {
            const getFeesData = async () => {
                const result = await getData(`payments-collection/cca/callback?id=${decoded}`)
                let responseData = result.data;
                setFeesData(responseData);
            }
            getFeesData();
        } catch (error) {
            console.log(error);
        }
    }, [])

    return (
        <>

            <div className="text-center">
                {feesData.orderStatus &&
                    <>
                        <SvgImage status={feesData.orderStatus} />
                        <div className="card card-custom p-3 mt-3">
                            <div className="d-flex justify-content-between">
                                <strong>Order ID:</strong>
                                <span>{feesData.order_id}</span>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <strong>Transaction ID:</strong>
                                <span>{feesData.txnIDFromPG}</span>
                            </div>
                            {feesData.orderStatus === "Success" &&
                                <div className="d-flex justify-content-between mt-2">
                                    <strong>Amount Paid:</strong>
                                    <span>{feesData.toalFeesPaidAmount}</span>
                                </div>
                            }
                            <div className="d-flex justify-content-between mt-2">
                                <strong>Date & Time:</strong>
                                <span>{feesData.dateTime}</span>
                            </div>
                        </div>

                        <a href="/fees-collection/student-list" className="btn btn-primary mt-4">Return to Homepage</a>
                    </>
                }
            </div>
        </>
    );
}

export default PaymentStatusContent;


