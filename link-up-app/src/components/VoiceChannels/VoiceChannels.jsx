import { useEffect, useState } from "react";
import { getVoiceChannelsInfoById, getUserVoiceChannels, createVoiceChannel } from "../../services/voice.service.js";
import CreateVoiceChannelPopup from "../../views/CreateVoiceChannel/CreateVoiceChannel.jsx";
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchUser from "../SearchUser/SearchUser.jsx";

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
            toast.error(`Error loading voice channels: ${e}`);
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
             
            </div>
            <div className="flex flex-col p-4 text-white hover:bg-gray-700">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                </svg>
                            </div>

                                <div className="ml-4 flex-grow">
                                    <SearchUser />
                                </div>   
                        </div>
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


VoiceChannels.propTypes = {
    team: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string,
        id: PropTypes.string,
        createdOn: PropTypes.string,
        members: PropTypes.arrayOf(PropTypes.string),
    }),
};
