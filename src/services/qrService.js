'use strict';
const QRCode = require('qrcode');
const { escapeForQr } = require('../helpers/sanitize');

const renderQrSvg = async (data, opts={}) => QRCode.toString(data, {
  type:'svg', width:opts.size||300, margin:opts.margin??4,
  color:{dark:opts.darkColor||'#000000',light:opts.lightColor||'#ffffff'},
  errorCorrectionLevel:opts.errorCorrectionLevel||'M',
});

const generateQr        = (q,o) => renderQrSvg(q.url||q.text, o);
const generateWifiQr    = (q,o) => { const sec=(q.security||'WPA').toUpperCase(); return renderQrSvg(`WIFI:T:${sec};S:${escapeForQr(q.ssid)};P:${q.password?escapeForQr(q.password):''};H:${q.hidden==='true'?'true':'false'};;`,o); };
const generateVCardQr   = (q,o) => { const l=['BEGIN:VCARD','VERSION:3.0',`FN:${q.name}`]; if(q.phone)l.push(`TEL:${q.phone}`); if(q.email)l.push(`EMAIL:${q.email}`); if(q.org)l.push(`ORG:${q.org}`); if(q.title)l.push(`TITLE:${q.title}`); if(q.url)l.push(`URL:${q.url}`); if(q.address)l.push(`ADR:;;${q.address};;;;`); l.push('END:VCARD'); return renderQrSvg(l.join('\n'),o); };
const generateEmailQr   = (q,o) => { const p=new URLSearchParams(); if(q.subject)p.set('subject',q.subject); if(q.body)p.set('body',q.body); const s=p.toString(); return renderQrSvg(`mailto:${q.to}${s?`?${s}`:''}`,o); };
const generateSmsQr     = (q,o) => renderQrSvg(`SMSTO:${q.phone}:${q.message||''}`,o);
const generatePhoneQr   = (q,o) => renderQrSvg(`tel:${q.number}`,o);
const generateGeoQr     = (q,o) => renderQrSvg(`geo:${q.lat},${q.lng}`,o);
const generateWhatsappQr= (q,o) => { const ph=q.phone.replace(/\D/g,''); return renderQrSvg(`https://wa.me/${ph}${q.message?`?text=${encodeURIComponent(q.message)}`:''}`,o); };
const generateEventQr   = (q,o) => { const f=iso=>new Date(iso).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''); const l=['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',`SUMMARY:${q.title}`,`DTSTART:${f(q.start)}`]; if(q.end)l.push(`DTEND:${f(q.end)}`); if(q.location)l.push(`LOCATION:${q.location}`); if(q.description)l.push(`DESCRIPTION:${q.description}`); l.push('END:VEVENT','END:VCALENDAR'); return renderQrSvg(l.join('\r\n'),o); };
const generateCryptoQr  = (q,o) => { const p=new URLSearchParams(); if(q.amount)p.set('amount',q.amount); if(q.label)p.set('label',q.label); if(q.message)p.set('message',q.message); const s=p.toString(); return renderQrSvg(`${q.coin.toLowerCase()}:${q.address}${s?`?${s}`:''}`,o); };
const generateOtpQr     = (q,o) => { const p=new URLSearchParams({secret:q.secret.toUpperCase().replace(/\s/g,''),issuer:q.issuer,algorithm:q.algorithm||'SHA1',digits:q.digits||'6',period:q.period||'30'}); return renderQrSvg(`otpauth://totp/${encodeURIComponent(`${q.issuer}:${q.account}`)}?${p.toString()}`,o); };

module.exports = { generateQr, generateWifiQr, generateVCardQr, generateEmailQr, generateSmsQr, generatePhoneQr, generateGeoQr, generateWhatsappQr, generateEventQr, generateCryptoQr, generateOtpQr };
