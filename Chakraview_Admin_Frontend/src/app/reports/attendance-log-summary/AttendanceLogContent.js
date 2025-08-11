'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { getToken } from '@/utils/api';
import Pagination from '@/components/Pagination';
import NoData from '@/components/NoData';

// ✅ NEW: helpers to decode JWT and extract busOperatorID
const decodeBase64Url = (s) => {
  try {
    const base64 = s.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4 ? 4 - (base64.length % 4) : 0;
    const padded = base64 + '='.repeat(pad);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};
const getBusOperatorIdFromToken = (token) => {
  try {
    const payload = decodeBase64Url(token.split('.')[1]);
    return (
      payload?.busOperatorID ??
      payload?.BusOperatorID ??
      payload?.busOperatorId ??
      null
    );
  } catch {
    return null;
  }
};

export default function StudentAttendanceReportContent() {
  const limit = 50;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [filters, setFilters] = useState({
    schoolName: '',
    busAttendant: '',
    routeType: 'all',
    routeName: '',
    attendanceType: 'QR Code',
    type: 'taken',
    fromDate: '', // DD-MM-YYYY
    toDate: '',   // DD-MM-YYYY
  });

  const schools = useMemo(() => [...new Set(rows.map(r => r.school).filter(Boolean))], [rows]);
  const attendants = useMemo(() => [...new Set(rows.map(r => r.busAttendant).filter(v => v !== '' && v !== null && v !== undefined))], [rows]);
  const routes = useMemo(() => [...new Set(rows.map(r => r.route).filter(Boolean))], [rows]);

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const start = (page - 1) * limit;
  const current = rows.slice(start, start + limit);

  const abortRef = useRef(null);

  const fetchData = async (serverParams) => {
    try {
      setLoading(true);
      setErr(null);

      const token = getToken();
      if (!token) throw new Error('No token found');

      // ✅ NEW: extract operator id from token
      const busOperatorId = getBusOperatorIdFromToken(token);
      if (!busOperatorId) throw new Error('Token missing busOperatorID');

      const base = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
      if (!base) throw new Error('NEXT_PUBLIC_API_URL is not set');

      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      const { data } = await axios.get(`${base}/studentAttendanceReport`, {
        // ✅ NEW: include busOperatorId in params
        params: { ...serverParams, busOperatorId },
        signal: abortRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = data?.data?.result ?? [];
      setRows(Array.isArray(result) ? result : []);
    } catch (e) {
      if (axios.isCancel(e)) return;
      const msg = e?.response?.data?.message || e?.message || 'Unknown error';
      console.error('Report error', e?.response?.data || msg);
      setErr(new Error(msg));
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData({
      routeType: filters.routeType,
      attendanceType: filters.attendanceType,
      type: filters.type,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = () => {
    setPage(1);
    fetchData({
      routeType: filters.routeType,
      attendanceType: filters.attendanceType,
      type: filters.type,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
    });
  };

  const reset = () => {
    const next = {
      schoolName: '',
      busAttendant: '',
      routeType: 'all',
      routeName: '',
      attendanceType: 'QR Code',
      type: 'taken',
      fromDate: '',
      toDate: '',
    };
    setFilters(next);
    setPage(1);
    fetchData({
      routeType: next.routeType,
      attendanceType: next.attendanceType,
      type: next.type,
      fromDate: next.fromDate,
      toDate: next.toDate,
    });
  };

  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      const bySchool = filters.schoolName ? r.school === filters.schoolName : true;
      const byRoute  = filters.routeName   ? r.route === filters.routeName   : true;
      const byAtt    = filters.busAttendant !== '' && filters.busAttendant !== null && filters.busAttendant !== undefined
        ? String(r.busAttendant) === String(filters.busAttendant)
        : true;
      const byRouteType = filters.routeType === 'all' ? true : (r.routeType || '').toLowerCase() === filters.routeType;
      return bySchool && byRoute && byAtt && byRouteType;
    });
  }, [rows, filters]);

  const totalFilteredPages = Math.max(1, Math.ceil(filteredRows.length / limit));
  const filteredStart = (page - 1) * limit;
  const filteredCurrent = filteredRows.slice(filteredStart, filteredStart + limit);

  return (
    <div className="container-fluid px-4 mt-5">
      <h2 className="text-center my-4"><b>Student Attendance Report</b></h2>

      {/* FILTERS PANEL */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4">
              <label className="form-label">School</label>
              <select
                className="form-select"
                value={filters.schoolName}
                onChange={(e) => { setFilters(f => ({ ...f, schoolName: e.target.value })); setPage(1); }}
              >
                <option value="">All Schools</option>
                {schools.map((s, i) => (<option key={i} value={s}>{s}</option>))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Bus Attendant</label>
              <select
                className="form-select"
                value={filters.busAttendant}
                onChange={(e) => { setFilters(f => ({ ...f, busAttendant: e.target.value })); setPage(1); }}
              >
                <option value="">All Bus Attendants</option>
                {attendants.map((a, i) => (<option key={i} value={a}>{String(a)}</option>))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Route Type</label>
              <select
                className="form-select"
                value={filters.routeType}
                onChange={(e) => setFilters(f => ({ ...f, routeType: e.target.value }))}
              >
                <option value="all">All</option>
                <option value="pickup">Pickup</option>
                <option value="drop">Drop</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Route Name</label>
              <select
                className="form-select"
                value={filters.routeName}
                onChange={(e) => { setFilters(f => ({ ...f, routeName: e.target.value })); setPage(1); }}
              >
                <option value="">All Routes</option>
                {routes.map((r, i) => (<option key={i} value={r}>{r}</option>))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Attendance Type</label>
              <select
                className="form-select"
                value={filters.attendanceType}
                onChange={(e) => setFilters(f => ({ ...f, attendanceType: e.target.value }))}
              >
                <option value="">All</option>
                <option value="QR Code">QR Code</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={filters.type}
                onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
              >
                <option value="taken">Taken</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">From Date (DD-MM-YYYY)</label>
              <input
                type="text"
                className="form-control"
                placeholder="DD-MM-YYYY"
                value={filters.fromDate}
                onChange={(e) => setFilters(f => ({ ...f, fromDate: e.target.value }))}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">To Date (DD-MM-YYYY)</label>
              <input
                type="text"
                className="form-control"
                placeholder="DD-MM-YYYY"
                value={filters.toDate}
                onChange={(e) => setFilters(f => ({ ...f, toDate: e.target.value }))}
              />
            </div>

            <div className="col-md-6 d-flex align-items-end gap-2">
              <button className="btn btn-primary" onClick={apply}>Apply</button>
              <button className="btn btn-outline-secondary" onClick={reset}>Reset</button>
            </div>
          </div>
        </div>
      </div>

      {/* HEADLINE ECHO */}
      <div className="mb-2">
        <b>School</b> {filters.schoolName || 'All Schools'} &nbsp;&nbsp;
        <b>Bus Attendant</b> {filters.busAttendant || 'All Bus Attendants'} &nbsp;&nbsp;
        <b>Route Type</b> {filters.routeType === 'all' ? 'All' : filters.routeType} &nbsp;&nbsp;
        <b>Route Name</b> {filters.routeName || 'All Routes'} &nbsp;&nbsp;
        <b>Attendance Type</b> {filters.attendanceType || 'All'} &nbsp;&nbsp;
        <b>Type</b> {filters.type} &nbsp;&nbsp;
        <b>From Date</b> {filters.fromDate || '-'} &nbsp;&nbsp;
        <b>To Date</b> {filters.toDate || '-'}
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="card-header"><b>Attendance Taken (Pickup)</b></div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">Loading…</div>
          ) : err ? (
            <div className="alert alert-danger m-3">Failed to load report: {String(err.message || 'Error')}</div>
          ) : filteredRows.length === 0 ? (
            <div className="p-3"><NoData /></div>
          ) : (
            <>
              <table className="table table-striped table-bordered mb-0">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>School</th>
                    <th>Bus Attendant</th>
                    <th>Route</th>
                    <th>Student Name</th>
                    <th>DateTime</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCurrent.map((r, i) => (
                    <tr key={`${r.studentName}-${r.dateTime}-${i}`}>
                      <td>{(page - 1) * limit + i + 1}</td>
                      <td>{r.school || '-'}</td>
                      <td>{r.busAttendant || '-'}</td>
                      <td>{r.route || '-'}</td>
                      <td>{r.studentName || '-'}</td>
                      <td>{r.dateTime || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3">
                <Pagination
                  page={page}
                  totalPages={Math.max(1, Math.ceil(filteredRows.length / limit))}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
