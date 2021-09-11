'use strict'

let mapping = {}

const splitWithSpace = (s) => (s ? s.split(' ') : [])

const toArray = (a) => (Array.isArray(a) ? a : [a])

function parseTokens(tokens) {
  tokens.forEach((token, index) => {
    if (/(_open$|image)/.test(token.type)) {
      const orig = splitWithSpace(token.attrGet('class'))
      token.attrSet('class', [...orig, token.tag].join(' '))

      // if (!['h1', 'h2', 'h3', 'img', 'p', 'table', 'pre', 'ol', 'ul'].includes(token.tag))
      //   return token.attrSet('class', [...orig, token.tag].join(' '))

      // token.attrSet('class', [...orig, token.tag, 'anchor'].join(' '))

      // token.attrJoin('id', `anchor_${index}_${token.tag}`)

      // if (tokens[index + 1] && tokens[index + 1].children) {
      //   const title = tokens[index + 1].children
      //     .filter(token => token.type === 'text' || token.type === 'code_inline')
      //     .reduce((acc, t) => acc + t.content, '')
      //   console.log(title, index + 1)
      // }

      // function idInjector(params) {}
    }
    if (token.children) {
      parseTokens(token.children)
    }

    // console.log(token);
  })
}

function parseState(state) {
  parseTokens(state.tokens)
}

function markdownitAddTagToClass(md, _mapping) {
  mapping = _mapping || {}
  md.core.ruler.push('markdownit-tag-to-class', parseState)
}

module.exports = markdownitAddTagToClass
