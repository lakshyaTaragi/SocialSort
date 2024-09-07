import React, { useState, useEffect, ReactElement } from 'react'
import axios from 'axios'
import './App.css'

const App = (): ReactElement => {

  const [data, setData] = useState<string>("")
  useEffect(() => {
    axios.get("http://localhost:8000/hi")
      .then(res => setData(res.data.message))
      .catch(err => console.log(err))
  }, [])

  return (
    <>
      <p>Hi</p>
      ...{data}...
    </>
  )
}

export default App
