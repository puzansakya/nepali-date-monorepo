import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { Button } from "./controller";
import { useDatePickerStore, selectCtx, selectEvents } from "nepali-react-datepicker";

export const MonthViewMode = () => {

    const state = useDatePickerStore();

    const {
        gridMonths,
        calendarReferenceDate
    } = selectCtx(state);

    const {
        goToYearView,
        getNextYear,
        getPreviousYear,
        selectMonth,
    } = selectEvents(state);

    return <>
        {/* START MONTH CONTROLLER */}
        <div className="flex justify-between"        >
            <Button
                aria-label='previous_year_button'
                id='previous_year_button'
                onClick={getPreviousYear}
            ><AiOutlineDoubleLeft /></Button>

            <Button
                id="year_view_mode_button"
                onClick={goToYearView}>
                <p>{calendarReferenceDate.split("-")[0]}</p>
            </Button>

            <Button
                aria-label='next-year-button'
                id='next-year-button'
                onClick={getNextYear}
            ><AiOutlineDoubleRight /></Button>

        </div>
        {/* END MONTH CONTROLLER */}
        <div className="p-2 flex flex-wrap gap-2">
            {gridMonths.map((month: string, index: number) => {
                return <Button
                    key={index}
                    id="month_cell_button"
                    className="flex-1"
                    onClick={() => {
                        selectMonth(index + 1)
                    }}
                >
                    <p>{month}</p>
                </Button>
            })}

        </div>
    </>

}