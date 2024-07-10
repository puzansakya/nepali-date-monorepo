import dayjs from "dayjs"
import lookUp from "./look-up";
import { zero_pad } from "../zero-pad";

const en_ref_date = "1943-04-14"

const binarySearch = (arr: number[], target: number): number => {
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);

        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    if (arr[high] > target) {
        return high;
    } else {
        return low;
    }
}

export const ad2bs = (date: string) => {

    const total_days = dayjs(date).diff(en_ref_date, "day");

    const accumulator_arr = Object.keys(lookUp.dataset).map(o => parseInt(o))
    const value_arr = Object.values(lookUp.dataset)

    const found_index:any = binarySearch(accumulator_arr, total_days)


    let diff = total_days - accumulator_arr[found_index]

    let adjusted_diff = diff < 0 ? total_days - accumulator_arr[found_index - 1] : diff;

    // console.log("total days", value_arr[found_index].month_days[13])
    // console.log("diff", diff)
    // console.log("adjusted_diff", adjusted_diff)

    let nep_mm = 1;
    let nep_dd = 1;

    while (adjusted_diff > 0) {
        const daysInMonth = value_arr[found_index].month_days[nep_mm];

        nep_dd++;

        if (nep_dd > daysInMonth) {
            nep_mm++;
            nep_dd = 1;
        }
        if (nep_mm > 12) {
            nep_mm = 1;
        }

        adjusted_diff--;
    }

    let resolved_year = value_arr[found_index].year

    return `${resolved_year}-${zero_pad(nep_mm)}-${zero_pad(nep_dd)}`
}

export const bs2ad = (date: string) => {

    const [year, month, day] = date.split("-")
    const accumulator_arr = Object.keys(lookUp.dataset).map(o => parseInt(o))
    const value_arr = Object.values(lookUp.dataset)

    const found_index = value_arr.findIndex((o) => {
        return o.year === parseInt(year)
    })

    const found_year = value_arr[found_index]

    // console.log({ found_year })

    let total_days_for_previous_year = accumulator_arr[found_index - 1]

    let nep_mm = 1;

    let numbe_of_days_to_add = 0;

    while (nep_mm < parseInt(month)) {
        numbe_of_days_to_add += found_year.month_days[nep_mm]
        nep_mm++;
    }

    let nep_dd = 1;

    while (nep_dd < parseInt(day)) {
        numbe_of_days_to_add++;
        nep_dd++;
    }

    const resolved_total_days = total_days_for_previous_year + numbe_of_days_to_add

    // console.log({ en_total_days: dayjs("2024-04-15").diff(dayjs(en_ref_date), "day") })

    // console.log({ np_total_days: resolved_total_days })

    const en_date = dayjs(en_ref_date).add(resolved_total_days, "day").format("YYYY-MM-DD");

    // console.log({ en_date })

    return en_date
}