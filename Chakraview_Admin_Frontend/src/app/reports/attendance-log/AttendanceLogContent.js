'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getToken } from "@/utils/api";
import Tooltip from '@/components/Tooltip/Tooltip';
import { toast } from 'react-toastify';
import NoData from '@/components/NoData';

function StudentAttendanceContent() {
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters (use "All" for selects)
  const [filters, setFilters] = useState({
    school: 'All',
    routeName: 'All',
    routeType: 'All',
    attendanceType: 'All',
    from: '',
    to: ''
  });

  useEffect(() => {
    let mounted = true;
    const fetchAttendance = async () => {
      try {
        const token = getToken();
        const result = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/studentAttendanceReport`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${token}`, // switch to Bearer if needed
            },
          }
        );
        if (!mounted) return;
        setStudentAttendance(result?.data?.data ?? []);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message ?? 'Failed to load student attendance');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAttendance();
    return () => { mounted = false; };
  }, []);

  const titleCase = (s) => (s ?? '')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Parse "DD-MM-YYYY HH:mm:ss" -> Date
  const parseDDMMYYYYHHMMSS = (s) => {
    if (!s || typeof s !== 'string') return null;
    const [d, t = '00:00:00'] = s.split(' ');
    const [dd, mm, yyyy] = (d || '').split('-').map(Number);
    const [HH = 0, MM = 0, SS = 0] = t.split(':').map(Number);
    if (!yyyy || !mm || !dd) return null;
    const dt = new Date(yyyy, (mm - 1), dd, HH, MM, SS);
    return isNaN(dt.getTime()) ? null : dt;
  };

  // Build rows
  const rows = useMemo(() => {
    return (studentAttendance ?? []).map((row, idx) => {
      const attendanceType = (row.attendanceType ?? row.AttendanceType ?? row.AttendanceAt ?? '').toString();
      const routeType = (row.type ?? row.RouteType ?? '').toString();
      const routeName = (row.routeName ?? row.RouteName ?? '').toString();
      const dateTimeStr = (row.dateTime ?? row.DateTime ?? '').toString();
      const studentName = (row.studentName ?? row.StudentName ?? '').toString();
      const schoolName = (row.schoolName ?? row.SchoolName ?? '').toString();
      const id = row.studentAttendanceID ?? row.StudentAttendanceID ?? idx;

      const dateObj = parseDDMMYYYYHHMMSS(dateTimeStr);

      return {
        _id: id,
        studentName,
        schoolName,
        routeName,
        routeType,
        attendanceType,
        dateTimeStr,
        dateObj,
        // lowercase for comparisons
        _schoolName: schoolName.toLowerCase(),
        _routeName: routeName.toLowerCase(),
        _routeType: routeType.toLowerCase(),
        _attendanceType: attendanceType.toLowerCase(),
      };
    });
  }, [studentAttendance]);

  // Helper to make distinct, case-insensitive, sorted options
  const makeDistinctOptions = (arr) => {
    const map = new Map(); // key: lower, value: first seen original
    for (const v of arr) {
      const s = (v ?? '').toString().trim();
      if (!s) continue;
      const key = s.toLowerCase();
      if (!map.has(key)) map.set(key, s);
    }
    return ['All', ...Array.from(map.values()).sort((a, b) => a.localeCompare(b))];
  };

  // Distinct option lists
  const schoolOptions = useMemo(
    () => makeDistinctOptions(rows.map(r => r.schoolName)),
    [rows]
  );
  const routeNameOptions = useMemo(
    () => makeDistinctOptions(rows.map(r => r.routeName)),
    [rows]
  );
  const routeTypeOptions = useMemo(
    () => makeDistinctOptions(rows.map(r => r.routeType)),
    [rows]
  );
  const attendanceTypeOptions = useMemo(
    () => makeDistinctOptions(rows.map(r => r.attendanceType)),
    [rows]
  );

  // Date range (inclusive)
  const fromDate = useMemo(() => (filters.from ? new Date(filters.from) : null), [filters.from]);
  const toDate   = useMemo(() => (filters.to ? new Date(filters.to) : null), [filters.to]);

  // Apply filters
  const filteredRows = useMemo(() => {
    const schoolSel = (filters.school ?? 'All').toLowerCase();
    const routeSel  = (filters.routeName ?? 'All').toLowerCase();
    const routeTypeSel = (filters.routeType ?? 'All').toLowerCase();
    const attTypeSel   = (filters.attendanceType ?? 'All').toLowerCase();

    return rows.filter(r => {
      if (schoolSel !== 'all' && r._schoolName !== schoolSel) return false;
      if (routeSel  !== 'all' && r._routeName  !== routeSel)  return false;
      if (routeTypeSel !== 'all' && r._routeType !== routeTypeSel) return false;
      if (attTypeSel   !== 'all' && r._attendanceType !== attTypeSel) return false;

      if (fromDate && (!r.dateObj || r.dateObj < fromDate)) return false;
      if (toDate   && (!r.dateObj || r.dateObj > toDate))   return false;

      return true;
    });
  }, [rows, filters, fromDate, toDate]);

  const clearFilters = () => setFilters({
    school: 'All',
    routeName: 'All',
    routeType: 'All',
    attendanceType: 'All',
    from: '',
    to: ''
  });

  return (
    <>
      <div id="layoutSidenav_content">
        <main>
          <div className="container-fluid px-4 mt-5">
            <h2 className="text-center font-weight-light my-4">
              <b>Student Attendance</b>
            </h2>

            {/* Filters */}
            <div className="card mb-3">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">School</label>
                    <select
                      className="form-select"
                      value={filters.school}
                      onChange={(e) => setFilters(f => ({ ...f, school: e.target.value }))}
                    >
                      {schoolOptions.map(opt => (
                        <option key={opt} value={opt}>{opt === 'All' ? 'All' : opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Route Name</label>
                    <select
                      className="form-select"
                      value={filters.routeName}
                      onChange={(e) => setFilters(f => ({ ...f, routeName: e.target.value }))}
                    >
                      {routeNameOptions.map(opt => (
                        <option key={opt} value={opt}>{opt === 'All' ? 'All' : opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Route Type</label>
                    <select
                      className="form-select"
                      value={filters.routeType}
                      onChange={(e) => setFilters(f => ({ ...f, routeType: e.target.value }))}
                    >
                      {routeTypeOptions.map(opt => (
                        <option key={opt} value={opt}>{opt === 'All' ? 'All' : titleCase(opt)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Attendance Type</label>
                    <select
                      className="form-select"
                      value={filters.attendanceType}
                      onChange={(e) => setFilters(f => ({ ...f, attendanceType: e.target.value }))}
                    >
                      {attendanceTypeOptions.map(opt => (
                        <option key={opt} value={opt}>{opt === 'All' ? 'All' : titleCase(opt)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2 d-flex align-items-end">
                    <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                      Clear Filters
                    </button>
                  </div>
                </div>

                <div className="row g-3 mt-1">
                  <div className="col-md-3">
                    <label className="form-label">From (Date &amp; Time)</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={filters.from}
                      onChange={(e) => setFilters(f => ({ ...f, from: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">To (Date &amp; Time)</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={filters.to}
                      onChange={(e) => setFilters(f => ({ ...f, to: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-6 d-flex align-items-end justify-content-end">
                    <div className="text-muted">
                      Showing <b>{filteredRows.length}</b> of <b>{rows.length}</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body">
              {loading ? (
                <div className="text-center my-5">Loading...</div>
              ) : rows.length === 0 ? (
                <NoData />
              ) : (
                <>
                  <table id="datatablesSimple">
                    <thead className="card-header">
                      <tr>
                        <th>Sr. No</th>
                        <th>Student</th>
                        <th>School</th>
                        <th>Route Name</th>
                        <th>Route Type</th>
                        <th>Attendance Type</th>
                        <th>Date &amp; Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.map((r, index) => (
                        <tr key={r._id}>
                          <td>{index + 1}</td>
                          <td>{r.studentName || '-'}</td>
                          <td>{r.schoolName || '-'}</td>
                          <td>{r.routeName || '-'}</td>
                          <td>{titleCase(r.routeType) || '-'}</td>
                          <td>{titleCase(r.attendanceType) || '-'}</td>
                          <td>{r.dateTimeStr || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default StudentAttendanceContent;
