'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getToken } from '@/utils/api';
import NoData from '@/components/NoData';

// Parse "DD-MM-YYYY HH:mm:ss" to Date
function parseDDMMYYYYHHMMSS(s) {
  if (!s || typeof s !== 'string') return null;
  const [d, t = '00:00:00'] = s.split(' ');
  const [dd, mm, yyyy] = (d || '').split('-').map(Number);
  const [HH = 0, MM = 0, SS = 0] = t.split(':').map(Number);
  const dt = new Date(yyyy || 0, (mm || 1) - 1, dd || 1, HH, MM, SS);
  return isNaN(dt.getTime()) ? null : dt;
}

export default function StudentAttendanceNotificationLogContent() {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial filters per your example
  const [filters, setFilters] = useState({
    school: 'Indo Scots Global School',
    attendant: 'All',          // “All Bus Attendants”
    routeType: 'All',          // Pickup | Drop | All
    messageType: 'Pickup 2 SMS',
    routeName: 'All',
    from: '2025-08-11',
    to: '2025-08-11',
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = getToken();
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/studentAttendanceNotificationLog`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${token}`,
            },
          }
        );

        const data = Array.isArray(res?.data?.data) ? res.data.data : [];

        // normalize keys (handles spaced keys too)
        const normalized = data.map((d, i) => {
          const routeType = d.RouteType ?? d['Route Type'] ?? ''; // Pickup/Drop
          const messageType = d.MessageType ?? d['Message Type'] ?? '';
          const dateTimeStr = d.DateTime ?? '';
          const dateObj = parseDDMMYYYYHHMMSS(dateTimeStr);

          return {
            id: i,
            student: d.Student ?? '',
            busAttendant: d['Bus Attendant'] ?? '',
            school: d.School ?? '',
            route: d.Route ?? d.RouteName ?? '',
            routeType,
            messageType,
            messageURL: d.MessageURL ?? '',
            dateTimeStr,
            dateObj,
          };
        });

        if (mounted) setRaw(normalized);
      } catch (e) {
        console.error('Failed to load notification logs:', e);
        if (mounted) setRaw([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Options
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

  // Date boundaries (inclusive)
  const fromDate = filters.from ? new Date(`${filters.from}T00:00:00`) : null;
  const toDate = filters.to ? new Date(`${filters.to}T23:59:59`) : null;

  // Apply filters
  const filtered = useMemo(() => {
    const s = (filters.school || '').toLowerCase();
    const a = (filters.attendant || '').toLowerCase();
    const rt = (filters.routeType || '').toLowerCase();
    const mt = (filters.messageType || '').toLowerCase();
    const rn = (filters.routeName || '').toLowerCase();

    return raw.filter(r => {
      if (filters.school !== 'All' && (r.school || '').toLowerCase() !== s) return false;
      if (filters.attendant !== 'All' && (r.busAttendant || '').toLowerCase() !== a) return false;
      if (filters.routeType !== 'All' && (r.routeType || '').toLowerCase() !== rt) return false;
      if (filters.messageType !== 'All' && (r.messageType || '').toLowerCase() !== mt) return false;
      if (filters.routeName !== 'All' && (r.route || '').toLowerCase() !== rn) return false;
      if (fromDate && (!r.dateObj || r.dateObj < fromDate)) return false;
      if (toDate && (!r.dateObj || r.dateObj > toDate)) return false;
      return true;
    });
  }, [raw, filters, fromDate, toDate]);

  const clearFilters = () =>
    setFilters({
      school: 'All',
      attendant: 'All',
      routeType: 'All',
      messageType: 'All',
      routeName: 'All',
      from: '',
      to: '',
    });

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4 mt-5">
          <h2 className="text-center font-weight-light my-4">
            <b>Student Attendance — Notification Log</b>
          </h2>

          {/* Filters (mobile-first) */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              <div className="row g-2">
                <div className="col-12 col-md-3">
                  <label className="form-label small mb-1">School</label>
                  <select
                    className="form-select form-select-sm"
                    value={filters.school}
                    onChange={(e) => setFilters(f => ({ ...f, school: e.target.value }))}
                  >
                    {schoolOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label small mb-1">Bus Attendant</label>
                  <select
                    className="form-select form-select-sm"
                    value={filters.attendant}
                    onChange={(e) => setFilters(f => ({ ...f, attendant: e.target.value }))}
                  >
                    {attendantOptions.map(o => (
                      <option key={o} value={o}>{o === 'All' ? 'All Bus Attendants' : o}</option>
                    ))}
                  </select>
                </div>

                <div className="col-6 col-md-2">
                  <label className="form-label small mb-1">Route Type</label>
                  <select
                    className="form-select form-select-sm"
                    value={filters.routeType}
                    onChange={(e) => setFilters(f => ({ ...f, routeType: e.target.value }))}
                  >
                    {routeTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div className="col-6 col-md-2">
                  <label className="form-label small mb-1">Message Type</label>
                  <select
                    className="form-select form-select-sm"
                    value={filters.messageType}
                    onChange={(e) => setFilters(f => ({ ...f, messageType: e.target.value }))}
                  >
                    {messageTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div className="col-12 col-md-2">
                  <label className="form-label small mb-1">Route Name</label>
                  <select
                    className="form-select form-select-sm"
                    value={filters.routeName}
                    onChange={(e) => setFilters(f => ({ ...f, routeName: e.target.value }))}
                  >
                    {routeNameOptions.map(o => (
                      <option key={o} value={o}>{o === 'All' ? 'All Routes' : o}</option>
                    ))}
                  </select>
                </div>

                <div className="col-6 col-md-2">
                  <label className="form-label small mb-1">From Date</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={filters.from}
                    onChange={(e) => setFilters(f => ({ ...f, from: e.target.value }))}
                  />
                </div>

                <div className="col-6 col-md-2">
                  <label className="form-label small mb-1">To Date</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={filters.to}
                    onChange={(e) => setFilters(f => ({ ...f, to: e.target.value }))}
                  />
                </div>

                <div className="col-12 d-flex justify-content-end">
                  <button className="btn btn-light btn-sm" onClick={clearFilters}>Clear</button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card-body">
            {loading ? (
              <div className="text-center my-5">Loading…</div>
            ) : filtered.length === 0 ? (
              <NoData />
            ) : (
              <div className="table-responsive">
                <table
                  id="datatablesSimple"
                  className="table table-sm align-middle"
                  style={{ tableLayout: 'auto' }}
                >
                  <thead className="card-header">
                    <tr>
                      <th>Sr. No</th>
                      <th>Student</th>
                      <th>Bus Attendant</th>
                      <th>School</th>
                      <th>Route</th>
                      <th>MessageURL</th>
                      <th>Route Type</th>
                      <th>Message Type</th>
                      <th>DateTime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, idx) => (
                      <tr key={r.id}>
                        <td>{idx + 1}</td>
                        <td>{r.student}</td>
                        <td>{r.busAttendant}</td>
                        <td>{r.school}</td>
                        <td>{r.route}</td>
                        <td style={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}>
                          {r.messageURL}
                        </td>
                        <td>{r.routeType}</td>
                        <td>{r.messageType}</td>
                        <td>{r.dateTimeStr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
