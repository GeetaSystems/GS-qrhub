'use strict';

const QRCode = require('qrcode');
const { escapeForQr } = require('../helpers/sanitize');

/**
 * Core QR renderer — converts a data string to SVG using configured options.
 */
const renderQrSvg = async (data, options = {}) => {
  const {
    size = 300,
    margin = 4,
    darkColor = '#000000',
    lightColor = '#ffffff',
    errorCorrectionLevel = 'M',
  } = options;

  const svg = await QRCode.toString(data, {
    type: 'svg',
    width: size,
    margin,
    color: {
      dark: darkColor,
      light: lightColor,
    },
    errorCorrectionLevel,
  });

  return svg;
};

// ─── Individual generators ────────────────────────────────────────────────────

/**
 * Plain text / URL QR code.
 */
const generateQr = async (query, options) => {
  const data = query.url || query.text;
  return renderQrSvg(data, options);
};

/**
 * WiFi network QR code.
 * Format: WIFI:T:<security>;S:<ssid>;P:<password>;H:<hidden>;;
 */
const generateWifiQr = async (query, options) => {
  const security = (query.security || 'WPA').toUpperCase();
  const hidden = query.hidden === 'true' ? 'true' : 'false';
  const ssid = escapeForQr(query.ssid);
  const password = query.password ? escapeForQr(query.password) : '';
  const data = `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};;`;
  return renderQrSvg(data, options);
};

/**
 * vCard 3.0 contact QR code.
 */
const generateVCardQr = async (query, options) => {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${query.name}`,
  ];
  if (query.phone) lines.push(`TEL:${query.phone}`);
  if (query.email) lines.push(`EMAIL:${query.email}`);
  if (query.org)   lines.push(`ORG:${query.org}`);
  if (query.title) lines.push(`TITLE:${query.title}`);
  if (query.url)   lines.push(`URL:${query.url}`);
  if (query.address) lines.push(`ADR:;;${query.address};;;;`);
  lines.push('END:VCARD');
  return renderQrSvg(lines.join('\n'), options);
};

/**
 * mailto: email QR code.
 */
const generateEmailQr = async (query, options) => {
  const params = new URLSearchParams();
  if (query.subject) params.set('subject', query.subject);
  if (query.body)    params.set('body', query.body);
  const qs = params.toString();
  const data = `mailto:${query.to}${qs ? `?${qs}` : ''}`;
  return renderQrSvg(data, options);
};

/**
 * SMS QR code.
 * Format: SMSTO:<phone>:<message>
 */
const generateSmsQr = async (query, options) => {
  const msg = query.message || '';
  const data = `SMSTO:${query.phone}:${msg}`;
  return renderQrSvg(data, options);
};

/**
 * Phone call QR code.
 * Format: tel:<number>
 */
const generatePhoneQr = async (query, options) => {
  const data = `tel:${query.number}`;
  return renderQrSvg(data, options);
};

/**
 * Geolocation QR code.
 * Format: geo:<lat>,<lng>
 */
const generateGeoQr = async (query, options) => {
  const data = `geo:${query.lat},${query.lng}`;
  return renderQrSvg(data, options);
};

/**
 * WhatsApp deep-link QR code.
 * Format: https://wa.me/<phone>?text=<message>
 */
const generateWhatsappQr = async (query, options) => {
  const phone = query.phone.replace(/\D/g, '');
  const params = query.message
    ? `?text=${encodeURIComponent(query.message)}`
    : '';
  const data = `https://wa.me/${phone}${params}`;
  return renderQrSvg(data, options);
};

/**
 * Calendar event QR code (iCalendar / VEVENT format).
 */
const generateEventQr = async (query, options) => {
  const formatDt = (iso) => {
    const d = new Date(iso);
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:${query.title}`,
    `DTSTART:${formatDt(query.start)}`,
  ];
  if (query.end)         lines.push(`DTEND:${formatDt(query.end)}`);
  if (query.location)    lines.push(`LOCATION:${query.location}`);
  if (query.description) lines.push(`DESCRIPTION:${query.description}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');

  return renderQrSvg(lines.join('\r\n'), options);
};

/**
 * Cryptocurrency payment QR code.
 * Follows BIP-21 URI format for Bitcoin; generic for others.
 */
const generateCryptoQr = async (query, options) => {
  const coin = query.coin.toLowerCase();
  const params = new URLSearchParams();
  if (query.amount)  params.set('amount', query.amount);
  if (query.label)   params.set('label', query.label);
  if (query.message) params.set('message', query.message);
  const qs = params.toString();
  const data = `${coin}:${query.address}${qs ? `?${qs}` : ''}`;
  return renderQrSvg(data, options);
};

/**
 * TOTP (OTP Auth) QR code for authenticator apps.
 * Format: otpauth://totp/<issuer>:<account>?secret=<secret>&issuer=<issuer>
 */
const generateOtpQr = async (query, options) => {
  const algorithm = query.algorithm || 'SHA1';
  const digits    = query.digits    || '6';
  const period    = query.period    || '30';
  const secret    = query.secret.toUpperCase().replace(/\s/g, '');

  const params = new URLSearchParams({
    secret,
    issuer: query.issuer,
    algorithm,
    digits,
    period,
  });

  const label = encodeURIComponent(`${query.issuer}:${query.account}`);
  const data  = `otpauth://totp/${label}?${params.toString()}`;
  return renderQrSvg(data, options);
};

module.exports = {
  generateQr,
  generateWifiQr,
  generateVCardQr,
  generateEmailQr,
  generateSmsQr,
  generatePhoneQr,
  generateGeoQr,
  generateWhatsappQr,
  generateEventQr,
  generateCryptoQr,
  generateOtpQr,
};
