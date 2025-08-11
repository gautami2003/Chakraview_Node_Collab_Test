"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import AddEditSimcard from './AddEditMDMSimcard';
import Tooltip from '@/components/Tooltip/Tooltip';
import { getToken } from "@/utils/api";
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/Pagination';
import NoData from '@/components/NoData';

function MDMSimcardContent() {
    const [mdmSimcard, setmdmSimcard] = useState([]);
    const [listmdmSimcard, setListmdmSimcard] = useState([]);
    const [singalSimSerialNumber, setSingalSimSerialNumber] = useState("");
    const [singalNetworkProvider, setSingalNetworkProvider] = useState("");
    const [singalSimType, setSingalSimType] = useState("");
    const [singalSimStatus, setSingalSimStatus] = useState("");
    const [showaddEditSimcard, setShowaddEditSimcard] = useState(false);
    const [selectedsimcard, setSelectedsimcard] = useState(null);
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

    const openSimcardModal = (e, data) => {
        e.preventDefault();
        setSelectedsimcard(data);
        setShowaddEditSimcard(true);
    };

    const handleAddSimcard = () => {
        setSelectedsimcard(null);
        setShowaddEditSimcard(true);
    };

    const closeSimcardModal = () => {
        setSelectedsimcard(null);
        setShowaddEditSimcard(false);
    };


    useEffect(() => {
        const token = getToken();
        try {
            const getmdmSimcard = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mdmSimcards?page=${page}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data
                setmdmSimcard(responseData.result)
                setLimit(responseData.totalLimit)
                setTotalPages(Math.ceil(responseData.count / responseData.totalLimit));
            }
            const getmdmSimcardList = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mdmSimcards/name-list`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data
                setListmdmSimcard(responseData)
            }
            getmdmSimcardList();
            getmdmSimcard();
        } catch (error) {
            console.log(error);
        }
    }, [page])

    const hendleDelete = async (id, data) => {
        const token = getToken();
        let result = await Swal.fire({
            title: `Are you sure ?`,
            text: 'Do you want to delete MDMSimcard?',
            showCancelButton: true,
            confirmButtonText: "Delete",
        })
        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/mdmSimcards/${id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                setmdmSimcard(prev => prev.filter(simcard => simcard.SIMID !== id));
                toast.success(response.data.message);
            } catch (error) {
                console.log(error);
            }
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'simSerialNumber') setSingalSimSerialNumber(value);
        if (name === 'simType') setSingalSimType(value);
        if (name === 'networkProvider') setSingalNetworkProvider(value);
        if (name === 'simStatus') setSingalSimStatus(value);
    };

    const handleSearch = async () => {
        const token = getToken();
        try {
            const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mdmSimcards?simSerialNumber=${singalSimSerialNumber}&networkProvider=${singalNetworkProvider}&simType=${singalSimType}&simStatus=${singalSimStatus}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${token}`
                },
            });

            const responseData = result.data.data;
            setmdmSimcard(responseData.result);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <div className="container-fluid px-4 mt-5">
                        <h2 className="text-center font-weight-light/ my-4"><b>Simcards</b></h2>
                        <div className="container mt-4 d-flex flex-column align-items-center">
                            {/* <div className="d-flex align-items-center mb-3">
                                <label htmlFor="school" className="form-label customlabel me-2">
                                    <strong>Status</strong>
                                </label>
                                <select
                                    id="school"
                                    name="school"
                                    className="form-select  selectBox"
                                value={singalSchool}
                                onChange={handleChange}
                                >
                                    <option value="" >-- Select Status --</option>
                                    {listmdmAllocation.schoolListresult?.map((school, index) => (
                                        <option key={index} value={school}>
                                            {school}
                                        </option>
                                    ))}
                                </select>
                            </div> */}
                            <div className="d-flex align-items-center mb-3">
                                <label htmlFor="simSerialNumber" className="form-label customlabel me-2">
                                    <strong>Sim Serial Number</strong>
                                </label>
                                <select
                                    id="simSerialNumber"
                                    name="simSerialNumber"
                                    className="form-select selectBox"
                                    value={singalSimSerialNumber}
                                    onChange={handleChange}
                                >
                                    <option value="" >-- Select Sim Number --</option>
                                    {listmdmSimcard.simSerialNo?.map((simNo, index) => (
                                        <option key={index} value={simNo}>
                                            {simNo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <label htmlFor="simType" className="form-label customlabel me-2">
                                    <strong>Sim Type</strong>
                                </label>
                                <select
                                    id="simType"
                                    name="simType"
                                    className="form-select selectBox"
                                    value={singalSimType}
                                    onChange={handleChange}
                                >
                                    <option value="" >-- Select Sim Type --</option>
                                    {listmdmSimcard.simType?.map((simType, index) => (
                                        <option key={index} value={simType}>
                                            {simType}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <label htmlFor="networkProvider" className="form-label customlabel me-2">
                                    <strong>Network Provider</strong>
                                </label>
                                <select
                                    id="networkProvider"
                                    name="networkProvider"
                                    className="form-select selectBox"
                                    value={singalNetworkProvider}
                                    onChange={handleChange}
                                >
                                    <option value="" >-- Select Network Provider --</option>
                                    {listmdmSimcard.networkProvider?.map((networkProvider, index) => (
                                        <option key={index} value={networkProvider}>
                                            {networkProvider}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <label htmlFor="simStatus" className="form-label customlabel me-2">
                                    <strong>Sim Status</strong>
                                </label>
                                <select
                                    id="simStatus"
                                    name="simStatus"
                                    className="form-select selectBox"
                                    value={singalSimStatus}
                                    onChange={handleChange}
                                >
                                    <option value="" >-- Select Sim Status --</option>
                                    {listmdmSimcard.simStatus?.map((simStatus, index) => (
                                        <option key={index} value={simStatus}>
                                            {simStatus}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button className="float-end mb-3 rounded btn btn-primary btn-sm " color="info" size="sm" type="button" onClick={handleSearch}>
                                Search
                            </button>
                        </div>
                        <div className="card-body">
                            {mdmSimcard.length === 0 ? (
                                <NoData />
                            ) : (
                                <>
                                    <button className="float-end mb-3 rounded btn btn-primary btn-sm " color="info" size="sm" type="button" onClick={handleAddSimcard}>
                                        Add MDM Simcard
                                    </button>
                                    <table id="datatablesSimple">
                                        <thead className="card-header">
                                            <tr>
                                                <th>Sr. No</th>
                                                <th >MDM Simcard Details</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mdmSimcard.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{(page - 1) * limit + index + 1}</td>
                                                        <td>
                                                            <strong className="mdmDataLabe">Sim Serial Number :</strong>
                                                            <span>{data.SimSerialNumber}</span><br />
                                                            <strong className="mdmDataLabe">Network Provider :</strong>
                                                            <span>{data.NetworkProvider}</span><br /><br />
                                                            <strong className="mdmDataLabe">CustID :</strong>
                                                            <span>{data.CustID}</span><br /><br />
                                                            <strong className="mdmDataLabe">Sim Type :</strong>
                                                            <span>{data.SimType}</span><br />
                                                            <strong className="mdmDataLabe">Recharge Type :</strong>
                                                            <span>{data.RechargeType}</span><br />
                                                            <strong className="mdmDataLabe">Phone Number :</strong>
                                                            <span>{data.PhoneNumber}</span><br />
                                                            <strong className="mdmDataLabe">SIM Number :</strong>
                                                            <span>{data.SIMNumber}</span><br />
                                                            <strong className="mdmDataLabe">SIM Purchase Date :</strong>
                                                            <span>{data.SIMPurchaseDate}</span><br /> <br />
                                                            <strong className="mdmDataLabe">PostPaid Plan Name :</strong>
                                                            <span>{data.PostpaidPlanName}</span><br />
                                                            <strong className="mdmDataLabe">PostPaid Plan Rental :</strong>
                                                            <span>{data.PostpaidPlanRental}</span><br />
                                                            <strong className="mdmDataLabe">Prepaid Plan Name :</strong>
                                                            <span>{data.PrepaidPlanName}</span><br />
                                                            <strong className="mdmDataLabe">Prepaid Recharge Date :</strong>
                                                            <span>{data.PrepaidRechargeDate}</span><br />
                                                            <strong className="mdmDataLabe">Prepaid Recharge Amount :</strong>
                                                            <span>{data.PrepaidRechargeAmount}</span><br /> <br />
                                                            <strong className="mdmDataLabe">Sim Status :</strong>
                                                            <span>{data.SimStatus}</span><br />
                                                        </td>
                                                        <td>
                                                            {/* <i className="fa-solid fa-ellipsis-vertical"></i>&nbsp; */}
                                                            {/* <button className=" rounded" data-tooltip-id={`edit-${data.SIMID}`}> */}
                                                            <Tooltip targetId={`edit-${data.SIMID}`} position="top" text="Edit MDMSimcard" />
                                                            <button className="btn btn-outline-warning btn-sm  rounded" id={`edit-${data.SIMID}`} onClick={(e) => openSimcardModal(e, data)}>
                                                                <i className="fa-solid fa-user-pen"></i>
                                                            </button>&nbsp;


                                                            <button className="btn btn-outline-warning btn-sm  rounded" id={`delete-MDMSimcard-${data.SIMID}`} onClick={() => hendleDelete(data.SIMID)}>
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>&nbsp;
                                                            <Tooltip targetId={`delete-MDMSimcard-${data.SIMID}`} position="top" text="Delete MDMSimcard" />

                                                            <button className="btn btn-outline-warning btn-sm  rounded" id={`history-${data.SIMID}`} onClick={() => hendleDelete(data.SIMID)}>
                                                                <i className="fa-solid fa-clock-rotate-left"></i>
                                                            </button>
                                                            <Tooltip targetId={`history-${data.SIMID}`} position="top" text="History" />

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
                    </div>
                </main >
            </div >
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            {
                showaddEditSimcard && (
                    <AddEditSimcard onClose={closeSimcardModal} simcard={selectedsimcard} />
                )
            }
        </>
    );
}

export default MDMSimcardContent;