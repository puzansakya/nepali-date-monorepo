import { NextYearButton, PreviousYearButton } from "../controller";

export const YearController = () => {
    return <div className="flex text-sm items-center gap-3 justify-between">
            <PreviousYearButton />
            <NextYearButton />
    </div>;

}