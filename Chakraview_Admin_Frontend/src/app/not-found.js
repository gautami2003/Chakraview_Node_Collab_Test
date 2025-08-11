import Image from 'next/image';
import React from 'react';

function PageNotFound() {
    return (
        <>
            <div className="bg-theme" id="layoutAuthentication">
                <div id="layoutAuthentication_content">
                    <div className="container mt-5">
                        <div className="text-center ">
                            <Image src="/images/error-404-monochrome.svg" width="500" height="300" className="img-fluid pr10"
                                alt="" />
                            <h1 className="mt-5">Page Not Found!</h1>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
}

export default PageNotFound;