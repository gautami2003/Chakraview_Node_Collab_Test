'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getToken } from '@/utils/api';

function ddmmyyyy(d: Date) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}
function parseDDMMYYYYHHMMSS(s?: string) {
  if (!s) return null;
  const [d, t = '00:00:00'] = s.split(' ');
  const [dd, mm, yyyy] = (d || '').split('-').map(Number);
  const [HH = 0, MM = 0, SS = 0] = t.split(':').map(Number);
  const dt = new Date(yyyy || 0, (mm || 1) - 1, dd || 1, HH, MM, SS);
  return isNaN(dt.getTime()) ? null : dt;
}
function timeHHMM(dt: Date) {
  const hh = dt.getHours();
  const mm = String(dt.getMinutes()).padStart(2, '0');
  const ampm = hh >= 12 ? 'PM' : 'AM';
  const h12 = hh % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${mm}${ampm}`;
}

export default function StudentAttendanceSummary() {
  const [raw, setRaw] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // minimal filters
  const [filters, setFilters] = useState({
    school: 'All',
    attendant: 'All',
    attendanceType: 'All',
    from: '',
    to: '',
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = getToken();
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/studentAttendanceReport`,
          { headers: { 'Content-Type': 'application/json', Authorization: `Basic ${token}` } }
        );
        if (!mounted) return;
        setRaw(res?.data?.data ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // normalize
  const rows = useMemo(() => {
    return (raw || []).map((r, i) => {
      const school = r.schoolName ?? r.SchoolName ?? '';
      const routeName = r.routeName ?? r.RouteName ?? '';
      const routeType = (r.routeType ?? r.RouteType ?? '').toString().toLowerCase(); // pickup/drop
      const attendanceType = (r.attendanceType ?? r.AttendanceType ?? r.AttendanceAt ?? '').toString();
      const driverName = r.driverName ?? r.DriverName ?? r.Driver ?? '';
      const driverPhone = r.driverPhone ?? r.DriverPhone ?? r.Mobile ?? '';
      const attendant = r.attendantName ?? r.AttendantName ?? r.BusAttendant ?? r.Attendant ?? '';
      const studentId = r.studentID ?? r.StudentID ?? r.StudentId ?? r.studentId ?? `${i}-${routeName}`;
      const dateTimeStr = r.dateTime ?? r.DateTime ?? '';
      const dateObj = parseDDMMYYYYHHMMSS(dateTimeStr) ?? new Date(dateTimeStr || 0);

      // optional totals present in API rows (fallbacks later)
      const totalOnRoute = r.totalStudents ?? r.TotalStudents ?? r.TotalStudent ?? null;
      const isPresent = (r.isPresent ?? r.IsPresent ?? r.status ?? r.Status ?? 'Present').toString().toLowerCase() !== 'absent';

      return {
        school, routeName, routeType, attendanceType, driverName, driverPhone,
        attendant, studentId, dateTimeStr, dateObj,
        totalOnRoute, isPresent,
      };
    });
  }, [raw]);

  // options
  const schoolOptions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach(r => r.school && set.add(r.school));
    return ['All', ...Array.from(set).sort()];
  }, [rows]);

  const attendantOptions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach(r => r.attendant && set.add(r.attendant));
    return ['All', ...Array.from(set).sort()];
  }, [rows]);

  const attendanceTypeOptions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach(r => r.attendanceType && set.add(r.attendanceType));
    return ['All', ...Array.from(set).sort()];
  }, [rows]);

  const fromDate = filters.from ? new Date(filters.from) : null;
  const toDate = filters.to ? new Date(filters.to) : null;
  if (toDate) { toDate.setHours(23, 59, 59, 999); }

  // filter + only pickup
  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (r.routeType !== 'pickup') return false;
      if (filters.school !== 'All' && r.school !== filters.school) return false;
      if (filters.attendant !== 'All' && r.attendant !== filters.attendant) return false;
      if (filters.attendanceType !== 'All' && r.attendanceType !== filters.attendanceType) return false;
      if (fromDate && (!r.dateObj || r.dateObj < fromDate)) return false;
      if (toDate && (!r.dateObj || r.dateObj > toDate)) return false;
      return true;
    });
  }, [rows, filters, fromDate, toDate]);

  // group by Driver + Route (one row per route slot)
  const groups = useMemo(() => {
    const map = new Map<string, any>();
    for (const r of filtered) {
      const key = `${r.driverName}|${r.driverPhone}|${r.routeName}`;
      if (!map.has(key)) {
        map.set(key, {
          driverName: r.driverName || '-',
          driverPhone: r.driverPhone || '',
          routeName: r.routeName || '-',
          firstScan: r.dateObj || null,
          totalStudentsHint: r.totalOnRoute, // may be null
          studentsSeen: new Set<string>(),
          presentCount: 0,
        });
      }
      const g = map.get(key);
      if (r.dateObj && (!g.firstScan || r.dateObj < g.firstScan)) g.firstScan = r.dateObj;
      if (r.studentId) g.studentsSeen.add(String(r.studentId));
      if (r.isPresent) g.presentCount += 1;
      // keep largest total if API provides it
      if (typeof r.totalOnRoute === 'number') {
        g.totalStudentsHint = Math.max(g.totalStudentsHint ?? 0, r.totalOnRoute);
      }
    }
    // finalize list
    const list = Array.from(map.values()).map((g, i) => {
      const totalStudents = (typeof g.totalStudentsHint === 'number' && g.totalStudentsHint > 0)
        ? g.totalStudentsHint
        : g.studentsSeen.size; // fallback when roster size not provided
      const present = g.presentCount || g.studentsSeen.size;
      const absent = Math.max(0, totalStudents - present);
      const timeStr = g.firstScan ? `${timeHHMM(g.firstScan)}-${timeHHMM(new Date(g.firstScan.getTime() + 50*60*1000))}` : '-';
      const dateStr = g.firstScan ? `${ddmmyyyy(g.firstScan)} ${timeHHMM(g.firstScan)}` : '-';
      return {
        sr: i + 1,
        driverLabel: g.driverName || '-',
        driverPhone: g.driverPhone || '',
        routeName: g.routeName || '-',
        timeSlot: timeStr,
        dateTime: dateStr,
        totalStudents,
        present,
        absent,
      };
    });
    // sort by time
    list.sort((a, b) => a.dateTime.localeCompare(b.dateTime));
    return list;
  }, [filtered]);

  const totals = useMemo(() => {
    return groups.reduce((acc, g) => {
      acc.total += g.totalStudents;
      acc.present += g.present;
      acc.absent += g.absent;
      return acc;
    }, { total: 0, present: 0, absent: 0 });
  }, [groups]);

  const selectedSchool = filters.school === 'All' ? 'All Schools' : filters.school;
  const selectedAtt = filters.attendant === 'All' ? 'All Bus Attendants' : filters.attendant;
  const selectedType = filters.attendanceType === 'All' ? 'All' : filters.attendanceType;

  return (
    <div className="container py-3">
      <h4 className="text-center fw-bold mb-3">Summary Report Of Student Attendance</h4>

      {/* Summary header (mobile-friendly) */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body small">
          <div className="row g-2">
            <div className="col-6 col-md-3">
              <div className="text-muted">School</div>
              <div className="fw-semibold">{selectedSchool}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted">Bus Attendant</div>
              <div className="fw-semibold">{selectedAtt}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted">Attendance Type</div>
              <div className="fw-semibold">{selectedType}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted">From Date</div>
              <div className="fw-semibold">{filters.from ? ddmmyyyy(new Date(filters.from)) : '-'}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted">To Date</div>
              <div className="fw-semibold">{filters.to ? ddmmyyyy(new Date(filters.to)) : '-'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal filters */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-12 col-md-3">
              <label className="form-label small mb-1">School</label>
              <select className="form-select form-select-sm"
                value={filters.school}
                onChange={e => setFilters(f => ({ ...f, school: e.target.value }))}>
                {schoolOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label small mb-1">Bus Attendant</label>
              <select className="form-select form-select-sm"
                value={filters.attendant}
                onChange={e => setFilters(f => ({ ...f, attendant: e.target.value }))}>
                {attendantOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label small mb-1">Attendance Type</label>
              <select className="form-select form-select-sm"
                value={filters.attendanceType}
                onChange={e => setFilters(f => ({ ...f, attendanceType: e.target.value }))}>
                {attendanceTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-1">
              <label className="form-label small mb-1">From</label>
              <input type="date" className="form-control form-control-sm"
                value={filters.from}
                onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} />
            </div>
            <div className="col-6 col-md-1">
              <label className="form-label small mb-1">To</label>
              <input type="date" className="form-control form-control-sm"
                value={filters.to}
                onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} />
            </div>
            <div className="col-12 col-md-1 d-flex align-items-end">
              <button
                className="btn btn-light btn-sm w-100"
                onClick={() => setFilters({ school: 'All', attendant: 'All', attendanceType: 'All', from: '', to: '' })}
              >Clear</button>
            </div>
          </div>
        </div>
      </div>

      {/* Pickup summary table */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Sr. No.</th>
                <th>Driver Name</th>
                <th>Route Name</th>
                <th>Time</th>
                <th>Date</th>
                <th className="text-end">Total Student</th>
                <th className="text-end">Total Present</th>
                <th className="text-end">Total Absent</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-4">Loading…</td></tr>
              ) : groups.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-4">No data</td></tr>
              ) : (
                groups.map(g => (
                  <tr key={`${g.sr}-${g.routeName}`}>
                    <td>{g.sr}</td>
                    <td>
                      <div className="d-flex flex-column">
                        <span>{g.driverLabel}</span>
                        {g.driverPhone ? <small className="text-muted">{g.driverPhone}</small> : null}
                      </div>
                    </td>
                    <td>{g.routeName}</td>
                    <td>{g.timeSlot}</td>
                    <td>{g.dateTime}</td>
                    <td className="text-end">{g.totalStudents}</td>
                    <td className="text-end">{g.present}</td>
                    <td className="text-end">{g.absent}</td>
                  </tr>
                ))
              )}
            </tbody>
            {/* grand total */}
            {!loading && groups.length > 0 && (
              <tfoot>
                <tr className="fw-semibold">
                  <td colSpan={5} className="text-end">All Student Total</td>
                  <td className="text-end">{totals.total}</td>
                  <td className="text-end">{totals.present}</td>
                  <td className="text-end">{totals.absent}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* tiny helper note */}
      <div className="text-muted small mt-2">
        Note: If the API provides per-route roster size (e.g. <code>TotalStudents</code>), it’s used. Otherwise totals fall back to unique students scanned on that route.
      </div>
    </div>
  );
}
