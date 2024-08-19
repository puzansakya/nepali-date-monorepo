import React from 'react'
import { Next } from '../../utilities/pipeline'
import { IDayInfo } from '../../calendar-engine'

export enum ModeEnum {
  SINGLE = 'single',
  RANGE = 'range',
}

export enum ViewModeEnum {
  CALENDAR_VIEW = 'CALENDAR_VIEW',
  MONTH_VIEW = 'MONTH_VIEW',
  YEAR_VIEW = 'YEAR_VIEW',
}

export interface ICalendarStrategy {
  /**
   * used on first open calendar mount
   * dont confuse with checkifTodayIsValid
   * @param ctx
   * @param next
   * @returns
   */
  setDate: (date: string) => (ctx: any, next: Next<any>) => void

  /**
   * used for typing events from input
   * sets startDate and endDate
   * @param ctx
   * @param next
   * @returns
   */
  setDateForTypingEvent: (date: string) => (ctx: any, next: Next<any>) => void

  /**
   * set date on mount
   * if range set start date and end date
   * if single set start date only
   * if engish set as it is
   * if nepali convert and set
   * @deprecated
   * @param date
   * @returns
   */
  setConvertedDate: (date: {
    startDate: string
    endDate: string
  }) => (ctx: any, next: Next<any>) => void
  setCalendarReferenceDate: (fromTypeEvent: boolean) => (ctx: any, next: Next<any>) => void
  setDisableDateBefore: (disableDateBefore: string) => (ctx: any, next: Next<any>) => void
  setDisableDateAfter: (disableDateAfter: string) => (ctx: any, next: Next<any>) => void
  setIsTodayValid: (today: string) => (ctx: any, next: Next<any>) => void

  /**
   * sets monthly grid dates with meta information
   * @param ctx 
   * @param next 
   * @returns 
   */
  setGridDatesWithMeta: (ctx: { next: ICalendarCtx }, next: Next<any>) => void

  /**
   * sets yearly grid dates with meta information
   * @param ctx 
   * @param next 
   * @returns 
   */
  setYearGridDatesWithMeta: (ctx: { next: ICalendarCtx }, next: Next<any>) => void


  /**
   * sets each month grid dates for whole year
   * @param ctx 
   * @param next 
   * @returns 
   */
  setYearGridDates: (ctx: any, next: Next<any>) => void

  setMonthYearPanelData: (ctx: any, next: Next<any>) => void
  setCalendarControllerLabels: (ctx: any, next: Next<any>) => void
  incrementMonth: (ctx: any, next: Next<any>) => void
  decrementMonth: (ctx: any, next: Next<any>) => void
  incrementYear: (ctx: any, next: Next<any>) => void
  decrementYear: (ctx: any, next: Next<any>) => void
  setTodayAsDate: (today: string) => (ctx: any, next: Next<any>) => void
  setTodayAsCalendarReferenceDate: (ctx: any, next: Next<any>) => void
  setViewModeToMonth: (ctx: any, next: Next<any>) => void
  setViewModeToYear: (ctx: any, next: Next<any>) => void
  setViewModeToCalendar: (ctx: any, next: Next<any>) => void
  setGridYears: (ctx: any, next: Next<any>) => void
  setGridMonths: (ctx: any, next: Next<any>) => void
  updateGridYearWithPreviousDecade: (ctx: any, next: Next<any>) => void
  updateGridYearWithNextDecade: (ctx: any, next: Next<any>) => void
  selectYear: (year: number) => (ctx: any, next: Next<any>) => void
  selectMonth: (month: number) => (ctx: any, next: Next<any>) => void
  updateMonthViewWithPreviousYear: (ctx: any, next: Next<any>) => void
  updateMonthViewWithNextYear: (ctx: any, next: Next<any>) => void
  closeCalendarPicker: (ctx: any, next: Next<any>) => void
  sendChanges: (ctx: { next: ICalendarCtx }, next: Next<any>) => void

  // vvalidation
  /**
   * not sure if this is required
   * used while clicking on today button
   * @param ctx
   * @param next
   * @returns
   */
  checkIfTodayIsValid: (ctx: any, next: Next<any>) => void

  /**
   * check if the date is valid
   * used while clicking on select day, select today,
   * on date typing
   * @param ctx
   * @param next
   * @returns
   */
  checkIfDateIsValid: (ctx: any, next: Next<any>) => void

  /**
   * check if the date is valid
   * used while clicking on select day, select today,
   * on date typing
   * @param ctx
   * @param next
   * @returns
   */
  checkIfStartDateIsBeforeEndDate: (ctx: any, next: Next<any>) => void

  /**
   *
   * Switching from nepali to english,
   * assuming the date is in nepali format
   * converts the "date" to english format
   * does the same for Switching from english to nepali,
   */
  convertdatesToCurrentContext: (ctx: any, next: Next<any>) => void

  /**
   * Basically does same thing as convertdatesToCurrentContext,
   * but only for napali strategy,
   * does nothing for english strategy
   * used on mount setup
   * @deprecated
   * @param ctx
   * @param next
   * @returns
   */
  normalizeDates: (ctx: any, next: Next<any>) => void

  setStartAndEndDate: (startDate: string, endDate: string) => (ctx: any, next: Next<any>) => void
}

export interface ICalendarProps {
  // todo: might not need

  // todo: [REFACTOR DATE]
  /**
   * When in range mode, use this as start date
   */
  startDate: string

  // todo: [REFACTOR DATE]
  /**
   * When in range mode, use this as end date
   */
  endDate: string

  /**
   * This is the array of week days that is used
   * to disable the week days in the calendar
   * if value is [1,2,3] then sunday, monday and tuesday
   * cells are disabled.
   */
  disabledWeekDays?: number[]

  /**
   * This holds the holidays,
   * based on this cells are disabled
   */
  holidays?: string[]

  /**
   * This is used to determine if the calendar
   * context is in nepali or english.
   */
  isNepali?: boolean | null

  /**
   * This is used to determine if the calendar
   * context is in nepali or english.
   */
  mode: ModeEnum

  /**
   * This is the date that is used to
   * disable dates before this date.
   */
  disableDateBefore?: string

  /**
   * This is the date that is used to
   * disable dates after this date.
   */
  disableDateAfter?: string

  /**
   * This is the change handler
   */
  onChange?: (date: string) => void

  /**
   * This gets triggered when there is an error
   */
  onError?: (date: string) => void

  /**
   * This is the determine if input should be
   * disabled or not
   */
  isDisabled?: boolean

  /**
   * This is the determine if input should be
   * disabled or not
   */
  isRhfBound?: boolean

  /**
   * Determine if the is nepali toggle button should
   * be shown or not
   */
  showToggle?: boolean

  /**
   *  Determine if the picker should be closed on day select
   *
   * */
  closeOnSelect?: boolean

  /**
   * Determine if the secondary date should be shown or not
   */
  showSecondaryDate?: boolean

  /**
   * Determine if the is range menu (this week, this month, etc...) should
   * be shown or not
   */
  showRangeMenu?: boolean

  /**
   * Determine if the calendar body is open or not
   */
  isOpen?: boolean

}

export interface IGridDatesWithMeta {
  gridDates: IDayInfo[][],
  primaryYear: number,
  primaryMonth: string
  secondaryYear: number,
  secondaryMonthCombination: string
}

export interface ICalendarInternals {
  /**
   * Holds the reference of the start date input
   */
  startDateRef: React.MutableRefObject<HTMLInputElement | null>

  /**
   * Holds the reference of the end date input
   */
  endDateRef: React.MutableRefObject<HTMLInputElement | null>

  /**
   * Determine if internals are used for start or end date
   */
  currentDateSelection: 'startDate' | 'endDate'

  /**
   * Determine the direction of animation
   * while rendering
   */
  animationDirection: 'left' | 'right'

  /**
   * This is the date that is used to
   * generate the calendar grid date.
   */
  calendarReferenceDate: string

  /**
   * Updated verison of gridDates with meta data
   */
  gridDatesWithMeta: IGridDatesWithMeta

  /**
   * Updated verison of gridDates with meta data for year view mode
   */
  yearGridDatesWithMeta: IGridDatesWithMeta[]

  /**
   * Stores the data for whole year's grid
   */
  yearGridDates: IDayInfo[][][]

  /**
   * This is used as flag to
   * switch between calendar view
   * or month view
   * or year view
   */
  viewMode: ViewModeEnum

  /**
   * This is the data that is shown in the
   * month year panel.
   */
  monthYearPanelData: string

  /**
   * This is the data that is shown in the
   * year view mode.
   */
  gridYears: any[]

  /**
   * Holds the value for error message
   * used for chekcing if date or today date is valid
   */
  error: string

  /**
   * This is the array of months that is used
   * to generate the month grid.
   */
  gridMonths: string[]

  /**
   * This is used to determine if today's date
   * is valid or not.
   */
  isTodayValid: boolean

  /**
   * This is the data that is shown in the
   * calendar controller.
   */
  controllerLabel: {
    month: string
    year: string
  }

  /**
   * This is used to set the week data
   * for calendar body view
   */
  weeks: any[]
}

export interface ICalendarEvents {
  /**
   * This is sync props, track change nad update one
   * prevent atomic update
   */
  syncProps: (props: ICalendarProps) => void

  /**
   * This is used to open the calendar body
   * and bind necessary data.
   *
   */
  openCalendar: (type: 'startDate' | 'endDate') => void

  /**
   * This is used to close the calendar body
   */
  closeCalendar: () => void

  /**
   * this is used to navigate to next month
   * from calendar controller
   */
  nextMonth: () => void

  /**
   * This is used to navigate to previous month
   * from calendar controller
   */
  previousMonth: () => void

  /**
   *
   * This is used to navigate to next year
   * from calendar controller
   */
  nextYear: () => void

  /**
   *
   * This is used to navigate to previous year
   * from calendar controller
   */
  previousYear: () => void

  /**
   * This is used to select a day from the calendar
   * grid.
   */
  selectDay: (date: string) => void

  /**
   * This is used to select today's date
   */
  selectToday: () => void

  /**
   * This is used to navigate to month view
   * from calendar controller
   */
  goToMonthView: () => void

  /**
   * This is used to navigate to year view
   * from calendar controller
   */
  goToYearView: () => void

  /**
   * This is used to update grid with
   * next decade year for year view mode
   */
  getNextDecadeYearGrid: () => void

  /**
   * This is used to update grid with
   * previous decade year for year view mode
   */
  getPreviousDecadeYearGrid: () => void

  /**
   * This is used to select year from year view mode
   */
  selectYear: (year: number) => void

  /**
   * This is used to update to next year
   * from month view mode
   */
  getNextYear: () => void

  /**
   * This is used to update to previous year
   * from month view mode
   */
  getPreviousYear: () => void

  /**
   * This is used to select month from month view mode
   */
  selectMonth: (month: number) => void

  /**
   *
   * This is the function that is used on
   * date input component to update the date
   * and calendar reference date.
   */
  onDateChange: (date: string) => void

  /**
   *
   * Switch between nepali and english context
   */
  toggleContext: (context?: boolean) => void

  /**
   * This sets the start and end date
   * possbile use case for menu date range selector (This week, This Month)
   * @param context
   * @returns
   */
  setStartAndEndDate: (params: { startDate: string; endDate: string }) => void
}

export interface ICalendarCtx extends ICalendarProps, ICalendarInternals { }

export interface ICalendarState {
  ctx: ICalendarCtx
  events: ICalendarEvents
}
