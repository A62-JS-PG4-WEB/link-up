import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Team from '../Team/Team';
import TextChannelsSection from '../../components/TextChannelsSection/TextChannelsSection';
import VoiceChannels from '../../components/VoiceChannels/VoiceChannels';
import Chat from '../../components/Chat/Chat';
import SideNav from '../../components/SideNav/SideNav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home({ team }) {
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        const savedChat = sessionStorage.getItem('selectedChat');
        if (savedChat) {
            try {
                setSelectedChat(JSON.parse(savedChat));
            } catch (error) {
                toast.error(`Failed to parse chat from localStorage: ${error}`);
            }
        }
    }, []);

    const handleSelectChannel = (channel) => {
        setSelectedChat(channel);
        try {
            sessionStorage.setItem('selectedChat', JSON.stringify(channel));
        } catch (error) {
            toast.error(`Failed to save chat to localStorage: ${error}`);
        }
    };

    return (
        <div className="home">
            <SideNav />
            <div className="flex h-screen content">
                {/* Main Content */}
                <div className="flex-1 flex p-8 text-white">
                    <div className="w-1/8 space-y-3">
                        <Team team={team} onClose={() => setSelectedChat(null)} />
                        {/* Text Channels */}
                        <TextChannelsSection team={team} onSelectChannel={handleSelectChannel} />
                        {/* Voice Channels */}
                        <VoiceChannels team={team} />
                    </div>
                    {/* Chat Section */}
                    {/* Messages Container */}
                    <div className="flex-1">
                        {selectedChat ? (
                            <Chat channel={selectedChat} onClose={() => setSelectedChat(null)} />
                        ) : (
                            <div className="text-white">Please select a channel to start chatting.</div>
                        )}
                    </div>
                </div>
            </div>
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
    }),
};