import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Channels from '../Channels/Channels';
import Team from '../../components/Team/Team';

export default function Home({ team }) {

    return (
        <div className="flex h-screen content">

            {/* Main Content */}
            <div className="flex-1 flex p-8 bg-gray-900 text-white">
                <div className="w-1/4 space-y-6">
                    <Team team={team} />
                    {/* Text Channels */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Text Channels</h3>
                        <div className="space-y-2">
                            <Channels team={team} />
                            <button className="w-full p-2 text-left bg-gray-700 rounded-md hover:bg-gray-600"># general</button>
                            <button className="w-full p-2 text-left bg-gray-700 rounded-md hover:bg-gray-600"># memes</button>
                            <button className="w-full p-2 text-left bg-gray-700 rounded-md hover:bg-gray-600"># announcements</button>
                        </div>
                    </div>

                    {/* Voice Channels */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Voice Channels</h3>
                        <div className="space-y-2">
                            <button className="w-full p-2 text-left bg-gray-700 rounded-md hover:bg-gray-600">🔊 General</button>
                            <button className="w-full p-2 text-left bg-gray-700 rounded-md hover:bg-gray-600">🔊 Gaming</button>
                            <button className="w-full p-2 text-left bg-gray-700 rounded-md hover:bg-gray-600">🔊 Music</button>
                        </div>
                    </div>
                </div>

                {/* Chat Section */}
                <div className="flex-1 bg-gray-800 p-6 rounded-lg flex flex-col ml-6 mt-7">
                    {/* Chat Team Name */}
                    <h1 className="text-2xl font-bold mb-4">Star Wars</h1>

                    {/* Messages Container */}
                    <div className="flex-1 bg-gray-700 p-4 rounded-lg overflow-y-auto">
                        <div className="chat chat-start">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS chat bubble component"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                            </div>
                            <div className="chat-header">
                                Obi-Wan Kenobi
                                <time className="text-xs opacity-50">12:45</time>
                            </div>
                            <div className="chat-bubble">You were the Chosen One!</div>
                            <div className="chat-footer opacity-50">Delivered</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS chat bubble component"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                            </div>
                            <div className="chat-header">
                                Anakin
                                <time className="text-xs opacity-50">12:46</time>
                            </div>
                            <div className="chat-bubble">I hate you!</div>
                            <div className="chat-footer opacity-50">Seen at 12:46</div>
                        </div>
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
        createdOn: PropTypes.string,
        members: PropTypes.arrayOf(PropTypes.string),
    }),
};