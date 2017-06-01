const Png = require('..'),
      assert = require('assert'),
      path = require('path');

describe('decode', function() {
  it('e.png', function() {
    const e = {
      width: 16,
      height: 16,
      bitDepth: 16,
      colourType: 'RGBA'
    };

    const png = Png.decode(path.resolve(__dirname, './e.png'));
    assert.deepStrictEqual(e, png);
  });

  it('0.png', function() {
    const z = {
      width: 508,
      height: 512,
      bitDepth: 8,
      colourType: 'RGB'
    };

    const png = Png.decode(path.resolve(__dirname, './0.png'));
    assert.deepStrictEqual(z, png);
  });

  it('not exist', function() {
    assert.throws(function() {
      const png = Png.decode(path.resolve(__dirname, './a.txt'));
    }, Error);
  });

  it('is not a png', function() {
    assert.throws(function() {
      const png = Png.decode(path.resolve(__dirname, './index.js'));
    }, Error);
  });
});
