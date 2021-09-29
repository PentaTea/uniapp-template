module.exports = {
  outDir: './dist',
  esbuild: {
    // minify: true,
    target: 'es2015',
    format: 'esm',
  },
  assets: {
    baseDir: 'src',
    filePatterns: ['**/*.json'],
  },
}
