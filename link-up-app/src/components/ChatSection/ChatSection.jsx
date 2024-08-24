import React from 'react';
import PropTypes from 'prop-types';
import ChatMessages from '../ChatMessages/ChatMessages';

export default function ChatSection({ team }) {
    return (
        <div className="flex-1 bg-gray-800 p-6 rounded-lg flex flex-col ml-6 mt-7">
            {/* Chat Team Name */}
            <h1 className="text-2xl font-bold mb-4">{team.name}</h1>

            {/* Messages Container */}
            <ChatMessages />
        </div>
    );
}

ChatSection.propTypes = {
    team: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }),
};
