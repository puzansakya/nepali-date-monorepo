import { useDatePickerStore } from "nepali-react-datepicker"

export const Deburger = () => {
 const state = useDatePickerStore();
return <pre>{JSON.stringify(state, null, 2)}</pre>
}