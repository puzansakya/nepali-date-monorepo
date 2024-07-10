import { DATE_NULLIFIER, IDayInfo, selectCtx, selectEvents, useDatePickerStore, zero_pad } from "nepali-react-datepicker";

export const YearBody = () => {
    const state = useDatePickerStore();

    const { yearGridDates } = selectCtx(state)

    const yearGridDatesChunked: any[] = [];
    for (let i = 0; i < yearGridDates.length; i += 3) {
        yearGridDatesChunked.push(yearGridDates.slice(i, i + 3));
    }

    if (yearGridDatesChunked.length === 0) {
        return
    }

    return <table className="w-full">
        {Array.from({ length: 4 }, (_, i) => i).map((item: number) => {
            return <tr className="flex items-start">
                {yearGridDatesChunked[item].map((gridDates: any, index: number) => <td className="p-4 " key={index}><RenderGrid gridDates={gridDates} /></td>)}
            </tr>
        })}
    </table>

}

const RenderGrid = ({ gridDates }: { gridDates: IDayInfo[][] }) => {
    const state = useDatePickerStore();
    const { weeks, showSecondaryDate } = selectCtx(state)
    const { selectDay } = selectEvents(state)

    return <table className=" border border-gray-700 mt-4">
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
                return (
                    <tr
                        key={`week-row-${weekRowIdx}`}
                        id='day_panel'
                        className="p-1"
                    >
                        {calendarDate.map((dayInfo, weekDayIdx) => {

                            let className = "flex items-end gap-1 justify-center px-1 hover:bg-green-500 cursor-pointer transition-all duration-150"

                            if (dayInfo.isSelected) {
                                className += " bg-blue-500"
                            }
                            if (dayInfo.isToday) {
                                className += " bg-green-500"
                            }
                            if (dayInfo.isDisabled) {
                                className += " opacity-50"
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

                                        const working_date = `${dayInfo?.workingYear}-${zero_pad(dayInfo?.workingMonth as number,)}-${zero_pad(dayInfo?.workingDay as number)}`;

                                        selectDay(working_date);
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