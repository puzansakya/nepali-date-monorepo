/* eslint-disable @typescript-eslint/no-unused-vars */

// LIBS 
import { useDatePickerStore, selectCtx, selectEvents, ModeEnum, selectStartDate, selectEndDate } from 'nepali-react-datepicker';
import React from 'react';


export const DateInput = React.forwardRef(() => {
    const state = useDatePickerStore();

    const { startDateRef, endDateRef, mode, isDisabled } = selectCtx(state);
    const { openCalendar, onDateChange } = selectEvents(state);

    // LOCAL STATE
    const [value, setValue] = React.useState('');
    const [endValue, setEndValue] = React.useState('');

    const startDate = selectStartDate(state);
    const endDate = selectEndDate(state);

    React.useEffect(() => {
        setValue(startDate);
    }, [startDate]);

    React.useEffect(() => {
        setEndValue(endDate);
    }, [endDate]);

    const handleInputChange = (e: any) => {
        const inputValue = e.target.value;
        if (inputValue?.length > 10) {
            return;
        }
        setValue(inputValue);
        onDateChange(inputValue);
    };

    const handleEndInputChange = (e: any) => {
        const inputValue = e.target.value;
        if (inputValue?.length > 10) {
            return;
        }
        setEndValue(inputValue);
        onDateChange(inputValue);
    };

    const handleOnOpen = (type: 'startDate' | 'endDate') => {
        openCalendar(type);
    };

    return (
        <div className='flex items-center'>
            <input
                ref={startDateRef}
                value={value}
                autoComplete='off'
                placeholder='yyyy-mm-dd'
                disabled={isDisabled}
                onChange={handleInputChange}
                className='px-3 bg-transparent border border-gray-600 rounded-sm outline-none'
                onFocus={() => {
                    handleOnOpen('startDate');
                }}
            />

            {mode === ModeEnum.RANGE && <input
                ref={endDateRef}
                value={endValue}
                autoComplete='off'
                placeholder='yyyy-mm-dd'
                disabled={isDisabled}
                onChange={handleEndInputChange}
                className='px-3 bg-transparent border border-gray-600 rounded-sm outline-none'
                onFocus={() => {
                    handleOnOpen('endDate');
                }}
            />}
        </div>
    );
});