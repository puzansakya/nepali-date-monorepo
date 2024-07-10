import React from 'react'
import { useStore as useZustandStore } from 'zustand'
import { StoreContext } from './context'

export const useDatePickerStore = () => {
  const store = React.useContext(StoreContext)
  if (store === null) {
    throw new Error('no provider')
  }

  return useZustandStore(store)
}
