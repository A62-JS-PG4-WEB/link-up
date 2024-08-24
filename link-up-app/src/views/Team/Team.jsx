import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AddMembers from "../AddMembers/AddMembers";

export default function Team({team}) {

    const location = useLocation();
    const [currentTeam, setCurrentTeam] = useState(team || location.state?.team);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    
    useEffect(() => {

        if (!team) {
            const savedTeam = localStorage.getItem('selectedTeam');
            if (savedTeam) {
                try {
                    setCurrentTeam(JSON.parse(savedTeam));
                } catch (error) {
                    console.error("Failed to parse team from localStorage", error);
                }
            }
        } else {
            setCurrentTeam(team || location.state?.team);
        }
    }, [team, location.state]);
    
    const handleAddClick = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return(
        <div className="bg-gray-800 p-4 rounded-lg mt-7">
        {currentTeam && (
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-2">{currentTeam.name}</h3>
                <button
                    onClick={handleAddClick}
                    className="p-2 bg-gray-600 text-white rounded"
                >
                    +
                </button>
                {isPopupOpen && <AddMembers onClose={handleClosePopup} team={team} />}
            </div>
        )}
    </div>
    )
}