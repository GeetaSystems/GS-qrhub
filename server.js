const express = require('express');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT;
const SERVER_URL = process.env.SERVER_URL

/**
 * Root route
 */
app.get('/', (req, res) => {
    res.type('text/plain');

    res.send(`
========================================
Geeta Systems Utility API
GS-svgqr
========================================

Simple SVG QR Code Generator API

Available Routes:

GET /
    Show API usage

GET /health
    Health check / wake-up endpoint

GET /qr?url=https://example.com
    Generate SVG QR code

Example:
${SERVER_Url}/qr?url=https://google.com

Response:
Returns raw SVG QR code image

Made by Geeta Systems
    `);
});

/**
 * Health route
 * Useful for:
 * - uptime monitoring
 * - cron wake-up pings
 * - docker/k8s health checks
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'healthy',
        service: 'GS-svgqr',
        brand: 'Geeta Systems',
        uptime_seconds: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

/**
 * QR route
 */
app.get('/qr', async (req, res) => {
    try {
        const url = req.query.url;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'Missing url query parameter',
                brand: 'Geeta Systems',
                service: 'GS-svgqr'
            });
        }

        // URL validation
        try {
            new URL(url);
        } catch {
            return res.status(400).json({
                success: false,
                error: 'Invalid URL',
                brand: 'Geeta Systems',
                service: 'GS-svgqr'
            });
        }

        // Generate SVG QR code
        const svg = await QRCode.toString(url, {
            type: 'svg',
            margin: 1,
            width: 300
        });

        // Branding headers
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('X-Powered-By', 'Geeta Systems');
        res.setHeader('X-Service', 'GS-svgqr');

        res.send(svg);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: 'Failed to generate QR code',
            brand: 'Geeta Systems',
            service: 'GS-svgqr'
        });
    }
});

app.listen(PORT, () => {
    console.log(`
========================================
Geeta Systems Utility API
GS-svgqr running on:
${SERVER_URL}
========================================
    `);
});