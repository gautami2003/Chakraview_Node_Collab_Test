'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getToken } from '@/utils/api';
import NoData from '@/components/NoData';

function parseDDMMYYYYHHMMSS(s) {
  if (!s) return null;
  const [d, t = '00:00:00'] = s.split(' ');
  const [dd, mm, yyyy] = (d || '').split('-').map(Number);
  const [HH = 0, MM = 0, SS = 0] = t.split(':').map(Number);
  const dt = new Date(yyyy || 0, (mm || 1) - 1, dd || 1, HH, MM, SS);
  return isNaN(dt.getTime()) ? null : dt;
}

function countValidMobiles(str) {
  if (!str) return 0;
  return str
    .split(',')
    .map(x => x.replace(/\D/g, '')) // keep digits only
    .filter(x => x.length === 10)   // count only exact 10-digit numbers
    .length;
}

export default function DistanceMessageReport() {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    school: 'All',
    attendant: 'All',
    routeType: 'All',   // Pickup/Drop
    routeName: 'All',
    from: '',           // YYYY-MM-DD
    to: '',             // YYYY-MM-DD
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = getToken();
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/distanceMessageReport`,
          { headers: { 'Content-Type': 'application/json', Authorization: `Basic ${token}` } }
        );
        if (!mounted) return;
        setRaw(res?.data?.data || []);
      } catch (e) {
        console.error('Error fetching distance messages:', e);
        if (mounted) setRaw([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Normalize rows for easy filtering
  const rows = useMemo(() => {
    return (raw || []).map((r, i) => {
      const school = r.School ?? '';
      const routeName = r.RouteName ?? '';
      const stoppage = r['Route (Stoppage)'] ?? '';
      const message = r.Message ?? '';
      const recipient = r['Message Recipient'] ?? r.MobileNumber ?? '';
      const distance = Number(r['Distance (meters)'] ?? r.Distance ?? 0) || 0;
      const msgDTStr = r['DateTime For Message'] ?? '';
      const txnDTStr = r['DateTime For TransactionID'] ?? '';
      const msgDate = parseDDMMYYYYHHMMSS(msgDTStr);
      const txnDate = parseDDMMYYYYHHMMSS(txnDTStr);
      const txnId = r.TransactionID ?? r.DriverRouteTransactionID ?? '';
      const driverName = r.DriverName ?? '';
      const routeType = (r.Type ?? '').toString(); // Pickup/Drop
      const mobileCount = countValidMobiles(recipient);

      return {
        _id: `${txnId}-${i}`,
        school,
        routeName,
        stoppage,
        message,
        recipient,
        distance,
        msgDTStr,
        txnDTStr,
        msgDate,
        txnDate,
        txnId,
        driverName,
        routeType,
        mobileCount,
        // lowercase helpers
        _school: (school || '').toLowerCase(),
        _attendant: (driverName || '').toLowerCase(),
        _routeType: (routeType || '').toLowerCase(),
        _routeName: (routeName || '').toLowerCase(),
      };
    });
  }, [raw]);

  // Distinct options
  const schoolOptions = useMemo(() => ['All', ...Array.from(new Set(rows.map(r => r.school).filter(Boolean))).sort()], [rows]);
  const attendantOptions = useMemo(() => ['All', ...Array.from(new Set(rows.map(r => r.driverName).filter(Boolean))).sort()], [rows]);
  const routeTypeOptions = useMemo(() => {
    const s = new Set(rows.map(r => r.routeType).filter(Boolean));
    return ['All', ...Array.from(s).sort()];
  }, [rows]);
  const routeNameOptions = useMemo(() => ['All', ...Array.from(new Set(rows.map(r => r.routeName).filter(Boolean))).sort()], [rows]);

  // Date boundaries
  const fromDate = filters.from ? new Date(filters.from + 'T00:00:00') : null;
  const toDate = filters.to ? new Date(filters.to + 'T23:59:59') : null;

  // Apply filters
  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (filters.school !== 'All' && r._school !== filters.school.toLowerCase()) return false;
      if (filters.attendant !== 'All' && r._attendant !== filters.attendant.toLowerCase()) return false;
      if (filters.routeType !== 'All' && r._routeType !== filters.routeType.toLowerCase()) return false;
      if (filters.routeName !== 'All' && r._routeName !== filters.routeName.toLowerCase()) return false;
      if (fromDate && (!r.msgDate || r.msgDate < fromDate)) return false;
      if (toDate && (!r.msgDate || r.msgDate > toDate)) return false;
      return true;
    });
  }, [rows, filters, fromDate, toDate]);

  const totalValidMobiles = useMemo(
    () => filtered.reduce((acc, r) => acc + (r.mobileCount || 0), 0),
    [filtered]
  );

  const clearFilters = () =>
    setFilters({ school: 'All', attendant: 'All', routeType: 'All', routeName: 'All', from: '', to: '' });

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4 mt-5">
          <h2 className="text-center font-weight-light my-4">
            <b>Distance Message Log</b>
          </h2>

          {/* Summary strip (mobile friendly) */}
          <div className="card border-0 shadow-sm mb-3">
              <div className="mt-2">Total valid mobile numbers: <b>{totalValidMobiles}</b></div>
          </div>

          {/* Filters */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              <div className="row g-2">
                <div className="col-12 col-md-3">
                  <label className="form-label small mb-1">School</label>
                  <select className="form-select form-select-sm"
                    value={filters.school}
                    onChange={(e) => setFilters(f => ({ ...f, school: e.target.value }))}>
                    {schoolOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label small mb-1">Bus Attendant</label>
                  <select className="form-select form-select-sm"
                    value={filters.attendant}
                    onChange={(e) => setFilters(f => ({ ...f, attendant: e.target.value }))}>
                    {attendantOptions.map(o => <option key={o} value={o}>{o === 'All' ? 'All Bus Attendants' : o}</option>)}
                  </select>
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label small mb-1">Route Type</label>
                  <select className="form-select form-select-sm"
                    value={filters.routeType}
                    onChange={(e) => setFilters(f => ({ ...f, routeType: e.target.value }))}>
                    {routeTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label small mb-1">Route Name</label>
                  <select className="form-select form-select-sm"
                    value={filters.routeName}
                    onChange={(e) => setFilters(f => ({ ...f, routeName: e.target.value }))}>
                    {routeNameOptions.map(o => <option key={o} value={o}>{o === 'All' ? 'All Routes' : o}</option>)}
                  </select>
                </div>
                <div className="col-6 col-md-1">
                  <label className="form-label small mb-1">From</label>
                  <input type="date" className="form-control form-control-sm"
                    value={filters.from}
                    onChange={(e) => setFilters(f => ({ ...f, from: e.target.value }))} />
                </div><br></br>
                <div className="col-6 col-md-1">
                  <label className="form-label small mb-1">To</label>
                  <input type="date" className="form-control form-control-sm"
                    value={filters.to}
                    onChange={(e) => setFilters(f => ({ ...f, to: e.target.value }))} />
                </div>
                <div className="col-12 col-md-12 d-flex justify-content-end">
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
                <table id="datatablesSimple" className="table table-sm align-middle">
                  <thead className="card-header">
                    <tr>
                      <th>Sr. No</th>
                      <th>School</th>
                      <th>Route Name</th>
                      <th>Stoppage</th>
                      <th>Message</th>
                      <th>Message Recipient</th>
                      <th>Valid Mobiles</th>
                      <th>Distance (meters)</th>
                      <th>DateTime For Message</th>
                      <th>DateTime For TransactionID</th>
                      <th>Transaction ID</th>
                      <th>Driver Name</th>
                      <th>Route Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, idx) => (
                      <tr key={r._id}>
                        <td>{idx + 1}</td>
                        <td>{r.school}</td>
                        <td>{r.routeName}</td>
                        <td>{r.stoppage}</td>
                       <td style={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}>{r.message}</td>
                        <td style={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}>{r.recipient}</td>

                        <td>{r.mobileCount}</td>
                        <td>{r.distance}</td>
                        <td>{r.msgDTStr}</td>
                        <td>{r.txnDTStr}</td>
                        <td>{r.txnId}</td>
                        <td>{r.driverName}</td>
                        <td>{r.routeType}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="fw-semibold">
                      <td colSpan={6} className="text-end">Total valid mobile numbers</td>
                      <td>{totalValidMobiles}</td>
                      <td colSpan={6}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
