import Image from 'next/image';
import React from 'react';

function LogoTitle({ title }) {
    return (
        <>
            <div className="card-header text-center mt-3">
                <Image src="/images/chakraviewlogonew.png" width="300" height="300" className="img-fluid pr10"
                    alt="" />
                {/* <h3 className="text-center font-weight-light my-4">SCHOOL BUS TRACKING SYSTEM</h3> */}
                {/* <h4 className="text-center font-weight-light my-4">Login</h4> */}
                <h4 className="text-center font-weight-light my-4">{title}</h4>
            </div>
        </>
    );
}

export default LogoTitle;