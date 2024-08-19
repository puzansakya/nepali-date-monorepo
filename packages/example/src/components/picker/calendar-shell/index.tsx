import { PropsWithChildren } from "react"

interface CalendarrShellProps extends PropsWithChildren {

}
export const CalendarrShell = ({ children, ...rest }: CalendarrShellProps) => {
    return <div className="w-96 border border-gray-700" {...rest}>
        {children}
    </div>
}