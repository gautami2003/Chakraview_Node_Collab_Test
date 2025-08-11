"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LogoTitle from '@/components/LogoTitle';
import { toast } from 'react-toastify';
import { checkRoles } from '@/utils/api';

function LoginContent() {

    const router = useRouter();

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            let result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                userName: userName,
                password: password
            })
            let responseJson = result.data;
            console.log(result.data.success, "result.successresult.successresult.successresult.successresult.success");
            if (result.data.success == true) {
                localStorage.setItem("token", responseJson.data.token);
                document.cookie = `token=${responseJson.data.token}; path=/;`;
                checkRoles().includes("admin") ? router.push("/admin") : router.push("/user")
                toast.success(result.data.message);
            } else {
                toast.error(responseJson.message);
            }
        }
        catch (error) {
            const message = error.response.status === 401 ? error.response?.data?.message : "Invalid email or password, please try again.";
            console.log(error);
            toast.error(message);
        }

    };


    const handleUserNameChange = (event) => {
        setUserName(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
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
                                        {/* <hr style={{
                                            textAlign: "center",
                                            fontSize: "smaller",
                                            // paddingBottom: "1em",
                                            borderTop: "15px solid",
                                            borderImageSource: "linear-gradient(to right, #FFF212, #C78305)",
                                            borderImageSlice: 1,
                                            height: "1px",
                                            background: "transparent",
                                            borderBottom: 0,
                                            borderRight: 0,
                                            borderLeft: 0,
                                            margin: 0
                                        }} /> */}
                                        {/* <div className="card-header text-center ">
                                            <img src="/images/chakraviewlogonew.png" width="300" className="img-fluid pr10"
                                                alt="" /> */}
                                        {/* <h3 className="text-center font-weight-light my-4">SCHOOL BUS TRACKING SYSTEM</h3> */}
                                        {/* <h4 className="text-center font-weight-light my-4">Login</h4>
                                        </div> */}

                                        <LogoTitle title={"Login"} />

                                        <div className="card-body">
                                            <form onSubmit={handleLogin}>
                                                {/* <form > */}
                                                <div className="form-floating mb-3">
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder="abc"
                                                        value={userName}
                                                        onChange={handleUserNameChange}
                                                        required
                                                    />
                                                    <label htmlFor="inputEmail">User Name</label>
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        placeholder="Password"
                                                        value={password}
                                                        onChange={handlePasswordChange}
                                                        required
                                                    />
                                                    <label htmlFor="inputPassword">Password</label>
                                                </div>
                                                {/* <div className="form-check mb-3">
                                                    <input className="form-check-input" id="inputRememberPassword" type="checkbox"
                                                        value="" />
                                                    <label className="form-check-label" htmlFor="inputRememberPassword">Remember
                                                        Password</label>
                                                </div> */}
                                                <div className="d-grid">
                                                    <button type="submit" className="btn btn-primary btn-block" >Login</button>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                                                    <a className="small" href="/login/username-password">Forgot User name?</a>
                                                    <a className="small" href="/login/username-password">Forgot Password?</a>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="card-footer text-center py-3">
                                            <div className="small"><a href="/register">Need an account? Sign up!</a></div>
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

export default LoginContent;