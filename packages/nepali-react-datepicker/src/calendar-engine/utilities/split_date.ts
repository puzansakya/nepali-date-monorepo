export const split_date = (date: string, separator = '-'): any => {
  const [year, month, day] = date.split(separator)

  return {
    day: parseInt(day, 10),
    month: parseInt(month, 10),
    year: parseInt(year, 10),
  }
}
