'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getToken } from '@/utils/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/Pagination';
import NoData from '@/components/NoData';

const getUniqueValues = (data, key) =>
  [...new Set(data.map(item => item?.[key]).filter(Boolean))];

function ParentLogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const limit = 50;
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const page = Number.isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;

  // Data
  const [allLogs, setAllLogs] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters (temp = form values, filters = applied)
  const [tempFilters, setTempFilters] = useState({
    schoolName: '',
    routeName: '',
    startDate: '',
    endDate: '',
  });

  const [filters, setFilters] = useState({
    schoolName: '',
    routeName: '',
    startDate: '',
    endDate: '',
  });

  // Derived options
  const schoolOptions = useMemo(
    () => getUniqueValues(allLogs, 'schoolName'),
    [allLogs]
  );
  const routeOptions = useMemo(
    () => getUniqueValues(allLogs, 'routeName'),
    [allLogs]
  );

  // Route options filtered by selected school (for the form)
  const filteredRouteOptions = useMemo(() => {
    if (!tempFilters.schoolName) return routeOptions;
    const routesForSchool = allLogs
      .filter(l => l.schoolName === tempFilters.schoolName)
      .map(l => l.routeName)
      .filter(Boolean);
    return [...new Set(routesForSchool)];
  }, [allLogs, routeOptions, tempFilters.schoolName]);

  // When school changes in the form, clear the route selection (only then)
  useEffect(() => {
    setTempFilters(prev => ({ ...prev, routeName: '' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempFilters.schoolName]);

  // Fetch once
  useEffect(() => {
    const fetchAllLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getToken();
        if (!token) throw new Error('No token found');

        const result = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/parentLogMaster`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseData = result?.data?.data;
        const logs = (responseData?.result || responseData || []) ?? [];
        setAllLogs(Array.isArray(logs) ? logs : []);
      } catch (err) {
        console.error(
          'Error fetching parent log:',
          err?.response?.data || err?.message || err
        );
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllLogs();
  }, []);

  // Apply filters (derived list)
  const filteredLogs = useMemo(() => {
    if (!allLogs.length) return [];
    return allLogs.filter(log => {
      const matchesSchool = filters.schoolName
        ? (log.schoolName || '').toLowerCase() === filters.schoolName.toLowerCase()
        : true;

      const matchesRoute = filters.routeName
        ? (log.routeName || '').toLowerCase() === filters.routeName.toLowerCase()
        : true;

      let matchesDate = true;
      const logDate = log.loginDateTime ? new Date(log.loginDateTime) : null;

      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        if (logDate) matchesDate = matchesDate && logDate >= startDate;
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (logDate) matchesDate = matchesDate && logDate <= endDate;
      }

      return matchesSchool && matchesRoute && matchesDate;
    });
  }, [allLogs, filters]);

  // Pagination derived from filtered logs
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / limit));
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  // If current URL page is out of range (e.g., after applying filters), clamp it.
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

  const handleSearch = () => {
    const nextRoute =
      filters.schoolName !== tempFilters.schoolName ? '' : tempFilters.routeName;

    setFilters({
      ...tempFilters,
      routeName: nextRoute,
    });

    router.push('?page=1');
  };

  const handleReset = () => {
    setTempFilters({
      schoolName: '',
      routeName: '',
      startDate: '',
      endDate: '',
    });
    setFilters({
      schoolName: '',
      routeName: '',
      startDate: '',
      endDate: '',
    });
    router.push('?page=1');
  };

  const fmtDateTime = v => (v ? new Date(v).toLocaleString() : '-');
  const showingFrom = filteredLogs.length ? startIndex + 1 : 0;
  const showingTo = Math.min(endIndex, filteredLogs.length);

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4 mt-5">
          <h2 className="text-center font-weight-light my-4">
            <b>Parent Log</b>
          </h2>

          {/* TOP BAR: left counter, centered filters */}
          <div className="row align-items-end g-3 mb-4">
            {/* Counter (left) */}
            <div className="col-12 col-xl-3">
              <div className="card h-100">
                <div className="card-body text-center">
                  <div className="text-muted small">Filtered Records</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                    {filteredLogs.length}
                  </div>
                  <div className="text-muted small">Total: {allLogs.length}</div>
                </div>
              </div>
            </div>

            {/* Filters (center) */}
            <div className="col-12 col-xl-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {/* School */}
                    <select
                      className="form-select"
                      style={{ minWidth: 180 }}
                      value={tempFilters.schoolName}
                      onChange={e =>
                        setTempFilters({ ...tempFilters, schoolName: e.target.value })
                      }
                    >
                      <option value="">All Schools</option>
                      {schoolOptions.map((name, i) => (
                        <option key={`${name}-${i}`} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>

                    {/* Route */}
                    <select
                      className="form-select"
                      style={{ minWidth: 160 }}
                      value={tempFilters.routeName}
                      onChange={e =>
                        setTempFilters({ ...tempFilters, routeName: e.target.value })
                      }
                      disabled={!filteredRouteOptions.length}
                    >
                      <option value="">All Routes</option>
                      {filteredRouteOptions.map((name, i) => (
                        <option key={`${name}-${i}`} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>

                    {/* Start Date */}
                    <input
                      type="date"
                      className="form-control"
                      style={{ minWidth: 150 }}
                      value={tempFilters.startDate}
                      onChange={e =>
                        setTempFilters({ ...tempFilters, startDate: e.target.value })
                      }
                      placeholder="Start Date"
                    />

                    {/* End Date */}
                    <input
                      type="date"
                      className="form-control"
                      style={{ minWidth: 150 }}
                      value={tempFilters.endDate}
                      onChange={e =>
                        setTempFilters({ ...tempFilters, endDate: e.target.value })
                      }
                      placeholder="End Date"
                    />

                    {/* Actions */}
                    <button className="btn btn-primary" onClick={handleSearch}>
                      Apply
                    </button>
                    <button className="btn btn-outline-secondary" onClick={handleReset}>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacer/right column (kept empty to help centering) */}
            <div className="col-12 col-xl-3" />
          </div>

          {/* CONTENT */}
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">Loading…</div>
            ) : error ? (
              <div className="alert alert-danger m-3">Failed to load logs.</div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center px-3 mb-2">
                  <div className="text-muted small">
                    Showing {showingFrom}–{showingTo} of {filteredLogs.length}
                  </div>
                </div>

                {currentLogs.length === 0 ? (
                  <div className="p-3">
                    <NoData />
                  </div>
                ) : (
                  <>
                    <table
                      id="datatablesSimple"
                      className="table table-striped table-bordered mb-0"
                    >
                      <thead className="card-header">
                        <tr>
                          <th>Sr. No</th>
                          <th>Student Name</th>
                          <th>School</th>
                          <th>Route Name</th>
                          <th>Operating System</th>
                          <th>Login Date Time</th>
                          <th>Map Date Time</th>
                          <th>Logout Date Time</th>
                          <th>Total Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentLogs.map((row, index) => (
                          <tr
                            key={
                              row._id ??
                              `${row.studentName}-${row.loginDateTime}-${index}`
                            }
                          >
                            <td>{(page - 1) * limit + index + 1}</td>
                            <td>{row.studentName || '-'}</td>
                            <td>{row.schoolName || '-'}</td>
                            <td>{row.routeName || '-'}</td>
                            <td>{row.os || '-'}</td>
                            <td>{fmtDateTime(row.loginDateTime)}</td>
                            <td>{fmtDateTime(row.mapDateTime)}</td>
                            <td>{fmtDateTime(row.logoutDateTime)}</td>
                            <td>{row.totalDuration || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="p-3">
                      <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ParentLogContent;
