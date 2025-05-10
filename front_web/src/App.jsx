import { useState } from 'react'
import { Route, Routes ,BrowserRouter } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/Login'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <h1 className="text-3xl font-bold underline">
    Hello world!
  </h1> */}
      <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register/>} />
      </Routes>
      </BrowserRouter>


    </>
  )
}

export default App
