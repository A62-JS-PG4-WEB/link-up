import { equalTo, get, orderByChild, orderByValue, push, query, ref, update } from "firebase/database";
import { db } from "../config/firebase-config";

export const createChannel = async (name, owner, member, teamID) => {
console.log(teamID);

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
    // console.log(snapshot.val());
 
     return Object.keys(snapshot.val());
}

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