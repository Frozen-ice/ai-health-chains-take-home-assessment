import React, { useState, useEffect } from 'react';
import './PatientList.css';
import { apiService } from '../services/apiService';

const PatientList = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // TODO: Implement the fetchPatients function
  // This function should:
  // 1. Call apiService.getPatients with appropriate parameters (page, limit, search)
  // 2. Update the patients state with the response data
  // 3. Update the pagination state
  // 4. Handle loading and error states
  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const limit = 10;
      const response = await apiService.getPatients(currentPage, limit, debouncedSearchTerm);
      
      // Update patients state with response data
      setPatients(response.patients || []);
      
      // Update pagination state
      setPagination(response.pagination || null);
    } catch (err) {
      setError(err.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

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
  }, [currentPage, debouncedSearchTerm]);

  // Handle search input changes
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="patient-list-container">
        <div className="loading">Loading patients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient-list-container">
        <div className="error">Error: {error}</div>
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
          <div className="placeholder">
            <p>No patients found</p>
          </div>
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
                  <span>{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="patient-wallet">
                {patient.walletAddress}
              </div>
            </div>
          ))
        )}
      </div>

      {/* TODO: Implement pagination controls */}
      {/* Show pagination buttons if pagination data is available */}
      {pagination && (
        <div className="pagination">
          {/* Your pagination implementation here */}
        </div>
      )}
    </div>
  );
};

export default PatientList;


