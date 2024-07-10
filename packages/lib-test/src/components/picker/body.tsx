import { zero_pad, DATE_NULLIFIER, selectCtx, selectEvents, useDatePickerStore } from "nepali-react-datepicker";

export const PickerBody = () => {
    const state = useDatePickerStore();

    const { gridDates, weeks, showSecondaryDate } = selectCtx(state)
    const { selectDay } = selectEvents(state)

    return <table >
        <thead id='header'>
            <tr id='weekday_panel' className="p-2">
                {weeks.map((weekDay: string, index: number) => (
                    <td
                        key={index}
                        id='weekday'
                        className="px-3 py-2 hover:bg-green-500 cursor-pointer transition-all duration-150"
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
                        className="p-2"
                    >
                        {calendarDate.map((dayInfo, weekDayIdx) => {

                            let className = "flex items-end gap-2 justify-center  px-3 py-2 hover:bg-green-500 cursor-pointer transition-all duration-150"

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