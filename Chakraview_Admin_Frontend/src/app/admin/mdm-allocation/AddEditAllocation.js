"use client"
import { Dialog } from 'radix-ui';
import React, { useEffect, useState } from 'react';
import "../../styles/styles.model.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '@/utils/api';

function AddEditAllocation({ onClose, allocation }) {
    const title = allocation ? "Edit MDM allocation" : "Add MDM allocation";
    const [deviceIdList, setDeviceIdList] = useState([]);
    const [simSerialNumber, setSimSerialNumber] = useState([]);
    const [formData, setFormData] = useState({
        deviceSerialNumber: "",
        simSerialNumber: "",
        school: "",
        routeNumber: "",
        attendant: "",
        deviceSubmitDate: "",
        device_Submit_Person: ""
    });

    useEffect(() => {
        if (allocation) {
            setFormData({
                deviceSerialNumber: allocation.deviceSerialNumber,
                simSerialNumber: allocation.simSerialNumber,
                school: allocation.school,
                routeNumber: allocation.routeNumber,
                attendant: allocation.attendant,
                deviceSubmitDate: allocation.deviceSubmitDate,
                device_Submit_Person: allocation.device_Submit_Person
            });
        };
        getDeviceSerialNo();
        getsimSerialNumber();

    }, [allocation]);

    const getDeviceSerialNo = async () => {
        const token = getToken();
        try {
            const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mdmDevices`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${token}`
                    }
                }
            );
            setDeviceIdList(result.data.data.result)
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    }

    const getsimSerialNumber = async () => {
        const token = getToken();
        try {
            const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/mdmSimcards`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${token}`
                    }
                }
            );
            let responseData = result.data.data
            setSimSerialNumber(responseData.result)
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        try {
            if (allocation) {
                const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/mdmAllocation/${allocation.allocationID}`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${token}`
                    }
                });
                toast.success(response.data.message);
            } else {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/mdmAllocation`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${token}`
                    }
                });
                toast.success(response.data.message);
            }

            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    };


    return (
        <div>
            <Dialog.Root open={true} onOpenChange={onClose}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent">
                        <Dialog.Title className="DialogTitle">
                            {title}
                        </Dialog.Title>
                        <form
                            onSubmit={handleSubmit}
                        >
                            <div className="row mb-3 mt-3 ">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <select className="form-select" id="deviceSerialNumber" name="deviceSerialNumber"
                                            value={formData.deviceSerialNumber} onChange={handleChange} required
                                        >
                                            <option value="" disabled>-- Select Device Serial Number --</option>
                                            {deviceIdList.map((data, index) => {
                                                return (
                                                    <option key={index} value={data.deviceSerialNumber}>{data.deviceSerialNumber}</option>
                                                )
                                            })
                                            }
                                        </select>
                                        <label htmlFor="deviceSerialNumber" >Device Serial Number</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <select className="form-select" id="simSerialNumber" name="simSerialNumber"
                                            value={formData.simSerialNumber} onChange={handleChange} required
                                        >
                                            <option value="" disabled>-- Select Sim Serial Number --</option>
                                            {simSerialNumber.map((data, index) => {
                                                return (
                                                    <option key={index} value={data.SimSerialNumber}>{data.SimSerialNumber}</option>
                                                )
                                            })
                                            }
                                        </select>
                                        <label htmlFor="simSerialNumber" >Sim Serial Number</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control" placeholder="" id="school" name='school'
                                            value={formData.school} onChange={handleChange}
                                        />
                                        <label htmlFor="school">School</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating ">
                                        <input className="form-control" placeholder="" id="routeNumber" name='routeNumber'
                                            value={formData.routeNumber} onChange={handleChange}
                                        />
                                        <label htmlFor="routeNumber">Bus/Route Number	</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control" placeholder="" id="attendant" name='attendant'
                                            value={formData.attendant} onChange={handleChange}
                                        />
                                        <label htmlFor="attendant">Attendant</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control " placeholder="" id="deviceSubmitDate" name='deviceSubmitDate' type='date'
                                            value={formData.deviceSubmitDate} onChange={handleChange}
                                        />
                                        <label htmlFor="deviceSubmitDate">Device Submit Date	</label>
                                    </div>
                                </div>

                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control" placeholder="" id="device_Submit_Person" name='device_Submit_Person'
                                            value={formData.device_Submit_Person} onChange={handleChange}
                                        />
                                        <label htmlFor="device_Submit_Person">Device Submit Person	</label>
                                    </div>
                                </div>

                            </div>
                            <div className="mt-4 mb-0 d-flex justify-content-center gap-2">
                                <Dialog.Close asChild>
                                    <button className="btn btn-secondary btn-sm p-2" type="button">Cancel</button>
                                </Dialog.Close>
                                <button type="submit" className="btn btn-primary btn-sm p-2">Save</button>
                            </div>

                        </form>
                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close">
                                X
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div >

    );
}


export default AddEditAllocation;