// "use client"
// import React, { useState } from 'react';
// import LoginFooter from "@/components/LoginFooter"
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

import Image from "next/image";
import GotoLoginPage from "@/components/GotoLoginPage";

function UserNamePasswordContent() {

    // const router = useRouter();

    // const [userName, setUserName] = useState("");
    // const [password, setPassword] = useState("");

    // // console.log(userName, "userNameuserNameuserNameuserNameuserName");
    // // console.log(password, "passwordpasswordpasswordpasswordpassword");

    // const handleLogin = async (e) => {
    //     e.preventDefault();
    //     console.log(userName, password, "userName, passworduserName, password");
    //     try {
    //         let result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    //             userName: userName,
    //             password: password
    //         })
    //         let responseJson = result.data;
    //         localStorage.setItem("token", responseJson.data.token);
    //         router.push("/")
    //     }
    //     catch (error) {
    //         console.log(error);
    //     }

    // };


    // const handleUserNameChange = (event) => {
    //     setUserName(event.target.value);
    // };

    // const handlePasswordChange = (event) => {
    //     setPassword(event.target.value);
    // };

    return (
        <>
            <div className="bg-theme" id="layoutAuthentication">
                <div id="layoutAuthentication_content">
                    <main>
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-5">
                                    <div className="card shadow-lg border-0 rounded-lg mt-5">
                                        <div className="card-header text-center mt-3">
                                            <Image src="/images/chakraviewlogonew.png" height="300" width="300" className="img-fluid pr10"
                                                alt="" />
                                            {/* <h3 className="text-center font-weight-light my-4">SCHOOL BUS TRACKING SYSTEM</h3> */}
                                            <h4 className="text-center font-weight-light my-4">Forgot UserName/Password</h4>
                                        </div>
                                        <div className="card-body">
                                            {/* <form onSubmit={handleLogin}> */}
                                            <form >
                                                <div className="form-floating mb-3">
                                                    <input
                                                        className="form-control"
                                                        type="email"
                                                        placeholder="abc@gmail.com"
                                                        // value={userName}
                                                        // onChange={handleUserNameChange}
                                                        required={true}
                                                    />
                                                    <label htmlFor="inputEmail">Email Address</label>
                                                </div>
                                                <div className="d-flex justify-content-center gap-3 mt-3">
                                                    <a type="button" className="btn btn-primary px-4" href="/login">Cancel</a>
                                                    <button type="submit" className="btn btn-primary px-4">Submit</button>
                                                    {/* <button type="button" className="btn btn-primary px-4">Cancel</button> */}
                                                </div>

                                            </form>
                                        </div>
                                        <GotoLoginPage pageLink={'/login'} />
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

export default UserNamePasswordContent;