// migrated
import dayjs from 'dayjs'

export const get_next_month_date = (date: any) => {
  return dayjs(date).add(1, 'month').format('YYYY-MM-DD')
}
