"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoTitle from '@/components/LogoTitle';
import { toast } from 'react-toastify';
import { postData } from '@/utils/feesCollectionApi';

function StudentLoginContent() {

    const router = useRouter();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);

    const handleSentOTP = async (e) => {
        e.preventDefault();
        try {
            const data = {
                phoneNumber: phoneNumber,
            };
            let result = await postData(`auth/student-login-generate-otp`, data, true)
            let responseJson = result;

            if (responseJson.success === true) {
                setIsOtpSent(true);
                toast.success(responseJson.message);
            } else {
                toast.error(responseJson.message);
            }
        }
        catch (error) {
            const message = error.response.status === 404 ? error.response?.data?.message : "Invalid mobile number";
            console.log(error);
            toast.error(message);
        }

    };
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = {
                phoneNumber: phoneNumber,
                OTP: otp
            };
            let result = await postData(`auth/student-login`, data, true)
            let responseJson = result;
            if (result.success == true) {
                localStorage.setItem("parent-login-token", responseJson.data.token);
                document.cookie = `parent-login-token=${responseJson.data.token}; path=/;`;
                router.push("/fees-collection/student-list")
                toast.success(responseJson.message);
            } else {
                toast.error(responseJson.message);
            }
        }
        catch (error) {
            const message = error.response.status === 401 ? error.response?.data?.message : "Please enter 10 digit mother mobile number.";
            console.log(error);
            toast.error(message);
        }

    };


    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    return (
        <>
            <div className="bg-theme" id="layoutAuthentication">
                <div id="layoutAuthentication_content">
                    <main>
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-5">
                                    <div className="card shadow-lg border-0 rounded-lg mt-5">
                                        <LogoTitle title={"Student Login"} />

                                        <div className="card-body">
                                            <form onSubmit={isOtpSent ? handleLogin : handleSentOTP}>
                                                {/* <form > */}
                                                <div className="form-floating mb-3">
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        placeholder="abc"
                                                        value={phoneNumber}
                                                        onChange={handlePhoneNumberChange}
                                                        disabled={isOtpSent}
                                                        required
                                                    />
                                                    <label htmlFor="Registered Mobile">Registered Mobile</label>
                                                </div>
                                                {isOtpSent &&
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            className="form-control"
                                                            type="number"
                                                            value={otp}
                                                            onChange={(e) => setOtp(e.target.value)}
                                                            placeholder="Enter OTP"
                                                            required
                                                        />
                                                        <label>Enter OTP</label>
                                                    </div>
                                                }
                                                <div className="d-grid">
                                                    <button type="submit" className="btn btn-primary btn-block" >{isOtpSent ? "Login" : "Send OTP"}</button>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="card-footer text-center py-3">
                                            <div className="small"><a href="https://parentapp.chakraview.co.in/schoolbustracker/parentstudent.php">Need an account? Sign up!</a></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

        </>
    );
}

export default StudentLoginContent;