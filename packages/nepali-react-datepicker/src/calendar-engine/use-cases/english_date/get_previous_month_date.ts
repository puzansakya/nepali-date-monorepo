// migrated
import dayjs from 'dayjs'

export const get_previous_month_date = (date: any) => {
  return dayjs(date).subtract(1, 'month').format('YYYY-MM-DD')
}
