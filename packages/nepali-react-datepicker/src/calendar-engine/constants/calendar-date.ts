export const months = {
  en: [
    'Baisakh',
    'Jestha',
    'Asar',
    'Shrawan',
    'Bhadra',
    'Asoj',
    'Kartik',
    'Mangsir',
    'Pouse',
    'Magh',
    'Falgun',
    'Chaitra',
  ],
  ne: [
    'वैशाख',
    'जेठ',
    'असार',
    'साउन',
    'भदौ',
    'असौज',
    'कात्तिक',
    'मंसीर',
    'पुस',
    'माघ',
    'फागुन',
    'चैत',
  ],
}

export const ENGLISH_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const weeks = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ne: ['आईत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि'],
}

export const nepaliMonthMap: any = {
  0: 'पुस - माघ',
  1: 'माघ - फागुन',
  2: 'फागुन - चैत',
  3: 'चैत - वैशाख',
  4: 'वैशाख - जेठ',
  5: 'जेठ - असार',
  6: 'असार - साउन',
  7: 'साउन - भदौ',
  8: 'भदौ - असौज',
  9: 'असौज - कात्तिक',
  10: 'कात्तिक - मंसीर',
  11: 'मंसीर - पुस',
}

export const englishMonthMap: any = {
  0: 'April - May',
  1: 'May - June',
  2: 'June - July',
  3: 'July - August',
  4: 'August - September',
  5: 'September - October',
  6: 'October - November',
  7: 'November - December',
  8: 'December - January',
  9: 'January - February',
  10: 'February - March',
  11: 'March - April',
}

export const maxBSYear = 2100
export const minBSYear = 1970
export const maxADYear = maxBSYear - 57
export const minADYear = minBSYear - 57

export const bsMonthMaxDays = [
  [30, 31],
  [31, 32],
  [31, 32],
  [31, 32],
  [31, 32],
  [30, 31],
  [29, 30],
  [29, 30],
  [29, 30],
  [29, 30],
  [29, 30],
  [30, 31],
]

export const bsMonthCalculatedData = [
  [
    0, 1, 1, 22, 1, 3, 1, 1, 1, 3, 1, 22, 1, 3, 1, 3, 1, 22, 1, 3, 1, 19, 1, 3, 1, 1, 3, 1, 2, 2, 1,
    3, 1,
  ],
  [
    1, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 2, 2, 2, 3, 2, 2, 2, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2,
    2, 1, 3, 1, 1, 2,
  ],
  [
    0, 1, 2, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 1, 1, 1, 2, 2, 2,
    2, 2, 1, 3, 1, 1, 2,
  ],
  [
    1, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2,
    1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 2, 2, 1, 3, 1, 2,
    2, 2, 1, 2,
  ],
  [59, 1, 26, 1, 28, 1, 2, 1, 12],
  [
    0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 1, 1, 2, 2, 1,
    3, 1, 2, 1, 2,
  ],
  [0, 12, 1, 3, 1, 3, 1, 5, 1, 11, 1, 3, 1, 3, 1, 18, 1, 3, 1, 3, 1, 18, 1, 3, 1, 3, 1, 27, 1, 2],
  [
    1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 3, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 15, 2, 4,
  ],
  [
    0, 1, 2, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 3, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2,
    2, 2, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 2, 2, 2, 15, 2, 4,
  ],
  [
    1, 1, 3, 1, 3, 1, 14, 1, 3, 1, 1, 1, 3, 1, 14, 1, 3, 1, 3, 1, 3, 1, 18, 1, 3, 1, 3, 1, 3, 1, 14,
    1, 3, 15, 1, 2, 1, 1,
  ],
  [
    0, 1, 1, 3, 1, 3, 1, 10, 1, 3, 1, 3, 1, 1, 1, 3, 1, 3, 1, 10, 1, 3, 1, 3, 1, 3, 1, 3, 1, 14, 1,
    3, 1, 3, 1, 3, 1, 3, 1, 10, 1, 20, 1, 1, 1,
  ],
  [
    1, 2, 2, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 2,
    2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 20, 3,
  ],
]

export const nepaliMonthInNumber: any = {
  Baisakh: 1,
  Jestha: 2,
  Ashadh: 3,
  Shrawan: 4,
  Bhadra: 5,
  Ashwin: 6,
  Kartik: 7,
  Mangsir: 8,
  Poush: 9,
  Magh: 10,
  Falgun: 11,
  Chaitra: 12,
}
export const englishMonthInNumber: any = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
}
export const ENGLISH_DAY: any = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
}
export const FULL_ENGLISH_DAY: any = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
}
