import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../state/app.context";
import { useLocation } from "react-router-dom";
import CreateChannel from "../../views/CreateChannel/CreateChannel";
import { addUserToChannel, getChannelByName, getChannelsInfoById, getUserChannels } from "../../services/channels.service";
import PropTypes from 'prop-types';
import { deleteChannelById } from "../../services/channels.service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Channels/Channels.css';

export default function Channels({ team, onSelectChannel }) {
    const location = useLocation();
    const { userData } = useContext(AppContext);
    const [currentTeam, setCurrentTeam] = useState(team || location.state?.team);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [channels, setChannels] = useState([]);
    const [channelUpdated, setChannelUpdated] = useState(false);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!team) {
            const savedTeam = localStorage.getItem("selectedTeam");

            if (savedTeam) {
                try {
                    setCurrentTeam(JSON.parse(savedTeam));
                } catch (error) {
                    console.error(`Failed to parse team from localStorage: ${error}`);
                }
            }
        } else {
            setCurrentTeam(team);
        }
    }, [location.state, team]);

    useEffect(() => {

        const loadChannels = async () => {
            try {
                if (userData && userData.username && currentTeam) {


                    const allChannels = await getUserChannels(userData.username);
                    const listChannels = await getChannelsInfoById(allChannels);
                    const relevantChannels = listChannels.filter((ch) => ch?.team === currentTeam.id);
                    setChannels(relevantChannels);
                }
            } catch (e) {
                toast.error(`Error loading Channels: ${e}`);
            }
        };
        loadChannels();
    }, [userData, currentTeam, channelUpdated]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChannelCreated = () => {
        setChannelUpdated((prev) => !prev);
    };

    const handleCreateChannelClick = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleChannelClick = async (channel) => {
        try {
            sessionStorage.setItem('selectedChat', JSON.stringify(channel));
            onSelectChannel(channel);
        } catch (error) {
            toast.error(`Failed to save Chat to localStorage: ${error}`);
        }
    };

    const handleDeleteChannel = async (channelId) => {
        if (window.confirm("Are you sure you want to delete this channel?")) {
            try {
                await deleteChannelById(channelId, currentTeam.id);
                setChannelUpdated((prev) => !prev);
            } catch (error) {
                toast.error(`Failed to delete channel: ${error}`);
            }
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        console.log(query);

        try {
            const channelFromDb = await getChannelByName(query);

            const filtered = channelFromDb.filter(ch => ch.team === currentTeam.id);

            console.log(filtered);

            setSearchResults(filtered);
            setIsDropdownOpen(true);
            setQuery('');


        } catch (error) {
            toast.error('Search failed:', error);
        }
    };
    const handleResultClick = (result) => {
        console.log('Selected result:', result);
        setIsDropdownOpen(false);
    };


    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsDropdownOpen(false);
        }
    };

    const handleJoinChannel = async (ch) => {
        console.log('joined', ch.name);
        await addUserToChannel(ch.id, userData.username);
        handleChannelCreated()
        setIsDropdownOpen(false);

    };

    return (
        <div className="channels relative">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Channels</h3>
                {/* {userData?.username === currentTeam?.owner && ( */}
                <button
                    onClick={handleCreateChannelClick}
                    className="px-1 py-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-medium rounded-md shadow-sm hover:from-gray-700 hover:to-gray-800 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    +
                </button>
                {/* )} */}
            </div>
            <form onSubmit={handleSearch} >
                <input
                    type="text"
                    placeholder="Search #Channels..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    name="query"
                    className="mb-3 flex justify-between items-center w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-gray-200 text-sm"
                />
            </form>
            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute z-10 bg-gray-700  rounded-md shadow-md p-1 max-h-48 overflow-y-auto transition-all duration-200 ease-in-out w-full" // Adjust positioning here
                    style={{ left: '0' }}
                >
                    <div className=" flex flex-col space-y-1">
                        {searchResults.map((ch) => (
                            <div
                                key={ch.id}
                                className="flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                            >
                                <div className="flex justify-between items-center w-full">                                        <span className=" text-white font-medium text-base">{ch.name}</span>
                                    <button className="text-white hover:text-green-300 ml-6"
                                        onClick={() => handleJoinChannel(ch)} >
                                        Join
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="space-y-2">
            <div className="channelsList rounded-lg max-h-60 overflow-y-auto">
                {channels.length > 0 ? (
                    channels.map((ch) => (
                        <div key={ch.id} className="flex justify-between items-center w-full p-2 rounded-md hover:bg-gray-600">
                            <button
                                onClick={() => handleChannelClick(ch)}
                                className="text-left">
                                # {ch.name.toLowerCase()}
                            </button>
                            {userData?.username === currentTeam?.owner && (
                                <button
                                    onClick={() => handleDeleteChannel(ch.id)}
                                    className="text-white hover:text-red-500 p-2 rounded-full"
                                    aria-label="Close"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No text channels available</p>
                )}
                </div>
            </div>
            {isPopupOpen && (
                <CreateChannel
                    team={currentTeam}
                    onClose={handleClosePopup}
                    onChannelCreated={handleChannelCreated}
                />
            )}
        </div>
    );
}

Channels.propTypes = {
    team: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string,
        createdOn: PropTypes.string,
        id: PropTypes.string,
        members: PropTypes.arrayOf(PropTypes.string),
    }),
    onSelectChannel: PropTypes.func.isRequired,
};
