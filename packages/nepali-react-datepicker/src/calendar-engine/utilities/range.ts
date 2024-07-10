export const range = (start: number, end: number, step = 1): number[] => {
  const list = []

  for (let i = start; i <= end; i = i + step) {
    list.push(i)
  }

  return list
}
