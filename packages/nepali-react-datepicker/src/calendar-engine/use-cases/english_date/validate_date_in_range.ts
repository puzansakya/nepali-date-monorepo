// migrated
import dayjs from 'dayjs'

export const dateFormat = /^\d{4}-\d{2}-\d{2}$/

export const validate_date_in_range = (
  dateToValidate: string,
  disableDateBefore: string,
  disableDateAfter: string,
) => {
  let condition = dateFormat.test(dateToValidate)

  if (disableDateBefore) {
    condition = condition && dayjs(dateToValidate).isAfter(dayjs(disableDateBefore))
  }

  if (disableDateAfter) {
    condition = condition && dayjs(dateToValidate).isBefore(dayjs(disableDateAfter))
  }

  return condition
}
