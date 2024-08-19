import React from 'react';
import './App.css'
import { Single } from './components/single'

import { move_window, Position } from "tauri-plugin-positioner-api";
function App() {

  const x = React.useCallback(() => {
    move_window(Position.RightCenter);
  }, [])


  React.useEffect(() => { x?.() }, [x])
 
  return (
    <Single />
  )
}

export default App
