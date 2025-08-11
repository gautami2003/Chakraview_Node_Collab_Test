import React from 'react';

function LoginFooter() {
    return (
        <>
            <div id="layoutAuthentication_footer">
                <footer className="py-4 bg-light mt-auto">
                    <div className="container-fluid px-4">
                        <div className="d-flex align-items-center justify-content-center small">
                            <div className="text-muted text-center"> Chakraview Solutions Pvt. Ltd. &copy; All rights are reserved.</div>
                            {/* <div>
                                <a href="#">Terms &amp; Conditions</a> &middot;
                                <a href="#">Disclaimer</a> &middot;
                                <a href="#">Privacy Policy</a>
                            </div> */}
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default LoginFooter;