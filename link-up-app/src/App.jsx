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
import Profile from './views/Profile/Profile.jsx';
import SearchUser from './components/SearchUser/SearchUser.jsx';
import Authenticated from './hoc/Authenticated.jsx'
import Error from './views/404/Error.jsx'
import Chat from './components/Chat/Chat.jsx'
import ChatDirectMessages from './components/ChatDirectMessages/ChatDirectMessages.jsx'


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
          {!user && <Nav />}

          {/* <ToastContainer stacked closeOnClick /> */}

          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/home' element={<Authenticated><Home /></Authenticated>} />
            <Route path='/notifications' element={<Authenticated><AllNotifications /></Authenticated>} />
            <Route path='/chat/:channelId' element={<Authenticated><ChatDirectMessages /></Authenticated>} /> 
            {/* {does not exist} */}
            {/* <Route path='/create-team' element={<Authenticated><CreateTeam /></Authenticated>} /> */}
            {/* {does not exist} */}
            {/* <Route path='/profile' element={<Authenticated><Profile /></Authenticated>} /> */}
            {/* {does not exist} */}
            {/* <Route path='/search-user' element={<Authenticated><SearchUser /></Authenticated>} /> */}
            {/* {create 404} */}
            <Route path='*' element={<Error />} />
          </Routes>
          {!user && <Footer />}
        </AppContext.Provider>
      </BrowserRouter>
    </>
  );


}

export default App
