var ChildProcess = require('child_process')
var http = require('http')
var path = require('path')

function ChromeDriver (options) {
  options = options || {}

  this.host = options.host
  this.port = options.port

  this.path = path.join(__dirname, '..', 'node_modules', '.bin', 'chromedriver')
  this.urlBase = '/wd/hub'
  this.statusUrl =  'http://' + this.host + ':' + this.port + this.urlBase + '/status'
}

ChromeDriver.prototype.start = function () {
  if (this.process) throw new Error('ChromeDriver already started')

  var args = [
    '--port=' + this.port,
    '--url-base=' + this.urlBase
  ]
  var options = {
    cwd: process.cwd(),
    env: process.env
  }
  this.process = ChildProcess.spawn(this.path, args, options)

  var self = this
  global.process.on('exit', function () { self.stop() })
}

ChromeDriver.prototype.stop = function () {
  if (this.process) this.process.kill()
  this.process = null
}

ChromeDriver.prototype.isRunning = function (callback) {
  http.get(this.statusUrl, function (response) {
    callback(response.statusCode === 200)
  }).on('error', function () {
    callback(false)
  })
}

module.exports = ChromeDriver