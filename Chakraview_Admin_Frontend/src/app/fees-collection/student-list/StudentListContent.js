'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import StudentImg from 'public/images/ic_student_male_1.png';
import { useRouter } from 'next/navigation';
import { getData } from '@/utils/feesCollectionApi';

function StudentListContent() {
    const [students, setStudents] = useState([]);
    const router = useRouter();
    const handleStudentsClick = async (studentID, schoolID) => {
        router.push(`/fees-collection/payment?stdID=${studentID}&schID=${schoolID}`)
    };
    useEffect(() => {
        try {
            const getStudents = async () => {
                const result = await getData(`students/student-list-by-no`)
                let responseData = result.data;
                setStudents(responseData);
            }
            getStudents();
        } catch (error) {
            console.log(error);
        }
    }, [])

    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <div className="container-fluid px-4 mt-5 ">
                        <h2 className="text-center font-weight-light my-4"><b>Students</b></h2>
                        <div className="card-body">
                            <div className="container">
                                <div className="row">
                                    {students.map((data, index) => {
                                        return (
                                            <div className="col-md-3 d-flex justify-content-center mb-4" key={index}>
                                                <div className="card" style={{ width: "18rem" }}>
                                                    <Image src={data.studentImg || StudentImg} className="card-img-top" width={250} height={200} alt="Student Image" />
                                                    <div className="card-body">
                                                        <h5 className="card-title"><strong >{data.studentName}</strong> </h5>
                                                        <p>{data.schoolName}({data.busOperator})</p>
                                                        <button className="btn btn-primary " id={`students-${data.studentID}`} onClick={() => handleStudentsClick(data.studentID, data.schoolID)}>
                                                            Pay Fees
                                                        </button>&nbsp;
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div >
                </main >
            </div >
        </>
    );
}

export default StudentListContent;


