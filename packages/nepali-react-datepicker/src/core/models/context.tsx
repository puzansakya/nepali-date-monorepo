import React from 'react'

import { createMyStore } from './store'

export const StoreContext = React.createContext<ReturnType<typeof createMyStore> | null>(null)
