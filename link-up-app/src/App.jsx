import './App.css'
import { Footer } from './components/Footer/Footer.jsx'
import { Nav } from './components/Nav/Nav.jsx'
import { Landing } from './views/landing/Landing.jsx'
import Register from './views/Register/Register.jsx'

function App() {

  return (
    <>
      <Nav />
      <Landing />
      <Footer />
    </>

  )
}

export default App
