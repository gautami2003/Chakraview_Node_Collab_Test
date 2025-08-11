"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Summary.css";
import { getToken } from '@/utils/api';

function SummaryContent() {
    const [summary, setSummary] = useState([]);
    const [singalSummary, setSingalSummary] = useState("51");
    const [busOperatorName, setBusOperatorName] = useState([]);

    useEffect(() => {
        const token = getToken();
        try {
            const getSummary = async () => {

                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bus-operator/summary/${singalSummary}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data
                setSummary(responseData)

            }
            const getBusOperatorName = async () => {

                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bus-operator/name-list`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data
                setBusOperatorName(responseData)
            }

            getSummary();
            getBusOperatorName();
        } catch (error) {
            console.log(error);
        }
    }, [singalSummary])

    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <div className="container-fluid px-4 mt-5">
                        <h2 className="text-center font-weight-light my-4"><b>Summary</b></h2>
                        <div className="d-flex justify-content-center align-items-center mb-4 me-3  ">
                            <div>
                                <label htmlFor="BusinessType" className="form-label me-2">
                                    <strong>Bus Operator Name:</strong>
                                </label>
                                <select
                                    id="BusinessType"
                                    className="form-select w-auto"
                                    value={singalSummary}
                                    onChange={(e) => setSingalSummary(e.target.value)}
                                >
                                    <option value="" disabled>-- Select Bus Operator --</option>
                                    {busOperatorName.map((data, index) => (
                                        <option key={index} value={data.busOperatorID}>
                                            {data.busOperatorName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="card-body">
                            <table id="datatablesSimple">
                                <thead className="card-header">
                                    <tr>
                                        <th>Bus Operator</th>
                                        <th>Summary Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {summary.map((data, index) => {
                                        return (
                                            <tr key={index}>
                                                <td><span style={{ fontSize: "16px" }}><b>{data.busOperatorName}</b></span></td>
                                                <td>
                                                    <div className="summary-container">
                                                        {[
                                                            { label: "Bus", value: data.totalBus },
                                                            { label: "School", value: data.totalSchool },
                                                            { label: "Pickup Route", value: data.totalPickupRoute },
                                                            { label: "Drop Route", value: data.totalDropRoute },
                                                            { label: "Stoppage", value: data.totalStoppage },
                                                            { label: "Route Stoppage Timing", value: data.totalRouteStoppageTiming },
                                                        ].map((item, index) => (
                                                            <div className="summary-card" key={index}>
                                                                <div className="summary-card-title">{item.label}</div>
                                                                <div>{item.value}</div>
                                                            </div>
                                                        ))}

                                                        <div className="summary-card">
                                                            <div className="summary-card-title">Attendant</div>
                                                            <div>{data.totalAttendant}</div>
                                                            <div className="summary-subsection">
                                                                <div className="summary-sub-card">
                                                                    <div className="summary-sub-card-title">Banned</div>
                                                                    {data.totalBannedAttendant}
                                                                </div>
                                                                <div className="summary-sub-card">
                                                                    <div className="summary-sub-card-title">Unbanned</div>
                                                                    {data.totalUnbannedAttendant}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="summary-card">
                                                            <div className="summary-card-title">Student</div>
                                                            <div>{data.totalStudent}</div>
                                                            <div className="summary-subsection">
                                                                <div className="summary-sub-card">
                                                                    <div className="summary-sub-card-title">Banned</div>
                                                                    {data.totalBannedStudent}
                                                                </div>
                                                                <div className="summary-sub-card">
                                                                    <div className="summary-sub-card-title">Unbanned</div>
                                                                    {data.totalUnbannedStudent}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </main >
            </div >
        </>
    );
}

export default SummaryContent;