import dayjs from 'dayjs'
import { englishToNepaliNumber } from 'nepali-number'
import { NEPALI_DATE } from '.'
import { Iget_day_info } from '../../domains'
import * as fromCalendarEngine from '../../index'
import * as from_utilities from '../../utilities'
import { ENGLISH_DATE } from '../english_date'
import { check_if_in_range } from '../../../utilities'
import { ad2bs } from 'nepali-dayjs-date-converter'

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
}: Iget_day_info): fromCalendarEngine.IDayInfo => {
  const firstAdDay = calendarReferenceDate.firstAdDayInBSMonth.getDay()

  let primaryDay = weekNum * 7 + weekDayNum - firstAdDay
  let primaryMonth = calendarReferenceDate.bsMonth

  const primaryYear = calendarReferenceDate.bsYear

  let isCurrentMonth = true

  if (primaryDay <= 0) {
    primaryDay = NEPALI_DATE.previous_month_days(calendarReferenceDate) + primaryDay
    isCurrentMonth = false
    primaryMonth = calendarReferenceDate.bsMonth === 1 ? 12 : calendarReferenceDate.bsMonth - 1
  } else if (primaryDay > calendarReferenceDate.numberOfDaysInBSMonth) {
    primaryDay = primaryDay - calendarReferenceDate.numberOfDaysInBSMonth
    isCurrentMonth = false
    primaryMonth = calendarReferenceDate.bsMonth === 12 ? 1 : calendarReferenceDate.bsMonth + 1
  }

  const today = from_utilities.split_date(ADToBS(dayjs().format('YYYY-MM-DD')) as string)

  const isToday = isCurrentMonth
    ? today.day === primaryDay &&
      today.month === calendarReferenceDate.bsMonth &&
      today.year === calendarReferenceDate.bsYear
    : false
  let isSelected = false

  if (date) {
    isSelected = isCurrentMonth
      ? date.bsDay === primaryDay &&
        date.bsMonth === calendarReferenceDate.bsMonth &&
        date.bsYear === calendarReferenceDate.bsYear
      : false
  }

  const engDayInfo = ENGLISH_DATE.get_eng_day_info(primaryYear, primaryMonth, primaryDay)
  const eng_disable_date_before = disable_date_before || ''
  const eng_disable_date_after = disable_date_after || ''

  const latest_eng_stiched_date = from_utilities.stitch_date({
    year: engDayInfo.engYear,
    month: engDayInfo.engMonth,
    day: engDayInfo.engDay,
  })

  // TODO: MOVE THIS TO CALENDAR ENGINE UTILS LATER
  const is_in_range = check_if_in_range(
    latest_eng_stiched_date,
    eng_disable_date_before,
    eng_disable_date_after,
  )

  const isDayOff =
    (disabledWeekDays ?? []).includes(weekDayNum) ||
    (holidays ?? []).includes(latest_eng_stiched_date)

  const isDisabled = !isCurrentMonth || !is_in_range || isDayOff

  return {
    workingDay: engDayInfo.engDay,
    workingMonth: engDayInfo.engMonth,
    workingYear: engDayInfo.engYear,
    primaryDay: englishToNepaliNumber(primaryDay),
    primaryMonth: englishToNepaliNumber(primaryMonth),
    primaryYear: englishToNepaliNumber(primaryYear),
    secondaryDay: engDayInfo.engDay,
    secondaryMonth: engDayInfo.engMonth,
    secondaryYear: engDayInfo.engYear,
    isCurrentMonth,
    isToday,
    isSelected,
    isDisabled,
    isDayOff,
  }
}
