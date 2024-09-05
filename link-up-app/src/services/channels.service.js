import { get, push, ref, update, remove } from "firebase/database";
import { db } from "../config/firebase-config";

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

export const getUserChannels = async (username) => {
    const snapshot = await get(ref(db, `users/${username}/channels`));
    return Object.keys(snapshot.val());
}
// const ch = await getUserChannels('vankata')

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

        console.log(`Channel with ID ${channelId} and associated data has been deleted successfully.`);
    } catch (error) {
        console.error("Error deleting channel:", error);
        throw error;
    }
};

export const getChannelsInfoById = async (channels) => {

    // const snapshot = await get(ref(db, `channels/-O4ygojej9sUZgv7N7w6`));
    // console.log(snapshot.val());
    try {
        const promises = channels.map(async (id) => {
            console.log(id);

            const snapshot = await get(ref(db, `channels/${id}`));
            console.log(snapshot.val());

            return snapshot.val();
        });
        const filteredChannels = await Promise.all(promises);
        return filteredChannels;

    } catch (error) {
        console.error("Error fetching channels information:", error);
        throw error;
    }
};

export const getChannelsMembersByID = async (channelId) => {
    try {
        const channelMembersSnapshot = await get(ref(db, `channels/${channelId}/members`));
        if (channelMembersSnapshot.exists()) {
            return Object.keys(channelMembersSnapshot.val());
        } else {
            console.warn('No members found for this channel.');
            return [];
        }
    } catch (error) {
        console.error("Error fetching channel members:", error);
        throw error;
    }
};

export const leaveChannel = async (username, channelId) => {

    try {

        const channelMemberRef = ref(db, `channels/${channelId}/members/${username}`);
        await remove(channelMemberRef);

        const userChannelRef = ref(db, `users/${username}/channels/${channelId}`);
        await remove(userChannelRef);
        console.log(`User ${username} has left the channel ${channelId}`);
    } catch (error) {
        console.error(`Failed to leave the channel ${channelId}:`, error);
        throw error;
    }
};
