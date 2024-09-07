import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../state/app.context";
import { getTeamsInfoById, getUserTeams } from "../../services/teams.service";
import CreateTeam from "../CreateTeam/CreateTeam";
import AllTeams from "../AllTeams/AllTeams";
import './Teams.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Teams() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isTeamsListVisible, setIsTeamsListVisible] = useState(false);
    const { userData } = useContext(AppContext);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const loadTeams = async () => {
            try {
                if (userData && userData.username) {
                    const allTeams = await getUserTeams(userData.username);
                    const listTeams = await getTeamsInfoById(allTeams);
                    setTeams(listTeams);
                }
            } catch (e) {
                toast.error("Error loading Teams", e);
            }
        };

        if (isTeamsListVisible) {
            loadTeams();
        }
    }, [userData, isTeamsListVisible]);

    const handleToggleTeamsList = () => {
        setIsTeamsListVisible(!isTeamsListVisible);
    };

    const handleCreateTeamClick = () => {
        // navigate('/create-team'); when redirection happens it opens a new window with the pop up on top <<< check!
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

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
                <div className="teamsList rounded-lg">
<button
                        onClick={handleCreateTeamClick}
                        className="p-2 bg-gray-600 text-white rounded-lg transition-colors duration-300 ease-in-out hover:bg-gray-500"
                    >
                        Add New Team +
                    </button>
                    {isPopupOpen && <CreateTeam
                    onClose={handleClosePopup}
                    onTeamCreated={handleTeamCreated} />}
                    <AllTeams teams={teams} />
                </div>
                
            )}
        </div>
    );
}
