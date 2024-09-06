import { useContext, useState } from "react";
import Teams from "../../views/Teams/Teams";
import { logoutUser } from "../../services/auth.service";
import { AppContext } from "../../state/app.context";
<<<<<<< HEAD
import { useNavigate, useLocation } from "react-router-dom";
import Profile from "../../views/Profile/Profile";
import Invitations from "../../views/Invitations/Invitations";
import SearchUser from "../SearchUser/SearchUser";

=======
import { useNavigate } from "react-router-dom";
import Invitations from "../../views/Invitations/Invitations";
>>>>>>> parent of b1fb26e (Merge branch 'sideNavNew' into master)

export default function SideNav() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [justOpenedSidebar, setJustOpenedSidebar] = useState(false);
<<<<<<< HEAD
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); 
    const { user, setAppState, userData, invitations } = useContext(AppContext);
    const [isProfilePage, setIsProfilePage] = useState(false);
=======
    const { user, setAppState, invitations } = useContext(AppContext);
>>>>>>> parent of b1fb26e (Merge branch 'sideNavNew' into master)
    const navigate = useNavigate();

    const logout = async () => {
<<<<<<< HEAD
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            try {
                await logoutUser(); 
                setAppState({ user: null, userData: null });
                navigate('/login'); 
            } catch (error) {
                console.error("Logout failed", error); 
            }
=======
        try {
            localStorage.clear();
            sessionStorage.clear();

            await logoutUser();
            setAppState({ user: null, userData: null });
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
>>>>>>> parent of b1fb26e (Merge branch 'sideNavNew' into master)
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        setJustOpenedSidebar(false);
    };

    const handleNavClick = () => {
        if (!isSidebarOpen) {
            setIsSidebarOpen(true);
            setJustOpenedSidebar(true);
        } else if (justOpenedSidebar) {
            setJustOpenedSidebar(false);
        }
    };
    console.log(invitations);

<<<<<<< HEAD
    const handleProfileClick = () => {
        setIsProfileModalOpen(true); 
    };

    useEffect(() => {
        setIsProfilePage(location.pathname === '/profile');
    }, [location.pathname]);
=======
>>>>>>> parent of b1fb26e (Merge branch 'sideNavNew' into master)

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log('Search criteria:', searchCriteria, 'Search query:', searchQuery);
        }
    };

    return (
        <div className="flex h-screen nav">
            <div
                className={`${isSidebarOpen ? 'w-64' : 'w-16'
                    } bg-gray-800 h-full transition-all duration-300 ease-in-out`}
            >
                <div className="flex items-center justify-between p-4 bg-gray-900">
                    <h1 className={`${isSidebarOpen ? 'text-lg' : 'hidden'} text-white font-bold`}>
                        LinkUp
                    </h1>
                    <button
                        onClick={toggleSidebar}
                        className="text-white focus:outline-none"
                    >
                        {isSidebarOpen ? '←' : '→'}
                    </button>
                </div>

                <nav className="flex flex-col mt-4 space-y-4 rounded-lg">
                    <a
                        href="#"
                        className="flex items-center p-4 text-white"
                        onClick={handleNavClick}
                    >
                        {isSidebarOpen ? (<Teams />) :(<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                            <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                        </svg>) }
                    </a>
<<<<<<< HEAD
                
                    {/* Search */}
                    <div className="flex flex-col p-4 text-white hover:bg-gray-700">
    <div className="flex items-center">
        <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
        </div>

        {isSidebarOpen && (
            <div className="ml-4 flex-grow">
                <SearchUser />
            </div>
        )}
    </div>
</div>

                    {/* Notifications */}
=======
>>>>>>> parent of b1fb26e (Merge branch 'sideNavNew' into master)
                    <a
                        href="#"
                        className="flex items-center p-4 text-white hover:bg-gray-700"
                        onClick={handleNavClick}
                    >

                        <div className="relative inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                className={`bi bi-bell  ${invitations?.length > 0 ? 'text-red-500' : 'text-white'}`} viewBox="0 0 16 16">
                                <path d="M8 16a2 2 0 0 0 1.985-1.75h-3.97A2 2 0 0 0 8 16zm.104-14.247a.5.5 0 0 1 .633.057A5.022 5.022 0 0 1 13 6c0 .628.134 1.197.359 1.75.228.561.539 1.098.875 1.591.18.27.366.545.535.841.172.301.327.623.45.987.124.366.18.768.18 1.248H0c0-.48.056-.882.18-1.248.123-.364.278-.686.45-.987.169-.296.355-.571.535-.84.336-.494.647-1.03.875-1.592A5.978 5.978 0 0 0 3 6c0-1.512.572-2.904 1.614-3.966a.5.5 0 0 1 .633-.057c.682.483 1.55.773 2.527.773s1.845-.29 2.527-.773z" />
                            </svg>
                            {invitations?.length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2">
                                    {invitations.length}
                                </span>
                            )}
                        </div>

                        {isSidebarOpen && <Invitations />}
<<<<<<< HEAD
                    </a>
                </nav>

                {/* Profile and Logout */}
                <div className="mt-auto flex items-center p-4 bg-gray-900">
                    <div className={`avatar ${user?.status === 'online' ? 'online' : 'offline'} mr-4`}>
                        <div className="w-12 rounded-full cursor-pointer" onClick={handleProfileClick}>
                            <img src={user?.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} alt="User" />
                        </div>
                    </div>
                    {isSidebarOpen && (
                        <div className="text-white">
                            <div className="font-bold">{userData?.username}</div>
                            <div className="text-sm">{userData?.email}</div>
                        </div>
                    )}
                    <button onClick={logout} className="ml-auto text-white hover:text-gray-400">
                        Logout
                    </button>
                </div>
            </div>

            {isProfileModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
        <div className="bg-gray-800 text-white p-6 rounded-lg flex flex-col w-full max-w-3xl h-[600px] relative mx-auto my-10">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-white">
                    Profile Information
                </h1>
                <button
                    className="text-red-600 hover:text-red-800 text-4xl focus:outline-none"
                    onClick={() => setIsProfileModalOpen(false)}
                >
                    &times;
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                <Profile /> 
=======
                    </a>
                    <a
                        href="#"
                        className="flex items-center p-4 text-white hover:bg-gray-700"
                        onClick={handleNavClick}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                        </svg>
                        {isSidebarOpen && <span className="ml-4">Profile</span>}
                    </a>
                    <a
                        href="#"
                        className="flex items-center p-4 text-white hover:bg-gray-700"
                        onClick={handleNavClick}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z" />
                        </svg>
                        {isSidebarOpen && <span className="ml-4">Settings</span>}
                    </a>
                    <a
                        href="/login"
                        className="flex items-center p-4 text-white hover:bg-gray-700"
                        onClick={handleNavClick}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 3.5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 15 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5z" />
                            <path fillRule="evenodd" d="M4.854 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .707.707L6.207 7.5H13.5a.5.5 0 0 1 0 1H6.207l2.354 2.354a.5.5 0 1 1-.707.707l-3-3z" />
                        </svg>
                        {isSidebarOpen && <span className="ml-4" onClick={logout}>Logout</span>}

                    </a>
                </nav>
>>>>>>> parent of b1fb26e (Merge branch 'sideNavNew' into master)
            </div>
        </div>
    )
}