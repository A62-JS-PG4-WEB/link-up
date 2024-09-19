import { get, push, ref, update, remove, query, orderByChild, equalTo } from "firebase/database";
import { db } from "../config/firebase-config";
import { addUserChannel } from "./users.service";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Creates a new channel and adds the owner and initial member to it.
 * 
 * @async
 * @param {string} name - The name of the channel.
 * @param {string} owner - The owner of the channel.
 * @param {string} member - The initial member of the channel.
 * @param {string} teamID - The ID of the team to which the channel belongs.
 * @returns {Promise<string>} A promise that resolves to the ID of the newly created channel.
 * @throws Will throw an error if the channel creation fails.
 */
export const createChannel = async (name, owner, member, teamID) => {

    const channel = { name, owner, createdOn: new Date().toString() };
    const result = await push(ref(db, 'channels'), channel);
    const id = result.key;

    await update(ref(db), {
        [`channels/${id}/members/${member}`]: new Date().getTime(),
        [`channels/${id}/id`]: id,
        [`channels/${id}/team`]: teamID,
    });
    return id;
};

/**
 * Fetches the list of channel IDs a user belongs to.
 * 
 * @async
 * @param {string} username - The username of the user.
 * @returns {Promise<string[]>} A promise that resolves to an array of channel IDs.
 * @throws Will throw an error if the user channels cannot be retrieved.
 */
export const getUserChannels = async (username) => {
    const snapshot = await get(ref(db, `users/${username}/channels`));
    return Object.keys(snapshot.val());
}

/**
 * Adds a user to an existing channel.
 * 
 * @async
 * @param {string} channelId - The ID of the channel.
 * @param {string} username - The username of the user to add to the channel.
 * @returns {Promise<void>}
 * @throws Will throw an error if adding the user to the channel fails.
 */
export const addUserToChannel = async (channelId, username) => {
    try {
        await addUserChannel(channelId, username);
        await update(ref(db), {
            [`channels/${channelId}/members/${username}`]: new Date().getTime(),
        })
    } catch (error) {
        toast.error(`Error deleting channel: ${error}`);
        throw error;
    }
};

/**
 * Deletes a channel by its ID and removes it from the team and all members.
 * 
 * @async
 * @param {string} channelId - The ID of the channel to delete.
 * @param {string} teamID - The ID of the team to which the channel belongs.
 * @returns {Promise<void>}
 * @throws Will throw an error if channel deletion fails.
 */
export const deleteChannelById = async (channelId, teamID) => {
    try {
        const channelSnapshot = await get(ref(db, `channels/${channelId}`));
        const channelData = channelSnapshot.val();

        if (!channelData) {
            throw new Error("Channel not found");
        }

        const members = channelData.members ? Object.keys(channelData.members) : [];

        await remove(ref(db, `channels/${channelId}`));
        await remove(ref(db, `teams/${teamID}/channels/${channelId}`));

        const updates = {};
        members.forEach((member) => {
            updates[`users/${member}/channels/${channelId}`] = null;
        });

        await update(ref(db), updates);

    } catch (error) {
        toast.error(`Error deleting channel: ${error}`);
        throw error;
    }
};

/**
 * Fetches information about multiple channels by their IDs.
 * 
 * @async
 * @param {string[]} channels - An array of channel IDs.
 * @returns {Promise<Object[]>} A promise that resolves to an array of channel objects.
 * @throws Will throw an error if fetching channel information fails.
 */
export const getChannelsInfoById = async (channels) => {

    try {
        const promises = channels.map(async (id) => {

            const snapshot = await get(ref(db, `channels/${id}`));

            return snapshot.val();
        });
        const filteredChannels = await Promise.all(promises);
        return filteredChannels;

    } catch (error) {
        toast.error(`Error fetching channels information: ${error}`);
        throw error;
    }
};


/**
 * Fetches the list of members in a channel by its ID.
 * 
 * @async
 * @param {string} channelId - The ID of the channel.
 * @returns {Promise<string[]>} A promise that resolves to an array of usernames.
 * @throws Will throw an error if fetching channel members fails.
 */
export const getChannelsMembersByID = async (channelId) => {
    try {
        const channelMembersSnapshot = await get(ref(db, `channels/${channelId}/members`));
        if (channelMembersSnapshot.exists()) {
            return Object.keys(channelMembersSnapshot.val());
        } else {
            toast.warn('No members found for this channel.');
            return [];
        }
    } catch (error) {
        toast.error(`Error fetching channel members: ${error}`);
        throw error;
    }
};

/**
 * Removes a user from a channel.
 * 
 * @async
 * @param {string} username - The username of the user to remove.
 * @param {string} channelId - The ID of the channel.
 * @param {string} channelName - The name of the channel.
 * @returns {Promise<void>}
 * @throws Will throw an error if the user cannot leave the channel.
 */
export const leaveChannel = async (username, channelId, channelName) => {

    try {
        const channelMemberRef = ref(db, `channels/${channelId}/members/${username}`);
        await remove(channelMemberRef);

        const userChannelRef = ref(db, `users/${username}/channels/${channelId}`);
        await remove(userChannelRef);
        toast.warn(`You left the channel #${channelName}`);
    } catch (error) {
        toast.error(`Failed to leave the channel ${channelName}:`, error);
        throw error;
    }
};

/**
 * Searches for channels by name within a specific team.
 * 
 * @async
 * @param {string} search - The search term for the channel name.
 * @param {string} teamId - The ID of the team to search channels within.
 * @returns {Promise<Object[]>} A promise that resolves to an array of channel objects that match the search term.
 * @throws Will throw an error if searching channels fails.
 */
export const getChannelByName = async (search, teamId) => {
    try {
        const snapshot = await get(query(ref(db, 'channels'), orderByChild('team'), equalTo(teamId)));
        if (!snapshot.exists()) return [];

        const allChannels = Object.values(snapshot.val())

        if (allChannels) {
            return allChannels.filter(ch => ch.name.toLowerCase().includes(search.toLowerCase()));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error searching channels by name:", error);
        throw error;
    }
};

/**
 * Capitalizes the first letter of each word in a string.
 * 
 * @param {string} name - The string to capitalize.
 * @returns {string} The string with the first letter of each word capitalized.
 */
export const capitalizeFirstLetter = (name) => {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};
