'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import "../../styles/payment.css";
import { toast } from 'react-toastify';
import { getData, patchData, postData } from '@/utils/feesCollectionApi';
import Image from 'next/image';
import Link from 'next/link';

function StudentPayFeeszonContent() {
    const [students, setStudents] = useState([]);
    const [addressZone, setAddressZone] = useState([]);
    const [paymentFrequency, setPaymentFrequency] = useState({});
    const [paymentFrequencyDropdowns, setPaymentFrequencyDropdowns] = useState({});
    const [selectedZone, setSelectedZone] = useState("");
    const [selectedFrequency, setSelectedFrequency] = useState("");
    const [selectedRouteTypes, setSelectedRouteTypes] = useState("");
    const [checkboxes, setCheckboxes] = useState({
        agree1: false,
        agree2: false,
        agree3: false,
    });
    const searchParams = useSearchParams();
    const studentID = searchParams.get("stdID");
    const schoolID = searchParams.get("schID");
    const [loading, setLoading] = useState(false);
    const router = useRouter();



    useEffect(() => {
        try {
            const getStudents = async () => {
                const result = await getData(`students/student-pay-feeszon?studentID=${studentID}&schoolID=${schoolID}`)
                let responseData = result.data;
                setStudents(responseData);
            };

            const getAddressZone = async () => {
                const result = await getData(`fees-master-zonewise/get-addresszone?schoolID=${schoolID}`)
                let responseData = result.data;
                setAddressZone(responseData);
            };

            getAddressZone();
            getStudents();
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        try {
            if (!selectedZone || !selectedFrequency) return;
            let standard = "";
            const getStandard = students.map(data => data.StudentStandard)
            if (schoolID == 57 && getStandard == 10) {
                standard = `&standard=${getStandard}`
            }
            const getPaymentFrequency = async () => {
                let url = `fees-master-zonewise/get-payment-frequency?schoolID=${schoolID}&addressZone=${selectedZone}&type=${selectedFrequency}${standard}`
                url += selectedRouteTypes && `&routeType=${selectedRouteTypes}`
                const result = await getData(url)
                let responseData = result.data;
                setPaymentFrequency(responseData);
            }
            getPaymentFrequency();
        } catch (error) {
            console.log(error);
        }
    }, [selectedZone, selectedFrequency]);

    useEffect(() => {
        try {
            if (!selectedZone) return;
            const paymentFrequencyDropdown = async () => {
                if (addressZone) {
                    const result = await getData(`fees-master-zonewise/payment-frequency-dropdown?schoolID=${schoolID}&addressZone=${selectedZone}`)
                    let responseData = result.data;
                    setPaymentFrequencyDropdowns(responseData);
                }
            }
            paymentFrequencyDropdown();
        } catch (error) {
            console.log(error);
        }
    }, [selectedZone]);

    const handleRouteType = (e) => {
        setPaymentFrequency("");
        setSelectedFrequency("");
        setSelectedRouteTypes(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            if (!selectedZone) {
                toast.error("Please select valid address zone.");
                return;
            }
            if (!paymentFrequency.amount) {
                toast.error("Please select a amount.");
                return;
            }

            if (!(checkboxes.agree1 && checkboxes.agree2 && checkboxes.agree3)) {
                toast.error("Please agree to all terms & conditions.");
                return;
            }
            setLoading(true);
            studentUpdate();
            initiatePayment();
        } catch (error) {
            setLoading(false)
            console.log(error);
            toast.error(error.responseData.message)
        }
    };


    const studentUpdate = async () => {
        try {
            const data = {
                addressZone: selectedZone
            };
            await patchData(`students/update/${studentID}`, data)
        } catch (error) {
            toast.error(error.responseData.message)
            console.log(error);
        }
    }
    const initiatePayment = async () => {
        try {
            const data = {
                studentID: studentID,
                amount: paymentFrequency.amount,
                grossAmount: paymentFrequency.grossAmount
            };
            const result = await postData(`payments-collection/cca/initiate-payment`, data)
            let responseData = result.data;
            // router.push(responseData.url)

            const form = document.createElement("form");
            form.method = "POST";
            form.action = responseData.url;

            const accessCode = document.createElement("input");
            accessCode.type = "hidden";
            accessCode.name = "access_code";
            accessCode.value = responseData.access_code;

            const encRequest = document.createElement("input");
            encRequest.type = "hidden";
            encRequest.name = "encRequest";
            encRequest.value = responseData.encRequest;

            form.appendChild(accessCode);
            form.appendChild(encRequest);
            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            setLoading(false)
            toast.error(error.responseData.message)
            console.log(error);
        };
    };

    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <div className="text-center">
                        {/* <h2 className="text-center font-weight-light my-4"><b>Students</b></h2> */}
                        <div className="card-body">
                            {students.map((data, index) => {
                                const schoolLogo = data["school_master.SchoolLogo"];
                                const schoolLogoUrl = schoolLogo?.startsWith("http")
                                    ? schoolLogo
                                    : `https://parentapp.chakraview.co.in/${schoolLogo}`;

                                const busOperatorLogo = data["bus_operator_master.LogoImage"];
                                const busOperatorLogoUrl = busOperatorLogo?.startsWith("http")
                                    ? busOperatorLogo
                                    : `https://parentapp.chakraview.co.in/${busOperatorLogo}`;
                                return (
                                    <div className="container " key={index}>
                                        <div className="row justify-content-center align-items-center text-center">
                                            {/* <h1 className="mb-5">{data["school_master.SchoolLogo"] ? `https://parentapp.chakraview.co.in${data["school_master.SchoolLogo"]}` : data["school_master.SchoolName"]}</h1>
                                            <h1 className="mb-5">{data["bus_operator_master.LogoImage"] ? `https://parentapp.chakraview.co.in${data["bus_operator_master.LogoImage"]}` : data["bus_operator_master.BusOperatorName"]}</h1> */}
                                            <div className="col-12 col-md-6 mb-4">
                                                {schoolLogo ? (
                                                    <Image
                                                        src={schoolLogoUrl}
                                                        // src={`https://parentapp.chakraview.co.in${data["school_master.SchoolLogo"]}`}
                                                        alt="School Logo"
                                                        height="200"
                                                        width="200"
                                                    />
                                                ) : (
                                                    <h1>{data["school_master.SchoolName"]}</h1>
                                                )}
                                            </div>

                                            <div className="col-12 col-md-6 mb-4">
                                                {busOperatorLogo ? (
                                                    <Image
                                                        // src={`https://parentapp.chakraview.co.in${data["bus_operator_master.LogoImage"]}`}
                                                        src={busOperatorLogoUrl}
                                                        alt="Bus Operator Logo"
                                                        height="200"
                                                        width="200"
                                                    />
                                                ) : (
                                                    <h1>{data["bus_operator_master.BusOperatorName"]}</h1>
                                                )}
                                            </div>
                                        </div>

                                        <div className="section-card container-fluid">
                                            {/* <div className="col-md-6">
                                                <strong>Student:</strong> {data.StudentName}<br />
                                                <strong>Standard:</strong> {data.StudentStandard}
                                            </div>
                                            <div className="col-md-6">
                                                <strong>School Section:</strong> {data.SchoolSection}<br />
                                                <strong>Student Division:</strong> {data.StudentClass}
                                            </div> */}
                                            <div className="row justify-content-center">
                                                <div className="col-md-4 mx-2 mb-3">
                                                    <h4 className="text-center mb-3"><b>Student Details</b></h4>
                                                    <ul className="list-group">
                                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                                            <strong>Student:</strong>
                                                            <span>{data.StudentName}</span>
                                                        </li>
                                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                                            <strong>Standard:</strong>
                                                            <span>{data.StudentStandard}</span>
                                                        </li>
                                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                                            <strong>School Section:</strong>
                                                            <span>{data.SchoolSection}</span>
                                                        </li>
                                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                                            <strong>Student Division:</strong>
                                                            <span>{data.StudentClass}</span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="col-12 col-md-5 col-lg-4 mb-4 mx-md-2">
                                                    <h4 className="text-center mb-3"><b>Parent Details</b></h4>
                                                    <ul className="list-group">
                                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                                            <strong>Mother Name:</strong>
                                                            <span className="text-end text-break">{data.MotherName}</span>
                                                        </li>
                                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                                            <strong>Father Name:</strong>
                                                            <span className="text-end text-break">{data.FatherName}</span>
                                                        </li>
                                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                                            <strong>Email:</strong>
                                                            <span className="text-end text-break">{data.EmailID}</span>
                                                        </li>
                                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                                            <strong>Father Mobile:</strong>
                                                            <span className="text-end text-break">{data.FatherMobileNumber}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="section-card container-fluid ">
                                            <h4><b>Bus Route Details & Fees</b></h4>
                                            <div className="row justify-content-center">
                                                <div className='col-md-auto'>
                                                    <div className='table-responsive'>
                                                        <table className="table ">
                                                            <tbody>
                                                                <tr className='bg-white '>
                                                                    <td className='border-white'>
                                                                        <select
                                                                            id="AddressZone"
                                                                            name="AddressZone"
                                                                            className="form-select selectBox "
                                                                            value={selectedZone}
                                                                            onChange={(e) => setSelectedZone(e.target.value)}
                                                                        >
                                                                            <option value="">Address Zone</option>
                                                                            {addressZone.map((data, index) => (
                                                                                <option key={index} value={data.AddressZone}>
                                                                                    {data.AddressZone}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </td>
                                                                </tr>

                                                                {data.discounts == 1 && (
                                                                    <tr className='bg-white'>
                                                                        <td className='border-white'>
                                                                            <select
                                                                                id="routeTypes"
                                                                                name="routeTypes"
                                                                                className="form-select selectBox"
                                                                                value={selectedRouteTypes}
                                                                                onChange={(e) => handleRouteType(e)}
                                                                                disabled={!selectedZone}
                                                                            >
                                                                                <option value="">Route Types</option>
                                                                                <option value="one_way">One Way</option>
                                                                                <option value="two_way">Two Way</option>
                                                                            </select>
                                                                        </td>
                                                                    </tr>
                                                                )}

                                                                <tr className='bg-white'>
                                                                    <td className='border-white'>
                                                                        <select
                                                                            id="paymentfrequency"
                                                                            name="paymentfrequency"
                                                                            className="form-select selectBox"
                                                                            value={selectedFrequency}
                                                                            onChange={(e) => setSelectedFrequency(e.target.value)}
                                                                            disabled={(data.discounts == 1 && !selectedRouteTypes) || !selectedZone}
                                                                        >
                                                                            <option value="">Payment Frequency</option>
                                                                            {schoolID == 57 && data.StudentStandard == 10 ? (
                                                                                <option value="annual">Annual</option>
                                                                            ) : (
                                                                                <>
                                                                                    {paymentFrequencyDropdowns?.monthlyPeriod && (
                                                                                        <option value="monthly">Monthly</option>
                                                                                    )}
                                                                                    {paymentFrequencyDropdowns?.quarterlyPeriod && (
                                                                                        <option value="quarterly">Quarterly</option>
                                                                                    )}
                                                                                    {paymentFrequencyDropdowns?.quadrimesterPeriod && (
                                                                                        <option value="quadrimester">Quadrimester (4 Months)</option>
                                                                                    )}
                                                                                    {paymentFrequencyDropdowns?.semiAnnualPeriod && (
                                                                                        <option value="semiAnnual">Semi Annual</option>
                                                                                    )}
                                                                                    {paymentFrequencyDropdowns?.annualPeriod && (
                                                                                        <option value="annual">Annual</option>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </select>
                                                                    </td>
                                                                </tr>

                                                                <tr className='bg-white'>
                                                                    <td className='border-white'>
                                                                        <input
                                                                            className="form-control selectBox"
                                                                            type="text"
                                                                            placeholder='Period'
                                                                            value={paymentFrequency.period || ""}
                                                                            disabled
                                                                        />
                                                                    </td>
                                                                </tr>

                                                                <tr className='bg-white'>
                                                                    <td className='border-white'>
                                                                        <input
                                                                            className="form-control selectBox"
                                                                            type="text"
                                                                            placeholder='Amount'
                                                                            value={paymentFrequency.amount || ""}
                                                                            // value={schoolID == 57 && data.StudentStandard != 10 ? paymentFrequency.amount + 16.666 / 100 : paymentFrequency.amount || 0}
                                                                            disabled
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="section-card container-fluid">
                                            <div className="row justify-content-center">
                                                <div className="col-md-5 mx-2">
                                                    <div className="card-body">
                                                        <h4 className="text-center mb-4 fw-bold">Need Help?</h4>
                                                        <div className="mb-3">
                                                            <h6 className="fw-bold">Technical Support (Payments Only)</h6>
                                                            <p className="mb-1">Email : <a href="mailto:support@chakraview.co.in">support@chakraview.co.in</a></p>
                                                            <p className="mb-0 text-muted"> Please include full payment details when contacting us.</p>
                                                        </div>
                                                        <hr />
                                                        <div className="mb-5">
                                                            <h6 className="fw-bold">General Queries</h6>
                                                            <p className="mb-1">
                                                                Phone Number:
                                                                <a href={`tel:+91${data["bus_operator_master.PhoneNumber"]}`}>
                                                                    &nbsp;{data["bus_operator_master.PhoneNumber"]}
                                                                </a>
                                                            </p>
                                                            <p className="mb-0">
                                                                Email :
                                                                <a href={`mailto:${data["bus_operator_master.EmailID"]}`}>
                                                                    &nbsp;{data["bus_operator_master.EmailID"]}
                                                                </a>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-4 mx-2">
                                                    <h4 className="text-center mb-3"><b>Payment Gateway Charges</b></h4>
                                                    <div className="container mt-4 d-flex flex-column align-items-center">
                                                        <div className='d-flex align-items-center mb-3'>
                                                            <table className="table">
                                                                <tbody>
                                                                    <tr className='text-start bg-white'>
                                                                        <th>UPI</th>
                                                                        <td>0%</td>
                                                                    </tr>
                                                                    <tr className='text-start bg-white'>
                                                                        <th>Debit Card (Rupay)</th>
                                                                        <td>0%</td>
                                                                    </tr>
                                                                    <tr className='text-start bg-white'>
                                                                        <th>Debit Card (Other)</th>
                                                                        <td>
                                                                            0.4% om 0-2000 INR<br />
                                                                            {"0.9% on >2000 INR"}
                                                                        </td>
                                                                    </tr>
                                                                    <tr className='text-start bg-white'>
                                                                        <th>Net Banking</th>
                                                                        <td>1.7%</td>
                                                                    </tr>
                                                                    <tr className='text-start bg-white'>
                                                                        <th>Wallets</th>
                                                                        <td>2%</td>
                                                                    </tr>
                                                                    <tr className='text-start bg-white'>
                                                                        <th>Credit Cards</th>
                                                                        <td>2.25%</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <h4><b>For Payment Related Technical Help - Write to support@chakraview.co.in with complete details</b></h4>
                                            <h4>For any queries, contact</h4>
                                            <strong>
                                                📞 PhoneNumber:  <a href={`tel:+91${data["bus_operator_master.PhoneNumber"]}`}> &nbsp;&nbsp;{data["bus_operator_master.PhoneNumber"]}</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                📧 EmailID:  <a href={`mailto:${data["bus_operator_master.EmailID"]}`}>&nbsp;&nbsp;{data["bus_operator_master.EmailID"]}</a>
                                            </strong> */}
                                        </div>
                                        {data["school_master.terms_conditions"] &&
                                            <div className="section-card container-fluid" >
                                                <h4><b>I Agree to Following Points, Terms & Conditions</b></h4>
                                                <div
                                                    className="text-start small"
                                                    dangerouslySetInnerHTML={{ __html: data["school_master.terms_conditions"] }}
                                                />
                                            </div>
                                        }
                                        <div className="section-card container-fluid">
                                            <div className="alert alert-warning" role="alert">
                                                <h5>
                                                    NOTE:- This is just an enrollment requisition form, filling of this form does not imply or mean that the bus service is allotted to the applicant.<br />
                                                    {data.penaltyMessage ? data.penaltyMessage : ""}
                                                </h5><br />
                                                <div className="text-start">
                                                    <label className='small'>
                                                        <input
                                                            className="form-check-input border border-dark border-3"
                                                            type="checkbox"
                                                            name="agree1"
                                                            checked={checkboxes.agree1}
                                                            onChange={(e) => setCheckboxes({ ...checkboxes, agree1: e.target.checked })}
                                                        />&nbsp;&nbsp;
                                                        I understand and agree that the school and its bus contractor will take all necessary and reasonable precautions to ensure the safe and timely transportation of my child. While I acknowledge that incidents may occasionally occur despite all safety measures taken by the school & bus contractor, School and bus contractor will act responsibly to prevent and address any mishaps or accidents. In the event of any unforeseen incidents, the school and bus contractor will take appropriate steps to ensure the well-being of my child. I further understand that the provision of bus service is a privilege provided.
                                                    </label>
                                                    <label className='small'>
                                                        <input
                                                            className="form-check-input border border-dark border-3"
                                                            type="checkbox"
                                                            name="agree2"
                                                            checked={checkboxes.agree2}
                                                            onChange={(e) => setCheckboxes({ ...checkboxes, agree2: e.target.checked })}
                                                        />&nbsp;&nbsp;
                                                        I agree to abide by the above terms and conditions to enroll my son / daughter / ward for school bus service and request you to kindly accept my requisition form and let me know the status of the allocation of the bus service to my child.
                                                    </label>
                                                    <label className='small'>
                                                        <input
                                                            className="form-check-input border border-dark border-3"
                                                            type="checkbox"
                                                            name="agree3"
                                                            checked={checkboxes.agree3}
                                                            onChange={(e) => setCheckboxes({ ...checkboxes, agree3: e.target.checked })}
                                                        />&nbsp;&nbsp;
                                                        I /We wish to enroll our child for School Bus Service, while filling this details I am fully aware of the terms and conditions, rules and regulations as mentioned below.
                                                    </label>
                                                </div>
                                                <div className="d-flex justify-content-center mt-4">
                                                    <Link type="button" className="btn btn-secondary mt-3" href="/fees-collection/student-list" role="button">
                                                        Back
                                                    </Link>&nbsp;&nbsp;
                                                    <button type="submit" className="btn pay-now-btn mt-3"
                                                        onClick={(e) => handleSubmit(e)}>
                                                        {loading ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2 " role="status" aria-hidden="true"></span>
                                                                Processing...
                                                            </>
                                                        ) : (
                                                            'Proceed to Pay'
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </div >
                </main >
            </div >
        </>
    );
};

export default StudentPayFeeszonContent;


