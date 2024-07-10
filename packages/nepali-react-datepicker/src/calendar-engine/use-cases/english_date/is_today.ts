// migrated
import dayjs from 'dayjs'

export const is_today = (date: Date) => {
  const currentDate = dayjs()
  const providedDate = dayjs(date)
  return providedDate.isSame(currentDate, 'day')
}
