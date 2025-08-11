"use client"
import { Dialog } from 'radix-ui';
import React, { useEffect, useState } from 'react';
import "../../styles/styles.model.css";
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { getToken } from '@/utils/api';
import NoData from '@/components/NoData';

function SchoolList({ onClose, operator }) {
    const [schoolList, setSchoolList] = useState([])

    useEffect(() => {
        const token = getToken();
        try {
            const getSchoolList = async () => {

                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schoolMaster/?busOperatorId=${operator.BusOperatorID}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data

                setSchoolList(responseData)
            }
            getSchoolList();
        } catch (error) {
            console.log(error);
        }
    }, [operator?.BusOperatorID])

    const hendleDelete = async (id) => {

        const token = getToken();
        let result = await Swal.fire({
            title: `Are you sure ?`,
            text: 'Do you want to delete School ?',
            showCancelButton: true,
            confirmButtonText: "Delete",
        })
        console.log(result, "resultresult");

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/schoolMaster/${id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                setSchoolList(prev => prev.filter(school => school.schoolID !== id));
                toast.success(response.data.message);
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div>
            <Dialog.Root open={true} onOpenChange={onClose}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent">
                        <Dialog.Title className="DialogTitle">
                            {operator.BusOperatorName} - School List
                        </Dialog.Title>

                        <div className="DialogDescription">
                            {schoolList.length === 0 ? (
                                <NoData />
                            ) : (
                                <table id="datatablesSimple">
                                    <thead className="card-header">
                                        <tr>
                                            <th >School Name</th>
                                            <th >Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schoolList.map((data, index) => {
                                            return (

                                                <tr key={index}>
                                                    <td>{data.schoolName}</td>
                                                    <td>
                                                        <button className="btn btn-outline-danger btn-sm rounded" onClick={() => hendleDelete(data.schoolID)}>
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            )}

                        </div>
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


export default SchoolList;