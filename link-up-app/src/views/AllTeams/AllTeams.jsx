import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AllTeams({ teams }) {
    const navigate = useNavigate();
    const [selectedTeam, setSelectedTeam] = useState([]);

    const navigatetoHome = (team) => {
        setSelectedTeam(team)
        try {
            localStorage.setItem('selectedTeam', JSON.stringify(team));
            // localStorage.removeItem('selectedChat');  
        } catch (error) {
            console.error("Failed to save team to localStorage", error);
        }         
        navigate("/home", { state: { selectedTeam } });
    }

    return (
        <div className="p-4">
            <ul className="space-y-2">
                {teams?.map((t) => (
                    <li key={t.id} className="hover:bg-gray-900 rounded-lg">
                        <button
                            onClick={() => navigatetoHome(t)}
                            className="flex items-center p-3 w-full text-gray-100 rounded-lg transition-colors duration-300 ease-in-out hover:bg-gray-700"
                        >
                            {t.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

}

