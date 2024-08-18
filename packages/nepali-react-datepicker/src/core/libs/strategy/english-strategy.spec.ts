// en strat.test.js
import { describe, it, expect } from 'vitest';
import { Pipeline } from '../../../utilities/pipeline';
import { getStrategy } from "./strategy-provider";

import { DEFAULT_PROPS, INTERNAL_PROPS } from "../../models/store";
import { ICalendarCtx } from "../../models/model";

describe('english strategy', () => {

    describe('setGridDatesWithMeta', () => {
        it('base case: should return true if provided start date is selected', async () => {

            const strategyProvider = getStrategy(false);

            const p = Pipeline<{ next: ICalendarCtx }>();

            p.push(strategyProvider.setGridDatesWithMeta);

            const { next: { gridDatesWithMeta: gridDatesWithMeta1 } } = await p.execute({
                next: {
                    ...DEFAULT_PROPS,
                    ...INTERNAL_PROPS,
                    calendarReferenceDate: "2024-05-08",
                    isOpen: true
                },
            });

            expect(gridDatesWithMeta1.gridDates.length).not.toBe(0);

            const { next: { gridDatesWithMeta: gridDatesWithMet2 } } = await p.execute({
                next: {
                    ...DEFAULT_PROPS,
                    ...INTERNAL_PROPS,
                    calendarReferenceDate: "2024-06-01",
                    isOpen: true,
                    startDate: "2024-06-01"
                },
            });

            let found_date: any = null;

            gridDatesWithMet2.gridDates.forEach((calendar_row: any) => {
                calendar_row.forEach((date_item: any) => {
                    if (date_item.primaryDay === 1 && date_item.primaryMonth === 6 && date_item.primaryYear === 2024) {
                        found_date = date_item
                    }
                })
            })


            expect(found_date.isSelected).toBe(true);
        });
    })

    // describe('setMonthYearPanelData', () => {
    //     it('base case: happy path', async () => {

    //         const strategyProvider = getStrategy(false);

    //         const p = Pipeline<any>();

    //         p.push(strategyProvider.setMonthYearPanelData);

    //         let next = {
    //             ...DEFAULT_PROPS,
    //             ...INTERNAL_PROPS,
    //             calendarReferenceDate: "2024-05-08",
    //             isOpen: true
    //         }

    //         const { next: { monthYearPanelData: res1 } } = await p.execute({
    //             next
    //         });

    //         expect(res1).toBe("वैशाख - जेठ २०८१");

    //     });

    //     it('base case: should return empty placeholder if calendarReferenceDate is after MAX_ENG_DATE', async () => {

    //         const strategyProvider = getStrategy(false);

    //         const p = Pipeline<any>();

    //         p.push(strategyProvider.setMonthYearPanelData);

    //         let next = {
    //             ...DEFAULT_PROPS,
    //             ...INTERNAL_PROPS,
    //             calendarReferenceDate: "2033-05-01",
    //             isOpen: true
    //         }

    //         // PASS 1
    //         const { next: { monthYearPanelData: res } } = await p.execute({
    //             next
    //         });

    //         expect(res).toBe("-");

    //     });
    // })

    describe('setConvertedDate', () => {
        it('base case', async () => {

            const strategyProvider = getStrategy(false);

            const p = Pipeline<any>();

            // pass 1
            p.push(strategyProvider.setConvertedDate({
                startDate: "2024-10-19",
                endDate: "2024-10-29"
            }));

            const { next: { startDate: startDate1, endDate: endDate1 } } = await p.execute({
                next: {
                    ...DEFAULT_PROPS,
                    ...INTERNAL_PROPS,
                    isOpen: true
                },
            });

            expect(startDate1).toBe("2024-10-19");
            expect(endDate1).toBe("2024-10-29");


            // pass 2
            p.push(strategyProvider.setConvertedDate({
                startDate: "2024/10/19",
                endDate: "2024/10/29"
            }));

            const { next: { startDate: startDate3, endDate: endDate3 } } = await p.execute({
                next: {
                    ...DEFAULT_PROPS,
                    ...INTERNAL_PROPS,
                    isOpen: true
                },
            });

            expect(startDate3).toBe("2024-10-19");
            expect(endDate3).toBe("2024-10-29");


            // pass 3
            p.push(strategyProvider.setConvertedDate({
                startDate: "",
                endDate: ""
            }));

            const { next: { startDate: startDate2, endDate: endDate2 } } = await p.execute({
                next: {
                    ...DEFAULT_PROPS,
                    ...INTERNAL_PROPS,
                    isOpen: true
                },
            });

            expect(startDate2).toBe("");
            expect(endDate2).toBe("");


        });
    })

})

