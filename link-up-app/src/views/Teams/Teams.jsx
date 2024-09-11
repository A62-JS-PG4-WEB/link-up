import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../state/app.context";
import { getTeamsInfoById, getUserTeams } from "../../services/teams.service";
import CreateTeam from "../CreateTeam/CreateTeam";
import AllTeams from "../AllTeams/AllTeams";
import './Teams.css';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Teams component responsible for displaying the user's list of teams, 
 * creating new teams, and showing all team details. It manages the 
 * state for team loading, popup visibility, and interaction.
 *
 * @component
 * @returns {JSX.Element} The rendered Teams component.
 */
export default function Teams() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isTeamsListVisible, setIsTeamsListVisible] = useState(false);
    const { userData } = useContext(AppContext);
    const [teams, setTeams] = useState([]);

      /**
     * useEffect hook to load all the teams for the current user.
     * Fetches team data if the user is logged in and the teams list is visible.
     *
     * @returns {void}
     */
    useEffect(() => {
        const loadTeams = async () => {
            try {
                if (userData && userData.username) {
                    const allTeams = await getUserTeams(userData.username);
                    const listTeams = await getTeamsInfoById(allTeams);
                    setTeams(listTeams);
                }
            } catch (e) {
                console.error(`Error loading Teams: ${e}`);
            }
        };

        if (isTeamsListVisible) {
            loadTeams();
        }
    }, [userData, isTeamsListVisible]);

      /**
     * Toggles the visibility of the teams list.
     * @returns {void}
     */
    const handleToggleTeamsList = () => {
        setIsTeamsListVisible(!isTeamsListVisible);
    };

    /**
     * Handles the creation of a new team. Opens the CreateTeam popup.
     * @returns {void}
     */
    const handleCreateTeamClick = () => {
        setIsPopupOpen(true);
    };

/**
     * Closes the CreateTeam popup.
     * @returns {void}
     */    
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

      /**
     * Handles the event when a new team is created.
     * Adds the new team to the list of existing teams.
     *
     * @param {object} newTeam - The newly created team object.
     * @returns {void}
     */
    const handleTeamCreated = (newTeam) => {
        setTeams((prevTeams) => [...prevTeams, newTeam]);
    };

    return (
        <div className="teams">
            <div className="flex items-center space-x-2">
                <span className="flex items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                    </svg>
                    <span className="ml-4 rounded-lg">Teams</span>

                    {/* Teams */}
                </span>
                <div className="teamButtons flex justify-end space-x-2 w-full">
                    <button
                        onClick={handleToggleTeamsList}
                        className="px-1 py-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-medium rounded-md shadow-sm hover:from-gray-700 hover:to-gray-800 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        ^
                    </button>
                </div>
            </div>

            {isTeamsListVisible && (
                <div className="teamsList rounded-lg max-h-60 overflow-y-auto">
                    <button
                        onClick={handleCreateTeamClick}
                        className="mt-4 ml-6 p-2  bg-gray-600 text-white rounded-lg transition-colors duration-300 ease-in-out hover:bg-gray-500"
                    >
                        New Team +
                    </button>
                    {isPopupOpen && (
                        <CreateTeam onClose={handleClosePopup} onTeamCreated={handleTeamCreated} />
                    )}
                    <AllTeams teams={teams} />
                </div>
            )}
        </div>
    );
}
