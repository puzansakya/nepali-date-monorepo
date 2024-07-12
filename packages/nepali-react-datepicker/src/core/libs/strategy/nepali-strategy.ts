/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs'
import { englishToNepaliNumber, nepaliToEnglishNumber } from 'nepali-number'
import invariant from 'tiny-invariant'
import {
  ADToBS,
  BSToAD,
  isDateInConversionRange,
  MAX_NEP_YEAR,
  MIN_NEP_YEAR,
  zero_pad,
} from 'nepali-dayjs-date-converter'
import {
  englishMonthMap,
  months,
  NEPALI_DATE,
  parse_date,
  range,
  stitch_date,
} from '../../../calendar-engine'
import { Next } from '../../../utilities/pipeline'
import { get_year_list_in_decade, parseSafeDate, validate } from '../../../utilities/utils'
import { debug_mode, ErrorMessage } from '../../config'
import { ICalendarStrategy, ModeEnum, ViewModeEnum } from '../../models/model'

// Error('Invariant violation: This will throw!');
/**
 * Global referece for today's date
 */
const today = dayjs().format('YYYY-MM-DD')

export const NepaliStrategy: ICalendarStrategy = {
  // todo: [REFACTOR DATE]
  setDate:
    (date) =>
      (ctx, next): void => {
        debug_mode && console.log('NepaliStrategy: setDate')

        if (date) {
          ctx.next[ctx.next.currentDateSelection] = date
        }

        next()
      },

  setDateForTypingEvent:
    (date) =>
      (ctx, next): void => {
        debug_mode && console.log('NepaliStrategy: setDateForTypingEvent')

        const validation_result = validate(
          date,
          ctx.next.disableDateBefore,
          ctx.next.disableDateAfter,
        )

        if (validation_result.is_valid) {
          ctx.next[ctx.next.currentDateSelection] = BSToAD(date)
          next()
        }
      },

  setConvertedDate:
    (date) =>
      (ctx, next): void => {
        debug_mode && console.log('NepaliStrategy: setConvertedDate')

        if (ctx.next.mode === ModeEnum.RANGE) {
          const localDate = date as { startDate: string; endDate: string }
          if (localDate.startDate && localDate.endDate) {
            ctx.next.startDate = parseSafeDate(localDate.startDate)
            ctx.next.endDate = parseSafeDate(localDate.endDate)
          }
        } else {
          if (date) {
            ctx.next.startDate = parseSafeDate(date.startDate as string)
          }
        }

        next()
      },

  setCalendarReferenceDate: function (ctx: any, next: Next<any>): void {
    if (ctx.next.isOpen) {
      debug_mode && console.log('NepaliStrategy: setCalendarReferenceDate')
      if (ctx.next.mode === ModeEnum.RANGE && ctx.next.currentDateSelection === 'endDate' && ctx.next.startDate) {
        ctx.next.calendarReferenceDate = ctx.next.startDate;
      } else {
        ctx.next.calendarReferenceDate = ctx.next[ctx.next.currentDateSelection] || dayjs().format('YYYY-MM-DD')
      }
    }
    next()
  },

  setDisableDateBefore:
    (disableDateBefore) =>
      (ctx, next): void => {
        debug_mode && console.log('NepaliStrategy: setDisableDateBefore')
        if (disableDateBefore?.length >= 10 || disableDateBefore?.length === 0) {
          ctx.next.disableDateBefore = disableDateBefore
            ? dayjs(disableDateBefore).format('YYYY-MM-DD')
            : ''
        }
        next()
      },

  setDisableDateAfter:
    (disableDateAfter) =>
      (ctx, next): void => {
        debug_mode && console.log('NepaliStrategy: setDisableDateAfter')
        if (disableDateAfter?.length >= 10 || disableDateAfter?.length === 0) {
          ctx.next.disableDateAfter = disableDateAfter
            ? dayjs(disableDateAfter).format('YYYY-MM-DD')
            : ''
        }
        next()
      },

  setIsTodayValid: (today) =>
    function (ctx, next): void {
      debug_mode && console.log('NepaliStrategy: setIsTodayValid')

      let ddBefore = ''
      if (ctx?.next?.disableDateBefore) {
        ddBefore = ctx.next.disableDateBefore //BSToAD(ctx.next.disableDateBefore) as string
      }

      let ddAfter = ''
      if (ctx?.next?.disableDateAfter) {
        ddAfter = ctx.next.disableDateAfter //BSToAD(ctx.next.disableDateAfter) as string
      }

      const validation_result = validate(today, ddBefore, ddAfter)
      ctx.next.isTodayValid = validation_result.is_valid

      next()
    },

  setGridDates: function (ctx, next): void {
    if (ctx.next.isOpen) {
      debug_mode && console.log('NepaliStrategy: setGridDates')

      if (ctx.next.calendarReferenceDate) {
        invariant(
          isDateInConversionRange(ctx.next.calendarReferenceDate, false),
          'Calendar reference date should be in conversion range!',
        )
      }

      if (ctx.next[ctx.next.currentDateSelection]) {
        invariant(
          isDateInConversionRange(ctx.next[ctx.next.currentDateSelection], false),
          'Date should be in conversion range!',
        )
      }
      const weeks_in_month = NEPALI_DATE.get_weeks_in_month(
        parse_date(ADToBS(ctx.next.calendarReferenceDate) as string),
      )

      let _disable_date_after = ctx.next.disableDateAfter
      let _disable_date_before = ctx.next.disableDateBefore

      const grid_rows = range(0, weeks_in_month)
      const grid_cols = range(1, 7)

      ctx.next.gridDates = grid_rows.map((weekNum: number) =>
        grid_cols.map((weekDayNum: number) =>
          NEPALI_DATE.get_day_info({
            weekNum: weekNum,
            weekDayNum: weekDayNum,
            calendarReferenceDate: parse_date(ADToBS(ctx.next.calendarReferenceDate) as string),
            date: parse_date(ADToBS(ctx.next[ctx.next.currentDateSelection]) as string),
            disable_date_before: _disable_date_before,
            disable_date_after: _disable_date_after,
            disabledWeekDays: ctx.next.disabledWeekDays,
            holidays: ctx.next.holidays,
          }),
        ),
      )
    }
    next()
  },

  setGridDatesWithMeta: (ctx, next) => {
    if (ctx.next.isOpen) {
      debug_mode && console.log('NepaliStrategy: setGridDatesWithMeta')

      if (ctx.next.calendarReferenceDate) {
        invariant(
          isDateInConversionRange(ctx.next.calendarReferenceDate, false),
          'Calendar reference date should be in conversion range!',
        )
      }

      if (ctx.next[ctx.next.currentDateSelection]) {
        invariant(
          isDateInConversionRange(ctx.next[ctx.next.currentDateSelection], false),
          'Date should be in conversion range!',
        )
      }
      const weeks_in_month = NEPALI_DATE.get_weeks_in_month(
        parse_date(ADToBS(ctx.next.calendarReferenceDate) as string),
      )

      let _disable_date_after = ctx.next.disableDateAfter
      let _disable_date_before = ctx.next.disableDateBefore

      const grid_rows = range(0, weeks_in_month)
      const grid_cols = range(1, 7)

      const gridDates = grid_rows.map((weekNum: number) =>
        grid_cols.map((weekDayNum: number) =>
          NEPALI_DATE.get_day_info({
            weekNum: weekNum,
            weekDayNum: weekDayNum,
            calendarReferenceDate: parse_date(ADToBS(ctx.next.calendarReferenceDate) as string),
            date: parse_date(ADToBS(ctx.next[ctx.next.currentDateSelection]) as string),
            disable_date_before: _disable_date_before,
            disable_date_after: _disable_date_after,
            disabledWeekDays: ctx.next.disabledWeekDays,
            holidays: ctx.next.holidays,
          }),
        ),
      )

      ctx.next.gridDatesWithMeta.gridDates = gridDates

      // set calendar controller label
      const [np_year, np_month] = (ADToBS(ctx.next.calendarReferenceDate) as string).split('-')
      ctx.next.gridDatesWithMeta.primaryYear = +np_year
      ctx.next.gridDatesWithMeta.primaryMonth = months.ne[+np_month - 1]

      // set month year panel data
      const [en_year] = ctx.next.calendarReferenceDate.split('-')

      ctx.next.gridDatesWithMeta.secondaryYear = +en_year
      ctx.next.gridDatesWithMeta.secondaryMonthCombination = englishMonthMap[parseInt(np_month + '') - 1]

    }
    next()
  },

  setMonthYearPanelData: (ctx, next) => {
    if (ctx.next.isOpen) {
      debug_mode && console.log('NepaliStrategy: setMonthYearPanelData')
      const [_, nepMM] = ctx.next.calendarReferenceDate.split('-')
      const englishDate = ctx.next.calendarReferenceDate
      const splited = englishDate?.split('-') ?? []
      const englishYear = nepaliToEnglishNumber(splited[0])

      ctx.next.monthYearPanelData = `${englishMonthMap[parseInt(nepMM + '') - 1]} ${englishYear}`
    }

    next()
  },

  setCalendarControllerLabels: function (ctx, next): void {
    if (ctx.next.isOpen) {
      debug_mode && console.log('NepaliStrategy: setCalendarControllerLabels')
      const [year, month] = (ADToBS(ctx.next.calendarReferenceDate) as string).split('-')
      ctx.next.controllerLabel.month = months.ne[+month - 1]
      ctx.next.controllerLabel.year = englishToNepaliNumber(year)
    }

    next()
  },

  incrementMonth: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: incrementMonth')
    let new_reference_date = ADToBS(ctx.next.calendarReferenceDate)

    if (new_reference_date) {
      const [nepYY, nepMM] = new_reference_date.split('-')
      let new_nepMM = parseInt(nepMM)
      let new_nepYY = parseInt(nepYY)

      new_nepMM = parseInt(nepMM + '') + 1

      if (new_nepMM === 13) {
        // jumped to previous year
        new_nepMM = 1
        new_nepYY = parseInt(nepYY + '') + 1
      }
      new_reference_date = `${new_nepYY}-${zero_pad(new_nepMM)}-01`
    }

    ctx.next.calendarReferenceDate = BSToAD(new_reference_date as string)

    next()
  },

  decrementMonth: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: decrementMonth')

    let new_reference_date = ADToBS(ctx.next.calendarReferenceDate)

    if (new_reference_date) {
      const [nepYY, nepMM] = new_reference_date.split('-')
      let new_nepMM = parseInt(nepMM)
      let new_nepYY = parseInt(nepYY)

      new_nepMM = parseInt(nepMM + '') - 1

      if (new_nepMM === 0) {
        // jumped to previous year
        new_nepMM = 12
        new_nepYY = parseInt(nepYY + '') - 1
      }
      new_reference_date = `${new_nepYY}-${zero_pad(new_nepMM)}-01`
    }

    ctx.next.calendarReferenceDate = BSToAD(new_reference_date as string)
    // ctx.next.calendarReferenceDate = dayjs(ctx.next.calendarReferenceDate).subtract(1, "month").format("YYYY-MM-DD") // ADToBS(dayjs(BSToAD(ctx.next.calendarReferenceDate)).subtract(1, "month").format("YYYY-MM-DD"));

    next()
  },

  incrementYear: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: incrementYear')
    ctx.next.calendarReferenceDate = dayjs(ctx.next.calendarReferenceDate)
      .add(1, 'year')
      .format('YYYY-MM-DD')

    next()
  },

  decrementYear: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: decrementYear')
    ctx.next.calendarReferenceDate = dayjs(ctx.next.calendarReferenceDate)
      .subtract(1, 'year')
      .format('YYYY-MM-DD')
    next()
  },

  setViewModeToMonth: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: setViewModeToMonth')
    ctx.next.viewMode = ViewModeEnum.MONTH_VIEW
    next()
  },

  setViewModeToYear: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: setViewModeToYear')
    ctx.next.viewMode = ViewModeEnum.YEAR_VIEW
    next()
  },

  setViewModeToCalendar: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: setViewModeToCalendar')
    ctx.next.viewMode = ViewModeEnum.CALENDAR_VIEW
    next()
  },

  setGridYears: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: setGridYears')
    const currentYear = +ADToBS(ctx.next.calendarReferenceDate).split('-')[0]
    const yearGrid = get_year_list_in_decade(currentYear, MAX_NEP_YEAR, MIN_NEP_YEAR)
    ctx.next.gridYears = []
    ctx.next.gridYears = [yearGrid[0] - 1, ...yearGrid, yearGrid[yearGrid.length - 1] + 1]
    next()
  },

  updateGridYearWithPreviousDecade: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: updateGridYearWithPreviousDecade')
    const currentDecadeLastYear = ctx.next.gridYears[0]
    const yearGrid = get_year_list_in_decade(currentDecadeLastYear, -1, MIN_NEP_YEAR)
    ctx.next.gridYears = []
    ctx.next.gridYears = [yearGrid[0] - 1, ...yearGrid, yearGrid[yearGrid.length - 1] + 1]
    next()
  },

  updateGridYearWithNextDecade: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: updateGridYearWithNextDecade')
    const currentDecadeLastYear = ctx.next.gridYears[ctx.next.gridYears.length - 1]
    const yearGrid = get_year_list_in_decade(currentDecadeLastYear, MAX_NEP_YEAR, -1)
    ctx.next.gridYears = []
    ctx.next.gridYears = [yearGrid[0] - 1, ...yearGrid, yearGrid[yearGrid.length - 1] + 1]
    next()
  },

  selectYear:
    (year) =>
      (ctx, next): void => {
        debug_mode && console.log('NepaliStrategy: selectYear')
        const stitched_date = stitch_date({
          year,
          month: +ctx.next.calendarReferenceDate.split('-')[1],
          day: 1,
        })

        ctx.next.calendarReferenceDate = BSToAD(stitched_date)
        next()
      },

  updateMonthViewWithPreviousYear: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: updateMonthViewWithPreviousYear')
    const split_date = ctx.next.calendarReferenceDate.split('-')
    ctx.next.calendarReferenceDate = stitch_date({
      year: +split_date[0] - 1,
      month: +split_date[1],
      day: +split_date[2],
    })

    next()
  },

  updateMonthViewWithNextYear: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: updateMonthViewWithNextYear')
    const split_date = ctx.next.calendarReferenceDate.split('-')
    ctx.next.calendarReferenceDate = stitch_date({
      year: +split_date[0] + 1,
      month: +split_date[1],
      day: +split_date[2],
    })

    next()
  },

  selectMonth:
    (month) =>
      (ctx, next): void => {
        debug_mode && console.log('NepaliStrategy: selectMonth')
        const stiched_date = stitch_date({
          year: +ctx.next.calendarReferenceDate.split('-')[0],
          month,
          day: 1,
        })

        ctx.next.calendarReferenceDate = stiched_date

        next()
      },

  checkIfTodayIsValid: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: checkIfTodayIsValid')

    let ddBefore = ''
    if (ctx?.next?.disableDateBefore) {
      ddBefore = BSToAD(ctx.next.disableDateBefore) as string
    }

    let ddAfter = ''
    if (ctx?.next?.disableDateAfter) {
      ddAfter = BSToAD(ctx.next.disableDateAfter) as string
    }

    const validation_result = validate(today, ddBefore, ddAfter)
    if (validation_result.is_valid) {
      next()
    }
  },

  checkIfStartDateIsBeforeEndDate: function (ctx, next): void {
    // todo: [REFACTOR DATE]
    debug_mode && console.log('NepaliStrategy: checkIfStartDaetIsBeforeEndDate')

    // if mode is range then proceed

    if (ctx.next.mode === ModeEnum.SINGLE) {
      return next()
    }

    const start_date = ctx.next.startDate
    const end_date = ctx.next.endDate

    if (start_date === end_date) {
      ctx.next.error = ''
      ctx.next?.onError?.('')
      next()
      return
    }

    if (start_date && end_date) {
      const isValid = dayjs(start_date).isBefore(dayjs(end_date))

      if (isValid) {
        ctx.next.error = ''
        ctx.next?.onError?.('')
      } else {
        ctx.next.error = 'start date cannot be after end date'
        ctx.next?.onError?.(ErrorMessage.START_AND_END_DATE_BOUNDS)
      }
    }

    next()
  },

  setTodayAsDate: (today) =>
    function (ctx: any, next: Next<any>): void {
      debug_mode && console.log('NepaliStrategy: setTodayAsDate')

      ctx.next[ctx.next.currentDateSelection] = today

      next()
    },

  setTodayAsCalendarReferenceDate: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: setTodayAsCalendarReferenceDate')
    ctx.next.calendarReferenceDate = today
    next()
  },

  closeCalendarPicker: function (ctx: any, next: Next<any>): void {
    if (ctx.next.closeOnSelect) {
      debug_mode && console.log('NepaliStrategy: closeCalendarPicker')
      ctx.next.isOpen = false
    }
    next()
  },

  checkIfDateIsValid: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: checkIfDateIsValid')

    let ddBefore = ''
    if (ctx?.next?.disableDateBefore) {
      ddBefore = ctx.next.disableDateBefore as string
    }

    let ddAfter = ''
    if (ctx?.next?.disableDateAfter) {
      ddAfter = ctx.next.disableDateAfter as string
    }

    const validation_result = validate(
      ctx.next?.[ctx.next.currentDateSelection]
        ? (ctx.next?.[ctx.next.currentDateSelection] as string)
        : '',
      ddBefore,
      ddAfter,
    )

    if (!validation_result.is_valid) {
      ctx.next.error = validation_result.message
      ctx.next?.onError?.(validation_result.message)
      return
    }

    ctx.next.error = ''
    ctx.next?.onError?.('')
    next()
  },

  convertdatesToCurrentContext: function (_: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: convertdatesToCurrentContext')
    next()
  },

  normalizeDates: function (ctx: any, next: Next<any>): void {
    debug_mode && console.log('NepaliStrategy: normalizeDates')
    if (ctx.next[ctx.next.currentDateSelection]) {
      ctx.next[ctx.next.currentDateSelection] = ADToBS(ctx.next[ctx.next.currentDateSelection])
    }
    next()
  },

  setGridMonths: function (ctx: any, next: Next<any>): void {
    if (ctx.next.isOpen) {
      debug_mode && console.log('NepaliStrategy: setGridMonths')
      ctx.next.gridMonths = months.ne
    }
    next()
  },

  // todo: [REFACTOR DATE]
  sendChanges: (ctx: any, next: Next<any>): void => {
    debug_mode && console.log('NepaliStrategy: sendChanges')
    if (ctx.next.mode === ModeEnum.RANGE) {

      ctx?.next?.onChange?.({
        startDate: ctx.next.startDate,
        endDate: ctx.next.endDate
      })
    } else {
      ctx?.next?.onChange?.(ctx.next.startDate)
    }

    next()
  },

  setStartAndEndDate: (startDate, endDate) => (ctx: any, next: Next<any>): void => {
    debug_mode && console.log('NepaliStrategy: setStartAndEndDate')

    ctx.next.startDate = startDate;
    ctx.next.endDate = endDate;

    next()
  },
  setYearGridDates: function (ctx: any, next: Next<any>): void {
    if (ctx.next.isOpen) {
      debug_mode && console.log('NepaliStrategy: setYearGridDates')

      const [current_year] = ADToBS(today).split("-");

      let current_year_calendar_reference_date = Array.from({ length: 12 }, (_, i) => {
        return `${current_year}-${zero_pad(i + 1)}-01`
      }).map(currentDateSelection => {
        return BSToAD(currentDateSelection)
      })

      if (ctx.next[ctx.next.currentDateSelection]) {
        invariant(
          isDateInConversionRange(ctx.next[ctx.next.currentDateSelection], false),
          'Date should be in conversion range!'
        )
      }

      let _disable_date_after = ctx.next.disableDateAfter
      let _disable_date_before = ctx.next.disableDateBefore

      ctx.next.yearGridDates = []
      current_year_calendar_reference_date.forEach((calendarReferenceDate) => {
        if (calendarReferenceDate) {
          invariant(
            isDateInConversionRange(calendarReferenceDate, false),
            'Calendar reference date should be in conversion range!'
          )
        }

        const weeks_in_month = NEPALI_DATE.get_weeks_in_month(
          parse_date(ADToBS(calendarReferenceDate) as string)
        )

        const grid_rows = range(0, weeks_in_month)
        const grid_cols = range(1, 7)


        ctx.next.yearGridDates.push(grid_rows.map((weekNum: number) => grid_cols.map((weekDayNum: number) => NEPALI_DATE.get_day_info({
          weekNum: weekNum,
          weekDayNum: weekDayNum,
          calendarReferenceDate: parse_date(ADToBS(calendarReferenceDate) as string),
          date: parse_date(ADToBS(ctx.next[ctx.next.currentDateSelection]) as string),
          disable_date_before: _disable_date_before,
          disable_date_after: _disable_date_after,
          disabledWeekDays: ctx.next.disabledWeekDays,
          holidays: ctx.next.holidays,
        }))))
      })
    }
    next()
  },
  setYearGridDatesWithMeta: (ctx, next): void => {
    if (ctx.next.isOpen) {
      debug_mode && console.log('NepaliStrategy: setYearGridDatesWithMeta')

      const [current_year] = ADToBS(ctx.next.calendarReferenceDate).split("-")

      let current_year_calendar_reference_date = Array.from({ length: 12 }, (_, i) => {
        return `${current_year}-${zero_pad(i + 1)}-01`
      }).map(currentDateSelection => {
        return BSToAD(currentDateSelection)
      })

      if (ctx.next[ctx.next.currentDateSelection]) {
        invariant(
          isDateInConversionRange(ctx.next[ctx.next.currentDateSelection], false),
          'Date should be in conversion range!'
        )
      }

      let _disable_date_after = ctx.next.disableDateAfter
      let _disable_date_before = ctx.next.disableDateBefore

      ctx.next.yearGridDatesWithMeta = []

      current_year_calendar_reference_date.forEach((calendarReferenceDate) => {
        if (calendarReferenceDate) {
          invariant(
            isDateInConversionRange(calendarReferenceDate, false),
            'Calendar reference date should be in conversion range!'
          )
        }

        const weeks_in_month = NEPALI_DATE.get_weeks_in_month(
          parse_date(ADToBS(calendarReferenceDate) as string)
        )

        const grid_rows = range(0, weeks_in_month)
        const grid_cols = range(1, 7)

        const gridDates = grid_rows.map((weekNum: number) => grid_cols.map((weekDayNum: number) => NEPALI_DATE.get_day_info({
          weekNum: weekNum,
          weekDayNum: weekDayNum,
          calendarReferenceDate: parse_date(ADToBS(calendarReferenceDate) as string),
          date: parse_date(ADToBS(ctx.next[ctx.next.currentDateSelection]) as string),
          disable_date_before: _disable_date_before,
          disable_date_after: _disable_date_after,
          disabledWeekDays: ctx.next.disabledWeekDays,
          holidays: ctx.next.holidays,
        })))

        // set calendar controller label
        const np_date = (ADToBS(calendarReferenceDate) as string)
        console.log(calendarReferenceDate, np_date)

        const [np_year, np_month] = np_date.split('-')
        
        let primaryYear = +np_year
        let primaryMonth = months.ne[+np_month - 1]

        // set month year panel data
        const [en_year] = ctx.next.calendarReferenceDate.split('-')

        let secondaryYear = +en_year
        let secondaryMonthCombination = englishMonthMap[parseInt(np_month + '') - 1]


        const gridDatesWithMeta = {
          gridDates,
          primaryYear,
          primaryMonth,
          secondaryYear,
          secondaryMonthCombination
        }

        ctx.next.yearGridDatesWithMeta.push(gridDatesWithMeta)
      })
    }
    next()
  }
}
