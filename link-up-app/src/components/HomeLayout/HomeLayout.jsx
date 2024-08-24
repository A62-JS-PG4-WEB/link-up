import React from 'react';
import PropTypes from 'prop-types';
import ChatSection from '../ChatSection/ChatSection';
import SideBar from '../Sidebar/Sidebar';

export default function HomeLayout({ team }) {
    return (
        <div className="flex h-screen content">
            {/* Sidebar */}
            <SideBar team={team} />

            {/* Chat Section */}
            <ChatSection team={team} />
        </div>
    );
}

HomeLayout.propTypes = {
    team: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string,
        createdOn: PropTypes.string,
        members: PropTypes.arrayOf(PropTypes.string),
    }),
};
