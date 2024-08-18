// nep strat.test.js
import { describe, expect, it } from 'vitest';
import { Pipeline } from '../../../utilities/pipeline';
import { getStrategy } from "./strategy-provider";
import { today } from '../../config';
import dayjs from 'dayjs';
import { DEFAULT_PROPS, INTERNAL_PROPS } from "../../models/store";
import { ICalendarCtx } from "../../models/model";

describe('nepali strategy', () => {

    describe('setDate', () => {
        it('should set the date in the context when a valid date is provided', async () => {

            const strategyProvider = getStrategy(true);

            const p = Pipeline<any>();

            p.push(strategyProvider.setDate('2080-12-01'));

            const { next: { startDate: res } } = await p.execute({
                next: {
                    currentDateSelection: "startDate"
                },
            });

            expect(res).toBe('2080-12-01');
        });
    })

    describe('setConvertedDate', () => {
        it('base case', async () => {

            const strategyProvider = getStrategy(true);

            const p = Pipeline<any>();

            p.push(strategyProvider.setConvertedDate({
                startDate: '2024-06-17',
                endDate: '2024-06-20'
            }));

            const { next: { startDate, endDate } } = await p.execute({
                next: {
                    mode: "range"
                },
            });

            expect(startDate).toBe('2024-06-17');
            expect(endDate).toBe('2024-06-20');

            p.push(strategyProvider.setConvertedDate({
                startDate: '2024-06-17',
                endDate: '2024-06-20'
            }));

            const { next: { startDate: startDate1, } } = await p.execute({
                next: {
                    mode: "single"
                },
            });

            expect(startDate1).toBe('2024-06-17');

            // pass 1
            const d = Pipeline<any>();

            d.push(strategyProvider.setConvertedDate({
                startDate: "2024-10-19",
                endDate: "2024-10-29"
            }));

            const { next: { startDate: startDatex, endDate: endDatex } } = await d.execute({
                next: {
                    ...DEFAULT_PROPS,
                    ...INTERNAL_PROPS,
                    isOpen: true
                },
            });

            expect(startDatex).toBe("2024-10-19");
            expect(endDatex).toBe("2024-10-29");

            // pass 2
            d.push(strategyProvider.setConvertedDate({
                startDate: "2024/10/19",
                endDate: "2024/10/29"
            }));

            const { next: { startDate: startDate2, endDate: endDate2 } } = await d.execute({
                next: {
                    ...DEFAULT_PROPS,
                    ...INTERNAL_PROPS,
                    isOpen: true
                },
            });

            expect(startDate2).toBe("2024-10-19");
            expect(endDate2).toBe("2024-10-29");

            // // pass 3
            const x = Pipeline<any>();

            x.push(strategyProvider.setConvertedDate({
                startDate: "",
                endDate: ""
            }));

            const { next: { startDate: startDate3, endDate: endDate3 } } = await x.execute({
                next: {
                    ...DEFAULT_PROPS,
                    ...INTERNAL_PROPS,
                    startDate: "",
                    endDate: "",
                    isOpen: true
                },
            });

            expect(startDate3).toBe("");
            expect(endDate3).toBe("");

        });
    })

    describe('decrementMonth', () => {

        it('base case', async () => {
            const strategyProvider = getStrategy(true);

            const p = Pipeline<any>();

            p.push(strategyProvider.decrementMonth);

            const { next: { calendarReferenceDate: res1 } } = await p.execute({
                next: {
                    calendarReferenceDate: "2024-06-02"
                },
            });

            expect(res1).toBe("2024-04-13")

            const { next: { calendarReferenceDate: res2 } } = await p.execute({
                next: {
                    calendarReferenceDate: "2024-10-29"
                },
            });

            expect(res2).toBe("2024-09-17")

            const { next: { calendarReferenceDate: res3 } } = await p.execute({
                next: {
                    calendarReferenceDate: "2029-09-29"
                },
            });

            expect(res3).toBe("2029-08-17")
        })

        it('should return previous year and last month for baisakhs', async () => {
            const strategyProvider = getStrategy(true);

            const p = Pipeline<any>();

            p.push(strategyProvider.decrementMonth);

            const { next: { calendarReferenceDate: res1 } } = await p.execute({
                next: {
                    calendarReferenceDate: "2024-05-02"
                },
            });


            expect(res1).toBe("2024-03-14")
        })

    })

    describe('incrementMonth', () => {

        it('base case', async () => {
            const strategyProvider = getStrategy(true);

            const p = Pipeline<any>();

            p.push(strategyProvider.incrementMonth);

            // pass 1
            const { next: { calendarReferenceDate: res1 } } = await p.execute({
                next: {
                    calendarReferenceDate: "2024-05-02"
                },
            });

            expect(res1).toBe("2024-05-14")

            // pass 2
            const { next: { calendarReferenceDate: res2 } } = await p.execute({
                next: {
                    calendarReferenceDate: "2024-06-02"
                },
            });

            expect(res2).toBe("2024-06-15")

            // pass 3
            const { next: { calendarReferenceDate: res3 } } = await p.execute({
                next: {
                    calendarReferenceDate: "2024-07-04"
                },
            });

            expect(res3).toBe("2024-07-16")
        })

        it('should return next year and first month for all the chaitras', async () => {
            const strategyProvider = getStrategy(true);

            const p = Pipeline<any>();

            p.push(strategyProvider.incrementMonth);

            const { next: { calendarReferenceDate: res1 } } = await p.execute({
                next: {
                    calendarReferenceDate: "2025-04-05"
                },
            });

            expect(res1).toBe("2025-04-14")
        })

    })

    describe('setIsTodayValid', () => {

        it('base case', async () => {
            const strategyProvider = getStrategy(true);

            const p = Pipeline<any>();

            p.push(strategyProvider.setIsTodayValid(today));

            const { next: { isTodayValid: res } } = await p.execute({
                next: {
                    disableDateBefore: "",
                    disableDateAfter: ""
                },
            });

            expect(res).toBe(true)
        })

        it('should return true when disabled date before and after are provided and today is inside the dda and ddb range', async () => {
            const strategyProvider = getStrategy(true);

            const p = Pipeline<any>();

            p.push(strategyProvider.setIsTodayValid(today));

            const { next: { isTodayValid: res } } = await p.execute({
                next: {
                    disableDateBefore: dayjs(today).subtract(1, "week"),
                    disableDateAfter: dayjs(today).add(1, "week"),
                },
            });

            expect(res).toBe(true)
        })

        it('should return false when disabled date before and after are provided and today is not inside the dda and ddb range', async () => {
            const strategyProvider = getStrategy(true);

            const p = Pipeline<any>();

            p.push(strategyProvider.setIsTodayValid(today));

            const { next: { isTodayValid: res } } = await p.execute({
                next: {
                    disableDateBefore: dayjs(today).add(1, "week"),
                    disableDateAfter: dayjs(today).add(2, "week"),
                },
            });

            expect(res).toBe(false)
        })

    })

    describe('setGridDatesWithMeta', () => {
        it('base case', async () => {

            const strategyProvider = getStrategy(true);

            const p = Pipeline<{ next: ICalendarCtx }>();

            p.push(strategyProvider.setGridDatesWithMeta);

            const { next: { gridDatesWithMeta: gridDatesWithMeta1 } } = await p.execute({
                next: {
                    ...DEFAULT_PROPS,
                    ...INTERNAL_PROPS,
                    calendarReferenceDate: "2024-06-17",
                    isOpen: true,
                    startDate: "2024-06-17"
                },
            });

            expect(gridDatesWithMeta1.gridDates.length).not.toBe(0);

            let found_date: any = null;

            gridDatesWithMeta1.gridDates.forEach((calendar_row: any) => {
                calendar_row.forEach((date_item: any) => {
                    if (date_item.isSelected) {
                        found_date = date_item
                    }
                })
            })

            expect(found_date.workingDay).toBe(17);
            expect(found_date.workingMonth).toBe(6);
            expect(found_date.workingYear).toBe(2024);
        });
    })


})

