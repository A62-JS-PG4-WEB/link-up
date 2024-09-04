import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../state/app.context";
import { createTeam } from "../../services/teams.service";
import { addUserTeam } from "../../services/users.service";
import { createInvitation } from "../../services/invitations.service";


export default function AddChannelMembers({ onClose, channel }) {
    const [emailInput, setEmailInput] = useState({ email: '' });
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

    const updateEmailInput = (key, value) => {
        
        if (emailInput[key] !== value) {
            setEmailInput({
                ...emailInput,
                [key]: value,
            });
        }
    };

    const handleAddMembers = async (e) => {
       
         e.preventDefault();

        try {

            // const channelName = JSON.parse(localStorage.getItem('selectedChat')).name;
            // const channelId = JSON.parse(localStorage.getItem('selectedChat')).id;
            
            // const notification = {
            //     type: "channel",
            //     channelId: channelId,
            //     channelName: channelName,
            //     message: `You've been added to channel ${channelName}`,
            //     email: emailInput.email,
            //     senderUsername: userData.username,      
            //     createdOn: new Date().getTime(),
            //     updatedOn: new Date().getTime()
            // };
            const teamName = JSON.parse(localStorage.getItem('selectedTeam')).name;
            const teamId = JSON.parse(localStorage.getItem('selectedTeam')).id;
            
            const invitation = {
                type: "team",
                status: "pending",
                teamID: teamId,
                teamName: teamName,
                message: `You are invitated to team ${teamName}`,
                email: emailInput.email,
                senderUsername: userData.username,      
                createdOn: new Date().getTime(),
                updatedOn: new Date().getTime()
            };
        
           await createInvitation(invitation);
           await createInvitation(notification);

           setEmailInput({ email: '' });
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
                <div>
                <div className="space-y-6 mt-4">
                        <button
                            className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600"
                        >
                            Add Member
                        </button>
                        <button
                            className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600"
                        >
                            Add Team Members
                        </button>
                    </div>
                    </div>
            </div>
        </div>
    );
}
{/* <h2 className="text-lg font-semibold text-gray-900">Add Member to Channel</h2>
                <form onSubmit={handleAddMembers} className="space-y-6 mt-4">
                    <div>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="email"
                                value={emailInput.email}
                                onChange={(e) => updateEmailInput('email', e.target.value)}
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
                </form> */}