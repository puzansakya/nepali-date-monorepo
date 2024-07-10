import React from 'react'

import { PropsSyncer } from './props-syncer'
import { createMyStore } from './store'
import { StoreContext } from './context'
import { ICalendarProps } from './model'

export const DatePickerStoreProvider = ({
  props,
  children,
}: {
  props: ICalendarProps
  children: React.ReactNode
}) => {
  // Reference this for singleton ->  https://github.com/pmndrs/zustand/blob/main/docs/guides/initialize-state-with-props.md

  const store = React.useRef(createMyStore(props)).current
  return (
    <StoreContext.Provider value={store}>
      <PropsSyncer {...props} />
      {children}
    </StoreContext.Provider>
  )
}
