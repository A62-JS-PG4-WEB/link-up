import { useContext, useState, useEffect } from "react";
import Teams from "../../views/Teams/Teams";
import { logoutUser } from "../../services/auth.service";
import { AppContext } from "../../state/app.context";
import { useNavigate, useLocation } from "react-router-dom";
import Profile from "../../views/Profile/Profile";
import Invitations from "../../views/Invitations/Invitations";
import SearchUser from "../SearchUser/SearchUser";


export default function SideNav() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [justOpenedSidebar, setJustOpenedSidebar] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const { user, setAppState, userData, invitations } = useContext(AppContext);
    const [isProfilePage, setIsProfilePage] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const logout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        localStorage.clear();
        sessionStorage.clear();

        if (confirmLogout) {
            try {
                await logoutUser();
                setAppState({ user: null, userData: null });
                navigate('navigate('/')');
            } catch (error) {
                console.error("Logout failed", error);
            }
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

    const handleProfileClick = () => {
        setIsProfileModalOpen(true);
    };

    useEffect(() => {
        setIsProfilePage(location.pathname === '/profile');
    }, [location.pathname]);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log('Search criteria:', searchCriteria, 'Search query:', searchQuery);
        }
    };

    return (
        <div className="flex h-screen sidenav">
            <div
                className={`${isSidebarOpen ? 'w-64' : 'w-14'} bg-gray-800 h-full flex flex-col transition-all duration-300 ease-in-out`}
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

                <nav className="flex flex-col mt-4 space-y-4 rounded-lg flex-grow">
                    {/* Teams Section */}
                    <a
                        href="#"
                        className="flex items-center p-4 text-white hover:bg-gray-700 rounded-lg"
                        onClick={handleNavClick}
                    >
                        {isSidebarOpen ? (
                            <Teams />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                            </svg>
                        )}
                    </a>



                    {/* Notifications */}
                    <a
                        href="#"
                        className="flex items-center p-4 text-white hover:bg-gray-700 rounded-lg"
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
                    </a>
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



                </nav>

                {/* Profile and Logout */}
                <hr className="border-gray-600 w-1/2 mx-auto pb-4" />
                <div className="mt-auto flex items-center pl-2 pb-6 bg-gray-800 h-20">
                    <div className={`avatar ${user?.status === 'online' ? 'online' : 'offline'} mr-3`}>
                        <div
                            className="w-10 rounded-full cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
                            onClick={handleProfileClick}
                        >
                            <img
                                src={user?.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
                                alt="User"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                    </div>
                    {isSidebarOpen && (
                        <div className="text-white">
                            <div className="font-bold">{userData?.username}</div>
                            <div className="text-sm ml-auto">{userData?.email}</div>
                            <button onClick={logout} className="flex items-center text-white hover:text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right mr-2" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isProfileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
                    <div className="bg-gray-800 text-white p-6 rounded-lg flex flex-col w-full max-w-3xl h-[600px] relative mx-auto my-10">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold text-white">
                                Change Profile Information
                            </h1>
                            <button
                                className="text-white hover:text-red-800 text-4xl focus:outline-none"
                                onClick={() => setIsProfileModalOpen(false)}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <Profile />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}