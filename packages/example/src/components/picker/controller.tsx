import dayjs from "dayjs";
import { ADToBS, BSToAD } from "nepali-dayjs-date-converter";
import { disableAfterMaxEngDate, ICalendarInternals, selectCtx, selectEvents, useDatePickerStore, zero_pad } from "nepali-react-datepicker";
import { PropsWithChildren } from "react";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

interface ButtonProps extends PropsWithChildren, Record<string, any> {
    className?: string
}
export const Button = ({ children, className, ...rest }: ButtonProps) => {
    return <button className={`px-3 py-1 hover:bg-green-500 transition-all duration-150 ${className}`} {...rest}>{children}</button>
}

export const Controller = () => {

    return <div className="flex text-sm items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
            <PreviousYearButton />
            <PreviousMonthButton />
        </div>

        <div className="flex mx-auto items-center gap-3" >
            <MonthButton />
            <p>-</p>
            <YearButton />
        </div>

        <div className="flex items-center gap-3">
            <NextMonthButton />
            <NextYearButton />
        </div>
    </div>;

};

export const PreviousYearButton = () => {
    const { previousYear } = selectEvents(useDatePickerStore());

    return <Button onClick={previousYear}><AiOutlineDoubleLeft /></Button>;
}


export const PreviousMonthButton = () => {
    const { previousMonth } = selectEvents(useDatePickerStore());

    return (
        <Button
            onClick={previousMonth}
        ><AiOutlineLeft /></Button>
    );
};

export const NextMonthButton = () => {
    const state = useDatePickerStore()
    const { nextMonth } = selectEvents(state);

    const shouldDisableAfterMaxEngDate = disableAfterMaxEngDate(state, (date: string) => {
        let new_reference_date = ADToBS(date);

        if (new_reference_date) {
            const [nepYY, nepMM,] = new_reference_date.split("-")
            let new_nepMM = parseInt(nepMM);
            let new_nepYY = parseInt(nepYY);

            new_nepMM = parseInt(nepMM + "") + 1

            if (new_nepMM === 13) {
                // jumped to previous year
                new_nepMM = 1
                new_nepYY = parseInt(nepYY + "") + 1
            }
            new_reference_date = `${new_nepYY}-${zero_pad(new_nepMM)}-01`
        }

        return BSToAD(new_reference_date as string) as string

    })

    return (
        <Button
            disabled={shouldDisableAfterMaxEngDate}
            id='next-month-button'
            onClick={nextMonth}
        ><AiOutlineRight /></Button>
    );
};


export const NextYearButton = () => {
    const state = useDatePickerStore()
    const { nextYear } = selectEvents(state);

    const shouldDisableAfterMaxEngDate = disableAfterMaxEngDate(state, (date: string) => {
        return dayjs(date).add(1, "year").format("YYYY-MM-DD")
    })

    return (
        <Button
            id='next-year-button'
            disabled={shouldDisableAfterMaxEngDate}
            onClick={nextYear}
        ><AiOutlineDoubleRight /></Button>
    );
};

export const MonthButton = () => {
    const state = useDatePickerStore()
    const { gridDatesWithMeta: { primaryMonth } } = selectCtx(state)

    const { goToMonthView } = selectEvents(state);

    return (
        <Button onClick={goToMonthView}>
            {primaryMonth}
        </Button>
    );
};

export const YearButton = () => {
    const state = useDatePickerStore()
    const { goToYearView } = selectEvents(state);
    const { gridDatesWithMeta: { primaryYear } } = selectCtx(state)

    return (
        <Button onClick={goToYearView}        >
            {primaryYear}
        </Button>
    );
};

export const MonthInfo = ({ gridDatesWithMeta: { primaryYear, primaryMonth } }:
    Pick<ICalendarInternals, 'gridDatesWithMeta'>
) => {
    return <div className="flex justify-center items-center gap-3 w-full" >
        {primaryMonth}
        <p>-</p>
        {primaryYear}
    </div>
}

