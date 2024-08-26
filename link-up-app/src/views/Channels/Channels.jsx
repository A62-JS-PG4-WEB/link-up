import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../state/app.context";
import { getTeamsInfoById, getUserTeams } from "../../services/teams.service";
import CreateTeam from "../CreateTeam/CreateTeam";
import AllTeams from "../AllTeams/AllTeams";
import { useNavigate } from "react-router-dom";
import CreateChannel from "../CreateChannel/CreateChannel";
import { getChannelsInfoById, getUserChannels } from "../../services/channels.service";
import PropTypes from 'prop-types';

export default function Channels({ team }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { userData } = useContext(AppContext);
    const [channels, setChannels] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const loadChannels = async () => {
            try {
                if (userData && userData.username) {
                    // const allChannels = await getUserChannels(userData.username);
                    // const listTeams = await getChannelsInfoById(allChannels);
                    // setChannels(listTeams);
                }
            } catch (e) {
                console.error("Error loading Channels", e);
            }
        };

        loadChannels()
    }, [userData]);

    const handleToggleChannelsList = () => {
        setIsTeamsListVisible(!isTeamsListVisible);
    };

    const handleCreateChannelClick = () => {
        // navigate('/create-team'); when redirection happens it opens a new window with the pop up on top <<< check!
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <div className="channels">
            <div className="flex items-center space-x-2">
                <span className="flex items-center mr-4">
                </span>
                <div className="teamButtons flex justify-end space-x-2 w-full">
                    <button
                        onClick={handleCreateChannelClick}
                        className="p-2 bg-gray-600 text-white rounded"
                    >
                        +
                    </button>

                </div>
                {isPopupOpen && <CreateChannel team={team} onClose={handleClosePopup} />}
            </div>


            {/* <div className="teamsList">
                    <AllTeams teams={teams} />
                </div> */}

        </div>
    );
}

Channels.propTypes = {
    team: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string,
        createdOn: PropTypes.string,
        members: PropTypes.arrayOf(PropTypes.string),
    }),
};