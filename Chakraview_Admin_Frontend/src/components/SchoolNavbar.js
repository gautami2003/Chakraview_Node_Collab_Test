"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { checkRoles, getToken } from '@/utils/api';
import Link from 'next/link';
import Image from 'next/image';
import logo from 'public/images/chakraviewlogonew.png';

function SchoolNavbar() {
    const [userName, setUserName] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = getToken();
        setUserName(jwtDecode(token));
    }, [])

    const handleLogout = async () => {
        const token = getToken();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${token}`
                }
            });
            localStorage.removeItem("token");
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            toast.success(response.data.message);
            router.push("/login");
        } catch (error) {
            console.error(error.response.data);
            toast.error(msg);
        }

        // this.setState({ errors, values });
    };
    return (
        <>
            <nav className="sb-topnav box-shadow navbar navbar-expand navbar-dark bg-lighter bg-darker">
                {/* Navbar Brand */}
                <Link className="navbar-brand ps-3" href="/user">
                    {/* <Image src="/images/chakraviewlogonew.png" height="300" width="300"
                        className="img-fluid pr10" alt="" /> */}
                    <Image className="img-fluid pr10" src={logo} alt="Logo" />
                </Link>
                {/* <!-- Sidebar Toggle--> */}
                <button className="btn btn-link btn-sm ms-auto order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="/#"><i
                    className="fas fa-bars"></i></button>
                {/* <!-- Navbar Search--> */}

                <ul className="navbar-nav ms-3 me-3 me-lg-4">
                    <li className="nav-item">
                        <Link className="nav-link " href="/user" role="button">Home</Link>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto me-3 me-lg-4">
                    <li className="nav-item nav-profile dropdown">
                        <Link className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Manage</Link>
                        <ul className="dropdown-menu dropdown-menu-start" aria-labelledby="navbarDropdown">
                            <li className="dropdown-item"><Link className="nav-link" role="button" href="/user/bus">Bus</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className="dropdown-item"><Link className="nav-link" role="button" href="/user/bus-attendant">Bus Attendant</Link></li>
                            <li> <hr className="dropdown-divider" /></li>
                            <li className="dropdown-item"><Link className="nav-link" role="button" href="/user/school">Schools</Link></li>
                            <li> <hr className="dropdown-divider" /></li>
                            <li className="dropdown-item"><Link className="nav-link" role="button" href="/user/pickup-route">Pickup Route</Link></li>
                            <li> <hr className="dropdown-divider" /></li>
                            <li className="dropdown-item"><Link className="nav-link" role="button" href="/user/drop-route">Drop Route</Link></li>
                            <li> <hr className="dropdown-divider" /></li>
                            <li className="dropdown-item"><Link className="nav-link" role="button" href="/user/bus-stops">Bus Stops</Link></li>
                            <li> <hr className="dropdown-divider" /></li>
                            <li className="dropdown-item"><Link className="nav-link" role="button" href="/user/student">Students</Link></li>
                            <li> <hr className="dropdown-divider" /></li>
                            <li className="dropdown-item"><Link className="nav-link" role="button" href="/user/route-stoppage-timing">Route Stoppage Timing</Link></li>
                            <li> <hr className="dropdown-divider" /></li>
                            <li className="dropdown-item"><Link className="nav-link" role="button" href="/user/school-holidays">School Holidays</Link></li>
                        </ul>
                    </li >
                </ul>
                <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                    <li className="nav-item nav-profile dropdown">
                        <Link className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Bus Fees</Link>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li className="dropdown-item"><Link className="nav-link" role='button' href="/user/fees-master-zonewise">Fees Master Zonewise</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className="dropdown-item"><Link className="nav-link" role='button' href="/user/feescollection-zoneWise">Fees Collection Zonewise</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className="dropdown-item"><Link className="nav-link" role='button' href="/user/fees-master-studentwise">Fees Master Studentwise</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className="dropdown-item"><Link className="nav-link" role='button' href="/user/feescollection-studentwise">Fees Collection Studentwise</Link></li>
                        </ul>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                    <li className="nav-item nav-profile dropdown">
                        <Link className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Reports</Link>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li className="dropdown-submenu ms-3" ><Link className="nav-link dropdown-toggle" href="#">Trip Log</Link>
                                <ul className="dropdown-menu dropdown-menu-start">
                                    <li className="dropdown-item"><Link className="nav-link" href="#">Detailed Report</Link></li>
                                    <li> <hr className="dropdown-divider" /></li>
                                    <li className="dropdown-item"><Link className="nav-link" href="#">Summary Report</Link></li>
                                </ul>
                            </li>
                            <li> <hr className="dropdown-divider" /></li>
                            <li className="dropdown-submenu ms-3" ><Link className="nav-link dropdown-toggle" href="#">Parent Log</Link>
                                <ul className="dropdown-menu dropdown-menu-start">
                                    <li className="dropdown-item"><Link className="nav-link" href="/reports/parent-log">Detailed Report</Link></li>
                                    <li> <hr className="dropdown-divider" /></li>
                                    <li className="dropdown-item"><Link className="nav-link" href="/reports/parent-log-summary">Summary Report</Link></li>
                                </ul>
                            </li>
                            <li> <hr className="dropdown-divider" /></li>
                            <li className="dropdown-submenu ms-3" ><Link className="nav-link dropdown-toggle" href="#">Attendance Log</Link>
                                <ul className="dropdown-menu dropdown-menu-start">
                                    <li className="dropdown-item"><Link className="nav-link" href="/reports/attendant-log">Attendance Detailed</Link></li>
                                    <li> <hr className="dropdown-divider" /></li>
                                    <li className="dropdown-item"><Link className="nav-link" href="/reports/attendant-log-summary">Attendance Summary</Link></li>
                                </ul>
                            </li>
                            <li> <hr className="dropdown-divider" /></li>
                            <li className="dropdown-submenu ms-3" ><Link className="nav-link dropdown-toggle" href="#">Messsage Log</Link>
                                <ul className="dropdown-menu dropdown-menu-start">
                                    <li className="dropdown-item"><Link className="nav-link" href="#">Bus Message</Link></li>
                                    <li> <hr className="dropdown-divider" /></li>
                                    <li className="dropdown-item"><Link className="nav-link" href="#">Student Attendance Message</Link></li>
                                    <li> <hr className="dropdown-divider" /></li>
                                    <li className="dropdown-item"><Link className="nav-link" href="#">Manual Messages</Link></li>
                                    <li> <hr className="dropdown-divider" /></li>
                                    <li className="dropdown-item"><Link className="nav-link" href="#">B2C Fees Report</Link></li>
                                </ul>
                            </li>
                            <li> <hr className="dropdown-divider" /></li>
                            <li className="dropdown-item"><Link className="nav-link" role='button' href="/#">Portal Log</Link></li>
                            <li> <hr className="dropdown-divider" /></li>
                            <li className="dropdown-submenu ms-3" ><Link className="nav-link dropdown-toggle" href="#">Other Reports</Link>
                                <ul className="dropdown-menu dropdown-menu-start">
                                    <li className="dropdown-item"><Link className="nav-link" href="#">Bus Log</Link></li>
                                    <li> <hr className="dropdown-divider" /></li>
                                    <li className="dropdown-item"><Link className="nav-link" href="#">LongCode Log</Link></li>
                                    <li> <hr className="dropdown-divider" /></li>
                                    <li className="dropdown-item"><Link className="nav-link" href="#">Variation Report</Link></li>
                                    <li> <hr className="dropdown-divider" /></li>
                                    <li className="dropdown-item"><Link className="nav-link" href="#">B2C Premium Fees Report</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                    <li className="nav-item nav-profile dropdown">
                        <Link className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <Image alt="..." width={40} height={40} src={`https://ui-avatars.com/api/?background=FFEECF&color=000&name=${userName.userName}&length=1&bold=true`} />
                        </Link>
                        <ul className="dropdown-menu dropdown-menu-start" aria-labelledby="navbarDropdown">
                            {/* <li><Link className="dropdown-item" href="/#">Settings</Link></li>
                            <li><Link className="dropdown-item" href="/#">Activity Log</Link></li> */}
                            <li className="dropdown-item ">
                                <Link className="nav-link " href="/user/profile" role="button">
                                    <i className="fa-solid fa-user me-2" /> My Profile
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li className="dropdown-item">
                                <Link className="nav-link" href="#" role="button">
                                    <i className="fa-solid fa-key me-2" /> Change Password
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li className="dropdown-item" >
                                <Link className="nav-link" href="#" onClick={handleLogout} role="button">
                                    <i className="fa-solid fa-person-running me-2" />Logout
                                </Link>
                            </li>
                        </ul>

                    </li >
                </ul >
            </nav >
        </>
    );
}

export default SchoolNavbar;