"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Tooltip from '@/components/Tooltip/Tooltip';
import AddEditDevice from './AddEditDevice';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/Pagination';
import { getToken } from "@/utils/api";
import NoData from '@/components/NoData';

function MDMDeviceContent() {
    const [mdmDevice, setmdmDevice] = useState([]);
    const [listmdmDevice, setListmdmDevice] = useState([]);
    const [singalSecondaryModel, setSingalSecondaryModel] = useState("");
    const [singalDeviceSerialNumber, setSingalDeviceSerialNumber] = useState("");
    const [showaddEditDevice, setShowaddEditDevice] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [limit, setLimit] = useState();

    const [totalPages, setTotalPages] = useState(1);

    const router = useRouter();
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get('page')) || 1;

    const openDeviceModal = (e, data) => {
        e.preventDefault();
        setSelectedDevice(data);
        setShowaddEditDevice(true);
    };

    const handleAddDevice = () => {
        setSelectedDevice(null);
        setShowaddEditDevice(true);
    };

    const closeDeviceModal = () => {
        setSelectedDevice(null);
        setShowaddEditDevice(false);
    };

    useEffect(() => {
        const token = getToken();
        try {
            const getmdmDevice = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mdmDevices?page=${page}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data
                setmdmDevice(responseData.result);
                setLimit(responseData.totalLimit)
                setTotalPages(Math.ceil(responseData.count / responseData.totalLimit));
                // setTotalPages(responseData.totalPages);
            }
            const getmdmDeviceList = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mdmDevices/name-list`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data
                setListmdmDevice(responseData);
            }
            getmdmDeviceList();
            getmdmDevice();
        } catch (error) {
            console.log(error);
        }
    }, [page])

    const hendleDelete = async (id, data) => {
        const token = getToken();
        let result = await Swal.fire({
            title: `Are you sure ?`,
            text: 'Do you want to delete mdmDevice?',
            showCancelButton: true,
            confirmButtonText: "Delete",
        })
        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/mdmDevices/${id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                setmdmDevice(prev => prev.filter(device => device.deviceID !== id));
                toast.success(response.data.message);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            router.push(`?page=${newPage}`);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'secondaryModel') setSingalSecondaryModel(value);
        if (name === 'deviceSerialNumber') setSingalDeviceSerialNumber(value);
    };


    const handleSearch = async () => {
        const token = getToken();
        try {
            const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mdmDevices?deviceSerialNumber=${singalDeviceSerialNumber}&secondaryModel=${singalSecondaryModel}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${token}`
                },
            });

            const responseData = result.data.data;
            setmdmDevice(responseData.result);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <div className="container-fluid px-4 mt-5">
                        <h2 className="text-center font-weight-light my-4"><b>Device Master</b></h2>
                        <div className="container mt-4 d-flex flex-column align-items-center">
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
                                    {listmdmDevice.deviceSerialNumber?.map((deviceSerialNumber, index) => (
                                        <option key={index} value={deviceSerialNumber}>
                                            {deviceSerialNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <label htmlFor="secondaryModel" className="form-label customlabel me-2">
                                    <strong>Secondary Model</strong>
                                </label>
                                <select
                                    id="secondaryModel"
                                    name="secondaryModel"
                                    className="form-select selectBox"
                                    value={singalSecondaryModel}
                                    onChange={handleChange}
                                >
                                    <option value="" >-- Select Secondary Model --</option>
                                    {listmdmDevice.secondaryModel?.map((secondaryModel, index) => (
                                        <option key={index} value={secondaryModel}>
                                            {secondaryModel}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button className="float-end mb-3 rounded btn btn-primary btn-sm " color="info" size="sm" type="button" onClick={handleSearch}>
                                Search
                            </button>
                        </div>
                        <div className="card-body">
                            {mdmDevice.length === 0 ? (
                                <NoData />
                            ) : (
                                <>
                                    <button className="float-end mb-3 rounded btn btn-primary btn-sm " color="info" size="sm" type="button" onClick={handleAddDevice}>
                                        Add MDM Device
                                    </button>
                                    <table id="datatablesSimple">
                                        <thead className="card-header">
                                            <tr>
                                                <th>Sr. No</th>
                                                <th >MDM Device Details</th>
                                                <th></th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                // </strong>
                                                mdmDevice.map((data, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{(page - 1) * limit + index + 1}</td>
                                                            {/* <td>{data.deviceID}</td> */}
                                                            <td>
                                                                <strong className="mdmDataLabe">Device Serial Number:</strong>
                                                                <span>{data.deviceSerialNumber}</span><br />
                                                                <strong className="mdmDataLabe">IMEI 1</strong>
                                                                <span>{data.iMEI1}</span><br />
                                                                <strong className="mdmDataLabe">Primary Model</strong>
                                                                <span>{data.primaryModel}</span><br />
                                                                <strong className="mdmDataLabe">Secondary Model</strong>
                                                                <span>{data.secondaryModel}</span><br />
                                                            </td>
                                                            <td>
                                                                {/* <Tooltip targetId={`-${data.DeviceID}`} position="top" text="Edit MDMDevice" /> */}
                                                                <button className="btn btn-outline-warning btn-sm  rounded" id={`-${data.DeviceID}`}>
                                                                    MISC
                                                                </button>&nbsp;
                                                                <Tooltip targetId={`errorLog-${data.DeviceID}`} position="top" text="Error Log" />
                                                                <button className="btn btn-outline-warning btn-sm rounded" id={`errorLog-${data.DeviceID}`}>
                                                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                                                </button>&nbsp;
                                                                <Tooltip targetId={`sendSMS-${data.DeviceID}`} position="top" text="Send SMS" />
                                                                <button className="btn btn-outline-warning btn-sm rounded" id={`sendSMS-${data.DeviceID}`}>
                                                                    <i className="fa-solid fa-comment-sms fa-xl"></i>
                                                                </button>&nbsp; <br />
                                                                {/* <Tooltip targetId={`-${data.DeviceID}`} position="top" text="Location" /> */}
                                                                <button className="btn btn-outline-warning btn-sm rounded mt-2" id={`-${data.DeviceID}`} >
                                                                    Buzz It
                                                                </button>&nbsp;
                                                                {/* <Tooltip targetId={`-${data.DeviceID}`} position="top" text="Location" /> */}
                                                                <button className="btn btn-outline-warning btn-sm  rounded mt-2" id={`-${data.DeviceID}`} >
                                                                    Clear Data
                                                                </button>&nbsp;
                                                            </td>
                                                            <td>
                                                                {/* <i className="fa-solid fa-ellipsis-vertical"></i>&nbsp; */}
                                                                {/* <button className=" rounded" data-tooltip-id={`edit-${data.DeviceID }`}> */}
                                                                <Tooltip targetId={`edit-${data.DeviceID}`} position="top" text="Edit MDMDevice" />
                                                                <button className="btn btn-outline-warning btn-sm  rounded" id={`edit-${data.DeviceID}`} onClick={(e) => openDeviceModal(e, data)}>
                                                                    <i className="fa-solid fa-user-pen"></i>
                                                                </button>&nbsp;

                                                                <Tooltip targetId={`location-${data.DeviceID}`} position="top" text="Location" />
                                                                <button className="btn btn-outline-warning btn-sm  rounded" id={`location-${data.DeviceID}`} >
                                                                    <i className="fa-solid fa-location-dot"></i>
                                                                </button>&nbsp;

                                                                <button className="btn btn-outline-warning btn-sm  rounded" id={`delete-mdmDevice-${data.DeviceID}`} onClick={() => hendleDelete(data.deviceID)}>
                                                                    <i className="fa-solid fa-trash"></i>
                                                                </button>

                                                                <Tooltip targetId={`delete-mdmDevice-${data.DeviceID}`} position="top" text="Delete mdmDevice" />

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
            {/* <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end">
                    <li className="page-item disabled">
                        <a className="page-link">Previous</a>
                    </li>
                    <li className="page-item"><a className="page-link" href="#">1</a></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item">
                        <a className="page-link" href="#">Next</a>
                    </li>
                </ul>
            </nav> */}
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            {showaddEditDevice && (
                <AddEditDevice onClose={closeDeviceModal} device={selectedDevice} />
            )}
        </>
    );
}

export default MDMDeviceContent;