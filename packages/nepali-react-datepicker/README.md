### React Nepali Datepicker

### Install
```bash
npm i nepali-datepicker-react
```
```bash
yarn add nepali-datepicker-react
```
```bash
pnpm i nepali-datepicker-react
```
### Usage

#### Provider usage
```tsx
import { useDatePickerStore, selectEvents, selectCtx, disableTogglerAfterMaxEngDate, DatePickerStoreProvider, ModeEnum } from "nepali-datepicker-react";

<DatePickerStoreProvider props={{
        mode: ModeEnum.RANGE,
        closeOnSelect: false,
        startDate: "",
        endDate: "",
        showSecondaryDate: true
    }} >
        <div className="items-start flex flex-col gap-3">
            {...your_component}
        </div>
    </DatePickerStoreProvider>
```

#### Hook usage
```tsx
import { zero_pad, DATE_NULLIFIER, selectCtx, selectEvents, useDatePickerStore } from "nepali-datepicker-react";

export const PickerBody = () => {
    const state = useDatePickerStore();

    const { gridDates, weeks, showSecondaryDate } = selectCtx(state)
    const { selectDay } = selectEvents(state)

    return ...
}
```


### Props
**Calendar Props**

| Prop Name         | Type                                | Default         | Description                                                                                                                                                  |
| ----------------- | ----------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| startDate         | startDate                           | --              |                                                                                                                                                              |
| endDate           | endDate                             |                 |                                                                                                                                                              |
| disabledWeekDays  | disabled                            | []              | This is the array of week days that is used to disable the week days in the calendar if value is [1,2,3] then sunday, monday and tuesday cells are disabled. |
| holidays          | holidays                            | []              | This holds the holidays, based on this cells are disabled                                                                                                    |
| isNepali          | isNepali                            | false           | This is used to determine if the calendar context is in nepali or english.                                                                                   |
| mode              | mode                                | ModeEnum.SINGLE | This is the mode of the datepicker.                                                                                                                          |
| disableDateBefore | string                              | -               | This is the date before which datepicker should be disabled.                                                                                                 |
| disableDateAfter  | string                              | -               | This is the date after which datepicker should be disabled.                                                                                                  |
| onChange          | (date: string) => void \| undefined | undefined       | This gets triggered when date changes.                                                                                                                       |
| onError           | (date: string) => void              | undefined       | This gets triggered when there is an error.                                                                                                                  |
| isDisabled        | boolean                             | false           | This is the determine if input should be disabled or not.                                                                                                    |
| isRhfBound        | boolean                             | false           | This is the determine if input should be bound with rhf or not.                                                                                              |
| showToggle        | boolean                             | false           | Determine if the is nepali toggle button should be shown or not.                                                                                             |
| closeOnSelect     | boolean                             | false           | Determine if the picker should be closed on day select.                                                                                                      |
| showSecondaryDate | boolean                             | false           | Determine if the secondary date should be shown or not.                                                                                                      |
| showRangeMenu   | boolean                             | false           | Determine if the is range menu (this week, this month, etc...) should be shown or not.                                                                       |



### Roadmap
- [ ] yearly grid view