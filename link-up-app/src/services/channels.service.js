import { get, push, ref, update, remove } from "firebase/database";
import { db } from "../config/firebase-config";
import { addUserChannel } from "./users.service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

export const addUserToTeamChannels = async (channelsT, username) => {

    try {
        channelsT.map(async (ch) => {
            await addUserChannel(ch, username);
            await update(ref(db), {
                [`channels/${ch}/members/${username}`]: new Date().getTime(),
            })
        })
    } catch (error) {
        toast.error("Error deleting channel:", error);
        throw error;
    }
}

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
        toast.error("Error deleting channel:", error);
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
        toast.error("Error fetching channels information:", error);
        throw error;
    }
};

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
        toast.error("Error fetching channel members:", error);
        throw error;
    }
};

export const leaveChannel = async (username, channelId) => {

    try {

        const channelMemberRef = ref(db, `channels/${channelId}/members/${username}`);
        await remove(channelMemberRef);

        const userChannelRef = ref(db, `users/${username}/channels/${channelId}`);
        await remove(userChannelRef);
        toast.warn(`User ${username} has left the channel ${channelId}`);
    } catch (error) {
        toast.error(`Failed to leave the channel ${channelId}:`, error);
        throw error;
    }
};
