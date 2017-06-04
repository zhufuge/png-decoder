const fs = require('fs'),
      readSync = fs.readSync;

function isPNG(filepath) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const buf = Buffer.alloc(8);
  try {
    const fd = fs.openSync(filepath, 'r');
    readSync(fd, buf, 0, 8, 0);
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

  readSync(fd, data, 0, 13, 16);

  IHDR.width = data.readUInt32BE(0);
  IHDR.height = data.readUInt32BE(4);
  IHDR.bitDepth = data.readUInt8(8);
  IHDR.colourType = COLOUR_TYPE[data.readUInt8(9)];

  return IHDR;
}

function getPLTE(fd, pos) {

}

function getIDAT(fd, len, pos) {
  const data = Buffer.alloc(len);
  readSync(fd, data, 0, len, pos + 8);

  const arr = [];
  for (let v of data) {
    arr.push(v);
  }
  console.log(arr);
//  console.log(data);
}

function getpHYs(fd, len, pos) {
  const data = Buffer.alloc(len);
  readSync(fd, data, 0, len, pos + 8);

  const x = data.readUInt32BE(0),
        y = data.readUInt32BE(4),
        i = data.readUInt8(8);
//  console.log(x, y, i);
}

function decode(filepath) {
  if (!isPNG(filepath)) throw Error(filepath + ' is not a PNG');
  const fd = fs.openSync(filepath, 'r');
  const png = {};

  Object.assign(png, getIHDR(fd));

  let pos = 33,
      chunkLenAndType = Buffer.alloc(8),
      len,
      type,
      cCRC = Buffer.alloc(4);
  while (type !== 'IEND') {
    readSync(fd, chunkLenAndType, 0, 8, pos);
    len = chunkLenAndType.readUInt32BE();
    type = chunkLenAndType.toString('ascii').slice(4);

//    console.log(len, type);

    switch (type) {
    case 'IDAT':
      getIDAT(fd, len, pos);
      break;
    case 'pHYs':
      getpHYs(fd, len, pos);
      break;
    default:
      break;
    }
    pos += 8 + len + 4;
  }

  return png;
}

function Png() {}

Png.decode = decode;

module.exports = Png;

Png.decode('./test/1.png');
Png.decode('./test/2.png');
Png.decode('./test/3.png');
Png.decode('./test/4.png');
