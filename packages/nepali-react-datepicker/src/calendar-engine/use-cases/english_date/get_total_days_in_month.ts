// migrated
export const get_total_days_in_month = (date: Date): number => {
  const year = date.getFullYear()
  const month = date.getMonth()

  return new Date(year, month + 1, 0).getDate()
}
