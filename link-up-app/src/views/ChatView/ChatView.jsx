import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../state/app.context";
import { getIdsOfMessages, getMessageInfo } from "../../services/chat.service";

export default function ChatView({ currentMessages }) {
    const { userData } = useContext(AppContext);
    const [currentChat, setCurrentChat] = useState(channel || location.state?.channel);
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


   
    return (
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
    );
}