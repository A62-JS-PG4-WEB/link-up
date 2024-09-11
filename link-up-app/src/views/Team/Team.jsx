import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../state/app.context";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { removeUserFromTeam } from "../../services/teams.service";
import InviteTeamMember from "../InviteTeamMember/InviteTeamMember";
import { capitalizeFirstLetter } from "../../services/channels.service";

/**
 * Team component that displays detailed information about the team,
 * including team members, the team owner, and functionality to invite members
 * or remove them from the team. It handles team data loading, member management,
 * and stateful UI changes.
 *
 * @component
 * @param {object} props - The properties passed to the component.
 * @param {object} props.team - The team data to display. If not provided, uses data from localStorage.
 * @param {function} props.onClose - Callback function to handle the closing of the team panel.
 * @returns {JSX.Element} The rendered Team component.
 */
export default function Team({ team, onClose }) {

    const location = useLocation();
    const [currentTeam, setCurrentTeam] = useState(team || location.state?.team);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { userData } = useContext(AppContext);
    const [isTeamInfoVisible, setIsTeamsInfoVisible] = useState(false);
    const [members, setMembers] = useState(currentTeam?.members || {});

    /**
    * useEffect hook to load team data either from the provided `team` prop
    * or from localStorage if no team is passed. It also sets members list and manages errors.
    *
    * @returns {void}
    */
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

    /**
     * Handles the click event to open the Invite Member popup.
     * @returns {void}
     */
    const handleAddClick = () => {
        setIsPopupOpen(true);
    };

    /**
   * Handles closing of the Invite Member popup.
   * @returns {void}
   */
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    /**
     * Toggles the visibility of the dropdown that shows the team members.
     * @returns {void}
     */
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    /**
        * Toggles the visibility of the team's detailed information panel.
        * @returns {void}
        */
    const handleToggleTeamsList = () => {
        setIsTeamsInfoVisible(!isTeamInfoVisible);
    };


    /**
    * Handles the removal of a member from the team.
    * Prompts the user for confirmation, removes the member from the backend and updates the state.
    *
    * @param {string} username - The username of the member to be removed.
    * @returns {Promise<void>} Resolves when the member is removed.
    */
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
                                            <ul className="ml-2 mt-2 max-h-40 overflow-y-auto">
                                                <div className="channelsList rounded-lg max-h-20 overflow-y-auto">
                                                    {Object.keys(members).map((memberKey, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex justify-between items-center p-1 bg-gray-700 hover:bg-gray-600 rounded-md mb-1"
                                                        >
                                                            <span>{memberKey}</span>
                                                            {userData?.username === currentTeam.owner && (
                                                                <button
                                                                    className="text-white mr-2 hover:text-red-800"
                                                                    onClick={() => handleRemoveMember(memberKey)}
                                                                >
                                                                    &times;
                                                                </button>
                                                            )}
                                                        </li>
                                                    ))}
                                                </div>
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
};

// Define PropTypes for the Team component
Team.propTypes = {
    team: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        owner: PropTypes.string,
        createdOn: PropTypes.number,
        members: PropTypes.objectOf(PropTypes.number)
    }),
    onClose: PropTypes.func.isRequired
};