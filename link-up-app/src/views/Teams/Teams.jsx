import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../state/app.context";
import { getUserTeams } from "../../services/teams.service";
import CreateTeam from "../CreateTeam/CreateTeam";


export default function Teams() {
    const [teams, setTeams] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false); 
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);

    useEffect(() => {
        const loadTeams = async () => {
            try {
                if (userData && userData.username) {
                    const allTeams = await getUserTeams(userData.username);
                    setTeams(allTeams);
                }
            } catch (e) {
                console.error('Error loading Teams', e);
            }
        };
        loadTeams();
    }, [userData]);

    const handleCreateTeamClick = () => {
        setIsPopupOpen(true); 
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false); 
    };

    return (
        <div>
           
                Teams
           
            <button
                onClick={handleCreateTeamClick} 
                className="ml-2 p-2 bg-gray-600 text-white rounded"
            >
                +
            </button>
            {isPopupOpen && <CreateTeam onClose={handleClosePopup} />} 
           
        </div>
    );

};