import React from 'react';
import Channels from "../../views/Channels/Channels"

export default function ChannelsSection() {
    return (
        <>
            {/* Text Channels */}
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Text Channels</h3>
                <div className="space-y-2">
                    <Channels />
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
        </>
    );
}
