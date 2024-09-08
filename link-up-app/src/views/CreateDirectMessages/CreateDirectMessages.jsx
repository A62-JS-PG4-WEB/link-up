import PropTypes from 'prop-types';
import { createDirectMessage, addUserToDirectMessages } from "../../services/direct-messages.service.js";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../state/app.context.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateDirectMessage({ onClose, onDirectMessageCreated }) {
    const [userToMessage, setUserToMessage] = useState('');
    const { userData } = useContext(AppContext);

    const handleCreateDirectMessage = async (e) => {
        e.preventDefault();

        if (!userToMessage.trim()) {
            toast.warn('Please enter a username.');
            return;
        }

        try {
            const recipient = userToMessage.trim();
            const directMessageId = await createDirectMessage(userData.username, recipient);
            await addUserToDirectMessages([directMessageId], userData.username);
            await addUserToDirectMessages([directMessageId], recipient);  // Add recipient to the direct message
            onDirectMessageCreated(directMessageId);
            onClose();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="bg-gray-800 p-6 rounded-lg w-1/3 relative">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Create New Direct Message</h4>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-red-500 p-2 rounded-full"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleCreateDirectMessage}>
                    <div className="mb-4">
                        <input
                            id="user"
                            name="user"
                            type="text"
                            required
                            autoComplete="off"
                            placeholder="Enter username"
                            value={userToMessage}
                            onChange={(e) => setUserToMessage(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                    >
                        Create Direct Message
                    </button>
                </form>
            </div>
        </div>
    );
}

CreateDirectMessage.propTypes = {
    onClose: PropTypes.func.isRequired,
    onDirectMessageCreated: PropTypes.func.isRequired,
};