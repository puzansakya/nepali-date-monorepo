import dayjs from 'dayjs'

export const debug_mode = true
/**
 * Global referece for today's date
 */
export const today = dayjs().format('YYYY-MM-DD')

export const ErrorMessage = {
  NOT_WITHIN_ALLOWED_RANGE: 'Date must be within allowed range',
  START_AND_END_DATE_BOUNDS: 'Start date must be before end date',
}
