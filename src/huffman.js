const fs = require('fs');

function huffman(probabilities) {
  function createTree(probabilities) {
    function binaryInsert(sub, bTree) {
      const len = bTree.length,
            weight = sub[0];
      if (len === 0) {
        bTree.push(sub);
        return ;
      }

      let left = 0,
          right = len - 1;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2),
              midWeight = bTree[mid][0];

        if (weight > midWeight) {
          left = mid + 1;
        } else if (weight < midWeight){
          right = mid - 1;
        } else {
          bTree.splice(mid, 0, sub);
          return ;
        }
      }

      bTree.splice(left, 0, sub);
    }

    const bTree = [];
    for (let key in probabilities) {
      bTree.push([probabilities[key], key]);
    }

    bTree.sort((a, b) => a[0] - b[0]);

    while (bTree.length > 1) {
      const a = bTree.shift(),
            b = bTree.shift();
      binaryInsert([a[0] + b[0], a, b], bTree);
    }
    return bTree[0];
  }

  function encodeTree(tree) {
    function encodeTreeIter(tree, str, huf) {
      if (typeof tree[1] === 'string') {
        huf[tree[1]] = str;
      } else {
        encodeTreeIter(tree[1], str + '0', huf);
        encodeTreeIter(tree[2], str + '1', huf);
      }
    }

    const huf = {};
    encodeTreeIter(tree, '', huf);
    return huf;
  }

  return encodeTree(createTree(probabilities));
}

function huffmanEncode(input, output) {
  const data = fs.readFileSync(input),
        probabilities = {};
  data.forEach(weight =>
               probabilities[weight] = probabilities[weight]
               ? probabilities[weight] + 1
               : 1);

  const huf = huffman(probabilities),
        fd = fs.openSync(output, 'w');

  let byte = '';
  data.forEach(weight => {
    byte += huf[weight];
    if (byte.length >= 8) {
      const buf = Buffer.alloc(1, parseInt(byte.substr(0, 8), 2));
      fs.writeSync(fd, buf);
      byte = byte.substr(8);
    }
  });

  for (let i = byte.length; i <= 8; i++) {
    byte += '0';
  }

  fs.writeSync(fd, Buffer.alloc(1, parseInt(byte, 2)));
}

huffmanEncode('./huffman.js', 'huffman.huf');
