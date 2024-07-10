// migrated
import dayjs from 'dayjs'

export const get_next_year_date = (date: any) => {
  return dayjs(date).add(1, 'year').format('YYYY-MM-DD')
}
