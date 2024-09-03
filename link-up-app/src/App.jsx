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
import Home from './views/Home/Home.jsx'
import CreateTeam from './views/CreateTeam/CreateTeam.jsx'
import SideNav from './components/SideNav/SideNav.jsx'
import Test from './Test.jsx'
import AllNotifications from './views/AllNotifications/AllNotifications.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './views/Profile/Profile.jsx'



function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user, loading] = useAuthState(auth);
  const [invitations, setInvitations] = useState([]);

  
  useEffect(() => {
    if (user) {
      setAppState(prevState => ({ ...prevState, user }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const data = await getUserData(user.uid);
        const userData = data[Object.keys(data)[0]];

        setAppState(prevState => ({ ...prevState, userData }));
      } catch (error) {
        toast.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BrowserRouter>
        <AppContext.Provider value={{ ...appState, setAppState, invitations, setInvitations }}>
          {!user ? <Nav /> : <SideNav/>}

        {/* <ToastContainer stacked closeOnClick /> */}

          <Routes>
            <Route path='/' element={!user && <Landing />} />
            <Route path='/login' element={!user && <Login />} />
            <Route path='/register' element={!user && <Register />} />
            <Route path='/home' element={user && <Home />} />
            <Route path='/test' element={user && <Test />} />
            <Route path='/notifications' element={user && <AllNotifications />} />
            <Route path='/create-team' element={user && <CreateTeam />} />
            <Route path='/profile' element={user && <Profile />} />
          </Routes>
          {!user && <Footer />}
        </AppContext.Provider>
      </BrowserRouter>
    </>
  );


}

export default App
