'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getToken } from '@/utils/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/Pagination';
import NoData from '@/components/NoData';

function parseDDMMYYYYHHMMSS(s) {
  if (!s || typeof s !== 'string') return null;
  const [d, t = '00:00:00'] = s.split(' ');
  const [dd, mm, yyyy] = (d || '').split('-').map(Number);
  const [HH = 0, MM = 0, SS = 0] = t.split(':').map(Number);
  const dt = new Date(yyyy || 0, (mm || 1) - 1, dd || 1, HH, MM, SS);
  return isNaN(dt.getTime()) ? null : dt;
}

function formatDateISO(date) {
  // Returns yyyy-mm-dd formatted string from Date object
  if (!date) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function NotificationLogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const limit = 50;
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const page = Number.isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;

  const todayStr = formatDateISO(new Date());

  // Temp filters used in filter controls before applying
  const [tempFilters, setTempFilters] = useState({
    school: 'All',
    attendant: 'All',
    routeType: 'All',
    messageType: 'All',
    routeName: 'All',
    mobileNumber: 'All',
    from: todayStr,  // default to today
    to: todayStr,    // default to today
  });

  // Applied filters
  const [filters, setFilters] = useState({
    school: 'All',
    attendant: 'All',
    routeType: 'All',
    messageType: 'All',
    routeName: 'All',
    mobileNumber: 'All',
    from: todayStr,  // default to today
    to: todayStr,    // default to today
  });

  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const token = getToken();
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/notificationLog`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${token}`,
            },
          }
        );

        const data = Array.isArray(res?.data?.data) ? res.data.data : [];

        // normalize keys and parse dates
        const normalized = data.map((d, i) => {
          const routeType = d.RouteType ?? d['Route Type'] ?? '';
          const messageType = d.MessageType ?? d['Message Type'] ?? '';
          const messageTitle = d.MessageTitle ?? d['Message Title'] ?? '';
          const mobileNumbers = d.MobileNumbers ?? d['Mobile Numbers'] ?? '';
          const dateTimeStr = d.DateTime ?? '';
          const dateObj = parseDDMMYYYYHHMMSS(dateTimeStr);

          return {
            id: i,
            busAttendant: d['Bus Attendant'] ?? '',
            school: d.School ?? '',
            route: d.Route ?? d.RouteName ?? '',
            routeType,
            messageType,
            messageTitle,
            messageURL: d.MessageURL ?? '',
            mobileNumbers,
            dateTimeStr,
            dateObj,
          };
        });

        if (mounted) setRaw(normalized);
      } catch (e) {
        console.error('Failed to load notification logs:', e);
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Get unique sorted options with 'All' at the front
  const schoolOptions = useMemo(
    () => ['All', ...Array.from(new Set(raw.map(r => r.school).filter(Boolean))).sort()],
    [raw]
  );
  const attendantOptions = useMemo(
    () => ['All', ...Array.from(new Set(raw.map(r => r.busAttendant).filter(Boolean))).sort()],
    [raw]
  );
  const routeTypeOptions = useMemo(
    () => ['All', ...Array.from(new Set(raw.map(r => r.routeType).filter(Boolean))).sort()],
    [raw]
  );
  const messageTypeOptions = useMemo(
    () => ['All', ...Array.from(new Set(raw.map(r => r.messageType).filter(Boolean))).sort()],
    [raw]
  );
  const routeNameOptions = useMemo(
    () => ['All', ...Array.from(new Set(raw.map(r => r.route).filter(Boolean))).sort()],
    [raw]
  );
  const mobileNumberOptions = useMemo(() => {
    const allNumbers = raw
      .map(r => (r.mobileNumbers || '').split(',').map(m => m.trim()))
      .flat()
      .filter(Boolean);
    const uniqueNumbers = Array.from(new Set(allNumbers)).sort();
    return ['All', ...uniqueNumbers];
  }, [raw]);

  // Date boundaries for filtering
  const fromDate = filters.from ? new Date(`${filters.from}T00:00:00`) : null;
  const toDate = filters.to ? new Date(`${filters.to}T23:59:59`) : null;

  // Filtering function
  const filtered = useMemo(() => {
    const s = (filters.school || '').toLowerCase();
    const a = (filters.attendant || '').toLowerCase();
    const rt = (filters.routeType || '').toLowerCase();
    const mt = (filters.messageType || '').toLowerCase();
    const rn = (filters.routeName || '').toLowerCase();
    const mn = (filters.mobileNumber || '').toLowerCase();

    return raw.filter(r => {
      if (filters.school !== 'All' && (r.school || '').toLowerCase() !== s) return false;
      if (filters.attendant !== 'All' && (r.busAttendant || '').toLowerCase() !== a) return false;
      if (filters.routeType !== 'All' && (r.routeType || '').toLowerCase() !== rt) return false;
      if (filters.messageType !== 'All' && (r.messageType || '').toLowerCase() !== mt) return false;
      if (filters.routeName !== 'All' && (r.route || '').toLowerCase() !== rn) return false;
      if (filters.mobileNumber !== 'All') {
        const mobileNums = (r.mobileNumbers || '').split(',').map(m => m.trim().toLowerCase());
        if (!mobileNums.includes(mn)) return false;
      }
      if (fromDate && (!r.dateObj || r.dateObj < fromDate)) return false;
      if (toDate && (!r.dateObj || r.dateObj > toDate)) return false;
      return true;
    });
  }, [raw, filters, fromDate, toDate]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const currentPageData = filtered.slice(startIndex, endIndex);

  // Redirect if page out of range
  useEffect(() => {
    if (page > totalPages) {
      router.push(`?page=${totalPages}`);
    }
  }, [page, totalPages, router]);

  const handlePageChange = newPage => {
    if (newPage > 0 && newPage <= totalPages) {
      router.push(`?page=${newPage}`);
    }
  };

  // Apply filters from tempFilters state
  const handleApplyFilters = () => {
    setFilters({ ...tempFilters });
    router.push('?page=1');
  };

  // Valid 10-digit mobile number count based on currently filtered data
  // Assumes valid mobile number is exactly 10 digits (only digits)
  const validMobileCount = useMemo(() => {
    const mobileSet = new Set();

    filtered.forEach(r => {
      const numbers = (r.mobileNumbers || '')
        .split(',')
        .map(m => m.trim())
        .filter(m => /^\d{12}$/.test(m));
      numbers.forEach(n => mobileSet.add(n));
    });

    return mobileSet.size;
  }, [filtered]);

  // Reset filters to default
  const handleResetFilters = () => {
    const reset = {
      school: 'All',
      attendant: 'All',
      routeType: 'All',
      messageType: 'All',
      routeName: 'All',
      mobileNumber: 'All',
      from: todayStr,
      to: todayStr,
    };
    setTempFilters(reset);
    setFilters(reset);
    router.push('?page=1');
  };

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4 mt-5">
          <h2 className="text-center font-weight-light my-4">
            <b>Student Attendance — Notification Log</b>
          </h2>

          {/* Filter Card */}
          <div
            className="card mb-4"
            style={{
              maxWidth: 900,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <div className="card-body" style={{ paddingTop: 12, paddingBottom: 12 }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 8,
                  maxWidth: 860,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                {/* School */}
                <select
                  className="form-select"
                  value={tempFilters.school}
                  onChange={e => setTempFilters(f => ({ ...f, school: e.target.value }))}
                  style={{
                    minWidth: 120,
                    maxWidth: 160,
                    flex: '1 1 120px',
                  }}
                >
                  {schoolOptions.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>

                {/* Bus Attendant */}
                <select
                  className="form-select"
                  value={tempFilters.attendant}
                  onChange={e => setTempFilters(f => ({ ...f, attendant: e.target.value }))}
                  style={{
                    minWidth: 120,
                    maxWidth: 160,
                    flex: '1 1 120px',
                  }}
                >
                  {attendantOptions.map(o => (
                    <option key={o} value={o}>
                      {o === 'All' ? 'All Bus Attendants' : o}
                    </option>
                  ))}
                </select>

                {/* Route Type */}
                <select
                  className="form-select"
                  value={tempFilters.routeType}
                  onChange={e => setTempFilters(f => ({ ...f, routeType: e.target.value }))}
                  style={{
                    minWidth: 120,
                    maxWidth: 160,
                    flex: '1 1 120px',
                  }}
                >
                  {routeTypeOptions.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>

                {/* Message Type */}
                <select
                  className="form-select"
                  value={tempFilters.messageType}
                  onChange={e => setTempFilters(f => ({ ...f, messageType: e.target.value }))}
                  style={{
                    minWidth: 120,
                    maxWidth: 160,
                    flex: '1 1 120px',
                  }}
                >
                  {messageTypeOptions.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>

                {/* Route Name */}
                <select
                  className="form-select"
                  value={tempFilters.routeName}
                  onChange={e => setTempFilters(f => ({ ...f, routeName: e.target.value }))}
                  style={{
                    minWidth: 120,
                    maxWidth: 160,
                    flex: '1 1 120px',
                  }}
                >
                  {routeNameOptions.map(o => (
                    <option key={o} value={o}>
                      {o === 'All' ? 'All Routes' : o}
                    </option>
                  ))}
                </select>

                {/* Mobile Number */}
                <select
                  className="form-select"
                  value={tempFilters.mobileNumber}
                  onChange={e => setTempFilters(f => ({ ...f, mobileNumber: e.target.value }))}
                  style={{
                    minWidth: 120,
                    maxWidth: 160,
                    flex: '1 1 120px',
                  }}
                >
                  {mobileNumberOptions.map(o => (
                    <option key={o} value={o}>
                      {o === 'All' ? 'All Mobile Numbers' : o}
                    </option>
                  ))}
                </select>

                {/* From Date */}
                <input
                  type="date"
                  className="form-control"
                  value={tempFilters.from}
                  onChange={e => setTempFilters(f => ({ ...f, from: e.target.value }))}
                  style={{ maxWidth: 130 }}
                  max={tempFilters.to || ''}
                />

                {/* To Date */}
                <input
                  type="date"
                  className="form-control"
                  value={tempFilters.to}
                  onChange={e => setTempFilters(f => ({ ...f, to: e.target.value }))}
                  style={{ maxWidth: 130 }}
                  min={tempFilters.from || ''}
                />
              </div>

              <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-3 text-center">
            <strong>Valid 10-digit mobile numbers in filtered data: {validMobileCount}</strong>
          </div>

          {/* Loading and error */}
          {loading && <p>Loading...</p>}
          {error && (
            <p className="text-danger">
              Failed to load data. Please try again later.
            </p>
          )}

          {/* Table */}
      {/* Table */}
{!loading && filtered.length > 0 && (
  <div
    style={{
      overflowX: 'auto',
      maxWidth: '1200',   // increased width here
      marginLeft: 'auto',
      marginRight: 'auto',
    }}
  >
    <table className="table table-striped table-hover table-bordered" style={{ fontSize: 14, minWidth: '1000px' }}>
      <thead className="card-header">
        <tr>
          <th>School</th>
          <th>Bus Attendant</th>
          <th>Route</th>
          <th>Route Type</th>
          <th>Message Type</th>
          <th>Message Title</th>
          <th>Mobile Numbers</th>
          <th>Date Time</th>
          <th>Message URL</th>
        </tr>
      </thead>
      <tbody>
        {currentPageData.map(row => (
          <tr key={row.id}>
            <td>{row.school}</td>
            <td>{row.busAttendant}</td>
            <td>{row.route}</td>
            <td>{row.routeType}</td>
            <td>{row.messageType}</td>
            <td>{row.messageTitle}</td>
            <td>
              {row.mobileNumbers
                .split(',')
                .map(m => m.trim())
                .filter(Boolean)
                .map((m, idx) => (
                  <div key={idx}>{m}</div>
                ))}
            </td>
            <td>{row.dateTimeStr}</td>
            <td>
              {row.messageURL}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>
    </div>
  );
}
