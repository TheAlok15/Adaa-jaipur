import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import { TabsDemo } from './pages/Login'
import Adv from './pages/Adv'
import Navbar from './pages/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return(
    <div>
      <Adv/>
      <Navbar/>
        {/* <Button>Click me</Button>
        <TabsDemo></TabsDemo> */}
    </div>
  )
}

export default App
