import dayjs from "dayjs";
import { ADToBS, lookUp, BSToAD } from "nepali-dayjs-date-converter";
import { useDatePickerStore, selectEvents } from "nepali-react-datepicker";
import React from "react";

export const RangeSelector = () => {

    const [_, setValue] = React.useState("THIS_MONTH");
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
