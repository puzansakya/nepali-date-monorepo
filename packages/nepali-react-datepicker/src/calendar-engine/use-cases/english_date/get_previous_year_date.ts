// migrated
import dayjs from 'dayjs'

export const get_previous_year_date = (date: any) => {
  return dayjs(date).subtract(1, 'year').format('YYYY-MM-DD')
}
