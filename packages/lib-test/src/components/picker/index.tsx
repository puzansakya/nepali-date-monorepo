import dayjs from "dayjs";
import { ADToBS, BSToAD, lookUp } from "nepali-dayjs-date-converter";
import { DatePickerStoreProvider, disableTogglerAfterMaxEngDate, ModeEnum, selectCtx, selectEvents, useDatePickerStore } from "nepali-react-datepicker";
import React from "react";
import { Button, Controller } from "./controller";
import { DateInput } from "./input";
import { MonthViewMode } from "./month-view-mode";
import { MonthYearPanel } from "./month-year-panel";
import { Today } from "./today";
import { YearBody } from "./year-body";
import { YearViewMode } from "./year-view-mode";

const CalendarView = () => {
    const state = useDatePickerStore();

    const { openCalendar } = selectEvents(state)

    React.useEffect(() => {
        openCalendar("startDate")
    }, [])

    return <>
        <Controller />
        <MonthYearPanel />
        <YearBody />
        {/* <PickerBody /> */}
        <Today />
    </>
}

const ViewVariant = () => {

    // HEADLESS HOOK
    const state = useDatePickerStore();
    const { viewMode, } = selectCtx(state);

    return <div className="">
        {viewMode === 'CALENDAR_VIEW' && <CalendarView />}
        {viewMode === 'YEAR_VIEW' && <YearViewMode />}
        {viewMode === 'MONTH_VIEW' && <MonthViewMode />}

    </div>
}

const Toggle = () => {

    const state = useDatePickerStore();
    const { toggleContext, } = selectEvents(state);

    const shouldDisableTogglerAfterMaxEngDate = disableTogglerAfterMaxEngDate(state)

    return <Button
        disabled={shouldDisableTogglerAfterMaxEngDate}
        onClick={toggleContext}>Toggle</Button>
}

const RangeSelector = () => {

    const [value, setValue] = React.useState("THIS_MONTH");
    const state = useDatePickerStore();
    const { setStartAndEndDate, } = selectEvents(state);

    const setToThisMonth = () => {
        let startDate = dayjs().startOf('month').format('YYYY-MM-DD');
        let endDate = dayjs().endOf('month').format('YYYY-MM-DD');

        if (state.ctx.isNepali) {
            const currentNepaliDate = ADToBS(dayjs().format('YYYY-MM-DD'));
            const [year, month] = currentNepaliDate?.split('-') as string[];
            const getTotalDaysInCurrentNepaliMonth = lookUp.queryDays(year, month)

            startDate = BSToAD(`${year}-${month}-01`) || startDate;
            endDate =
                BSToAD(`${year}-${month}-${getTotalDaysInCurrentNepaliMonth}`) ||
                endDate;
        }

        setStartAndEndDate({
            startDate,
            endDate,
        });
    };
    const setToThisYear = () => {
        let startDate = dayjs().startOf('year').format('YYYY-MM-DD');
        let endDate = dayjs().endOf('year').format('YYYY-MM-DD');

        if (state.ctx.isNepali) {
            const currentNepaliDate = ADToBS(dayjs().format('YYYY-MM-DD'));
            const [year] = currentNepaliDate?.split('-') as string[];
            const getTotalDaysInCurrentNepaliMonth = lookUp.queryDays(year, 12)

            startDate = BSToAD(`${year}-01-01`) || startDate;
            endDate =
                BSToAD(`${year}-12-${getTotalDaysInCurrentNepaliMonth}`) || endDate;
        }
        setStartAndEndDate({
            startDate,
            endDate,
        });
    };

    const reset = () => {
        setStartAndEndDate({
            startDate : "",
            endDate: "",
        });
    };

    const handleChange = (e: any) => {
        const selectValue = e.target.value
        if (selectValue === "THIS_MONTH") {
            setToThisMonth()
        }
        if (selectValue === "THIS_YEAR") {
            setToThisYear()
        }
        if(selectValue === "") [
            reset()
        ]

        setValue(selectValue)
    }

    return <select onChange={handleChange} className="bg-transparent border border-gray-600 text-gray-300">
        <option value=""></option>
        <option value="THIS_MONTH">This Month</option>
        <option value="THIS_YEAR">This Year</option>
    </select>
}

export const Picker = () => {
    return  <DatePickerStoreProvider props={{
            mode: ModeEnum.RANGE,
            closeOnSelect: false,
            startDate: "",
            endDate: "",
            showSecondaryDate: true
        }} >
            <div className="max-w-screen-2xl mx-auto">
                <Toggle />
                <RangeSelector />
                <DateInput />
                <ViewVariant />
            </div>
        </DatePickerStoreProvider>
}