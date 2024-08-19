import { DatePickerStoreProvider, ModeEnum } from "nepali-react-datepicker";
import { CalendarViewVariant } from "./calendar-view";

export const Picker = () => {
    return  <DatePickerStoreProvider props={{
            mode: ModeEnum.SINGLE,
            closeOnSelect: false,
            startDate: "",
            endDate: "",
            showSecondaryDate: true,
        }} >
            <div className="max-w-screen-2xl mx-auto">
                {/* <Toggle /> */}
                {/* <RangeSelector /> */}
                {/* <DateInput /> */}
                {/* <Deburger /> */}
                <CalendarViewVariant />
                {/* <CalendarViewWeekSelectorVariant /> */}
                {/* <YearlyView /> */}
            </div>
        </DatePickerStoreProvider>
}