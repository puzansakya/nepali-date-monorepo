import { DATE_FUNCTION } from '../../domains'
import { get_day_info } from './get_day_info'
import { get_eng_day_info } from './get_eng_day_info'
import { get_first_day_of_the_month } from './get_first_day_of_the_month'
import { get_next_decade_date } from './get_next_decade_date'
import { get_next_month_date } from './get_next_month_date'
import { get_next_year_date } from './get_next_year_date'
import { get_normalized_date } from './get_normalized_date'
import { get_previous_decade_date } from './get_previous_decade_date'
import { get_previous_month_date } from './get_previous_month_date'
import { get_previous_year_date } from './get_previous_year_date'
import { get_total_days_in_month } from './get_total_days_in_month'
import { get_weeks_in_month } from './get_weeks_in_month'
import { is_date_valid } from './is_date_valid'
import { is_today } from './is_today'
import { validate_date_in_range } from './validate_date_in_range'

export const ENGLISH_DATE: DATE_FUNCTION = {
  get_number_of_days_in_BS_month: undefined,
  previous_month: undefined,
  previous_month_days: undefined,
  previous_year: undefined,
  get_day_info,
  get_first_day_of_the_month,
  get_total_days_in_month,
  get_weeks_in_month,
  get_normalized_date,
  get_eng_day_info,
  get_next_month_date,
  get_previous_month_date,
  get_next_year_date,
  get_previous_year_date,
  get_previous_decade_date,
  get_next_decade_date,
  is_today,
  is_date_valid,
  validate_date_in_range,
}
