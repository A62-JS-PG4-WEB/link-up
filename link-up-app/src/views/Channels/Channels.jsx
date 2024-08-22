import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../state/app.context";
import { getTeamsInfoById, getUserTeams } from "../../services/teams.service";
import CreateTeam from "../CreateTeam/CreateTeam";
import AllTeams from "../AllTeams/AllTeams";
import { useNavigate } from "react-router-dom";
import CreateChannel from "../CreateChannel/CreateChannel";

export default function Channels() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isTeamsListVisible, setIsTeamsListVisible] = useState(false);
    const { userData } = useContext(AppContext);
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const loadTeams = async () => {
            try {
                if (userData && userData.username) {
                    const allTeams = await getUserTeams(userData.username);
                    const listTeams = await getTeamsInfoById(allTeams);
                    console.log(listTeams);

                    setTeams(listTeams);
                }
            } catch (e) {
                console.error("Error loading Teams", e);
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

    return (
        <div className="teams">
            <div className="flex items-center space-x-2">
                <span className="flex items-center mr-4">
                 
                    {/* <span className="ml-4">Teams</span> */}
                    
                  
                </span>
                <div className="teamButtons flex justify-end space-x-2 w-full">
                    <button
                        onClick={handleCreateTeamClick}
                        className="p-2 bg-gray-600 text-white rounded"
                    >
                        +
                    </button>
                   
                </div>
                {isPopupOpen && <CreateChannel onClose={handleClosePopup} />}
            </div>

            {isTeamsListVisible && (
                <div className="teamsList">
                    <AllTeams teams={teams} />
                </div>
            )}
        </div>
    );
}
