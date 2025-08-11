'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from "@/utils/api";
import Tooltip from '@/components/Tooltip/Tooltip';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import NoData from '@/components/NoData';

function FeesMasterStudentwiseContent() {
    const [feesMasterStudentwise, setFeesMasterStudentwise] = useState([]);

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
            const getFeesMasterStudentwise = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fees-master-studentwise`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data;
                setFeesMasterStudentwise(responseData);
            }
            getFeesMasterStudentwise();
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
                        <h2 className="text-center font-weight-light my-4"><b>Fees Master Studentwise</b></h2>
                        <div className="card-body">
                            {feesMasterStudentwise.length === 0 ? (
                                <NoData />
                            ) : (
                                <>
                                    <table id="datatablesSimple">
                                        <thead className="card-header">
                                            <tr>
                                                <th>Sr. No</th>
                                                <th>School</th>
                                                <th>Parent Details</th>
                                                <th>Student Details</th>
                                                <th>Total Fees</th>
                                                <th>Installments</th>
                                                <th>Fees Collected</th>
                                                <th>Fees Due</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {feesMasterStudentwise.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td >{index + 1}</td>
                                                        <td >{data.schoolName}</td>
                                                        <td >{data.fatherName}<br />
                                                            {data.motherName}<br />
                                                            {data.primaryMobileNumber}
                                                        </td>
                                                        <td >{data.studentName}<br />
                                                            <strong >Chakraview Code:</strong>{data.chakraviewCode}<br />
                                                            <strong >School Code:</strong>{data.schoolCode}<br />
                                                            <strong >STD: </strong>{data.studentStandard}<br />
                                                            <strong >Division:</strong>{data.studentClass}
                                                        </td>
                                                        <td >{data.feesAmount}</td>
                                                        <td>
                                                            {data.firstInstallment !== 0 && <span><strong >1st:</strong>{data.firstInstallment}</span>}<br />
                                                            {data.secondInstallment !== 0 && <span><strong >2nd:</strong> {data.secondInstallment}</span>}<br />
                                                            {data.thirdInstallment !== 0 && <span><strong >3rd:</strong> {data.thirdInstallment}</span>}<br />
                                                            {data.fourthInstallment !== 0 && <span><strong >4th:</strong> {data.fourthInstallment}</span>}
                                                        </td>

                                                        <td>
                                                            {data.paidFirstInstallment !== 0 && <span><strong >1st:</strong> {data.paidFirstInstallment}</span>}<br />
                                                            {data.paidSecondInstallment !== 0 && <span><strong >2nd:</strong> {data.paidSecondInstallment}</span>}<br />
                                                            {data.paidThirdInstallment !== 0 && <span><strong >3rd:</strong> {data.paidThirdInstallment}</span>}<br />
                                                            {data.paidFourthInstallment !== 0 && <span><strong >4th:</strong> {data.paidFourthInstallment}</span>}
                                                        </td>

                                                        <td>
                                                            {data.firstInstallmentRemaining > 0 && <span><strong >1st:</strong> {data.firstInstallmentRemaining}</span>}<br />
                                                            {data.secondInstallmentRemaining > 0 && <span><strong >2nd:</strong> {data.secondInstallmentRemaining}</span>}<br />
                                                            {data.thirdInstallmentRemaining > 0 && <span><strong >3rd:</strong> {data.thirdInstallmentRemaining}</span>}<br />
                                                            {data.fourthInstallmentRemaining > 0 && <span><strong >4th:</strong> {data.fourthInstallmentRemaining}</span>}
                                                        </td>

                                                        <td>
                                                            <Tooltip targetId={`edit-${data.feesID}`} position="top" text="Edit Fees Master " />
                                                            <button className="btn btn-outline-warning btn-sm  rounded" id={`edit-${data.feesID}`}
                                                            // onClick={(e) => openAllocationModal(e, data)}
                                                            >
                                                                <i className="fa-solid fa-user-pen"></i>
                                                            </button>&nbsp;

                                                            <Tooltip targetId={`delete-${data.feesID}`} position="top" text="Delete Fees Master " />
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
        </>
    );
}

export default FeesMasterStudentwiseContent;


