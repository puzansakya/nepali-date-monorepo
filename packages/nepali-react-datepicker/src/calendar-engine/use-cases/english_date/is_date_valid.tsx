import * as fromCalendarEngine from '../..'
import dayjs from 'dayjs'

export function is_date_valid(val: any) {
  const MAX_YEAR_LIMIT = fromCalendarEngine.maxADYear
  const MIN_YEAR_LIMIT = fromCalendarEngine.minADYear

  const splitted_dates = val.split('-')

  return (
    parseInt(splitted_dates[0]) < MAX_YEAR_LIMIT &&
    parseInt(splitted_dates[0]) > MIN_YEAR_LIMIT &&
    dayjs(val, 'YYYY-MM-DD', true).isValid()
  )
}
