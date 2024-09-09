import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from "react";
import { AppContext } from '../../state/app.context';
import { getMessageInfo, sendMessage, setMsgStatusForEachUser } from '../../services/chat.service';
import { db } from '../../config/firebase-config';
import { get, onValue, ref } from 'firebase/database';
import GifSelector from '../GifSelector/GifSelector';

export default function ChatDirectMessages({ directMessageUser, onClose }) {
    const { userData } = useContext(AppContext);
    const [currentDM, setCurrentDM] = useState(directMessageUser);
    const [message, setMessage] = useState({ message: '' });
    const [currentMessages, setCurrentMessages] = useState([]);
    const [photoUrls, setPhotoUrls] = useState({});
    const [isGifSelectorVisible, setIsGifSelectorVisible] = useState(false);

    useEffect(() => {
        if (directMessageUser) {
            setCurrentDM(directMessageUser);
        }
    }, [directMessageUser]);

    useEffect(() => {
        if (currentDM) {
            const messagesRef = ref(db, `directMessages/${userData.username}/${currentDM.username}/messages`);

            const unsubscribe = onValue(messagesRef, async (snapshot) => {
                const messagesData = snapshot.val();
                if (messagesData) {
                    try {
                        const messageIds = Object.keys(messagesData);
                        const detailedMessages = await getMessageInfo(messageIds);
                        setCurrentMessages(detailedMessages);
                    } catch (error) {
                        console.error("Failed to load messages", error);
                    }
                } else {
                    setCurrentMessages([]);
                }
            });

            return () => unsubscribe();
        }
    }, [currentDM]);

    useEffect(() => {
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [currentMessages]);

    const createMessage = (key, value) => {
        if (message[key] !== value) {
            setMessage({
                ...message,
                [key]: value,
            });
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!message.message) {
            return alert("Message cannot be empty!");
        }

        try {
            const sentMessage = {
                ...message,
                from: userData.username,
                to: currentDM.username,
                createdOn: new Date().getTime(),
            };

            const messageId = await sendMessage(sentMessage, `directMessages/${userData.username}/${currentDM.username}`);
            await sendMessage(sentMessage, `directMessages/${currentDM.username}/${userData.username}`);

            await setMsgStatusForEachUser([userData.username, currentDM.username], messageId);

            setCurrentMessages([...currentMessages, sentMessage]);
            setMessage({ message: '' });
        } catch (error) {
            console.error('Message not sent', error);
        }
    };

    const takeSenderPhoto = async (senderUsername) => {
        try {
            const snapshot = await get(ref(db, `users/${senderUsername}/photoURL`));
            return snapshot.val() || null;
        } catch (error) {
            console.error('Error fetching user photo:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchPhotoUrls = async () => {
            const newPhotoUrls = {};
            for (let message of currentMessages) {
                if (!photoUrls[message.senderUsername]) {
                    const url = await takeSenderPhoto(message.senderUsername);
                    newPhotoUrls[message.senderUsername] = url;
                }
            }
            setPhotoUrls((prev) => ({ ...prev, ...newPhotoUrls }));
        };

        fetchPhotoUrls();
    }, [currentMessages]);

    const handleSelectGif = (gifUrl) => {
        setMessage({
            ...message,
            message: gifUrl,
        });
        setIsGifSelectorVisible(false);
    };

    const toggleGifSelector = () => {
        setIsGifSelectorVisible(!isGifSelectorVisible);
    };

    const handleCloseChat = () => {
        sessionStorage.removeItem('selectedDM');
        if (typeof onClose === 'function') {
            onClose();
        }
    };

    return (
        <div className="flex-1 bg-gray-800 p-6 rounded-lg flex flex-col ml-6 mt-7 h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-white">
                    Direct Message with {currentDM?.username || "Loading..."}
                </h1>
                <button
                    onClick={handleCloseChat}
                    className="text-white hover:text-red-800 text-4xl focus:outline-none"
                >
                    &times;
                </button>
            </div>

            <div className="flex-1 bg-gray-700 p-4 rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <div className="chat-container">
                    {currentMessages.map((m, index) => {
                        const showDateSeparator =
                            index === 0 ||
                            new Date(currentMessages[index - 1].createdOn).toDateString() !== new Date(m.createdOn).toDateString();
                        return (
                            <div key={m.id}>
                                {showDateSeparator && (
                                    <div className="date-separator text-center my-2 text-gray-500">
                                        {new Date(m.createdOn).toLocaleDateString()}
                                    </div>
                                )}
                                {m.senderUsername === userData.username ? (
                                    <div className="chat chat-end mb-4">
                                        <div className="chat-header">
                                            Me
                                            <time className="text-xs opacity-50 ml-1">
                                                {new Date(m.createdOn).toLocaleTimeString()}
                                            </time>
                                        </div>
                                        <div className="chat-bubble">{m.message}</div>
                                    </div>
                                ) : (
                                    <div className="chat chat-start">
                                        <div className="chat-image avatar">
                                            <div className="w-10 rounded-full">
                                                {photoUrls[m.senderUsername] ? (
                                                    <img
                                                        alt="User avatar"
                                                        src={photoUrls[m.senderUsername]}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="flex items-center justify-center w-full h-full rounded-full bg-indigo-500 text-white font-bold text-lg">
                                                        {m.senderUsername.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="chat-header">
                                            {m.senderUsername}
                                            <time className="text-xs opacity-50 ml-1">
                                                {new Date(m.createdOn).toLocaleTimeString()}
                                            </time>
                                        </div>
                                        <div className="chat-bubble">{m.message}</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-6 mt-4">
                <div className="mt-4 flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 p-4 rounded-lg bg-gray-600 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        value={message.message}
                        onChange={(e) => createMessage('message', e.target.value)}
                    />
                    <button
                        className="p-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out"
                    >
                        Send
                    </button>
                    <button
                        type="button"
                        onClick={toggleGifSelector}
                        className="p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-500 transition-all ease-in-out"
                    >
                        GIF
                    </button>
                </div>
            </form>

            {isGifSelectorVisible && (
                <GifSelector onSelect={handleSelectGif} />
            )}
        </div>
    );
}

ChatDirectMessages.propTypes = {
    directMessageUser: PropTypes.shape({
        username: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};