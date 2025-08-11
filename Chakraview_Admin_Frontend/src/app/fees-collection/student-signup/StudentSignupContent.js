"use client";
import React, { useEffect, useState } from 'react';
import GotoLoginPage from '@/components/GotoLoginPage';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getData, postData } from '@/utils/feesCollectionApi';

function StudentSignupContent() {
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
            const result = await getData(`country`, true)
            setCountries(result.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getCity = async (id) => {
        try {
            const result = await getData(`city?id=${id}`, true)
            setCities(result.data);
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
            const result = await postData(`auth/signup`)
            const response = result.data;
            console.log(response);

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
                                    <div className="card-body ">
                                        <form onSubmit={handleRegister}>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0 ">
                                                        <select
                                                            id="schoolID"
                                                            name="schoolID"
                                                            className="form-select"
                                                            value={formData.schoolID}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="" >-- Select School Name --</option>
                                                            {/* {schoolList.map((school, index) => (
                                                                <option key={index} value={school.schoolID}>
                                                                    {school.schoolName}
                                                                </option>
                                                            ))} */}
                                                        </select>
                                                        <label htmlFor="schoolID" >
                                                            School
                                                        </label>
                                                    </div>
                                                </div>
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
                                                        <label htmlFor="busOperatorName">School Student Code</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0 ">
                                                        <select
                                                            id="schoolID"
                                                            name="schoolID"
                                                            className="form-select"
                                                            value={formData.schoolID}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="" >-- Select School Section --</option>
                                                            {/* {schoolList.map((school, index) => (
                                                                <option key={index} value={school.schoolID}>
                                                                    {school.schoolName}
                                                                </option>
                                                            ))} */}
                                                        </select>
                                                        <label htmlFor="schoolID" >
                                                            School Section
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0 ">
                                                        <select
                                                            id="schoolID"
                                                            name="schoolID"
                                                            className="form-select"
                                                            value={formData.schoolID}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="" >-- Select Student Blood Group --</option>
                                                            {/* {schoolList.map((school, index) => (
                                                                <option key={index} value={school.schoolID}>
                                                                    {school.schoolName}
                                                                </option>
                                                            ))} */}
                                                        </select>
                                                        <label htmlFor="schoolID" >
                                                            Student Blood Group
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

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
                                                        <label htmlFor="busOperatorName">Father Name</label>
                                                    </div>
                                                </div>
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
                                                        <label htmlFor="busOperatorName">Mother Name</label>
                                                    </div>
                                                </div>
                                            </div>

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
                                                        <label htmlFor="busOperatorName">Student Name</label>
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
                                                            <option value="" disabled>-- Select Student Standard --</option>
                                                            {/* {countries.map((country, index) => (
                                                                <option key={index} value={country.countryID}>
                                                                    {country.countryName}
                                                                </option>
                                                            ))} */}
                                                        </select>
                                                        <label htmlFor="countryID">Student Standard</label>
                                                    </div>
                                                </div>
                                            </div>
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
                                                        <label htmlFor="busOperatorName">Student Division</label>
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
                                                        <label htmlFor="phoneNumber">Father Mobile</label>
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
                                                        <label htmlFor="ownerName">Mother Mobile</label>
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
                                                            <option value="" disabled>-- Select Primary Mobile --</option>
                                                            {/* {cities.map((city, index) => (
                                                                <option key={index} value={city.CityID}>
                                                                    {city.CityName}
                                                                </option>
                                                            ))} */}
                                                        </select>
                                                        <label htmlFor="cityID">Primary Mobile Of</label>
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
                                                    <div className="form-floating mb-3 mb-md-0 ">
                                                        <select
                                                            id="schoolID"
                                                            name="schoolID"
                                                            className="form-select"
                                                            value={formData.schoolID}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="" >-- Select Pickup Route --</option>
                                                            {/* {schoolList.map((school, index) => (
                                                                <option key={index} value={school.schoolID}>
                                                                    {school.schoolName}
                                                                </option>
                                                            ))} */}
                                                        </select>
                                                        <label htmlFor="schoolID" >
                                                            Pickup Route
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0 ">
                                                        <select
                                                            id="schoolID"
                                                            name="schoolID"
                                                            className="form-select"
                                                            value={formData.schoolID}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="" >-- Select Drop Route --</option>
                                                            {/* {schoolList.map((school, index) => (
                                                                <option key={index} value={school.schoolID}>
                                                                    {school.schoolName}
                                                                </option>
                                                            ))} */}
                                                        </select>
                                                        <label htmlFor="schoolID" >
                                                            Drop Route
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0 ">
                                                        <select
                                                            id="schoolID"
                                                            name="schoolID"
                                                            className="form-select"
                                                            value={formData.schoolID}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="" >-- Select Stay Back Drop Route --</option>
                                                            {/* {schoolList.map((school, index) => (
                                                                <option key={index} value={school.schoolID}>
                                                                    {school.schoolName}
                                                                </option>
                                                            ))} */}
                                                        </select>
                                                        <label htmlFor="schoolID" >
                                                            Stay Back Drop Route
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0 ">
                                                        <select
                                                            id="schoolID"
                                                            name="schoolID"
                                                            className="form-select"
                                                            value={formData.schoolID}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="" >-- Select Pickup Stoppage --</option>
                                                            {/* {schoolList.map((school, index) => (
                                                                <option key={index} value={school.schoolID}>
                                                                    {school.schoolName}
                                                                </option>
                                                            ))} */}
                                                        </select>
                                                        <label htmlFor="schoolID" >
                                                            Pickup Stoppage
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0 ">
                                                        <select
                                                            id="schoolID"
                                                            name="schoolID"
                                                            className="form-select"
                                                            value={formData.schoolID}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="" >-- Select Drop Stoppage --</option>
                                                            {/* {schoolList.map((school, index) => (
                                                                <option key={index} value={school.schoolID}>
                                                                    {school.schoolName}
                                                                </option>
                                                            ))} */}
                                                        </select>
                                                        <label htmlFor="schoolID" >
                                                            Drop Stoppage
                                                        </label>
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
                                    <GotoLoginPage pageLink={'/fees-collection/student-login'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default StudentSignupContent;
