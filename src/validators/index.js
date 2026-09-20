'use strict';

const isValidUrl   = (s) => { try { const u = new URL(s); return u.protocol==='http:'||u.protocol==='https:'; } catch { return false; } };
const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).toLowerCase());
const isValidPhone = (s) => /^\+?[1-9]\d{6,14}$/.test(s.replace(/[\s\-().]/g,''));
const isValidLat   = (v) => { const n=parseFloat(v); return !isNaN(n)&&n>=-90&&n<=90; };
const isValidLng   = (v) => { const n=parseFloat(v); return !isNaN(n)&&n>=-180&&n<=180; };
const isValidB32   = (s) => /^[A-Z2-7]+=*$/i.test(s);
const isValidHex   = (s) => /^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(s);
const isValidDt    = (s) => !isNaN(new Date(s).getTime());

const validators = {
  qr(q)        { if(!q.text&&!q.url) return {valid:false,error:'Either "text" or "url" is required.'}; if(q.url&&!isValidUrl(q.url)) return {valid:false,error:'Invalid URL.'}; return {valid:true}; },
  barcode(q)   { if(!q.text) return {valid:false,error:'"text" is required.'}; const s=['code128','code39','ean13','ean8','upca','upce','interleaved2of5','gs1-128','pdf417','datamatrix']; if(q.format&&!s.includes(q.format.toLowerCase())) return {valid:false,error:`Unsupported format. Supported: ${s.join(', ')}`}; return {valid:true}; },
  wifi(q)      { if(!q.ssid) return {valid:false,error:'"ssid" is required.'}; const sec=(q.security||'WPA').toUpperCase(); if(!['WPA','WEP','NOPASS'].includes(sec)) return {valid:false,error:'Invalid security. Use WPA, WEP, or nopass.'}; if(sec!=='NOPASS'&&!q.password) return {valid:false,error:'"password" is required for WPA/WEP.'}; return {valid:true}; },
  vcard(q)     { if(!q.name) return {valid:false,error:'"name" is required.'}; if(q.email&&!isValidEmail(q.email)) return {valid:false,error:'Invalid email.'}; if(q.phone&&!isValidPhone(q.phone)) return {valid:false,error:'Invalid phone format.'}; return {valid:true}; },
  email(q)     { if(!q.to) return {valid:false,error:'"to" is required.'}; if(!isValidEmail(q.to)) return {valid:false,error:'Invalid email address.'}; return {valid:true}; },
  sms(q)       { if(!q.phone) return {valid:false,error:'"phone" is required.'}; if(!isValidPhone(q.phone)) return {valid:false,error:'Invalid phone.'}; return {valid:true}; },
  phone(q)     { if(!q.number) return {valid:false,error:'"number" is required.'}; if(!isValidPhone(q.number)) return {valid:false,error:'Invalid phone.'}; return {valid:true}; },
  geo(q)       { if(!q.lat||!q.lng) return {valid:false,error:'"lat" and "lng" are required.'}; if(!isValidLat(q.lat)) return {valid:false,error:'"lat" must be -90 to 90.'}; if(!isValidLng(q.lng)) return {valid:false,error:'"lng" must be -180 to 180.'}; return {valid:true}; },
  whatsapp(q)  { if(!q.phone) return {valid:false,error:'"phone" is required.'}; if(!isValidPhone(q.phone)) return {valid:false,error:'Invalid phone.'}; return {valid:true}; },
  event(q)     { if(!q.title) return {valid:false,error:'"title" is required.'}; if(!q.start) return {valid:false,error:'"start" is required.'}; if(!isValidDt(q.start)) return {valid:false,error:'"start" must be ISO 8601.'}; if(q.end&&!isValidDt(q.end)) return {valid:false,error:'"end" must be ISO 8601.'}; return {valid:true}; },
  crypto(q)    { if(!q.coin) return {valid:false,error:'"coin" is required.'}; if(!q.address) return {valid:false,error:'"address" is required.'}; return {valid:true}; },
  otp(q)       { if(!q.issuer) return {valid:false,error:'"issuer" is required.'}; if(!q.account) return {valid:false,error:'"account" is required.'}; if(!q.secret) return {valid:false,error:'"secret" is required.'}; if(!isValidB32(q.secret)) return {valid:false,error:'"secret" must be Base32.'}; return {valid:true}; },
};

const validateRenderOptions = (q) => {
  if(q.size!==undefined){const s=parseInt(q.size,10);if(isNaN(s)||s<50||s>2000)return{valid:false,error:'"size" must be 50–2000.'};};
  if(q.margin!==undefined){const m=parseInt(q.margin,10);if(isNaN(m)||m<0||m>20)return{valid:false,error:'"margin" must be 0–20.'};};
  if(q.darkColor&&!isValidHex(q.darkColor))return{valid:false,error:'"darkColor" must be a valid hex (no #).'};
  if(q.lightColor&&!isValidHex(q.lightColor))return{valid:false,error:'"lightColor" must be a valid hex (no #).'};
  if(q.errorCorrectionLevel&&!['L','M','Q','H'].includes(q.errorCorrectionLevel.toUpperCase()))return{valid:false,error:'"errorCorrectionLevel" must be L, M, Q, or H.'};
  return{valid:true};
};

module.exports = { validators, validateRenderOptions };
