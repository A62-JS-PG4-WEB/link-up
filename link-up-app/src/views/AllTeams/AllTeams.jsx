import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { capitalizeFirstLetter } from "../../services/channels.service";

/**
 * Component that displays a list of teams and navigates to the selected team's home page.
 * 
 * @component
 * @param {Object[]} teams - The list of teams available to display.
 * @returns {JSX.Element} The rendered component.
 */
export default function AllTeams({ teams }) {
    const navigate = useNavigate();
    const [selectedTeam, setSelectedTeam] = useState([]);

    /**
     * Handles team selection and navigation to the home page of the selected team.
     * 
     * @function navigatetoHome
     * @param {Object} team - The selected team object.
     */
    const navigatetoHome = (team) => {
        setSelectedTeam(team)
        try {
            localStorage.setItem('selectedTeam', JSON.stringify(team));
        } catch (error) {
            toast.error(`Failed to save team to localStorage: ${error}`);
        }
        navigate("/home", { state: { selectedTeam } });
    };

    return (
        <div className="p-4">
            <ul className="space-y-2">
                {teams?.map((t) => (
                    <li key={t.id} className="hover:bg-gray-900 rounded-lg">
                        <button
                            onClick={() => navigatetoHome(t)}
                            className="flex items-center p-3 w-full text-gray-100 rounded-lg transition-colors duration-300 ease-in-out hover:bg-gray-700"
                        >
                          {capitalizeFirstLetter(t.name)}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

};
// Define PropTypes for the AllTeams component
AllTeams.propTypes = {
    teams: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ).isRequired
};
