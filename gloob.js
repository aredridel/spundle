"use strict";
var glob = require('glob');
var async = require('async');
var iferr = require('iferr');
var path = require('path');
var spud = require('spud');
var fs = require('fs');

module.exports = function gloob(dir, cb) {
    var out = {};
    glob(path.resolve(dir, '**/*.properties'), {mark: true}, iferr(cb, function (ents) {
        async.eachLimit(ents, 10, function(ent, next) {
            fs.readFile(ent, 'utf-8', iferr(next, function (file) {
                out[path.relative(dir, ent)] = spud.parse(file);
                next();
            }));
        }, iferr(cb, function () {
            cb(null, out);
        }));
    }));
};
