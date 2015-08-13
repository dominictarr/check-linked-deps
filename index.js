#! /usr/bin/env node

var pull = require('pull-stream')
var pfs = require('pull-fs')
var glob = require('pull-glob')
var path = require('path')
var cont = require('cont')
var paramap = require('pull-paramap')
var stringify = require('pull-stringify')
var toPull = require('stream-to-pull-stream')
var explain = require('explain-error')

var fs = require('fs')
var cp = require('child_process')
var read = cont(fs.readFile)
var exec = cont(cp.exec)
var realpath = cont(fs.realpath)

pull(
  glob('**/node_modules/*/.git'),
  paramap(function (gitdir, cb) {
    var dir = path.resolve(gitdir, '..')
    var opts = {cwd: dir, encoding: 'utf8'}
    cont.para({
      dep: function (cb) { cb(null, dir) },
      dir: realpath(dir),
      branch: read(path.join(gitdir, 'HEAD'), 'utf8'),
      dirty: exec('git status --p', opts)
    }) (cb)
  }),
  pull.map(function (d) {
    var dirty = d.dirty.split('\n')
    return {
      dep: path.relative(process.cwd(), d.dep),
      dir: path.relative(process.cwd(), d.dir),
      branch: d.branch.replace(/^.*\//, '').trim(),
      dirty: dirty.map(function (e) {
        var x = /^ M (.+)/.exec(e)
        return x && x[1]
      }).filter(Boolean),
      untracked: dirty.map(function (e) {
        var x = /^ \?\? (.+)/.exec(e)
        return x && x[1]
      }).filter(Boolean)
    }
  }),
  stringify('', '\n', '\n\n', 2, JSON.stringify),
  toPull.sink(process.stdout, function (err) {
    if(err) throw explain(err, 'reading stream failed')
    process.exit()
  })
)
