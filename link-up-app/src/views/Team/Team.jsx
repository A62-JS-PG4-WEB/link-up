import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AddMembers from "../InviteTeamMember/InviteTeamMember";
import { AppContext } from "../../state/app.context";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { removeUserFromTeam } from "../../services/teams.service";
import InviteTeamMember from "../InviteTeamMember/InviteTeamMember";
import { capitalizeFirstLetter } from "../../services/channels.service";

export default function Team({ team, onClose }) {

    const location = useLocation();
    const [currentTeam, setCurrentTeam] = useState(team || location.state?.team);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { userData } = useContext(AppContext);
    const [isTeamInfoVisible, setIsTeamsInfoVisible] = useState(false);
    const [members, setMembers] = useState(currentTeam?.members || {});

    useEffect(() => {

        if (!team) {
            const savedTeam = localStorage.getItem('selectedTeam');
            onClose();
            if (savedTeam) {
                try {
                    const parsedTeam = JSON.parse(savedTeam);
                    setCurrentTeam(parsedTeam);
                    setMembers(parsedTeam.members || {});
                } catch (error) {
                    toast.error(`Failed to parse team from localStorage: ${error}`);
                }
            }
        } else {
            setCurrentTeam(team || location.state?.team);
            setMembers(team?.members || {});
        }

    }, [userData, location.state, team]);

    const handleAddClick = () => {
        console.log("Invite button clicked!");
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleToggleTeamsList = () => {
        setIsTeamsInfoVisible(!isTeamInfoVisible);
    };


    const handleRemoveMember = async (username) => {
        const confirmRemoval = window.confirm(`Confirm removal of ${username} from ${currentTeam.name}`);

        if (confirmRemoval) {
            try {
                await removeUserFromTeam(username, currentTeam.id);
                setMembers((prevMembers) => {
                    const newMembers = { ...prevMembers };
                    delete newMembers[username];
                    return newMembers;
                });
            } catch (error) {
                console.error(`Member removal failed ${error}`);
            }
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg mt-7">
            {currentTeam ? (
                <>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold mb-2 inline-flex items-center">
                            {capitalizeFirstLetter(currentTeam.name)}
                        </h3>

                        <div className="teamButtons flex space-x-2">
                            <button
                                onClick={handleToggleTeamsList}
                                className="p-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-medium rounded-md shadow-sm hover:from-gray-700 hover:to-gray-800 transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                ^
                            </button>
                        </div>
                    </div>
                    {isTeamInfoVisible && (
                        <div className="teamsList rounded-lg mt-4">
                            <div className="mb-2 ml-1">
                                {currentTeam.owner && (
                                    <p>
                                        <strong>Owner:</strong> {currentTeam.owner}
                                    </p>
                                )}
                            </div>
                            <div className="mb-2 ml-1">
                                {currentTeam.createdOn && (
                                    <p>
                                        <strong>Created On:</strong>{" "}
                                        {new Date(currentTeam.createdOn).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            {userData?.username === currentTeam.owner && (
                                <div className="flex justify-between items-center mb-4">
                                    <button
                                        onClick={handleAddClick}
                                        className="p-2 bg-gray-600 text-white rounded-lg transition-colors duration-300 ease-in-out hover:bg-gray-500"
                                    >
                                        Invite +
                                    </button>
                                    {isPopupOpen && (
                                        <InviteTeamMember
                                            onClose={handleClosePopup}
                                            team={currentTeam}
                                        />
                                    )}
                                </div>
                            )}

                            <div className="text-sm mt-4">

                                {members &&
                                    Object.keys(members).length > 0 ? (
                                    <div className="mb-3">
                                        <button
                                            onClick={toggleDropdown}
                                            className="p-2 bg-gray-600 text-white rounded-lg transition-colors duration-300 ease-in-out hover:bg-gray-500"
                                        >
                                            {isDropdownOpen
                                                ? "Hide Members"
                                                : "Show Members"}
                                        </button>
                                        {isDropdownOpen && (
                                            <ul className="ml-4 mt-2">
                                                {Object.keys(members).map((memberKey, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex justify-between items-center"
                                                    >
                                                        <span>{memberKey}</span>
                                                        {userData?.username === currentTeam.owner && (
                                                            <button
                                                                className="text-white mr-2 hover:text-red-800"
                                                                onClick={() => handleRemoveMember(memberKey)}
                                                            >
                                                                x
                                                            </button>)}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <p>No members found</p>
                                )}

                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <h3 className="text-lg font-semibold mb-2">Team</h3>
                    <p className="text-gray-400">No team selected</p>
                </>
            )}
        </div>
    );
}