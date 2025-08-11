'use client';
import SvgImage from '@/components/SvgImage';
import "../../styles/payment.css";

function PaymentCancelContent() {

    return (
        <>

            <div className="text-center">
                <SvgImage />

                <a href="/fees-collection/student-list" className="btn btn-primary mt-4">Return to Homepage</a>
            </div>
        </>
    );
}

export default PaymentCancelContent;


