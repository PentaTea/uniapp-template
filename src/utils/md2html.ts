import hanabi from '@app/common/hanabi'
// const markdownItClass = require('@toycode/markdown-it-class')
// import tagMap from './htmlRenderer/tagMap'
import markdownItColor from './md2html/markdown-it-color'
// const uslugify = s => require('uslug')(s)
const md = require('@app/common/markdown-it')({
  html: true,
  linkify: true,
  highlight: function(str: any) {
    return '<pre class="pre"><code class="code">' + hanabi(str) + '</code></pre>'
  },
})
  .use(require('./md2html/markdownitAddTagToClass'))
  .use(require('./md2html/markdown-it-checkbox'), {
    divWrap: true,
    divClass: 'checkbox',
  })
  .use(markdownItColor, {
    inline: true,
  })
// .use(require('./htmlRenderer/markdownItAnchor'), {
//   // slugify: uslugify
//   permalink: true
// })

//相对连接注入
md.renderer.rules.image = function(tokens, idx, options, env, slf) {
  var token = tokens[idx]

  token.attrs[token.attrIndex('alt')][1] = slf.renderInlineAsText(token.children, options, env)
  token.attrs[token.attrIndex('src')][1] = env.a2rUrl(token.attrs[token.attrIndex('src')][1])

  return slf.renderToken(tokens, idx, options, env, slf)
} as (...args: any[]) => any

md.renderer.rules.link_open = function(tokens, idx, options, env, slf) {
  var token = tokens[idx]

  token.attrs[token.attrIndex('href')][1] = env.a2rUrl(token.attrs[token.attrIndex('href')][1])

  return slf.renderToken(tokens, idx, options)
} as (...args: any[]) => any

export default function renderer(
  str: string,
  env?: {
    baseURL: string
  }
) {
  return md.render(str, {
    a2rUrl: (url: string) => {
      if (env && env.baseURL) return new URL(url, env.baseURL).href
      else return url
    },
    ...env,
  })
}
