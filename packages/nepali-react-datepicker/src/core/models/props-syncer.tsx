import React from 'react'
import { ICalendarProps } from './model'
import { selectEvents } from './selectors'
import { useDatePickerStore } from './use-date-picker-store'

export const PropsSyncer = React.memo((props: ICalendarProps) => {
  const state = useDatePickerStore()
  const { syncProps } = selectEvents(state)

  React.useEffect(() => {
    console.log("sync props")
    console.log("props",props)
    syncProps(props)
  }, [props])

  return <></>
},(oldProps:any, newProps:any) => {
  return JSON.stringify(oldProps) === JSON.stringify(newProps); // 
})
