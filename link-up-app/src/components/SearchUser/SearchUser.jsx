import { useState, useEffect, useRef } from "react";
import { getUserByUsername, getUserByEmail, getUserData } from "../../services/users.service";
import { getTeamMembersNames, getTeams, getUserTeams } from "../../services/teams.service";
import './SearchUser.css';


const SearchUser = () => {
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
            console.error('Search failed:', error);
        }
    };

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
        <div className="searchUser">
            <form onSubmit={handleSearch}>
                <select onChange={(e) => setSearchType(e.target.value)} defaultValue="username">
                    <option value="username">Username</option>
                    <option value="email">Email</option>
                    <option value="team">Team</option>
                </select>
                <input type="text" placeholder={searchType === "team" ? "Team Name" : "Search"} name="query" />
                <button type="submit">Search</button>
            </form>

            {isDropdownOpen && (
                <div ref={dropdownRef} className="dropdown-menu">
                    {searchType === "team" && Array.isArray(searchedUser) ? (
                        <div className="team">
                            {searchedUser.map(user => (
                                <div key={user.id} className="dropdown-item">
                                    <div className="dropdown-content">
                                        <img src={user.photoURL} alt="User Avatar" className="user-avatar" />
                                        <span>{user.username}</span>
                                    </div>
                                    <button className="add-button">Start a chat</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        searchedUser && (
                            <div className="dropdown-item">
                                <div className="dropdown-content">
                                    <img src={searchedUser.photoURL} alt="User Avatar" className="user-avatar" />
                                    <span>{searchedUser.username || searchedUser.email}</span>
                                </div>
                                <button className="add-button">Add user</button>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchUser;