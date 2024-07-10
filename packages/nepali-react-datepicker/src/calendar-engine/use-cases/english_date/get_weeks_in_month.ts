// migrated
export const get_weeks_in_month = (date: Date) => {
  const currentDate = new Date(date)

  const currentMonth: number = currentDate.getMonth()
  const startOfMonth: Date = new Date(currentDate.getFullYear(), currentMonth, 1)
  const endOfMonth: Date = new Date(currentDate.getFullYear(), currentMonth + 1, 0)

  const startOfWeek: number = startOfMonth.getDay()
  const daysInMonth: number = endOfMonth.getDate()

  return Math.ceil((daysInMonth + startOfWeek) / 7)
}
