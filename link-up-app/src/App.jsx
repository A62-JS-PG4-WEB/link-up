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
import AllNotifications from './views/AllNotifications/AllNotifications.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './views/Profile/Profile.jsx';
import SearchUser from './components/SearchUser/SearchUser.jsx';
import Authenticated from './hoc/Authenticated.jsx'
import Error from './views/404/Error.jsx'
import About from './views/About/About.jsx'
import Contact from './views/Contact/Contact.jsx'
import Careers from './views/Careers/Careers.jsx'


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
        toast.error(`Error fetching user data: ${error}`);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return <div className="loading-container">
      <span className="loading loading-dots loading-lg"></span>
    </div>
      ;
  }

  return (
    <>
      <BrowserRouter>
        <AppContext.Provider value={{ ...appState, setAppState, invitations, setInvitations }}>

          <ToastContainer stacked closeOnClick />

          {!user && <Nav />}


          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/careers' element={<Careers />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/home' element={<Authenticated><Home /></Authenticated>} />
            <Route path='/notifications' element={<Authenticated><AllNotifications /></Authenticated>} />
            <Route path='*' element={<Error />} />
          </Routes>
          {!user && <Footer />}
        </AppContext.Provider>
      </BrowserRouter>
    </>
  );


}

export default App
