import { get, push, ref, update, remove } from "firebase/database";
import { db } from "../config/firebase-config";

export const addUserMessage = async (channelId, username, message) => {
    const timestamp = new Date().getTime();
  
    await update(ref(db), {
      [`users/${username}/messages/${channelId}/${timestamp}`]: {
        content: message,
        timestamp: timestamp,
      }
    });
  };
export const createDirectMessage = async (user1, user2) => {
    const directMessage = {
        participants: [user1, user2],
        createdOn: new Date().toString()
    };
    const result = await push(ref(db, 'directMessages'), directMessage);
    const id = result.key;

    await update(ref(db), {
        [`directMessages/${id}/id`]: id,
        [`directMessages/${id}/participants`]: [user1, user2],
    });
    return id;
};

export const getUserDirectMessages = async (username) => {
    const snapshot = await get(ref(db, `users/${username}/directMessages`));
    return snapshot.exists() ? Object.keys(snapshot.val()) : [];
};

export const addUserToDirectMessages = async (directMessages, username) => {
    try {
        await Promise.all(directMessages.map(async (dm) => {
            await update(ref(db), {
                [`directMessages/${dm}/participants`]: [username],
                [`users/${username}/directMessages/${dm}`]: new Date().getTime(),
            });
        }));
    } catch (error) {
        console.error("Error adding user to direct messages:", error);
        throw error;
    }
};


export const deleteDirectMessageById = async (directMessageId) => {
    try {
        const directMessageSnapshot = await get(ref(db, `directMessages/${directMessageId}`));
        const directMessageData = directMessageSnapshot.val();

        if (!directMessageData) {
            throw new Error("Direct message not found");
        }

        const participants = directMessageData.participants ? directMessageData.participants : [];

        await remove(ref(db, `directMessages/${directMessageId}`));

        const updates = {};
        participants.forEach((participant) => {
            updates[`users/${participant}/directMessages/${directMessageId}`] = null;
        });

        await update(ref(db), updates);

        console.log(`Direct message with ID ${directMessageId} and associated data has been deleted successfully.`);
    } catch (error) {
        console.error("Error deleting direct message:", error);
        throw error;
    }
};

export const getDirectMessagesInfoById = async (directMessages) => {
    try {
        const promises = directMessages.map(async (id) => {
            const snapshot = await get(ref(db, `directMessages/${id}`));
            return snapshot.val();
        });
        const filteredDirectMessages = await Promise.all(promises);
        return filteredDirectMessages;
    } catch (error) {
        console.error("Error fetching direct messages information:", error);
        throw error;
    }
};

export const getDirectMessageMembersByID = async (directMessageId) => {
    try {
        const directMessageSnapshot = await get(ref(db, `directMessages/${directMessageId}/participants`));
        if (directMessageSnapshot.exists()) {
            return directMessageSnapshot.val();
        } else {
            console.warn('No participants found for this direct message.');
            return [];
        }
    } catch (error) {
        console.error("Error fetching direct message participants:", error);
        throw error;
    }
};

// Leave Direct Message
export const leaveDirectMessage = async (username, directMessageId) => {
    try {
        const directMessageParticipantsRef = ref(db, `directMessages/${directMessageId}/participants`);
        const directMessageSnapshot = await get(directMessageParticipantsRef);
        const participants = directMessageSnapshot.val() || [];

        if (participants.includes(username)) {
            const updatedParticipants = participants.filter(participant => participant !== username);
            
            if (updatedParticipants.length === 0) {
                await deleteDirectMessageById(directMessageId);
            } else {
                await update(ref(db, `directMessages/${directMessageId}`), {
                    participants: updatedParticipants
                });
            }

            const userDirectMessageRef = ref(db, `users/${username}/directMessages/${directMessageId}`);
            await remove(userDirectMessageRef);

            console.log(`User ${username} has left the direct message ${directMessageId}`);
        } else {
            console.warn(`User ${username} is not a participant of direct message ${directMessageId}`);
        }
    } catch (error) {
        console.error(`Failed to leave the direct message ${directMessageId}:`, error);
        throw error;
    }
};