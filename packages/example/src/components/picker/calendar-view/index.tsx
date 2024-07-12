import { selectCtx, selectEvents, useDatePickerStore } from "nepali-react-datepicker";
import React from "react";
import { Controller } from "../controller";
import { MonthViewMode } from "../month-view-mode";
import { MonthYearPanel } from "../month-year-panel";
import { Today } from "../today";
import { YearViewMode } from "../year-view-mode";
import { PickerBody } from "./body";
import { PickerBodyWithWeekSelector } from "./body-with-week-selector";

const CalendarView = () => {
    const state = useDatePickerStore();

    const { openCalendar } = selectEvents(state)
    const { gridDatesWithMeta } = selectCtx(state)

    React.useEffect(() => {
        openCalendar("startDate")
    }, [])

    return <>
        <Controller />
        <MonthYearPanel gridDatesWithMeta={gridDatesWithMeta} />
        <PickerBody />
        <Today />
    </>
}

const CalendarViewWeekSelector = () => {
    const state = useDatePickerStore();

    const { openCalendar } = selectEvents(state)
    const { gridDatesWithMeta } = selectCtx(state)

    React.useEffect(() => {
        openCalendar("startDate")
    }, [])

    return <>
        <Controller />
        <MonthYearPanel gridDatesWithMeta={gridDatesWithMeta} />
        <PickerBodyWithWeekSelector />
        <Today />
    </>
}

export const CalendarViewVariant = () => {

    // HEADLESS HOOK
    const state = useDatePickerStore();
    const { viewMode, } = selectCtx(state);

    return <div className="">
        {viewMode === 'CALENDAR_VIEW' && <CalendarView />}
        {viewMode === 'YEAR_VIEW' && <YearViewMode />}
        {viewMode === 'MONTH_VIEW' && <MonthViewMode />}

    </div>
}

export const CalendarViewWeekSelectorVariant = () => {

    // HEADLESS HOOK
    const state = useDatePickerStore();
    const { viewMode, } = selectCtx(state);

    return <div className="">
        {viewMode === 'CALENDAR_VIEW' && <CalendarViewWeekSelector />}
        {viewMode === 'YEAR_VIEW' && <YearViewMode />}
        {viewMode === 'MONTH_VIEW' && <MonthViewMode />}

    </div>
}

