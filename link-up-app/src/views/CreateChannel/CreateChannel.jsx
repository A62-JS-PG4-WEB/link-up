import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../state/app.context";
import { MAX_CHANNEL_NAME_LENGTH, MIN_CHANNEL_NAME_LENGTH } from "../../common/constants";
import { addUserChannel } from "../../services/users.service";
import { createChannel } from "../../services/channels.service";
import { addChannelToTeam } from "../../services/teams.service";
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * CreateChannel component allows users to create a new channel within a team.
 *
 * @component
 * @param {Object} team - The selected team object.
 * @param {function} onClose - Function to close the channel creation modal.
 * @param {function} onChannelCreated - Function to call after a channel is created successfully.
 * @returns {JSX.Element} The rendered CreateChannel component.
 */
export default function CreateChannel({ team, onClose, onChannelCreated }) {
    const [channel, setChannel] = useState({ name: '' });
    const { userData } = useContext(AppContext);

    /**
     * Handles the click outside the popup to close the modal.
     * 
     * @function useEffect
     */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.classList.contains('popup-overlay')) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, userData]);

    /**
     * Updates the channel object when the input value changes.
     *
     * @function updateChannel
     * @param {string} key - The key of the channel object to update.
     * @param {string} value - The new value for the specified key.
     */
    const updateChannel = (key, value) => {
        if (channel[key] !== value) {
            setChannel({
                ...channel,
                [key]: value,
            });
        }
    };

    /**
    * Handles the form submission to create a new channel.
    *
    * @function handleCreateChannel
    * @param {Object} e - The form submit event object.
    */
    const handleCreateChannel = async (e) => {
        e.preventDefault();


        if (channel.name.length < MIN_CHANNEL_NAME_LENGTH || channel.name.length > MAX_CHANNEL_NAME_LENGTH) {
            toast.warn(`Channel name must be between ${MIN_CHANNEL_NAME_LENGTH} and ${MAX_CHANNEL_NAME_LENGTH}`);
            return;
        }

        try {

            const channelId = await createChannel(channel.name.trim(), userData.username, userData.username, team.id); setChannel({ name: '' });

            setChannel({ name: '' });
            await addUserChannel(channelId, userData.username);
            await addChannelToTeam(team.id, channelId);
            onClose();
            onChannelCreated();
        } catch (error) {
            toast.error(error.message);
        }
    };
    return (
        <div className="fixed inset-0 flex z-50 items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="bg-gray-800 p-6 rounded-lg w-1/3 relative">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Create New Channel</h4>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-red-500 p-2 rounded-full"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleCreateChannel}>
                    <div className="mb-4">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            placeholder="Name your Channel"
                            value={channel.name}
                            onChange={(e) => updateChannel('name', e.target.value)}
                            className="w-full p-1.5 bg-gray-700 text-white rounded-md border border-gray-600 placeholder-gray-400 focus:ring-2"
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
};

CreateChannel.propTypes = {
    team: PropTypes.shape({

        id: PropTypes.string,

    }),
    onClose: PropTypes.func.isRequired,
    onChannelCreated: PropTypes.func.isRequired,
};