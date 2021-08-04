import config from '@app/app.config'
import { dayjs } from './time'
import page from './page'
import modal from './modal'
import './__helper'

export const utils = {
  config,
  time: dayjs,
  ...page,
  ...modal,
}

Object.assign(app, utils)
