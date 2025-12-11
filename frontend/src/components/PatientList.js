import React, { useState, useEffect, useCallback } from 'react';
import './PatientList.css';
import { apiService } from '../services/apiService';
import { formatDate } from '../utils/formatters';
import Loading from './common/Loading';
import Error from './common/Error';
import EmptyState from './common/EmptyState';

const PatientList = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const limit = 10;
      const response = await apiService.getPatients(currentPage, limit, debouncedSearchTerm);
      
      setPatients(response.patients || []);
      setPagination(response.pagination || null);
    } catch (err) {
      setError(err.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, pagination]);

  if (loading) {
    return (
      <div className="patient-list-container">
        <Loading message="Loading patients..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient-list-container">
        <Error message={error} onRetry={fetchPatients} />
      </div>
    );
  }

  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <h2>Patients</h2>
        <input
          type="text"
          placeholder="Search patients..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="patient-list">
        {patients.length === 0 ? (
          <EmptyState message="No patients found" />
        ) : (
          patients.map((patient) => (
            <div
              key={patient.id}
              className="patient-card"
              onClick={() => onSelectPatient(patient.id)}
            >
              <div className="patient-card-header">
                <div>
                  <div className="patient-name">{patient.name}</div>
                  <div className="patient-id">{patient.patientId}</div>
                </div>
              </div>
              <div className="patient-info">
                <div className="patient-info-item">
                  <span>📧</span>
                  <span>{patient.email}</span>
                </div>
                <div className="patient-info-item">
                  <span>📞</span>
                  <span>{patient.phone}</span>
                </div>
                <div className="patient-info-item">
                  <span>👤</span>
                  <span>{patient.gender}</span>
                </div>
                <div className="patient-info-item">
                  <span>🎂</span>
                  <span>{formatDate(patient.dateOfBirth)}</span>
                </div>
              </div>
              <div className="patient-wallet">
                {patient.walletAddress}
              </div>
            </div>
          ))
        )}
      </div>

      {pagination && (
        <div className="pagination">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="pagination-info">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientList;


