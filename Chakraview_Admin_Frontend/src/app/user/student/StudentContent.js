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

function StudentContent() {
    const [student, setStudent] = useState([]);
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
            const getStudent = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students?page=${page}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data;
                setStudent(responseData.result);
                setLimit(responseData.totalLimit)
                setTotalPages(Math.ceil(responseData.count / responseData.totalLimit));
            }
            getStudent();
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
                setSchool(prev => prev.filter(operator => operator.studentID !== id));
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
                        <h2 className="text-center font-weight-light my-4"><b>Students</b></h2>
                        <div className="card-body">
                            {student.length === 0 ? (
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
                                                <th>Bus Name</th>
                                                <th>Route Details</th>
                                                <th>SMS</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {student.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td >{(page - 1) * limit + index + 1}</td>
                                                        <td >{data.schoolCode}<br />
                                                            {data.schoolName}<br />
                                                            {data.schoolSection}
                                                        </td>
                                                        <td>
                                                            {data.fatherMobileNumber && (
                                                                <>
                                                                    {data.fatherMobileNumber}
                                                                    <strong> [F]</strong>
                                                                    {data.primaryMobileNumberOf === "Father" && <strong> [P]</strong>}
                                                                    <br />
                                                                </>
                                                            )}

                                                            {data.motherMobileNumber && (
                                                                <>
                                                                    {data.motherMobileNumber}
                                                                    <strong> [M]</strong>
                                                                    {data.primaryMobileNumberOf === "Mother" && <strong> [P]</strong>}
                                                                    <br />
                                                                </>
                                                            )}

                                                            {data.otherMobileNumber && (
                                                                <>
                                                                    {data.otherMobileNumber}
                                                                    <strong> [O]</strong>
                                                                    {data.primaryMobileNumberOf === "Other" && <strong> [P]</strong>}
                                                                    <br />
                                                                </>
                                                            )}
                                                        </td>

                                                        <td >
                                                            {data.chakraviewCode}<br />
                                                            {data.studentName}<br />
                                                            {data.studentNameHindi}<br />
                                                            STD: {data.studentStandard}<br />
                                                            Division: {data.studentClass}<br />
                                                            Year: {data.year}<br />
                                                        </td>
                                                        <td>{data.busName}</td>
                                                        <td >
                                                            {data.fromRouteName &&
                                                                <>
                                                                    <i className="fa-solid fa-right-long"></i>&nbsp;
                                                                    {data.fromRouteName}{data.fromStoppageName && `(${data.fromStoppageName})`}<br />
                                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<small>{data.pickupDays && `(${data.pickupDays})`}</small>
                                                                </>
                                                            }
                                                            <hr className='m-0' />
                                                            {data.toRouteName &&
                                                                <>
                                                                    <i className="fa-solid fa-left-long"></i>&nbsp;
                                                                    {data.toRouteName}{data.toStoppageName && `(${data.toStoppageName})`}<br />
                                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<small>{data.dropDays && `(${data.dropDays})`}</small><br />
                                                                </>
                                                            }
                                                            {data.stayBackToRouteName &&
                                                                <>
                                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Stay Back: </strong>
                                                                    {data.stayBackToRouteName}{data.toStoppageName && `(${data.toStoppageName})`}<br />
                                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<small>{data.stayBackDropDays && `(${data.stayBackDropDays})`}</small>
                                                                </>
                                                            }
                                                        </td>
                                                        <td >
                                                            <Tooltip targetId={`SMS-${data.studentID}`} position="top" text="Send SMS" />
                                                            <button className="btn btn-warning btn-sm rounded " id={`SMS-${data.studentID}`}  >
                                                                <i className="fa-solid fa-comment-dots"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <i
                                                                className={`fa-solid ${data.isActive === "Y" ? "fa-toggle-on text-success fa-xl" : "fa-toggle-off text-danger fa-xl"}`}
                                                            // onClick={() => handleClick(data.BusOperatorID, data.isActive)}
                                                            ></i>

                                                            {/* <button type="submit" className="btn btn-primary px-4" onClick={() => handleClick(data.BusOperatorID, data.isActive)}>{data.isActive == "N" ? "Active" : "Inactive"}</button> */}
                                                        </td>
                                                        <td>
                                                            <Tooltip targetId={`edit-${data.studentID}`} position="top" text="Edit Student" />
                                                            <button className="btn btn-outline-warning btn-sm  rounded" id={`edit-${data.studentID}`}
                                                            // onClick={(e) => openAllocationModal(e, data)}
                                                            >
                                                                <i className="fa-solid fa-user-pen"></i>
                                                            </button>&nbsp;

                                                            <Tooltip targetId={`delete-${data.studentID}`} position="top" text="Delete Student" />
                                                            <button className="btn btn-outline-warning btn-sm rounded " id={`delete-${data.studentID}`} onClick={() => hendleDelete(data.studentID)} >
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

export default StudentContent;


