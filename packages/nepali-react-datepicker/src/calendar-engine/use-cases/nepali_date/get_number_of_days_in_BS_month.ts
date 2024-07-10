import * as from_utilities from '../../utilities'
import * as from_constants from '../../constants'

export const get_number_of_days_in_BS_month = (yearMonth: {
  year: number
  month: number
}): number => {
  const { year, month } = yearMonth
  from_utilities.validateBsYear(year)
  from_utilities.validateBsMonth(month)

  let yearCount = 0
  const totalYears = year + 1 - from_constants.minBSYear
  const bsMonthData: number[] = from_constants.bsMonthCalculatedData[month - 1]

  return bsMonthData.reduce((numberOfDays: number, monthData: number, index: number) => {
    if (monthData === 0 || numberOfDays !== 0) {
      return numberOfDays
    }

    const bsMonthUpperDaysIndex = index % 2
    yearCount += monthData
    if (totalYears > yearCount) {
      return numberOfDays
    }

    if ((year === 2085 && month === 5) || (year === 2088 && month === 5)) {
      return from_constants.bsMonthMaxDays[month - 1][bsMonthUpperDaysIndex] - 2
    }

    return from_constants.bsMonthMaxDays[month - 1][bsMonthUpperDaysIndex]
  }, 0)
}
