"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { getToken } from '@/utils/api';

function ProfileContent() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        userName: "",
        emailID: ""
    });

    useEffect(() => {
        const token = getToken();
        try {
            const getUser = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-master`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data
                setFormData(responseData)
            }
            getUser();
        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleProfile = async (e) => {
        e.preventDefault();
        const token = getToken();
        try {
            let response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user-master`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${token}`
                }
            });
            toast.success(response.data.message);
            router.push("/")
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <>
            <div id="layoutAuthentication">
                <div id="layoutAuthentication_content">
                    <main>
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-5 ">
                                    <div className="card shadow-lg border-0 rounded-lg mt-5 bg-theme">
                                        <h4 className="text-center font-weight-light my-4"><b>Profile</b></h4>
                                        <div className="card-body">
                                            <form onSubmit={handleProfile}>
                                                <div className="form-floating mb-3 ">
                                                    <input
                                                        className="form-control" id="userName" name='userName'
                                                        value={formData.userName} placeholder="User Name" onChange={handleChange} required
                                                    />
                                                    <label htmlFor="userName">User Name</label>
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <input className="form-control" id="emailID" name='emailID' type="email"
                                                        value={formData.emailID} placeholder="name@example.com" onChange={handleChange} required />
                                                    <label htmlFor="emailID">Email Address</label>
                                                </div>
                                                {/* <div className="form-floating mb-3">
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        required={true}
                                                    />
                                                    <label htmlFor="inputPassword">Password</label>
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        required={true}
                                                    />
                                                    <label htmlFor="inputPassword">Confirm Password</label>
                                                </div> */}

                                                <div className="d-flex justify-content-center gap-3 mt-3">
                                                    <Link type="button" className="btn btn-primary px-4" href="/">Cancel</Link>
                                                    <button type="submit" className="btn btn-primary px-4">Submit</button>
                                                    {/* <button type="button" className="btn btn-primary px-4">Cancel</button> */}
                                                </div>

                                            </form>
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

export default ProfileContent;