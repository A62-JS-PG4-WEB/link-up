import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../state/app.context";
import { createTeam, getTeams } from "../../services/teams.service";
import { MAX_TEAM_NAME_LENGTH, MIN_TEAM_NAME_LENGTH } from "../../common/constants";

export default function Teams() {
    const [team, setTeam] = useState({ name: '' });
    const { userData } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("UserData:", userData);
    }, [userData]);

    const updateTeam = (key, value) => {
        if (team[key] !== value) {
            console.log(value);

            setTeam({
                ...team,
                [key]: value,
            });
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();

        if (team.name.length < MIN_TEAM_NAME_LENGTH || team.name.length > MAX_TEAM_NAME_LENGTH) {
            alert(`Team name must be between ${MIN_TEAM_NAME_LENGTH} and ${MAX_TEAM_NAME_LENGTH}`);
            return;
        }

        try {
            const existentTeam = await getTeams(team.name);
            if (existentTeam) {
                alert(`Team ${team.name} already exists`);
                return
            }

            await createTeam(team.name.trim(), userData.username, userData.username);
            setTeam({ name: '' });
            
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleCreateTeam} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                            Team name
                        </label>
                        <div className="mt-2">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                autoComplete="name"
                                placeholder="Name your Team"
                                value={team.name}
                                onChange={(e) => updateTeam('name', e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
