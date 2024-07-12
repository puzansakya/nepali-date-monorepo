import React from "react";
import { YearBody } from "./year-body";
import { YearController } from "./year-controller";
import { selectEvents, useDatePickerStore } from "nepali-react-datepicker";

export const YearlyView = () => {
    const state = useDatePickerStore();

    const { openCalendar } = selectEvents(state)

    React.useEffect(() => {
        openCalendar("startDate")
    }, [])

    return <>
        <YearController />
        <YearBody />
    </>
}