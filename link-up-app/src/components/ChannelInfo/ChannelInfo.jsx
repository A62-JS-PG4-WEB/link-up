import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { getTeamInfoById } from "../../services/teams.service";
import { capitalizeFirstLetter, getChannelsMembersByID, leaveChannel } from "../../services/channels.service";
import AddChannelMembers from "../../views/AddChannelMembers/AddChannelMembers";
import { AppContext } from "../../state/app.context";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function ChannelInfo({ channel, onClose }) {
    const { userData } = useContext(AppContext);
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
                    console.error(`Failed to parse chat from localStorage ${error}`);
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
                    setChatInTeam(capitalizeFirstLetter(team.name));
                } catch (error) {
                    console.error(error);
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

                    setChatInTeam(capitalizeFirstLetter(team.name));
                    setMembers(chMembers);

                } catch (error) {
                    console.error(error);
                }
            };
            loadMembers();
        }
    }, [currentChat]);

    useEffect(() => {
    }, [chatInTeam]);

    const handleAddClick = () => {
        setIsPopupOpen(true);
    };

    const handleLeaveChannel = async () => {

        const confirmation = window.confirm('You sure you wanna leave chat?');
        if (confirmation) {
            await leaveChannel(userData.username, currentChat.id, currentChat.name)
        }
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="flex flex-col bg-gray-800 p-6 rounded-lg max-w-3xl w-[500px] h-[450px] relative">
            <div className="flex items-center justify-between mb-4 mt-3">
                <h2 className="text-xl font-bold text-white">Channel Information</h2>
                <button
                    className="text-white hover:text-red-800 text-3xl focus:outline-none"
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>
            <div className="flex-grow mt-4">
                <p className="text-white mb-2">Chat Name: <strong># {currentChat?.name.toLowerCase()}</strong></p>
                <p className="text-white mb-4">Team: <strong>{chatInTeam}</strong></p>
                <div className="flex items-center justify-between mb-4">
                    <p className="mt-3 text-lg font-bold text-white flex-grow text-center">Chat Members:</p>
                    <button
                        className="ml-auto bg-indigo-500 text-white mt-3 py-1 px-4 rounded-lg hover:bg-indigo-400 focus:outline-none focus:ring-2 transition-all"
                        onClick={handleAddClick}
                    >
                        Add
                    </button>
                    {isPopupOpen && (
                        <AddChannelMembers onClose={handleClosePopup} team={currentChat} />
                    )}

                </div>
                <ul className="max-h-25 overflow-y-auto mb-4">
                    {members.length > 0 ? (
                        members.map((m, index) => (
                            <li key={index} className="rounded-sm  p-0.5">
                                <p className="text-lg font-semibold text-white">{m}</p>
                            </li>
                        ))
                    ) : (
                        <p className=" text-white">No members found</p>
                    )}
                </ul>
            </div>
            <div className="flex justify-center mt-4"
                onClick={handleLeaveChannel}>
                <button className="ml-auto text-white hover:text-red-800 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-box-arrow-right inline-block mr-2" viewBox="0 0 16 16">
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