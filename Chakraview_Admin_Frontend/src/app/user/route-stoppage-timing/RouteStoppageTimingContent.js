'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from "@/utils/api";
import Tooltip from '@/components/Tooltip/Tooltip';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/Pagination';
import NoData from '@/components/NoData';

function RouteStoppageTimingContent() {
    const [routeStoppageTiming, setRouteStoppageTiming] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();
    const [limit, setLimit] = useState();
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get('page')) || 1;

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            router.push(`?page=${newPage}`);
        }
    };

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
            const getRouteStoppageTiming = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/route-stoppage-timing?page=${page}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data;
                setRouteStoppageTiming(responseData.result);
                setLimit(responseData.totalLimit)
                setTotalPages(Math.ceil(responseData.count / responseData.totalLimit));
            }
            getRouteStoppageTiming();
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
                        <h2 className="text-center font-weight-light my-4"><b>Route Stoppage Timing</b></h2>
                        <div className="card-body">
                            {routeStoppageTiming.length === 0 ? (
                                <NoData />
                            ) : (
                                <>
                                    <table id="datatablesSimple">
                                        <thead className="card-header">
                                            <tr>
                                                <th>Sr. No</th>
                                                <th>School</th>
                                                <th>Type</th>
                                                <th>Route Name</th>
                                                <th>Stoppage Name</th>
                                                <th>SMS</th>
                                                <th>Stoppage Time</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {routeStoppageTiming.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td >{(page - 1) * limit + index + 1}</td>
                                                        <td >{data.schoolName}</td>
                                                        <td >{data.type}</td>
                                                        <td >{data.routeName}</td>
                                                        <td >{data.stopageName}</td>
                                                        <td >
                                                            <Tooltip targetId={`SMS-${data.routeStoppageTimingID}`} position="top" text="Send SMS" />
                                                            <button className="btn btn-warning btn-sm rounded " id={`SMS-${data.routeStoppageTimingID}`}  >
                                                                <i className="fa-solid fa-comment-dots"></i>
                                                            </button>
                                                        </td>
                                                        <td >{data.stoppageTime}</td>
                                                        <td>
                                                            <Tooltip targetId={`edit-${data.routeStoppageTimingID}`} position="top" text="Edit Route Stoppage" />
                                                            <button className="btn btn-outline-warning btn-sm  rounded" id={`edit-${data.routeStoppageTimingID}`}
                                                            // onClick={(e) => openAllocationModal(e, data)}
                                                            >
                                                                <i className="fa-solid fa-user-pen"></i>
                                                            </button>&nbsp;

                                                            <Tooltip targetId={`delete-${data.routeStoppageTimingID}`} position="top" text="Delete Route Stoppage" />
                                                            <button className="btn btn-outline-warning btn-sm rounded " id={`delete-${data.routeStoppageTimingID}`} onClick={() => hendleDelete(data.routeStoppageTimingID)} >
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
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </>
    );
}

export default RouteStoppageTimingContent;


