import Channels from "../Channels/Channels"
import PropTypes from 'prop-types';

export default function TextChannelsSection({ team, onSelectChannel  }) {
    return (
        <>
            <div className="bg-gray-800 p-4 rounded-lg">
            <Channels team={team} onSelectChannel={onSelectChannel} />
            </div>
        </>

    )
}
TextChannelsSection.propTypes = {
    team: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string,
        id: PropTypes.string,
        createdOn: PropTypes.string,
        members: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    onSelectChannel: PropTypes.func.isRequired,
};