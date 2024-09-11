import { useState, useEffect, useRef, useContext } from "react";
import { getUserByUsername, getUserByEmail, getUserData } from "../../services/users.service";
import { getTeamMembersNames, getTeams, getUserTeams } from "../../services/teams.service";
import './SearchUser.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createChannel } from "../../services/channels.service";
import { AppContext } from "../../state/app.context";

const SearchUser = () => {
    const { userData } = useContext(AppContext);
    const [searchedUser, setSearchedUser] = useState(null);
    const [searchType, setSearchType] = useState("username");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const query = formData.get("query");

        try {
            let userFromDB;

            if (searchType === "username") {
                userFromDB = await getUserByUsername(query);
            } else if (searchType === "email") {
                const emailObj = await getUserByEmail(query);

                if (emailObj) {
                    const userId = Object.keys(emailObj)[0];
                    userFromDB = emailObj[userId];
                } else {
                    userFromDB = null;
                }
            } else if (searchType === "team") {
                const teamObj = await getTeams(query);
                if (teamObj) {
                    const teamId = Object.keys(teamObj)[0];
                    const teamMembersNames = await getTeamMembersNames(teamId);
                    const promise = Object.keys(teamMembersNames).map(async (name) => {
                        const infoByName = await getUserByUsername(name);
                        return infoByName;
                    });
                    userFromDB = await Promise.all(promise);
                } else {
                    userFromDB = [];
                }
            }
            setSearchedUser(userFromDB || null);
            setIsDropdownOpen(true);
        } catch (error) {
            toast.error(`Search failed: ${error}`);
        }
    };

    const handleDM = async (user) =>{   
        setIsDropdownOpen(false);
        
    }
    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <form onSubmit={handleSearch} className="flex flex-col p-1 space-y-1">
                <select
                    onChange={(e) => setSearchType(e.target.value)}
                    defaultValue="username"
                    className="bg-gray-600 text-white p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 text-sm"
                >
                    <option value="username" className="text-black">User</option>
                    <option value="email" className="text-black">Email</option>
                    <option value="team" className="text-black">Team</option>
                </select>
                <input
                    type="text"
                    placeholder={
                        searchType === "team"
                            ? "Search users by team..."
                            : searchType === "username"
                                ? "Search by user..."
                                : searchType === "email"
                                    ? "Search by email..."
                                    : "Search"
                    } name="query"
                    className="flex-grow p-1.5 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-1 focus:ring-gray-200 text-sm"
                />

            </form>

            {isDropdownOpen && (
                <div
                ref={dropdownRef}
                className="absolute z-10 bg-gray-700  rounded-md shadow-md p-1 max-h-48 overflow-y-auto transition-all duration-200 ease-in-out w-full" // Adjust positioning here
                style={{ left: '0' }}
                >
                    {searchType === "team" && Array.isArray(searchedUser) ? (
                    <div className=" flex flex-col space-y-1">
                            {searchedUser.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                                    >
                                    <div className="flex items-center space-x-2 w-full">
                                        <img
                                            src={user.photoURL}
                                            alt="User Avatar"
                                            className=" w-10 h-10 rounded-full border border-white"
                                        />
                                        <span className=" text-white font-medium text-base">{user.username}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        searchedUser && (
                            <div className="flex items-start p-3 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors cursor-pointer">
                                <div className=" flex items-center space-x-2 w-full">
                                    <img
                                        src={searchedUser.photoURL}
                                        alt="User Avatar"
                                        className=" w-10 h-10 rounded-full border border-white"
                                    />
                                      <div className="flex justify-between items-center w-5">                               
    
                                </div>
                                    <span className=" text-white font-medium text-base">{searchedUser.username || searchedUser.email}</span>
                                </div>
                                             
                                <button className="text-white hover:text-yellow-300"
                                      onClick={() => handleDM(searchedUser)}
                                         >
                                        Chat
                                    </button>
                            </div>
                        )
                    )}
                </div>
            )}
        </>
    );
}



export default SearchUser;