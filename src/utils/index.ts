import { dayjs } from './time'
import page from './page'
import modal from './modal'
import './__helper'

export const utils = {
  time: dayjs,
  ...page,
  ...modal,
}

Object.assign(app, utils)
