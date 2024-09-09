import { useEffect, useState, useContext, useRef } from "react";
import { getDirectMessagesInfoById, getUserDirectMessages, deleteDirectMessageById } from "../../services/direct-messages.service.js";
import CreateDirectMessages from "../../views/CreateDirectMessages/CreateDirectMessages.jsx";
import PropTypes from 'prop-types';
import { AppContext } from "../../state/app.context.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DirectMessages({ onSelectDirectMessage }) {
    const { userData } = useContext(AppContext);
    const [directMessages, setDirectMessages] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [directMessageUpdated, setDirectMessageUpdated] = useState(false);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const loadDirectMessages = async () => {
            try {
                if (userData && userData.username) {
                    const allDirectMessages = await getUserDirectMessages(userData.username);
                    const listDirectMessages = await getDirectMessagesInfoById(allDirectMessages);
                    setDirectMessages(listDirectMessages);
                }
            } catch (e) {
                toast.error(`Error loading Direct Messages: ${e}`);
            }
        };
        loadDirectMessages();
    }, [userData, directMessageUpdated]);

    const handleDirectMessageCreated = () => {
        setDirectMessageUpdated((prev) => !prev);
    };

    const handleCreateDirectMessageClick = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleDirectMessageClick = async (dm) => {
        try {
            sessionStorage.setItem('selectedDirectMessage', JSON.stringify(dm));
            onSelectDirectMessage(dm);
        } catch (error) {
            toast.error(`Failed to save Direct Message to sessionStorage: ${error}`);
        }
    };

    const handleDeleteDirectMessage = async (directMessageId) => {
        if (window.confirm("Are you sure you want to delete this direct message?")) {
            try {
                await deleteDirectMessageById(directMessageId);
                setDirectMessageUpdated((prev) => !prev);
            } catch (error) {
                toast.error(`Failed to delete direct message: ${error}`);
            }
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const filtered = directMessages.filter(dm => 
                dm.participants.some(p => p.includes(query))
            );

            setSearchResults(filtered);
            setIsDropdownOpen(true);
            setQuery('');

        } catch (error) {
            toast.error('Search failed:', error);
        }
    };

    const handleResultClick = (result) => {
        setIsDropdownOpen(false);
        handleDirectMessageClick(result);
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="direct-messages relative">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Direct Messages</h3>
                <button
                    onClick={handleCreateDirectMessageClick}
                    className="px-1 py-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-medium rounded-md shadow-sm hover:from-gray-700 hover:to-gray-800 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    +
                </button>
            </div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search Direct Messages..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    name="query"
                    className="mb-3 flex justify-between items-center w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-gray-200 text-sm"
                />
            </form>
            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute z-10 bg-gray-700  rounded-md shadow-md p-1 max-h-48 overflow-y-auto transition-all duration-200 ease-in-out w-full"
                    style={{ left: '0' }}
                >
                    <div className=" flex flex-col space-y-1">
                        {searchResults.map((dm) => (
                            <div
                                key={dm.id}
                                className="flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                            >
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-white font-medium text-base">
                                        {dm.participants.join(", ")}
                                    </span>
                                    <button className="text-white hover:text-green-300 ml-6"
                                        onClick={() => handleResultClick(dm)}
                                    >
                                        Open
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="space-y-2">
                {directMessages.length > 0 ? (
                    directMessages.map((dm) => (
                        <div key={dm.id} className="flex justify-between items-center w-full p-2 rounded-md hover:bg-gray-600">
                            <button
                                onClick={() => handleDirectMessageClick(dm)}
                                className="text-left">
                                {dm.participants.join(", ")}
                            </button>
                            <button
                                onClick={() => handleDeleteDirectMessage(dm.id)}
                                className="text-xs text-red-500 hover:text-red-700 font-medium transition duration-200 ease-in-out"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No direct messages available</p>
                )}
            </div>
            {isPopupOpen && (
                <CreateDirectMessages
                    onClose={handleClosePopup}
                    onDirectMessageCreated={handleDirectMessageCreated}
                />
            )}
        </div>
    );
}

DirectMessages.propTypes = {
    onSelectDirectMessage: PropTypes.func.isRequired,
};