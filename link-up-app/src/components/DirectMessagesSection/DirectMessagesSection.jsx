import DirectMessages from "../DirectMessages/DirectMessages";
import PropTypes from 'prop-types';

export default function DirectMessagesSection({ team, onSelectDirectMessage }) {
    return (
        <>
            <div className="bg-gray-800 p-4 rounded-lg">
                <DirectMessages team={team} onSelectDirectMessage={onSelectDirectMessage} />
            </div>
        </>
    );
}

DirectMessagesSection.propTypes = {
    team: PropTypes.shape({
        name: PropTypes.string.isRequired,
        owner: PropTypes.string,
        id: PropTypes.string,
        createdOn: PropTypes.string,
        members: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    onSelectDirectMessage: PropTypes.func.isRequired,
};