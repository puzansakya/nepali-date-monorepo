// migrated
import dayjs from 'dayjs'

export const get_previous_decade_date = (date: any) => {
  return dayjs(date).subtract(10, 'year').format('YYYY-MM-DD')
}
