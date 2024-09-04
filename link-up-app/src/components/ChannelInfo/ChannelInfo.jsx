import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { getTeamInfoById } from "../../services/teams.service";
import { getChannelsMembersByID } from "../../services/channels.service";
import AddChannelMembers from "../../views/AddChannelMembers/AddChannelMembers";

export function ChannelInfo({ channel, onClose }) {
    const [currentChat, setCurrentChat] = useState(channel || location.state?.channel);
    const [chatInTeam, setChatInTeam] = useState(null);
    const [members, setMembers] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        if (!channel) {
            const savedChat = sessionStorage.getItem('selectedChat');
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


    }

    const handleAddClick = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div
            className="flex flex-col bg-gray-800 p-6 rounded-lg max-w-3xl w-full h-[600px] relative flex-grow"
        >
            <div className="flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold mt-3 mb-5">Channel Information</h2> <br />
                    <button className="mr-8 bg-indigo-500 text-white py-0.5 px-2 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 transition-all"
                        onClick={handleAddClick}>
                        Add Members
                    </button>
                    {isPopupOpen && (
                            <AddChannelMembers onClose={handleClosePopup} team={currentChat} />
                        )}
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
            <div className="flex justify-center mt-4">
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Close
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