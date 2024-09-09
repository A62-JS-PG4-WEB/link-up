import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from "react";
import { AppContext } from '../../state/app.context';
import { deleteMessage, getMessageInfo, sendMessage, sentMessageSaveInChannels, updateMessage } from '../../services/chat.service';
import { getChannelsMembersByID } from '../../services/channels.service';
import { db } from '../../config/firebase-config';
import { get, onValue, ref } from 'firebase/database';
import { ChannelInfo } from '../ChannelInfo/ChannelInfo';
import GifSelector from '../GifSelector/GifSelector';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Chat/Chat.css'
import { getLastMessage, getUserTimestamp, lastSentMessage, updateUserTimestamp } from '../../services/users.service';

export default function Chat({ channel, onClose }) {
    const { userData } = useContext(AppContext);
    const [currentChat, setCurrentChat] = useState(channel || location.state?.channel);
    const [currentTeam, setCurrentTeam] = useState([]);
    const [message, setMessage] = useState({ message: '', gif: '' });
    const [currentMessages, setCurrentMessages] = useState([]);
    const [photoUrls, setPhotoUrls] = useState({});
    const [isChannelInfoVisible, setIsChannelInfoVisible] = useState(false);
    const [isGifSelectorVisible, setIsGifSelectorVisible] = useState(false);
    const [readMessages, setReadMessages] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState([]);
    const [lastMessageSent, setLastMessageSent] = useState('');
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingMessageContent, setEditingMessageContent] = useState('');

    useEffect(() => {
        if (channel) {

            setCurrentChat(channel);
        }
    }, [channel]);

    useEffect(() => {

        const loadLastMessage = async () => {
            const lastMessageId = await getLastMessage(userData.username, currentChat.id);
            setLastMessageSent(lastMessageId);
        }
        loadLastMessage();
    });

    useEffect(() => {
        const savedTeam = localStorage.getItem('selectedTeam');
        setCurrentTeam(JSON.parse(savedTeam));

        if (currentChat) {

            const messagesRef = ref(db, `channels/${currentChat.id}/messages`);

            const unsubscribe = onValue(messagesRef, async (snapshot) => {
                const messagesData = snapshot.val();
                if (messagesData) {
                    try {
                        const messageIds = Object.keys(messagesData);
                        const detailedMessages = await getMessageInfo(messageIds);
                        const userTimestamp = await getUserTimestamp(currentChat.id, userData.username)
                        const allReadMessages = detailedMessages.filter((m) => m.createdOn <= userTimestamp);
                        const allUnreadMessages = detailedMessages.filter((m) => m.createdOn > userTimestamp);

                        detailedMessages.map((m) => console.log(m.createdOn < userTimestamp));
                        console.log('read', allReadMessages);
                        console.log('unread', allUnreadMessages);

                        setReadMessages(allReadMessages);
                        setUnreadMessages(allUnreadMessages);
                        setCurrentMessages(detailedMessages);
                        await updateUserTimestamp(currentChat.id, userData.username)

                        //   if(unreadMessages.length > 0 ) {
                        //     const lastMessageTime = (unreadMessages[unreadMessages.length-1]);
                        //     console.log(lastMessageTime.createdOn);

                        //     await updateUserTimestamp(currentChat.id, userData.username, lastMessageTime.createdOn )
                        //   }

                    } catch (error) {
                        toast.error(`Failed to load messages: ${error}`);
                    }
                } else {
                    setCurrentMessages([]);
                }
            });

            return () => unsubscribe();
        }
    }, [currentChat]);

    useEffect(() => {
        const chatContainer = document.querySelector('.chat-container');
        const firstUnreadMessage = document.querySelector('.unread-message');

        if (firstUnreadMessage) {
            firstUnreadMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (chatContainer) {
            chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [currentMessages]);

    useEffect(() => {
        const fetchPhotoUrls = async () => {
            const newPhotoUrls = {};
            for (let message of currentMessages) {
                if (!photoUrls[message.senderUsername]) {
                    const url = await takeSenderPhoto(message.senderUsername);
                    newPhotoUrls[message.senderUsername] = url;
                }
            }
            setPhotoUrls(prev => ({ ...prev, ...newPhotoUrls }));
        };

        fetchPhotoUrls();
    }, [currentMessages]);

    const handleMessageChange = (key, value) => {
        setMessage({
            ...message,
            [key]: value,
        });
        if (key === 'gif') {
            setIsGifSelectorVisible(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        try {

            if (!(message.message || message.gif)) {
                return toast.warn("Message can not be empty!")
            }
            const sentMessage = {
                ...message,
                teamID: currentTeam.id,
                channelId: currentChat.id,
                senderUsername: userData.username,
                createdOn: new Date().getTime(),
            };

            const messageId = await sendMessage(sentMessage);
            await sentMessageSaveInChannels(currentChat.id, messageId);
            await getChannelsMembersByID(currentChat.id);
            await lastSentMessage(userData.username, currentChat.id, messageId)

            setCurrentMessages([...currentMessages, sentMessage]);
            setLastMessageSent(messageId)

            setMessage({ message: '' });
        } catch (error) {
            toast.error(`Message not sent: ${error}`);
        }
    };

    const takeSenderPhoto = async (senderUsername) => {
        try {
            const snapshot = await get(ref(db, `users/${senderUsername}/photoURL`));
            return snapshot.val() || null;
        } catch (error) {
            toast.error(`Error fetching user photo: ${error}`);
            return null;
        }
    }

    const openPopUpChannelInfo = () => {
        setIsChannelInfoVisible(true);
    };

    const closePopUpChannelInfo = () => {
        setIsChannelInfoVisible(false);
    };

    const handleCloseChat = () => {
        sessionStorage.removeItem('selectedChat');
        if (typeof onClose === 'function') {
            onClose();
        }
    }

    const handleEditMessage = (messageId, messageContent) => {
        setEditingMessageId(messageId);
        console.log(messageId);
        setEditingMessageContent(messageContent);
        console.log(messageContent);
    };

    const handleChange = (e) => {
        setEditingMessageContent(e.target.value);
    };

    const handleUpdateMessage = async (e) => {
        e.preventDefault();
        try {

            if (!editingMessageContent) {
                return toast.warn("Message cannot be empty!");
            }

            await updateMessage(editingMessageId, editingMessageContent);
            const isInUnreadMessages = unreadMessages.some(m => m.id === editingMessageId);

            if (isInUnreadMessages) {
                const updatedUnreadMessages = unreadMessages.map(m =>
                    m.id === editingMessageId ? { ...m, message: editingMessageContent } : m
                );
                setUnreadMessages(updatedUnreadMessages);
            } else {
                const updatedReadMessages = readMessages.map(m =>
                    m.id === editingMessageId ? { ...m, message: editingMessageContent } : m
                );
                setReadMessages(updatedReadMessages);
            }

            setEditingMessageId(null);
            setEditingMessageContent('');
        } catch (error) {
            toast.error(`Failed to update message: ${error}`);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        const confirmation = window.confirm('Are you sure you want to permanently delete message?');

        if (confirmation) {
            try {
                await deleteMessage(userData.username, currentChat.id, messageId);
                const updatedMessages = currentMessages.filter(m => m.id !== messageId);
                setCurrentMessages(updatedMessages);
            } catch (error) {
                toast.error(`Failed to delete message: ${error}`);
            }

        }
        setEditingMessageId(null);
        setEditingMessageContent('');
    };

    const toggleGifSelector = () => {
        setIsGifSelectorVisible(!isGifSelectorVisible);
    };

    return (
        <div className="flex-1 bg-gray-800 p-6 rounded-lg flex flex-col ml-6 mt-7 h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-4">
                <button className=" text-white py-2 px-4 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={openPopUpChannelInfo}>
                    <h1 className="text-2xl font-bold text-white">
                        # {currentChat && (currentChat?.name).toLowerCase() || "Loading..."} ^
                    </h1>
                </button>
                <div className="flex justify-between items-center">
                    <div>
                        <button
                            onClick={handleCloseChat}
                            className="text-white hover:text-red-800 text-4xl focus:outline-none"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            </div>
            {/* Chat messages container */}
            <div className="flex-1 bg-gray-700 p-4 rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {/* <ChatView channel={currentChat}/> */}
                <div className="chat-container">
                    {readMessages.map((m, index) => {
                        const showDateSeparator =
                            index === 0 ||
                            new Date(readMessages[index - 1].createdOn).toDateString() !== new Date(m.createdOn).toDateString();

                        return (
                            <div key={m.id}>
                                {/* Date separator */}
                                {showDateSeparator && (
                                    <div className="date-separator text-center my-2 text-gray-500">
                                        {new Date(m.createdOn).toLocaleDateString()}
                                    </div>
                                )}
                                {/* User message */}
                                {m.senderUsername === userData.username ? (
                                    <div className="chat chat-end mb-4">
                                        <div className="chat-image avatar"></div>
                                        <div className="chat-header">
                                            me
                                            <time className="text-xs opacity-50 ml-1">
                                                {new Date(m.createdOn).toLocaleTimeString()}
                                            </time>
                                        </div>
                                        <div className="chat-bubble">
                                            {editingMessageId === m.id ? (
                                                <form onSubmit={handleUpdateMessage}>
                                                    <input
                                                        type="text"
                                                        value={editingMessageContent}
                                                        onChange={handleChange}
                                                        className="w-full p-1.5 bg-gray-700 text-white rounded-md border border-gray-600 placeholder-gray-400 focus:ring-2"
                                                    />
                                                    <div>
                                                        <button
                                                            type="submit"
                                                            className="mt-2 px-3  bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 focus:ring-2 focus:ring-indigo-400"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className='text-red-500 px-8'
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDeleteMessage(m.id)
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingMessageId(null)}
                                                            className="text-white hover:text-red-500  p-2 rounded-full"
                                                            aria-label="Close"
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    {m.message && <div>{m.message}</div>}
                                                    {m.gif && <div className="gif-container"><img src={m.gif} alt="GIF" /></div>}
                                                </>
                                            )}
                                        </div>
                                        {lastMessageSent &&
                                            (lastMessageSent === m.id && <button
                                                className='text-white'
                                                onClick={() => handleEditMessage(m.id, m.message)}
                                            >
                                                Edit
                                            </button>)}
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
                                        <div className="chat-bubble">
                                            {m.message && <div>{m.message}</div>}
                                            {m.gif && <div className="gif-container-receiver"><img src={m.gif} alt="GIF" /></div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {unreadMessages.length > 0 && (
                        <>
                            <div className="unread-separator text-center my-1 py-1 text-gray-200 rounded-lg">
                                <h1 className="unread-message">New messages</h1>
                            </div>
                            {unreadMessages.map((m, index) => {
                                const showDateSeparator =
                                    index === 0 ||
                                    new Date(unreadMessages[index - 1].createdOn).toDateString() !== new Date(m.createdOn).toDateString();

                                return (
                                    <div key={m.id}>
                                        {/* Date separator */}
                                        {showDateSeparator && (
                                            <div className="date-separator text-center my-2 text-gray-500">
                                                {new Date(m.createdOn).toLocaleDateString()}
                                            </div>
                                        )}
                                        {/* User message */}
                                        {m.senderUsername === userData.username ? (
                                            <div className="chat chat-end mb-4">
                                                <div className="chat-image avatar"></div>
                                                <div className="chat-header">
                                                    me
                                                    <time className="text-xs opacity-50 ml-1">
                                                        {new Date(m.createdOn).toLocaleTimeString()}
                                                    </time>
                                                </div>
                                                <div className="chat-bubble">
                                                    {editingMessageId === m.id ? (
                                                        <form onSubmit={handleUpdateMessage}>
                                                            <input
                                                                type="text"
                                                                value={editingMessageContent}
                                                                onChange={handleChange}
                                                                className="w-full p-1.5 bg-gray-700 text-white rounded-md border border-gray-600 placeholder-gray-400 focus:ring-2"
                                                            />
                                                            <div>
                                                                <button
                                                                    type="submit"
                                                                    className="mt-2 px-3  bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 focus:ring-2 focus:ring-indigo-400"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className='text-red-500 px-8'
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDeleteMessage(m.id)
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setEditingMessageId(null)}
                                                                    className="text-white hover:text-red-500  p-2 rounded-full"
                                                                    aria-label="Close"
                                                                >
                                                                    &times;
                                                                </button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <>
                                                            {m.message && <div>{m.message}</div>}
                                                            {m.gif && <div className="gif-container"><img src={m.gif} alt="GIF" /></div>}
                                                        </>
                                                    )}
                                                </div>
                                                {lastMessageSent &&
                                                    (lastMessageSent === m.id && <button
                                                        className='text-white'
                                                        onClick={() => handleEditMessage(m.id, m.message)}
                                                    >
                                                        Edit
                                                    </button>)}
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
                                                <div className="chat-bubble">
                                                    {m.message && <div>{m.message}</div>}
                                                    {m.gif && <div className="gif-container-receiver"><img src={m.gif} alt="GIF" /></div>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>
            {/* Input area */}
            <form onSubmit={handleSendMessage} className="space-y-6 mt-4">
                <div className="mt-4 flex items-center space-x-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full p-4 rounded-lg bg-gray-600 text-white outline-none focus:ring-2 focus:ring-indigo-500 pr-20"
                            value={message.message}
                            onChange={(e) => handleMessageChange('message', e.target.value)}
                        />
                        {message.gif && (
                            <div className="absolute right-0 top-0 h-full flex items-center pr-4">
                                <img src={message.gif} alt="Selected GIF" className="w-12 h-12 object-cover rounded-lg" />
                                <button
                                    type="button"
                                    className="text-red-500 ml-2"
                                    onClick={() => handleMessageChange('gif', '')}
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        className="p-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out"
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
                <GifSelector onSelect={(url) => handleMessageChange('gif', url)} />
            )}

            {isChannelInfoVisible && (
                <ChannelInfo onClose={closePopUpChannelInfo} chat={currentChat} />
            )}
        </div>

    );

}

Chat.propTypes = {
    channel: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};

