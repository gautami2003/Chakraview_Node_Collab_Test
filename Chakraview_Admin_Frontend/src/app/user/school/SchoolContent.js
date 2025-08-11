'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from "@/utils/api";
import Tooltip from '@/components/Tooltip/Tooltip';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import NoData from '@/components/NoData';

function SchoolContent() {
    const [school, setSchool] = useState([]);
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
            let busOperatorId = jwtDecode(token);
            const getSchool = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schoolMaster/?busOperatorId=${busOperatorId.busOperatorID}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data;
                setSchool(responseData);
                // setTotalPages(Math.ceil(responseData.count / responseData.totalLimit));
            }
            getSchool();
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
                        <h2 className="text-center font-weight-light my-4"><b>Schools</b></h2>
                        <div className="card-body">
                            {school.length === 0 ? (
                                <NoData />
                            ) : (
                                <>
                                    <table id="datatablesSimple">
                                        <thead className="card-header">
                                            <tr>
                                                <th>Sr. No</th>
                                                <th>Name</th>
                                                <th>Address</th>
                                                <th>School Incharge Details</th>
                                                <th>SMS</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {school.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td >{index + 1}</td>
                                                        <td >{data.schoolName}</td>
                                                        <td >{data.address2}<br />
                                                            {`${data.cityName},${data.cuntryName}`}<br />
                                                            {`Pincode:${data.pincode}`}<br />
                                                            {`Lat:${data.latitude}`}<br />
                                                            {`Long:${data.longitude}`}<br />
                                                        </td>
                                                        <td >
                                                            Pre Primary:{data.prePrimarySectionInchargeName}{data.prePrimarySectionInchargeNumber && <>(Contact #: {data.prePrimarySectionInchargeNumber})</>}<br />
                                                            Primary: {data.primarySectionInchargeName}{data.primarySectionInchargeNumber && <>(Contact #: {data.primarySectionInchargeNumber})</>}<br />
                                                            Secondary: {data.secondarySectionInchargeName}{data.secondarySectionInchargeNumber && (<>(Contact #: ${data.secondarySectionInchargeNumber})</>)}
                                                        </td>
                                                        <td >
                                                            <Tooltip targetId={`SMS-${data.busID}`} position="top" text="Send SMS" />
                                                            <button className="btn btn-warning btn-sm rounded " id={`SMS-${data.busID}`}  >
                                                                <i className="fa-solid fa-comment-dots"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <Tooltip targetId={`edit-${data.busID}`} position="top" text="Edit School" />
                                                            <button className="btn btn-outline-warning btn-sm  rounded" id={`edit-${data.busID}`}
                                                            // onClick={(e) => openAllocationModal(e, data)}
                                                            >
                                                                <i className="fa-solid fa-user-pen"></i>
                                                            </button>&nbsp;

                                                            <Tooltip targetId={`delete-${data.busID}`} position="top" text="Delete School" />
                                                            <button className="btn btn-outline-warning btn-sm rounded " id={`delete-${data.busID}`} onClick={() => hendleDelete(data.busID)} >
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

export default SchoolContent;


