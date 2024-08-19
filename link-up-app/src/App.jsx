import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Footer } from './components/Footer/Footer.jsx'
import { Nav } from './components/Nav/Nav.jsx'
import { Landing } from './views/landing/Landing.jsx'
import Register from './views/Register/Register.jsx'
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AppContext } from './state/app.context.js'
import { auth } from './config/firebase-config.js'
import Login from './views/Login/Login.jsx'


function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user, loading, error] = useAuthState(auth);

  if (appState.user !== user) {
    setAppState({ ...appState, user });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BrowserRouter>
        <AppContext.Provider value={{ ...appState, setAppState }}>
          <Nav />
          <Routes>
            <Route path='/' element={!user && < Landing />} />
            <Route path='/login' element={!user && <Login />} />
            <Route path='/register' element={!user && <Register />} />
          </Routes>

          <Footer />
        </AppContext.Provider>
      </BrowserRouter>
    </>

  )
}

export default App
