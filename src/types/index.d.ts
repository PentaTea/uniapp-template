declare const __wxConfig: any

declare module '*.vue' {
  import { Vue } from 'vue-property-decorator'
  export default Vue
}
declare module '*.md' {
  const content: string
  export default content
}
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'

declare module '@rollup/pluginutils' {
  type FilterPattern = any
  export { FilterPattern }
}
