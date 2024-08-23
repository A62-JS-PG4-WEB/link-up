import { useNavigate } from "react-router-dom";

export default function AllTeams ({ teams }) {
const navigate = useNavigate();

const navigatetoHome = (team) => {
    navigate("/home", { state: { team } });
}

console.log('all teams', teams);

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