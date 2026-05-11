const express = require('express');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT;
// const PORT = 3000;
const SERVER_URL = process.env.SERVER_URL;
// const SERVER_URL = "http://localhost:3000";

/**
 * Info route
 */
app.get('/info', (req, res) => {
    res.type('text/plain');

    res.send(`
========================================
Geeta Systems Utility API
GS-svgqr
========================================

Simple SVG QR Code Generator API

Available Routes:

GET /info
    Show API usage

GET /health
    Health check / wake-up endpoint

GET /?url=https://example.com
    Generate SVG QR code from URL

GET /?text=HelloWorld
    Generate SVG QR code from text

Examples:

${SERVER_URL}/?url=https://google.com

${SERVER_URL}/?text=Hello%20World

Response:
Returns raw SVG QR code image

Made by Geeta Systems
    `);
});

/**
 * Health route
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
app.get('/', async (req, res) => {
    try {
        const { url, text } = req.query;

        // Require at least one parameter
        if (!url && !text) {
            return res.status(400).json({
                success: false,
                error: 'Missing url or text query parameter',
                brand: 'Geeta Systems',
                service: 'GS-svgqr'
            });
        }

        let qrData = '';

        /**
         * URL mode
         */
        if (url) {
            try {
                new URL(url);
                qrData = url;
            } catch {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid URL',
                    brand: 'Geeta Systems',
                    service: 'GS-svgqr'
                });
            }
        }

        /**
         * Text mode
         */
        if (text) {
            qrData = text;
        }

        // Generate SVG QR code
        const svg = await QRCode.toString(qrData, {
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