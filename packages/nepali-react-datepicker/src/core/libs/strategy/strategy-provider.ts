import { EnglishStrategy } from './english-strategy'
import { NepaliStrategy } from './nepali-strategy'

export const StrategyProvider = {
  nepali: NepaliStrategy,
  english: EnglishStrategy,
}

export const getStrategy = (isNepali: boolean) => {
  if (isNepali) {
    return NepaliStrategy
  }
  return EnglishStrategy
}
