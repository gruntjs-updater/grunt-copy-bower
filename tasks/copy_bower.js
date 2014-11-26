/**
 * Copyright (C) 2014 yanni4night.com
 * copy_bower.js
 *
 * changelog
 * 2014-11-26[11:43:14]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */


'use strict';

var bower = require('bower'),
  path = require('path'),
  fs = require('fs');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('copy_bower', 'A grunt plugin that copies bower component files to wherever you want.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      shim: {}
    });

    var dest = this.data.dest;

    if (!dest || dest.constructor !== String) {
      grunt.fail.log('"dest" should be a string');
    }
    if (fs.existsSync(dest) && fs.lstatSync(dest).isFile()) {
      grunt.fail.log('"dest" should be a directory path');
    }

    var done = this.async(); //This task is asynchronous

    var pushDependency = function(pkg, depsCollection) {
      var deps = pkg.dependencies || {};
      var keys = Object.keys(deps);
      keys.forEach(function(key, idx) {
        var dep = deps[key];
        var mains = []

        dep.pkgMeta = dep.pkgMeta || {};

        mains = Array.isArray(dep.pkgMeta.main) ? dep.pkgMeta.main : [dep.pkgMeta.main];

        mains.forEach(function(main) {
          depsCollection.push({
            dir: dep.canonicalDir,
            main: main || options.shim[key],
            version: dep.pkgMeta.version,
            name: key
          });
        });
        pushDependency(dep, depsCollection);
      });

      return depsCollection;
    };

    var copy = function(depsCollection) {

      depsCollection.forEach(function(dep) {
        if (dep.main) {
          var src = path.join(dep.dir, dep.main);
          var dst = path.join(dest, dep.main);
          grunt.file.write(dst, grunt.file.read(src));
        } else {
          grunt.fail.warn('No main file found in "' + dep.name + '"');
        }
      });
    };

    bower.commands.list(null, {
      offline: true
    }).on('end', function(installed) {
      var depsCollection = [];
      pushDependency(installed, depsCollection);
      copy(depsCollection);
      done();
    });

  });

};