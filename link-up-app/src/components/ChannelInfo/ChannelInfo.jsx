import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { getTeamInfoById } from "../../services/teams.service";
<<<<<<< HEAD
import { getChannelsMembersByID } from "../../services/channels.service";
=======
import { getChannelsMembersByID, leaveChannel } from "../../services/channels.service";
import AddChannelMembers from "../../views/AddChannelMembers/AddChannelMembers";
import { AppContext } from "../../state/app.context";
>>>>>>> c2b56b6e0d220124938eec10153426c4b4d9c7d5

export function ChannelInfo({ channel, onClose }) {
    const { userData } = useContext(AppContext);
    const [currentChat, setCurrentChat] = useState(channel || location.state?.channel);
    const [chatInTeam, setChatInTeam] = useState(null);
    const [members, setMembers] = useState([]);
<<<<<<< HEAD
=======
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    
>>>>>>> c2b56b6e0d220124938eec10153426c4b4d9c7d5

    useEffect(() => {
        if (!channel) {
            const savedChat = localStorage.getItem('selectedChat');
            if (savedChat) {
                try {
                    setCurrentChat(JSON.parse(savedChat));
                } catch (error) {
                    console.error("Failed to parse chat from localStorage", error);
                }
            }

        } else {
            setCurrentChat(channel);
        }

    }, [channel]);

    useEffect(() => {
        if (currentChat && currentChat.team) {
            const loadInfo = async () => {
                try {
                    const team = await getTeamInfoById(currentChat.team);
                    setChatInTeam(team.name);
                } catch (error) {
                    console.error("Failed to load team info", error);
                }
            };
            loadInfo();
        }
    }, [currentChat]);


    useEffect(() => {
        if (currentChat) {
            const loadMembers = async () => {
                try {
                    const team = await getTeamInfoById(currentChat.team);
                    const chMembers = await getChannelsMembersByID(currentChat.id);
                    console.log(chMembers);

                    setChatInTeam(team.name);
                    setMembers(chMembers);

                } catch (error) {
                    console.error("Failed to load team info", error);
                }
            };
            loadMembers();
        }
    }, [currentChat]);

    useEffect(() => {
        console.log(chatInTeam);
    }, [chatInTeam]);

    const addMembersInChat = () => {

<<<<<<< HEAD
    }

=======

    };

    const handleAddClick = () => {
        setIsPopupOpen(true);
    };

    const handleLeaveChannel = async () => {

        const confirmation = window.confirm('are you sure you wanna leave chat');
        if (confirmation){
            await leaveChannel(userData.username, currentChat.id)
        }
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

>>>>>>> c2b56b6e0d220124938eec10153426c4b4d9c7d5
    return (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div
            className="flex flex-col bg-gray-800 p-6 rounded-lg max-w-3xl w-full h-[600px] relative flex-grow"
        >
            <div className="flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold mt-3 mb-5">Channel Information</h2> <br />
                    <button className="mr-8 bg-indigo-500 text-white py-0.5 px-2 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 transition-all"
                        onClick={addMembersInChat}>
                        Add Members
                    </button>
<<<<<<< HEAD
=======
                    {isPopupOpen && (
                        <AddChannelMembers onClose={handleClosePopup} team={currentChat} />
                    )}
                    <button
                        className="text-white hover:text-red-800 text-4xl focus:outline-none"
                        onClick={onClose}
                    >
                        &times;
                    </button>
>>>>>>> c2b56b6e0d220124938eec10153426c4b4d9c7d5
                </div>
                <p>Chat Name: <strong>{currentChat?.name}</strong></p><br />
                <p>Team: <strong>{chatInTeam}</strong></p><br />
                <p className="text-lg font-bold text-white">Members:</p>

                <ul className="list-disc pl-6">
                    {members.map((m, index) => (
                        <li key={index}>
                            <p className="text-lg font-semibold">
                                {m}
                            </p>
                        </li>
                    ))}
                </ul><br />

            </div>
            <div className="flex justify-center mt-4"
            onClick={handleLeaveChannel}>
                <button className="ml-auto text-white hover:text-red-800 "> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10 3.5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 15 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5z" />
                    <path fillRule="evenodd" d="M4.854 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .707.707L6.207 7.5H13.5a.5.5 0 0 1 0 1H6.207l2.354 2.354a.5.5 0 1 1-.707.707l-3-3z" />
                </svg>
                    Leave
                </button>
            </div>
        </div>
    </div>
    );
};
ChannelInfo.propTypes = {
    onClose: PropTypes.func.isRequired,
    channel: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.string,
        createdOn: PropTypes.string,
        members: PropTypes.object,
        messages: PropTypes.object,
    }),
};