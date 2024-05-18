import 'regenerator-runtime/runtime'
import React from 'react'

import DefaultLayout from './containers/DefaultLayout/DefaultLayout'
import ReloadPrompt from './ReloadPrompt'
import './main.css'

function App() {
  return (
    <>
      <DefaultLayout />
      <ReloadPrompt />
    </>
  )
}

export default App
