import { useState } from "react";
import { getUserByUsername, getUserByEmail, getUserData } from "../../services/users.service";
import { getTeamMembersNames, getTeams, getUserTeams } from "../../services/teams.service";


const SearchUser = () => {

    const [searchedUser, setSearchedUser] = useState(null);

    const [searchType, setSearchType] = useState("username");

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
                    // Since `emailObj` can return multiple users if the query matches multiple records, you need to handle it accordingly.
                    // Assuming emailObj is an object where the key is the user ID and the value is the user data.
                    const userId = Object.keys(emailObj)[0]; // Get the first user ID
                    userFromDB = emailObj[userId]; // Get the user data by ID
                } else {
                    userFromDB = null;
                }
            } else if (searchType === "team") {
                const teamObj = await getTeams(query); // team object
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
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

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

            {searchType === "team" && Array.isArray(searchedUser) ? (
                <div className="team">

                    {searchedUser.map(user => (
                        <div key={user.id} className="user">
                            <div className="detail">
                                <img src={user.photoURL} alt="User Avatar" />
                                <span>{user.username}</span>
                            </div>
                            <>Add user</>
                        </div>

                    ))}
                </div>

            ) : (

                searchedUser && (
                    <div className="user">
                        <div className="detail">
                            <img src={searchedUser.photoURL} alt="User Avatar" />
                            <span>{searchedUser.username || searchedUser.email}</span>
                            <button>Add user</button>
                        </div>
                    </div>
                )
            )}
        </div>

    );

};

export default SearchUser;