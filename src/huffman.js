function huffman(freq) {
  const bTree = [];
  for (let key in freq) {
    bTree.push([freq[key], key]);
  }

  bTree.sort((a, b) => a[0] - b[0]);

  while (bTree.length > 1) {
    const a = bTree.shift(),
          b = bTree.shift();
    createTree([a[0] + b[0], [a, b]], bTree);
  }
  return encodeTree(bTree[0]);
}

function createTree(sub, bTree) {
  const len = bTree.length,
        v = sub[0];
  if (len === 0) {
    bTree.push(sub);
    return ;
  }
  if (v < bTree[0][0]) {
    bTree.unshift(sub);
    return ;
  }
  if (v > bTree[len - 1][0]) {
    bTree.push(sub);
    return ;
  }

  for (let i = 1; i < len; i++) {
    if (v > bTree[i - 1][0] && v <= bTree[i][0]) {
      bTree.splice(i, 0, sub);
      return ;
    }
  }
}

function encodeTree(tree) {
  const huf = {};
  encodeTreeIter(tree, '', huf);
  return huf;
}

function encodeTreeIter(tree, str, huf) {
  if (Number.isNaN(parseInt(tree[1][1]))) {
    huf[tree[1]] = str;
  } else {
    encodeTreeIter(tree[1][0], str + '0', huf);
    encodeTreeIter(tree[1][1], str + '1', huf);
  }
}

console.log(huffman({a: 6, b: 2, c: 3, d: 4, e: 5}));
