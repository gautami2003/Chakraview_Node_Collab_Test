"use client"
import { Dialog } from 'radix-ui';
import React, { useEffect, useState } from 'react';
import "../../styles/styles.model.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '@/utils/api';


function AddEditSimcard({ onClose, simcard }) {
    const title = simcard ? "Edit MDM Simcard" : "Add MDM Simcard";
    const [formData, setFormData] = useState({
        simSerialNumber: "",
        networkProvider: "",
        simType: "",
        rechargeType: "",
        phoneNumber: "",
        sIMNumber: "",
        sIMPurchaseDate: "",
        postpaidPlanName: "",
        postpaidPlanRental: "",
        prepaidPlanName: "",
        prepaidRechargeDate: "",
        prepaidRechargeAmount: "",
        custID: "",
        simStatus: "",
    });

    useEffect(() => {
        if (simcard) {
            setFormData({
                simSerialNumber: simcard.SimSerialNumber || "",
                networkProvider: simcard.NetworkProvider || "",
                simType: simcard.SimType || "",
                rechargeType: simcard.RechargeType || "",
                phoneNumber: simcard.PhoneNumber || "",
                sIMNumber: simcard.SIMNumber || "",
                sIMPurchaseDate: simcard.SIMPurchaseDate || "",
                postpaidPlanName: simcard.PostpaidPlanName || "",
                postpaidPlanRental: simcard.PostpaidPlanRental || "",
                prepaidPlanName: simcard.PrepaidPlanName || "",
                prepaidRechargeDate: simcard.PrepaidRechargeDate || "",
                prepaidRechargeAmount: simcard.PrepaidRechargeAmount || "",
                custID: simcard.CustID || "",
                simStatus: simcard.SimStatus || "",
            });
        };
    }, [simcard]);

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
            if (simcard) {
                const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/mdmSimcards/${simcard.SIMID}`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${token}`
                    }
                });
                toast.success(response.data.message);
            } else {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/mdmSimcards`, formData, {
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
                                        <input className="form-control" placeholder="" id="simSerialNumber" name="simSerialNumber" type='text'
                                            value={formData.simSerialNumber} onChange={handleChange}
                                        />
                                        <label htmlFor="simSerialNumber">Sim Serial Number</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <select className="form-select" id="networkProvider" name="networkProvider"
                                            value={formData.networkProvider} onChange={handleChange}
                                        >
                                            <option value="" disabled>-- Select Network Provider --</option>
                                            <option value="VODAFONE">VODAFONE</option>
                                            <option value="JIO">JIO</option>
                                            <option value="AIRTEL">AIRTEL</option>
                                            <option value="CUSTOM">CUSTOM</option>
                                        </select>
                                        <label htmlFor="networkProvider" >Network Provider</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <select className="form-select" id="simType" name="simType"
                                            value={formData.simType} onChange={handleChange}
                                        >
                                            <option value="" disabled>-- Select Sim Type --</option>
                                            <option value="VOICE">VOICE</option>
                                            <option value="DATA">DATA</option>
                                            <option value="M2M">M2M</option>
                                        </select>
                                        <label htmlFor="simType">Sim Type</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating ">
                                        <input className="form-control" placeholder="" id="rechargeType" name='rechargeType'
                                            value={formData.rechargeType} onChange={handleChange}
                                        />
                                        <label htmlFor="rechargeType">Recharge Type</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control" placeholder="" id="phoneNumber" name="phoneNumber" type="number"
                                            required value={formData.phoneNumber} onChange={handleChange} />
                                        <label htmlFor="phoneNumber">Phone Number</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating ">
                                        <input className="form-control" placeholder="" id="sIMNumber" name='sIMNumber'
                                            value={formData.sIMNumber} onChange={handleChange}
                                        />
                                        <label htmlFor="sIMNumber">SIM Number</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control" placeholder="" id="sIMPurchaseDate" name='sIMPurchaseDate' type='date'
                                            value={formData.sIMPurchaseDate} onChange={handleChange}
                                        />
                                        <label htmlFor="sIMPurchaseDate">SIM Purchase Date</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating ">
                                        <input className="form-control" placeholder="" id="postpaidPlanName" name='postpaidPlanName'
                                            value={formData.postpaidPlanName} onChange={handleChange}
                                        />
                                        <label htmlFor="postpaidPlanName">Postpaid Plan Name</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control" placeholder="" id="postpaidPlanRental" name='postpaidPlanRental'
                                            value={formData.postpaidPlanRental} onChange={handleChange}
                                        />
                                        <label htmlFor="postpaidPlanRental">Postpaid Plan Rental</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control" placeholder="" id="prepaidPlanName" name='prepaidPlanName'
                                            value={formData.prepaidPlanName} onChange={handleChange}
                                        />
                                        <label htmlFor="prepaidPlanName">Prepaid Plan Name</label>
                                    </div>
                                </div>

                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control" placeholder="" id="prepaidRechargeDate" name='prepaidRechargeDate' type='date'
                                            value={formData.prepaidRechargeDate} onChange={handleChange}
                                        />
                                        <label htmlFor="prepaidRechargeDate">Prepaid Recharge Date</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control" placeholder="" id="prepaidRechargeAmount" name='prepaidRechargeAmount'
                                            value={formData.prepaidRechargeAmount} onChange={handleChange}
                                        />
                                        <label htmlFor="prepaidRechargeAmount">Prepaid Recharge Amount</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3 mt-3 ">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control" placeholder="" id="custID" name="custID"
                                            value={formData.custID} onChange={handleChange}
                                        />
                                        <label htmlFor="custID">CustID</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <select className="form-select" id="simStatus" name="simStatus"
                                            value={formData.simStatus} onChange={handleChange}
                                        >
                                            <option value="" disabled>-- Select Sim Status --</option>
                                            <option value="Blank">Blank</option>
                                            <option value="Active">Active</option>
                                            <option value="Closed">Closed</option>
                                            <option value="Suspended">Suspended</option>
                                        </select>
                                        <label htmlFor="simStatus" >Sim Status</label>
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


export default AddEditSimcard;