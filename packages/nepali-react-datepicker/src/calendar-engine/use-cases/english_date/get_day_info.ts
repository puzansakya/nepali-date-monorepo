// LIBS
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { englishToNepaliNumber } from 'nepali-number'

// UTILITIES
import { ENGLISH_DATE } from '.'
import { DATE_NULLIFIER, Iget_day_info } from '../../domains'
import * as fromCalendarEngine from '../../index'
import * as from_utilities from '../../utilities'
import { get_first_day_of_the_month } from './get_first_day_of_the_month'
import { is_today } from './is_today'
import { check_if_in_range } from '../../../utilities'
import { ad2bs, isDateInConversionRange } from 'nepali-dayjs-date-converter'

dayjs.extend(isBetween)

const ADToBS = ad2bs
export const get_day_info = ({
  calendarReferenceDate,
  weekDayNum,
  weekNum,
  disable_date_after,
  disable_date_before,
  disabledWeekDays,
  holidays,
  date,
}: Iget_day_info): // weekNum: any,
// weekDayNum: any,
// calendar_date: any,
// input_date?: any,
// disable_date_before?: any,
// disable_date_after?: any,
// disabledWeekDays?: number[],
// holidays?: string[],
fromCalendarEngine.IDayInfo => {
  const calendar_date = calendarReferenceDate
  const input_date = date

  const formattedDate = calendar_date
    ? dayjs(calendar_date).format('YYYY-MM-DD')
    : dayjs().format('YYYY-MM-DD')
  const inputDate: Date = new Date(formattedDate)

  const firstDay: number = get_first_day_of_the_month(inputDate)

  let primaryDay = weekNum * 7 + weekDayNum - firstDay
  let primaryMonth: number = inputDate.getMonth() + 1
  let primaryYear: number = inputDate.getFullYear()

  const total_no_of_days_in_this_month = ENGLISH_DATE.get_total_days_in_month(
    new Date(formattedDate),
  )

  let isCurrentMonth = true

  // DERIEVE PRIMARY DATE INFO
  if (primaryDay <= 0) {
    primaryYear = primaryMonth === 1 ? primaryYear - 1 : primaryYear
    primaryMonth = primaryMonth === 1 ? 12 : primaryMonth - 1

    // DERIVE CURRENT MONTH FLAG
    isCurrentMonth = false

    const stiched = from_utilities.stitch_date({
      year: primaryYear,

      month: primaryMonth,

      day: 1,
    })

    const total_no_of_days_in_previous_month = ENGLISH_DATE.get_total_days_in_month(
      new Date(stiched),
    )

    primaryDay = total_no_of_days_in_previous_month + primaryDay
  } else if (primaryDay > total_no_of_days_in_this_month) {
    primaryYear = primaryMonth === 12 ? primaryYear + 1 : primaryYear
    primaryMonth = primaryMonth === 12 ? 1 : primaryMonth + 1
    primaryDay = primaryDay - total_no_of_days_in_this_month

    // DERIVE CURRENT MONTH FLAG
    isCurrentMonth = false
  }

  const latest_stiched_date = from_utilities.stitch_date({
    year: primaryYear,
    month: primaryMonth,
    day: primaryDay,
  })

  let converted_nepali_date = `${DATE_NULLIFIER}-${DATE_NULLIFIER}-${DATE_NULLIFIER}`

  // converted_nepali_date = ADToBS(latest_stiched_date) as string;

  if (isDateInConversionRange(latest_stiched_date, false)) {
    converted_nepali_date = ADToBS(latest_stiched_date) as string
  }

  const [nepali_year, nepali_month, nepali_day] = converted_nepali_date?.split('-') ?? []

  // DERIVE TODAY FLAG
  const isToday = is_today(new Date(latest_stiched_date))

  // DERIVE SELECTED FLAG
  let isSelected = false

  if (input_date) {
    isSelected = dayjs(latest_stiched_date).isSame(dayjs(input_date), 'day')
  }

  // DERIVE DISABLED FLAG
  const isDayOff =
    (disabledWeekDays ?? []).includes(weekDayNum) || (holidays ?? []).includes(latest_stiched_date)
  const is_in_range = check_if_in_range(
    latest_stiched_date,
    disable_date_before,
    disable_date_after,
  ) //dayjs(latest_stiched_date).isBetween(disable_date_before, disable_date_after, 'day', '[]')

  const isDisabled = !isCurrentMonth || !is_in_range || isDayOff

  return {
    workingDay: primaryDay,
    workingMonth: primaryMonth,
    workingYear: primaryYear,

    primaryDay: primaryDay,
    primaryMonth: primaryMonth,
    primaryYear: primaryYear,

    secondaryYear:
      nepali_year === DATE_NULLIFIER
        ? nepali_year
        : (englishToNepaliNumber(parseInt(nepali_year)) as string),
    secondaryMonth:
      nepali_month === DATE_NULLIFIER
        ? nepali_year
        : (englishToNepaliNumber(parseInt(nepali_month)) as string),
    secondaryDay:
      nepali_day === DATE_NULLIFIER
        ? nepali_year
        : (englishToNepaliNumber(parseInt(nepali_day)) as string),

    isCurrentMonth,
    isToday,
    isSelected,
    isDisabled,
    isDayOff,
  }
}
