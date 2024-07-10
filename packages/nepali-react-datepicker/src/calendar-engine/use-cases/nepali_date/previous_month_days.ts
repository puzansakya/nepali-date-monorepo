import { lookUp } from 'nepali-dayjs-date-converter'
import * as from_constants from '../../constants'
import { previous_month } from './previous_month'
import { previous_year } from './previous_year'

export const previous_month_days = (date: any) =>
  previous_year(date) >= from_constants.minBSYear
    ? lookUp.queryDays(previous_year(date), previous_month(date))
    : 30
