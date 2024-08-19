import { push, ref, update } from "firebase/database";
import { db } from "../config/firebase-config";

export const createTeam = async (name) => {
    const team = { name };
    const result = await push(ref(db, 'teams'), team);
    const id = result.key;
    console.log('created team', id);

    // await update(ref(db), {
    //   [`teams/${id}/id`]: id,
    // });
    return id;
};


export const teamUserOwner = async (teamId, username) => {
    const teamUserOwnership = { teamId, username };
    await push(ref(db, 'teams_Users_Ownership'), teamUserOwnership);
    // const id = result.key;
}