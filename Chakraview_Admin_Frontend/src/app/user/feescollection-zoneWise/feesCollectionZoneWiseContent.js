'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from "@/utils/api";
import Tooltip from '@/components/Tooltip/Tooltip';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import NoData from '@/components/NoData';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/Pagination';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';

function FeesCollectionZoneWiseContent() {
    const [feesCollectionZoneWise, setFeesCollectionZoneWise] = useState([]);
    const [year, setYear] = useState("");
    const [schoolList, setSchoolList] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState();
    const [totalGrossAmount, setTotalGrossAmount] = useState();
    const [totalPaidAmount, setTotalPaidAmount] = useState();
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
            let decodeToken = jwtDecode(token);

            const getFeesCollectionZoneWise = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fees-collection-zoneWise?page=${page}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data;
                setFeesCollectionZoneWise(responseData.result);
                setLimit(responseData.totalLimit)
                setTotalGrossAmount(responseData.totalGrossAmount)
                setTotalPaidAmount(responseData.totalPaidAmount)
                setTotalPages(Math.ceil(responseData.count / responseData.totalLimit));
            }
            const getSchool = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schoolMaster/name-list?busOperatorId=${decodeToken.busOperatorID}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data;
                setSchoolList(responseData);
            }
            getSchool();
            getFeesCollectionZoneWise();
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

    const handleSearch = async () => {
        const token = getToken();
        try {
            const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fees-collection-zoneWise?&schoolID=${selectedSchool}&studentYear=${year}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${token}`
                    }
                }
            );
            let responseData = result.data.data;
            setFeesCollectionZoneWise(responseData.result);
            setTotalGrossAmount(responseData.totalGrossAmount);
            setTotalPaidAmount(responseData.totalPaidAmount);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <div className="container-fluid px-4 mt-5">
                        <h2 className="text-center font-weight-light my-4"><b>Fees Collection ZoneWise</b></h2>
                        <div className="container mt-4 d-flex flex-column align-items-center">
                            <div className="d-flex align-items-center mb-3">
                                <label htmlFor="school" className="form-label customlabel me-2">
                                    <strong>School Name</strong>
                                </label>
                                <select
                                    id="school"
                                    name="school"
                                    className="form-select  selectBox"
                                    value={selectedSchool}
                                    onChange={(e) => setSelectedSchool(e.target.value)}
                                >
                                    <option value="" >-- Select School Name --</option>
                                    {schoolList.map((school, index) => (
                                        <option key={index} value={school.schoolID}>
                                            {school.schoolName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <label htmlFor="year" className="form-label customlabel me-2">
                                    <strong>Year</strong>
                                </label>
                                <select
                                    id="year"
                                    className="form-select selectBox"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                >
                                    <option value="" >-- Select Year --</option>
                                    <option value="2024-25">2024-25</option>
                                    <option value="2025-26">2025-26</option>
                                </select>
                            </div>
                            <button className="float-end mb-3 rounded btn btn-primary btn-sm " color="info" size="sm" type="button" onClick={handleSearch}>
                                Search
                            </button>
                        </div>
                        <div className="card-body">
                            {feesCollectionZoneWise.length === 0 ? (
                                <NoData />
                            ) : (
                                <>
                                    <table id="datatablesSimple">
                                        <thead className="card-header">
                                            <tr>
                                                <th>Sr. No</th>
                                                <th>CHK Student Code</th>
                                                <th>School</th>
                                                <th>Parent Details	</th>
                                                <th>Mobile Number</th>
                                                <th>Student Details</th>
                                                <th>Address Zone</th>
                                                <th>Address</th>
                                                <th>Pickup Route </th>
                                                <th>Drop Route </th>
                                                <th>Total Gross Fees</th>
                                                <th>Mode Of Payment</th>
                                                <th>Total Paid Fees</th>
                                                <th>Payment Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tfoot>

                                            <tr >
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th><b>Total Gross<br /> Amount:</b></th>
                                                <th><b>{totalGrossAmount}</b></th>
                                                <th></th>
                                                <th><b>Total Paid<br /> Amount:</b></th>
                                                <th><b>{totalPaidAmount}</b></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                            </tr>

                                        </tfoot>
                                        <tbody>
                                            {feesCollectionZoneWise.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td >{(page - 1) * limit + index + 1}</td>
                                                        <td >{data.studentID}</td>
                                                        <td >{data.schoolName}</td>
                                                        <td >{data.fatherName}<br />
                                                            {data.motherName}
                                                        </td>
                                                        <td >{data.primaryMobileNumber}</td>
                                                        <td >{data.monthly_Amount}<br />
                                                            {data.studentName}<br />
                                                            <strong >STD:</strong>{data.studentStandard}<br />
                                                            <strong>Division:</strong>{data.studentClass}
                                                        </td>
                                                        <td >{data.addressZone}</td>
                                                        <td ><strong>Address1:</strong>{data.addressZone}<br />
                                                            <strong>Address2:</strong>{data.addressZone}
                                                        </td>
                                                        <td >{data.pickupRouteName}</td>
                                                        <td >{data.dropRouteName}</td>
                                                        <td >{data.gross_Amount}</td>
                                                        <td >{data.modeOfPayment}</td>
                                                        <td >{data.toalFeesPaidAmount}</td>
                                                        <td >{moment(data.paymentDate).format('DD MMM YYYY')}</td>
                                                        <td>
                                                            <Tooltip targetId={`edit-${data.feesID}`} position="top" text="Edit Fees Collection " />
                                                            <button className="btn btn-outline-warning btn-sm  rounded" id={`edit-${data.feesID}`}
                                                            // onClick={(e) => openAllocationModal(e, data)}
                                                            >
                                                                <i className="fa-solid fa-user-pen"></i>
                                                            </button>&nbsp;

                                                            <Tooltip targetId={`delete-${data.feesID}`} position="top" text="Delete Fees Collection " />
                                                            <button className="btn btn-outline-warning btn-sm rounded " id={`delete-${data.feesID}`} onClick={() => hendleDelete(data.routeStoppageTimingID)} >
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

export default FeesCollectionZoneWiseContent;


