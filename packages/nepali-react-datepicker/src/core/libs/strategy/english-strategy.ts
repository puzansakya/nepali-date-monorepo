// LIBS
import dayjs from 'dayjs'
import { englishToNepaliNumber } from 'nepali-number'

// UTILS
import { ad2bs, zero_pad } from '../../../vendor/nepali-dayjs-date-converter'
import {
  ENGLISH_DATE,
  ENGLISH_MONTHS,
  MAX_ENG_DATE,
  nepaliMonthMap,
  range,
  stitch_date,
} from '../../../calendar-engine'
import { Next } from '../../../utilities/pipeline'
import {
  get_year_list_in_decade_for_en_ctx,
  parseSafeDate,
  validate,
} from '../../../utilities/utils'
import { debug_mode, ErrorMessage } from '../../config'
import { ICalendarStrategy, ModeEnum, ViewModeEnum } from '../../models/model'
import { normalizeDisabledDates } from '../../../utilities'

/**
 * Global referece for today's date
 */
const today = dayjs().format('YYYY-MM-DD')
const ADToBS = ad2bs

export const EnglishStrategy: ICalendarStrategy = {
  // todo: [REFACTOR DATE]
  setDate: (date) => (ctx, next): void => {
    debug_mode && console.log('EnglishStrategy: setDate')

    ctx.next[ctx.next.currentDateSelection] = date

    next()
  },

  setDateForTypingEvent: (date) => (ctx, next): void => {
    debug_mode && console.log('EnglishStrategy: setDate')

    ctx.next[ctx.next.currentDateSelection] = date

    next()
  },

  setConvertedDate: (date) => (ctx, next): void => {
    debug_mode && console.log('EnglishStrategy: setConvrtedDate')

    const localDate = date as { startDate: string; endDate: string }
    if (ctx.next.mode === ModeEnum.RANGE) {
      ctx.next.startDate = parseSafeDate(localDate.startDate)
      ctx.next.endDate = parseSafeDate(localDate.endDate)
    } else {
      if (date) {
        ctx.next.startDate = parseSafeDate(localDate.startDate)
      }
    }

    next()
  },

  setCalendarReferenceDate: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: setCalendarReferenceDate')
    if (ctx.next.isOpen && ctx.next.error === '') {
      if (ctx.next.mode === ModeEnum.RANGE && ctx.next.currentDateSelection === 'endDate' && ctx.next.startDate) {
        ctx.next.calendarReferenceDate = ctx.next.startDate;
      } else {
        ctx.next.calendarReferenceDate = ctx.next[ctx.next.currentDateSelection] || dayjs().format('YYYY-MM-DD')
      }
    }
    next()
  },

  setDisableDateBefore: (disableDateBefore) => (ctx, next): void => {
    debug_mode && console.log('EnglishStrategy: setDisableDateBefore')
    if (disableDateBefore?.length >= 10 || disableDateBefore?.length === 0) {
      ctx.next.disableDateBefore = disableDateBefore
        ? dayjs(disableDateBefore).format('YYYY-MM-DD')
        : ''
    }
    next()
  },

  setDisableDateAfter: (disableDateAfter) => (ctx, next): void => {
    debug_mode && console.log('EnglishStrategy: setDisableDateAfter')
    if (disableDateAfter?.length >= 10 || disableDateAfter?.length === 0) {
      ctx.next.disableDateAfter = disableDateAfter
        ? dayjs(disableDateAfter).format('YYYY-MM-DD')
        : ''
    }
    next()
  },

  setIsTodayValid: (today) => (ctx, next) => {
    debug_mode && console.log('EnglishStrategy: setIsTodayValid')

    // DUPLICATE CODE REFACTOR
    let _disable_date_before = ctx.next.disableDateBefore
    let _disable_date_after = ctx.next.disableDateAfter

    if (ModeEnum.RANGE === ctx.next.mode) {
      if (ctx.next.currentDateSelection === 'endDate') {
        if (ctx.next.disableDateBefore &&
          dayjs(ctx.next.disableDateBefore).isBefore(ctx.next.startDate)) {
          _disable_date_before = ctx.next.disableDateBefore
        } else {
          _disable_date_before = ctx.next.startDate
        }
      }

      if (ctx.next.currentDateSelection === 'startDate') {
        if (ctx.next.disableDateAfter &&
          dayjs(ctx.next.disableDateAfter).isAfter(ctx.next.endDate)) {
          _disable_date_after = ctx.next.disableDateAfter
        } else {
          _disable_date_after = ctx.next.endDate
        }
      }
    }

    const validation_result = validate(today, _disable_date_before, _disable_date_after)
    ctx.next.isTodayValid = validation_result.is_valid

    next()
  },

  setGridDates: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: setGridDates')

    if (ctx.next.isOpen) {
      const weeks_in_english_month = ENGLISH_DATE.get_weeks_in_month(
        new Date(ctx.next.calendarReferenceDate)
      )

      // DUPLICATE CODE REFACTOR
      let _disable_date_before = ctx.next.disableDateBefore
      let _disable_date_after = ctx.next.disableDateAfter

      if (ModeEnum.RANGE === ctx.next.mode) {
        const res = normalizeDisabledDates(
          {
            startDate: ctx.next.startDate,
            endDate: ctx.next.endDate,
          },
          {
            disableDateBefore: ctx.next.disableDateBefore,
            disableDateAfter: ctx.next.disableDateAfter,
          },
          ctx.next.currentDateSelection
        )

        _disable_date_before = res.disableDateBefore
        _disable_date_after = res.disableDateAfter
      }

      const grid_rows = range(0, weeks_in_english_month - 1)
      const grid_cols = range(1, 7)

      const gridData = grid_rows.map((weekNum: number) => grid_cols.map((weekDayNum: number) => ENGLISH_DATE.get_day_info({
        weekNum,
        weekDayNum,
        calendarReferenceDate: ctx.next.calendarReferenceDate,
        date: ctx.next[ctx.next.currentDateSelection],
        disable_date_before: _disable_date_before,
        disable_date_after: _disable_date_after,
        disabledWeekDays: ctx.next.disabledWeekDays,
        holidays: ctx.next.holidays,
      })))

      ctx.next.gridDates = gridData

    }

    next()
  },

  setGridDatesWithMeta: (ctx, next) => {
    debug_mode && console.log('EnglishStrategy: setGridDatesWithMeta')

    if (ctx.next.isOpen) {
      const weeks_in_english_month = ENGLISH_DATE.get_weeks_in_month(
        new Date(ctx.next.calendarReferenceDate)
      )

      let _disable_date_before = ctx.next.disableDateBefore
      let _disable_date_after = ctx.next.disableDateAfter

      if (ModeEnum.RANGE === ctx.next.mode) {
        const res = normalizeDisabledDates(
          {
            startDate: ctx.next.startDate,
            endDate: ctx.next.endDate,
          },
          {
            disableDateBefore: ctx.next.disableDateBefore as string,
            disableDateAfter: ctx.next.disableDateAfter as string,
          },
          ctx.next.currentDateSelection
        )

        _disable_date_before = res.disableDateBefore
        _disable_date_after = res.disableDateAfter
      }

      const grid_rows = range(0, weeks_in_english_month - 1)
      const grid_cols = range(1, 7)

      const gridData = grid_rows.map((weekNum: number) => grid_cols.map((weekDayNum: number) => ENGLISH_DATE.get_day_info({
        weekNum,
        weekDayNum,
        calendarReferenceDate: ctx.next.calendarReferenceDate,
        date: ctx.next[ctx.next.currentDateSelection],
        disable_date_before: _disable_date_before,
        disable_date_after: _disable_date_after,
        disabledWeekDays: ctx.next.disabledWeekDays,
        holidays: ctx.next.holidays,
      })))

      // set grid dates
      ctx.next.gridDatesWithMeta.gridDates = gridData

      // set calendar controller label
      const [year, month] = ctx.next.calendarReferenceDate.split('-')
      ctx.next.gridDatesWithMeta.primaryYear = +year
      ctx.next.gridDatesWithMeta.primaryMonth = ENGLISH_MONTHS[+month - 1]

      // set month year panel data
      const now = new Date(ctx.next.calendarReferenceDate)

      if (dayjs(MAX_ENG_DATE).isBefore(ctx.next.calendarReferenceDate)) {
  
        ctx.next.gridDatesWithMeta.secondaryYear = -1
        ctx.next.gridDatesWithMeta.secondaryMonthCombination = nepaliMonthMap[now.getMonth()]
      } else {
        
        const nepaliDate = ADToBS(ctx.next.calendarReferenceDate)
        const [nepali_year] = nepaliDate?.split('-') ?? []
        
        ctx.next.gridDatesWithMeta.secondaryYear = +nepali_year
        ctx.next.gridDatesWithMeta.secondaryMonthCombination = nepaliMonthMap[now.getMonth()]
      }

    }

    next()
  },

  setMonthYearPanelData: function (ctx, next): void {
    if (ctx.next.isOpen) {
      debug_mode && console.log('EnglishStrategy: setMonthYearPanelData')
      const now = new Date(ctx.next.calendarReferenceDate)

      if (dayjs(MAX_ENG_DATE).isBefore(ctx.next.calendarReferenceDate)) {
        ctx.next.monthYearPanelData = '-'
        next()
        return
      }

      const nepaliDate = ADToBS(ctx.next.calendarReferenceDate)
      const splited = nepaliDate?.split('-') ?? []
      const nepaliYear = englishToNepaliNumber(splited[0])

      ctx.next.monthYearPanelData = `${nepaliMonthMap[now.getMonth()]} ${nepaliYear}`
    }

    next()
  },

  setCalendarControllerLabels: function (ctx, next): void {
    if (ctx.next.isOpen) {
      debug_mode && console.log('EnglishStrategy: setCalendarControllerLabels')
      const [year, month] = ctx.next.calendarReferenceDate.split('-')
      ctx.next.controllerLabel.month = ENGLISH_MONTHS[+month - 1]
      ctx.next.controllerLabel.year = year
    }

    next()
  },

  incrementMonth: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: incrementMonth')
    ctx.next.calendarReferenceDate = dayjs(ctx.next.calendarReferenceDate)
      .add(1, 'month')
      .format('YYYY-MM-DD')

    next()
  },

  decrementMonth: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: decrementMonth')
    ctx.next.calendarReferenceDate = dayjs(ctx.next.calendarReferenceDate)
      .subtract(1, 'month')
      .format('YYYY-MM-DD')

    next()
  },
  incrementYear: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: incrementYear')
    ctx.next.calendarReferenceDate = dayjs(ctx.next.calendarReferenceDate)
      .add(1, 'year')
      .format('YYYY-MM-DD')

    next()
  },
  decrementYear: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: decrementYear')
    ctx.next.calendarReferenceDate = dayjs(ctx.next.calendarReferenceDate)
      .subtract(1, 'year')
      .format('YYYY-MM-DD')

    next()
  },

  setTodayAsDate: (today) => function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: setTodayAsDate')
    if (ctx.next.currentDateSelection === 'startDate') {
      ctx.next.startDate = today
    } else {
      ctx.next.endDate = today
    }

    next()
  },

  setTodayAsCalendarReferenceDate: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: setTodayAsCalendarReferenceDate')
    ctx.next.calendarReferenceDate = today
    next()
  },
  setViewModeToMonth: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: setViewModeToMonth')
    ctx.next.viewMode = ViewModeEnum.MONTH_VIEW
    next()
  },
  setViewModeToYear: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: setViewModeToYear')
    ctx.next.viewMode = ViewModeEnum.YEAR_VIEW
    next()
  },
  setViewModeToCalendar: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: setViewModeToCalendar')
    ctx.next.viewMode = ViewModeEnum.CALENDAR_VIEW
    next()
  },
  setGridYears: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: setGridYears')
    const currentYear = +ctx.next.calendarReferenceDate.split('-')[0]
    const yearGrid = get_year_list_in_decade_for_en_ctx(currentYear)
    ctx.next.gridYears = []
    ctx.next.gridYears = [yearGrid[0] - 1, ...yearGrid, yearGrid[yearGrid.length - 1] + 1]

    next()
  },

  updateGridYearWithNextDecade: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: updateGridYearWithNextDecade')
    const currentDecadeLastYear = ctx.next.gridYears[ctx.next.gridYears.length - 1]
    const yearGrid = get_year_list_in_decade_for_en_ctx(currentDecadeLastYear)
    ctx.next.gridYears = []
    ctx.next.gridYears = [yearGrid[0] - 1, ...yearGrid, yearGrid[yearGrid.length - 1] + 1]

    next()
  },
  updateGridYearWithPreviousDecade: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: updateGridYearWithPreviousDecade')
    const currentDecadeLastYear = ctx.next.gridYears[0]
    const yearGrid = get_year_list_in_decade_for_en_ctx(currentDecadeLastYear)
    ctx.next.gridYears = []
    ctx.next.gridYears = [yearGrid[0] - 1, ...yearGrid, yearGrid[yearGrid.length - 1] + 1]

    next()
  },
  selectYear: (year) => (ctx, next): void => {
    debug_mode && console.log('EnglishStrategy: selectYear')
    ctx.next.calendarReferenceDate = stitch_date(
      {
        year,
        month: +ctx.next.calendarReferenceDate.split('-')[1],
        day: 1,
      },
      '-'
    )
    next()
  },
  updateMonthViewWithNextYear: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: updateMonthViewWithNextYear')
    const split_date = ctx.next.calendarReferenceDate.split('-')
    ctx.next.calendarReferenceDate = stitch_date({
      year: +split_date[0] + 1,
      month: +split_date[1],
      day: +split_date[2],
    })

    next()
  },
  updateMonthViewWithPreviousYear: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: updateMonthViewWithPreviousYear')
    const split_date = ctx.next.calendarReferenceDate.split('-')
    ctx.next.calendarReferenceDate = stitch_date({
      year: +split_date[0] - 1,
      month: +split_date[1],
      day: +split_date[2],
    })

    next()
  },
  selectMonth: (month) => (ctx, next): void => {
    debug_mode && console.log('EnglishStrategy: selectMonth')
    ctx.next.calendarReferenceDate = stitch_date(
      {
        year: +ctx.next.calendarReferenceDate.split('-')[0],
        month,
        day: 1,
      },
      '-'
    )

    next()
  },
  closeCalendarPicker: function (ctx, next): void {
    if (ctx.next.closeOnSelect) {
      debug_mode && console.log('EnglishStrategy: closeCalendarPicker')
      ctx.next.isOpen = false
    }
    next()
  },
  checkIfTodayIsValid: function (ctx, next): void {
    debug_mode && console.log('EnglishStrategy: checkIfTodayIsValid')
    const validation_result = validate(today, ctx.next.disableDateBefore, ctx.next.disableDateAfter)

    if (validation_result.is_valid) {
      next()
    }
  },
  checkIfDateIsValid: function (ctx, next): void {
    // todo: [REFACTOR DATE]
    debug_mode && console.log('EnglishStrategy: checkIfDateIsValid')

    const validation_result = validate(
      ctx.next?.[ctx.next.currentDateSelection],
      ctx.next.disableDateBefore,
      ctx.next.disableDateAfter
    )

    if (validation_result.is_valid) {
      ctx.next.error = ''
      ctx.next?.onError?.('')
      next()
    } else {
      ctx.next.error = validation_result.message
      ctx.next?.onError?.(validation_result.message)
      next()
    }
  },

  checkIfStartDateIsBeforeEndDate: function (ctx, next): void {
    // todo: consolidate validation
    // todo: [REFACTOR DATE]
    debug_mode && console.log('EnglishStrategy: checkIfStartDaetIsBeforeEndDate')

    // if mode is range then proceed
    if (ctx.next.mode === ModeEnum.SINGLE) {
      return next()
    }

    const start_date = ctx.next.startDate
    const end_date = ctx.next.endDate

    if (start_date && end_date) {
      if (start_date === end_date) {
        ctx.next.error = ''
        ctx.next?.onError?.('')
        next()
        return
      } else {
        const isValid = dayjs(start_date).isBefore(dayjs(end_date))

        if (isValid) {
          ctx.next.error = ''
          ctx.next?.onError?.('')
        } else {
          ctx.next.error = ErrorMessage.START_AND_END_DATE_BOUNDS
          ctx.next?.onError?.(ErrorMessage.START_AND_END_DATE_BOUNDS)
        }
      }
    }
    next()
  },

  convertdatesToCurrentContext: function (_, next): void {
    debug_mode && console.log('EnglishStrategy: convertdatesToCurrentContext')

    next()
  },
  setGridMonths: function (ctx: any, next: Next<any>): void {
    if (ctx.next.isOpen) {
      debug_mode && console.log('EnglishStrategy: setGridMonths')
      ctx.next.gridMonths = ENGLISH_MONTHS
    }
    next()
  },

  // todo: [REFACTOR DATE]
  sendChanges: (ctx: any, next: Next<any>) => {
    debug_mode && console.log('EnglishStrategy: sendChanges')

    if (ctx.next.mode === ModeEnum.RANGE) {
      ctx?.next?.onChange?.({ startDate: ctx.next.startDate, endDate: ctx.next.endDate })
    } else {
      ctx?.next?.onChange?.(ctx.next.startDate)
    }

    next()
  },
  // TODO: REMOVE LATER
  normalizeDates: function (_: any, next: Next<any>): void {
    debug_mode && console.log('EnglishStrategy: normalizeDates')
    next()
  },

  setStartAndEndDate: (startDate, endDate) => (ctx: any, next: Next<any>) => {
    debug_mode && console.log('EnglishStrategy: setStartAndEndDate')

    ctx.next.startDate = startDate
    ctx.next.endDate = endDate
    next()
  },
  setYearGridDates: (ctx: any, next: Next<any>): void => {
    debug_mode && console.log('EnglishStrategy: setYearGridDates')

    if (ctx.next.isOpen) {

      let _disable_date_before = ctx.next.disableDateBefore
      let _disable_date_after = ctx.next.disableDateAfter

      if (ModeEnum.RANGE === ctx.next.mode) {
        const res = normalizeDisabledDates(
          {
            startDate: ctx.next.startDate,
            endDate: ctx.next.endDate,
          },
          {
            disableDateBefore: ctx.next.disableDateBefore,
            disableDateAfter: ctx.next.disableDateAfter,
          },
          ctx.next.currentDateSelection
        )

        _disable_date_before = res.disableDateBefore
        _disable_date_after = res.disableDateAfter
      }

      const [current_year] = today.split("-")

      let current_year_calendar_reference_date = Array.from({ length: 12 }, (_, i) => {
        return `${current_year}-${zero_pad(i + 1)}-01`
      })

      ctx.next.yearGridDates = []
      current_year_calendar_reference_date.forEach((calendarReferenceDate) => {

        const weeks_in_english_month = ENGLISH_DATE.get_weeks_in_month(
          new Date(calendarReferenceDate)
        )


        const grid_rows = range(0, weeks_in_english_month - 1)
        const grid_cols = range(1, 7)

        ctx.next.yearGridDates.push(grid_rows.map((weekNum: number) => grid_cols.map((weekDayNum: number) => ENGLISH_DATE.get_day_info({
          weekNum,
          weekDayNum,
          calendarReferenceDate,
          date: ctx.next[ctx.next.currentDateSelection],
          disable_date_before: _disable_date_before,
          disable_date_after: _disable_date_after,
          disabledWeekDays: ctx.next.disabledWeekDays,
          holidays: ctx.next.holidays,
        }))))
      })

    }

    next()
  },
  setYearGridDatesWithMeta: (ctx: any, next: Next<any>): void => {
    debug_mode && console.log('EnglishStrategy: setYearGridDatesWithMeta')

    if (ctx.next.isOpen) {

      let _disable_date_before = ctx.next.disableDateBefore
      let _disable_date_after = ctx.next.disableDateAfter

      if (ModeEnum.RANGE === ctx.next.mode) {
        const res = normalizeDisabledDates(
          {
            startDate: ctx.next.startDate,
            endDate: ctx.next.endDate,
          },
          {
            disableDateBefore: ctx.next.disableDateBefore,
            disableDateAfter: ctx.next.disableDateAfter,
          },
          ctx.next.currentDateSelection
        )

        _disable_date_before = res.disableDateBefore
        _disable_date_after = res.disableDateAfter
      }

      const [current_year] = ctx.next.calendarReferenceDate.split("-")

      let current_year_calendar_reference_date = Array.from({ length: 12 }, (_, i) => {
        return `${current_year}-${zero_pad(i + 1)}-01`
      })

      ctx.next.yearGridDatesWithMeta = []
      current_year_calendar_reference_date.forEach((calendarReferenceDate) => {

        const weeks_in_english_month = ENGLISH_DATE.get_weeks_in_month(
          new Date(calendarReferenceDate)
        )

        const grid_rows = range(0, weeks_in_english_month - 1)
        const grid_cols = range(1, 7)

        const gridDates = grid_rows.map((weekNum: number) => grid_cols.map((weekDayNum: number) => ENGLISH_DATE.get_day_info({
          weekNum,
          weekDayNum,
          calendarReferenceDate,
          date: ctx.next[ctx.next.currentDateSelection],
          disable_date_before: _disable_date_before,
          disable_date_after: _disable_date_after,
          disabledWeekDays: ctx.next.disabledWeekDays,
          holidays: ctx.next.holidays,
        })))

        // set calendar controller label
        const [year, month] = calendarReferenceDate.split('-')

        // set month year panel data
        const now = new Date(calendarReferenceDate)

        let secondaryYear = -1
        let secondaryMonthCombination = "-"

        if (dayjs(MAX_ENG_DATE).isBefore(calendarReferenceDate)) {
        } else {
          const nepaliDate = ADToBS(calendarReferenceDate)
          const [nepali_year] = nepaliDate?.split('-') ?? []

          secondaryYear = +nepali_year
          secondaryMonthCombination = nepaliMonthMap[now.getMonth()]
        }

        const gridDatesWithMeta = {
          gridDates: gridDates,
          primaryYear: +year,
          primaryMonth: ENGLISH_MONTHS[+month - 1],
          secondaryYear,
          secondaryMonthCombination,
        }

        ctx.next.yearGridDatesWithMeta.push(gridDatesWithMeta)
      })

    }

    next()
  }
}
