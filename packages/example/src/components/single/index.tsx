import { DatePickerStoreProvider, ModeEnum } from "nepali-react-datepicker";
import { CalendarViewVariant } from "../picker/calendar-view";
import { CalendarrShell } from "../picker/calendar-shell";
import { Toggle } from "../picker/toggle";

export const Single = () => {
    return <DatePickerStoreProvider props={{
        mode: ModeEnum.SINGLE,
        closeOnSelect: false,
        startDate: "",
        endDate: "",
        showSecondaryDate: true,
        isOpen:true
    }} >
        {/* <div className="max-w-screen-2xl mx-auto">
        </div> */}
        <CalendarrShell>
            <Toggle />
            <CalendarViewVariant />
        </CalendarrShell>
    </DatePickerStoreProvider>
}