const { TSBufferProtoGenerator } = require('tsbuffer-proto-generator')
const glob = require('glob')
const path = require('path')
const fs = require('fs')

async function main() {
  const generator = new TSBufferProtoGenerator({
    baseDir: path.resolve(__dirname, '..', 'controller'),
    verbose: true,
  })

  const files = glob.sync('**/*.ts', {
    cwd: path.resolve(__dirname, '..', 'controller'),
  })
  console.log('Files: ', files)

  const result = await generator.generate(files)

  fs.writeFileSync(path.resolve(__dirname, 'gen.json'), JSON.stringify(result, null, 2))
}
main()
