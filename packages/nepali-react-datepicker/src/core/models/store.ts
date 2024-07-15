import dayjs from 'dayjs'
  // @ts-ignore
import _ from 'lodash'
import { createStore } from 'zustand'
import { ENGLISH_MONTHS, weeks } from '../../calendar-engine'
import { Next, Pipeline } from '../../utilities/pipeline'
import { debug_mode, today } from '../config'
import { getStrategy } from '../libs/strategy/strategy-provider'
import {
  ICalendarCtx,
  ICalendarEvents,
  ICalendarInternals,
  ICalendarProps,
  ICalendarState,
  ModeEnum,
  ViewModeEnum,
} from './model'

export const DEFAULT_PROPS: ICalendarProps = {
  mode: ModeEnum.RANGE,

    // todo: [REFACTOR DATE]
  startDate: '',
  endDate  : '',

  isNepali         : false,
  showToggle       : true,
  closeOnSelect    : true,
  showSecondaryDate: false,
  disableDateBefore: '',
  disableDateAfter : '',
  disabledWeekDays : [],
  holidays         : [],
  isDisabled       : false,
  isRhfBound       : false,
  showRangeMenu    : true,
  onChange         : () => { },
  onError          : () => { },
}

export const INTERNAL_PROPS: ICalendarInternals = {
  startDateRef         : { current: null },
  endDateRef           : { current: null },
  currentDateSelection : 'startDate',
  isOpen               : false,
  animationDirection   : 'right',
  calendarReferenceDate: dayjs().format('YYYY-MM-DD'),
  gridDatesWithMeta    : {
    gridDates                : [],
    primaryYear              : 0,
    primaryMonth             : "",
    secondaryYear            : 0,
    secondaryMonthCombination: "",
  },
  yearGridDatesWithMeta: [],
  yearGridDates        : [],
  viewMode             : ViewModeEnum.CALENDAR_VIEW,
  monthYearPanelData   : '',
  gridYears            : [],
  error                : '',
  gridMonths           : ENGLISH_MONTHS,
  isTodayValid         : false,
  weeks                : weeks['en'],
  controllerLabel      : {
    month: '',
    year : '',
  },
}

type type_get = () => ICalendarState
type type_set = (
  partial: 
    | ICalendarState
    | Partial<ICalendarState>
    | ((state: ICalendarState) => ICalendarState | Partial<ICalendarState>),
  replace?: boolean | undefined,
) => void

const getEvents = (get: type_get, set: type_set): ICalendarEvents => {
  return {
    syncProps: async (props) => {
      debug_mode && console.log('store: syncProps')

      const cloned = _.cloneDeep(get().ctx)

        // GET STRATEGY
      const strategyProvider = getStrategy(cloned.isNepali as boolean)

        // SYNC IS DISABLED
      if (props.isDisabled !== undefined) {
        cloned.isDisabled = props.isDisabled
      }

        // SYNC DISABLED WEEK DAYS
      if (props.disabledWeekDays !== undefined) {
        cloned.disabledWeekDays = props.disabledWeekDays
      }

        // SYNC SHOW TOGGLE
      if (props.showToggle !== undefined) {
        cloned.showToggle = props.showToggle
      }

        // SYNC SHOW TOGGLE
      if (props.closeOnSelect !== undefined) {
        cloned.closeOnSelect = props.closeOnSelect
      }

        // SYNC SHOW SECONDARY DATE
      if (props.showSecondaryDate !== undefined) {
        cloned.showSecondaryDate = props.showSecondaryDate
      }

        // SYNC HOLIDAYS
      if (props.holidays !== undefined) {
        cloned.holidays = props.holidays
      }

        // SYNC ENABLE RANGE MENU
      if (props.showRangeMenu !== undefined) {
        cloned.showRangeMenu = props.showRangeMenu
      }

        // SYNC isNepali
        // commented because of state sync bug
        // if (props.isNepali !== undefined) {
        //   cloned.isNepali = props.isNepali;
        // }

      const p = Pipeline<any>()

        /**
       * EXECUTE IN ORDER
       */

        // SYNC DATE PROPS
      p.push(
        strategyProvider.setConvertedDate({
          startDate: props?.startDate,
          endDate  : props?.endDate,
        }),
      )
      p.push(strategyProvider.setCalendarReferenceDate)

        // SYNC DISABLE DATE BEFORE
      p.push(strategyProvider.setDisableDateBefore(props?.disableDateBefore || ''))

        // SYNC DISABLE DATE AFTER
      p.push(strategyProvider.setDisableDateAfter(props?.disableDateAfter || ''))

      p.push(strategyProvider.setGridMonths)
      p.push(strategyProvider.setGridDatesWithMeta)
      p.push(strategyProvider.setMonthYearPanelData)

      p.push(commitCtx(set))

      p.execute({
        next: cloned,
      })
    },

    openCalendar: async (type) => {
      debug_mode && console.log('store: openCalendar')

      const cloned = _.cloneDeep(get().ctx)

      cloned.isOpen               = true
      cloned.currentDateSelection = type

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()

      p.push(strategyProvider.checkIfDateIsValid)
      p.push(strategyProvider.setViewModeToCalendar)
      p.push(strategyProvider.setCalendarReferenceDate)
      p.push(strategyProvider.setIsTodayValid(today))
      p.push(strategyProvider.setGridDatesWithMeta)
      // p.push(strategyProvider.setYearGridDates)
      p.push(strategyProvider.setYearGridDatesWithMeta)
      p.push(strategyProvider.setMonthYearPanelData)
      p.push(strategyProvider.setCalendarControllerLabels)
      p.push(commitCtx(set))

      await p.execute({ next: cloned })
    },

    closeCalendar: async () => {
      debug_mode && console.log('store: closeCalendar')

      const cloned = _.cloneDeep(get().ctx)

      cloned.isOpen = false

      set({ ctx: cloned })
    },

    nextMonth: async () => {
      debug_mode && console.log('store: nextMonth')

      const cloned = _.cloneDeep(get().ctx)

      cloned.animationDirection = 'right'

      set({ ctx: cloned })

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()

      p.push(strategyProvider.incrementMonth)
      p.push(strategyProvider.setGridDatesWithMeta)
      p.push(strategyProvider.setMonthYearPanelData)
      p.push(strategyProvider.setCalendarControllerLabels)
      p.push(commitCtx(set))

      await p.execute({ next: cloned })
    },

    previousMonth: async () => {
      debug_mode && console.log('store: previousMonth')

      const cloned = _.cloneDeep(get().ctx)

      cloned.animationDirection = 'left'

      set({ ctx: cloned })

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()

      p.push(strategyProvider.decrementMonth)
      p.push(strategyProvider.setGridDatesWithMeta)
      p.push(strategyProvider.setMonthYearPanelData)
      p.push(strategyProvider.setCalendarControllerLabels)
      p.push(commitCtx(set))

      await p.execute({ next: cloned })
    },
    nextYear: async () => {
      debug_mode && console.log('store: nextYear')

      const cloned = _.cloneDeep(get().ctx)

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()

      p.push(strategyProvider.incrementYear)
      p.push(strategyProvider.setYearGridDatesWithMeta)
      p.push(strategyProvider.setGridDatesWithMeta)
      p.push(strategyProvider.setMonthYearPanelData)
      p.push(strategyProvider.setCalendarControllerLabels)
      p.push(commitCtx(set))

      await p.execute({ next: cloned })
    },
    previousYear: async () => {
      debug_mode && console.log('store: previousYear')

      const cloned = _.cloneDeep(get().ctx)

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()

      p.push(strategyProvider.decrementYear)
      p.push(strategyProvider.setYearGridDatesWithMeta)
      p.push(strategyProvider.setGridDatesWithMeta)
      p.push(strategyProvider.setMonthYearPanelData)
      p.push(strategyProvider.setCalendarControllerLabels)
      p.push(commitCtx(set))

      await p.execute({ next: cloned })
    },
    selectDay: async (date) => {
      debug_mode && console.log('store: selectDay')

      let cloned = _.cloneDeep(get().ctx)

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<{
        next: ICalendarCtx
      }>()

      p.push(strategyProvider.setDate(date))
      p.push(strategyProvider.checkIfStartDateIsBeforeEndDate)
      p.push(strategyProvider.setGridDatesWithMeta)

      if (
        cloned.mode === ModeEnum.SINGLE ||
        (cloned.mode === ModeEnum.RANGE && cloned.currentDateSelection === 'endDate')
      ) {
        p.push(strategyProvider.closeCalendarPicker)
      }

        // p.push(printCtx);
      p.push(commitCtx(set))
        // p.push(strategyProvider.sendChanges(changeUpdater));

      await p.execute({
        next: cloned,
      })

        // now its turn for enddate
      cloned = _.cloneDeep(get().ctx)
      if (cloned.mode === ModeEnum.RANGE && cloned.currentDateSelection === 'startDate') {
        if (cloned.endDateRef.current) {
          cloned.endDateRef.current.focus()
        }

        get().events.openCalendar('endDate')
      }
    },

    selectToday: async () => {
      debug_mode && console.log('store: selectToday')

      const cloned = _.cloneDeep(get().ctx)

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()

      p.push(strategyProvider.checkIfTodayIsValid)  // might not need
      p.push(strategyProvider.setTodayAsDate(today))
      p.push(strategyProvider.setTodayAsCalendarReferenceDate)
      p.push(strategyProvider.setGridDatesWithMeta)
      p.push(strategyProvider.setMonthYearPanelData)
      p.push(strategyProvider.setCalendarControllerLabels)
      p.push(strategyProvider.closeCalendarPicker)
      p.push(commitCtx(set))
      p.push(strategyProvider.sendChanges)

      await p.execute({
        next: cloned,
      })
    },
    goToMonthView: async () => {
      debug_mode && console.log('store: goToMonthView')

      const cloned = _.cloneDeep(get().ctx)

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()

      p.push(strategyProvider.setViewModeToMonth)
      p.push(strategyProvider.setGridMonths)
      p.push(commitCtx(set))

      await p.execute({
        next: cloned,
      })
    },

    goToYearView: async () => {
      debug_mode && console.log('store: goToYearView')

      const cloned = _.cloneDeep(get().ctx)

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()

      p.push(strategyProvider.setViewModeToYear)
      p.push(strategyProvider.setGridYears)
      p.push(commitCtx(set))

      await p.execute({
        next: cloned,
      })
    },

    getNextDecadeYearGrid: async () => {
      debug_mode && console.log('store: getNextDecadeYearGrid')

      const cloned = _.cloneDeep(get().ctx)

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()

      p.push(strategyProvider.updateGridYearWithNextDecade)
      p.push(commitCtx(set))

      await p.execute({
        next: cloned,
      })
    },
    getPreviousDecadeYearGrid: async () => {
      debug_mode && console.log('store: getPreviousDecadeYearGrid')

      const cloned = _.cloneDeep(get().ctx)

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()

      p.push(strategyProvider.updateGridYearWithPreviousDecade)
      p.push(commitCtx(set))

      await p.execute({
        next: cloned,
      })
    },
    selectYear: async (year) => {
      debug_mode && console.log('store: selectYear')

      const cloned = _.cloneDeep(get().ctx)

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()

      p.push(strategyProvider.selectYear(year))
      p.push(strategyProvider.setViewModeToMonth)
      p.push(strategyProvider.setGridMonths)
      p.push(commitCtx(set))

      await p.execute({
        next: cloned,
      })
    },

    getNextYear: async () => {
      debug_mode && console.log('store: getNextYear')

      const cloned = _.cloneDeep(get().ctx)

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()

      p.push(strategyProvider.updateMonthViewWithNextYear)
      p.push(commitCtx(set))

      await p.execute({
        next: cloned,
      })
    },

    getPreviousYear: async () => {
      debug_mode && console.log('store: getPreviousYear')

      const cloned = _.cloneDeep(get().ctx)

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()

      p.push(strategyProvider.updateMonthViewWithPreviousYear)
      p.push(commitCtx(set))

      await p.execute({
        next: cloned,
      })
    },

    selectMonth: async (month) => {
      debug_mode && console.log('store: selectMonth')

      const cloned = _.cloneDeep(get().ctx)

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()

      p.push(strategyProvider.selectMonth(month))
      p.push(strategyProvider.setGridDatesWithMeta)
      p.push(strategyProvider.setMonthYearPanelData)
      p.push(strategyProvider.setCalendarControllerLabels)
      p.push(strategyProvider.setViewModeToCalendar)
      p.push(commitCtx(set))

      await p.execute({
        next: cloned,
      })
    },

    onDateChange: async (date) => {
      debug_mode && console.log('store: onDateChange')

      const cloned = _.cloneDeep(get().ctx)

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()
      p.push(strategyProvider.checkIfDateIsValid)
        // p.push(commitCtx(set));

      p.push(strategyProvider.setDateForTypingEvent(date))
      p.push(strategyProvider.checkIfStartDateIsBeforeEndDate)
      p.push(strategyProvider.sendChanges)  // sus
      p.push(strategyProvider.setCalendarReferenceDate)
      p.push(strategyProvider.setGridDatesWithMeta)
      p.push(strategyProvider.setMonthYearPanelData)
      p.push(strategyProvider.setCalendarControllerLabels)
      p.push(commitCtx(set))

      await p.execute({
        next: cloned,
      })
    },

    toggleContext: async () => {
      debug_mode && console.log('store: toggleContext')

      const cloned = _.cloneDeep(get().ctx)

        // ALWAYS TOGGLE FIRST
      cloned.isNepali = !cloned.isNepali

        // THEN GET STRATEGY
      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()

      p.push(strategyProvider.convertdatesToCurrentContext)
      p.push(strategyProvider.setCalendarReferenceDate)
      p.push(strategyProvider.setGridMonths)
      p.push(strategyProvider.setGridDatesWithMeta)
      // p.push(strategyProvider.setYearGridDates)
      p.push(strategyProvider.setYearGridDatesWithMeta)
      p.push(strategyProvider.setMonthYearPanelData)
      p.push(strategyProvider.setCalendarControllerLabels)
      p.push(commitCtx(set))
        // p.push(strategyProvider.sendChanges);

      await p.execute({
        next: cloned,
      })
    },

    setStartAndEndDate: async (date) => {
      debug_mode && console.log('store: setStartAndEndDate')

      const cloned = _.cloneDeep(get().ctx)

      const strategyProvider = getStrategy(cloned.isNepali as boolean)

      const p = Pipeline<any>()
      p.push(strategyProvider.setStartAndEndDate(date.startDate, date.endDate))
      p.push(strategyProvider.setGridDatesWithMeta)
      p.push(commitCtx(set))
      p.push(strategyProvider.sendChanges)

      await p.execute({
        next: cloned,
      })
    },
  }
}

export const createMyStore = (initialProps: ICalendarProps) => {
  const finalizedCtx = {
    ...DEFAULT_PROPS,
    ...INTERNAL_PROPS,
    ...initialProps,
  }

  return createStore<ICalendarState>((set, get) => ({
    ctx   : finalizedCtx,
    events: getEvents(get, set),
  }))
}

const commitCtx = 
                              (set: type_set) => 
  (ctx: any, next: Next<any>): void           => {
      debug_mode && console.log('Core: set ctx')

      console.log(ctx.next)

      set({ ctx: ctx.next })

      next()
    }

  // const printCtx = (ctx: any, next: Next<any>): void => {
  //   debug_mode && console.log('printint ctx');

  //   console.log(JSON.stringify(ctx, null, 2))
  //   next();
  // };
