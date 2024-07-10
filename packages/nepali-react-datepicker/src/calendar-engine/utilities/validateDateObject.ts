import * as from_utilities from '.'
import * as from_domains from '../domains'

export const validateDateObject = (date: any, type: string = from_domains.BS) => {
  const { year, month, day } = date

  if (type === from_domains.BS) {
    from_utilities.validateBsYear(year)
    from_utilities.validateBsMonth(month)
    from_utilities.validateBsDay(day)

    return
  }

  from_utilities.validateAdYear(year)
  from_utilities.validateAdMonth(month)
  from_utilities.validateAdDay(day)
}
