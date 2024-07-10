// migrated
import dayjs from 'dayjs'

export const get_next_decade_date = (date: any) => {
  return dayjs(date).add(10, 'year').format('YYYY-MM-DD')
}
