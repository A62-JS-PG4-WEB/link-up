import { get, push, ref, remove, set, update } from "firebase/database";
import { db } from "../config/firebase-config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Sends a message by pushing it to the 'messages' node in Firebase.
 * 
 * @async
 * @param {Object} message - The message object containing details such as content, sender, etc.
 * @returns {Promise<string>} A promise that resolves to the message ID.
 * @throws Will throw an error if the message cannot be sent.
 */
export const sendMessage = async (message) => {
    const result = await push(ref(db, 'messages'), message);
    const id = result.key;
    await update(ref(db), {
        [`messages/${id}/id`]: id,
    });
    return id;
};

/**
 * Saves a message in a specific channel by adding the message ID to the channel's 'messages' node.
 * 
 * @async
 * @param {string} channelId - The ID of the channel.
 * @param {string} messageId - The ID of the message to save in the channel.
 * @returns {Promise<void>}
 * @throws Will throw an error if the message cannot be saved in the channel.
 */
export const sentMessageSaveInChannels = async (channelId, messageId) => {
    await update(ref(db), {
        [`channels/${channelId}/messages/${messageId}`]: new Date().getTime(),
    });
};

/**
 * Retrieves information about multiple messages by their IDs.
 * 
 * @async
 * @param {string[]} messageIds - An array of message IDs.
 * @returns {Promise<Object[]>} A promise that resolves to an array of message objects.
 * @throws Will throw an error if the messages cannot be retrieved.
 */
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

/**
 * Deletes a message from both the 'channels' node and the 'messages' node in Firebase.
 * 
 * @async
 * @param {string} username - The username of the user performing the deletion.
 * @param {string} chatID - The ID of the chat (channel) containing the message.
 * @param {string} messageId - The ID of the message to delete.
 * @returns {Promise<void>}
 * @throws Will throw an error if the message cannot be deleted.
 */
export const deleteMessage = async (username, chatID, messageId) => {
    await remove(ref(db, `channels/${chatID}/messages/${messageId}`));
    await remove(ref(db, `messages/${messageId}`));
    await update(ref(db), {
        [`users/${username}/channels/${chatID}/lastMessage`]: null,
      })
};

/**
 * Updates the content of a message in the 'messages' node.
 * 
 * @async
 * @param {string} messageId - The ID of the message to update.
 * @param {string} content - The new content of the message.
 * @returns {Promise<void>}
 * @throws Will throw an error if the message cannot be updated.
 */
export const updateMessage = async ( messageId, content) => {
    await update(ref(db), {
        [`messages/${messageId}/message`]: content,
      })
};