import React, { useState, useEffect, useCallback } from 'react';
import './PatientDetail.css';
import { apiService } from '../services/apiService';
import { formatDate, getRecordTypeClass } from '../utils/formatters';
import Loading from './common/Loading';
import Error from './common/Error';
import EmptyState from './common/EmptyState';

const PatientDetail = ({ patientId, onBack }) => {
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatientData = useCallback(async () => {
    if (!patientId) return;
    
    setLoading(true);
    setError(null);
    try {
      const [patientData, recordsData] = await Promise.all([
        apiService.getPatient(patientId),
        apiService.getPatientRecords(patientId)
      ]);
      
      setPatient(patientData);
      setRecords(recordsData.records || []);
    } catch (err) {
      setError(err.message || 'Failed to load patient data');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  if (loading) {
    return (
      <div className="patient-detail-container">
        <Loading message="Loading patient details..." />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="patient-detail-container">
        <Error message={error || 'Patient not found'} onRetry={fetchPatientData} />
        <button onClick={onBack} className="back-btn">Back to List</button>
      </div>
    );
  }

  return (
    <div className="patient-detail-container">
      <div className="patient-detail-header">
        <button onClick={onBack} className="back-btn">← Back to List</button>
      </div>

      <div className="patient-detail-content">
        <div className="patient-info-section">
          <h2>Patient Information</h2>
          <div className="patient-info-grid">
            <div className="info-item">
              <div className="info-label">Name</div>
              <div className="info-value">{patient.name}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Patient ID</div>
              <div className="info-value">{patient.patientId}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Email</div>
              <div className="info-value">{patient.email}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Date of Birth</div>
              <div className="info-value">{formatDate(patient.dateOfBirth)}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Gender</div>
              <div className="info-value">{patient.gender}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Phone</div>
              <div className="info-value">{patient.phone}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Address</div>
              <div className="info-value">{patient.address}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Wallet Address</div>
              <div className="info-value wallet">{patient.walletAddress}</div>
            </div>
          </div>
        </div>

        <div className="patient-records-section">
          <h2>Medical Records ({records.length})</h2>
          {records.length === 0 ? (
            <EmptyState message="No medical records found for this patient" />
          ) : (
            <div className="records-list">
              {records.map((record) => (
                <div key={record.id} className="record-card">
                  <div className="record-header">
                    <div className="record-title">{record.title}</div>
                    <span className={`record-type ${getRecordTypeClass(record.type)}`}>
                      {record.type}
                    </span>
                  </div>
                  <div className="record-description">{record.description}</div>
                  <div className="record-meta">
                    <div className="record-meta-item">
                      <span>📅</span>
                      <span>{formatDate(record.date)}</span>
                    </div>
                    <div className="record-meta-item">
                      <span>👨‍⚕️</span>
                      <span>{record.doctor}</span>
                    </div>
                    <div className="record-meta-item">
                      <span>🏥</span>
                      <span>{record.hospital}</span>
                    </div>
                    <div className="record-meta-item">
                      <span className={`record-status ${record.status}`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                  {record.blockchainHash && (
                    <div className="record-meta-item" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#999' }}>
                      <span>🔗</span>
                      <span style={{ fontFamily: 'Courier New, monospace' }}>
                        {record.blockchainHash}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;


