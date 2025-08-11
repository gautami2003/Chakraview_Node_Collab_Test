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

function FeesCollectionStudentwiseContent() {
    const [feesCollectionStudentwise, setFeesCollectionStudentwise] = useState([]);
    const [modeOfPayement, setModeOfPayement] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState();
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

            const getFeesCollectionStudentwise = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fees-collection?page=${page}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data;
                setFeesCollectionStudentwise(responseData.result);
                setLimit(responseData.totalLimit);
                setTotalPages(Math.ceil(responseData.count / responseData.totalLimit));
            }
            getFeesCollectionStudentwise();
        } catch (error) {
            console.log(error);
        }
    }, [])

    // const hendleDelete = async (id, data) => {
    //     const token = getToken();
    //     let result = await Swal.fire({
    //         title: `Are you sure ?`,
    //         text: 'Do you want to delete bus ?',
    //         showCancelButton: true,
    //         confirmButtonText: "Delete",
    //     })
    //     if (result.isConfirmed) {
    //         try {
    //             const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/busMaster/${id}`,
    //                 {
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         'Authorization': `Basic ${token}`
    //                     }
    //                 }
    //             );
    //             setRouteStoppageTiming(prev => prev.filter(operator => operator.routeStoppageTimingID !== id));
    //             toast.success(response.data.message);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    // };

    const handleSearch = async () => {
        const token = getToken();
        try {
            const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fees-collection?modeOfPayment=${modeOfPayement}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${token}`
                    }
                }
            );
            let responseData = result.data.data;
            setFeesCollectionStudentwise(responseData.result);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <div className="container-fluid px-4 mt-5">
                        <h2 className="text-center font-weight-light my-4"><b>Fees Collection Studentwise</b></h2>
                        <div className="container mt-4 d-flex flex-column align-items-center">
                            <div className="d-flex align-items-center mb-3">
                                <label htmlFor="year" className="form-label customlabel me-2">
                                    <strong>Mode Of Payement</strong>
                                </label>
                                <select
                                    id="modeOfPayement"
                                    className="form-select selectBox"
                                    value={modeOfPayement}
                                    onChange={(e) => setModeOfPayement(e.target.value)}
                                >
                                    <option value="" >-- Select Mode Of Payement --</option>
                                    <option value="Online">Online</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="Electronic Transfer">Electronic Transfer</option>
                                </select>
                            </div>
                            <button className="float-end mb-3 rounded btn btn-primary btn-sm " color="info" size="sm" type="button" onClick={handleSearch}>
                                Search
                            </button>
                        </div>
                        <div className="card-body">
                            {feesCollectionStudentwise.length === 0 ? (
                                <NoData />
                            ) : (
                                <>
                                    <table id="datatablesSimple">
                                        <thead className="card-header">
                                            <tr>
                                                <th>Sr. No</th>
                                                <th>School Student Code.</th>
                                                <th>School</th>
                                                <th>Parent Details	</th>
                                                <th>Student Details</th>
                                                <th>Address Zone</th>
                                                <th>Total Fees</th>
                                                <th>Installments</th>
                                                <th>Fees Collected</th>
                                                <th>Payment Date</th>
                                                <th>Mode Of Payment</th>
                                                <th>Fees Due</th>
                                            </tr>
                                        </thead>
                                        <tfoot>

                                            <tr >
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th><b>Total Paid<br /> Amount:</b></th>
                                                <th><b>{feesCollectionStudentwise[0].totalPaideFees}</b></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                            </tr>

                                        </tfoot>
                                        <tbody>
                                            {feesCollectionStudentwise.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td >{(page - 1) * limit + index + 1}</td>
                                                        <td >{data.SchoolStudentCode}</td>
                                                        <td >{data.School}</td>
                                                        <td >{data.FatherName}<br />
                                                            {data.MotherName}<br />
                                                            {data.PrimaryMobileNumber}
                                                        </td>
                                                        <td >{data.StudentName}<br />
                                                            <strong >STD:</strong>{data.Standard}<br />
                                                            <strong>Division:</strong>{data.Class}
                                                        </td>
                                                        <td >{data.AddressZone}</td>
                                                        <td >{data.TotalFees}</td>
                                                        <td>
                                                            {data.First !== 0 && <span><strong >1st:</strong>{data.First}</span>}<br />
                                                            {data.Second !== 0 && <span><strong >2nd:</strong> {data.Second}</span>}<br />
                                                            {data.Third !== 0 && <span><strong >3rd:</strong> {data.Third}</span>}<br />
                                                            {data.Fourth !== 0 && <span><strong >4th:</strong> {data.Fourth}</span>}
                                                        </td>
                                                        {/* <td>
                                                            {data.PaidAmountFirst !== 0 && <span><strong >1st:</strong>{data.First - data.PaidAmountFirst}</span>}<br />
                                                            {data.PaidAmountSecond !== 0 && <span><strong >2nd:</strong> {data.Second - data.PaidAmountSecond}</span>}<br />
                                                            {data.PaidAmountThird !== 0 && <span><strong >3rd:</strong> {data.Third - data.PaidAmountThird}</span>}<br />
                                                            {data.PaidAmountFourth !== 0 && <span><strong >4th:</strong> {data.Fourth - data.PaidAmountFourth}</span>}
                                                        </td> */}
                                                        <td>
                                                            {data.PaidAmountFirst !== 0 && <span><strong >1st:</strong> {data.PaidAmountFirst}</span>}<br />
                                                            {data.PaidAmountSecond !== 0 && <span><strong >2nd:</strong> {data.PaidAmountSecond}</span>}<br />
                                                            {data.PaidAmountThird !== 0 && <span><strong >3rd:</strong> {data.PaidAmountThird}</span>}<br />
                                                            {data.PaidAmountFourth !== 0 && <span><strong >4th:</strong> {data.PaidAmountFourth}</span>}
                                                        </td>

                                                        <td >{moment(data.PaymentDate).format('DD MMM YYYY')}</td>
                                                        <td >{data.ModeOfPayment}</td>
                                                        <td>
                                                            {data.FirstInstallmentRemaining > 0 && <span><strong >1st:</strong> {data.FirstInstallmentRemaining}</span>}<br />
                                                            {data.SecondInstallmentRemaining > 0 && <span><strong >2nd:</strong> {data.SecondInstallmentRemaining}</span>}<br />
                                                            {data.ThirdInstallmentRemaining > 0 && <span><strong >3rd:</strong> {data.ThirdInstallmentRemaining}</span>}<br />
                                                            {data.FourthInstallmentRemaining > 0 && <span><strong >4th:</strong> {data.FourthInstallmentRemaining}</span>}
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

export default FeesCollectionStudentwiseContent;


