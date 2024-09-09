import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Team from '../Team/Team';
import TextChannelsSection from '../../components/TextChannelsSection/TextChannelsSection';
import Chat from '../../components/Chat/Chat';
import SideNav from '../../components/SideNav/SideNav';
import DirectMessages from '../../components/DirectMessages/DirectMessages.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import CreateDirectMessages from '../CreateDirectMessages/CreateDirectMessages.jsx';
import SearchUser from '../../components/SearchUser/SearchUser.jsx';
import ChatDirectMessages from '../../components/ChatDirectMessages/ChatDirectMessages.jsx'


export default function Home({ team }) {
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedDirectMessage, setSelectedDirectMessage] = useState(null);

    useEffect(() => {
        const savedChat = sessionStorage.getItem('selectedChat');
        const savedDM = sessionStorage.getItem('selectedDirectMessage');

        if (savedChat) {
            try {
                setSelectedChat(JSON.parse(savedChat));
            } catch (error) {
                toast.error(`Failed to parse chat from sessionStorage: ${error}`);
            }
        }

        if (savedDM) {
            try {
                setSelectedDirectMessage(JSON.parse(savedDM));
            } catch (error) {
                toast.error(`Failed to parse direct message from sessionStorage: ${error}`);
            }
        }
    }, []);

    const handleSelectChannel = (channel) => {
        setSelectedChat(channel);
        setSelectedDirectMessage(null); // Clear selected DM when switching to a channel
        try {
            sessionStorage.setItem('selectedChat', JSON.stringify(channel));
            sessionStorage.removeItem('selectedDirectMessage');
        } catch (error) {
            toast.error(`Failed to save channel to sessionStorage: ${error}`);
        }
    };

    const handleSelectDirectMessage = (directMessage) => {
        setSelectedDirectMessage(directMessage);
        setSelectedChat(null); // Clear selected chat when switching to a DM
        try {
            sessionStorage.setItem('selectedDirectMessage', JSON.stringify(directMessage));
            sessionStorage.removeItem('selectedChat');
        } catch (error) {
            toast.error(`Failed to save direct message to sessionStorage: ${error}`);
        }
    };

    const handleDirectMessageCreated = () => {
        // Refresh the direct messages list after creation
    };

    const handleCloseChat = () => {
        setSelectedChat(null);
        setSelectedDirectMessage(null);
        sessionStorage.removeItem('selectedChat');
        sessionStorage.removeItem('selectedDirectMessage');
    };

    return (
        <div className="home-container flex">
            {/* Left Sidebar */}
            <div className="w-1/5 space-y-3">
                <Team team={team} onClose={handleCloseChat} />
                <TextChannelsSection team={team} onSelectChannel={handleSelectChannel} />
                <DirectMessages onSelectDirectMessage={handleSelectDirectMessage} />
                <SearchUser
                    onDirectMessageCreated={handleDirectMessageCreated}
                    onSelectDirectMessage={handleSelectDirectMessage}
                />
            </div>

            {/* Chat Section */}
            <div className="flex-1">
                {selectedChat ? (
                    <Chat channel={selectedChat} onClose={handleCloseChat} />
                ) : selectedDirectMessage ? (
                    <ChatDirectMessages directMessageUser={selectedDirectMessage} onClose={handleCloseChat} />
                ) : (
                    <div className="text-white">Please select a channel or direct message to start chatting.</div>
                )}
            </div>

            <ToastContainer />
        </div>
    );
}

Home.propTypes = {
    team: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string,
        id: PropTypes.string,
        createdOn: PropTypes.string,
        members: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
};