'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { getToken } from "@/utils/api";
import Pagination from '@/components/Pagination';
import SchoolList from './SchoolList';
import Tooltip from '@/components/Tooltip/Tooltip';
import NoData from '@/components/NoData';

function BusOperatorsContent() {
    const [busOperators, setBusOperators] = useState([]);
    const [businessType, setBusinessType] = useState("B2B");
    const [busOperatorName, setBusOperatorName] = useState([]);
    const [singalbusOperator, setSingalbusOperator] = useState("");
    const [showSchoolModal, setShowSchoolModal] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();

    const token = getToken();
    const searchParams = useSearchParams();
    // console.log(singalbusOperator, "singalbusOperatorsingalbusOperatorsingalbusOperatorsingalbusOperatorsingalbusOperator");

    const page = parseInt(searchParams.get('page')) || 1;

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            router.push(`?page=${newPage}`);
        }
    };

    const openSchoolModal = (e, data) => {
        e.preventDefault();
        setSelectedOperator(data);
        setShowSchoolModal(true);
    };

    const closeSchoolModal = () => {
        setSelectedOperator(null);
        setShowSchoolModal(false);
    };

    useEffect(() => {
        const token = getToken();
        try {
            const getBusOperators = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bus-operator/get-all?type=${businessType}&page=${page}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data;
                setBusOperators(responseData.result);
                setTotalPages(Math.ceil(responseData.count / responseData.totalLimit));
            }
            const getBusOperatorName = async () => {

                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bus-operator/name-list`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data
                setBusOperatorName(responseData)
            }
            getBusOperatorName();
            getBusOperators();
        } catch (error) {
            console.log(error);
        }
    }, [businessType, page])


    const handleClick = async (id, data) => {
        let result = await Swal.fire({
            title: `You are about to ${data == "N" ? "ACTIVATE" : "DEACTIVATE"} this bus operator. \n\nAre you sure?`,
            showCancelButton: true,
            confirmButtonText: "Yes",
        })
        if (result.isConfirmed) {
            try {
                const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/bus-operator/${id}`,
                    {
                        isActive: data == "Y" ? "N" : "Y"
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                setBusOperators(prev =>
                    prev.map(operator =>
                        operator.BusOperatorID === id
                            ? { ...operator, isActive: data === "Y" ? "N" : "Y" }
                            : operator
                    )
                );
                toast.success(response.data.message);
            } catch (error) {
                console.log(error);
            }
        };
    };

    const handleConfigureClick = async (id, name) => {
        router.push(`/bus-operators/configure?busOpID=${id}&busOpName=${name}&type=${businessType}`)
    };

    const handleLaunch = async (busOperatorId, userId) => {
        try {
            console.log(userId, "userIduserIduserIduserIduserIduserIduserId");
            let data = {
                userID: userId,
                busOperatorId: busOperatorId
            }
            const launchUser = async () => {

                const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/launch-user`, data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data
                let getToken = localStorage.getItem("token")
                localStorage.setItem("admin_token", getToken)
                localStorage.setItem("token", responseData.token)
                // console.log(responseData.token, "responseDataresponseDataresponseDataresponseDataresponseData");
                window.location.reload();

                // setBusOperatorName(responseData)
            }
            launchUser();
        } catch (error) {
            console.log(error);
        }
    };

    const hendleDelete = async (id, data) => {
        let result = await Swal.fire({
            title: `Are you sure ?`,
            text: 'Do you want to delete bus operator?',
            showCancelButton: true,
            confirmButtonText: "Delete",
        })
        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/bus-operator/${id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                setBusOperators(prev => prev.filter(operator => operator.BusOperatorID !== id));
                toast.success(response.data.message);
            } catch (error) {
                console.log(error);
            }
        }
    };
    const handleChange = (e) => {
        const { value } = e.target;
        const token = getToken();
        try {
            const getSingalBusOperators = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bus-operator/${value}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = [result.data.data];
                setBusOperators(responseData);
            }
            getSingalBusOperators();
        } catch (error) {
            console.log(error);
        }
        setSingalbusOperator(value);
    };


    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <div className="container-fluid px-4 mt-5">
                        <h2 className="text-center font-weight-light my-4"><b>Bus Operators</b></h2>
                        <div className="d-flex justify-content-center align-items-center mb-4 me-3  ">
                            <div className="d-flex align-items-center mb-3">
                                <label htmlFor="BusinessType" className="form-label  me-2">
                                    <strong>Bus Operator Name</strong>
                                </label>
                                <select
                                    id="BusinessType"
                                    className="form-select selectBox"
                                    value={singalbusOperator}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>-- Select Bus Operator --</option>
                                    {busOperatorName.map((data, index) => (
                                        <option key={index} value={data.busOperatorID}>
                                            {data.busOperatorName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="float-end me-3 mb-4">
                            <div>
                                <label htmlFor="BusinessType" className="form-label me-2">
                                    <strong>Business Type</strong>
                                </label>
                                <select
                                    id="BusinessType"
                                    className="form-select w-auto"
                                    value={businessType}
                                    onChange={(e) => setBusinessType(e.target.value)}
                                >
                                    <option value="B2B">B2B</option>
                                    <option value="B2C">B2C</option>
                                    <option value="B2C-Retail">B2C-Retail</option>
                                </select>
                            </div>
                        </div>

                        <div className="card-body">
                            {busOperators.length === 0 ? (
                                <NoData />
                            ) : (
                                <table id="datatablesSimple">
                                    <thead className="card-header">
                                        <tr>
                                            <th>Bus Operator Details</th>
                                            <th>Owner Details</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {busOperators.map((data, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td >
                                                        <Link href="#" onClick={(e) => openSchoolModal(e, data)}>
                                                            <span>{data.BusOperatorName}</span><br />
                                                            {data.PhoneNumber && (
                                                                <>
                                                                    <small>{data.PhoneNumber}</small>
                                                                    <br />
                                                                </>
                                                            )}
                                                            <small>{data.EmailID}</small>
                                                        </Link>
                                                    </td>
                                                    <td>{data.OwnerName}<br />
                                                        {data.OwnerPhoneNumber}</td>

                                                    <td>
                                                        <i
                                                            className={`fa-solid ${data.isActive === "Y" ? "fa-toggle-on text-success fa-xl" : "fa-toggle-off text-danger fa-xl"}`}
                                                            onClick={() => handleClick(data.BusOperatorID, data.isActive)}
                                                        ></i>

                                                        {/* <button type="submit" className="btn btn-primary px-4" onClick={() => handleClick(data.BusOperatorID, data.isActive)}>{data.isActive == "N" ? "Active" : "Inactive"}</button> */}
                                                    </td>
                                                    {/* <td >{ }</td> */}
                                                    <td>
                                                        <button className="btn btn-outline-warning btn-sm rounded" id={`Configure-${data.BusOperatorID}`} onClick={() => handleConfigureClick(data.BusOperatorID, data.BusOperatorName)} >
                                                            <i className="fas fa-user-cog"></i>
                                                        </button>&nbsp;
                                                        <Tooltip targetId={`Configure-${data.BusOperatorID}`} position="top" text="Configurations" />
                                                        {businessType == "B2B" && (
                                                            <>
                                                                <button className="btn btn-outline-warning btn-sm rounded" id={`AdsImage-${data.BusOperatorID}`}>
                                                                    <i className="fa-solid fa-image fa-lg"></i>
                                                                </button>&nbsp;
                                                                <Tooltip targetId={`AdsImage-${data.BusOperatorID}`} position="top" text="Ads Image" />
                                                                <button className="btn btn-outline-warning btn-sm rounded" id={`DistanceSMS-${data.BusOperatorID}`}>
                                                                    <i className="fa-solid fa-comment-sms fa-xl"></i>
                                                                </button>&nbsp;
                                                                <Tooltip targetId={`DistanceSMS-${data.BusOperatorID}`} position="top" text="Distance SMS" />
                                                                <button className="btn btn-outline-warning btn-sm rounded" id={`LaunchUser-${data.BusOperatorID}`} onClick={() => handleLaunch(data.BusOperatorID, data.UserID)}>
                                                                    <i className="fa-solid fa-right-to-bracket"></i>
                                                                </button>&nbsp;
                                                                <Tooltip targetId={`LaunchUser-${data.BusOperatorID}`} position="top" text="Launch User" />
                                                            </>

                                                        )}
                                                        {/* <i className="fa-solid fa-ellipsis-vertical"></i>&nbsp; */}


                                                        <button className="btn btn-outline-warning btn-sm rounded " id={`delete-operator-${data.BusOperatorID}`} onClick={() => hendleDelete(data.BusOperatorID)}>
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                        <Tooltip targetId={`delete-operator-${data.BusOperatorID}`} position="top" text="Delete Operator" />
                                                    </td>
                                                </tr>
                                            );
                                        })
                                        }
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div >
                </main >
            </div >
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            {
                showSchoolModal && (
                    <SchoolList onClose={closeSchoolModal} operator={selectedOperator} />
                )
            }
        </>
    );
}

export default BusOperatorsContent;


