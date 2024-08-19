import { selectCtx, selectEvents, useDatePickerStore } from "nepali-react-datepicker";
import { MonthInfo } from "../controller";
import { MonthYearPanel } from "../month-year-panel";
import { RenderGrid } from "../render-grid";

export const YearBody = () => {
    const state = useDatePickerStore();

    const { yearGridDatesWithMeta, weeks, showSecondaryDate } = selectCtx(state)
    const { selectDay } = selectEvents(state)

    console.log({ yearGridDatesWithMeta });

    const yearGridDatesChunked: any[] = [];
    for (let i = 0; i < yearGridDatesWithMeta.length; i += 3) {
        yearGridDatesChunked.push(yearGridDatesWithMeta.slice(i, i + 3));
    }

    if (yearGridDatesChunked.length === 0) {
        return
    }

    return <table className="w-full">
        {Array.from({ length: 4 }, (_, i) => i).map((item: number) => {
            return <tr className="flex items-start">
                {yearGridDatesChunked[item].map((data: any, index: number) => <td className="p-4" key={index}>
                    <div className="flex flex-col gap-2">

                        <MonthInfo gridDatesWithMeta={data} />

                        <MonthYearPanel gridDatesWithMeta={data} />

                        <RenderGrid
                            gridDatesWithMeta={data.gridDatesWithMeta}
                            selectDay={selectDay}
                            weeks={weeks}
                            showSecondaryDate={showSecondaryDate}
                        />
                    </div>
                </td>)}
            </tr>
        })}
    </table>

}
