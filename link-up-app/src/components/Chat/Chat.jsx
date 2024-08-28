import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from "react";
import { AppContext } from '../../state/app.context';
import { getIdsOfMessages, getMessageInfo, sendMessage, sentMessageSaveInChannels, setMsgStatusForEachUser } from '../../services/chat.service';
import { getChannelsMembersByID } from '../../services/channels.service';

export default function Chat({ channel }) {
    const { userData } = useContext(AppContext);
    const [currentChat, setCurrentChat] = useState(channel || location.state?.channel);
    const [currentTeam, setCurrentTeam] = useState([]);
    const [message, setMessage] = useState({ message: '' });
    const [currentMessages, setCurrentMessages ] = useState([]);

    useEffect(() => {
        const savedChat = localStorage.getItem('selectedChat');

        console.log(JSON.parse(savedChat));
        console.log(userData);

        if (savedChat) {
            const loadMessages = async () => {
                try {
                    setCurrentChat(JSON.parse(savedChat));

                    const messageIds = await getIdsOfMessages(currentChat.id);
                    const detailedMessage = await getMessageInfo(messageIds);
                    setCurrentMessages(detailedMessage)
                    console.log(currentMessages);
                    
                } catch (error) {
                    console.error("Failed to parse channel from localStorage", error);
                }
            }

            loadMessages()
        }
    }, [userData, setCurrentChat]);
    
    useEffect(() => {
        const savedChat = localStorage.getItem('selectedChat');

        console.log(JSON.parse(savedChat));
        console.log(userData);

        if (savedChat) {
            const loadMessages = async () => {
                try {
                    setCurrentChat(JSON.parse(savedChat));

                    const messageIds = await getIdsOfMessages(currentChat.id);
                    const detailedMessage = await getMessageInfo(messageIds);
                    setCurrentMessages(detailedMessage)
                    console.log(currentMessages);
                    
                } catch (error) {
                    console.error("Failed to parse channel from localStorage", error);
                }
            }

            loadMessages()
        }
    }, [userData, setCurrentChat]);


    useEffect(() => {
        const savedChat = localStorage.getItem('selectedChat');
        const savedTeam = localStorage.getItem('selectedTeam');
        setCurrentTeam(JSON.parse(savedTeam));

        console.log('CHAT team update LS', JSON.parse(savedTeam));

        if (savedChat) {
            try {
                setCurrentChat(JSON.parse(savedChat));
            } catch (error) {
                console.error("Failed to parse channel from localStorage", error);
            }
        }
    }, []);

    useEffect(() => {
        if (!channel) {
            const savedChat = localStorage.getItem('selectedChat');
            console.log(savedChat);

            if (savedChat) {
                try {
                    setCurrentChat(JSON.parse(savedChat));
                } catch (error) {
                    console.error("Failed to parse channel from localStorage", error);
                }
            }
        } else {
            setCurrentChat(channel || location.state?.channel);
        }
    }, [channel, currentTeam]);

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

        try {

            console.log(message);
            const sentMessage = {
                ...message,
                teamID: currentTeam.id,
                channelId: currentChat.id,
                senderUsername: userData.username,
                createdOn: new Date().getTime(),
            };

            const messageId = await sendMessage(sentMessage);
            const messageInChannelId = await sentMessageSaveInChannels(currentChat.id, messageId);
            const members = await getChannelsMembersByID(currentChat.id);
            const messageStatus = await setMsgStatusForEachUser(members, messageId);
            setCurrentMessages([...currentMessages, sentMessage]);

            setMessage({ message: '' });

        } catch (error) {
            console.error(error.message);
        }
    };

    // console.log('TEAM ID', currentTeam.id);
    // console.log('CHANNEL TEAM ID', currentChat.team);


    return (
        <div className="flex-1 bg-gray-800 p-6 rounded-lg flex flex-col ml-6 mt-7 max-w-3xl h-[600px]">

            <h1 className="text-2xl font-bold mb-4 text-white">
                # {currentChat?.name || "Loading..."}
            </h1>

            {/* Chat messages container */}
            <div className="flex-1 bg-gray-700 p-4 rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"> 
           {/* <ChatView channel={currentChat}/> */}
           <div className="chat-container">
            {currentMessages.map((m) => (
                m.senderUsername === userData.username ? (
                    <div key={m.id} className="chat chat-end mb-4">
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="User avatar"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                />
                            </div>
                        </div>
                        <div className="chat-header">
                            {m.senderUsername}
                            <time className="text-xs opacity-50">
                                {new Date(m.createdOn).toLocaleString()}
                            </time>
                        </div>
                        <div className="chat-bubble">{m.message}</div>
                        {/* <div className="chat-footer opacity-50">Delivered</div> */}
                    </div>
                ) : (
                    <div key={m.id} className="chat chat-start">
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="User avatar"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                />
                            </div>
                        </div>
                        <div className="chat-header">
                            {m.senderUsername}
                            <time className="text-xs opacity-50">
                                {new Date(m.createdOn).toLocaleString()}
                            </time>
                        </div>
                        <div className="chat-bubble">{m.message}</div>
                        {/* <div className="chat-footer opacity-50">Delivered</div> */}

                        
                    </div>
                )
            ))}
        </div>
            </div>
            {/* Input area */}
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
                        className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out"
                    >
                        Send
                    </button>
                </div>
            </form>
            </div>
       
    );

}

Chat.propTypes = {
    channel: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
};



//   {/* Example received message */}
//   <div className="chat chat-start">
//   <div className="chat-image avatar">
//       <div className="w-10 rounded-full">
//           <img
//               alt="Tailwind CSS chat bubble component"
//               src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
//           />
//       </div>
//   </div>
//   <div className="chat-header">
//       Obi-Wan Kenobi
//       <time className="text-xs opacity-50">12:45</time>
//   </div>
//   <div className="chat-bubble">You were the Chosen One!</div>
//   <div className="chat-footer opacity-50">Delivered</div>
// </div>

// <div className="chat chat-end">
//   <div className="chat-image avatar">
//       <div className="w-10 rounded-full">
//           <img
//               alt="Tailwind CSS chat bubble component"
//               src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
//           />
//       </div>
//   </div>
//   <div className="chat-header">
//       Anakin
//       <time className="text-xs opacity-50">12:46</time>
//   </div>
//   <div className="chat-bubble">I hate you!</div>
//   <div className="chat-footer opacity-50">Seen at 12:46</div>
// </div>

// {/* More conversation to trigger scroll */}
// <div className="chat chat-start">
//   <div className="chat-image avatar">
//       <div className="w-10 rounded-full">
//           <img
//               alt="Tailwind CSS chat bubble component"
//               src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
//           />
//       </div>
//   </div>
//   <div className="chat-header">
//       Obi-Wan Kenobi
//       <time className="text-xs opacity-50">12:47</time>
//   </div>
//   <div className="chat-bubble">
//       You were meant to bring balance to the Force, not leave it in darkness! You were my brother, Anakin!
//   </div>
//   <div className="chat-footer opacity-50">Delivered</div>
// </div>

// <div className="chat chat-end">
//   <div className="chat-image avatar">
//       <div className="w-10 rounded-full">
//           <img
//               alt="Tailwind CSS chat bubble component"
//               src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
//           />
//       </div>
//   </div>
//   <div className="chat-header">
//       Anakin
//       <time className="text-xs opacity-50">12:48</time>
//   </div>
//   <div className="chat-bubble">
//       I should have known the Jedi were plotting to take over! You underestimate my power, Obi-Wan.
//       Don't lecture me, Obi-Wan! I see through the lies of the Jedi. I do not fear the dark side as you do.
//   </div>
//   <div className="chat-footer opacity-50">Seen at 12:48</div>
// </div>

// <div className="chat chat-start">
//   <div className="chat-image avatar">
//       <div className="w-10 rounded-full">
//           <img
//               alt="Tailwind CSS chat bubble component"
//               src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
//           />
//       </div>
//   </div>
//   <div className="chat-header">
//       Obi-Wan Kenobi
//       <time className="text-xs opacity-50">12:49</time>
//   </div>
//   <div className="chat-bubble">
//       The dark side is not stronger, Anakin. It only leads to suffering. Look at yourself! Look at what you've become.
//       This isn't you. This is not the way. You were supposed to destroy the Sith, not join them!
//   </div>
//   <div className="chat-footer opacity-50">Delivered</div>
// </div>

// <div className="chat chat-end">
//   <div className="chat-image avatar">
//       <div className="w-10 rounded-full">
//           <img
//               alt="Tailwind CSS chat bubble component"
//               src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
//           />
//       </div>
//   </div>
//   <div className="chat-header">
//       Anakin
//       <time className="text-xs opacity-50">12:50</time>
//   </div>
//   <div className="chat-bubble">
//       From my point of view, the Jedi are evil! You will not stop me, Obi-Wan. The power of the dark side will set me free.
//       I will bring peace, justice, and security to my new empire!
//   </div>
//   <div className="chat-footer opacity-50">Seen at 12:50</div>
// </div>

// <div className="chat chat-start">
//   <div className="chat-image avatar">
//       <div className="w-10 rounded-full">
//           <img
//               alt="Tailwind CSS chat bubble component"
//               src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
//           />
//       </div>
//   </div>
//   <div className="chat-header">
//       Obi-Wan Kenobi
//       <time className="text-xs opacity-50">12:51</time>
//   </div>
//   <div className="chat-bubble">
//       Then you are lost, Anakin. I will do what I must, even if it means facing you in battle.
//       I will not let you continue down this path of destruction.
//   </div>
//   <div className="chat-footer opacity-50">Delivered</div>
// </div>

// <div className="chat chat-end">
//   <div className="chat-image avatar">
//       <div className="w-10 rounded-full">
//           <img
//               alt="Tailwind CSS chat bubble component"
//               src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
//           />
//       </div>
//   </div>
//   <div className="chat-header">
//       Anakin
//       <time className="text-xs opacity-50">12:52</time>
//   </div>
//   <div className="chat-bubble">
//       If you're not with me, then you're my enemy. Prepare yourself, Obi-Wan.
//       You will not stand in my way any longer. The time for the Jedi is over.
//   </div>
//   <div className="chat-footer opacity-50">Seen at 12:52</div>
// </div>
// </div>