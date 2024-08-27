import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../state/app.context";
import { getTeamsInfoById, getUserTeams } from "../../services/teams.service";
import CreateTeam from "../../views/CreateTeam/CreateTeam";
import AllTeams from "../../views/AllTeams/AllTeams";
import { useLocation, useNavigate } from "react-router-dom";
import CreateChannel from "../../views/CreateChannel/CreateChannel";
import { getChannelsInfoById, getUserChannels } from "../../services/channels.service";
import PropTypes from 'prop-types';
import { deleteChannelById } from "../../services/channels.service"; // Import the delete function

export default function Channels({ team }) {
    const { userData } = useContext(AppContext);
    const [currentTeam, setCurrentTeam] = useState(team);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [channels, setChannels] = useState([]);
    const [channelUpdated, setChannelUpdated] = useState(false);

    useEffect(() => {
        if (!team) {
            const savedTeam = localStorage.getItem("selectedTeam");
            if (savedTeam) {
                try {
                    setCurrentTeam(JSON.parse(savedTeam));
                } catch (error) {
                    console.error("Failed to parse team from localStorage", error);
                }
            }
        } else {
            setCurrentTeam(team);
        }
    }, [team]);

    useEffect(() => {
        const loadChannels = async () => {
            try {
                if (userData && userData.username && currentTeam) {
                    const allChannels = await getUserChannels(userData.username);
                    const listChannels = await getChannelsInfoById(allChannels);
                    const relevantChannels = listChannels.filter((ch) => ch.team === currentTeam.id);
                    setChannels(relevantChannels);
                }
            } catch (e) {
                console.error("Error loading Channels", e);
            }
        };
        loadChannels();
    }, [userData, currentTeam, channelUpdated]);

    const handleChannelCreated = () => {
        setChannelUpdated((prev) => !prev);
    };

    const handleCreateChannelClick = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleDeleteChannel = async (channelId) => {
        if (window.confirm("Are you sure you want to delete this channel?")) {
            try {
                await deleteChannelById(channelId);
                setChannelUpdated((prev) => !prev);
            } catch (error) {
                console.error("Failed to delete channel", error);
            }
        }
    };

    return (
        <div className="channels">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Text Channels</h3>
                {userData?.username === currentTeam?.owner && (
                    <button
                        onClick={handleCreateChannelClick}
                        className="px-2 py-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-medium rounded-md shadow-sm hover:from-gray-700 hover:to-gray-800 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Create Channel
                    </button>

                )}
            </div>
            <div className="space-y-2">
                {channels.length > 0 &&
                    channels.map((ch) => (
                        <div key={ch.id} className="flex justify-between items-center w-full p-2 bg-gray-700 rounded-md hover:bg-gray-600">
                            <span className="text-left"># {ch.name}</span>
                            {userData?.username === currentTeam?.owner && (
                                <button
                                    onClick={() => handleDeleteChannel(ch.id)}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium transition duration-200 ease-in-out"
                                >
                                    Delete
                                </button>

                            )}
                        </div>
                    ))}
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
};