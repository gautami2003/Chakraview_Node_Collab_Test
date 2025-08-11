'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from "@/utils/api";
import Tooltip from '@/components/Tooltip/Tooltip';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import NoData from '@/components/NoData';

function PickupRouteContent() {
    const [pickupRoute, setPickupRoute] = useState([]);
    // const [businessType, setBusinessType] = useState("B2B");
    // const [busOperatorName, setBusOperatorName] = useState([]);
    // const [singalbusOperator, setSingalbusOperator] = useState("");
    // const [showSchoolModal, setShowSchoolModal] = useState(false);
    // const [selectedOperator, setSelectedOperator] = useState(null);
    // const [totalPages, setTotalPages] = useState(1);
    // const router = useRouter();

    // const searchParams = useSearchParams();
    // // console.log(singalbusOperator, "singalbusOperatorsingalbusOperatorsingalbusOperatorsingalbusOperatorsingalbusOperator");

    // const page = parseInt(searchParams.get('page')) || 1;

    // const handlePageChange = (newPage) => {
    //     if (newPage > 0 && newPage <= totalPages) {
    //         router.push(`?page=${newPage}`);
    //     }
    // };

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
            const getPickupRoute = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pickupRouteMaster`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data;
                setPickupRoute(responseData);
                // setTotalPages(Math.ceil(responseData.count / responseData.totalLimit));
            }
            getPickupRoute();
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
                        <h2 className="text-center font-weight-light my-4"><b>Pickup Route</b></h2>
                        <div className="card-body">
                            {pickupRoute.length === 0 ? (
                                <NoData />
                            ) : (
                                <>
                                    <table id="datatablesSimple">
                                        <thead className="card-header">
                                            <tr>
                                                <th>Sr. No</th>
                                                <th>School</th>
                                                <th>Route Name	</th>
                                                <th>Bus Name</th>
                                                <th>Bus Attendant</th>
                                                <th>Start Time</th>
                                                <th>End Time</th>
                                                <th>Ideal KMS</th>
                                                <th>SMS</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pickupRoute.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td >{index + 1}</td>
                                                        <td >{data.schoolName}</td>
                                                        <td >{data.routeName}</td>
                                                        <td >{data.busName}</td>
                                                        <td >{data.driverName}</td>
                                                        <td >{`${data.startTimeHour} : ${data.startTimeMinute} : ${data.startTimeAMPM}`}</td>
                                                        <td >{`${data.endTimeHour} : ${data.endTimeMinute} : ${data.endTimeAMPM}`}</td>
                                                        <td >{data.idealKMS}</td>
                                                        <td >
                                                            <Tooltip targetId={`SMS-${data.pickupRouteID}`} position="top" text="Send SMS" />
                                                            <button className="btn btn-warning btn-sm rounded " id={`SMS-${data.pickupRouteID}`}  >
                                                                <i className="fa-solid fa-comment-dots"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <Tooltip targetId={`edit-${data.pickupRouteID}`} position="top" text="Edit Pickup Route" />
                                                            <button className="btn btn-outline-warning btn-sm  rounded" id={`edit-${data.pickupRouteID}`}
                                                            // onClick={(e) => openAllocationModal(e, data)}
                                                            >
                                                                <i className="fa-solid fa-user-pen"></i>
                                                            </button>&nbsp;

                                                            <Tooltip targetId={`delete-${data.pickupRouteID}`} position="top" text="Delete Pickup Route" />
                                                            <button className="btn btn-outline-warning btn-sm rounded " id={`delete-${data.pickupRouteID}`} onClick={() => hendleDelete(data.busID)} >
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
            {/* <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            /> */}
        </>
    );
}

export default PickupRouteContent;


