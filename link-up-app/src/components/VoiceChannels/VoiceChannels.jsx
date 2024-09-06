import { useEffect, useState } from "react";
import { getVoiceChannelsInfoById, getUserVoiceChannels, createVoiceChannel } from "../../services/voice.service.js";
import CreateVoiceChannelPopup from "../../views/CreateVoiceChannel/CreateVoiceChannel.jsx";
import PropTypes from 'prop-types';


export default function VoiceChannels({ team }) {
    const [voiceChannels, setVoiceChannels] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const loadVoiceChannels = async () => {
        try {
            if (team) {
                const allVoiceChannels = await getUserVoiceChannels();
                const listVoiceChannels = await getVoiceChannelsInfoById(allVoiceChannels);
                const relevantVoiceChannels = listVoiceChannels.filter((ch) => ch.team === team.id);
                setVoiceChannels(relevantVoiceChannels);
            }
        } catch (e) {
            console.error("Error loading voice channels", e);
        }
    };

    useEffect(() => {
        loadVoiceChannels();
    }, [team]);

    const handleCreateVoiceChannelClick = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleVoiceChannelCreated = () => {
        setIsPopupOpen(false);
        loadVoiceChannels(); // Reload voice channels after creation
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Direct Messages</h3>
                <button
                    onClick={handleCreateVoiceChannelClick}
                    className="px-1 py-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-medium rounded-md shadow-sm hover:from-gray-700 hover:to-gray-800 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Create Channel
                </button>
            </div>
            <div className="space-y-2">
                {voiceChannels.length > 0 ? (
                    voiceChannels.map((channel) => (
                        <button
                            key={channel.id}
                            className="w-full p-2 text-left bg-gray-700 rounded-md hover:bg-gray-600"
                        >
                            🔊 {channel.name}
                        </button>
                    ))
                ) : (
                    <p className="text-gray-400">No direct messages available</p>
                )}
            </div>
            {isPopupOpen && (
                <CreateVoiceChannelPopup
                    team={team}
                    onClose={handleClosePopup}
                    onVoiceChannelCreated={handleVoiceChannelCreated}
                />
            )}
        </div>
    );
}

// VoiceChannels.propTypes = {
//     team: PropTypes.shape({
//         id: PropTypes.string.isRequired,
//         owner: PropTypes.string.isRequired,
//     }).isRequired,
// };