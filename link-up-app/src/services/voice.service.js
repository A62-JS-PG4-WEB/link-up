import { ref, get, set, remove, push, update } from "firebase/database";
import { db } from '../config/firebase-config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const createVoiceChannel = async (name, owner, teamID) => {
    const voiceChannel = { name, owner, createdOn: new Date().toString() };
    const result = await push(ref(db, 'voiceChannels'), voiceChannel);
    const id = result.key;

    await update(ref(db), {
        [`voiceChannels/${id}/id`]: id,
        [`voiceChannels/${id}/team`]: teamID,
    });

    return id;
};

export const getUserVoiceChannels = async (username) => {
    const snapshot = await get(ref(db, `users/${username}/voiceChannels`));
    return snapshot.val() ? Object.keys(snapshot.val()) : [];
};

export const getVoiceChannelsInfoById = async (channelIds) => {
    try {
        const promises = channelIds.map(async (id) => {
            const snapshot = await get(ref(db, `voiceChannels/${id}`));
            return snapshot.val();
        });
        const channels = await Promise.all(promises);
        return channels;
    } catch (error) {
        toast.error(`Error fetching voice channels information: ${error}`);
        throw error;
    }
};

export const deleteVoiceChannelById = async (channelId) => {
    try {
        await remove(ref(db, `voiceChannels/${channelId}`));
    } catch (error) {
        toast.error(`Error deleting voice channel: ${error}`);
        throw error;
    }
};
