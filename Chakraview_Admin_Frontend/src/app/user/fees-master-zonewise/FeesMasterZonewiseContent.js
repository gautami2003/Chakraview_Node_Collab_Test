'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from "@/utils/api";
import Tooltip from '@/components/Tooltip/Tooltip';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import NoData from '@/components/NoData';
import AddEditFeesMasterZonewise from './AddEditFeesMasterZonewise';

function FeesMasterZonewiseContent() {
    const [feesMasterZonewise, setFeesMasterZonewise] = useState([]);
    const [showFeesMasterZonewise, setShowFeesMasterZonewise] = useState(false);
    const [selectedFeesMasterZonewise, setSelectedFeesMasterZonewise] = useState(null);

    const openFeesMasterZonewise = (e, data) => {
        e.preventDefault();
        setSelectedFeesMasterZonewise(data);
        setShowFeesMasterZonewise(true);
    };

    const handleAddFeesMasterZonewise = () => {
        setSelectedFeesMasterZonewise(null);
        setShowFeesMasterZonewise(true);
    };


    const closeFeesMasterZonewise = () => {
        setSelectedFeesMasterZonewise(null);
        setShowFeesMasterZonewise(false);
    };


    useEffect(() => {
        try {
            const token = getToken();
            const getFeesMasterZonewise = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fees-master-zonewise`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data;
                setFeesMasterZonewise(responseData);
            }
            getFeesMasterZonewise();
        } catch (error) {
            console.log(error);
        }
    }, [])

    const hendleDelete = async (id) => {
        const token = getToken();
        let result = await Swal.fire({
            title: `Are you sure ?`,
            text: 'Do you want to delete bus ?',
            showCancelButton: true,
            confirmButtonText: "Delete",
        })
        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/fees-master-zonewise/${id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                setFeesMasterZonewise(prev => prev.filter(data => data.feesID !== id));
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
                        <h2 className="text-center font-weight-light my-4"><b>Fees Master Zonewise</b></h2>
                        <div className="card-body">
                            {feesMasterZonewise.length === 0 ? (
                                <NoData />
                            ) : (
                                <>
                                    <button className="float-end mb-3 rounded btn btn-primary btn-sm " color="info" size="sm" type="button" onClick={handleAddFeesMasterZonewise}>
                                        Add Fees Master Zonewise
                                    </button>
                                    <table id="datatablesSimple ">
                                        <thead className="card-header">
                                            <tr>
                                                <th>Sr. No</th>
                                                <th>School</th>
                                                <th>AddressZone</th>
                                                <th>Currency</th>
                                                <th>Monthly Period</th>
                                                <th>Monthly Amount</th>
                                                <th>Quarterly Period</th>
                                                <th>Quarterly Amount</th>
                                                <th>Quadrimester Period	</th>
                                                <th>Quadrimester Amount	</th>
                                                <th>Semi Annual Period</th>
                                                <th>Semi Annual Amount</th>
                                                <th>Annual Period</th>
                                                <th>Annual Amount</th>
                                                <th>Due Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {feesMasterZonewise.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td >{index + 1}</td>
                                                        <td >{data.schoolName}</td>
                                                        <td >{data.addressZone}</td>
                                                        <td >{data.currency}</td>
                                                        <td >{data.monthly_Period != "- To -" ? data.monthly_Period : ""}</td>
                                                        <td >{data.monthly_Amount}</td>
                                                        <td >{data.quarterly_Period != "- To -" ? data.quarterly_Period : ""}</td>
                                                        <td >{data.quarterly_Amount}</td>
                                                        <td >{data.quadrimester_Period != "- To -" ? data.quadrimester_Period : ""}</td>
                                                        <td >{data.quadrimester_Amount}</td>
                                                        <td >{data.semiAnnual_Period != "- To -" ? data.semiAnnual_Period : ""}</td>
                                                        <td >{data.semiAnnual_Amount}</td>
                                                        <td >{data.annual_Period != "- To -" ? data.annual_Period : ""}</td>
                                                        <td >{data.annual_Amount}</td>
                                                        <td >{data.duedateForPayment}</td>
                                                        <td>
                                                            <Tooltip targetId={`edit-${data.feesID}`} position="top" text="Edit Fees Master " />
                                                            <button className="btn btn-outline-warning btn-sm  rounded" id={`edit-${data.feesID}`} onClick={(e) => openFeesMasterZonewise(e, data)}>
                                                                <i className="fa-solid fa-user-pen"></i>
                                                            </button>&nbsp;

                                                            <Tooltip targetId={`delete-${data.feesID}`} position="top" text="Delete Fees Master " />
                                                            <button className="btn btn-outline-warning btn-sm rounded " id={`delete-${data.feesID}`} onClick={() => hendleDelete(data.feesID)} >
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
            {showFeesMasterZonewise && (
                <AddEditFeesMasterZonewise onClose={closeFeesMasterZonewise} feesMasterZonewise={selectedFeesMasterZonewise} datas={feesMasterZonewise} />
            )}
        </>
    );
}

export default FeesMasterZonewiseContent;


