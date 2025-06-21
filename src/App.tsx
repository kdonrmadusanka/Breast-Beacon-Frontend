import { useState } from 'react'
import AppRouter from './assets/routes/index';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <AppRouter />
    </div>
  )
}

export default App
