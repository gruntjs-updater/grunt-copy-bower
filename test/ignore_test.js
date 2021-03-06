'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
var fs = require('fs');
var path = require('path');

exports.copy_bower = {
  setUp: function(done) {
    done();
  },
  test: function(test) {
    var files = ['bootstrap.js','bootstrap.css', 'bootstrap.less', 'glyphicons-halflings-regular.ttf'];

    test.expect(files.length);

    files.forEach(function(file) {
      test.ok(!fs.existsSync(path.join(__dirname, 'dest', file)), file + ' should NOT exist');
    });

    test.done();
  }
};