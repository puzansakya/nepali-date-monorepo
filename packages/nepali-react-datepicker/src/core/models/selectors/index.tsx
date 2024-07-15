import { ADToBS, isDateInConversionRange, MAX_NEP_YEAR, MIN_NEP_YEAR } from '../../../vendor/nepali-dayjs-date-converter'
import { ICalendarState } from '../model'
import { ENGLISH_MONTHS, IDayInfo, MAX_ENG_DATE, nepaliMonthMap } from '../../../calendar-engine'
import dayjs from 'dayjs'
import { englishToNepaliNumber } from 'nepali-number'

export const selectEvents = (state: ICalendarState) => state.events
export const selectCtx = (state: ICalendarState) => state.ctx

// todo: [REFACTOR DATE]
export const selectDateValue = (state: ICalendarState) => {
  const ctx = state.ctx

  return ctx?.[ctx.currentDateSelection]
}

/**
 * used in day picker body cell to disable
 * @param state
 * @returns
 */
export const disableAfterMaxEngDate = (
  state: ICalendarState,
  modifier?: (date: string) => string,
) => {
  return !!(
    state.ctx.isNepali &&
    !isDateInConversionRange(
      modifier ? modifier(state.ctx?.calendarReferenceDate) : state.ctx?.calendarReferenceDate,
      false,
    )
  )
}

/**
 * used for toggle button
 * @param state
 * @returns
 */
export const disableTogglerAfterMaxEngDate = (state: ICalendarState) => {
  return !isDateInConversionRange(state.ctx?.calendarReferenceDate, false)
}

export const disableNextDecade = (state: ICalendarState) => {
  return !!(
    state.ctx.isNepali && state.ctx.gridYears[state.ctx.gridYears.length - 1] === MAX_NEP_YEAR
  )
}

export const disablePreviousDecade = (state: ICalendarState) => {
  return !!(state.ctx.isNepali && state.ctx.gridYears[0] === MIN_NEP_YEAR)
}


// dates
export const selectStartDate = (state: ICalendarState): string => {
  return state.ctx.isNepali && !!state.ctx?.startDate ? ADToBS(state.ctx.startDate as string) : state.ctx.startDate as string;
}

export const selectEndDate = (state: ICalendarState): string => {
  return state.ctx.isNepali && !!state.ctx?.endDate ? ADToBS(state.ctx.endDate as string) : state.ctx.endDate as string;
}

export const selectCalendarControllerLabel = (state: ICalendarState): { month: string, year: string } => {
  const [year, month] = state.ctx.calendarReferenceDate.split('-')

  return {
    month: ENGLISH_MONTHS[+month - 1],
    year: year
  }
}

export const selectCalendarControllerLabelFromGridDates = (state: ICalendarState, gridDates: IDayInfo[][]): any => {
  const {workingMonth, workingYear} = gridDates[0].find(x=> x.workingDay === 1) as IDayInfo
  return {
    month: ENGLISH_MONTHS[(workingMonth as number) - 1],
    year: workingYear +""
  }

}

export const selectMonthYearPanelData = (state: ICalendarState): string => {
  const now = new Date(state.ctx.calendarReferenceDate)

  let data =""
  if (dayjs(MAX_ENG_DATE).isBefore(state.ctx.calendarReferenceDate)) {
    data = '-'
    return data
  }

  const nepaliDate = ADToBS(state.ctx.calendarReferenceDate)
  const splited = nepaliDate?.split('-') ?? []
  const nepaliYear = englishToNepaliNumber(splited[0])

  return `${nepaliMonthMap[now.getMonth()]} ${nepaliYear}`
}