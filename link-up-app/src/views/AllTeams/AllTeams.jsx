import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AllTeams({ teams }) {


    // console.log(teams);

    return (
        <div>
            <ul>
                {teams?.map((t) => (
                    <li key={t.id} className="my-2 w-full hover:bg-gray-700" >
                        <button
                            onClick={() => toast(`Selected team: ${t.name}`)}
                            className="flex items-center p-1 text-white hover:bg-gray-700 ml-5 "
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