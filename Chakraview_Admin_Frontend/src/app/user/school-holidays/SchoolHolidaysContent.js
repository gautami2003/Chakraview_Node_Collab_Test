'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from "@/utils/api";
import Tooltip from '@/components/Tooltip/Tooltip';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import NoData from '@/components/NoData';

function SchoolHolidaysContent() {
    const [schoolHolidays, setSchoolHolidays] = useState([]);

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
            const getSchoolHolidays = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schoolMaster/school-holiday`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data;
                setSchoolHolidays(responseData);
            }
            getSchoolHolidays();
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
                setRouteStoppageTiming(prev => prev.filter(operator => operator.routeStoppageTimingID !== id));
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
                        <h2 className="text-center font-weight-light my-4"><b>School Holiday</b></h2>
                        <div className="card-body">
                            {schoolHolidays.length === 0 ? (
                                <NoData />
                            ) : (
                                <>
                                    <table id="datatablesSimple">
                                        <thead className="card-header">
                                            <tr>
                                                <th>Sr. No</th>
                                                <th>School</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>Event</th>
                                                <th>Type</th>
                                                <th>Standard</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schoolHolidays.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td >{index + 1}</td>
                                                        <td >{data.schoolName}</td>
                                                        <td >{data.startDate}</td>
                                                        <td >{data.endDate}</td>
                                                        <td >{data.event}</td>
                                                        <td >{data.type}</td>
                                                        <td >{data.standard}</td>
                                                        <td>
                                                            <Tooltip targetId={`edit-${data.schoolHolidaysID}`} position="top" text="Edit Route Stoppage" />
                                                            <button className="btn btn-outline-warning btn-sm  rounded" id={`edit-${data.schoolHolidaysID}`}
                                                            // onClick={(e) => openAllocationModal(e, data)}
                                                            >
                                                                <i className="fa-solid fa-user-pen"></i>
                                                            </button>&nbsp;

                                                            <Tooltip targetId={`delete-${data.schoolHolidaysID}`} position="top" text="Delete Route Stoppage" />
                                                            <button className="btn btn-outline-warning btn-sm rounded " id={`delete-${data.schoolHolidaysID}`} onClick={() => hendleDelete(data.routeStoppageTimingID)} >
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

export default SchoolHolidaysContent;


