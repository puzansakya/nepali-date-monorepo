import { zero_pad } from "nepali-dayjs-date-converter"

export const stitch_date = (date: any, separator = '-'): string => {
  return `${date.year}${separator}${zero_pad(date.month)}${separator}${zero_pad(date.day)}`
}
