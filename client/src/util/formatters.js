import { DateTime } from 'luxon';

/**
 * Trims the input string safely, returns empty string on null/undefined input
 * @param str {string}
 * @returns {string}
 */
export function trimSafely(str) {
  return str ? str.trim() : '';
}

/**
 * Returns a formatted datetime
 * @param {string} datetime ISO8601 datetime
 * @returns {string}
 */
export function toDateFormat(datetime) {
  return DateTime.fromISO(datetime).toFormat('M/d/yyyy');
}
