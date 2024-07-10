// migrated
import dayjs from 'dayjs'
import { bs2ad } from 'nepali-dayjs-date-converter'
import * as from_domains from '../../domains'

const BSToAD = bs2ad

/**
 * ALWAYS RETURNS ENGLISH DATE
 */
export const get_normalized_date = (date: any, dateType: any) => {
  try {
    if (dateType === from_domains.DATE_TYPE_ENGLISH) {
      return dayjs(date).format('YYYY-MM-DD')
    }

    return dayjs(BSToAD(date)).format('YYYY-MM-DD')
  } catch (error) {
    // console.log(error);
  }
}
