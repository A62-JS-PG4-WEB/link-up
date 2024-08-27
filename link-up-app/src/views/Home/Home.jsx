import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Channels from '../../components/Channels/Channels';
import Team from '../Team/Team';
import TextChannelsSection from '../../components/TextChannelsSection/TextChannelsSection';
import VoiceChannels from '../../components/VoiceChannels/VoiceChannels';
import Chat from '../../components/Chat/Chat';

export default function Home({ team }) {
    const [selectedChannel, setSelectedChannel] = useState(null);

    return (
        <div className="flex h-screen content">

            {/* Main Content */}
            <div className="flex-1 flex p-8 bg-gray-900 text-white">
                <div className="w-1/4 space-y-6">
                    <Team team={team} />
                    {/* Text Channels */}
                 <TextChannelsSection team={team} onSelectChannel={setSelectedChannel} />

                    {/* Voice Channels */}
                    <VoiceChannels team={team} />
                </div>

                {/* Chat Section */}
            
                    {/* Messages Container */}
                  <div className="flex-1">
                    {selectedChannel ? (
                        <Chat channel={selectedChannel} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Select a channel to start chatting
                        </div>
                    )}
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