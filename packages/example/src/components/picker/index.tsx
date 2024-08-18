import { DatePickerStoreProvider, ModeEnum } from "nepali-react-datepicker";
import { CalendarViewVariant, CalendarViewWeekSelectorVariant } from "./calendar-view";
import { DateInput } from "./input";
import { Toggle } from "./toggle";
import { RangeSelector } from "./range-selector";
import { Deburger } from "./deburger";

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