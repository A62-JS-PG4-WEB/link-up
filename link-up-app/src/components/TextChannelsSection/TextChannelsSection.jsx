import Channels from "../Channels/Channels"
import PropTypes from 'prop-types';

/**
 * A section component that displays the list of text channels for the provided team.
 *
 * It utilizes the `Channels` component to render the channels and pass the selected channel
 * back to the parent through `onSelectChannel`.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.team - The current team object.
 * @param {string} props.team.name - The name of the team.
 * @param {string} props.team.owner - The owner of the team.
 * @param {string} props.team.id - The ID of the team.
 * @param {string} props.team.createdOn - The date the team was created.
 * @param {Array<string>} props.team.members - The members of the team.
 * @param {Function} props.onSelectChannel - Function to handle selecting a channel.
 * @returns {JSX.Element} The rendered component.
 */
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