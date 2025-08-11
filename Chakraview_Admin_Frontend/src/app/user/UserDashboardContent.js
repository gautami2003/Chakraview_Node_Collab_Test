"use client"
import { checkRoles, getToken } from "@/utils/api";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from 'react';

export default function UserDashboardContent() {
    const [dashboard, setDashboard] = useState({});

    useEffect(() => {
        const token = getToken();
        try {
            const getDashboardData = async () => {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${token}`
                        }
                    }
                );
                let responseData = result.data.data;
                setDashboard(responseData);
            }
            getDashboardData();
        } catch (error) {
            console.log(error);
        }
    }, [])
    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <div className="container-fluid px-4">
                        <h3 className="mt-4">Dashboard</h3>
                        <div className="row">
                            <div className="col-xl-6 grid-margin card-people">
                                <Image src="/images/people.svg" width="300" height="300" className="img-fluid pr10" alt="" />
                            </div>
                            <div className="col-xl-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="card text-center border-0 bg-pr-one text-white mb-4">
                                            <div className="card-body d-flex align-items-center justify-content-between">
                                                <a className="xx-large text-white stretched-link" href="#">Students</a>
                                                <div className="xx-large text-white"><i className="fas fa-users"></i></div>
                                            </div>
                                            <div className="card-footer text-center">
                                                <h1>{dashboard?.students || 0}</h1>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card bg-pr-two border-0 text-white mb-4">
                                            <div className="card-body d-flex align-items-center justify-content-between">
                                                <a className="xx-large text-white stretched-link" href="#">Students Attendance</a>
                                                <div className="xx-large text-white"><i className="fas fa-calendar"></i></div>
                                            </div>
                                            <div className="card-footer text-center">
                                                <h1>{dashboard?.studentsAttendance || 0}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="card bg-pr-three border-0 text-white mb-4">
                                            <div className="card-body d-flex align-items-center justify-content-between">
                                                <a className="xx-large text-white stretched-link" href="#">Parent Logged In</a>
                                                <div className="xx-large text-white"><i className="fas fa-user-plus"></i></div>
                                            </div>
                                            <div className="card-footer text-center">
                                                <h1>{dashboard?.parentLogged || 0}</h1>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card bg-pr-four border-0 text-white mb-4">
                                            <div className="card-body d-flex align-items-center justify-content-between">
                                                <a className="xx-large text-white stretched-link" href="#">Notification Sent
                                                </a>
                                                <div className="xx-large text-white"><i className="fas fa-bell"></i></div>
                                            </div>
                                            <div className="card-footer text-center">
                                                <h1>0</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {/* <div className="col-xl-6">
                                <div className="card border-0 mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-chart-area me-1"></i>
                                        Area Chart Example
                                    </div>
                                    <div className="card-body card-people">
                                        <Image src="/images/17902.svg" width="300" className="img-fluid pr10" alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="card border-0 mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-chart-bar me-1"></i>
                                        Bar Chart Example
                                    </div>
                                    <div className="card-body card-people">
                                        <Image src="/images/02-02-01.svg" width="300" height="300" className="img-fluid pr10"
                                            alt="" />
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
