import { previous_month } from './previous_month'

export const previous_year = (date: any) =>
  previous_month(date) === 12 ? date.bsYear - 1 : date.bsYear
