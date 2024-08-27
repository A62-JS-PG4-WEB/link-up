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
    try {
        const promises = channels.map(async (id) => {
            const snapshot = await get(ref(db, `channels/${id}`));
            return snapshot.val();
        });
        const filteredChannels = await Promise.all(promises);
        return filteredChannels;

    } catch (error) {
        console.error("Error fetching channels information:", error);
        throw error;
    }
};