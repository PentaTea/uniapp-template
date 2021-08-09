import config from '@app/app.config'
import { dayjs } from './time'
import * as chroma from 'chroma.ts'
import page from './page'
import modal from './modal'
import randomcolor from 'randomcolor'
import './__helper'

export const utils = {
  config,
  temp: {}, //临时全局变量
  time: dayjs,
  color: ((chroma.color['__proto__'] = chroma) && chroma.color) as typeof chroma &
    typeof chroma.color,
  randomcolor,
  ...page,
  ...modal,
}

Object.assign(app, utils)
