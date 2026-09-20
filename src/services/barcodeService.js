'use strict';
const bwipjs = require('bwip-js');
const FORMAT_MAP = { code128:'code128',code39:'code39',ean13:'ean13',ean8:'ean8',upca:'upca',upce:'upce','interleaved2of5':'interleaved2of5','gs1-128':'gs1-128',pdf417:'pdf417',datamatrix:'datamatrix' };

const generateBarcode = async (q, opts={}) => {
  const fmt = (q.format||'code128').toLowerCase();
  const enc = FORMAT_MAP[fmt];
  if(!enc){ const e=new Error(`Unsupported barcode format: ${fmt}`); e.statusCode=400; throw e; }
  const scale = opts.size ? Math.max(1,Math.round(opts.size/100)) : 3;
  return bwipjs.toSVG({ bcid:enc, text:q.text, scale, height:10, includetext:q.includetext!=='false', textxalign:'center', barcolor:(opts.darkColor||'#000000').replace('#',''), backgroundcolor:(opts.lightColor||'#ffffff').replace('#','') });
};
module.exports = { generateBarcode };
