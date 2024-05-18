import 'regenerator-runtime/runtime'

import React from 'react'
import ReloadPrompt from './ReloadPrompt'

import DefaultLayout from './containers/DefaultLayout/DefaultLayout'
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
