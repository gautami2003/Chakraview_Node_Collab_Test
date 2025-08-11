"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Tooltip from '@/components/Tooltip/Tooltip';
import AddEditAllocation from './AddEditAllocation';
import { getToken } from "@/utils/api";
import Pagination from '@/components/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import NoData from '@/components/NoData';

function MDMAllocationContent() {
    const [mdmAllocation, setmdmAllocation] = useState([]);
    const [listmdmAllocation, setListmdmAllocation] = useState([]);
    const [singalSchool, setSingalSchool] = useState("");
    const [singalDeviceSerialNumber, setSingalDeviceSerialNumber] = useState("");
    const [singalSimSerialNumber, setSingalSimSerialNumber] = useState("");
    const [singalAttendant, setSingalAttendant] = useState("");
    const [showaddEditAllocation, setShowaddEditAllocation] = useState(false);
    const [selectedAllocation, setSelectedAllocation] = useState(null);
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

    const openAllocationModal = (e, data) => {
        e.preventDefault();
        setSelectedAllocation(data);
        setShowaddEditAllocation(true);
    };

    const handleAddAllocation = () => {
        setSelectedAllocation(null);
        setShowaddEditAllocation(true);
    };

    const closeAllocationModal = () => {
        setSelectedAllocation(null);
        setShowaddEditAllocation(false);
    };



    useEffect(() => {
        const token = getToken();
        try {
            const getmdmAllocation = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mdmAllocation?page=${page}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data
                setmdmAllocation(responseData.result);
                setLimit(responseData.totalLimit);
                setTotalPages(Math.ceil(responseData.count / responseData.totalLimit));
            }
            const getmdmAllocationList = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mdmAllocation/name-list`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data
                setListmdmAllocation(responseData);
            }
            getmdmAllocationList();
            getmdmAllocation();
        } catch (error) {
            console.log(error);
        }
    }, [page])

    const hendleDelete = async (id, data) => {
        const token = getToken();
        let result = await Swal.fire({
            title: `Are you sure?`,
            text: 'Do you want to delete mdmAllocation?',
            showCancelButton: true,
            confirmButtonText: "Delete",
        })
        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/mdmAllocation/${id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                setmdmAllocation(prev => prev.filter(mdmAllocation => mdmAllocation.allocationID !== id));
                toast.success(response.data.message);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'school') setSingalSchool(value);
        if (name === 'deviceSerialNumber') setSingalDeviceSerialNumber(value);
        if (name === 'simSerialNumber') setSingalSimSerialNumber(value);
        if (name === 'attendant') setSingalAttendant(value);
    };

    const handleSearch = async () => {
        const token = getToken();
        try {
            const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mdmAllocation`, {
                // const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mdmAllocation/deviceSerialNumber=${singalDeviceSerialNumber}&school=${singalSchool}&simSerialNumber=${singalSimSerialNumber}&attendant=${singalAttendant}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${token}`
                },
                params: {
                    page,
                    school: singalSchool,
                    deviceSerialNumber: singalDeviceSerialNumber,
                    simSerialNumber: singalSimSerialNumber,
                    attendant: singalAttendant
                }
            });

            const responseData = result.data.data;
            setmdmAllocation(responseData.result);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <div className="container-fluid px-4 mt-5">
                        <h2 className="text-center font-weight-light my-4"><b>Allocation Devices</b></h2>
                        <div className="container mt-4 d-flex flex-column align-items-center">
                            <div className="d-flex align-items-center mb-3">
                                <label htmlFor="school" className="form-label customlabel me-2">
                                    <strong>School Name</strong>
                                </label>
                                <select
                                    id="school"
                                    name="school"
                                    className="form-select  selectBox"
                                    value={singalSchool}
                                    onChange={handleChange}
                                >
                                    <option value="" >-- Select School Name --</option>
                                    {listmdmAllocation.schoolListresult?.map((school, index) => (
                                        <option key={index} value={school}>
                                            {school}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <label htmlFor="deviceSerialNumber" className="form-label customlabel me-2">
                                    <strong>Device Number</strong>
                                </label>
                                <select
                                    id="deviceSerialNumber"
                                    name="deviceSerialNumber"
                                    className="form-select selectBox"
                                    value={singalDeviceSerialNumber}
                                    onChange={handleChange}
                                >
                                    <option value="" >-- Select Device Number --</option>
                                    {listmdmAllocation.deviceSerialNumberresult?.map((deviceSerialNumber, index) => (
                                        <option key={index} value={deviceSerialNumber}>
                                            {deviceSerialNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <label htmlFor="simSerialNumber" className="form-label customlabel me-2">
                                    <strong>Sim Number</strong>
                                </label>
                                <select
                                    id="simSerialNumber"
                                    name="simSerialNumber"
                                    className="form-select selectBox"
                                    value={singalSimSerialNumber}
                                    onChange={handleChange}
                                >
                                    <option value="" >-- Select Sim Number --</option>
                                    {listmdmAllocation.simSerialNumberresult?.map((simSerialNumber, index) => (
                                        <option key={index} value={simSerialNumber}>
                                            {simSerialNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <label htmlFor="attendant" className="form-label customlabel me-2">
                                    <strong>Attendant Name</strong>
                                </label>
                                <select
                                    id="attendant"
                                    name="attendant"
                                    className="form-select selectBox"
                                    value={singalAttendant}
                                    onChange={handleChange}
                                >
                                    <option value="" >-- Select Attendant Name --</option>
                                    {listmdmAllocation.attendantresult?.map((attendant, index) => (
                                        <option key={index} value={attendant}>
                                            {attendant}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button className="float-end mb-3 rounded btn btn-primary btn-sm " color="info" size="sm" type="button" onClick={handleSearch}>
                                Search
                            </button>
                        </div>
                        <div className="card-body">
                            {mdmAllocation.length === 0 ? (
                                <NoData />
                            ) : (
                                <>
                                    <button className="float-end mb-3 rounded btn btn-primary btn-sm " color="info" size="sm" type="button" onClick={handleAddAllocation}>
                                        Add MDM Allocation
                                    </button>
                                    <table id="datatablesSimple">
                                        <thead className="card-header">
                                            <tr>
                                                <th>Sr. No</th>
                                                <th >MDM Allocation</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                mdmAllocation.map((data, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{(page - 1) * limit + index + 1}</td>
                                                            <td>
                                                                <strong className="mdmDataLabe">DeviceSerialNumber:</strong>
                                                                <span>{data.deviceSerialNumber}</span><br />
                                                                <strong className="mdmDataLabe">SimSerialNumber:</strong>
                                                                <span>{data.simSerialNumber}</span><br />
                                                                <strong className="mdmDataLabe">School:</strong>
                                                                <span>{data.school}</span><br />
                                                                <strong className="mdmDataLabe">Attendant:</strong>
                                                                <span>{data.attendant}</span><br />
                                                                <strong className="mdmDataLabe">Device Submit Date:</strong>
                                                                <span>{data.deviceSubmitDate}</span><br />
                                                                <strong className="mdmDataLabe">Device Submit Person:</strong>
                                                                <span>{data.device_Submit_Person}</span><br />
                                                            </td>
                                                            <td>
                                                                {/* <i className="fa-solid fa-ellipsis-vertical"></i>&nbsp; */}
                                                                {/* <button className=" rounded" data-tooltip-id={`edit-${data.allocationID}`}> */}
                                                                <Tooltip targetId={`edit-${data.allocationID}`} position="top" text="Edit MDMAllocation" />
                                                                <button className="btn btn-outline-warning btn-sm  rounded" id={`edit-${data.allocationID}`} onClick={(e) => openAllocationModal(e, data)}>
                                                                    <i className="fa-solid fa-user-pen"></i>
                                                                </button>&nbsp;

                                                                <button className="btn btn-outline-warning btn-sm  rounded" id={`Delete-mdmAllocation-${data.allocationID}`} onClick={() => hendleDelete(data.allocationID)}>
                                                                    <i className="fa-solid fa-trash"></i>
                                                                </button>
                                                                <Tooltip targetId={`Delete-mdmAllocation-${data.allocationID}`} position="top" text="Delete MDMAllocation" />
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
            {showaddEditAllocation && (
                <AddEditAllocation onClose={closeAllocationModal} allocation={selectedAllocation} />
            )}
        </>
    );
}

export default MDMAllocationContent;