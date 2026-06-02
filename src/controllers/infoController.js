'use strict';

const config = require('../config');

const INFO_TEXT = `
================================================================================
  ${config.service.name} — ${config.service.vendor}
  Version: ${config.service.version}
  Multipurpose QR Code & Barcode Generation API
================================================================================

BASE URL
  GET /

HEALTH CHECK
  GET /health

INFO
  GET /info  (this page)

────────────────────────────────────────────────────────────────────────────────
SUPPORTED TYPES & EXAMPLES
────────────────────────────────────────────────────────────────────────────────

QR TYPES
  qr          Plain text or URL
    /?type=qr&text=Hello%20World
    /?type=qr&url=https://example.com

  wifi        WiFi network credentials
    /?type=wifi&ssid=OfficeWifi&password=secret123&security=WPA

  vcard       Contact card (vCard 3.0)
    /?type=vcard&name=John%20Doe&phone=9876543210&email=john@example.com

  email       Email compose link
    /?type=email&to=john@example.com&subject=Hello&body=Test

  sms         SMS message
    /?type=sms&phone=9876543210&message=Hello

  phone       Phone call
    /?type=phone&number=9876543210

  geo         Geographic location
    /?type=geo&lat=28.6139&lng=77.2090

  whatsapp    WhatsApp deep link
    /?type=whatsapp&phone=919876543210&message=Hello

  event       Calendar event (iCalendar)
    /?type=event&title=Meeting&start=2026-06-01T10:00:00Z&end=2026-06-01T11:00:00Z

  crypto      Cryptocurrency payment
    /?type=crypto&coin=bitcoin&address=walletaddress&amount=0.01

  otp         TOTP authenticator
    /?type=otp&issuer=MyApp&account=user@example.com&secret=BASE32SECRET

BARCODE TYPES  (use ?type=barcode&format=<format>)
  code128, code39, ean13, ean8, upca, upce,
  interleaved2of5, gs1-128, pdf417, datamatrix

  /?type=barcode&text=ABC123&format=code128
  /?type=barcode&text=012345678905&format=ean13

────────────────────────────────────────────────────────────────────────────────
OPTIONAL RENDER PARAMETERS (all types)
────────────────────────────────────────────────────────────────────────────────
  size                  Width in pixels (50–2000, default: 300)
  margin                Quiet zone modules (0–20, default: 4)
  darkColor             Hex color without # (default: 000000)
  lightColor            Hex color without # (default: ffffff)
  errorCorrectionLevel  L | M | Q | H  (default: M, QR only)

  Examples:
    /?type=qr&text=Hello&size=500
    /?type=qr&text=Hello&darkColor=1a1a2e&lightColor=e94560
    /?type=qr&url=https://example.com&errorCorrectionLevel=H

────────────────────────────────────────────────────────────────────────────────
RESPONSE
────────────────────────────────────────────────────────────────────────────────
  Success:  Content-Type: image/svg+xml  (raw SVG body)
  Error:    Content-Type: application/json
            { "success": false, "error": "Validation message" }

  Rate limit: ${config.rateLimit.max} requests per minute per IP

================================================================================
`.trimStart();

const info = (req, res) => {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send(INFO_TEXT);
};

module.exports = { info };
