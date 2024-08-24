import React from 'react';
import PropTypes from 'prop-types';
import Team from '../Team/Team';
import ChannelsSection from '../ChannelsSection/ChannelsSection';

export default function SideBar({ team }) {
    return (
        <div className="w-1/4 space-y-6 p-8 bg-gray-900 text-white">
            {/* Team Component */}
            <Team team={team} />

            {/* Channels Section */}
            <ChannelsSection />
        </div>
    );
}

SideBar.propTypes = {
    team: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string,
        createdOn: PropTypes.string,
        members: PropTypes.arrayOf(PropTypes.string),
    }),
};
