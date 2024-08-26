import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import AddMembers from "../../views/AddMembers/AddMembers"
export default function Team({ team }) {
    const location = useLocation();
    const [currentTeam, setCurrentTeam] = useState(team || location.state?.team);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        if (!team) {
            const savedTeam = localStorage.getItem("selectedTeam");
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

    return (
        <div className="bg-gray-800 p-4 rounded-lg mt-7">
            {currentTeam ? (
                <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{currentTeam.name}</h3>
                        <button
                            onClick={handleAddClick}
                            className="p-2 bg-gray-600 text-white rounded"
                        >
                            +
                        </button>
                        {isPopupOpen && <AddMembers onClose={handleClosePopup} />}
                    </div>
                    <div className="text-sm">
                        {currentTeam.owner && <p><strong>Owner:</strong> {currentTeam.owner}</p>}
                        {currentTeam.createdOn && <p><strong>Created On:</strong> {new Date(currentTeam.createdOn).toLocaleDateString()}</p>}
                        {currentTeam.members && Object.keys(currentTeam.members).length > 0 ? (
                            <div>
                                <strong>Members:</strong>
                                <ul className="ml-4 list-disc">
                                    {Object.keys(currentTeam.members).map((memberKey, index) => (
                                        <li key={index}>{memberKey}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>No members found</p>
                        )}

                    </div>
                </div>
            ) : (
                <p>No team selected</p>
            )}
        </div>
    );
}

Team.propTypes = {
    team: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string,
        createdOn: PropTypes.string,
        members: PropTypes.arrayOf(PropTypes.string),
    }),
};
