"use client"
import Link from 'next/link';
import Image from 'next/image';
import logo from 'public/images/chakraviewlogonew.png';
import { postData } from '@/utils/feesCollectionApi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function Navbar() {

    const router = useRouter();
    // const [navActive, setNavActive] = useState(false);

    // const toggleNav = () => {
    //     setNavActive(!navActive);
    // };

    const handleLogout = async () => {
        try {
            // const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/student-logout`, {}, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Basic ${token}`
            //     }
            // });

            const response = await postData(`auth/student-logout`);
            localStorage.removeItem("parent-login-token");
            document.cookie = "parent-login-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            toast.success(response.message);
            router.push("/fees-collection/student-login");
        } catch (error) {
            console.error(error.response.data);
            toast.error(msg);
        }

        // this.setState({ errors, values });
    };
    return (
        <>
            <div>
                <nav className="sb-topnav box-shadow navbar navbar-expand navbar-dark bg-lighter bg-darker">
                    <Link className="navbar-brand ps-3" href="/fees-collection/student-list">
                        <Image className="img-fluid pr10" src={logo} alt="Logo" />
                    </Link>
                    {/* <button className="btn btn-link btn-sm ms-auto order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!" onClick={toggleNav}><i
                        className="fas fa-bars"></i></button> */}
                    {/* <span className={navActive ? 'nav-backdrop d-lg-none active' : 'nav-backdrop d-lg-none'} onClick={toggleNav}></span>
                    <div className={navActive ? 'nav active transition' : 'nav transition'}></div> */}
                    <ul className="navbar-nav ms-auto me-3 me-lg-4">
                        <li className="nav-item">
                            <Link className="nav-link " href="/fees-collection/student-list" role="button">Home</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                        <li className="nav-item nav-profile dropdown">
                            <Link className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <Image alt="..." width={40} height={40} src={`https://ui-avatars.com/api/?background=FFEECF&color=000&length=6&name=Parent&font-size=0.22&bold=true`} />
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-start" aria-labelledby="navbarDropdown">
                                <li className="dropdown-item" >
                                    <Link className="nav-link" href="" onClick={handleLogout} role="button">
                                        <i className="fa-solid fa-person-running me-2" />Logout
                                    </Link>
                                </li>
                            </ul>
                        </li >
                    </ul >
                </nav >
            </div>
        </>
    );
}

export default Navbar;
