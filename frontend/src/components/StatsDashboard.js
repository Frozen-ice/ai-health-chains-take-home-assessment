import React, { useState, useEffect, useCallback } from 'react';
import './StatsDashboard.css';
import { apiService } from '../services/apiService';
import Loading from './common/Loading';
import Error from './common/Error';

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const statsData = await apiService.getStats();
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="stats-dashboard-container">
        <Loading message="Loading statistics..." />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="stats-dashboard-container">
        <Error message={error || 'No data available'} onRetry={fetchStats} />
      </div>
    );
  }

  return (
    <div className="stats-dashboard-container">
      <h2>Platform Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-label">Total Patients</div>
          <div className="stat-value">{stats.totalPatients}</div>
          <div className="stat-description">Registered patients in the system</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Records</div>
          <div className="stat-value">{stats.totalRecords}</div>
          <div className="stat-description">Medical records stored</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Consents</div>
          <div className="stat-value">{stats.totalConsents}</div>
          <div className="stat-description">All consent records</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Active Consents</div>
          <div className="stat-value">{stats.activeConsents}</div>
          <div className="stat-description">Currently active consents</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Pending Consents</div>
          <div className="stat-value">{stats.pendingConsents}</div>
          <div className="stat-description">Awaiting activation</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Transactions</div>
          <div className="stat-value">{stats.totalTransactions}</div>
          <div className="stat-description">Blockchain transactions</div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;


