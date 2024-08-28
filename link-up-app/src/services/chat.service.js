import { push, ref, set, update } from "firebase/database";
import { db } from "../config/firebase-config";


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
        console.error("Error setting message status for members:", error);
        throw error;
    }
}