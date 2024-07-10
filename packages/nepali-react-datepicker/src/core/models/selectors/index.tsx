import { ADToBS, isDateInConversionRange, MAX_NEP_YEAR, MIN_NEP_YEAR } from 'nepali-dayjs-date-converter'
import { ICalendarState } from '../model'

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
  return state.ctx.isNepali && !!state.ctx?.endDate? ADToBS(state.ctx.endDate as string) : state.ctx.endDate as string;
}