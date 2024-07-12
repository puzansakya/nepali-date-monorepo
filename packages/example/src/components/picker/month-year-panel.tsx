import { ICalendarInternals, selectCtx, useDatePickerStore } from "nepali-react-datepicker"

export const MonthYearPanel = ({ gridDatesWithMeta: {secondaryMonthCombination, secondaryYear}  }:
    Pick<ICalendarInternals, 'gridDatesWithMeta'> 
) => {

    const state = useDatePickerStore()

    const { showSecondaryDate } = selectCtx(state)

    if (!showSecondaryDate) {
        return null
    }
    
    return <div className="w-full bg-gray-800 text-xs text-center py-2 text-gray-300">
        {secondaryMonthCombination}  {secondaryYear}
    </div>
}