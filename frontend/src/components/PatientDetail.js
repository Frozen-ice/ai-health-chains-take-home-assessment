import React, { useState, useEffect } from 'react';
import './PatientDetail.css';
import { apiService } from '../services/apiService';

const PatientDetail = ({ patientId, onBack }) => {
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch patient data and records in parallel
        const [patientData, recordsData] = await Promise.all([
          apiService.getPatient(patientId),
          apiService.getPatientRecords(patientId)
        ]);
        
        // Update state with fetched data
        setPatient(patientData);
        setRecords(recordsData.records || []);
      } catch (err) {
        setError(err.message || 'Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="patient-detail-container">
        <div className="loading">Loading patient details...</div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="patient-detail-container">
        <div className="error">Error loading patient: {error || 'Patient not found'}</div>
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
              <div className="info-value">{new Date(patient.dateOfBirth).toLocaleDateString()}</div>
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
            <div className="placeholder">
              <p>No medical records found for this patient</p>
            </div>
          ) : (
            <div className="records-list">
              {records.map((record) => (
                <div key={record.id} className="record-card">
                  <div className="record-header">
                    <div className="record-title">{record.title}</div>
                    <span className={`record-type ${
                      record.type.toLowerCase().includes('lab') ? 'lab' :
                      record.type.toLowerCase().includes('treatment') ? 'treatment' :
                      'diagnostic'
                    }`}>
                      {record.type}
                    </span>
                  </div>
                  <div className="record-description">{record.description}</div>
                  <div className="record-meta">
                    <div className="record-meta-item">
                      <span>📅</span>
                      <span>{new Date(record.date).toLocaleDateString()}</span>
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


