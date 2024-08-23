import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../state/app.context";
import { MAX_CHANNEL_NAME_LENGTH, MIN_CHANNEL_NAME_LENGTH } from "../../common/constants";
import { addUserChannel } from "../../services/users.service";
import { createChannel } from "../../services/channels.service";
import { addChannelToTeam } from "../../services/teams.service";


export default function CreateChannel ({ team, onClose }) {
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
    }, [onClose]);

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
console.log(team);

        if (channel.name.length < MIN_CHANNEL_NAME_LENGTH || channel.name.length > MAX_CHANNEL_NAME_LENGTH) {
            alert(`Channel name must be between ${MIN_CHANNEL_NAME_LENGTH} and ${MAX_CHANNEL_NAME_LENGTH}`);
            return;
        }

        try {

            const channelId = await createChannel(channel.name.trim(), userData.username, userData.username, team.id);
            setChannel({ name: '' });
            await addUserChannel(channelId, userData.username);          
            await addChannelToTeam(team.id, channelId);
            onClose();
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
            <div className="bg-gray-400 p-6 rounded shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 bg-gray-400 p-2 rounded"
                >
                    &times;
                </button>
                <h2 className="text-lg font-semibold text-gray-900">Create New Channel</h2>
                <form onSubmit={handleCreateChannel} className="space-y-6 mt-4">
                    <div>
                        <div className="mt-2">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                autoComplete="name"
                                placeholder="Name your Channel"
                                value={channel.name}
                                onChange={(e) => updateChannel('name', e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}