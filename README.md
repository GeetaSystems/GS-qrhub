# GS-QRHub — Geeta Systems QR Hub

**Version:** 1.0.0  
A production-ready, multipurpose QR code and barcode generation API that returns raw SVG.

---

## Features

- 11 QR types: plain text/URL, WiFi, vCard, email, SMS, phone, geo, WhatsApp, calendar event, crypto, OTP (TOTP)
- 10 barcode formats: Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, Interleaved 2of5, GS1-128, PDF417, DataMatrix
- Fully customisable output: size, margin, colors, error correction level
- Input validation and sanitisation on every parameter
- Rate limiting (default 100 req/min per IP)
- Security hardened with Helmet + CORS + compression
- Docker + Docker Compose ready
- One-click deploy to Render or Railway

---

## Quick Start

### Prerequisites

- Node.js ≥ 18

### Install & run locally

```bash
git clone https://github.com/your-org/gs-qrhub.git
cd gs-qrhub

cp .env.example .env   # edit as needed

npm install
npm start              # production
npm run dev            # dev mode (nodemon)
```

Server starts at `http://localhost:3000`

---

## API Reference

All requests use **GET /**

### Required parameter

| Param  | Description                                |
|--------|--------------------------------------------|
| `type` | One of the supported types listed below    |

### Optional render parameters (all types)

| Param                  | Default   | Description                              |
|------------------------|-----------|------------------------------------------|
| `size`                 | `300`     | Output width in pixels (50–2000)         |
| `margin`               | `4`       | Quiet-zone modules (0–20)               |
| `darkColor`            | `000000`  | Module color as hex (no `#`)            |
| `lightColor`           | `ffffff`  | Background color as hex (no `#`)        |
| `errorCorrectionLevel` | `M`       | `L` / `M` / `Q` / `H` (QR only)        |

---

## Supported QR Types

### `qr` — Plain text / URL

```
GET /?type=qr&text=Hello%20World
GET /?type=qr&url=https://example.com
GET /?type=qr&url=https://example.com&size=500&errorCorrectionLevel=H
```

### `wifi` — WiFi credentials

| Param      | Required | Description                    |
|------------|----------|--------------------------------|
| `ssid`     | ✅        | Network name                   |
| `password` | ✅*       | Password (* not required for nopass) |
| `security` |          | `WPA` (default) / `WEP` / `nopass` |
| `hidden`   |          | `true` / `false`               |

```
GET /?type=wifi&ssid=OfficeWifi&password=secret123&security=WPA
```

### `vcard` — Contact card

| Param     | Required | Description        |
|-----------|----------|--------------------|
| `name`    | ✅        | Full name          |
| `phone`   |          | Phone number       |
| `email`   |          | Email address      |
| `org`     |          | Organisation       |
| `title`   |          | Job title          |
| `url`     |          | Website URL        |
| `address` |          | Street address     |

```
GET /?type=vcard&name=John%20Doe&phone=+919876543210&email=john@example.com&org=ACME
```

### `email` — Email compose

| Param     | Required | Description    |
|-----------|----------|----------------|
| `to`      | ✅        | Recipient email |
| `subject` |          | Subject line   |
| `body`    |          | Email body     |

```
GET /?type=email&to=john@example.com&subject=Hello&body=Test%20message
```

### `sms` — SMS message

| Param     | Required | Description  |
|-----------|----------|--------------|
| `phone`   | ✅        | Phone number |
| `message` |          | SMS body     |

```
GET /?type=sms&phone=9876543210&message=Hello%20there
```

### `phone` — Phone call

| Param    | Required | Description  |
|----------|----------|--------------|
| `number` | ✅        | Phone number |

```
GET /?type=phone&number=+919876543210
```

### `geo` — Geographic location

| Param | Required | Description               |
|-------|----------|---------------------------|
| `lat` | ✅        | Latitude (-90 to 90)      |
| `lng` | ✅        | Longitude (-180 to 180)   |

```
GET /?type=geo&lat=28.6139&lng=77.2090
```

### `whatsapp` — WhatsApp deep link

| Param     | Required | Description                       |
|-----------|----------|-----------------------------------|
| `phone`   | ✅        | International number (no +)       |
| `message` |          | Pre-filled message                |

```
GET /?type=whatsapp&phone=919876543210&message=Hello
```

### `event` — Calendar event

| Param         | Required | Description              |
|---------------|----------|--------------------------|
| `title`       | ✅        | Event title              |
| `start`       | ✅        | ISO 8601 start datetime  |
| `end`         |          | ISO 8601 end datetime    |
| `location`    |          | Venue                    |
| `description` |          | Event description        |

```
GET /?type=event&title=Team%20Meeting&start=2026-06-01T10:00:00Z&end=2026-06-01T11:00:00Z
```

### `crypto` — Cryptocurrency payment

| Param     | Required | Description              |
|-----------|----------|--------------------------|
| `coin`    | ✅        | Coin name (e.g. bitcoin) |
| `address` | ✅        | Wallet address           |
| `amount`  |          | Payment amount           |
| `label`   |          | Label                    |
| `message` |          | Note                     |

```
GET /?type=crypto&coin=bitcoin&address=1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf&amount=0.01
```

### `otp` — TOTP Authenticator

| Param       | Required | Description                   |
|-------------|----------|-------------------------------|
| `issuer`    | ✅        | App/service name              |
| `account`   | ✅        | User account (e.g. email)     |
| `secret`    | ✅        | Base32-encoded TOTP secret    |
| `algorithm` |          | `SHA1` (default) / `SHA256`   |
| `digits`    |          | `6` (default) / `8`          |
| `period`    |          | `30` (default)               |

```
GET /?type=otp&issuer=MyApp&account=user@example.com&secret=JBSWY3DPEHPK3PXP
```

---

## Supported Barcode Types

Use `?type=barcode&format=<format>` for all barcodes.

| Format             | Use case                          |
|--------------------|-----------------------------------|
| `code128`          | General-purpose alphanumeric      |
| `code39`           | Industrial / automotive           |
| `ean13`            | Retail products (13 digits)       |
| `ean8`             | Small retail (8 digits)           |
| `upca`             | US retail (12 digits)             |
| `upce`             | Compressed UPC-A (6 digits)       |
| `interleaved2of5`  | Logistics / numeric only          |
| `gs1-128`          | Supply chain / GS1 compliant      |
| `pdf417`           | High-density stacked barcode      |
| `datamatrix`       | 2D matrix — small footprint       |

```
GET /?type=barcode&text=ABC123&format=code128
GET /?type=barcode&text=012345678905&format=ean13
GET /?type=barcode&text=HELLO&format=pdf417&size=400
```

---

## Special Endpoints

```
GET /health   — Service health check (JSON)
GET /info     — Plain-text usage documentation
```

---

## Error Responses

All errors return JSON:

```json
{
  "success": false,
  "error": "Descriptive validation message"
}
```

HTTP status codes: `400` (bad input), `404` (unknown route), `429` (rate limit), `500` (server error).

---

## Environment Variables

Copy `.env.example` to `.env` and customise:

| Variable       | Default                        | Description                          |
|----------------|--------------------------------|--------------------------------------|
| `PORT`         | `3000`                         | HTTP port                            |
| `NODE_ENV`     | `development`                  | `development` / `production`         |
| `SERVER_URL`   | `http://localhost:3000`        | Public URL of the service            |
| `RATE_LIMIT`   | `100`                          | Max requests per minute per IP       |
| `CORS_ORIGINS` | `*`                            | Comma-separated origins or `*`       |

---

## Docker

### Build and run

```bash
docker build -t gs-qrhub .
docker run -p 3000:3000 --env-file .env gs-qrhub
```

### Docker Compose

```bash
docker compose up -d
docker compose logs -f
docker compose down
```

---

## Deployment

### Render

1. Connect your GitHub repository in the Render dashboard.
2. Render auto-detects `render.yaml` — click **Apply**.
3. Set any secret env vars (e.g. `SERVER_URL`) in the dashboard.

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

railway login
railway init
railway up
```

`railway.toml` is pre-configured. Set `SERVER_URL` in the Railway dashboard after the first deploy.

---

## Project Structure

```
gs-qrhub/
├── src/
│   ├── app.js                  # Express bootstrap + server
│   ├── config/index.js         # Centralised configuration
│   ├── routes/index.js         # Route definitions
│   ├── controllers/
│   │   ├── generateController.js
│   │   ├── healthController.js
│   │   └── infoController.js
│   ├── services/
│   │   ├── qrService.js        # All QR generators
│   │   └── barcodeService.js   # Barcode generator (bwip-js)
│   ├── validators/index.js     # Per-type input validators
│   ├── helpers/
│   │   ├── sanitize.js         # Input sanitisation utilities
│   │   └── renderOptions.js    # Shared render option parser
│   ├── middlewares/
│   │   ├── branding.js         # X-Powered-By / X-Service headers
│   │   ├── errorHandler.js     # Centralised error handler
│   │   ├── rateLimit.js        # express-rate-limit
│   │   └── sanitize.js         # Query sanitisation middleware
├── Dockerfile
├── docker-compose.yml
├── render.yaml
├── railway.toml
├── .env.example
└── package.json
```

---

## License

MIT © Geeta Systems
