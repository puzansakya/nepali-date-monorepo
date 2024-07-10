import * as from_constants from '../constants'
import dayjs from 'dayjs'

export const validateAdYear = (year: number) => {
  const minAdYear = from_constants.minBSYear - 57
  const maxAdYear = from_constants.maxBSYear - 57

  if (year < minAdYear || year > maxAdYear) {
    throw new RangeError(`AD year should be in range of ${minAdYear} to ${maxAdYear}`)
  }
}

export const validateAdMonth = (month: number) => {
  if (month < 1 || month > 12) {
    throw new RangeError('AD month should be in range of 1 to 12')
  }
}

export const validateAdDay = (day: number) => {
  if (day < 1 || day > 31) {
    throw new RangeError('AD day should be in range of 1 to 31')
  }
}

export const validateBsYear = (year: number) => {
  const midBsYear = from_constants.minBSYear
  const maxBsYear = from_constants.maxBSYear

  if (year < midBsYear || year > maxBsYear) {
    throw new RangeError(`BS year should be in range of ${midBsYear} to ${maxBsYear}`)
  }
}

export const validateBsMonth = (month: number) => {
  if (month < 1 || month > 12) {
    throw new RangeError('BS month should be in range of 1 to 12')
  }
}

export const validateBsDay = (day: number) => {
  if (day < 1 || day > 32) {
    throw new RangeError('BS day should be in range of 1 to 32')
  }
}

export const validateDateRange = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) {
    return false
  }

  return dayjs(endDate).isAfter(dayjs(startDate)) || dayjs(endDate).isSame(dayjs(startDate))
}
