const fs = require('fs');

function huffman(freq) {
  function createTree(freq) {
    function insertTree(sub, bTree) {
      const len = bTree.length,
            v = sub[0];
      if (len === 0) {
        bTree.push(sub);
        return ;
      }

      let left = 0,
          right = len - 1;
      while (left <= right && left >= 0 && right < len) {
        const mid = Math.floor((left + right) / 2),
              vm = bTree[mid][0];

        if (v > vm) {
          left = mid + 1;
        } else if (v < vm){
          right = mid - 1;
        } else {
          bTree.splice(mid, 0, sub);
          return ;
        }
      }

      bTree.splice(left, 0, sub);
    }

    const bTree = [];
    for (let key in freq) {
      bTree.push([freq[key], key]);
    }

    bTree.sort((a, b) => a[0] - b[0]);

    while (bTree.length > 1) {
      const a = bTree.shift(),
            b = bTree.shift();
      insertTree([a[0] + b[0], [a, b]], bTree);
    }
    return bTree[0];
  }

  function encodeTree(tree) {
    function encodeTreeIter(tree, str, huf) {
      if (typeof tree[1] === 'string') {
        huf[tree[1]] = str;
      } else {
        encodeTreeIter(tree[1][0], str + '0', huf);
        encodeTreeIter(tree[1][1], str + '1', huf);
      }
    }

    const huf = {};
    encodeTreeIter(tree, '', huf);
    return huf;
  }

  return encodeTree(createTree(freq));
}

function huffmanEncode(input, output) {
  const data = fs.readFileSync(input),
        freq = {};
  data.forEach(v => freq[v] = freq[v] ? freq[v] + 1 : 1);

  const huf = huffman(freq),
        fd = fs.openSync(output, 'w');

  let byte = '';
  data.forEach(v => {
    byte += huf[v];
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
