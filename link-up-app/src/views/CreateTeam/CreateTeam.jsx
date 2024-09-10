import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../state/app.context";
import { createTeam, getTeams } from "../../services/teams.service";
import { MAX_TEAM_NAME_LENGTH, MIN_TEAM_NAME_LENGTH } from "../../common/constants";
import { addUserTeam } from "../../services/users.service";
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Component for creating a new team.
 * 
 * @param {Object} props - The component props.
 * @param {Function} props.onClose - Callback function to be called when the form is closed.
 * @param {Function} props.onTeamCreated - Callback function to be called when a team is created successfully.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function CreateTeam({ onClose, onTeamCreated }) {
    const [team, setTeam] = useState({ name: '' });
    const { userData } = useContext(AppContext);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.classList.contains('popup-overlay')) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, team]);

    /**
     * Updates the team state with the new value for the given key.
     * 
     * @param {string} key - The key to update.
     * @param {string} value - The new value for the key.
     */
    const updateTeam = (key, value) => {
        if (team[key] !== value) {
            setTeam({
                ...team,
                [key]: value,
            });
        }
    };

    /**
    * Handles the form submission to create a new team.
    * 
    * @param {React.FormEvent} e - The form submit event.
    */
    const handleCreateTeam = async (e) => {
        e.preventDefault();

        if (team.name.length < MIN_TEAM_NAME_LENGTH || team.name.length > MAX_TEAM_NAME_LENGTH) {
            toast.error(`Team name must be between ${MIN_TEAM_NAME_LENGTH} and ${MAX_TEAM_NAME_LENGTH}`);
            return;
        }

        try {
            const existentTeam = await getTeams(team.name);
            if (existentTeam) {
                toast.error(`Team ${team.name} already exists`);
                return;
            }

            const newTeam = { name: team.name.trim(), owner: userData.username, createdOn: new Date().toString() };
            const teamId = await createTeam(newTeam, userData.username);
            newTeam.id = teamId;
            await addUserTeam(teamId, userData.username);

            toast.success(`Team ${team.name} created`)
            onClose();
            onTeamCreated(newTeam);
            setTeam({ name: '' });
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="bg-gray-800 p-6 rounded-lg w-1/3 relative">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Create New Team</h4>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-red-500 p-2 rounded-full"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleCreateTeam}>
                    <div className="mb-4">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            placeholder="Name your Team"
                            value={team.name}
                            onChange={(e) => updateTeam('name', e.target.value)}
                            className="w-full p-1.5 bg-gray-700 text-white rounded-md border border-gray-600 placeholder-gray-400 focus:ring-2"
                        />
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 focus:ring-2 focus:ring-indigo-400 "
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

CreateTeam.propTypes = {
    onClose: PropTypes.func.isRequired,
    onTeamCreated: PropTypes.func.isRequired,
};