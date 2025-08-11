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
        busOperatorName: "",
        address1: "",
        address2: "",
        pincode: "",
        cityName: "",
        ownerPhoneNumber: "",
        ownerName: "",
        phoneNumber: "",
        emailID: "",
        websiteURL: "",
        userName: "",
    });

    useEffect(() => {
        const token = getToken();
        try {
            const getUser = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bus-operator/get-profile`,
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
            // let response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/bus-operator/edit-profile`, formData, {
            let response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/bus-operator/edit-profile`, {
                address1: formData.address1,
                address2: formData.address2,
                pincode: formData.pincode,
                ownerPhoneNumber: formData.ownerPhoneNumber,
                ownerName: formData.ownerName,
                phoneNumber: formData.phoneNumber,
                emailID: formData.emailID,
                websiteURL: formData.websiteURL,
                userName: formData.userName,
            }, {
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
                                <div className="col-lg-7 ">
                                    <div className="card shadow-lg border-0 rounded-lg mt-5 bg-theme">
                                        <h4 className="text-center font-weight-light my-4"><b>Profile</b></h4>
                                        <div className="card-body">
                                            <form onSubmit={handleProfile}>
                                                {/* <div className="form-floating mb-3 ">
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
                                                </div> */}

                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <div className="form-floating mb-3 mb-md-0">
                                                            <input
                                                                className="form-control"
                                                                id="busOperatorName"
                                                                name="busOperatorName"
                                                                type="text"
                                                                value={formData.busOperatorName}
                                                                onChange={handleChange}
                                                                placeholder="Enter your Address"
                                                                disabled
                                                            />
                                                            <label htmlFor="busOperatorName">Bus Operator Name</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-floating">
                                                            <input
                                                                className="form-control"
                                                                id="emailID"
                                                                name="emailID"
                                                                type="email"
                                                                value={formData.emailID}
                                                                onChange={handleChange}
                                                                placeholder="Enter your Email ID"
                                                                required
                                                            />
                                                            <label htmlFor="emailID">Email ID</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <div className="form-floating mb-3 mb-md-0">
                                                            <input
                                                                className="form-control"
                                                                id="address1"
                                                                name="address1"
                                                                type="text"
                                                                value={formData.address1}
                                                                onChange={handleChange}
                                                                placeholder="Enter your Address"
                                                                required
                                                            />
                                                            <label htmlFor="address1">Address</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-floating">
                                                            <input
                                                                className="form-control"
                                                                id="address2"
                                                                name="address2"
                                                                type="text"
                                                                value={formData.address2}
                                                                onChange={handleChange}
                                                                placeholder="Enter your Address 2"
                                                            />
                                                            <label htmlFor="address2">Address 2</label>
                                                        </div>
                                                    </div>
                                                </div>  <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <div className="form-floating mb-3 mb-md-0">
                                                            <input
                                                                className="form-control"
                                                                id="cityName"
                                                                name="cityName"
                                                                type="text"
                                                                value={formData.cityName}
                                                                // onChange={handleChange}
                                                                placeholder="Enter your City"
                                                                disabled
                                                            />
                                                            <label htmlFor="cityName">City</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-floating">
                                                            <input
                                                                className="form-control"
                                                                id="pincode"
                                                                name="pincode"
                                                                type="text"
                                                                value={formData.pincode}
                                                                onChange={handleChange}
                                                                placeholder="Enter your Pincode"
                                                                required
                                                            />
                                                            <label htmlFor="pincode">Pincode</label>
                                                        </div>
                                                    </div>
                                                </div>  <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <div className="form-floating mb-3 mb-md-0">
                                                            <input
                                                                className="form-control"
                                                                id="phoneNumber"
                                                                name="phoneNumber"
                                                                type="number"
                                                                value={formData.phoneNumber}
                                                                onChange={handleChange}
                                                                placeholder="Enter your Land Line Phone"
                                                            />
                                                            <label htmlFor="phoneNumber">Land Line Phone</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-floating mb-3 mb-md-0">
                                                            <input
                                                                className="form-control"
                                                                id="websiteURL"
                                                                name="websiteURL"
                                                                type="text"
                                                                value={formData.websiteURL}
                                                                onChange={handleChange}
                                                                placeholder="Enter your Website URL"
                                                            />
                                                            <label htmlFor="websiteURL">Website URL</label>
                                                        </div>
                                                    </div>
                                                </div>  <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <div className="form-floating mb-3 mb-md-0">
                                                            <input
                                                                className="form-control"
                                                                id="ownerName"
                                                                name="ownerName"
                                                                type="text"
                                                                value={formData.ownerName}
                                                                onChange={handleChange}
                                                                placeholder="Enter your Admin Name"
                                                                required
                                                            />
                                                            <label htmlFor="ownerName">Admin Name</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-floating">
                                                            <input
                                                                className="form-control"
                                                                id="ownerPhoneNumber"
                                                                name="ownerPhoneNumber"
                                                                type="number"
                                                                value={formData.ownerPhoneNumber}
                                                                onChange={handleChange}
                                                                placeholder="Enter your Admin Mobile"
                                                                required
                                                            />
                                                            <label htmlFor="ownerPhoneNumber">Admin Mobile</label>
                                                        </div>
                                                    </div>
                                                </div>  <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <div className="form-floating">
                                                            <input
                                                                className="form-control"
                                                                id="userName"
                                                                name="userName"
                                                                type="text"
                                                                value={formData.userName}
                                                                onChange={handleChange}
                                                                placeholder="Enter your User Name"
                                                                required
                                                            />
                                                            <label htmlFor="userName">User Name</label>
                                                        </div>
                                                    </div>
                                                </div>

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