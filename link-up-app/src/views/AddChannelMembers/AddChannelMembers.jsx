import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../state/app.context";
import { createTeam, getTeamInfoById, getTeamMembersNames } from "../../services/teams.service";
import { addUserChannel, addUserTeam } from "../../services/users.service";
import { createInvitation } from "../../services/invitations.service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addUserToChannel, getChannelsMembersByID } from "../../services/channels.service";

export default function AddChannelMembers({ onClose, channel }) {
    const { userData } = useContext(AppContext);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [teamMembers, setTeamMembers] = useState([]);
    const options = ["Star Wars", "Harry Potter", "Lord of the Rings"];

    useEffect(() => {

        const teamId = JSON.parse(localStorage.getItem('selectedTeam')).id;
        // console.log('team members loading');

        const loadMembers = async () => {
            try {
                const members = await getTeamMembersNames(teamId);
                const filteredMembers = Object.keys(members).filter(m => m !== userData.username);
                setTeamMembers(filteredMembers);

            } catch (error) {
                console.error(error);
            }
        };
        loadMembers();
    }, []);

    useEffect(() => {
        console.log('pop up open');

        const handleClickOutside = (event) => {
            if (event.target.classList.contains('popup-overlay')) {
                onClose();
            } else if (!event.target.closest('.relative')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddMembers = async (e) => {
        e.preventDefault();

        const channel = JSON.parse(sessionStorage.getItem('selectedChat'));
        try {
            selectedOptions.map(async (username) => {

                await addUserChannel(channel.id, username);
                await addUserToChannel(channel.id, username);
                toast.success(`${username} added to #${channel.name}`)

            })
            //     await createInvitation(invitation);
            // await createInvitation(notification);

            onClose();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleOptionChange = (memberName) => {
        if (selectedOptions.includes(memberName)) {
            setSelectedOptions(selectedOptions.filter(item => item !== memberName));
        } else {
            setSelectedOptions([...selectedOptions, memberName]);
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedOptions([]);
        } else {
            setSelectedOptions(teamMembers);
        }
        setSelectAll(!selectAll);
    };

    return (
        <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
            <div className="bg-gray-900 p-6 rounded shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-800 p-2 rounded"
                >
                    &times;
                </button>
                <div className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text text-gray-200">Add One or More Members</span>
                    </div>
                    <div className="relative py-2 rounded-md">
                        <button
                            className="select select-bordered p-2 w-full text-left text-gray-400"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {selectedOptions.length > 0 ? `${selectedOptions.length} selected` : 'Pick One or All'}
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-gray-700 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
                                {teamMembers.length > 0 && (
                                    <ul className="py-1 text-sm text-gray-200">
                                        <li>
                                            <label className="flex items-center p-2 cursor-pointer hover:bg-gray-600">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-sm mr-2"
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                />
                                                <span>Select All</span>
                                            </label>
                                        </li>
                                        {teamMembers.map((m, index) => (
                                            <li key={index}>
                                                <label className="flex items-center p-2 cursor-pointer hover:bg-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox checkbox-sm mr-2"
                                                        checked={selectedOptions.includes(m)}
                                                        onChange={() => handleOptionChange(m)}
                                                    />
                                                    <span>{m}</span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleAddMembers}
                        className="mt-4 bg-indigo-400 text-white px-4 py-2 rounded-md hover:bg-indigo-300"
                    >
                        Add
                    </button>

                </div>
            </div>
        </div>
    );
};