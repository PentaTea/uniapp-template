const config = require('../src/app.config.js')
const is = require('is')

module.exports = function(source) {
  const isPage = new RegExp(`src\/${config.root || 'pages'}\/[^\/]*\/[^\/]*\.vue`)
  if (isPage.test(this.resourcePath)) {
    const field = config.rootFontSizeField || 'app.Global.rootFontSize'
    return source.replace(
      '<template>',
      `<template><page-meta :root-font-size="a((${field}?${field}+'px':'')||'system')" />`
    )
  } else return source
}
