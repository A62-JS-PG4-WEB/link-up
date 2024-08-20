import React, { useState } from 'react';
import SideNav from '../../components/SideNav/SideNav';

export default function Home() {
    return (
        <div className="flex">
            <SideNav />

            <div className="flex-1 p-8 bg-gray-900 text-white space-x-6">
                <div className="w-1/4 space-y-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Text Channels</h3>
                        <div className="space-y-2">
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
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-gray-800 p-6 rounded-lg flex flex-col">
                    <h1 className="text-2xl font-bold mb-4">Chat Team Name</h1>

                    {/* Messages Container */}
                    <div className="flex-1 bg-gray-700 p-4 rounded-lg overflow-y-auto flex flex-col-reverse">
                        {/* Chat messages will go here */}
                        <p className="text-gray-300">This is where the chat messages will be displayed.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
