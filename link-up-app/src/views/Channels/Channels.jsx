import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../state/app.context";
import { getTeamsInfoById, getUserTeams } from "../../services/teams.service";
import CreateTeam from "../CreateTeam/CreateTeam";
import AllTeams from "../AllTeams/AllTeams";
import { useLocation, useNavigate } from "react-router-dom";
import CreateChannel from "../CreateChannel/CreateChannel";
import { getChannelsInfoById, getUserChannels } from "../../services/channels.service";
import PropTypes from 'prop-types';

export default function Channels({ team }) {
    const location = useLocation();
    const { userData } = useContext(AppContext);
    const [currentTeam, setCurrentTeam] = useState(team || location.state?.team);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [channels, setChannels] = useState([]);
    const [channelUpdated, setChannelUpdated] = useState(false);

    useEffect(() => {

        if (!team) {
            const savedTeam = localStorage.getItem('selectedTeam');

            if (savedTeam) {
                try {
                    setCurrentTeam(JSON.parse(savedTeam));
                } catch (error) {
                    console.error("Failed to parse team from localStorage", error);
                }
            }
        } else {
            setCurrentTeam(team || location.state?.team);
        }
    }, [location.state, team]);

    useEffect(() => {
        const loadChannels = async () => {
            try {
                if (userData && userData.username) {
                    const allChannels = await getUserChannels(userData.username);
                    const listChannels = await getChannelsInfoById(allChannels);
                    const relevantChannels = listChannels.filter((ch) => ch.team === currentTeam.id);
                    setChannels(relevantChannels);
                }
            } catch (e) {
                console.error("Error loading Channels", e);
            }
        };
        loadChannels()
    }, [userData, currentTeam, channelUpdated]);

    const handleChannelCreated = () => {
        setChannelUpdated(prev => !prev);
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
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Text Channels</h3>
                <button
                    onClick={handleCreateChannelClick}
                    className="p-2 bg-gray-600 text-white rounded"
                >
                    +
                </button>
            </div>
            <div className="space-y-2">
                {channels.length > 0 &&
                    (channels?.map((ch) => (
                        <button key={ch.id} className="w-full p-2 text-left bg-gray-700 rounded-md hover:bg-gray-600"># {ch.name}</button>
                    )))}
            </div>
            {isPopupOpen && <CreateChannel team={currentTeam} onClose={handleClosePopup} onChannelCreated={handleChannelCreated} />}
        </div>
    );
}

Channels.propTypes = {
    team: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string,
        createdOn: PropTypes.string,
        id: PropTypes.string,
        members: PropTypes.arrayOf(PropTypes.string),
    }),
};