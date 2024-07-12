import { selectCtx, selectEvents, useDatePickerStore } from "nepali-react-datepicker";
import { RenderGrid } from "../render-grid";

export const PickerBody = () => {
    const state = useDatePickerStore();

    const { gridDatesWithMeta, weeks, showSecondaryDate } = selectCtx(state)
    const { selectDay } = selectEvents(state)

    return <RenderGrid
        gridDates={gridDatesWithMeta.gridDates}
        selectDay={selectDay}
        weeks={weeks}
        showSecondaryDate={showSecondaryDate}
    />
}
