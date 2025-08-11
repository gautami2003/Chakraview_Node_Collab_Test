'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from "@/utils/api";
import Tooltip from '@/components/Tooltip/Tooltip';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import NoData from '@/components/NoData';

function BusAttendant() {
    const [busAttendant, setBusAttendant] = useState([]);
    // const [showSchoolModal, setShowSchoolModal] = useState(false);
    // const [selectedOperator, setSelectedOperator] = useState(null);

    // const openSchoolModal = (e, data) => {
    //     e.preventDefault();
    //     setSelectedOperator(data);
    //     setShowSchoolModal(true);
    // };

    // const closeSchoolModal = () => {
    //     setSelectedOperator(null);
    //     setShowSchoolModal(false);
    // };

    useEffect(() => {
        try {
            const token = getToken();
            const getBusAttendant = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bus-incharge-master`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data;
                setBusAttendant(responseData);
            }
            getBusAttendant();
        } catch (error) {
            console.log(error);
        }
    }, [])

    const hendleDelete = async (id, data) => {
        const token = getToken();
        let result = await Swal.fire({
            title: `Are you sure ?`,
            text: 'Do you want to delete bus ?',
            showCancelButton: true,
            confirmButtonText: "Delete",
        })
        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/busMaster/${id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                setBusAttendant(prev => prev.filter(operator => operator.busID !== id));
                toast.success(response.data.message);
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <div className="container-fluid px-4 mt-5">
                        <h2 className="text-center font-weight-light my-4"><b>Bus Attendant</b></h2>
                        <div className="card-body">
                            {busAttendant.length === 0 ? (
                                <NoData />
                            ) : (
                                <>
                                    <table id="datatablesSimple">
                                        <thead className="card-header">
                                            <tr>
                                                <th>Sr. No</th>
                                                <th>Name</th>
                                                <th>Primary Phone #</th>
                                                <th>Secondary Phone #</th>
                                                <th>Type</th>
                                                <th>License Number</th>
                                                <th>License Image</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {busAttendant.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td >{index + 1}</td>
                                                        <td >{data.driverName}</td>
                                                        <td >{data.mobileNumber}</td>
                                                        <td >{data.secondaryMobileNumber}</td>
                                                        <td >{data.attendantTypeName}</td>
                                                        <td >{data.drivingLicenseNumber}</td>
                                                        <td ></td>
                                                        {/* <td >{data.drivingLicenseImage}</td> */}
                                                        <td>{data.isBan}</td>
                                                        <td>
                                                            <Tooltip targetId={`edit-${data.allocationID}`} position="top" text="Edit Bus Attendant" />
                                                            <button className="btn btn-outline-warning btn-sm  rounded" id={`edit-${data.allocationID}`}
                                                            // onClick={(e) => openAllocationModal(e, data)}
                                                            >
                                                                <i className="fa-solid fa-user-pen"></i>
                                                            </button>&nbsp;

                                                            <Tooltip targetId={`delete-bus-${data.busID}`} position="top" text="Delete Bus Attendant" />
                                                            <button className="btn btn-outline-warning btn-sm rounded " id={`delete-bus-${data.busID}`} onClick={() => hendleDelete(data.busID)} >
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                            }
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    </div >
                </main >
            </div >
        </>
    );
}

export default BusAttendant;


