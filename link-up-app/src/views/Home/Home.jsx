import React, { useState } from 'react';

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [justOpenedSidebar, setJustOpenedSidebar] = useState(false);

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

    return (
        <div className="flex h-screen">
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
                <nav className="flex flex-col mt-4 space-y-4">
                    <a
                        href="#"
                        className="flex items-center p-4 text-white hover:bg-gray-700"
                        onClick={handleNavClick}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-inbox" viewBox="0 0 16 16">
                            <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z" />
                        </svg>
                        {isSidebarOpen && <span className="ml-4">Inbox</span>}
                    </a>
                    <a
                        href="#"
                        className="flex items-center p-4 text-white hover:bg-gray-700"
                        onClick={handleNavClick}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                            <path d="M8 16a2 2 0 0 0 1.985-1.75h-3.97A2 2 0 0 0 8 16zm.104-14.247a.5.5 0 0 1 .633.057A5.022 5.022 0 0 1 13 6c0 .628.134 1.197.359 1.75.228.561.539 1.098.875 1.591.18.27.366.545.535.841.172.301.327.623.45.987.124.366.18.768.18 1.248H0c0-.48.056-.882.18-1.248.123-.364.278-.686.45-.987.169-.296.355-.571.535-.84.336-.494.647-1.03.875-1.592A5.978 5.978 0 0 0 3 6c0-1.512.572-2.904 1.614-3.966a.5.5 0 0 1 .633-.057c.682.483 1.55.773 2.527.773s1.845-.29 2.527-.773z" />
                        </svg>
                        {isSidebarOpen && <span className="ml-4">Notifications</span>}
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
                        href="#"
                        className="flex items-center p-4 text-white hover:bg-gray-700"
                        onClick={handleNavClick}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 3.5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 15 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5z" />
                            <path fillRule="evenodd" d="M4.854 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .707.707L6.207 7.5H13.5a.5.5 0 0 1 0 1H6.207l2.354 2.354a.5.5 0 1 1-.707.707l-3-3z" />
                        </svg>
                        {isSidebarOpen && <span className="ml-4">Logout</span>}
                    </a>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 p-8 bg-gray-900 text-white space-x-6">
                {/* Channels Section */}
                <div className="w-1/4 space-y-6">
                    {/* Text Channels */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Text Channels</h3>
                        <div className="space-y-2">
                            <button className="w-full p-2 text-left bg-gray-700 rounded-md hover:bg-gray-600"># general</button>
                            <button className="w-full p-2 text-left bg-gray-700 rounded-md hover:bg-gray-600"># memes</button>
                            <button className="w-full p-2 text-left bg-gray-700 rounded-md hover:bg-gray-600"># announcements</button>
                        </div>
                    </div>

                    {/* Voice Channels */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Voice Channels</h3>
                        <div className="space-y-2">
                            <button className="w-full p-2 text-left bg-gray-700 rounded-md hover:bg-gray-600">🔊 General</button>
                            <button className="w-full p-2 text-left bg-gray-700 rounded-md hover:bg-gray-600">🔊 Gaming</button>
                            <button className="w-full p-2 text-left bg-gray-700 rounded-md hover:bg-gray-600">🔊 Music</button>
                        </div>
                    </div>
                </div>

                {/* Chat Section */}
                <div className="flex-1 bg-gray-800 p-6 rounded-lg flex flex-col">
                    {/* Chat Team Name */}
                    <h1 className="text-2xl font-bold mb-4">Chat Team Name</h1>

                    {/* Messages Container */}
                    <div className="flex-1 bg-gray-700 p-4 rounded-lg overflow-y-auto flex flex-col-reverse">
                        {/* Chat messages will go here */}
                        <p className="text-gray-300">This is where the chat messages will be displayed.</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
