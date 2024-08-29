import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AddMembers from "../InviteTeamMember/InviteTeamMember";
import { AppContext } from "../../state/app.context";

export default function Team({ team }) {

    const location = useLocation();
    const [currentTeam, setCurrentTeam] = useState(team || location.state?.team);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { userData } = useContext(AppContext);

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
    }, [userData, location.state]);

    const handleAddClick = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg mt-7">
            {currentTeam && (
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold mb-2">{currentTeam.name}</h3>
                    {userData?.username === currentTeam.owner && (
                        <div>
                            <button
                                onClick={handleAddClick}
                                className="p-2 bg-gray-600 text-white rounded"
                            >
                                +
                            </button>
                            {isPopupOpen && (
                                <AddMembers onClose={handleClosePopup} team={team} />
                            )}
                        </div>
                    )}
                </div>
            )}
            {currentTeam && (
                <div className="text-sm mt-4">
                    {currentTeam.owner && <p><strong>Owner:</strong> {currentTeam.owner}</p>}
                    {currentTeam.createdOn && (
                        <p><strong>Created On:</strong> {new Date(currentTeam.createdOn).toLocaleDateString()}</p>
                    )}
                    {currentTeam.members && Object.keys(currentTeam.members).length > 0 ? (
                        <div>
                            <button
                                onClick={toggleDropdown}
                                className="mt-2 p-2 bg-gray-700 text-white rounded"
                            >
                                {isDropdownOpen ? "Hide Members" : "Show Members"}
                            </button>
                            {isDropdownOpen && (
                                <ul className="ml-4 list-disc mt-2">
                                    {Object.keys(currentTeam.members).map((memberKey, index) => (
                                        <li key={index}>{memberKey}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : (
                        <p>No members found</p>
                    )}
                </div>
            )}
        </div>
    );
}