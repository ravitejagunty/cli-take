#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const Request = require('request')
const expandTilde = require('expand-tilde')

const package = require('./package.json')
const config = require('./config')
const track = require('./components/keen')
const log = require('./components/log')

const request = Request.defaults({
  headers: {'User-Agent': 'tank/' + package.version}
})

track('executions', {
  version: package.version,
  node: process.version,
  platform: process.platform
})

if(process.argv.length < 3) {
  console.log('usage: tank [path_to_file] [path_to_another_file]...[path_to_last_file]')
  process.exit()
}

const files = process.argv.slice(2)
  .map(filename => path.resolve(expandTilde(filename)))


files.forEach(filePath => track('files', {
  ext: path.extname(filePath)
}))

process.stdout.write(`Uploading ${files.length} file${files.length > 1 ? 's' : ''}...`);
intervalId = setInterval(function() { process.stdout.write('.'); }, 3000);

request.post({
  url: config.server,
  formData: {uploads: files.map(filePath => fs.createReadStream(filePath))}
}, function optionalCallback(err, httpResponse, body) {
  clearInterval(intervalId)
  process.stdout.write('\nDone.')
  if (err) {
    handleError(err)
  } else {
    console.log(body)
  }
});

function handleError(e) {
  console.error(e)
  track('errors', e, function() {
    log('error', `Tank encountered an error! Please report this at https://github.com/tankfs/tank-cli/`)
    process.exit(1)
  })
}
