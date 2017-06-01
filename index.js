const fs = require('fs'),
      path = require('path');

function isPNG(filepath) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const buf = Buffer.alloc(8);
  try {
    const fd = fs.openSync(filepath, 'r');
    fs.readSync(fd, buf, 0, 8, 0);
  } finally {
    return buf.compare(signature) === 0;
  }
}

const COLOUR_TYPE = {
  0: 'G',
  2: 'RGB',
  3: 'I',
  4: 'GA',
  6: 'RGBA',
};

function getIHDR(fd) {
  const IHDR = {},
        data = Buffer.alloc(13);

  fs.readSync(fd, data, 0, 13, 16);

  IHDR.width = data.readUInt32BE(0);
  IHDR.height = data.readUInt32BE(4);
  IHDR.bitDepth = data.readUInt8(8);
  IHDR.colourType = COLOUR_TYPE[data.readUInt8(9)];

  return IHDR;
}

function decode(filepath) {
  if (!isPNG(filepath)) throw Error(filepath + ' is not a PNG');
  const fd = fs.openSync(filepath, 'r');
  const png = {};

  Object.assign(png, getIHDR(fd));

  return png;
}

function Png() {}

Png.decode = decode;

module.exports = Png;
