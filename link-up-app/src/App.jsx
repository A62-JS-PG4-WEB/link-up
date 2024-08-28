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
import Teams from './views/CreateTeam/CreateTeam.jsx'
import { getUserData } from './services/users.service.js'
import Profile from './views/Profile/Profile.jsx';
import Settings from './views/Settings/Settings.jsx';



function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const data = await getUserData(user.uid);
          const userData = data[Object.keys(data)[0]];
          setAppState(prevState => ({ ...prevState, user, userData }));
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    } else {
      setAppState(prevState => ({ ...prevState, user: null, userData: null }));
    }
  }, [user]);


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
            <Route path='/create-team' element={user && <Teams />} />
            <Route path="/profile" element={user ? <Profile /> : <Login />} />
            <Route path="/settings" element={user ? <Settings /> : <Login />} />
          </Routes>

          <Footer />
        </AppContext.Provider>
      </BrowserRouter>
    </>

  )
}

export default App
