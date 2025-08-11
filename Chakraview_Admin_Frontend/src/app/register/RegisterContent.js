"use client";
import React, { useEffect, useState } from 'react';
import GotoLoginPage from '@/components/GotoLoginPage';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

function RegisterContent() {
    const [formData, setFormData] = useState({
        busOperatorName: '',
        countryID: '',
        address1: '',
        address2: '',
        cityID: '',
        pincode: '',
        phoneNumber: '',
        ownerName: '',
        ownerPhoneNumber: '',
        emailID: '',
        websiteURL: '',
        businessType: '',
        userName: '',
        password: '',
    });
    const router = useRouter();
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        getCountry();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const getCountry = async () => {
        try {
            const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/country`);
            setCountries(result.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getCity = async (id) => {
        try {
            const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/city?id=${id}`);
            setCities(result.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCountryChange = (e) => {
        const selectedId = e.target.value;
        setFormData(prev => ({ ...prev, countryID: selectedId }));
        getCity(selectedId);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('${process.env.NEXT_PUBLIC_API_URL}/auth/signup', {
                ...formData
            });
            const result = response.data;
            console.log(result);

            router.push("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-theme" id="layoutAuthentication">
            <div id="layoutAuthentication_content">
                <main>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-7">
                                <div className="card shadow-lg border-0 rounded-lg mt-5">
                                    <div className="card-header text-center mt-3">
                                        <Image src="/images/chakraviewlogonew.png" width="300" height="300" className="img-fluid pr10" alt="" />
                                        <h4 className="text-center font-weight-light my-4">Create Account</h4>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleRegister}>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <input
                                                            className="form-control"
                                                            id="busOperatorName"
                                                            type="text"
                                                            value={formData.busOperatorName}
                                                            onChange={handleChange}
                                                            placeholder="Enter your Bus Operator Name"
                                                            required
                                                        />
                                                        <label htmlFor="busOperatorName">Bus Operator Name</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <select
                                                            className="form-select form-control"
                                                            id="countryID"
                                                            value={formData.countryID}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                handleCountryChange(e);
                                                            }}
                                                            required
                                                        >
                                                            <option value="" disabled>-- Select Country --</option>
                                                            {countries.map((country, index) => (
                                                                <option key={index} value={country.countryID}>
                                                                    {country.countryName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <label htmlFor="countryID">Country</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <input
                                                            className="form-control"
                                                            id="address1"
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
                                                            type="text"
                                                            value={formData.address2}
                                                            onChange={handleChange}
                                                            placeholder="Enter your Address 2"
                                                        />
                                                        <label htmlFor="address2">Address 2</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <select
                                                            className="form-select form-control"
                                                            id="cityID"
                                                            value={formData.cityID}
                                                            onChange={handleChange}
                                                            required
                                                        >
                                                            <option value="" disabled>-- Select City --</option>
                                                            {cities.map((city, index) => (
                                                                <option key={index} value={city.CityID}>
                                                                    {city.CityName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <label htmlFor="cityID">City</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <input
                                                            className="form-control"
                                                            id="pincode"
                                                            type="text"
                                                            value={formData.pincode}
                                                            onChange={handleChange}
                                                            placeholder="Enter your Pincode"
                                                            required
                                                        />
                                                        <label htmlFor="pincode">Pincode</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <input
                                                            className="form-control"
                                                            id="phoneNumber"
                                                            type="tel"
                                                            value={formData.phoneNumber}
                                                            onChange={handleChange}
                                                            placeholder="Enter Landline"
                                                        />
                                                        <label htmlFor="phoneNumber">Land-line Phone</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <input
                                                            className="form-control"
                                                            id="ownerName"
                                                            type="text"
                                                            value={formData.ownerName}
                                                            onChange={handleChange}
                                                            placeholder="Enter Owner Name"
                                                            required
                                                        />
                                                        <label htmlFor="ownerName">Owner Name</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <input
                                                            className="form-control"
                                                            id="ownerPhoneNumber"
                                                            type="tel"
                                                            value={formData.ownerPhoneNumber}
                                                            onChange={handleChange}
                                                            placeholder="Enter Owner Mobile"
                                                            required
                                                        />
                                                        <label htmlFor="ownerPhoneNumber">Owner Mobile</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <input
                                                            className="form-control"
                                                            id="emailID"
                                                            type="email"
                                                            value={formData.emailID}
                                                            onChange={handleChange}
                                                            placeholder="name@example.com"
                                                            required
                                                        />
                                                        <label htmlFor="emailID">Email Address</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <input
                                                            className="form-control"
                                                            id="websiteURL"
                                                            type="text"
                                                            value={formData.websiteURL}
                                                            onChange={handleChange}
                                                            placeholder="Enter Website URL"
                                                        />
                                                        <label htmlFor="websiteURL">Website URL</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <select
                                                            className="form-select form-control"
                                                            id="businessType"
                                                            value={formData.businessType}
                                                            onChange={handleChange}
                                                            required
                                                        >
                                                            <option value="" disabled>-- Select Business Type --</option>
                                                            <option value="B2B">B2B</option>
                                                            <option value="B2C">B2C</option>
                                                            <option value="B2C-Retail">B2C-Retail</option>
                                                        </select>
                                                        <label htmlFor="businessType">Business Type</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <input
                                                            className="form-control"
                                                            id="userName"
                                                            type="text"
                                                            value={formData.userName}
                                                            onChange={handleChange}
                                                            placeholder="Enter User Name"
                                                            required
                                                        />
                                                        <label htmlFor="userName">User Name</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 mb-0">
                                                <div className="d-grid">
                                                    <button type="submit" className="btn btn-primary btn-block">
                                                        Create Account
                                                    </button>
                                                </div>
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
    );
}

export default RegisterContent;
