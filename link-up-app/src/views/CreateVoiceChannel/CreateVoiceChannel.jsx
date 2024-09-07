import { useState } from "react";
import PropTypes from 'prop-types';
import { createVoiceChannel } from "../../services/voice.service.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateVoiceChannelPopup({ team, onClose, onVoiceChannelCreated }) {
    const [channelName, setChannelName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (channelName.trim()) {
            try {
                await createVoiceChannel(channelName, team.owner, team.id);
                onVoiceChannelCreated(); // Notify parent component to reload voice channels
            } catch (error) {
                toast.error(`Failed to create voice channel: ${error}`);
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="bg-gray-800 p-6 rounded-lg w-1/3">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">DM message</h4>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-red-500 p-2 rounded-full"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                <h4 className="text-lg font-semibold mb-4">Search users</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="channelName" className="block text-sm font-medium text-white mb-1">
                            Channel Name
                        </label>
                        <input
                            id="channelName"
                            type="text"
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                            className="w-full p-1.5 bg-gray-700 text-white rounded-md border border-gray-600"
                            required
                        />
                    </div>
                    <div className="flex justify-center mt-4">

                        <button
                            type="submit"
                            className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 focus:ring-2 focus:ring-indigo-400 "
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

CreateVoiceChannelPopup.propTypes = {
    team: PropTypes.shape({
        id: PropTypes.string.isRequired,
        owner: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onVoiceChannelCreated: PropTypes.func.isRequired,
};
