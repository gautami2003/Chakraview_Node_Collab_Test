"use client"
import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
import { checkRoles } from '@/utils/api';
import AdminNavbar from './AdminNavbar';
import SchoolNavbar from './SchoolNavbar';
import Link from 'next/link';

function Navbar() {
    const [roles, setRoles] = useState([]);
    // const [userName, setUserName] = useState("");
    // const router = useRouter();
    // const token = getToken();

    useEffect(() => {
        const roleList = checkRoles();
        setRoles(roleList);
    }, [])

    // const handleLogout = async () => {

    //     try {
    //         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Basic ${token}`
    //             }
    //         });
    //         localStorage.removeItem("token");
    //         document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    //         toast.success(response.data.message);
    //         router.push("/login");
    //     } catch (error) {
    //         console.error(error.response.data);
    //         toast.error(msg);
    //     }

    //     // this.setState({ errors, values });
    // };
    return (
        <>
            {
                roles.includes("admin") ?
                    // checkRoles().includes("admin") ?
                    <AdminNavbar /> : <SchoolNavbar />
            }
            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                        <div className="sb-sidenav-menu">
                            <div className="nav">
                                <Link className="nav-link" href="/">
                                    Home
                                </Link>
                                <Link className="nav-link " href="/bus-operators" >
                                    Bus Operators
                                </Link>
                                <Link className="nav-link" href="#" >
                                    MDM Simcards
                                </Link>
                                <Link className="nav-link" href="#" >
                                    MDM Devices
                                </Link>
                                <Link className="nav-link" href="#" >
                                    MDM Allocation
                                </Link>
                                <Link className="nav-link" href="#" >
                                    Summary
                                </Link>
                                <Link className="nav-link" href="#" >
                                    Profile
                                </Link>

                                {/* <Link className="nav-link" href="index.html">
                                Live Tracking
                            </Link>
                            <Link className="nav-link" href="index.html">
                                Parent Analysis
                            </Link>
                            <Link className="nav-link" href="index.html">
                                Attendance Analysis
                            </Link>
                            <Link className="nav-link" href="index.html">
                                Notification Analysis
                            </Link>
                            <Link className="nav-link collapsed" href="#" data-bs-toggle="collapse"
                                data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                                Manage
                                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                            </Link>
                            <div className="collapse" id="collapseLayouts" aria-labelledby="headingOne"
                                data-bs-parent="#sidenavAccordion">
                                <nav className="sb-sidenav-menu-nested nav">
                                    <Link className="nav-link" href="layout-static.html">Static Navigation</Link>
                                    <Link className="nav-link" href="layout-sidenav-light.html">Light Sidenav</Link>
                                </nav>
                            </div>
                            <Link className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapsePages"
                                aria-expanded="false" aria-controls="collapsePages">
                                Bus Fees
                                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                            </Link>
                            <div className="collapse" id="collapsePages" aria-labelledby="headingTwo"
                                data-bs-parent="#sidenavAccordion">
                                <nav className="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">
                                    <Link className="nav-link collapsed" href="#" data-bs-toggle="collapse"
                                        data-bs-target="#pagesCollapseAuth" aria-expanded="false"
                                        aria-controls="pagesCollapseAuth">
                                        Authentication
                                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                    </Link>
                                    <div className="collapse" id="pagesCollapseAuth" aria-labelledby="headingOne"
                                        data-bs-parent="#sidenavAccordionPages">
                                        <nav className="sb-sidenav-menu-nested nav">
                                            <Link className="nav-link" href="login.html">Login</Link>
                                            <Link className="nav-link" href="register.html">Register</Link>
                                            <Link className="nav-link" href="password.html">Forgot Password</Link>
                                        </nav>
                                    </div>
                                    <Link className="nav-link collapsed" href="#" data-bs-toggle="collapse"
                                        data-bs-target="#pagesCollapseError" aria-expanded="false"
                                        aria-controls="pagesCollapseError">
                                        Reports
                                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                    </Link>
                                    <div className="collapse" id="pagesCollapseError" aria-labelledby="headingOne"
                                        data-bs-parent="#sidenavAccordionPages">
                                        <nav className="sb-sidenav-menu-nested nav">
                                            <Link className="nav-link" href="401.html">401 Page</Link>
                                            <Link className="nav-link" href="404.html">404 Page</Link>
                                            <Link className="nav-link" href="500.html">500 Page</Link>
                                        </nav>
                                    </div>
                                </nav>
                            </div> */}
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}

export default Navbar;
