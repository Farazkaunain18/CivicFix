const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, r, g, b, a) {
  // 1. Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // 2. IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type (RGBA)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // 3. IDAT Chunk (Scanlines)
  // Each scanline: 1 byte filter (0) + width * 4 bytes (RGBA)
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLength * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width / 2 - 4;
  const crossThickness = width * 0.22;
  const crossLength = width * 0.65;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // None filter

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Check if inside circle
      if (dist <= radius) {
        // Check if inside cross
        const inHoriz = Math.abs(dy) <= crossThickness / 2 && Math.abs(dx) <= crossLength / 2;
        const inVert = Math.abs(dx) <= crossThickness / 2 && Math.abs(dy) <= crossLength / 2;

        if (inHoriz || inVert) {
          // Cross: Mint / White (#CCFBF1)
          rawData[pxOffset] = 204;
          rawData[pxOffset + 1] = 251;
          rawData[pxOffset + 2] = 241;
          rawData[pxOffset + 3] = 255;
        } else {
          // Circle background: Teal (#0F766E)
          rawData[pxOffset] = 15;
          rawData[pxOffset + 1] = 118;
          rawData[pxOffset + 2] = 110;
          rawData[pxOffset + 3] = 255;
        }
      } else {
        // Transparent outside
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);

  // 4. IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.slice(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// CRC32 table & calculator
let crcTable = null;
function getCrcTable() {
  if (crcTable) return crcTable;
  crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }
  return crcTable;
}

function crc32(buf) {
  const table = getCrcTable();
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createPng(192, 192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createPng(512, 512));
console.log('Generated icon-192.png and icon-512.png successfully!');
