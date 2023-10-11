import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const title = 'React';

  return (
    <>
      <div>
        <h1>Hello {title}</h1>

        <label htmlFor='search'>Search:</label>
        <input id='search' type='text'/>
      </div>
    </>
  )
}

export default App
