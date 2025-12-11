/**
 * Utility functions for formatting data
 */

/**
 * Format a date string or Date object to a localized date string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

/**
 * Format a date string or Date object to a localized date and time string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString();
};

/**
 * Format a wallet address by truncating it
 * @param {string} address - Wallet address to format
 * @param {number} startLength - Number of characters to show at start (default: 8)
 * @param {number} endLength - Number of characters to show at end (default: 6)
 * @returns {string} Formatted address (e.g., "0x1234...5678")
 */
export const formatAddress = (address, startLength = 8, endLength = 6) => {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

/**
 * Get record type CSS class name
 * @param {string} type - Record type
 * @returns {string} CSS class name
 */
export const getRecordTypeClass = (type) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('lab')) return 'lab';
  if (lowerType.includes('treatment')) return 'treatment';
  return 'diagnostic';
};

