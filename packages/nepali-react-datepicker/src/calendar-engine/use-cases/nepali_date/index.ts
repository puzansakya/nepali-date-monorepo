import { get_weeks_in_month } from './get_weeks_in_month'
import { get_normalized_date } from './get_normalized_date'
import { get_day_info } from './get_day_info'
import { previous_month_days } from './previous_month_days'
import { previous_month } from './previous_month'
import { get_number_of_days_in_BS_month } from './get_number_of_days_in_BS_month'
import { previous_year } from './previous_year'
import { is_date_valid } from './is_date_valid'
import { DATE_FUNCTION } from '../../domains'

export const NEPALI_DATE: DATE_FUNCTION = {
  get_eng_day_info: undefined,
  get_first_day_of_the_month: undefined,
  get_next_decade_date: undefined,
  get_next_month_date: undefined,
  get_next_year_date: undefined,
  get_previous_decade_date: undefined,
  get_previous_month_date: undefined,
  get_previous_year_date: undefined,
  get_total_days_in_month: undefined,
  is_today: undefined,
  get_day_info,
  get_normalized_date,
  get_number_of_days_in_BS_month,
  get_weeks_in_month,
  previous_month,
  previous_month_days,
  previous_year,
  is_date_valid,
  validate_date_in_range: () => {},
}
