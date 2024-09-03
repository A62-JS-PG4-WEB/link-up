import { useState } from "react";
import { getUserByUsername } from "../../services/users.service";


const SearchUser = () => {
    const [searchedUser, setSearchedUser] = useState(null);
    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");
        
        console.log(formData);
        console.log(username);
        try {
            const userFromDB = await getUserByUsername(username);

            if (userFromDB) {
                setSearchedUser(userFromDB);
                console.log(userFromDB)
            } else {
                setSearchedUser(null); 
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Username" name="username" />
                <button>Search</button>
            </form>
            {searchedUser && (
                <div className="user">
                    <div className="detail">
                        <img src={searchedUser.photoURL || "./avatar.png"} alt="User Avatar" />
                        <span>{searchedUser.username}</span>
                    </div>
                    <button>Add user</button>
                </div>
            )}
        </div>
    );
};

export default SearchUser;   