// migrated
export const get_first_day_of_the_month = (date: Date): number => {
  const year: number = date.getFullYear()
  const month: number = date.getMonth()

  const firstDayOfMonth: Date = new Date(year, month, 1)
  return firstDayOfMonth.getDay()
}
