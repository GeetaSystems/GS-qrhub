'use strict';

/**
 * Centralized input validators for all QR/barcode types.
 * Each validator returns { valid: true } or { valid: false, error: 'message' }
 */

const isValidUrl = (str) => {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidEmail = (str) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(str).toLowerCase());
};

const isValidPhone = (str) => {
  // Accepts international format with optional + prefix, 7-15 digits
  const re = /^\+?[1-9]\d{6,14}$/;
  return re.test(str.replace(/[\s\-().]/g, ''));
};

const isValidLatitude = (val) => {
  const n = parseFloat(val);
  return !isNaN(n) && n >= -90 && n <= 90;
};

const isValidLongitude = (val) => {
  const n = parseFloat(val);
  return !isNaN(n) && n >= -180 && n <= 180;
};

const isValidBase32 = (str) => {
  return /^[A-Z2-7]+=*$/i.test(str);
};

const isValidHexColor = (str) => {
  return /^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(str);
};

const isValidDateTimeString = (str) => {
  const d = new Date(str);
  return !isNaN(d.getTime());
};

// ─── Type-specific validators ───────────────────────────────────────────────

const validators = {
  qr(query) {
    if (!query.text && !query.url) {
      return { valid: false, error: 'Either "text" or "url" query parameter is required.' };
    }
    if (query.url && !isValidUrl(query.url)) {
      return { valid: false, error: 'Invalid URL. Must be a valid http or https URL.' };
    }
    return { valid: true };
  },

  barcode(query) {
    if (!query.text) {
      return { valid: false, error: '"text" query parameter is required for barcodes.' };
    }
    const supported = [
      'code128', 'code39', 'ean13', 'ean8', 'upca', 'upce',
      'interleaved2of5', 'gs1-128', 'pdf417', 'datamatrix',
    ];
    if (query.format && !supported.includes(query.format.toLowerCase())) {
      return {
        valid: false,
        error: `Unsupported barcode format. Supported: ${supported.join(', ')}`,
      };
    }
    return { valid: true };
  },

  wifi(query) {
    if (!query.ssid) {
      return { valid: false, error: '"ssid" query parameter is required.' };
    }
    const validSecurity = ['WPA', 'WEP', 'nopass'];
    const security = (query.security || 'WPA').toUpperCase();
    if (security !== 'WPA' && security !== 'WEP' && security !== 'NOPASS') {
      return { valid: false, error: `Invalid security type. Supported: ${validSecurity.join(', ')}` };
    }
    if (security !== 'NOPASS' && !query.password) {
      return { valid: false, error: '"password" is required for WPA and WEP security types.' };
    }
    return { valid: true };
  },

  vcard(query) {
    if (!query.name) {
      return { valid: false, error: '"name" query parameter is required.' };
    }
    if (query.email && !isValidEmail(query.email)) {
      return { valid: false, error: 'Invalid "email" format.' };
    }
    if (query.phone && !isValidPhone(query.phone)) {
      return { valid: false, error: 'Invalid "phone" format. Use international format (e.g. +919876543210).' };
    }
    return { valid: true };
  },

  email(query) {
    if (!query.to) {
      return { valid: false, error: '"to" query parameter is required.' };
    }
    if (!isValidEmail(query.to)) {
      return { valid: false, error: 'Invalid "to" email address.' };
    }
    return { valid: true };
  },

  sms(query) {
    if (!query.phone) {
      return { valid: false, error: '"phone" query parameter is required.' };
    }
    if (!isValidPhone(query.phone)) {
      return { valid: false, error: 'Invalid phone number format.' };
    }
    return { valid: true };
  },

  phone(query) {
    if (!query.number) {
      return { valid: false, error: '"number" query parameter is required.' };
    }
    if (!isValidPhone(query.number)) {
      return { valid: false, error: 'Invalid phone number format.' };
    }
    return { valid: true };
  },

  geo(query) {
    if (!query.lat || !query.lng) {
      return { valid: false, error: '"lat" and "lng" query parameters are required.' };
    }
    if (!isValidLatitude(query.lat)) {
      return { valid: false, error: '"lat" must be a number between -90 and 90.' };
    }
    if (!isValidLongitude(query.lng)) {
      return { valid: false, error: '"lng" must be a number between -180 and 180.' };
    }
    return { valid: true };
  },

  whatsapp(query) {
    if (!query.phone) {
      return { valid: false, error: '"phone" query parameter is required (international format, no +).' };
    }
    if (!isValidPhone(query.phone)) {
      return { valid: false, error: 'Invalid WhatsApp phone number format.' };
    }
    return { valid: true };
  },

  event(query) {
    if (!query.title) {
      return { valid: false, error: '"title" query parameter is required.' };
    }
    if (!query.start) {
      return { valid: false, error: '"start" datetime is required (ISO 8601 format).' };
    }
    if (!isValidDateTimeString(query.start)) {
      return { valid: false, error: '"start" must be a valid ISO 8601 datetime string.' };
    }
    if (query.end && !isValidDateTimeString(query.end)) {
      return { valid: false, error: '"end" must be a valid ISO 8601 datetime string.' };
    }
    return { valid: true };
  },

  crypto(query) {
    if (!query.coin) {
      return { valid: false, error: '"coin" query parameter is required (e.g. bitcoin, ethereum).' };
    }
    if (!query.address) {
      return { valid: false, error: '"address" query parameter is required.' };
    }
    return { valid: true };
  },

  otp(query) {
    if (!query.issuer) {
      return { valid: false, error: '"issuer" query parameter is required.' };
    }
    if (!query.account) {
      return { valid: false, error: '"account" query parameter is required.' };
    }
    if (!query.secret) {
      return { valid: false, error: '"secret" (Base32) query parameter is required.' };
    }
    if (!isValidBase32(query.secret)) {
      return { valid: false, error: '"secret" must be a valid Base32-encoded string.' };
    }
    return { valid: true };
  },
};

/**
 * Validate shared rendering options (size, margin, colors, etc.)
 */
const validateRenderOptions = (query) => {
  if (query.size !== undefined) {
    const s = parseInt(query.size, 10);
    if (isNaN(s) || s < 50 || s > 2000) {
      return { valid: false, error: '"size" must be a number between 50 and 2000.' };
    }
  }
  if (query.margin !== undefined) {
    const m = parseInt(query.margin, 10);
    if (isNaN(m) || m < 0 || m > 20) {
      return { valid: false, error: '"margin" must be a number between 0 and 20.' };
    }
  }
  if (query.darkColor !== undefined && !isValidHexColor(query.darkColor)) {
    return { valid: false, error: '"darkColor" must be a valid hex color without # (e.g. 000000).' };
  }
  if (query.lightColor !== undefined && !isValidHexColor(query.lightColor)) {
    return { valid: false, error: '"lightColor" must be a valid hex color without # (e.g. ffffff).' };
  }
  const validEcc = ['L', 'M', 'Q', 'H'];
  if (query.errorCorrectionLevel && !validEcc.includes(query.errorCorrectionLevel.toUpperCase())) {
    return { valid: false, error: `"errorCorrectionLevel" must be one of: ${validEcc.join(', ')}` };
  }
  return { valid: true };
};

module.exports = { validators, validateRenderOptions };
