import { ad2bs } from 'nepali-dayjs-date-converter'
import * as from_domains from '../../domains'

const ADToBS = ad2bs
/**
 * ALWAYS RETURNS NEPALI DATE
 */
export const get_normalized_date = (date: any, dateType: any) => {
  if (dateType === from_domains.DATE_TYPE_NEPALI) {
    return date
  }

  return ADToBS(date)
}
