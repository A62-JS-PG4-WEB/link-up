import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../state/app.context";
import { MAX_CHANNEL_NAME_LENGTH, MIN_CHANNEL_NAME_LENGTH } from "../../common/constants";
import { addUserChannel } from "../../services/users.service";
import { createChannel } from "../../services/channels.service";
import { addChannelToTeam } from "../../services/teams.service";
import PropTypes from 'prop-types';

export default function CreateChannel({ team, onClose, onChannelCreated }) {
    const [channel, setChannel] = useState({ name: '' });
    const { userData } = useContext(AppContext);

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

    const updateChannel = (key, value) => {
        if (channel[key] !== value) {
            setChannel({
                ...channel,
                [key]: value,
            });
        }
    };

    const handleCreateChannel = async (e) => {
        e.preventDefault();


        if (channel.name.length < MIN_CHANNEL_NAME_LENGTH || channel.name.length > MAX_CHANNEL_NAME_LENGTH) {
            alert(`Channel name must be between ${MIN_CHANNEL_NAME_LENGTH} and ${MAX_CHANNEL_NAME_LENGTH}`);
            return;
        }

        try {

            const channelId = await createChannel(channel.name.trim(), userData.username, userData.username, team.id);            setChannel({ name: '' });

            setChannel({ name: '' });
            await addUserChannel(channelId, userData.username);
            await addChannelToTeam(team.id, channelId);
            onClose();
            onChannelCreated();
        } catch (error) {
            console.error(error.message);
        }
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
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
    
        // <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
        //     <div className="bg-gray-400 p-6 rounded shadow-lg relative">
        //         <button
        //             onClick={onClose}
        //             className="absolute top-2 right-2 text-gray-700 hover:text-red-800 p-2 rounded"
        //         >
        //             &times;
        //         </button>
        //         <h2 className="text-lg font-semibold text-gray-900">Create New Channel</h2>
        //         <form onSubmit={handleCreateChannel} className="space-y-6 mt-4">
        //             <div>
        //                 <div className="mt-2">
        //                     <input
        //                         id="name"
        //                         name="name"
        //                         type="text"
        //                         required
        //                         autoComplete="name"
        //                         placeholder="Name your Channel"
        //                         value={channel.name}
        //                         onChange={(e) => updateChannel('name', e.target.value)}
        //                         className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm"
        //                     />
        //                 </div>
        //             </div>
        //             <div>
        //                 <button
        //                     type="submit"
        //                     className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600"
        //                 >
        //                     Create
        //                 </button>
        //             </div>
        //         </form>
        //     </div>
        // </div>
    // );
}

CreateChannel.propTypes = {
    team: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string,
        createdOn: PropTypes.string,
        id: PropTypes.string,
        members: PropTypes.arrayOf(PropTypes.string),
    }),
    onClose: PropTypes.func.isRequired,
    onChannelCreated: PropTypes.func.isRequired,
};