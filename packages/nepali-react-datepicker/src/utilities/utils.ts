import dayjs from 'dayjs'

import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export const dateFormat = /^\d{4}-\d{2}-\d{2}$/

export function validate(val: string, disableDateBefore: string, disableDateAfter: string) {
  if (!val) {
    return {
      message: 'valid because no date is provided',
      is_valid: true,
    }
  }

  if (val.length >= 10) {
    val = val.slice(0, 10)
  }

  const is_date_format_valid = dateFormat.test(val)

  if (!is_date_format_valid) {
    return {
      message: 'Invalid format',
      is_valid: false,
    }
  }

  const is_date_valid = dayjs(val, 'YYYY-MM-DD', true).isValid()
  if (!is_date_valid) {
    return {
      message: 'Invalid date',
      is_valid: false,
    }
  }

  // [validation refactor]
  // if (+val.slice(0, 4) < 1900) {
  //     return {
  //         message: "Date is less than min date",
  //         is_valid: false,
  //     };
  // }

  // [validation refactor]
  // if (+val.slice(0, 4) > 2042) {
  //     return {
  //         message: "Date is greater than max date",
  //         is_valid: false,
  //     };
  // }

  const is_date_valid_inside_range = check_if_in_range(val, disableDateBefore, disableDateAfter)

  if (!is_date_valid_inside_range) {
    return {
      message: 'This date is out of range',
      is_valid: false,
    }
  }

  return {
    is_valid: true,
    message: '',
  }
}

export function check_if_in_range(
  value: string,
  disableDateBefore: string,
  disableDateAfter: string,
) {
  if (!disableDateBefore && !disableDateAfter) {
    return true
  }

  if (
    disableDateBefore &&
    disableDateAfter &&
    value &&
    dayjs(value).isSame(disableDateBefore) &&
    dayjs(value).isSame(disableDateAfter)
  ) {
    return true
  }

  if (disableDateBefore && dayjs(value).isBefore(disableDateBefore)) {
    return false
  }

  if (disableDateAfter && dayjs(value).isAfter(disableDateAfter)) {
    return false
  }

  return true

  // return dayjs(value).isBetween(disableDateBefore, disableDateAfter,  'day', '[]')

  // sus
  // console.log("check_if_in_range", {
  //     value, disableDateBefore, disableDateAfter
  // })
  // if (disableDateBefore && dayjs(value).isBefore(disableDateBefore)) {
  //     return false;
  // }

  // if (disableDateAfter && dayjs(value).isAfter(dayjs(disableDateAfter).subtract(1, "day"))) {
  //     return false;
  // }

  // return true;
}

export function get_year_list_in_decade(current_year: number, MAX_YEAR: number, MIN_YEAR: number) {
  // Calculate the start year of the current decade
  const startYear = Math.floor(current_year / 10) * 10

  // Create an array to store the years in the current decade
  const decadeYears = []

  // Add years from the start year to the start year + 9 (inclusive) to the array
  for (let year = startYear; year < startYear + 10; year++) {
    if (MAX_YEAR !== -1 && year < MAX_YEAR) {
      decadeYears.push(year)
    } else if (MIN_YEAR !== -1 && MIN_YEAR < year) {
      decadeYears.push(year)
    } else if (MAX_YEAR !== -1 && year < MAX_YEAR && MIN_YEAR !== -1 && MIN_YEAR < year) {
      decadeYears.push(year)
    }
  }

  return decadeYears
}

export function get_year_list_in_decade_for_en_ctx(current_year: number) {
  const startYear = Math.floor(current_year / 10) * 10

  const decadeYears = []

  for (let year = startYear; year < startYear + 10; year++) {
    decadeYears.push(year)
  }

  return decadeYears
}

export const parseSafeDate = (date: string) => {
  if (!date) {
    return ''
  }
  return `${date[0]}${date[1]}${date[2]}${date[3]}-${date[5]}${date[6]}-${date[8]}${date[9]}`
}
