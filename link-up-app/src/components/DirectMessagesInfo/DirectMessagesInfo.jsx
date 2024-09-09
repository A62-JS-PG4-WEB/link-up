import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { getDirectMessagesInfoById } from "../../services/direct-messages.service";
import { getDirectMessageMembers, leaveDirectMessage } from "../../services/directMessages.service";
import { AppContext } from "../../state/app.context";

export function DirectMessagesInfo({ directMessage, onClose }) {
    const { userData } = useContext(AppContext);
    const [currentDM, setCurrentDM] = useState(directMessage || location.state?.directMessage);
    const [members, setMembers] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        if (!directMessage) {
            const savedDM = sessionStorage.getItem('selectedDM');
            if (savedDM) {
                try {
                    setCurrentDM(JSON.parse(savedDM));
                } catch (error) {
                    console.error("Failed to parse DM from sessionStorage", error);
                }
            }
        } else {
            setCurrentDM(directMessage);
        }
    }, [directMessage]);

    useEffect(() => {
        if (currentDM) {
            const loadMembers = async () => {
                try {
                    const dmMembers = await getDirectMessageMembers(currentDM.id);
                    setMembers(dmMembers);
                } catch (error) {
                    console.error("Failed to load DM members", error);
                }
            };
            loadMembers();
        }
    }, [currentDM]);

    const handleLeaveDM = async () => {
        const confirmation = window.confirm('Are you sure you want to leave the direct message?');
        if (confirmation) {
            await leaveDirectMessage(userData.username, currentDM.id);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex flex-col bg-gray-800 p-6 rounded-lg max-w-3xl w-full h-[600px] relative flex-grow">
                <div className="flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold mt-3 mb-5">Direct Message Information</h2>
                        <button
                            className="text-white hover:text-red-800 text-4xl focus:outline-none"
                            onClick={onClose}
                        >
                            &times;
                        </button>
                    </div>
                    <p>Direct Message Name: <strong>{currentDM?.name}</strong></p>
                    <p className="text-lg font-bold text-white mt-4">Members:</p>

                    <ul className="list-disc pl-6">
                        {members.map((m, index) => (
                            <li key={index}>
                                <p className="text-lg font-semibold">
                                    {m}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex justify-center mt-4" onClick={handleLeaveDM}>
                    <button className="ml-auto text-white hover:text-red-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 3.5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 15 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5z" />
                            <path fillRule="evenodd" d="M4.854 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .707.707L6.207 7.5H13.5a.5.5 0 0 1 0 1H6.207l2.354 2.354a.5.5 0 1 1-.707.707l-3-3z" />
                        </svg>
                        Leave
                    </button>
                </div>
            </div>
        </div>
    );
}

DirectMessagesInfo.propTypes = {
    onClose: PropTypes.func.isRequired,
    directMessage: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.string,
        createdOn: PropTypes.string,
        members: PropTypes.object,
        messages: PropTypes.object,
    }),
};