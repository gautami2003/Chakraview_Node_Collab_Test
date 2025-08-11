"use client"
import { Dialog } from 'radix-ui';
import React, { useEffect, useState } from 'react';
import "../../styles/styles.model.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '@/utils/api';
import { jwtDecode } from 'jwt-decode';

function AddEditFeesMasterZonewise({ onClose, feesMasterZonewise, datas }) {
    const title = feesMasterZonewise ? "Edit Fees Master Zonewise" : "Add Fees Master Zonewise";
    const [schoolList, setSchoolList] = useState([]);
    const [formData, setFormData] = useState({
        schoolID: "",
        addressZone: "",
        monthly_Period: { fromMonth: "", fromYear: "", toMonth: "", toYear: "" },
        quarterly_Period: { fromMonth: "", fromYear: "", toMonth: "", toYear: "" },
        annual_Period: { fromMonth: "", fromYear: "", toMonth: "", toYear: "" },
        semiAnnual_Period: { fromMonth: "", fromYear: "", toMonth: "", toYear: "", },
        quadrimester_Period: { fromMonth: "", fromYear: "", toMonth: "", toYear: "", },
        monthly_Amount: "",
        quarterly_Amount: "",
        annual_Amount: "",
        semiAnnual_Amount: "",
        quadrimester_Amount: "",
        duedateForPayment: ""
    });

    useEffect(() => {
        if (feesMasterZonewise) {
            const splitPeriod = (period) => {
                const [from, to] = period.split(" To ");
                const [fromMonth, fromYear] = from.split("-");
                const [toMonth, toYear] = to.split("-");
                console.log(fromMonth, fromYear, toMonth, toYear, "fromMonth, fromYear, toMonth, toYear");

                return { fromMonth, fromYear, toMonth, toYear };
            };
            setFormData({
                schoolID: feesMasterZonewise.schoolID,
                addressZone: feesMasterZonewise.addressZone,
                monthly_Period: splitPeriod(feesMasterZonewise.monthly_Period),
                quarterly_Period: splitPeriod(feesMasterZonewise.quarterly_Period),
                annual_Period: splitPeriod(feesMasterZonewise.annual_Period),
                semiAnnual_Period: splitPeriod(feesMasterZonewise.semiAnnual_Period),
                quadrimester_Period: splitPeriod(feesMasterZonewise.quadrimester_Period),
                monthly_Amount: feesMasterZonewise.monthly_Amount,
                quarterly_Amount: feesMasterZonewise.quarterly_Amount,
                annual_Amount: feesMasterZonewise.annual_Amount,
                semiAnnual_Amount: feesMasterZonewise.semiAnnual_Amount,
                quadrimester_Amount: feesMasterZonewise.quadrimester_Amount,
                duedateForPayment: feesMasterZonewise.duedateForPayment,
            });
        };
        getSchoolNo();

    }, [feesMasterZonewise]);
    // console.log(formData.monthly_Period, "formData.monthly_PeriodformData.monthly_PeriodformData.monthly_Period");

    const getSchoolNo = async () => {
        const token = getToken();
        let decodeToken = jwtDecode(token);
        try {
            const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schoolMaster/name-list?busOperatorId=${decodeToken.busOperatorID}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${token}`
                    }
                }
            );
            let responseData = result.data.data;
            setSchoolList(responseData);
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    }

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value
    //     });
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [mainKey, subKey] = name.split('.');
            setFormData((prevData) => ({
                ...prevData,
                [mainKey]: {
                    ...prevData[mainKey],
                    [subKey]: value
                }
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        const data = {
            // ...formData,
            schoolID: formData.schoolID,
            addressZone: formData.addressZone,
            monthly_Amount: formData.monthly_Amount,
            quarterly_Amount: formData.quarterly_Amount,
            annual_Amount: formData.annual_Amount,
            semiAnnual_Amount: formData.semiAnnual_Amount,
            quadrimester_Amount: formData.quadrimester_Amount,
            duedateForPayment: formData.duedateForPayment,
            monthly_Period: `${formData.monthly_Period.fromMonth}-${formData.monthly_Period.fromYear} To ${formData.monthly_Period.toMonth}-${formData.monthly_Period.toYear}`,
            quarterly_Period: `${formData.quarterly_Period.fromMonth}-${formData.quarterly_Period.fromYear} To ${formData.quarterly_Period.toMonth}-${formData.quarterly_Period.toYear}`,
            annual_Period: `${formData.annual_Period.fromMonth}-${formData.annual_Period.fromYear} To ${formData.annual_Period.toMonth}-${formData.annual_Period.toYear}`,
            semiAnnual_Period: `${formData.semiAnnual_Period.fromMonth}-${formData.semiAnnual_Period.fromYear} To ${formData.semiAnnual_Period.toMonth}-${formData.semiAnnual_Period.toYear}`,
            quadrimester_Period: `${formData.quadrimester_Period.fromMonth}-${formData.quadrimester_Period.fromYear} To ${formData.quadrimester_Period.toMonth}-${formData.quadrimester_Period.toYear}`,
        }
        try {
            if (feesMasterZonewise) {
                const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/fees-master-zonewise/${feesMasterZonewise.feesID}`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${token}`
                    }
                });
                toast.success(response.data.message);
            } else {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/fees-master-zonewise`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${token}`
                    }
                });
                toast.success(response.data.message);
            }
            datas;
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    };

    const getYears = () => {
        const currentYear = new Date().getFullYear();
        const minimum = currentYear - 1;
        const maximum = currentYear + 2;
        const options = [];
        for (let year = minimum; year <= maximum; year++) {
            options.push(
                <option key={year} value={year}>{year}</option>
            )
        }
        return options;
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
                        <form
                            onSubmit={handleSubmit}
                        >
                            <div className="row mb-3 mt-3 ">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <select
                                            id="schoolID"
                                            name="schoolID"
                                            className="form-select"
                                            value={formData.schoolID}
                                            onChange={handleChange}
                                        >
                                            <option value="" >-- Select School Name --</option>
                                            {schoolList.map((school, index) => (
                                                <option key={index} value={school.schoolID}>
                                                    {school.schoolName}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="schoolID" >
                                            School
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control" placeholder="" id="addressZone" name='addressZone'
                                            value={formData.addressZone} onChange={handleChange}
                                        />
                                        <label htmlFor="addressZone">Address Zone</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3 mt-3 ">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3 mb-md-0 ">
                                        <input className="form-control" placeholder="" id="duedateForPayment" name='duedateForPayment' type="date"
                                            value={formData.duedateForPayment} onChange={handleChange}
                                        />
                                        <label htmlFor="duedateForPayment">Due Date</label>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Payment Frequency</th>
                                            <th>Period</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Monthly</td>
                                            <td>
                                                From:
                                                <select className="form-select d-inline w-auto mx-1" id='monthly_Period.fromMonth' name='monthly_Period.fromMonth' value={formData.monthly_Period.fromMonth} onChange={handleChange}>
                                                    <option value="" >Month</option>
                                                    <option value="Jan">Jan</option>
                                                    <option value="Feb">Feb</option>
                                                    <option value="Mar">Mar</option>
                                                    <option value="Apr">Apr</option>
                                                    <option value="May">May</option>
                                                    <option value="Jun">Jun</option>
                                                    <option value="Jul">Jul</option>
                                                    <option value="Aug">Aug</option>
                                                    <option value="Sep">Sep</option>
                                                    <option value="Oct">Oct</option>
                                                    <option value="Nov">Nov</option>
                                                    <option value="Dec">Dec</option>
                                                </select>
                                                <select className="form-select d-inline w-auto mx-1" id='monthly_Period.fromYear' name='monthly_Period.fromYear' value={formData.monthly_Period.fromYear} onChange={handleChange}><option value="" >Year</option>{getYears()}</select>
                                                To:
                                                <select className="form-select d-inline w-auto mx-1" id='monthly_Period.toMonth' name='monthly_Period.toMonth' value={formData.monthly_Period.toMonth} onChange={handleChange}>
                                                    <option value="" >Month</option>
                                                    <option value="Jan">Jan</option>
                                                    <option value="Feb">Feb</option>
                                                    <option value="Mar">Mar</option>
                                                    <option value="Apr">Apr</option>
                                                    <option value="May">May</option>
                                                    <option value="Jun">Jun</option>
                                                    <option value="Jul">Jul</option>
                                                    <option value="Aug">Aug</option>
                                                    <option value="Sep">Sep</option>
                                                    <option value="Oct">Oct</option>
                                                    <option value="Nov">Nov</option>
                                                    <option value="Dec">Dec</option>
                                                </select>
                                                <select className="form-select d-inline w-auto mx-1" id='monthly_Period.toYear' name='monthly_Period.toYear' value={formData.monthly_Period.toYear} onChange={handleChange}><option value="" >Year</option>{getYears()}</select>
                                            </td>
                                            <td className='form-floating'>
                                                <input type="number" className="form-control" placeholder="" id='monthly_Amount' name='monthly_Amount' value={formData.monthly_Amount} onChange={handleChange} />
                                                <label htmlFor="monthly_Amount">Amount</label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Quarterly</td>
                                            <td>
                                                From:
                                                <select className="form-select d-inline w-auto mx-1" id='quarterly_Period.fromMonth' name='quarterly_Period.fromMonth' value={formData.quarterly_Period.fromMonth} onChange={handleChange}>
                                                    <option value="" >Month</option>
                                                    <option value="Jan">Jan</option>
                                                    <option value="Feb">Feb</option>
                                                    <option value="Mar">Mar</option>
                                                    <option value="Apr">Apr</option>
                                                    <option value="May">May</option>
                                                    <option value="Jun">Jun</option>
                                                    <option value="Jul">Jul</option>
                                                    <option value="Aug">Aug</option>
                                                    <option value="Sep">Sep</option>
                                                    <option value="Oct">Oct</option>
                                                    <option value="Nov">Nov</option>
                                                    <option value="Dec">Dec</option>
                                                </select>
                                                <select className="form-select d-inline w-auto mx-1" id='quarterly_Period.fromYear' name='quarterly_Period.fromYear' value={formData.quarterly_Period.fromYear} onChange={handleChange}><option value="" >Year</option>{getYears()}</select>
                                                To:
                                                <select className="form-select d-inline w-auto mx-1" id='quarterly_Period.toMonth' name='quarterly_Period.toMonth' value={formData.quarterly_Period.toMonth} onChange={handleChange}>
                                                    <option value="" >Month</option>
                                                    <option value="Jan">Jan</option>
                                                    <option value="Feb">Feb</option>
                                                    <option value="Mar">Mar</option>
                                                    <option value="Apr">Apr</option>
                                                    <option value="May">May</option>
                                                    <option value="Jun">Jun</option>
                                                    <option value="Jul">Jul</option>
                                                    <option value="Aug">Aug</option>
                                                    <option value="Sep">Sep</option>
                                                    <option value="Oct">Oct</option>
                                                    <option value="Nov">Nov</option>
                                                    <option value="Dec">Dec</option>
                                                </select>
                                                <select className="form-select d-inline w-auto mx-1" id='quarterly_Period.toYear' name='quarterly_Period.toYear' value={formData.quarterly_Period.toYear} onChange={handleChange}><option value="" >Year</option>{getYears()}</select>
                                            </td>
                                            <td className='form-floating'>
                                                <input type="number" className="form-control" placeholder="" id='quarterly_Amount' name='quarterly_Amount' value={formData.quarterly_Amount} onChange={handleChange} />
                                                <label htmlFor="quarterly_Amount">Amount</label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Quadrimester (4 Months)</td>
                                            <td>
                                                From:
                                                <select className="form-select d-inline w-auto mx-1" id='quadrimester_Period.fromMonth' name='quadrimester_Period.fromMonth' value={formData.quadrimester_Period.fromMonth} onChange={handleChange}>
                                                    <option value="" >Month</option>
                                                    <option value="Jan">Jan</option>
                                                    <option value="Feb">Feb</option>
                                                    <option value="Mar">Mar</option>
                                                    <option value="Apr">Apr</option>
                                                    <option value="May">May</option>
                                                    <option value="Jun">Jun</option>
                                                    <option value="Jul">Jul</option>
                                                    <option value="Aug">Aug</option>
                                                    <option value="Sep">Sep</option>
                                                    <option value="Oct">Oct</option>
                                                    <option value="Nov">Nov</option>
                                                    <option value="Dec">Dec</option>
                                                </select>
                                                <select className="form-select d-inline w-auto mx-1" id='quadrimester_Period.fromYear' name='quadrimester_Period.fromYear' value={formData.quadrimester_Period.fromYear} onChange={handleChange}><option value="" >Year</option>{getYears()}</select>
                                                To:
                                                <select className="form-select d-inline w-auto mx-1" id='quadrimester_Period.toMonth' name='quadrimester_Period.toMonth' value={formData.quadrimester_Period.toMonth} onChange={handleChange}>
                                                    <option value="" >Month</option>
                                                    <option value="Jan">Jan</option>
                                                    <option value="Feb">Feb</option>
                                                    <option value="Mar">Mar</option>
                                                    <option value="Apr">Apr</option>
                                                    <option value="May">May</option>
                                                    <option value="Jun">Jun</option>
                                                    <option value="Jul">Jul</option>
                                                    <option value="Aug">Aug</option>
                                                    <option value="Sep">Sep</option>
                                                    <option value="Oct">Oct</option>
                                                    <option value="Nov">Nov</option>
                                                    <option value="Dec">Dec</option>
                                                </select>
                                                <select className="form-select d-inline w-auto mx-1" id='quadrimester_Period.toYear' name='quadrimester_Period.toYear' value={formData.quadrimester_Period.toYear} onChange={handleChange}><option value="" >Year</option>{getYears()}</select>
                                            </td>
                                            <td className='form-floating'>
                                                <input type="number" className="form-control" placeholder="" id='quadrimester_Amount' name='quadrimester_Amount' value={formData.quadrimester_Amount} onChange={handleChange} />
                                                <label htmlFor="quadrimester_Amount">Amount</label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Semi Annual</td>
                                            <td>
                                                From:
                                                <select className="form-select d-inline w-auto mx-1" id='semiAnnual_Period.fromMonth' name='semiAnnual_Period.fromMonth' value={formData.semiAnnual_Period.fromMonth} onChange={handleChange}>
                                                    <option value="" >Month</option>
                                                    <option value="Jan">Jan</option>
                                                    <option value="Feb">Feb</option>
                                                    <option value="Mar">Mar</option>
                                                    <option value="Apr">Apr</option>
                                                    <option value="May">May</option>
                                                    <option value="Jun">Jun</option>
                                                    <option value="Jul">Jul</option>
                                                    <option value="Aug">Aug</option>
                                                    <option value="Sep">Sep</option>
                                                    <option value="Oct">Oct</option>
                                                    <option value="Nov">Nov</option>
                                                    <option value="Dec">Dec</option>
                                                </select>
                                                <select className="form-select d-inline w-auto mx-1" id='semiAnnual_Period.fromYear' name='semiAnnual_Period.fromYear' value={formData.semiAnnual_Period.fromYear} onChange={handleChange}><option value="" >Year</option>{getYears()}</select>
                                                To:
                                                <select className="form-select d-inline w-auto mx-1" id='semiAnnual_Period.toMonth' name='semiAnnual_Period.toMonth' value={formData.semiAnnual_Period.toMonth} onChange={handleChange}>
                                                    <option value="" >Month</option>
                                                    <option value="Jan">Jan</option>
                                                    <option value="Feb">Feb</option>
                                                    <option value="Mar">Mar</option>
                                                    <option value="Apr">Apr</option>
                                                    <option value="May">May</option>
                                                    <option value="Jun">Jun</option>
                                                    <option value="Jul">Jul</option>
                                                    <option value="Aug">Aug</option>
                                                    <option value="Sep">Sep</option>
                                                    <option value="Oct">Oct</option>
                                                    <option value="Nov">Nov</option>
                                                    <option value="Dec">Dec</option>
                                                </select>
                                                <select className="form-select d-inline w-auto mx-1" id='semiAnnual_Period.toYear' name='semiAnnual_Period.toYear' value={formData.semiAnnual_Period.toYear} onChange={handleChange}><option value="" >Year</option>{getYears()}</select>
                                            </td>
                                            <td className='form-floating'>
                                                <input type="number" className="form-control" placeholder="" id='semiAnnual_Amount' name='semiAnnual_Amount' value={formData.semiAnnual_Amount} onChange={handleChange} />
                                                <label htmlFor="semiAnnual_Amount">Amount</label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Annual</td>
                                            <td>
                                                From:
                                                <select className="form-select d-inline w-auto mx-1" id='formData.annual_Period.fromMonth' name='formData.annual_Period.fromMonth' value={formData.annual_Period.fromMonth} onChange={handleChange}>
                                                    <option value="" >Month</option>
                                                    <option value="Jan">Jan</option>
                                                    <option value="Feb">Feb</option>
                                                    <option value="Mar">Mar</option>
                                                    <option value="Apr">Apr</option>
                                                    <option value="May">May</option>
                                                    <option value="Jun">Jun</option>
                                                    <option value="Jul">Jul</option>
                                                    <option value="Aug">Aug</option>
                                                    <option value="Sep">Sep</option>
                                                    <option value="Oct">Oct</option>
                                                    <option value="Nov">Nov</option>
                                                    <option value="Dec">Dec</option>
                                                </select>
                                                <select className="form-select d-inline w-auto mx-1" id='annual_Period.fromYear' name='annual_Period.fromYear' value={formData.annual_Period.fromYear} onChange={handleChange}><option value="" >Year</option>{getYears()}</select>
                                                To:
                                                <select className="form-select d-inline w-auto mx-1" id='annual_Period.toMonth' name='annual_Period.toMonth' value={formData.annual_Period.toMonth} onChange={handleChange}>
                                                    <option value="" >Month</option>
                                                    <option value="Jan">Jan</option>
                                                    <option value="Feb">Feb</option>
                                                    <option value="Mar">Mar</option>
                                                    <option value="Apr">Apr</option>
                                                    <option value="May">May</option>
                                                    <option value="Jun">Jun</option>
                                                    <option value="Jul">Jul</option>
                                                    <option value="Aug">Aug</option>
                                                    <option value="Sep">Sep</option>
                                                    <option value="Oct">Oct</option>
                                                    <option value="Nov">Nov</option>
                                                    <option value="Dec">Dec</option>
                                                </select>
                                                <select className="form-select d-inline w-auto mx-1" id='annual_Period.toYear' name='annual_Period.toYear' value={formData.annual_Period.toYear} onChange={handleChange}><option value="" >Year</option>{getYears()}</select>
                                            </td>
                                            <td className='form-floating'>
                                                <input type="number" className="form-control" placeholder="" id='annual_Amount' name='annual_Amount' value={formData.annual_Amount} onChange={handleChange} />
                                                <label htmlFor="annual_Amount">Amount</label>
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>
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
        </div >

    );
}


export default AddEditFeesMasterZonewise;