"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getToken } from '@/utils/api';
import Link from 'next/link';
import Image from 'next/image';
import logo from 'public/images/chakraviewlogonew.png';


function AdminNavbar() {
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
                <Link className="navbar-brand ps-3" href="/admin">
                    {/* <Image src="/images/chakraviewlogonew.png"
                        className="img-fluid pr10" alt="" /> */}
                    <Image className="img-fluid pr10" src={logo} alt="Logo" />
                </Link>
                {/* <!-- Sidebar Toggle--> */}
                <button className="btn btn-link btn-sm ms-auto order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i
                    className="fas fa-bars"></i></button>
                {/* <!-- Navbar Search--> */}

                <ul className="navbar-nav ms-3 me-3 me-lg-4">
                    <li className="nav-item">
                        <Link className="nav-link " href="/admin" role="button">Home</Link>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto me-3 me-lg-4">
                    <li className="nav-item">
                        <Link className="nav-link " href="/admin/bus-operators" role="button">Bus Operators</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="/admin/mdm-allocation" role="button">Allocation List</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="/admin/mdm-device" role="button">Device List</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="/admin/mdm-simcard" role="button">MDM Simcards </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="/admin/summary" role="button">Summary</Link>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                    <li className="nav-item nav-profile dropdown">
                        <Link className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <Image alt="..." width={40} height={40} src={`https://ui-avatars.com/api/?background=FFEECF&color=000&name=${userName.userName}&length=1&bold=true`} />
                        </Link>
                        <ul className="dropdown-menu dropdown-menu-start" aria-labelledby="navbarDropdown">
                            {/* <li><Link className="dropdown-item" href="#!">Settings</Link></li>
                            <li><Link className="dropdown-item" href="#!">Activity Log</Link></li> */}
                            <li className="dropdown-item ">
                                <Link className="nav-link " href="/admin/profile" role="button">
                                    <i className="fa-solid fa-user me-2" /> My Profile
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li className="dropdown-item">
                                <Link className="nav-link" href="" role="button">
                                    <i className="fa-solid fa-key me-2" /> Change Password
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li className="dropdown-item" >
                                <Link className="nav-link" href="" onClick={handleLogout} role="button">
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

export default AdminNavbar;