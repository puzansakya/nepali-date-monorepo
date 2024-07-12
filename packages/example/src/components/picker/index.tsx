import { DatePickerStoreProvider, ModeEnum } from "nepali-react-datepicker";
import { CalendarViewWeekSelectorVariant } from "./calendar-view";
import { DateInput } from "./input";
import { Toggle } from "./toggle";




export const Picker = () => {
    return  <DatePickerStoreProvider props={{
            mode: ModeEnum.SINGLE,
            closeOnSelect: false,
            startDate: "",
            endDate: "",
            showSecondaryDate: true
        }} >
            <div className="max-w-screen-2xl mx-auto">
                <Toggle />
                {/* <RangeSelector /> */}
                <DateInput />
                {/* <CalendarViewVariant /> */}
                <CalendarViewWeekSelectorVariant />
                {/* <YearlyView /> */}
            </div>
        </DatePickerStoreProvider>
}