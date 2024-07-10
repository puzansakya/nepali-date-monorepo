import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { Button } from "./controller";
import { useDatePickerStore, selectCtx, selectEvents, disablePreviousDecade, disableNextDecade } from "nepali-react-datepicker";

export const YearViewMode = () => {

    const state = useDatePickerStore()
    const { gridYears } = selectCtx(state);
    const { selectYear, getNextDecadeYearGrid, getPreviousDecadeYearGrid } = selectEvents(state);

    const shouldDisablePreviousDecadeButton = disablePreviousDecade(state);
    const shouldDisableNextDecadeButton = disableNextDecade(state);

    return <>
        <div className="flex justify-between">
            <Button
                aria-label='previous-decard-button'
                id='next-year-button'
                isDisabled={shouldDisablePreviousDecadeButton}
                icon={<AiOutlineDoubleLeft />}
                onClick={getPreviousDecadeYearGrid}
            />

            <p className="p-2">
                {gridYears[0]} - {gridYears[0] + 11}
            </p>
            <Button
                aria-label='next-decard-button'
                id='next-year-button'
                isDisabled={shouldDisableNextDecadeButton}
                icon={<AiOutlineDoubleRight />}
                onClick={getNextDecadeYearGrid}
            />
        </div>
        <div className="flex p-2 flex-wrap gap-2">
            {gridYears.map((year: number, index: number) => {
                return <Button
                    key={index}
                    className="flex-1"
                    onClick={() => {
                        selectYear(year)
                    }}
                >
                    <p className="font-light" >{year}</p>
                </Button>
            })}
        </div>
    </>

}