const fs = require('fs'),
      process = require('process'),
      path = require('path');

function isPNG(filepath) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const buf = Buffer.alloc(8);
  try{
    const fd = fs.openSync(filepath, 'r');
    fs.readSync(fd, buf, 0, 8, 0);
  } finally {
    return buf.compare(signature) === 0;
  }
}

function decodePNG(filepath) {
  if (!isPNG(process.argv[2])) throw Error('');
}

if (process.argv.length >= 3) {
  console.log(decodePNG(process.argv[2]));
}
