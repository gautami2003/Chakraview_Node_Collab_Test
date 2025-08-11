"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import { getToken } from '@/utils/api';

function ConfigureContent() {

    const [formData, setFormData] = useState({});

    const searchParams = useSearchParams();
    const busOperatorID = searchParams.get("busOpID");
    const busOperatorName = searchParams.get("busOpName");
    const businessType = searchParams.get("type");
    const router = useRouter();

    useEffect(() => {
        const token = getToken();
        try {

            const getBusOperators = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bus-operator/configurations/${busOperatorID}?type=${businessType}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data
                setFormData(responseData)
            }
            getBusOperators();
        } catch (error) {
            console.log(error);
        }
    }, [busOperatorID, businessType])

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            [name]: checked ? "Y" : "N",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        try {
            let response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/bus-operator/configurations/${busOperatorID}`,
                {
                    isPhone: formData.isPhone,
                    isWhatsApp: formData.isWhatsApp,
                    allowParentsToCall: formData.allowParentsToCall,
                    allowParentsToWhatsAppCall: formData.allowParentsToWhatsAppCall,
                }
                , {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${token}`
                    }
                });
            toast.success(response.data.message);
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }

    };

    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <div className="container-fluid px-4 mt-5">
                        <h2 className="text-center font-weight-light mb-5"><strong>{busOperatorName}&apos;s Configurations</strong></h2>
                        <div className="card-body">
                            <table id="datatablesSimple" className='container w-50 mx-auto"'>
                                <thead className="card-header">
                                    <tr>
                                        {/* <th>Id</th> */}
                                        <th></th>
                                        <th>Configurations Details</th>
                                        <th>Owner Details</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr >
                                        <td>
                                            <input type="checkbox" name='isPhone' checked={formData.isPhone === "Y"} onChange={handleChange} />
                                        </td>
                                        <td>Voice Calling (Attendant App)</td>
                                        <td>-</td>
                                    </tr>
                                    <tr >
                                        <td>
                                            <input type="checkbox" name='isWhatsApp' checked={formData.isWhatsApp === "Y"} onChange={handleChange} />
                                        </td>
                                        <td>WhatsApp Calling (Attendant App)</td>
                                        <td>-</td>
                                    </tr>
                                    <tr >
                                        <td>
                                            <input type="checkbox" name='allowParentsToCall' checked={formData.allowParentsToCall === "Y"} onChange={handleChange} />
                                        </td>
                                        <td>Allow Parent to Voice Call(Parent App)</td>
                                        <td>-</td>
                                    </tr>
                                    <tr >
                                        <td>
                                            <input type="checkbox" name='allowParentsToWhatsAppCall' checked={formData.allowParentsToWhatsAppCall === "Y"} onChange={handleChange} />
                                        </td>
                                        <td>Allow Parent to WhatsApp Call(Parent App)</td>
                                        <td>-</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-center mt-4">
                                <button type="button" className="btn btn-primary me-2" onClick={() => router.back()}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </main >
            </div >
        </>
    );
}

export default ConfigureContent;