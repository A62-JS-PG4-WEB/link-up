import { useLocation, useParams } from "react-router-dom";
import PropTypes from 'prop-types';

export default function Chat({channel}) {
    // const { channelId } = useParams();
    // const location = useLocation();
    // const { channel } = location.state || {};

    return (
        <div className="flex-1 bg-gray-800 p-6 rounded-lg flex flex-col ml-6 mt-7">
            <h1 className="text-2xl font-bold mb-4 text-white">{channel?.name || "Loading..."}</h1>

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
    )
}

Chat.propTypes = {
    channel: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
};