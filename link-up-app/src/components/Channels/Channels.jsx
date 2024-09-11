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

/**
 * Renders the list of channels for a given team, allows searching, joining, creating, and deleting channels.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.team - The current team object.
 * @param {string} props.team.name - The name of the team.
 * @param {string} props.team.owner - The owner of the team.
 * @param {string} props.team.createdOn - The date the team was created.
 * @param {string} props.team.id - The ID of the team.
 * @param {Array<string>} props.team.members - The members of the team.
 * @param {Function} props.onSelectChannel - Function to handle selecting a channel.
 * @returns {JSX.Element} The rendered component.
 */
export default function Channels({ team, onSelectChannel }) {
    const location = useLocation();
    const { userData } = useContext(AppContext);
    const [currentTeam, setCurrentTeam] = useState(team || location.state?.team);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [channels, setChannels] = useState([]);
    const [channelUpdated, setChannelUpdated] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [activeChannelId, setActiveChannelId] = useState('');

    /**
    * Loads the current team from local storage if no team is provided via props.
    */
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

    /**
   * Loads channels for the current user and team, filtering based on the selected team.
   * Updates the channel list whenever the team or `channelUpdated` state changes.
   */
    useEffect(() => {
        let isMounted = true;

        const loadChannels = async () => {
            try {
                if (userData && userData.username && currentTeam) {
                    const allChannels = await getUserChannels(userData.username);
                    const listChannels = await getChannelsInfoById(allChannels);
                    const relevantChannels = listChannels.filter((ch) => ch?.team === currentTeam.id);

                    if (isMounted) {
                        setChannels(relevantChannels);
                    }
                }
            } catch (e) {
                if (isMounted) {
                    toast.error(`Error loading Channels: ${e}`);
                }
            }
        };

        loadChannels();

        return () => {
            isMounted = false;
        };
    }, [userData, currentTeam, channelUpdated]);

    /**
   * Adds an event listener to detect clicks outside the dropdown and close it.
   */
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    /**
  * Toggles the `channelUpdated` state when a new channel is created to trigger a re-fetch of channels.
  */
    const handleChannelCreated = () => {
        setChannelUpdated((prev) => !prev);
    };

    /**
    * Opens the create channel popup.
    */
    const handleCreateChannelClick = () => {
        setIsPopupOpen(true);
    };

    /**
    * Closes the create channel popup.
    */
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    /**
     * Handles selecting a channel, saving the selected channel to session storage,
     * updating the UI to mark the channel as active, and notifying the parent component.
     *
     * @param {Object} channel - The selected channel object.
     * @param {string} channel.id - The ID of the channel.
     * @param {string} channel.name - The name of the channel.
     */
    const handleChannelClick = async (channel) => {
        try {
            sessionStorage.setItem('selectedChat', JSON.stringify(channel));
            setActiveChannelId(channel.id);
            setChannels((prevChannels) =>
                prevChannels.map((ch) =>
                    ch.id === channel.id ? { ...ch, hasNewMessages: false } : ch
                )
            );

            onSelectChannel(channel);
        } catch (error) {
            toast.error(`Failed to save Chat to session storage: ${error}`);
        }
    };

    /**
    * Deletes a channel after user confirmation, updates the channels list after deletion.
    *
    * @param {string} channelId - The ID of the channel to delete.
    */
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

    /**
    * Searches for a channel by name based on the user's input.
    *
    * @param {Object} e - The form submit event.
    */
    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const channelFromDb = await getChannelByName(search, currentTeam.id);
            setSearchResults(channelFromDb);
            setIsDropdownOpen(true);
            setSearch('');


        } catch (error) {
            toast.error('Search failed:', error);
        }
    };

    /**
    * Handles detecting clicks outside the search dropdown and closes it.
    *
    * @param {Object} e - The event object.
    */
    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsDropdownOpen(false);
        }
    };

    /**
     * Adds the user to a selected channel and updates the channel list.
     *
     * @param {Object} ch - The selected channel object.
     */
    const handleJoinChannel = async (ch) => {
        await addUserToChannel(ch.id, userData.username);
        handleChannelCreated()
        setIsDropdownOpen(false);

    };

    return (
        <div className="channels relative">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Channels</h3>
                <button
                    onClick={handleCreateChannelClick}
                    className="px-1 py-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-medium rounded-md shadow-sm hover:from-gray-700 hover:to-gray-800 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    +
                </button>
            </div>
            <form onSubmit={handleSearch} >
                <input
                    type="text"
                    placeholder="Search #Channels..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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
                            <div key={ch.id}
                                className={`flex justify-between items-center w-full p-2 rounded-md ${activeChannelId === ch.id ? "bg-gray-600" : "hover:bg-gray-600"
                                    }`}
                            >
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
