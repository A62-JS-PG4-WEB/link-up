import { get, push, ref, set, update } from "firebase/database";
import { db } from "../config/firebase-config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const sendMessage = async (message) => {

    const result = await push(ref(db, 'messages'), message);
    const id = result.key;
    await update(ref(db), {
        [`messages/${id}/id`]: id,
    });

    return id;
};


export const sentMessageSaveInChannels = async (channelId, messageId) => {

    await update(ref(db), {
        [`channels/${channelId}/messages/${messageId}`]: new Date().getTime(),
    });
};

export const setMsgStatusForEachUser = async (users, messageId, status = 'unread') => {
    try {
        const promises = users.map(async (username) => {
            await set(ref(db, `messagesUsersStatuses/${messageId}/${username}`), status);
        });
        await Promise.all(promises);

    } catch (error) {
        toast.error(`Error setting message status for members: ${error}`);
        throw error;
    }
};


// export const getIdsOfMessages = async (channelId) => {
//     const channelMessagesSnapshot = await get(ref(db, `channels/${channelId}/messages`));
//     if (channelMessagesSnapshot.exists()) {
//         return Object.keys(channelMessagesSnapshot.val());
//     } else {
//         toast.warn('No messages found for this channel.');
//         return [];
//     }

// };


export const getMessageInfo = async (messageIds) => {
    try {
        const promises = messageIds.map(async (id) => {
            const snapshot = await get(ref(db, `messages/${id}`));
            return snapshot.val();
        });
        const filteredTeams = await Promise.all(promises);
        return filteredTeams;

    } catch (error) {
        toast.error(`Error getting message info: ${error}`);
        throw error;
    }
};