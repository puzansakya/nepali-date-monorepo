export const get_weeks_in_month = (parsed_date: any) => {
  return (
    Math.ceil((parsed_date.firstAdDayInBSMonth.getDay() + parsed_date.numberOfDaysInBSMonth) / 7) -
    1
  )
}
