import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../state/app.context";
import { createTeam } from "../../services/teams.service";
import { addUserTeam } from "../../services/users.service";
import { createInvitation } from "../../services/invitations.service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InviteTeamMember({ onClose, team }) {
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
            setEmailInput({ email: '' });
            onClose();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-1/3 relative">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Invite Team Member</h4>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-red-500 p-2 rounded-full"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleAddMembers}>
                    <div className="mb-4">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="email"
                            value={emailInput.email}
                            onChange={(e) => updateEmailInput('email', e.target.value)}
                            className="w-full p-1.5 bg-gray-700 text-white rounded-md border border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-indigo"
                        />
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 focus:ring-2 focus:ring-indigo-400 "
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}
