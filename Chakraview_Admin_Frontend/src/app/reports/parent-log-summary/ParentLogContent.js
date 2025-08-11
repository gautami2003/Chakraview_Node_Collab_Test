'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getToken } from '@/utils/api';
import NoData from '@/components/NoData';

function formatYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function formatDMY(d) {
  const day = String(d.getDate()).padStart(2, '0');
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const y = d.getFullYear();
  return `${day}-${m}-${y}`;
}
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function osKey(os = '') {
  const s = String(os).toLowerCase();
  if (s.includes('android')) return 'android';
  if (s.includes('ios') || s.includes('iphone') || s.includes('ipad')) return 'ios';
  return null; // unknown / other
}
function parseDurationToMinutes(v) {
  if (!v) return 0;
  if (typeof v === 'number' && Number.isFinite(v)) return Math.max(0, Math.round(v));
  const s = String(v).trim();

  // "HH:MM:SS" or "MM:SS"
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(s)) {
    const parts = s.split(':').map(n => parseInt(n, 10));
    if (parts.length === 3) {
      return Math.max(0, Math.round(parts[0] * 60 + parts[1] + parts[2] / 60));
    }
    if (parts.length === 2) {
      return Math.max(0, Math.round(parts[0] + parts[1] / 60));
    }
  }

  // "123 mins" / "123 min" / "123 minutes"
  const m = s.match(/(\d+)\s*(min|mins|minute|minutes)\b/i);
  if (m) return Math.max(0, parseInt(m[1], 10));

  // plain number in string
  if (/^\d+$/.test(s)) return Math.max(0, parseInt(s, 10));

  return 0;
}
function minutesToLabel(mins) {
  const m = Math.max(0, Math.round(mins || 0));
  return `${m} mins`;
}
function getBestDate(log) {
  // prefer loginDateTime; else mapDateTime; else logoutDateTime
  const cand = log?.loginDateTime || log?.mapDateTime || log?.logoutDateTime;
  if (!cand) return null;
  const d = new Date(cand);
  return Number.isNaN(d.getTime()) ? null : d;
}
function durationFromLog(log) {
  const a = log?.loginDateTime ? new Date(log.loginDateTime) : null;
  const b = log?.logoutDateTime ? new Date(log.logoutDateTime) : null;

  if (a && b && !Number.isNaN(a.getTime()) && !Number.isNaN(b.getTime()) && b >= a) {
    const diffMs = b.getTime() - a.getTime();
    return Math.max(0, Math.round(diffMs / 60000));
  }
  // fallback to provided totalDuration if parseable
  return parseDurationToMinutes(log?.totalDuration);
}
function tripType(routeName = '') {
  const r = String(routeName).toLowerCase();
  if (r.includes('pickup') || r.includes('pick up')) return 'Pickup';
  if (r.includes('drop')) return 'Drop';
  return null; // counted in Total only
}

export default function ParentLogSummary() {
  // raw data
  const [allLogs, setAllLogs] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Date filters (center)
  const today = useMemo(() => new Date(), []);
  const [tempFrom, setTempFrom] = useState(formatYMD(today));
  const [tempTo, setTempTo] = useState(formatYMD(today));
  const [from, setFrom] = useState(formatYMD(today));
  const [to, setTo] = useState(formatYMD(today));

  // NEW: School filter
  const [selectedSchool, setSelectedSchool] = useState('All');
  const schoolOptions = useMemo(() => {
    const set = new Set();
    for (const log of allLogs) set.add(log?.schoolName || 'Unknown School');
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [allLogs]);

  // Fetch once
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = getToken();
        if (!token) throw new Error('No token found');

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/parentLogMaster`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res?.data?.data;
        const logs = (data?.result || data || []) ?? [];
        setAllLogs(Array.isArray(logs) ? logs : []);
      } catch (e) {
        console.error('Error fetching parent log:', e?.response?.data || e?.message || e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Apply date + school filter
  const dateFiltered = useMemo(() => {
    if (!allLogs.length) return [];
    let f = new Date(from);
    let t = new Date(to);
    if (Number.isNaN(f.getTime()) || Number.isNaN(t.getTime())) return [];

    // auto-swap if range is inverted
    if (f > t) [f, t] = [t, f];

    const fStart = startOfDay(f);
    const tEnd = endOfDay(t);

    return allLogs.filter(log => {
      const d = getBestDate(log);
      if (!(d && d >= fStart && d <= tEnd)) return false;
      const school = log?.schoolName || 'Unknown School';
      if (selectedSchool !== 'All' && school !== selectedSchool) return false;
      return true;
    });
  }, [allLogs, from, to, selectedSchool]);

  // Build summary: per School + Date (local), each with rows: Total, Pickup, Drop
  const blocks = useMemo(() => {
    // groups: { [school]: { [dateKey]: { Total:{}, Pickup:{}, Drop:{} } } }
    const groups = {};

    for (const log of dateFiltered) {
      const d = getBestDate(log);
      if (!d) continue;

      const school = log?.schoolName || 'Unknown School';
      const dk = formatDMY(d); // display key dd-mm-yyyy
      const os = osKey(log?.os);
      if (!os) continue; // ignore unknown OS to keep totals = android + ios

      const mins = durationFromLog(log);
      const tt = tripType(log?.routeName); // 'Pickup' | 'Drop' | null

      groups[school] = groups[school] || {};
      groups[school][dk] = groups[school][dk] || {
        Total: { androidLogs: 0, iosLogs: 0, androidMins: 0, iosMins: 0 },
        Pickup: { androidLogs: 0, iosLogs: 0, androidMins: 0, iosMins: 0 },
        Drop: { androidLogs: 0, iosLogs: 0, androidMins: 0, iosMins: 0 },
      };

      // increment for Total
      const tgtTotal = groups[school][dk].Total;
      if (os === 'android') {
        tgtTotal.androidLogs += 1;
        tgtTotal.androidMins += mins;
      } else if (os === 'ios') {
        tgtTotal.iosLogs += 1;
        tgtTotal.iosMins += mins;
      }

      // increment for Pickup/Drop if applicable
      if (tt === 'Pickup' || tt === 'Drop') {
        const tgt = groups[school][dk][tt];
        if (os === 'android') {
          tgt.androidLogs += 1;
          tgt.androidMins += mins;
        } else if (os === 'ios') {
          tgt.iosLogs += 1;
          tgt.iosMins += mins;
        }
      }
    }

    // turn into an ordered array of blocks
    const out = [];
    const schoolNames = Object.keys(groups).sort((a, b) => a.localeCompare(b));
    for (const school of schoolNames) {
      const dateKeys = Object.keys(groups[school]).sort((a, b) => {
        // sort by real date asc (parse dd-mm-yyyy)
        const [da, ma, ya] = a.split('-').map(Number);
        const [db, mb, yb] = b.split('-').map(Number);
        return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
      });
      for (const dk of dateKeys) {
        out.push({
          school,
          dateKey: dk,
          rows: ['Total', 'Pickup', 'Drop'].map(type => {
            const g = groups[school][dk][type];
            const androidLogs = g.androidLogs;
            const iosLogs = g.iosLogs;
            const totalLogs = androidLogs + iosLogs;
            const androidMins = g.androidMins;
            const iosMins = g.iosMins;
            const totalMins = androidMins + iosMins;
            return {
              type,
              androidLogs,
              iosLogs,
              totalLogs,
              androidMins,
              iosMins,
              totalMins,
            };
          }),
        });
      }
    }
    return out;
  }, [dateFiltered]);

  // Grand totals
  const grand = useMemo(() => {
    const init = () => ({ androidLogs: 0, iosLogs: 0, androidMins: 0, iosMins: 0 });
    const acc = { Total: init(), Pickup: init(), Drop: init() };

    for (const block of blocks) {
      for (const r of block.rows) {
        acc[r.type].androidLogs += r.androidLogs;
        acc[r.type].iosLogs += r.iosLogs;
        acc[r.type].androidMins += r.androidMins;
        acc[r.type].iosMins += r.iosMins;
      }
    }

    const shape = type => {
      const g = acc[type];
      const totalLogs = g.androidLogs + g.iosLogs;
      const totalMins = g.androidMins + g.iosMins;
      return {
        type,
        androidLogs: g.androidLogs,
        iosLogs: g.iosLogs,
        totalLogs,
        androidMins: g.androidMins,
        iosMins: g.iosMins,
        totalMins,
      };
    };

    return [shape('Total'), shape('Pickup'), shape('Drop')];
  }, [blocks]);

  const totalLogsInRange = useMemo(() => {
    return blocks.reduce((sum, b) => sum + b.rows[0].totalLogs, 0); // rows[0] is 'Total'
  }, [blocks]);

  const handleGo = () => {
    // apply temp -> actual; also autoswap if needed handled by memo
    setFrom(tempFrom);
    setTo(tempTo);
  };

  const fromLabel = useMemo(() => {
    const d = new Date(from);
    return Number.isNaN(d.getTime()) ? '-' : formatDMY(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from]);
  const toLabel = useMemo(() => {
    const d = new Date(to);
    return Number.isNaN(d.getTime()) ? '-' : formatDMY(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4 mt-5">
          <h2 className="text-center font-weight-light my-4">
            <b>Parent Log - Summary</b>
          </h2>

          {/* TOP: left counter, centered date+school filters with Go */}
          <div className="row align-items-stretch g-3 mb-4"> {/* changed to stretch for equal height */}
            {/* Counter (left) */}
            <div className="col-12 col-xl-3 d-flex"> {/* d-flex to allow .h-100 card fill */}
              <div className="card h-100 w-100"> {/* ensure full height/width */}
                <div className="card-body text-center d-flex flex-column justify-content-center">
                  <div className="text-muted small">Logs in Range</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                    {loading ? '—' : totalLogsInRange}
                  </div>
                  <div className="text-muted small mt-2">
                    From {fromLabel} To {toLabel}
                  </div>
                  {/* Show active school filter */}
                  <div className="text-muted small mt-1">
                    School: {selectedSchool === 'All' ? 'All Schools' : selectedSchool}
                  </div>
                </div>
              </div>
            </div>

            {/* Filters (center) */}
            <div className="col-12 col-xl-6 d-flex">
              <div className="card h-100 w-100">
                <div className="card-body d-flex flex-column">
                  {/* Inputs */}
                  <div className="d-flex flex-wrap justify-content-center gap-3">
                    <div className="d-flex flex-column">
                      <label className="form-label mb-1">From Date</label>
                      <input
                        type="date"
                        className="form-control"
                        style={{ minWidth: 180 }}
                        value={tempFrom}
                        onChange={(e) => setTempFrom(e.target.value)}
                      />
                    </div>
                    <div className="d-flex flex-column">
                      <label className="form-label mb-1">To Date</label>
                      <input
                        type="date"
                        className="form-control"
                        style={{ minWidth: 180 }}
                        value={tempTo}
                        onChange={(e) => setTempTo(e.target.value)}
                      />
                    </div>
                    <div className="d-flex flex-column">
                      <label className="form-label mb-1">School</label>
                      <select
                        className="form-select"
                        style={{ minWidth: 220 }}
                        value={selectedSchool}
                        onChange={(e) => setSelectedSchool(e.target.value)}
                      >
                        {schoolOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt === 'All' ? 'All Schools' : opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Go button below filters */}
                  <div className="mt-3 text-center">
                    <button className="btn btn-primary px-4" onClick={handleGo}>
                      Go
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* spacer to keep center alignment */}
            <div className="col-12 col-xl-3 d-flex" />
          </div>

          {/* CONTENT */}
          {loading ? (
            <div className="text-center py-5">Loading…</div>
          ) : error ? (
            <div className="alert alert-danger">Failed to load logs.</div>
          ) : blocks.length === 0 ? (
            <NoData />
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead className="card-header">
                  <tr>
                    <th>Sr. No.</th>
                    <th>School</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Android Logs</th>
                    <th>iOS Logs</th>
                    <th>Total Logs</th>
                    <th>Android Duration</th>
                    <th>iOS Duration</th>
                    <th>Total Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((b, idx) => {
                    const [totalRow, pickupRow, dropRow] = b.rows;
                    return (
                      <React.Fragment key={`${b.school}-${b.dateKey}-${idx}`}>
                        {/* Row 1: Total (with rowSpan) */}
                        <tr>
                          <td rowSpan={3}>{idx + 1}</td>
                          <td rowSpan={3}>{b.school}</td>
                          <td rowSpan={3}>{b.dateKey}</td>
                          <td><b>Total</b></td>
                          <td>{totalRow.androidLogs}</td>
                          <td>{totalRow.iosLogs}</td>
                          <td>{totalRow.totalLogs}</td>
                          <td>{minutesToLabel(totalRow.androidMins)}</td>
                          <td>{minutesToLabel(totalRow.iosMins)}</td>
                          <td>{minutesToLabel(totalRow.totalMins)}</td>
                        </tr>
                        {/* Row 2: Pickup */}
                        <tr>
                          <td>Pickup</td>
                          <td>{pickupRow.androidLogs}</td>
                          <td>{pickupRow.iosLogs}</td>
                          <td>{pickupRow.totalLogs}</td>
                          <td>{minutesToLabel(pickupRow.androidMins)}</td>
                          <td>{minutesToLabel(pickupRow.iosMins)}</td>
                          <td>{minutesToLabel(pickupRow.totalMins)}</td>
                        </tr>
                        {/* Row 3: Drop */}
                        <tr>
                          <td>Drop</td>
                          <td>{dropRow.androidLogs}</td>
                          <td>{dropRow.iosLogs}</td>
                          <td>{dropRow.totalLogs}</td>
                          <td>{minutesToLabel(dropRow.androidMins)}</td>
                          <td>{minutesToLabel(dropRow.iosMins)}</td>
                          <td>{minutesToLabel(dropRow.totalMins)}</td>
                        </tr>
                      </React.Fragment>
                    );
                  })}

                  {/* Grand Total block */}
                  <tr>
                    <td rowSpan={3}><b>—</b></td>
                    <td rowSpan={3}><b>Grand Total</b></td>
                    <td rowSpan={3}><b>—</b></td>
                    <td><b>Total</b></td>
                    <td>{grand[0].androidLogs}</td>
                    <td>{grand[0].iosLogs}</td>
                    <td>{grand[0].totalLogs}</td>
                    <td>{minutesToLabel(grand[0].androidMins)}</td>
                    <td>{minutesToLabel(grand[0].iosMins)}</td>
                    <td>{minutesToLabel(grand[0].totalMins)}</td>
                  </tr>
                  <tr>
                    <td>Pickup</td>
                    <td>{grand[1].androidLogs}</td>
                    <td>{grand[1].iosLogs}</td>
                    <td>{grand[1].totalLogs}</td>
                    <td>{minutesToLabel(grand[1].androidMins)}</td>
                    <td>{minutesToLabel(grand[1].iosMins)}</td>
                    <td>{minutesToLabel(grand[1].totalMins)}</td>
                  </tr>
                  <tr>
                    <td>Drop</td>
                    <td>{grand[2].androidLogs}</td>
                    <td>{grand[2].iosLogs}</td>
                    <td>{grand[2].totalLogs}</td>
                    <td>{minutesToLabel(grand[2].androidMins)}</td>
                    <td>{minutesToLabel(grand[2].iosMins)}</td>
                    <td>{minutesToLabel(grand[2].totalMins)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
