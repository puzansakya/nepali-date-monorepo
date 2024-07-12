import { useDatePickerStore, selectEvents, disableTogglerAfterMaxEngDate } from "nepali-react-datepicker";
import { Button } from "../controller";

export const Toggle = () => {

    const state = useDatePickerStore();
    const { toggleContext, } = selectEvents(state);

    const shouldDisableTogglerAfterMaxEngDate = disableTogglerAfterMaxEngDate(state)

    return <Button
        disabled={shouldDisableTogglerAfterMaxEngDate}
        onClick={toggleContext}>Toggle</Button>
}