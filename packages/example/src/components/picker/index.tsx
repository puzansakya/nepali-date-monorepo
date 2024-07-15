import { DatePickerStoreProvider, ModeEnum } from "nepali-react-datepicker";
import { CalendarViewVariant, CalendarViewWeekSelectorVariant } from "./calendar-view";
import { DateInput } from "./input";
import { Toggle } from "./toggle";
import { RangeSelector } from "./range-selector";




export const Picker = () => {
    return  <DatePickerStoreProvider props={{
            mode: ModeEnum.RANGE,
            closeOnSelect: false,
            startDate: "",
            endDate: "",
            showSecondaryDate: true
        }} >
            <div className="max-w-screen-2xl mx-auto">
                <Toggle />
                <RangeSelector />
                <DateInput />
                <CalendarViewVariant />
                {/* <CalendarViewWeekSelectorVariant /> */}
                {/* <YearlyView /> */}
            </div>
        </DatePickerStoreProvider>
}