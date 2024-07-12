import { DATE_NULLIFIER, ICalendarEvents, ICalendarInternals, ICalendarProps, selectCtx, selectEvents, useDatePickerStore, zero_pad } from "nepali-react-datepicker";

export const PickerBodyWithWeekSelector = () => {
    const state = useDatePickerStore();

    const { gridDatesWithMeta, weeks, showSecondaryDate } = selectCtx(state)
    const { setStartAndEndDate,  } = selectEvents(state)

    return <RenderGrid
        gridDates={gridDatesWithMeta.gridDates}
        setStartAndEndDate={setStartAndEndDate}
        weeks={weeks}
        showSecondaryDate={showSecondaryDate}
    />
}



 const RenderGrid = ({ gridDates, setStartAndEndDate, weeks, showSecondaryDate }:
    Pick<ICalendarProps, 'showSecondaryDate'> &
    Pick<ICalendarInternals, 'gridDates' | "weeks"> &
    Pick<ICalendarEvents, 'setStartAndEndDate'>
) => {

    return <table className="border border-gray-700 ">
        <thead id='header'>
            <tr id='weekday_panel' className="p-1">
                {weeks.map((weekDay: string, index: number) => (
                    <td
                        key={index}
                        id='weekday'
                        className="px-3 py-1 hover:bg-green-500 cursor-pointer transition-all duration-150"
                    >
                        <div className="flex items-center justify-center">
                            {weekDay}
                        </div>
                    </td>
                ))}
            </tr>
        </thead>
        <tbody
            id='body'
        >
            {gridDates.map((calendarDate, weekRowIdx) => {
                const isSelected = calendarDate.some(dayInfo => dayInfo.isSelected)
                return (
                    <tr
                        key={`week-row-${weekRowIdx}`}
                        id='day_panel'
                        className={`p-1 hover:bg-red-500 hover:text-gray-50 rounded-full transition-all duration-150 ${isSelected ? "bg-red-500" : ""}`}
                    >
                        {calendarDate.map((dayInfo, weekDayIdx) => {

                            let className = "flex items-end gap-1 justify-center px-1  cursor-pointer transition-all duration-150"

                            if (dayInfo.isToday) {
                                className += " bg-green-500"
                            }

                            return (
                                <td
                                    id='day_base'
                                    key={`week-day-${weekDayIdx}`}
                                    // className="flex items-center gap-2 justify-center"
                                    onClick={() => {
                                        if (dayInfo.isDisabled) {
                                            return;
                                        }

                                        const startDate = `${gridDates[weekRowIdx][0]?.workingYear}-${zero_pad(gridDates[weekRowIdx][0]?.workingMonth as number,)}-${zero_pad(gridDates[weekRowIdx][0]?.workingDay as number)}`;
                                        const endDate = `${gridDates[weekRowIdx][gridDates[weekRowIdx].length -1]?.workingYear}-${zero_pad(gridDates[weekRowIdx][gridDates[weekRowIdx].length -1]?.workingMonth as number,)}-${zero_pad(gridDates[weekRowIdx][gridDates[weekRowIdx].length -1]?.workingDay as number)}`;

                                        setStartAndEndDate({
                                            startDate,
                                            endDate,
                                        })
                                    }}
                                >
                                    <div aria-label='cell' id='cell' className={className}>
                                        <p id='primary_label'>
                                            {dayInfo.primaryDay}
                                        </p>

                                        {showSecondaryDate && dayInfo.secondaryDay !== DATE_NULLIFIER && <p className="text-xs text-gray-300" id='secondary_label' >
                                            {dayInfo.secondaryDay}
                                        </p>}

                                    </div>
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
        </tbody>
    </table>
}