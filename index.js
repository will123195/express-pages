'use strict';

var ok = require('assert').ok
var express = require('express')
var bodyParser = require('body-parser')
var scan = require('sugar-glob')
var path = require('path')
var Page = require('express-page')
var hide = require('hide-property')

var Pages = module.exports = function Pages(opts) {
  if (!(this instanceof Pages)) {
    return new Pages(opts)
  }
  ok(opts.dir, 'opts.dir is required')
  this.init(opts)
  return this.app
}

Pages.prototype.init = function (opts) {

  var ext = opts.ext || '.js'
  var pattern = '**/*' + ext

  var root = path.dirname(module.parent.filename) + '/' + opts.dir
  root = path.normalize(root)

  var app = express()
  this.app = app

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  app.set('json spaces', 2)

  // log requests
  if (opts.log) {
    app.use(function (req, res, next) {
      opts.log(req.method, req.url)
      next()
    })
  }

  var pages = new scan({
    root: root
  })
  pages.file(pattern, function(file) {
    var uri = '/' + file.name
    uri = uri.substring(0, uri.lastIndexOf(ext))


    // $param to :param
    uri = uri.replace(/\$/g, ':')

    console.log('uri:', uri)

    var folders = uri.split(path.sep)
    if (folders[folders.length-1] === folders[folders.length-2]) {
      folders.pop()
      uri = folders.join(path.sep)
    }

    app.all(uri, function(req, res) {
      var controller = require(file.filename)
      var helpers = opts.helpers || {}
      helpers.post = req.body
      helpers.session = req.session
      var page = Page(controller, helpers, req, res)
      page.setView(file.dir)
      // make url params available as this.$param
      parseParams.call(page)
      hide(page, 'req')
      hide(page, 'res')
      page.send = page.res.send.bind(page.res)
      page.run()
    })

  })

}

function parseParams() {
  var self = this
  Object.keys(self.req.params).forEach(function(param) {
    self['$' + param] = self.req.params[param]
  })
}