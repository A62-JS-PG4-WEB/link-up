import { useEffect, useState, useContext } from "react";
import { getDirectMessagesInfoById, getUserDirectMessages, deleteDirectMessageById } from "../../services/direct-messages.service.js";
import CreateDirectMessages from "../../views/CreateDirectMessages/CreateDirectMessages.jsx";
import PropTypes from 'prop-types';
import { useLocation } from "react-router-dom";
import { AppContext } from "../../state/app.context.js";

export default function DirectMessages({ team, onSelectDirectMessage }) {
    const { userData } = useContext(AppContext);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [directMessages, setDirectMessages] = useState([]);
    const [dmUpdated, setDmUpdated] = useState(false);

    useEffect(() => {
        const loadDirectMessages = async () => {
            try {
                if (userData && userData.username && team) {
                    const allDirectMessages = await getUserDirectMessages(userData.username);
                    const listDirectMessages = await getDirectMessagesInfoById(allDirectMessages);
                    const relevantDirectMessages = listDirectMessages.filter((dm) => dm?.team === team.id);
                    setDirectMessages(relevantDirectMessages);
                }
            } catch (e) {
                console.error("Error loading direct messages", e);
            }
        };
        loadDirectMessages();
    }, [userData, team, dmUpdated]);

    const handleDirectMessageCreated = () => {
        setDmUpdated((prev) => !prev);
    };

    const handleCreateDirectMessageClick = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleDirectMessageClick = (directMessage) => {
        onSelectDirectMessage(directMessage);
    };

    const handleDeleteDirectMessage = async (directMessageId) => {
        if (window.confirm("Are you sure you want to delete this direct message?")) {
            try {
                await deleteDirectMessageById(directMessageId, team.id);
                setDmUpdated((prev) => !prev);
            } catch (error) {
                console.error("Failed to delete direct message", error);
            }
        }
    };

    return (
        <div className="direct-messages">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Direct Messages</h3>
                <button
                    onClick={handleCreateDirectMessageClick}
                    className="px-1 py-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-medium rounded-md shadow-sm hover:from-gray-700 hover:to-gray-800 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Create Direct Message
                </button>
            </div>
            <div className="space-y-2">
                {directMessages.length > 0 ? (
                    directMessages.map((dm) => (
                        <div
                            key={dm.id}
                            className="flex justify-between items-center w-full p-2 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer"
                            onClick={() => handleDirectMessageClick(dm)}
                        >
                            <div className="flex items-center">
                                <span className="text-lg font-medium text-white">#{dm.participants.join(', ')}</span>
                            </div>
                            {userData?.username === team?.owner && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteDirectMessage(dm.id);
                                    }}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium transition duration-200 ease-in-out"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No direct messages available</p>
                )}
            </div>
            {isPopupOpen && (
                <CreateDirectMessages
                    team={team}
                    onClose={handleClosePopup}
                    onDirectMessageCreated={handleDirectMessageCreated}
                />
            )}
        </div>
    );
}

DirectMessages.propTypes = {
    team: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string,
        createdOn: PropTypes.string,
        id: PropTypes.string.isRequired,
        members: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    onSelectDirectMessage: PropTypes.func.isRequired,
};