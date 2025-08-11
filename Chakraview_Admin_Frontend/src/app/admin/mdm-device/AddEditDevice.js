"use client"
import { Dialog } from 'radix-ui';
import React, { useEffect, useState } from 'react';
import "../../styles/styles.model.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '@/utils/api';


function AddEditDevice({ onClose, device }) {
    const title = device ? "Edit MDM device" : "Add MDM device";
    const [formData, setFormData] = useState({
        deviceSerialNumber: "",
        iMEI1: "",
        primaryModel: "",
        secondaryModel: "",
    });


    useEffect(() => {
        if (device) {
            setFormData({
                deviceSerialNumber: device.deviceSerialNumber,
                iMEI1: device.iMEI1,
                primaryModel: device.primaryModel,
                secondaryModel: device.secondaryModel
            });
        };

    }, [device]);

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
            if (device) {
                const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/mdmDevices/${device.deviceID}`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${token}`
                    }
                });
                toast.success(response.data.message);
            } else {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/mdmDevices`, formData, {
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
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3 mt-3 ">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control" placeholder="" id="deviceSerialNumber" name="deviceSerialNumber" required
                                            value={formData.deviceSerialNumber} onChange={(e) => handleChange(e)}
                                        />
                                        <label htmlFor="deviceSerialNumber">Device Serial Number</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control" placeholder="" id="iMEI1" name="iMEI1" required
                                            value={formData.iMEI1} onChange={(e) => handleChange(e)}
                                        />
                                        <label htmlFor="iMEI1">IMEI 1</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control" placeholder="" id="primaryModel" name='primaryModel'
                                            value={formData.primaryModel} onChange={(e) => handleChange(e)}
                                        />
                                        <label htmlFor="primaryModel">Primary Model </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating ">
                                        <input className="form-control" placeholder="" id="secondaryModel" name='secondaryModel'
                                            value={formData.secondaryModel} onChange={(e) => handleChange(e)}
                                        />
                                        <label htmlFor="secondaryModel">Secondary Model</label>
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
        </div>

    );
}


export default AddEditDevice;