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
        <div>
            <ul>

                {teams?.map((t) => (
                    <li key={t.id} className="my-2 w-full hover:bg-gray-800" >
                        <button
                            onClick={() => navigatetoHome(t)}
                            className="flex items-center p-1 text-white ml-5 "
                        >
                            {/* className="flex items-center p-4 text-white hover:bg-gray-700" */}
                            {t.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

}

