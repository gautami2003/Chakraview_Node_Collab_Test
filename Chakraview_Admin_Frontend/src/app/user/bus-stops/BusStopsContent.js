'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from "@/utils/api";
import Tooltip from '@/components/Tooltip/Tooltip';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Pagination from '@/components/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import NoData from '@/components/NoData';

function BusStopsContent() {
    const [busStops, setBusStops] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState();
    const router = useRouter();
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
            const getBusStops = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bus-stoppage?page=${page}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data;
                setBusStops(responseData.result);
                setLimit(responseData.totalLimit)
                setTotalPages(Math.ceil(responseData.count / responseData.totalLimit));
            }
            getBusStops();
        } catch (error) {
            console.log(error);
        }
    }, [page])

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
                setSchool(prev => prev.filter(operator => operator.busID !== id));
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
                        <h2 className="text-center font-weight-light my-4"><b>Bus Stops</b></h2>
                        <div className="card-body">
                            {busStops.length === 0 ? (
                                <NoData />
                            ) : (
                                <>
                                    <table id="datatablesSimple">
                                        <thead className="card-header">
                                            <tr>
                                                <th>Sr. No</th>
                                                <th>Bus Stop Name</th>
                                                <th>Location</th>
                                                <th>Address</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {busStops.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td >{(page - 1) * limit + index + 1}</td>
                                                        <td >{data.stopageName}</td>
                                                        <td >{data.location}</td>
                                                        <td >
                                                            {data.addres}<br />
                                                            {`${data.cityName}, ${data.countryName}`}<br />
                                                            {`Pincode: ${data.pincode}`}
                                                            {`Lat:${data.latitude}`}<br />
                                                            {`Long:${data.longitude}`}<br />
                                                        </td>
                                                        <td>
                                                            <Tooltip targetId={`edit-${data.stoppageID}`} position="top" text="Edit Bus Stops" />
                                                            <button className="btn btn-outline-warning btn-sm  rounded" id={`edit-${data.stoppageID}`}
                                                            // onClick={(e) => openAllocationModal(e, data)}
                                                            >
                                                                <i className="fa-solid fa-user-pen"></i>
                                                            </button>&nbsp;

                                                            <Tooltip targetId={`delete-${data.stoppageID}`} position="top" text="Delete Bus Stops" />
                                                            <button className="btn btn-outline-warning btn-sm rounded " id={`delete-${data.stoppageID}`} onClick={() => hendleDelete(data.busID)} >
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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

export default BusStopsContent;


