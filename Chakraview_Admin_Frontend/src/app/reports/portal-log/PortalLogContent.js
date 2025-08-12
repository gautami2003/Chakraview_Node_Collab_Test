'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getToken } from '@/utils/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/Pagination';
import NoData from '@/components/NoData';

const getUniqueValues = (data, key) =>
  [...new Set(data.map(item => item?.[key]).filter(Boolean))];

function PortalLogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const limit = 50;
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const page = Number.isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;

  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tempFilters, setTempFilters] = useState({
    schoolName: '',
    startDate: '',
    endDate: '',
  });

  const [filters, setFilters] = useState({
    schoolName: '',
    startDate: '',
    endDate: '',
  });

  const schoolOptions = useMemo(() => getUniqueValues(allLogs, 'schoolName'), [allLogs]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getToken();
        if (!token) throw new Error('No token found');

        const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/portalLog`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = result?.data?.data;
        const logs = Array.isArray(responseData) ? responseData : [];

        // Data already mapped server side, just use as-is
        setAllLogs(logs);
      } catch (err) {
        console.error('Error fetching portal logs:', err?.response?.data || err?.message || err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return allLogs.filter(log => {
      const matchesSchool = filters.schoolName
        ? log.schoolName.toLowerCase() === filters.schoolName.toLowerCase()
        : true;

      let matchesDate = true;
      const logDate = log.dateTime ? new Date(log.dateTime) : null;

      if (filters.startDate && logDate) {
        const startDate = new Date(filters.startDate);
        matchesDate = matchesDate && logDate >= startDate;
      }

      if (filters.endDate && logDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && logDate <= endDate;
      }

      return matchesSchool && matchesDate;
    });
  }, [allLogs, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / limit));
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

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
    setFilters({ ...tempFilters });
    router.push('?page=1');
  };

  const handleReset = () => {
    setTempFilters({ schoolName: '', startDate: '', endDate: '' });
    setFilters({ schoolName: '', startDate: '', endDate: '' });
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
            <b>Portal Log</b>
          </h2>

          <div className="row align-items-end g-3 mb-4">
            {/* Counter */}
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

            {/* Filters */}
            <div className="col-12 col-xl-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {/* School Name */}
                    <select
                      className="form-select"
                      style={{ minWidth: 180 }}
                      value={tempFilters.schoolName}
                      onChange={e => setTempFilters({ ...tempFilters, schoolName: e.target.value })}
                    >
                      <option value="">All Schools</option>
                      {schoolOptions.map((name, i) => (
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
                      onChange={e => setTempFilters({ ...tempFilters, startDate: e.target.value })}
                    />

                    {/* End Date */}
                    <input
                      type="date"
                      className="form-control"
                      style={{ minWidth: 150 }}
                      value={tempFilters.endDate}
                      onChange={e => setTempFilters({ ...tempFilters, endDate: e.target.value })}
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

            {/* Spacer */}
            <div className="col-12 col-xl-3" />
          </div>

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
  className="table table-striped table-bordered mb-0"
  style={{ tableLayout: 'fixed', width: '100%' }}
>
  <thead className="card-header">
    <tr>
      <th style={{ width: '5%' }}>Sr. No</th>
      <th style={{ width: '20%' }}>School Name</th>
      <th style={{ width: '15%', wordBreak: 'break-word' }}>Mobile Number</th>
      <th style={{ width: '40%', wordBreak: 'break-word' }}>Message</th>
      <th style={{ width: '20%' }}>Date Time</th>
    </tr>
  </thead>
  <tbody>
    {currentLogs.map((row, index) => (
      <tr key={`${row.portalMessageLogID}-${index}`}>
        <td>{(page - 1) * limit + index + 1}</td>
        <td>{row.schoolName}</td>
        <td
          style={{
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            overflowWrap: 'break-word',
          }}
        >
          {row.mobileNumber}
        </td>
        <td
          style={{
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            overflowWrap: 'break-word',
          }}
        >
          {row.message}
        </td>
        <td>{fmtDateTime(row.dateTime)}</td>
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

export default PortalLogContent;
