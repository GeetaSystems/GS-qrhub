'use strict';

/**
 * Input sanitization helpers.
 * Strips potentially dangerous characters from string inputs.
 */

/**
 * Remove null bytes and trim whitespace from a string.
 */
const sanitizeString = (val) => {
  if (typeof val !== 'string') return val;
  return val.replace(/\0/g, '').trim();
};

/**
 * Recursively sanitize all string values in a query object.
 */
const sanitizeQuery = (query) => {
  const clean = {};
  for (const [key, value] of Object.entries(query)) {
    clean[key] = typeof value === 'string' ? sanitizeString(value) : value;
  }
  return clean;
};

/**
 * Escape special characters for safe inclusion in data URIs / QR strings.
 * Only used in specific contexts where raw user input flows into structured formats.
 */
const escapeForQr = (val) => {
  if (typeof val !== 'string') return val;
  // Escape semicolons and colons only where needed (vCard, WiFi, etc.)
  return val.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,');
};

module.exports = { sanitizeString, sanitizeQuery, escapeForQr };
