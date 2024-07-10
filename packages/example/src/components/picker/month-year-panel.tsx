import { useDatePickerStore, selectCtx } from "nepali-react-datepicker"

export const MonthYearPanel = () => {

    const state = useDatePickerStore()

    const { monthYearPanelData, showSecondaryDate } = selectCtx(state)

    if(!showSecondaryDate) {
        return null
    }
    return <div className="w-full text-sm text-center py-2 text-gray-300">
        {monthYearPanelData}
    </div>
}